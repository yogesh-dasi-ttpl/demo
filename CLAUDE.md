# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js (CommonJS) project that includes `claude-setup/`, a toolkit of drop-in Claude Code agents and skills for full-stack React + Node.js development. The toolkit provides sub-agents, slash commands, and MCP server configuration.

## Setup

```bash
# Install the claude-setup toolkit into a project
bash claude-setup/setup.sh /path/to/project
```

This copies agents to `.claude/agents/`, commands to `.claude/commands/`, and config files (`.claude/settings.json`, `.mcp.json`) into the target project.

## Architecture

- **`claude-setup/agents/`** — Sub-agents that auto-trigger based on task context (e.g., `github/` for PRs, `test/` for writing tests, `db/` for schema/migrations). Each agent is a single `agent.md` file.
- **`claude-setup/commands/`** — User-invoked slash commands (e.g., `/ship`, `/standup`, `/premerge`, `/fix-ci`, `/db-seed`, `/component`, `/debug`). Each command is a single `skill.md` file.
- **`claude-setup/config/`** — MCP server config (`.mcp.json`) and hooks config (`settings.json`) that get copied to the target project.
- **`claude-setup/bin/install.js`** — npm postinstall script for package-based installation.

## Required Environment Variables

The toolkit expects these to be set for full functionality:
- `GITHUB_TOKEN` — GitHub API access
- `JIRA_URL`, `JIRA_USERNAME`, `JIRA_API_TOKEN` — Jira integration
- `DATABASE_URL` — PostgreSQL or MongoDB connection string
- `PROJECT_ROOT` — Target project path
