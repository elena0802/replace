---
title: Development Playbook
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Development Playbook

**Document type:** Execution workflow reference  
**Status:** v1.0 — permanent reference  
**Authority:** Connects [Foundation](../foundation/), [Process](../process/), [Architecture](../architecture/), [Operations](../operations/), [API](../api/), and [Database](../database/) into one process  
**Companion docs:** [AI Context](../AI_CONTEXT.md) · [Git Workflow](../operations/GIT_WORKFLOW.md) · [Release Process](../operations/RELEASE_PROCESS.md)  
**Purpose:** Answer — *How do we safely build Re:Place from now on?*

---

## How to Use This Document

Follow this playbook for every task after planning phase. Start each session with [AI Context](../AI_CONTEXT.md). Use task classification (§3) to skip or require RFC. Complete Definition of Done (§9) before PR.

---

# Development Philosophy

| Principle | Meaning |
|-----------|---------|
| **Docs before code** | Load context; don't invent product or schema |
| **Small PRs** | One concern; reviewable diffs |
| **Tier order** | Tier 1 polish before Tier 3 features |
| **RLS and tokens** | Data and UI foundations are not optional |
| **Human-facing quality** | Korean errors, no mock permanence, no MVP labels |
| **No silent scope** | RFC when behavior or surface area grows |

Quality is cumulative — shortcuts in Tier 1 compound into Tier 3 debt.

---

# Work Intake

1. **Describe the task** — bug, feature, refactor, doc, security
2. **Classify** (§3) — determines RFC need and review depth
3. **Assign tier** — [Product Roadmap Philosophy](../process/PRODUCT_ROADMAP_PHILOSOPHY.md)
4. **Load docs** — [AI Context](../AI_CONTEXT.md) + task-specific (§4 step 1)
5. **Branch** — naming per [Git Workflow](../operations/GIT_WORKFLOW.md)
6. **Execute workflow** (§4) → **DoD** (§9) → **PR** → **Release** if shipping

---

# When RFC Is Required

Use [Feature RFC Template](../process/FEATURE_RFC_TEMPLATE.md) when **any** apply:

- New user-facing feature or route
- Change to privacy/sharing defaults
- New API route or external integration
- Schema change affecting visibility or ownership
- Navigation / IA restructuring
- AI feature behavior change
- Payment or auth flow change
- Anything on roadmap Tier 3+ or Never list adjacent

RFC must be **approved** before implementation begins.

---

# When RFC Is Not Required

| Task | Condition |
|------|-----------|
| Bug fix | Restores documented/intended behavior — no new capability |
| Copy fix | Korean humanization; no new flows |
| Token/color migration | Matches Design System v2 |
| Doc-only | No code change |
| Refactor | Behavior-preserving; same UX contract |
| Security patch | Narrow fix; document in PR + Security Guide if pattern change |
| Tier 1 debt | Explicitly listed in Roadmap Philosophy Tier 1 |

If unsure — write a **mini-RFC** (problem, approach, risks) in PR description.

---

# Task Classification

| Type | Examples | RFC | Primary docs |
|------|----------|-----|--------------|
| **Feature** | New collection filter, export | Yes | RFC, IA, Component Spec, API/DB if needed |
| **Bug fix** | Wrong redirect, RLS leak | No* | Engineering Arch, Security |
| **Refactor** | Unify PlaceCard, extract hook | No* | Component Spec, Engineering Arch |
| **UI redesign** | Nav hub, homepage real content | Often yes | Visual Language, Design System, Interaction Spec |
| **Documentation** | This playbook | No | — |
| **Security fix** | Auth on AI route, error leakage | No; escalate review | Security Guide, API Spec |

*Unless fix reveals missing product decision — then RFC.

---

# Standard Workflow

```text
Read docs → Create branch → RFC (if needed) → Plan → Implement → Test → Review → Update docs → Release
```

### 1. Read docs

- Always: [AI Context](../AI_CONTEXT.md)
- UI: Design System, Component Spec, Visual Language, Accessibility
- Data: [Database Schema](../database/DATABASE_SCHEMA.md)
- HTTP: [API Specification](../api/API_SPECIFICATION.md)
- Ship: Git Workflow, Release Process, Changelog Guide

### 2. Create branch

```text
feature/<short-name>
fix/<short-name>
refactor/<short-name>
docs/<short-name>
```

From latest `main`. One task per branch.

### 3. RFC if needed

Copy template → fill → tier score → approval → link RFC ID in PR.

### 4. Plan

- List files to touch
- Note RLS / auth / error mapping impacts
- Identify tests: manual paths minimum
- Confirm out of scope

