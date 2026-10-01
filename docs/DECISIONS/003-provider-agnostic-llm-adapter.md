# ADR 003: Provider-Agnostic LLM Adapter with Zod Schema Validation

## Status
Accepted

## Context
Tying an application to a single AI provider (e.g. OpenAI only or Gemini only) causes vendor lock-in, vulnerability to provider outages, and test flakiness when API keys or quotas expire.

## Decision
Abstract all LLM interactions behind an `LLMProvider` interface with a dynamic `orchestrator`:
- Automatically checks for available API keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`).
- Validates all generated JSON output using Zod schemas.
- If no external key is present or calls fail, seamlessly invokes an offline deterministic engine that generates realistic career intelligence.

## Consequences
- **Positive**: Resilient against external rate limits and API deprecations.
- **Positive**: CI tests and preview branches execute with 100% reliability.
