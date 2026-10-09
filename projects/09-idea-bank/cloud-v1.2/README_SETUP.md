# Idea Bank Private Cloud V1.2 — Setup & Acceptance

**State:** CODE READY / CLOUD DEPLOY UNVERIFIED / REAL ANDROID MULTI-DEVICE GATE UNVERIFIED.

## Scope and backwards compatibility
- V1.1 remains at `projects/09-idea-bank/web-v1.1/` **untouched**. V1 dashboard and master Markdown are untouched.
- V1.2 source is a new folder: `projects/09-idea-bank/cloud-v1.2/`.
- The public GitHub repo contains ONLY the empty-shell HTML, Pages Functions, D1 schema, tests and instructions. No imported idea content, JWT, Cloudflare account settings, credentials or personal data should be committed.
- Original Idea Bank data already committed in the public repository in an earlier version remains public. V1.2 cannot make previously public information private.

## Architecture

```
Browser Android / PC
        |
Cloudflare Access (production + previews, allow-list identity)
        |
Cloudflare Pages V1.2 (same origin)
    | static public/index.html (no ideas embedded)
    | /api/sync + /api/history (JWT verification)
        |
Cloudflare D1 binding named DB
    | idea_bank (one latest document, compare-and-swap revision)
    | idea_history (30 recent snapshots)
```

Browser keeps local cache, writes to API after changes, and checks Cloud about every 30 seconds while visible. When offline or API not ready, the editor still saves locally, but DOES NOT claim cloud success. When two devices write against the same revision, second request returns HTTP 409; local changes remain and require explicit conflict resolution. The client offers JSON backup before replacing anything.

**No end-to-end encryption:** Cloudflare D1 stores JSON in the provider account, rather than ciphertext encrypted with user-held keys. Cloudflare Access and API verification restrict access, but account administrators/provider operations remain within the trust boundary.

## Deploy (Cloudflare dashboard, no secrets in GitHub)

1. Push the new folder with `push-v1.2.sh` using Termux. This does not deploy the web service by itself.
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git. Choose `pormatee/SECRETARY_MASTER`, production branch `main`. Set project **Root directory** to `projects/09-idea-bank/cloud-v1.2`; Build command `exit 0`; Build output directory `public`. Do not deploy under existing V1.1 path.
3. In Cloudflare Workers & Pages → D1, create a new DB `idea-bank-private-v12`. Run all SQL from `migrations/0001_init.sql` in the D1 console. Alternatively, run with Wrangler after configuring the account (not required on Android).
4. Cloudflare Pages project → Settings → Bindings → Production → Add **D1 database**, variable/binding name exactly `DB`, choose `idea-bank-private-v12`. Redeploy when bindings change. DO NOT bind a production database to public or unprotected preview deployments.
5. Configure Cloudflare Zero Trust → Access policies for both the production `*.pages.dev` domain and preview domains, with an allow policy for the user's specific email address. **Important:** Turning on the Pages Preview Access policy alone does not protect the production `pages.dev` domain. Follow Cloudflare's known-issues instructions to protect both. Prefer disabling preview branch deployments if not needed.
   Docs: https://developers.cloudflare.com/pages/platform/known-issues/
6. From Zero Trust → Access → Applications → your production application → Additional settings, copy the **Application Audience (AUD) Tag**.
7. Pages project → Settings → Environment variables (Production), add:
   - `ACCESS_TEAM_DOMAIN` = `https://YOUR_TEAM.cloudflareaccess.com` (your actual team URL, https, no trailing path)
   - `ACCESS_AUD` = copied production Access AUD tag
   - `ALLOWED_EMAIL` = your verified login email, lowercase; comma-separated only for explicitly shared users
   - Keep these settings in Cloudflare, **not in Git**. `ACCESS_AUD` and team domain are configuration, not authentication secrets, but must match exactly; authentication proof is JWT signature.
8. Redeploy Production. Verify private/incognito browsing shows the Access login/deny page, NOT dashboard. Verify unauthenticated `/api/sync` can't return data. Log in via Access and verify dashboard says cloud ready.
9. **Migration:** Open V1.1 (on the device containing your edited ideas) → `สำรองข้อมูล` JSON. Open V1.2 on the same/other device after Access login → `นำเข้าไฟล์ JSON`. Confirm **24 ideas / 10 themes** and cloud revision ≥1. Do not upload the JSON into the public GitHub repository.
10. On a second device login with the same authorized identity → see 24/10 → add test idea → wait for synced green label → verify first device refreshes. Simulate simultaneous conflicting edits, verify HTTP 409 and local JSON backup. Check history before relying on it.

## Caution: Cloudflare Access production setup
- Cloudflare Pages Access for Preview is separate from protection for production `pages.dev`; test both. A custom domain needs its own matching Access application.
- JWT is validated inside API with RS256/WebCrypto, against your Access team JWKS, issuer, audience, expiration and ALLOWED_EMAIL. APIs fail closed if missing configuration.
- Do NOT attach data or secret variables to unrelated apps or repositories.
- V1.2 is one shared idea bank across authorized identities; it is not a multi-tenant service with isolated documents per person.

## Acceptance gates

- `PRE_GIT_AUDIT=PASS`: static, no seeds/secrets, paths scoped.
- `GIT_PUSH=PASS`: verify commit, remote HEAD and changed paths.
- `CLOUDFLARE_PAGES_DEPLOY=PASS`: real deployed `*.pages.dev` endpoint serves new V1.2 shell.
- `ACCESS_GATE=PASS`: production & previews require the expected authorized login; outsiders cannot call API.
- `D1_API_GATE=PASS`: first load, write, read, no-token 401/redirect, forged-token deny, conflict 409, history.
- `ANDROID_MULTI_DEVICE_GATE=PASS`: Android + 2nd device, import, add, sync, reload, offline queue, conflict recovery, backup.

No customer / private-data production use is approved until the last four gates are verified with real Cloudflare deployment.

## Restore policy

- Cloud snapshots: `GET /api/history` lists last 30 revisions; the History UI restores a chosen snapshot **as a new revision**, not an in-place DB rewind. The browser downloads a local JSON backup before restore.
- Export JSON manually regularly and store an extra backup outside the browser; the 30-snapshot ring is not equivalent to independently backed-up disaster recovery.
- If your browser shows conflict, export JSON before choosing to load the cloud version.