### 5. Implement

- Minimal diff; match existing patterns
- Tokens not hex; Korean user strings
- No service role for user CRUD
- Read Next.js docs in `node_modules/next/dist/docs/` when unsure ([AGENTS.md](../../AGENTS.md))

### 6. Test

| Check | Action |
|-------|--------|
| Build | `npm run build` |
| Lint | `npm run lint` |
| Happy path | Manual in browser |
| Auth | Logged out + logged in |
| Errors | Trigger failure — UI shows Korean, not code |
| RLS | Other user cannot read private rows |
| a11y | Keyboard + focus quick pass |

### 7. Review

- Self-review against [Final AI Self-Checklist](../AI_CONTEXT.md#final-ai-self-checklist)
- Human PR review required for user-facing merges
- Security-sensitive: cite [Security Guide](../operations/SECURITY_GUIDE.md)

### 8. Update docs

Update when behavior, routes, schema, or IA changes:

- API Spec, Database Schema, IA, Component Spec as applicable
- Not required for pure copy fixes if behavior unchanged

### 9. Release

Follow [Release Process](../operations/RELEASE_PROCESS.md):

- Changelog entry per [Changelog Guide](CHANGELOG_GUIDE.md)
- Deploy from `main` after checklist
- Post-release smoke test

---

# Cursor Workflow

1. `@docs/AI_CONTEXT.md` at conversation start
2. `@` relevant spec files for the task
3. Explicit scope: "Tier 1 only — no new features"
4. Request diff review against AI Design Rules before finish
5. **Do not** auto-commit unless user asks ([Git Workflow](../operations/GIT_WORKFLOW.md))
6. Report gaps found in codebase vs docs

---

# Codex Workflow

Same as Cursor with emphasis on:

- Read actual route/schema files before documenting or changing
- Run build/lint in terminal
- Never invent endpoints — [API Specification](../api/API_SPECIFICATION.md) is exhaustive for current routes

---

# Human Review Workflow

| Reviewer focus | Check |
|----------------|-------|
| Product | Constitution, Principles, tier fit |
| Design | Visual Language, tokens, calm copy |
| Engineering | RLS, types, minimal API |
| Security | Auth, secrets, error leakage |
| a11y | Accessibility Guide |

Approve when DoD met and no constitution violations.

---

# Refactoring Workflow

1. Confirm **behavior-preserving** — document UX contract before/after
2. Branch `refactor/*`
3. No RFC unless IA or component API changes for consumers
4. Prefer incremental PRs (e.g. PlaceCard unification alone)
5. Full regression on affected routes
6. Update Component Spec if canonical component changes

---

# Documentation Update Workflow

| Trigger | Update |
|---------|--------|
| New/changed route | API Specification |
| Migration | Database Schema + types |
| New page/nav | Information Architecture |
| New component variant | Component Specification |
| Release | Changelog Guide entry |
| Process change | This playbook |

Docs PRs use `docs/*` branch — no RFC unless governance change.

---

# Definition of Done

A task is **done** when all apply:

- [ ] Matches approved scope (RFC if required)
- [ ] `npm run build` and `npm run lint` pass
- [ ] Manual test paths verified
- [ ] User errors human Korean — no codes in UI
- [ ] RLS/auth correct for touched data
- [ ] No secrets in diff
- [ ] Companion docs updated if behavior changed
- [ ] Changelog drafted if user-visible
- [ ] PR description: what, why, how to test
- [ ] Human review for user-facing merges

---

# Anti-Patterns

| Anti-pattern | Why |
|--------------|-----|
| Code first, docs never | Drift breaks AI and humans |
| Giant PR mixing feature + refactor | Unreviewable |
| Skip tier order | Mock homepage stays forever |
| New `/api/crud/*` for tables | RLS exists for a reason |
| English errors "for now" | Becomes permanent |
| AI auto-merge to main | Trust risk |
| Implementation without reading AI Context | Identity drift |

---

# Development Checklist

Before opening PR:

- [ ] [AI Context](../AI_CONTEXT.md) self-checklist complete
- [ ] RFC linked or N/A justified
- [ ] Tier noted
- [ ] Branch name correct
- [ ] Build + lint green
- [ ] Error mapping verified
- [ ] Docs updated
- [ ] Changelog entry if user-visible
- [ ] Reviewer assigned

---

## Closing

This playbook turns the Re:Place documentation **system** into a **process**. Planning without this execution layer drifts; implementation without docs drifts faster. Use both.

---

*Development Playbook v1.0 — safe build workflow for Re:Place.*

---

This document is part of the Re:Place documentation system.
