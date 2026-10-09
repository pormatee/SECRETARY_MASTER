import { verifyAccess } from './sync.js';
export async function onRequest({ request, env }) {
  const headers = { 'Cache-Control': 'no-store, private', 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' };
  const reply = (body, status=200) => new Response(JSON.stringify(body), { status, headers });
  const auth = await verifyAccess(request, env);
  if (!auth.ok) return reply({ ok: false, code: auth.code }, auth.status);
  if (!env.DB) return reply({ ok: false, code: 'DATABASE_NOT_CONFIGURED' }, 503);
  if (request.method !== 'GET') return reply({ ok: false, code: 'METHOD_NOT_ALLOWED' }, 405);
  try {
    const revisionText = new URL(request.url).searchParams.get('revision');
    if (revisionText !== null) {
      if (!/^[1-9]\d{0,8}$/.test(revisionText)) return reply({ ok:false, code:'INVALID_REVISION' }, 400);
      const row = await env.DB.prepare('SELECT revision, doc, changed_at FROM idea_history WHERE revision=?').bind(Number(revisionText)).first();
      return row ? reply({ ok:true, revision:row.revision, document:JSON.parse(row.doc), changedAt:row.changed_at }) : reply({ ok:false, code:'NOT_FOUND' },404);
    }
    const rows=await env.DB.prepare('SELECT revision, changed_at FROM idea_history ORDER BY revision DESC LIMIT 30').all();
    return reply({ ok:true, versions:rows.results||[] });
  } catch { return reply({ ok:false, code:'DATABASE_ERROR' }, 503); }
}
