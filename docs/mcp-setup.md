# MCP Setup: GitHub

## What it enables

The GitHub MCP server gives Claude Code direct access to the GitHub API during development. For TripMind this means:

| Capability | How it helps |
|---|---|
| Create pull requests | Open PRs with AI disclosure metadata without leaving the terminal |
| Read repo state | Claude can check open issues, PR status, and branch info mid-session |
| Writer/reviewer pattern | One Claude session writes the feature, another reviews and opens the PR |
| C.L.E.A.R. reviews | PR descriptions include structured review checklists automatically |
| AI disclosure | Every PR documents % AI-generated, tool used, and human review status |

Without MCP, all of the above requires switching to the GitHub UI or writing separate `gh` CLI commands manually. With MCP, Claude Code handles it inline as part of the development workflow.

---

## Prerequisites

- Node.js 20+
- A GitHub account with access to `arinaa77/ai-travel-planner`
- A GitHub Personal Access Token (classic) with `repo` scope

---

## Setup

### 1. Create a GitHub Personal Access Token

1. Go to: **GitHub → Settings → Developer Settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Set scopes: `repo` (full repository access)
4. Copy the token: you won't see it again

### 2. Add the MCP server to Claude Code

```bash
claude mcp add github -e GITHUB_TOKEN=your_token_here -- npx -y @modelcontextprotocol/server-github
```

### 3. Verify the connection

```bash
claude mcp list
```

Expected output:
```
github: npx -y @modelcontextprotocol/server-github - ✓ Connected
```

### 4. Repository config (for teammates)

`.mcp.json` is checked into the repo root. Teammates only need to set their own `GITHUB_TOKEN` and run `claude mcp add`: no other config needed.

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

---

## Demonstrated workflow

**Task:** Create a PR for the GitHub MCP integration with full AI disclosure metadata and C.L.E.A.R. review checklist.

**Branch:** `feat/mcp-github-integration`
**PR:** https://github.com/arinaa77/ai-travel-planner/pull/1

**Steps performed via MCP-connected Claude Code session:**

1. Verified MCP connection with `claude mcp list` → `✓ Connected`
2. Committed MCP config files (`.mcp.json`, `docs/mcp-setup.md`, updated `CLAUDE.md`) to feature branch
3. Pushed branch to `origin`
4. Created PR with:
   - Change summary
   - Reproduction steps for the MCP setup
   - AI disclosure metadata (`~85% AI-generated`, tool: Claude Code / claude-sonnet-4-5)
   - C.L.E.A.R. review checklist (Correct, Lean, Explicit, Accurate, Resilient)

**MCP tools available in session:**
- `mcp__github__create_pull_request`: create PR with full body
- `mcp__github__list_pull_requests`: check open PRs
- `mcp__github__get_pull_request`: read PR state
- `mcp__github__create_issue`: open issues from Claude
- `mcp__github__list_commits`: inspect branch history

---

## Security notes

- `GITHUB_TOKEN` is passed via environment variable: never hardcoded in `.mcp.json`
- Token scope is `repo` only: no admin, webhook, or org permissions
- `.env.local` is in `.gitignore`: tokens are never committed
