# ADR 001: Hybrid Data Persistence with Deterministic In-Memory Fallback

## Status
Accepted

## Context
When evaluators, recruiters, or developers clone the repository, requiring an active MongoDB Atlas cluster with valid network whitelisting creates friction and causes setup failures.

## Decision
Implement a transparent dual-mode persistence repository in `src/lib/db.ts`:
1. If `MONGODB_URI` is supplied and reachable, the system connects via Mongoose.
2. If `MONGODB_URI` is missing or unreachable, the system automatically falls back to deterministic, pre-seeded in-memory collections.

## Consequences
- **Positive**: Zero-config 1-click startup for evaluators and CI test suites without external database dependencies.
- **Positive**: Complete local offline capability.
- **Neutral**: In-memory mutations reset on cold serverless restarts if MongoDB is not connected.
<!-- audited commit 86 -->
