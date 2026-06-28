---
title: AI Context Pack
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# AI Context Pack

**Document type:** Compressed agent onboarding  
**Status:** v1.0 — paste at start of implementation sessions  
**Authority:** Summarizes [Foundation](./foundation/), [Process](./process/), [Architecture](./architecture/), [Operations](./operations/) — does not override them  
**Companion docs:** All docs under `docs/`  
**Purpose:** Prevent identity drift; give Cursor/Codex/Claude a single starting context

---

## How to Use This Document

1. Paste this file (or `@docs/AI_CONTEXT.md`) at the **start** of implementation prompts.
2. Then load **task-specific** docs from [Before Coding](#before-coding-read-these-docs).
3. Run [Final AI Self-Checklist](#final-ai-self-checklist) before submitting code.

---

# What Re:Place Is

**Re:Place** is a quiet, Korean-first **lifestyle archive** for remembering places — not discovering or ranking them.

- Users record places with memory (memo), optional photo, category, location
- Optional public sharing and collections — **opt-in**, not default social feed
- Premium via Toss Payments (₩4,900/month)
- Stack: **Next.js 16**, **React 19**, **Tailwind v4**, **Supabase** (Auth, Postgres, Storage)
- Kakao OAuth login

**Core loop:** remember → optionally share → revisit — not scroll → compare → engage.

---

# What Re:Place Is Not

- Not Instagram, Naver Place reviews, or a travel ranking app
- Not a generic SaaS dashboard or growth-hacked social network
- Not an English-first product (UI copy is Korean-first)
- Not a place to expose technical errors, error codes, or MVP labels to users
- Not an excuse to add likes, follows, comments, or algorithmic feeds

---

# Non-Negotiable Rules

1. **Archive over engagement** — no dark patterns, streaks, or vanity metrics in UI
2. **Human errors** — Korean, calm, actionable; never raw API/DB messages or `error.code` in UI
3. **Design tokens** — use semantic tokens from [Design System v2](./foundation/DESIGN_SYSTEM_V2.md); no random hex in components
4. **RLS-first data** — do not bypass Supabase RLS with service role for user CRUD
5. **Minimal API surface** — prefer Supabase client; routes only for secrets/payments ([API Spec](./api/API_SPECIFICATION.md))
6. **No scope creep** — read RFC/roadmap tier before building features
7. **Docs before drift** — update docs when behavior changes
8. **This Next.js may differ** — read `node_modules/next/dist/docs/` for framework APIs ([AGENTS.md](../AGENTS.md))

---

# Product Principles (Summary)

From [Core Product Principles](./foundation/CORE_PRODUCT_PRINCIPLES.md):

- Memory-first, not discovery-first
- Quiet visual density — breathing room, not clutter
- Trust through consistency and honest privacy
- Sharing is explicit — collections and public places are deliberate
- AI assists memory polish — never writes reviews or rankings

---

# Visual Language (Summary)

From [Visual Language Guide](./foundation/VISUAL_LANGUAGE_GUIDE.md):

- Warm neutral palette, soft contrast, editorial calm
- Photography and place name lead; chrome recedes
- No aggressive red CTAs, no gamified badges
- Motion: subtle, purposeful — no bounce-heavy delight

---

# Design System (Summary)

From [Design System v2](./foundation/DESIGN_SYSTEM_V2.md):

- Semantic colors: `background`, `foreground`, `muted`, `accent`, `border`, etc.
- Typography scale for hierarchy — not arbitrary pixel sizes
- Spacing rhythm consistent with archive/card layouts
- Components consume tokens — refactor away hardcoded `#hex` (known debt)

---

# Information Architecture (Summary)

From [Information Architecture](./architecture/INFORMATION_ARCHITECTURE.md):

| Area | Routes (current) |
|------|-------------------|
| Home | `/` |
| Auth | `/login`, `/auth/callback` |
| Places | `/places/new`, `/places/[id]`, `/places/[id]/edit` |
| Collections | `/collections`, `/collections/[id]`, `/collections/new` |
| Account | `/profile`, `/saved`, `/pricing`, `/payment/*` |

Nav should evolve toward **hub model** — flat 7-item nav is known debt.

---

# Component Rules (Summary)

From [Component Specification](./architecture/COMPONENT_SPECIFICATION.md):

- **PlaceCard** — single canonical card; unify duplicates (debt)
- Forms: label + calm validation; loading/disabled states
- Empty states: guide next action, not guilt
- No developer-facing strings in production UI

---

# Engineering Rules (Summary)

From [Engineering Architecture](./architecture/ENGINEERING_ARCHITECTURE.md):

- App Router; server components where appropriate; client for interactivity
- Supabase: browser client for user ops; route handlers for secrets
- Types in `types/database.ts`
- Env vars: never commit secrets; document in setup/deployment docs

---

# Security / Privacy (Summary)

From [Security Guide](./operations/SECURITY_GUIDE.md):

- Session required for payments and personal mutations
- **Gaps to respect:** `/api/ai/record-helper` and `/api/naver/search-place` unauthenticated today
- OAuth redirect sanitization in `/auth/callback`
- `places.is_public` defaults `true` in DB — product target is opt-in private

---

# Metrics (Summary)

From [Product Metrics](./operations/PRODUCT_METRICS.md):

- Favor retention and record quality over vanity DAU
- No in-app analytics spam; measure quietly

---

# Git / Release (Summary)

From [Git Workflow](./operations/GIT_WORKFLOW.md) and [Release Process](./operations/RELEASE_PROCESS.md):

- Branch per task; PR review; no force-push main
- Korean-first release notes ([Changelog Guide](./playbook/CHANGELOG_GUIDE.md))
- Tiered roadmap — finish Tier 1 polish before new features ([Roadmap Philosophy](./process/PRODUCT_ROADMAP_PHILOSOPHY.md))

---

# AI Forbidden Patterns

From [AI Design Rules](./foundation/AI_DESIGN_RULES.md) + [AI Prompt Guide](./architecture/AI_PROMPT_GUIDE.md):

| Do not | Do instead |
|--------|------------|
| Add social features (likes, comments, follows) | Saves and collections only |
| Show `error.code`, stack traces, env errors | Korean human message |
| Invent API routes or tables | Document + RFC first |
| Hardcode colors bypassing tokens | Use design system |
| Mock homepage content as permanent | Replace with real empty/entry states |
| Label UI "MVP" or "Beta" to users | Ship calm production copy |
| Generate review/ranking AI tone | Diary memory polish only |
| Large refactors without plan | Match [Development Playbook](./playbook/DEVELOPMENT_PLAYBOOK.md) |

---

# Default Implementation Order

Per [Product Roadmap Philosophy](./process/PRODUCT_ROADMAP_PHILOSOPHY.md) **Tier 1** (before new features):

1. Token migration — remove hardcoded hex
2. Remove mock homepage content
3. Unify PlaceCard variants
4. Humanize all user-facing errors (incl. Naver API mapping)
5. Skeleton loading states
6. Navigation hub refactor

Then Tier 2: empty states, accessibility pass, payment UX polish.

**Do not start Tier 3+ features until Tier 1 checklist is done** unless explicitly requested.

---

# Before Coding, Read These Docs

| Task type | Read first |
|-----------|------------|
| Any implementation | This file + [Development Playbook](./playbook/DEVELOPMENT_PLAYBOOK.md) |
| UI/component | [Design System v2](./foundation/DESIGN_SYSTEM_V2.md), [Component Spec](./architecture/COMPONENT_SPECIFICATION.md), [Visual Language](./foundation/VISUAL_LANGUAGE_GUIDE.md) |
| New feature | [Feature RFC Template](./process/FEATURE_RFC_TEMPLATE.md), [Core Principles](./foundation/CORE_PRODUCT_PRINCIPLES.md) |
| API route | [API Specification](./api/API_SPECIFICATION.md), [Security Guide](./operations/SECURITY_GUIDE.md) |
| Database | [Database Schema](./database/DATABASE_SCHEMA.md) |
| Release | [Release Process](./operations/RELEASE_PROCESS.md), [Changelog Guide](./playbook/CHANGELOG_GUIDE.md) |

---

# Final AI Self-Checklist

Before marking work complete:

- [ ] Matches Re:Place identity (archive, Korean-first, quiet)
- [ ] No forbidden social/growth patterns
- [ ] Errors are human Korean — no codes in UI
- [ ] Uses design tokens, not ad-hoc hex
- [ ] RLS respected; no unnecessary service role
- [ ] No invented routes/tables without RFC
- [ ] Scope minimal — no drive-by refactors
- [ ] Relevant docs updated if behavior changed
- [ ] No secrets committed
- [ ] Changelog entry drafted if user-visible

---

## Closing

This pack is the **compressed soul** of Re:Place docs. When in doubt, open the linked authority document — never guess product or schema behavior.

---

*AI Context Pack v1.0 — start here before implementation.*

---

This document is part of the Re:Place documentation system.
