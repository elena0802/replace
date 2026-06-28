---
title: Release Process
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Release Process

**Document type:** Release workflow reference  
**Status:** v1.0 — permanent reference  
**Authority:** Subordinate to [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md); implements [Engineering Architecture](../architecture/ENGINEERING_ARCHITECTURE.md)  
**Companion docs:** [Git Workflow](GIT_WORKFLOW.md) · [Security Guide](SECURITY_GUIDE.md) · [Accessibility Guide](ACCESSIBILITY_GUIDE.md) · [Feature RFC Template](../process/FEATURE_RFC_TEMPLATE.md)  
**Purpose:** Define the official release workflow — **quality over speed**

---

## How to Use This Document

Every production release follows this process. **No exceptions** for “small” changes that touch user-facing trust, auth, payments, or visibility.

Hotfixes follow §12 — still require human-readable errors and constitution check.

---

# Release Philosophy

| Principle | Meaning |
|-----------|---------|
| **Trust over velocity** | Delay release if mock data or tech errors ship |
| **Definition of Done is binary** | Checklists complete — not “mostly done” |
| **Releases are reversible** | Rollback plan before deploy |
| **Documentation is part of release** | IA/component/interaction docs updated when behavior changes |
| **Calm UX is release criteria** | Regressions in loading, errors, or copy block release |
| **No engagement experiments in prod** | Without RFC + constitution check |

A slow trustworthy release beats a fast embarrassing one.

---

# Branch Strategy

Align with [Git Workflow](GIT_WORKFLOW.md).

| Branch | Role |
|--------|------|
| `main` | Production-ready; protected |
| `feature/*` | RFC-backed features |
| `fix/*` | Bug fixes |
| `refactor/*` | Behavior-preserving changes |
| `docs/*` | Documentation only |

### Release source

- Releases deploy from **`main`** only
- Feature branches merge via PR after full checklist
- No direct commits to `main` for user-facing work without review (human policy)

---

# Pre-Release Checklist

Complete before opening release PR or tagging deploy.

### Scope

- [ ] CHANGELOG or release notes drafted (user-facing changes in Korean where UI changed)
- [ ] RFC ID linked for net-new features
- [ ] Tier noted per [Product Roadmap Philosophy](../process/PRODUCT_ROADMAP_PHILOSOPHY.md)
- [ ] No scope creep in final diff

### Build

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes (or documented exceptions)
- [ ] No TypeScript errors
- [ ] Environment variables documented in [`supabase-setup.md`](../supabase-setup.md) / deployment docs if new

---

# QA Checklist

Manual QA on **staging or preview** before production.

### Core flows (minimum)

| Flow | Paths |
|------|-------|
| Auth | Login, logout, Kakao OAuth callback, protected route gate |
| Create | `/places/new` — save with name + memory; optional photo |
| Own archive | `/my-places` — list, open detail |
| Edit/delete | Edit record; delete with **confirmation modal** (target — not native confirm) |
| Public browse | `/explore` — public places only |
| Save | Save public place; `/saved` list |
| Collections | Create, add place, view detail, remove place |
| Errors | Airplane mode or bad config — **human Korean error**, not Supabase string |
| Pricing/payment | Test flow only in test mode — no MVP label in user UI |

### Regression targets (known debt — verify not worse)

- Homepage: no fake collections presented as live (if not yet fixed, document known issue)
- List loading: acceptable if skeleton not shipped — must not flash broken layout
- Mobile: place detail actions usable on narrow viewport

### Devices

- [ ] Mobile viewport (375px)
- [ ] Desktop (1280px+)
- [ ] Keyboard-only smoke test on changed screens

---

# Design Review

Required for **any user-visible UI change**.

Reference: [Visual Language Guide](../foundation/VISUAL_LANGUAGE_GUIDE.md) · [Design System v2](../foundation/DESIGN_SYSTEM_V2.md) · [Re:Place Test](../foundation/VISUAL_LANGUAGE_GUIDE.md) §14

- [ ] Calm — not busy or urgent
- [ ] Content leads — memory/photo before chrome
- [ ] One primary CTA per section
- [ ] Tokens only — no new raw hex
- [ ] Korean-first copy
- [ ] No decorative English
- [ ] Card/grid consistency per [Component Specification](../architecture/COMPONENT_SPECIFICATION.md)

**Reviewer:** Design or product owner sign-off on PR.

---

# Constitution Review

Required for **features, IA, monetization, AI, sharing behavior changes**.

Reference: [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md) · [Core Product Principles](../foundation/CORE_PRODUCT_PRINCIPLES.md)

- [ ] Not on Never list ([Roadmap Philosophy](../process/PRODUCT_ROADMAP_PHILOSOPHY.md) §6)
- [ ] Public/private behavior explicit
- [ ] No engagement metrics in UI
- [ ] No fake community content
- [ ] AI opt-in and editable if applicable
- [ ] Premium does not paywall core record CRUD

**Blocker:** Any Article 5 violation — release stops.

---

# Security Review

Required for **auth, API routes, RLS, payments, uploads, env changes**.

Reference: [Security Guide](SECURITY_GUIDE.md)

- [ ] No secrets in client bundle
- [ ] RLS policies reviewed for new/changed tables
- [ ] OAuth redirect paths sanitized
- [ ] API input validation on new routes
- [ ] File upload type/size limits
- [ ] No PII in client logs

---

# Performance Review

