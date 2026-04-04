# Testing Strategy

## What to test

- **Unit tests (Vitest)**: pure functions in `src/services/prompts/` and `src/lib/`
- **Component tests**: React components in `src/components/` using React Testing Library
- **Integration tests**: API routes tested with `next-test-api-route-handler`
- Test files: co-located `*.test.ts` / `*.test.tsx` next to the source file

## What not to mock

- Do not mock the Anthropic API in integration tests: use a real key in CI and keep test inputs short to control cost
- Do mock in unit tests for prompt builders and pure utility functions (no API calls needed)

## Commands

```bash
npm run test          # Vitest unit + component tests
npm run type-check    # tsc --noEmit
npm run lint          # ESLint
npm run lhci          # Lighthouse CI (needs LHCI_GITHUB_APP_TOKEN)
```

## Rules

- Validate all user inputs with Zod before they touch a prompt or DB query
- Use `unstable_cache` for expensive repeated lookups
- Add Sentry `captureException` in service-layer catch blocks
- Lighthouse CI must score Perf ≥ 85, A11y ≥ 90 against staging
