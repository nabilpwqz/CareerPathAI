# Security Policy & Architecture

## Security Philosophy
CareerPath AI adheres to a defense-in-depth posture across the presentation, application, and persistence tiers.

## Core Security Controls

### 1. Secret Isolation
- Zero secrets committed to source control.
- Configuration strictly read from `process.env`.
- Fatal failure on startup in production if `JWT_SECRET` is unset.

### 2. Client Authentication & Session Management
- Multi-provider authentication backed by Firebase Auth v10 (Google, GitHub, Email/Password).
- Server-side synchronization exchanging Firebase ID tokens for cryptographically signed HttpOnly JWT cookies.
- Cookie properties:
  - `HttpOnly: true` (mitigates XSS token extraction)
  - `SameSite: "lax"` (mitigates CSRF attacks)
  - `Secure: process.env.NODE_ENV === "production"`
  - `Path: "/"`

### 3. Ingress Payload Validation
- Every API endpoint validates untrusted client inputs with strict Zod schemas.
- Payloads with unexpected structures, types, or missing bounds are rejected with HTTP 400 and structured error envelopes.

### 4. Tenant Isolation & Broken Object Level Authorization (BOLA)
- Every user resource (resumes, roadmaps, interview records) enforces strict ownership checks (`userId === session.userId`).
- Cross-tenant data leaks are structurally impossible.

### 5. AI Prompt Injection & Hallucination Guardrails
- Input sanitization strips system prompt override sequences (`SYSTEM:`, `Ignore prior instructions`, markdown delimiters).
- System prompts enforce strict grounding in verified candidate background data.
- Structured LLM responses validated against deterministic Zod schemas before persistence.

## Reporting a Vulnerability
To report security issues, please contact `security@careerpath.ai` or submit a private security advisory on GitHub.
