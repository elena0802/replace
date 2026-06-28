---
title: Git Workflow
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Git Workflow

**Document type:** Repository collaboration reference  
**Status:** v1.0 — permanent reference  
**Authority:** Subordinate to [Release Process](RELEASE_PROCESS.md) and [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md)  
**Companion docs:** [AI Prompt Guide](../architecture/AI_PROMPT_GUIDE.md) · [Engineering Architecture](../architecture/ENGINEERING_ARCHITECTURE.md)  
**Audience:** Human developers, Cursor, Codex, Claude, and future AI coding agents  
**Purpose:** Define repository collaboration rules for safe, reviewable history

---

## How to Use This Document

All contributors — human and AI — follow these rules. **Git history is part of product trust** — destructive or silent operations erode accountability.

When AI assists: AI proposes changes; **humans approve** commits, pushes, and merges unless user explicitly requests otherwise.

---

# Git Philosophy

| Principle | Meaning |
|-----------|---------|
| **Small, reviewable commits** | One logical change per commit when possible |
| **Main is sacred** | Production-ready; never force-pushed |
| **Branches are disposable** | Feature branches merge and delete after merge |
| **Messages explain why** | Not “fix stuff” |
| **No secret history rewrites** | No force push to shared branches |
| **AI does not own git** | User approves commit/push/merge |

---

# Branch Naming

| Prefix | Use | Example |
|--------|-----|---------|
| `feature/` | RFC-backed new capability | `feature/archive-hub` |
| `fix/` | Bug fixes | `fix/save-toggle-error-copy` |
| `refactor/` | Behavior-preserving restructure | `refactor/place-card-tokens` |
| `docs/` | Documentation only | `docs/operations-metrics` |
| `hotfix/` | Critical production fix | `hotfix/oauth-callback` |

### Rules

- Lowercase, hyphen-separated
- No user names in branch names (optional team convention exception)
- One active branch per RFC or task when possible

---

# Commit Message Conventions

Follow repository style: **complete sentences**, focus on **why**.

### Format

```
Short summary in imperative mood (50–72 chars ideal)

Optional body: what changed and why. Reference RFC ID or issue.
```

### Examples

```
Replace Supabase error strings with calm Korean copy on explore list.

Humanizes trust failures per Security Guide and AI Design Rules.
RFC: N/A (Tier 1 debt)
```

```
Unify explore and my-places loading with PlaceCard skeleton.

Improves perceived performance per Interaction Specification.
```

### Avoid

- `wip`, `fix`, `update` alone
- Commit messages in English only when user-facing copy is Korean — UI copy still Korean in code
- Commits mixing unrelated refactors + features

### AI commits

AI must use HEREDOC or explicit message user approves — never generic “Apply changes”.

---

# Feature Workflow

```
1. RFC approved (Feature RFC Template)
2. git checkout main && git pull
3. git checkout -b feature/short-name
4. Implement per Architecture docs
5. Self-check: AI Design Rules + Release pre-checklists
6. Commit(s) with clear messages
7. Open PR → main
8. Address review
9. Merge after PR checklist + human approval
10. Delete feature branch after merge
```

**AI:** Do not open PR or merge unless user explicitly asks.

---

# Bugfix Workflow

```
1. git checkout -b fix/short-description
2. Reproduce issue; minimal fix
3. QA path from Release Process
4. Commit with root cause in message
5. PR → main
6. Merge after review
```

**Hotfix:** See [Release Process](RELEASE_PROCESS.md) §12 — branch `hotfix/`.

---

# Refactoring Workflow

```
1. Scope one surface or module (Engineering Architecture)
2. git checkout -b refactor/short-name
3. No behavior change unless documented in PR
4. No drive-by changes
5. PR with before/after description
6. Merge after build + lint + smoke QA
```

RFC not required for pure refactor; **required** if IA or API contract changes.

---

# Documentation Workflow

```
1. git checkout -b docs/short-name
2. Edit docs/ only (or docs + cross-links if approved)
3. Match YAML front matter + footer standard
4. PR — review for constitution alignment
5. Merge
```

