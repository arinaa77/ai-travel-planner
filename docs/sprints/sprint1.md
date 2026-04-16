# Sprint 1

**Dates**: Mar 19 – Apr 2, 2026  
**Goal**: Core trip generation, judge evaluation, and project scaffolding

## Planning

### Goals
- Set up Next.js project with Supabase and Anthropic SDK
- Implement single Claude call for itinerary generation
- Implement LLM-as-judge evaluation
- Add basic UI: TripInputForm, ItineraryTimeline, JudgeScoreCard

### Issues
- #1 Set up project scaffold and CLAUDE.md
- #2 Implement generate API route with tool_use
- #3 Implement judge API route and scoring
- #4 Add ItineraryTimeline and JudgeScoreCard components

## Retrospective

### What went well
- Single-call architecture with tool_use worked cleanly from the start
- TDD on JudgeScoreCard and ReasoningAccordion gave confidence early
- CLAUDE.md @imports kept context modular and fast to load

### What to improve
- Auth was not scoped into this sprint but was needed earlier than expected
- Test coverage on API routes was skipped — add in Sprint 2
- README was aspirational; should reflect actual code from the start

### Async Standups
Mar 25 (Yihan): generate service scaffolded using /add-feature skill, tool_use pattern working locally
Mar 25 (Kaichen): TripInputForm and Sidebar layout done, starting JudgeScoreCard component
Mar 28 (Yihan): judge service done, wiring frontend next; skill v1 had wrong SDK method, filing gap analysis
Mar 28 (Kaichen): ScoreBar and ReasoningAccordion complete, PR ready for review
Apr 1 (Yihan): TDD cycle done for JudgeScoreCard and ReasoningAccordion, failing tests committed before impl
Apr 1 (Kaichen): ItineraryTimeline done and merged, Sprint 1 features all complete
Apr 2 (Yihan): judge tests merged, add-feature skill v2 drafted based on task1 gap analysis
