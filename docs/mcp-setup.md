# MCP Setup: GitHub

## What it enables

- Create and manage pull requests directly from Claude Code
- Read issues and repository state
- Add AI disclosure metadata to PRs automatically
- Demonstrate writer/reviewer pattern: one agent writes code, another opens a PR with review notes

## Prerequisites

- Node.js 20+
- A GitHub account with access to `arinaa77/ai-travel-planner`
- A GitHub Personal Access Token (classic) with `repo` scope

## Setup

### 1. Create a GitHub token

Go to: GitHub → Settings → Developer Settings → Personal access tokens → Tokens (classic)

Generate a new token with scopes:
- `repo` (full repository access)

Copy the token.

### 2. Add the MCP server to Claude Code

```bash
claude mcp add github -e GITHUB_TOKEN=your_token_here -- npx -y @modelcontextprotocol/server-github
```

Verify it was added:
```bash
claude mcp list
```

### 3. Repository config

`.mcp.json` is checked into the repo so teammates can reproduce the setup — just set their own `GITHUB_TOKEN` env var.

## Demonstrated workflow

Used GitHub MCP to create a pull request for the trip generation + judge evaluation features with full AI disclosure metadata:

- Claude read the current branch and diff via MCP
- Claude created a PR using `mcp__github__create_pull_request` with:
  - Summary of changes
  - AI disclosure (% AI-generated, tool, human review)
  - C.L.E.A.R. review checklist

See the PR at: https://github.com/arinaa77/ai-travel-planner/pulls