Required for **new lists, images, maps, or heavy client bundles**.

Reference: [Engineering Architecture](../architecture/ENGINEERING_ARCHITECTURE.md) §19

- [ ] Images use Next/Image with `sizes` where applicable
- [ ] No accidental full-page `"use client"` bloat
- [ ] Map/Kakao/Toss dynamically imported where possible
- [ ] No infinite scroll without pagination plan
- [ ] Lighthouse spot-check on changed pages (informational — not vanity score chasing)

---

# Accessibility Review

Required for **new components, forms, modals, navigation changes**.

Reference: [Accessibility Guide](ACCESSIBILITY_GUIDE.md) · [Interaction Specification](../architecture/INTERACTION_SPECIFICATION.md)

- [ ] Focus visible on interactives
- [ ] 44px touch targets
- [ ] Form labels and errors associated
- [ ] Modal focus trap + Escape
- [ ] `prefers-reduced-motion` respected
- [ ] Meaningful `alt` on content images

---

# Documentation Update Requirements

Update when release changes:

| Change | Document |
|--------|----------|
| New/moved route | Information Architecture |
| New interaction pattern | Interaction Specification |
| New/changed component | Component Specification |
| Data/auth/API pattern | Engineering Architecture |
| New metric | Product Metrics |
| Process change | This doc or Git Workflow |
| Foundation identity change | Constitution — amendment process |

**Docs-only releases** use `docs/*` branch — no QA flows except link check.

---

# Release Steps

```
1. Complete all checklists on PR
2. Obtain approvals (see Git Workflow PR checklist)
3. Merge to main
4. Tag release (optional semver): vYYYY.MM.DD or vX.Y.Z
5. Deploy per deployment.md
6. Smoke test production (core auth + create + explore)
7. Post-release monitoring (§11)
8. Publish release notes
```

### Deployment

Follow [`deployment.md`](../deployment.md). Verify environment secrets in hosting dashboard — never in repo.

### Database migrations

- Run Supabase migrations **before** or **with** deploy per migration notes
- Backup or verify rollback script for destructive migrations

---

# Post-Release Monitoring

First **24–48 hours** after production deploy.

| Watch | Action |
|-------|--------|
| Error logs (server) | Spike → investigate; user still sees human errors |
| Auth failures | OAuth callback, session expiry |
| Payment failures | Toss webhook/confirm route |
| User reports | Trust, visibility, data loss |
| Performance | Slow list loads — not DAU |

**Do not** optimize notification campaigns on release week — constitution prohibits engagement-first growth.

Align qualitative check with [Product Metrics](PRODUCT_METRICS.md) trust metrics.

---

# Hotfix Policy

**Hotfix:** Production bug causing trust break, data loss risk, auth failure, or payment failure.

### Process

1. Branch `fix/critical-short-description` from `main`
2. Minimal diff — fix only
3. Abbreviated checklist: QA on fix path + security if relevant
4. Constitution check if behavior change
5. PR with `hotfix` label — expedited review, **not skipped**
6. Deploy; post-release monitor 24h
7. Backport documentation if behavior changed

**Not hotfix:** cosmetic tweak, feature rush, engagement experiment.

---

# Rollback Policy

### When to rollback

- Widespread auth breakage
- Data corruption or wrong visibility exposed
- Payment double-charge or confirm failure
- Site unavailable

### How

1. Redeploy previous known-good `main` commit or hosting rollback
2. Revert migration if safe — else run forward fix migration
3. Communicate status — human Korean if user-facing banner needed
4. Post-mortem: root cause, checklist gap, doc update

**Prepare rollback target** before every production deploy.

---

# Release Anti-Patterns

| Anti-pattern | Why |
|--------------|-----|
| “Ship Friday, fix Monday” on auth/payments | Trust risk |
| Skip QA for “tiny” copy change that exposes API errors | Trust |
| Release without RFC on feature | Governance |
| Dark pattern A/B in prod | Constitution |
| Deploy without env verification | Outage |
| No rollback plan | Extended outage |
| Velocity metric pressuring checklist skip | Quality debt |
| Changelog only in English | Product is Korean-first |
| Release celebrating DAU spike | Wrong metrics |

---

# Definition of Done

A release item is **Done** when all apply:

### Product

- [ ] RFC approved (if net-new feature)
- [ ] Constitution review passed
- [ ] Success criteria from RFC met or explicitly deferred

### Design & UX

- [ ] Design review passed
- [ ] Interaction spec aligned (loading, error, success, delete confirm)
- [ ] Visual Language + Design System compliance

### Engineering

- [ ] Build + lint pass
- [ ] Engineering Architecture patterns followed
- [ ] No secrets in client; RLS considered
- [ ] Humanized errors — no Supabase/API in UI

### Accessibility & security

- [ ] Accessibility checklist for changed UI
- [ ] Security checklist if auth/data/payments touched

### Operations

- [ ] QA checklist executed
- [ ] Documentation updated
- [ ] Release notes written
- [ ] Rollback plan identified
- [ ] Post-release monitor assigned

**Done is not:** merged but untested; tested but trust copy broken; shipped but docs stale.

---

## Closing

Re:Place releases should feel like **placing a volume on the shelf** — deliberate, complete, trustworthy. Speed is secondary to whether users can **trust what shipped**.

---

*Release Process v1.0 — official release workflow for Re:Place.*

---

This document is part of the Re:Place documentation system.
