# Project 15 — MEasyMate Web Security Auditor

**Status:** DISCOVERY  
**Priority:** UNSET  
**Product type:** Restricted security assessment tool  
**Source repository:** UNVERIFIED (not created/verified)  
**Implementation status:** NOT STARTED  
**Last Secretary registration:** 2026-11-08

## Purpose and separation
A separate project for website/app owners and explicitly authorized assessors. It is NOT a public feature or public self-service scanner inside MEasyMate TrustGuard.

Keep repository, backend, database, access permissions, and operational controls separate from TrustGuard.

## Security scope
- Passive-first website posture checks.
- HTTPS/TLS and DNS configuration review.
- HTTP security headers.
- Dependency and known-CVE review.
- Authorized web/API assessment within a documented target scope.
- APK static analysis; controlled behavioral analysis only in a later isolated design.

## Mandatory safeguards
1. Require evidence of authorization and explicit target scope before active testing.
2. Active tests disabled by default; passive checks are the default.
3. No DoS/stress testing, credential attacks, destructive tests, or out-of-scope probing.
4. Enforce rate limits, request budgets, stop conditions, and audit logs.
5. Never collect or retain passwords, cookies, JWTs, OTPs, session tokens, or secrets.
6. Prefer staging/test environments for intrusive checks.
7. Fail closed when authorization, scope, or safety policy is missing or ambiguous.

## Current blockers / next work
- No implementation repository or source code verified.
- Authorization workflow, threat model, test boundaries, retention policy, and legal review are not yet specified.
- Next: define permission evidence, target-scope model, passive-check baseline, and safe acceptance criteria before implementation.
