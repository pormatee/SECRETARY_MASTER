# MEasyMate AI Hub V1

**Type:** Shared AI Provider Gateway / Infrastructure
**Status:** ACTIVE — PHASE 0 APPROVED / FROZEN
**Repository:** `pormatee/measymate-ai-hub`
**Default branch:** `main`

## Purpose
`MEasyMate Product → MEasyMate AI Hub → AI Provider`

The Hub brokers provider access. It is not the business-decision authority of products.

## Frozen Phase 0
- DeepSeek is the first provider.
- Provider API keys are Server Environment Secrets only.
- Public HTML/JS must not contain shared provider secrets.
- Products use a provider-neutral contract / logical profile.
- Authentication required.
- `product_id` / `client_id` included.
- Rate limit / quota required.
- Safe errors required.
- Usage tracking required.
- V1 is text → text, non-streaming.
- No automatic provider fallback in V1.
- Prompt/response not logged by default.
- Secrets and customer-sensitive data must not be committed.

## Latest Verified Repo State
- Public repository
- Branch `main`
- No source implementation yet at latest verification

## Next Work
1. Server skeleton
2. Provider-neutral request/response contract
3. Auth foundation
4. Rate-limit/quota foundation
5. Safe error model
6. Usage tracking foundation
7. First DeepSeek adapter with secret only in environment