Foundation doc changes require **human approval** — constitutional weight ([AI Prompt Guide](../architecture/AI_PROMPT_GUIDE.md) §17).

---

# PR Checklist

PR author completes before requesting review:

### Scope

- [ ] Single purpose (feature / fix / refactor / docs)
- [ ] RFC linked if feature
- [ ] No unrelated file changes

### Quality

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] User-facing copy Korean + humanized errors
- [ ] No secrets, `.env`, credentials in diff

### Governance

- [ ] Constitution review if user-facing feature ([Release Process](RELEASE_PROCESS.md))
- [ ] Docs updated if IA/component/behavior changed
- [ ] AI self-checklist if AI-generated ([AI Prompt Guide](../architecture/AI_PROMPT_GUIDE.md) §15)

### Description

- [ ] What changed / why
- [ ] Test plan (manual paths)
- [ ] Screenshots for UI (optional)

**Reviewer** verifies checklist — does not assume.

---

# Merge Rules

| Rule | Detail |
|------|--------|
| **Merge via PR** | No direct push to `main` for product work (team policy) |
| **Approvals** | At least one human review for user-facing changes |
| **CI green** | Build/lint before merge when CI exists |
| **No merge** | If constitution blocker or open trust issue |
| **Squash or merge commit** | Team preference — preserve RFC link in message |
| **Delete branch** | After successful merge |

**AI must never merge without explicit user instruction.**

---

# Forbidden Git Operations

### Humans and AI — never without explicit user request and justification

| Operation | Risk |
|-----------|------|
| `git push --force` to `main` / `master` | Destroys production history |
| `git push --force` to shared branches others use | Data loss for team |
| `git reset --hard` on shared branches | History rewrite |
| `git rebase -i` on pushed shared history | Rewrite without coordination |
| `git commit --amend` after push to remote | Unless user rules allow unpushed only |
| Committing `.env`, secrets, keys | Security breach |
| `git clean -fdx` without user awareness | Destructive |
| Skipping hooks `--no-verify` | Unless user explicitly requests |

### AI-specific prohibitions

**AI must never:**

- **Force push**
- **Auto commit** without user asking to commit
- **Auto push** without user asking to push
- **Rewrite history** (rebase, amend pushed commits)
- **Delete branches** (local or remote)
- **Merge** without approval
- **Update git config** (user rules)

AI may **prepare** diffs and **suggest** commit messages — user executes or explicitly authorizes git operations.

---

# AI-Specific Git Rules

| Allowed when user asks | Forbidden unless explicit |
|------------------------|---------------------------|
| `git status`, `git diff`, `git log` | `git push` |
| `git add` + `git commit` with user-approved message | `git merge` |
| Branch create for stated task | `git push -u` |
| PR body draft via `gh pr create` when user asks | Force push |
| Read-only history inspection | Branch delete |

### Multi-step user rule alignment

When user asks to commit: run status, diff, log; draft message; commit; verify — per user git safety protocol in workspace rules.

When user does **not** ask: **no commits**.

---

# Repository Hygiene

| Practice | Detail |
|----------|--------|
| `.gitignore` | `.env*`, `node_modules`, `.next`, OS junk |
| No secrets in repo | Use hosting env vars |
| Lockfile committed | `package-lock.json` |
| Migrations versioned | `supabase/migrations/` |
| Large binaries | Avoid — use storage/CDN |
| PR size | Prefer <400 lines meaningful diff; split if larger |

---

# Decision Checklist

Before git operation:

- [ ] User explicitly requested this operation (for commit/push/merge)?
- [ ] Branch name follows convention?
- [ ] Commit message explains why?
- [ ] No secrets in staged files?
- [ ] Not force-pushing shared/production branch?
- [ ] PR checklist complete before merge?
- [ ] RFC linked if feature?

---

## Closing

Git is the **audit trail of trust**. Re:Place history should be as calm and honest as the product — no silent force pushes, no AI merging in the dark.

---

*Git Workflow v1.0 — repository collaboration rules for Re:Place.*

---

This document is part of the Re:Place documentation system.
