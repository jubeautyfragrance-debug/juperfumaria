# Subagent Orchestrator

## Overview
This orchestrator manages the 10 specialized subagents for the applebite project and general development tasks.

## Available Subagents

| Agent | File | Purpose |
|-------|------|---------|
| `code-review` | `code-review-agent.md` | Code quality review |
| `testing` | `testing-agent.md` | Test creation and management |
| `documentation` | `documentation-agent.md` | Documentation creation |
| `performance` | `performance-agent.md` | Performance optimization |
| `security` | `security-agent.md` | Security auditing |
| `design-ui` | `design-ui-agent.md` | UI/UX design |
| `database` | `database-agent.md` | Database management |
| `api` | `api-agent.md` | API development |
| `deployment` | `deployment-agent.md` | Deployment & DevOps |
| `research` | `research-agent.md` | Technical research |

## How to Spawn a Subagent

### On Claude Code
```bash
# Spawn a specific agent
claude --agent code-review

# Or use the Task tool with agent definition
Task(subagent_type="code-review", prompt="Review the authentication module")
```

### On OpenClaw/Pi/DeepSeek
```bash
# Read the agent file and follow its instructions
Read <PROJECT_ROOT>/.agents/subagents/code-review-agent.md and follow it exactly.
```

## Task Assignment Guide

| Task | Recommended Agent(s) |
|------|---------------------|
| Review PR | `code-review`, `security` |
| Write tests | `testing` |
| Create docs | `documentation` |
| Optimize speed | `performance` |
| Security audit | `security` |
| Design UI | `design-ui` |
| Database work | `database` |
| Build API | `api` |
| Deploy app | `deployment` |
| Research tech | `research` |
| New feature | `design-ui`, `api`, `testing`, `documentation` |
| Bug fix | `research`, `code-review`, `testing` |
| Refactor | `code-review`, `performance`, `testing` |

## Parallel Execution
Multiple agents can run in parallel for independent tasks:
- `code-review` + `security` for comprehensive review
- `testing` + `documentation` for new features
- `performance` + `security` for optimization

## File Locations
All agent definitions are in:
```
.agents/subagents/
├── orchestrator.md
├── code-review-agent.md
├── testing-agent.md
├── documentation-agent.md
├── performance-agent.md
├── security-agent.md
├── design-ui-agent.md
├── database-agent.md
├── api-agent.md
├── deployment-agent.md
└── research-agent.md
```
