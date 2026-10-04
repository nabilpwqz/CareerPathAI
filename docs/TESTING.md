# Automated Testing Strategy

## Overview
CareerPath AI uses Node.js's built-in native test runner (`node:test`) and assertion library (`node:assert/strict`) for lightning-fast, zero-overhead execution without heavy external testing runtimes.

## Test Invariants & Suites

### 1. Authentication (`tests/auth.test.mjs`)
- **Bcrypt Hashing**: Verifies salt generation and password verification.
- **JWT Cryptography**: Encodes and decodes user session payloads with strict signature validation.
- **Key Tampering Defense**: Ensures tokens signed with an invalid secret fail immediately.

### 2. Validation (`tests/validation.test.mjs`)
- **Registration**: Enforces email format rules and password length restrictions (minimum 6 characters).
- **Roadmap Milestones**: Validates boolean task state and numeric bounds for completion hours.

### 3. Observability (`tests/health.test.mjs`)
- **Contract Conformance**: Confirms `/api/v1/health` adheres to uptime, environment, and latency specifications.

## Running Tests

```bash
# Execute full automated test suite
npm test

# Type check codebase
npm run typecheck

# Production build verification
npm run build
```
