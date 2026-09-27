# ADR 002: Firebase Authentication with Server-Side HttpOnly JWT Synchronization

## Status
Accepted

## Context
Firebase Client Auth provides modern social logins (Google, GitHub), but client-only tokens are susceptible to cross-site scripting (XSS) when stored in localStorage and do not cleanly integrate with Next.js Edge and Node server-side cookie guards.

## Decision
1. Maintain client Firebase auth SDK for OAuth popup workflows.
2. Introduce `/api/v1/auth/firebase-sync` endpoint where the client sends the Firebase token.
3. The server signs a backend HttpOnly, SameSite=Lax JWT session cookie for subsequent requests.

## Consequences
- **Positive**: Complete defense against client-side script token theft (XSS).
- **Positive**: Native Next.js API route session introspection.
- **Positive**: Seamless fallback to email/password and 1-click evaluator demo mode.
