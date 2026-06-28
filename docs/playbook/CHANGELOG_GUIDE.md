---
title: Changelog Guide
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Changelog Guide

**Document type:** Release notes policy  
**Status:** v1.0 — permanent reference  
**Authority:** Subordinate to [Release Process](../operations/RELEASE_PROCESS.md) and [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md)  
**Companion docs:** [Git Workflow](../operations/GIT_WORKFLOW.md) · [Development Playbook](DEVELOPMENT_PLAYBOOK.md)  
**Purpose:** Define how Re:Place records product changes — **no CHANGELOG file is created by this guide alone**

---

## How to Use This Document

Draft changelog entries **before merge** when user-visible behavior changes. Use at release time per [Release Process](../operations/RELEASE_PROCESS.md). AI agents follow §8 when proposing entries.

---

# Changelog Philosophy

| Principle | Meaning |
|-----------|---------|
| **Users first** | Release notes explain *what changed for them* — not git history |
| **Calm tone** | Korean-first, no hype, no "🚀 Major update!!!" |
| **Honest scope** | Small fixes named small; no inflation |
| **Privacy respect** | No user data, emails, or internal URLs |
| **Traceability** | Link PR or RFC for internal audit — optional in public notes |

Changelog is a **trust artifact** — part of the archive product ethos.

---

# Why Changelog Matters

- Users understand sharing/privacy/payment changes
- Contributors see product evolution without reading diffs
- Support and future-you resolve "when did this break?"
- Release Process requires notes before deploy

---

# Changelog Format

Use **Keep a Changelog** spirit, Re:Place-adapted:

```markdown
## [YYYY-MM-DD] — Short release title (Korean)

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Removed
- ...

### Deprecated
- ...

### Security
- ...

### Documentation
- ...
```

Omit empty sections. One release block per deploy batch.

---

# Categories

| Category | Use when |
|----------|----------|
| **Added** | New feature, page, or capability users can access |
| **Changed** | Behavior or UI change — same feature, different experience |
| **Fixed** | Bug fix users would have noticed |
| **Removed** | Feature or UI removed |
| **Deprecated** | Still works; scheduled removal — rare for Re:Place |
| **Security** | Auth, RLS, privacy, payment hardening — describe safely without exploit detail |
| **Documentation** | User-visible help/copy only — not internal docs |

---

# User-Facing vs Internal

| Audience | Content | Location |
|----------|---------|----------|
| **User-facing** | Korean, plain language, no jargon | App release notes, blog, in-app modal (future) |
| **Internal** | PR links, migration IDs, env vars | PR description, team notes — not user changelog |

**Rule:** If the user cannot see or feel it, it usually belongs in **internal** notes only — unless Security (users may need to re-login, etc.).

---

# Korean-First Release Notes Guidance

- Lead with **what the user gains or avoids**
- Use 합니다/해요 style consistent with app copy
- Avoid English product jargon unless brand term (Re:Place Premium)
- Bad: "Refactored PlaceCard component for DRY"
- Good: "장소 카드 디자인을 통일해 목록에서 더 읽기 쉽게 했어요."

Payment/privacy changes require explicit clear language:

- Good: "비공개로 저장한 장소는 다른 사람에게 보이지 않아요."

---

# Examples

### Added (feature)

```markdown
### Added
- 컬렉션을 공개로 설정하면 링크로 다른 사람과 공유할 수 있어요.
```

### Changed (UX)

```markdown
### Changed
- 홈 화면의 예시 데이터를 제거하고, 기록이 없을 때 안내 문구를 보여줘요.
```

### Fixed

```markdown
### Fixed
- 결제 완료 후 로그인이 풀리던 문제를 수정했어요.
```

### Security (safe description)

```markdown
### Security
- 장소 검색 API에 접근 제한을 추가했어요.
```

Do **not** include: CVE-style exploit steps, secret names, raw error codes.

---

# What Not to Include

- Every commit or file touched
- Refactors with zero user impact
- Dependency bumps unless they fix user-visible bugs
- Internal RFC IDs in user-facing Korean notes (OK in internal section)
- Mock data removal as "Removed feature" — frame as **Fixed** or **Changed**
- Performance percentages without user context
- Roadmap promises not shipped in this release

---

# How AI Should Draft Changelog Entries

1. Read PR diff — list **user-visible** changes only
2. Pick one category per bullet
3. Write Korean user-facing bullet first
4. Add English internal bullet in PR if team bilingual — optional
5. Flag **Security** and **privacy** changes explicitly
6. Ask human if change affects sharing defaults or payments
7. Never invent changes not in diff

Template for AI output in PR:

```markdown
## Changelog (draft)

### Changed
- [KO] ...

## Internal
- PR: #___
- RFC: ___ (if any)
```

---

# Changelog Checklist

Before release:

- [ ] Every user-visible change has a bullet
- [ ] Categories correct
- [ ] Korean copy reviewed for calm tone
- [ ] No secrets, internal codes, or user PII
- [ ] Security/privacy changes called out
- [ ] Empty sections removed
- [ ] Matches [Release Process](../operations/RELEASE_PROCESS.md) pre-release item
- [ ] Stored in agreed location (repo CHANGELOG when created, or release notes doc)

**Note:** No root `CHANGELOG.md` exists yet — create it on first release using this format.

---

## Closing

Re:Place changelog entries should feel like **a quiet note in a diary margin** — factual, respectful, never loud. They complete the loop from planning to trust.

---

*Changelog Guide v1.0 — how Re:Place records change.*

---

This document is part of the Re:Place documentation system.
