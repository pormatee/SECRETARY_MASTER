// Idea Bank Sync V1.2 — Cloudflare Pages Function (same-origin API)
// IMPORTANT: Cloudflare Access application MUST cover the complete deployment URL.
// This function additionally verifies signed Access JWTs; missing configuration fails closed.
const JSON_HEADERS = {
  'Cache-Control': 'no-store, private',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Vary': 'Cookie',
};
const respond = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
const fail = (code, status = 400) => respond({ ok: false, code }, status);
const MAX_BYTES = 1024 * 1024; // 1 MiB bank document
const MAX_IDEAS = 4000;
function decodeBase64url(s) {
  if (!/^[\w-]+$/.test(s)) throw Error('bad b64url');
  const raw = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - s.length % 4) % 4));
  return Uint8Array.from(raw, x => x.charCodeAt(0));
}
function decodePart(s) { return JSON.parse(new TextDecoder().decode(decodeBase64url(s))); }
function safeTeamDomain(s) {
  try { const url = new URL(s); return url.protocol === 'https:' && url.hostname.endsWith('.cloudflareaccess.com') && url.pathname === '/' && !url.search && !url.hash ? url.origin : null; }
  catch { return null; }
}
export async function verifyAccess(request, env, fetcher = fetch) {
  const domain = safeTeamDomain(env.ACCESS_TEAM_DOMAIN || '');
  const expectedAud = String(env.ACCESS_AUD || '');
  const allowed = String(env.ALLOWED_EMAIL || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  if (!domain || !expectedAud || !allowed.length) return { ok: false, code: 'ACCESS_NOT_CONFIGURED', status: 503 };
  const token = request.headers.get('Cf-Access-Jwt-Assertion') || '';
  const parts = token.split('.');
  if (parts.length !== 3 || parts.some(p => !p)) return { ok: false, code: 'ACCESS_REQUIRED', status: 401 };
  try {
    const header = decodePart(parts[0]), payload = decodePart(parts[1]);
    if (header.alg !== 'RS256' || typeof header.kid !== 'string' || header.kid.length > 200) throw Error('bad header');
    const now = Math.floor(Date.now() / 1000);
    if (payload.iss !== domain || !(Array.isArray(payload.aud) ? payload.aud.includes(expectedAud) : payload.aud === expectedAud) ||
      typeof payload.exp !== 'number' || payload.exp <= now ||
      (typeof payload.nbf === 'number' && payload.nbf > now + 60) ||
      (typeof payload.iat === 'number' && payload.iat > now + 60) ||
      !allowed.includes(String(payload.email || '').toLowerCase())) throw Error('bad claims');
    const certs = await fetcher(domain + '/cdn-cgi/access/certs', { headers: { Accept: 'application/json' } });
    if (!certs.ok) throw Error('cert fetch');
    const jwks = await certs.json();
    const keyData = Array.isArray(jwks.keys) ? jwks.keys.find(k => k.kid === header.kid && k.kty === 'RSA' && (!k.alg || k.alg === 'RS256') && (!k.use || k.use === 'sig')) : null;
    if (!keyData) throw Error('unknown kid');
    const key = await crypto.subtle.importKey('jwk', keyData, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const verified = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decodeBase64url(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
    if (!verified) throw Error('signature invalid');
    return { ok: true, email: payload.email.toLowerCase() };
  } catch { return { ok: false, code: 'ACCESS_DENIED', status: 403 }; }
}
function validateDocument(document) {
  if (!document || typeof document !== 'object' || Array.isArray(document) ||
      !Array.isArray(document.ideas) || !Array.isArray(document.themes) ||
      document.ideas.length > MAX_IDEAS || document.themes.length > 100) return false;
  const keys = new Set();
  for (const idea of document.ideas) {
    if (!idea || typeof idea !== 'object' || Array.isArray(idea) ||
      typeof idea.id !== 'string' || !idea.id.trim() || idea.id.length > 90 ||
      typeof idea.name !== 'string' || !idea.name.trim() || idea.name.length > 300 ||
      keys.has(idea.id)) return false;
    keys.add(idea.id);
  }
  const themeIds = new Set();
  for (const theme of document.themes) {
    if (!theme || typeof theme !== 'object' || Array.isArray(theme) ||
       typeof theme.id !== 'string' || !theme.id.trim() || theme.id.length > 90 ||
       typeof theme.name !== 'string' || !theme.name.trim() || theme.name.length > 300 || themeIds.has(theme.id)) return false;
    themeIds.add(theme.id);
  }
  return true;
}
async function getCurrent(db) {
  return await db.prepare('SELECT revision, doc, updated_at FROM idea_bank WHERE id = ?').bind('primary').first();
}
export async function onRequest(context) {
  const { request, env } = context;
  const auth = await verifyAccess(request, env);
  if (!auth.ok) return fail(auth.code, auth.status);
  if (!env.DB || typeof env.DB.prepare !== 'function') return fail('DATABASE_NOT_CONFIGURED', 503);
  if (!['GET', 'PUT'].includes(request.method)) return fail('METHOD_NOT_ALLOWED', 405);
  try {
    if (request.method === 'GET') {
      const row = await getCurrent(env.DB);
      return respond({ ok: true, revision: row?.revision || 0, document: row ? JSON.parse(row.doc) : null, updatedAt: row?.updated_at || null });
    }
    const origin = request.headers.get('Origin');
    if (!origin || origin !== new URL(request.url).origin) return fail('ORIGIN_DENIED', 403);
    if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') || '')) return fail('UNSUPPORTED_MEDIA_TYPE', 415);
    if (Number(request.headers.get('content-length') || 0) > MAX_BYTES + 400) return fail('PAYLOAD_TOO_LARGE', 413);
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_BYTES + 400) return fail('PAYLOAD_TOO_LARGE', 413);
    const input = JSON.parse(text);
    const base = input.baseRevision;
    const document = input.document;
    if (!Number.isSafeInteger(base) || base < 0 || !validateDocument(document)) return fail('INVALID_DOCUMENT', 422);
    const raw = JSON.stringify(document);
    if (new TextEncoder().encode(raw).byteLength > MAX_BYTES) return fail('PAYLOAD_TOO_LARGE', 413);
    const timestamp = new Date().toISOString();
    let changed = 0;
    if (base === 0) {
      const result = await env.DB.prepare('INSERT OR IGNORE INTO idea_bank (id, revision, doc, updated_at) VALUES (?, 1, ?, ?)').bind('primary', raw, timestamp).run();
      changed = result.meta?.changes || 0;
    } else {
      const result = await env.DB.prepare('UPDATE idea_bank SET revision = revision + 1, doc = ?, updated_at = ? WHERE id = ? AND revision = ?').bind(raw, timestamp, 'primary', base).run();
      changed = result.meta?.changes || 0;
    }
    if (changed !== 1) {
      const current = await getCurrent(env.DB);
      return respond({ ok: false, code: 'REVISION_CONFLICT', revision: current?.revision || 0, document: current ? JSON.parse(current.doc) : null }, 409);
    }
    const revision = base + 1;
    let historySaved = true;
    try {
      await env.DB.prepare('INSERT INTO idea_history (revision, doc, changed_at) VALUES (?, ?, ?)').bind(revision, raw, timestamp).run();
      await env.DB.prepare('DELETE FROM idea_history WHERE revision NOT IN (SELECT revision FROM idea_history ORDER BY revision DESC LIMIT 30)').run();
    } catch { historySaved = false; }
    return respond({ ok: true, revision, updatedAt: timestamp, historySaved });
  } catch (e) {
    if (e instanceof SyntaxError) return fail('INVALID_JSON', 400);
    return fail('DATABASE_ERROR', 503);
  }
}
