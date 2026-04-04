<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->



Part 3 Full Task List

  Setup (do once, before any TDD commits)

  - Install Vitest + React Testing Library: npm install -D vitest @vitejs/plugin-react jsdom
  @testing-library/react @testing-library/jest-dom
  - Create vitest.config.ts at root
  - Add "test": "vitest" to package.json scripts
  - Verify npm run test runs (even with 0 tests) — do not commit yet

  ---
  Cycle 1 — Score display

  - RED commit: Create src/components/judge/JudgeScoreCard.test.tsx with failing tests for:
    - Overall score number renders
    - Score bar width matches score % (e.g. score=80 → width: 80%)
    - Dimension label renders (e.g. "Cost accuracy")
    - Commit: test(judge): add failing tests for JudgeScoreCard score display
  - Run npm run test — confirm tests fail (screenshot this for your session log)
  - GREEN commit: Create src/components/judge/JudgeScoreCard.tsx with minimum code to pass
    - Commit: feat(judge): implement JudgeScoreCard to pass score display tests
  - Run npm run test — confirm tests pass
  - REFACTOR commit: Extract score bar into its own small component or helper
    - Commit: refactor(judge): extract ScoreBar into separate component

  ---
  Cycle 2 — Reasoning display

  - RED commit: Add new failing tests to the test file for:
    - Verdict text renders
    - Reasoning text for each dimension renders
    - Commit: test(judge): add failing tests for reasoning and verdict display
  - Run npm run test — confirm new tests fail
  - GREEN commit: Add reasoning/verdict section to the component
    - Commit: feat(judge): implement reasoning and verdict display
  - Run npm run test — confirm all tests pass
  - REFACTOR commit: Extract reasoning section into ReasoningAccordion or similar
    - Commit: refactor(judge): extract ReasoningAccordion component

  ---
  Evidence to capture (for your session log)

  - Screenshot of red test output after each RED commit
  - Screenshot of green test output after each GREEN commit
  - Copy your Claude Code session transcript showing you writing tests first

  ---
  Final check

  - git log --oneline shows the 6 commits in red→green→refactor order
  - Test file timestamp/commit is before implementation commit
