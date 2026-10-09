import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, createSign, webcrypto } from 'node:crypto';
import { onRequest, verifyAccess } from '../functions/api/sync.js';
import { onRequest as historyHandler } from '../functions/api/history.js';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const { privateKey, publicKey }=generateKeyPairSync('rsa',{modulusLength:2048});
const jwk=publicKey.export({format:'jwk'});jwk.kid='key1';jwk.alg='RS256';jwk.use='sig';
const domain='https://example.cloudflareaccess.com';
const envBase={ACCESS_TEAM_DOMAIN:domain,ACCESS_AUD:'only-my-app',ALLOWED_EMAIL:'owner@example.com'};
const originalFetch=globalThis.fetch;
globalThis.fetch=async url=>url===domain+'/cdn-cgi/access/certs'?new Response(JSON.stringify({keys:[jwk]}),{status:200}):new Response('',{status:404});
const b64=s=>Buffer.from(typeof s==='string'?s:JSON.stringify(s)).toString('base64url');
function jwt(p={}){const header=b64({alg:'RS256',kid:'key1',typ:'JWT'});const body=b64({iss:domain,aud:envBase.ACCESS_AUD,email:'owner@example.com',exp:Math.floor(Date.now()/1000)+3600,...p});const input=header+'.'+body;const signer=createSign('RSA-SHA256');signer.update(input);signer.end();return input+'.'+signer.sign(privateKey).toString('base64url')}
const doc={schema_version:2,ideas:[{id:'IDEA-01',name:'First idea'}],themes:[{id:'THEME-01',name:'Old theme'}]};
class MemoryD1{
 constructor(){this.bank=null;this.history=[]}
 prepare(sql){const parent=this;return {bind(...args){return Object.assign(this,{args})},async first(){if(sql.includes('FROM idea_bank'))return parent.bank?{...parent.bank}:null;if(sql.includes('FROM idea_history')){let x=parent.history.find(x=>x.revision===this.args[0]);return x?{...x}:null}throw Error('first '+sql)},async all(){if(sql.includes('FROM idea_history'))return {results:parent.history.map(x=>({revision:x.revision,changed_at:x.changed_at})).reverse()};throw Error('all '+sql)},async run(){if(sql.startsWith('INSERT OR IGNORE INTO idea_bank')){if(parent.bank)return{meta:{changes:0}};parent.bank={revision:1,doc:this.args[1],updated_at:this.args[2]};return{meta:{changes:1}}}if(sql.startsWith('UPDATE idea_bank')){if(!parent.bank||parent.bank.revision!==this.args[3])return {meta:{changes:0}};parent.bank={revision:parent.bank.revision+1,doc:this.args[0],updated_at:this.args[1]};return{meta:{changes:1}}}if(sql.startsWith('INSERT INTO idea_history')){parent.history.push({revision:this.args[0],doc:this.args[1],changed_at:this.args[2]});return {meta:{changes:1}}}if(sql.startsWith('DELETE FROM idea_history')){parent.history=parent.history.slice(-30);return{meta:{changes:1}}}throw Error('run '+sql)}}}
}
const req=(method='GET',body=null,token=jwt(),origin='https://my-bank.pages.dev',more={})=>new Request('https://my-bank.pages.dev/api/sync',{method,headers:{'Cf-Access-Jwt-Assertion':token,...(body?{'Origin':origin,'Content-Type':'application/json'}:{}),...more},body:body?JSON.stringify(body):undefined});
const context=(db,request)=>({env:{...envBase,DB:db},request});

test('deny without JWT and reject invalid signature, issuer, audience, expiry and identity',async()=>{
 const db=new MemoryD1();
 for(const token of ['',jwt({email:'intruder@example.com'}),jwt({iss:'https://wrong.cloudflareaccess.com'}),jwt({aud:'another-app'}),jwt({exp:1}),jwt().slice(0,-4)+'dead']){
  const r=await onRequest(context(db,req('GET',null,token)));
  assert.ok([401,403].includes(r.status),`unexpected ${r.status}`);
 }
});
test('fail closed when access configuration or DB missing',async()=>{
 const r=await onRequest({env:{DB:new MemoryD1()},request:req()});assert.equal(r.status,503);
 const noDb=await onRequest({env:envBase,request:req()});assert.equal(noDb.status,503);
});
test('initialize, update, same-revision conflict, GET newest and revision history',async()=>{
 const db=new MemoryD1();
 let r=await onRequest(context(db,req()));assert.equal((await r.json()).revision,0);
 r=await onRequest(context(db,req('PUT',{baseRevision:0,document:doc})));
 assert.equal(r.status,200);assert.equal((await r.json()).revision,1);
 const v2=structuredClone(doc);v2.ideas[0].name='Changed';
 r=await onRequest(context(db,req('PUT',{baseRevision:1,document:v2})));
 assert.equal((await r.json()).revision,2);
 r=await onRequest(context(db,req('PUT',{baseRevision:1,document:doc})));
 assert.equal(r.status,409);assert.equal((await r.json()).revision,2);
 r=await onRequest(context(db,req()));assert.equal((await r.json()).document.ideas[0].name,'Changed');
 r=await historyHandler(context(db,req('GET')));assert.equal((await r.json()).versions.length,2);
 r=await historyHandler(context(db,new Request('https://my-bank.pages.dev/api/history?revision=1',{headers:{'Cf-Access-Jwt-Assertion':jwt()}})));
 assert.equal((await r.json()).document.ideas[0].name,'First idea');
});
test('deny cross-site PUT, invalid payload and oversized document',async()=>{
 const db=new MemoryD1();
 let r=await onRequest(context(db,req('PUT',{baseRevision:0,document:doc},jwt(),'https://evil.test')));assert.equal(r.status,403);
 r=await onRequest(context(db,req('PUT',{baseRevision:0,document:{ideas:[{id:'a',name:'x'},{id:'a',name:'y'}],themes:[]}})));assert.equal(r.status,422);
 const large=structuredClone(doc);large.ideas=Array.from({length:3800},(_,i)=>({id:'IDEA-'+i,name:'Valid name',notes:'x'.repeat(350)}));
 r=await onRequest(context(db,req('PUT',{baseRevision:0,document:large})));
 assert.equal(r.status,413);
});
test('history requires verified JWT, and invalid revision blocked',async()=>{
 const db=new MemoryD1();
 let r=await historyHandler(context(db,new Request('https://my-bank.pages.dev/api/history')));assert.equal(r.status,401);
 r=await historyHandler(context(db,new Request('https://my-bank.pages.dev/api/history?revision=../1',{headers:{'Cf-Access-Jwt-Assertion':jwt()}})));assert.equal(r.status,400);
});
