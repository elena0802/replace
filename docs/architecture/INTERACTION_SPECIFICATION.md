---
title: Interaction Specification
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Interaction Specification

**Document type:** Interaction system reference  
**Status:** v1.0 — permanent reference  
**Authority:** Subordinate to [Visual Language Guide](../foundation/VISUAL_LANGUAGE_GUIDE.md) and [Design System v2](../foundation/DESIGN_SYSTEM_V2.md)  
**Companion docs:** [Information Architecture](INFORMATION_ARCHITECTURE.md) · [Component Specification](COMPONENT_SPECIFICATION.md)  
**Purpose:** Define how every interaction in Re:Place should behave and answer: **How should every interaction feel?**

---

## How to Use This Document

Interactions must feel like **closing a notebook** — deliberate, soft, final. Not like refreshing a feed or winning a game.

When implementing or reviewing UI, map each user action to a section below. If behavior is unspecified, default to **calm confirmation** and **minimal motion**.

---

# 1. Interaction Philosophy

| Principle | Interaction expression |
|-----------|------------------------|
| **Quiet feedback** | Actions confirm — they do not celebrate |
| **Predictable** | Same gesture → same outcome across screens |
| **Reversible when costly** | Delete/remove always confirm |
| **Content-first** | Interactions serve memory — not chrome |
| **Mobile-native** | Touch targets 44px; thumb-zone primary actions |
| **Accessible** | Keyboard, focus, reduced motion — no information in animation alone |

Reference: [Visual Language Guide §8](../foundation/VISUAL_LANGUAGE_GUIDE.md) Motion Philosophy; [Design System v2 §10](../foundation/DESIGN_SYSTEM_V2.md) Motion Principles.

---

# 2. Tap / Click Behavior

### Primary actions (buttons, card links)

| Phase | Behavior |
|-------|----------|
| **Default** | Clear label; one primary per section |
| **Press** | Optional subtle opacity (0.92) — no scale bounce |
| **Release** | Navigate or submit; loading state on button |
| **Disabled** | `opacity ~0.55`; no hover; `cursor-not-allowed` |

### Card tap (PlaceCard, CollectionCard)

- **Whole card is hit target** (link wrapper)
- **Hover (desktop):** translateY −2px, shadow promote, border tint — 200ms
- **Active:** no scale
- **Focus:** 3px outline, 4px offset — visible keyboard ring

### Text links

- Underline on hover optional for inline; nav links use color/weight shift
- **No** `target="_blank"` for internal routes

### Toggle (save place)

- **Optimistic UI allowed** for save toggle — revert on error with message
- **Aria:** `aria-pressed` on toggle button
- Icon fill transition 120ms when icon system ships

---

# 3. Hover Behavior

| Element | Hover |
|---------|-------|
| Primary button | Darken bg, shadow md |
| Secondary button | Accent subtle bg, border interactive |
| Ghost / text | Accent subtle bg |
| Card | Lift + shadow (desktop only meaningful) |
| Destructive | Darker border/blush — no red flash |
| Disabled | No hover change |

**Rule:** No hover-only information (tooltips for essential labels forbidden). Hover enhances — does not reveal required content.

---

# 4. Focus States

Per [Design System v2](../foundation/DESIGN_SYSTEM_V2.md):

| Property | Value |
|----------|-------|
| Outline | 3px `--color-primary-hover` |
| Offset | 4px |
| Applies to | buttons, links, inputs, cards (as links), modal close, sheet handles |

### Focus order

1. Logical DOM order on forms
2. Modal open → focus first focusable inside trap
3. Modal close → return focus to trigger
4. Skip links optional future — not required v1

**Never** remove focus outline without equivalent visible indicator.

---

# 5. Keyboard Navigation

| Context | Keys |
|---------|------|
| **Global** | Tab / Shift+Tab between interactives |
| **Modal / sheet** | Escape closes; Tab trapped |
| **Dropdown (place search)** | Escape closes; arrow keys in list (target) |
| **Details/summary** | Enter/Space toggles |
| **Forms** | Enter submits from single-line fields; not accidental submit from textarea |

### Place search dropdown

- Escape → close dropdown
- Blur → close after short delay (allow click on result)

---

# 6. Loading States

### Hierarchy (prefer top → bottom)

| Priority | Pattern | When |
|----------|---------|------|
| 1 | **Skeleton** | List/grid/detail layout known |
| 2 | **Inline button loading** | Submit, save toggle in flight |
| 3 | **Route `loading.tsx`** | Next.js navigation to data page |
| 4 | **StatusMessage full box** | Rare full-page; errors — not routine lists |

### Skeleton behavior

- Pulse opacity 0.4 ↔ 0.7, 1.5s loop
- Match final geometry: image block + text lines
- No spinner as sole list content (target state)

### Current debt

List pages use `StatusMessage` “불러오는 중…” — migrate to skeleton per [Product Roadmap Philosophy](../process/PRODUCT_ROADMAP_PHILOSOPHY.md) Tier 1.

---

# 7. Skeleton Behavior

| Surface | Skeleton shape |
|---------|----------------|
| Place grid | 4:3 image rect + 3 text bars |
| Collection grid | 16:10 cover + 2 text bars |
| Place detail | Hero 16:10 + title bar + memory lines |
| Form | Not skeleton — disabled fields or spinner on submit only |

**Transition:** skeleton → content crossfade 200ms; no layout shift if geometry matches.

---

# 8. Empty States

Use `EmptyState` component pattern.

| Property | Spec |
|----------|------|
| Tone | Invitation — not failure |
| Structure | Title (H2) + description + **one** CTA |
| Auth empty | Explain login need + link to `/login` |
| Data empty | Suggest next action (create, explore) |

**Never:** “Oops!”, party emoji, large illustration dominating screen.

---

# 9. Success States

| Context | Behavior |
|---------|----------|
| **Form submit** | Inline banner (success tokens) + optional redirect ≥800ms |
| **Save place toggle** | Button label “저장됨”; no modal |
| **Add to collection** | Close modal + brief inline success or toast |
| **Remove from collection** | Inline success message on detail |
| **Delete place** | Redirect to `/my-places` — no confetti |
| **Payment success** | Dedicated result page — calm copy |

### Copy tone

- “좋은 장소가 기록되었습니다.”
- Not: “🎉 대단해요!”

---

# 10. Error States

### User-facing rules ([AI Design Rules](../foundation/AI_DESIGN_RULES.md))

| Type | Presentation |
|------|--------------|
| **Field error** | Below field, Small, error color |
| **Form error** | Banner at top of form |
| **List fetch error** | StatusMessage tone error — full width |
| **Inline action error** | Below button, max-width ~16rem |
| **Auth required** | EmptyState or inline with login link |

### Copy pattern

> [What happened]. [What to do].

Example: “잠시 불러오지 못했어요. 다시 시도해주세요.”

**Forbidden in UI:** Supabase, API, error codes, stack traces, “설정을 확인해주세요.”

### Retry

- List errors: user refreshes page or navigates away — explicit retry button optional
- Form errors: fix and resubmit
- Payment errors: link to `/pricing` retry

---

# 11. Save Flow

### Save public place (bookmark)

```
Tap 저장하기
  → if not logged in: inline “로그인이 필요합니다” + link
  → if logged in: optimistic toggle
  → on error: revert + inline error
```

- No modal on success
- No share prompt after save

### Save to collection

```
Tap 컬렉션에 담기
  → open modal/sheet
  → list collections (radio) or empty prompt to create
  → confirm 담기
  → close + success feedback
```

- Modal blocks background interaction
- Escape closes

---

# 12. Delete Flow

### Place delete (owner)

```
Tap 삭제하기
  → confirmation MODAL (not window.confirm)
  → clear consequence copy
  → confirm destructive / cancel secondary
  → on success: redirect /my-places
  → on error: inline error, remain on page
```

**Target:** Replace current `window.confirm` with Dialog component.

### Remove from collection

- Lighter consequence — confirm optional if single tap risk; prefer confirm for bulk
- Success: update grid in place

### Collection delete

- Modal with consequence (“포함된 장소 링크가 제거됩니다”)
- Destructive confirm

---

# 13. Edit Flow

```
Detail → 수정하기 → /places/[id]/edit
  → form pre-filled
  → submit → success message → redirect detail or my-places
```

- Cancel: back link or browser back — no save
- Unsaved changes: browser beforeunload optional — prefer explicit “나가기” in RFC

---

# 14. Create Flow

```
/places/new
  → auth gate (loading → login EmptyState)
  → PlaceForm
      1. Photo (optional)
      2. Place search + memory (required)
      3. 추가 정보 (collapsed default on create — public/private must surface near submit long-term)
  → submit → progress on button (“기록하는 중…”)
  → success banner → redirect /my-places (~1s)
```

### AI record helper

- Opt-in button — not auto-run
- Loading: button text “기록을 다듬는 중…”
- Apply fills memory — user edits before save

### Image crop

- Modal (`ImageCropModal`) — crop confirm/cancel
- No navigation until complete or cancel

---

# 15. Collection Interactions

| Action | Interaction |
|--------|-------------|
| Create | Form on `/collections` — inline success message |
| Open | Card link → detail |
| Add place | From place detail modal — select collection |
| Remove place | Per-card button on owner detail — loading “제거하는 중…” |
| Edit metadata | Owner modal on detail |
| Delete collection | Owner destructive modal |

---

# 16. Share Interactions

### Kakao share

- Explicit button on **public** place detail only
- Tap → SDK load → share sheet (Kakao)
- Error: inline below button — humanized

**Never:** auto-share after save; share counts; “share to unlock.”

---

# 17. Confirmation Dialogs

Use **Dialog** component — not native `confirm`/`alert`.

| Scenario | Title tone | Actions |
|----------|------------|---------|
| Delete place | Serious, short | 삭제하기 (destructive) + 취소 |
| Delete collection | Same | Same |
| Discard edit (future) | Neutral | 나가기 + 계속 수정 |

### Anatomy

- Scrim `--color-surface-scrim`
- Panel centered (desktop) or bottom sheet (mobile) per modal rules
- Focus trap + Escape
- Click scrim → close (non-destructive only; destructive may require explicit cancel)

---

# 18. Bottom Sheets

Use for mobile-first secondary tasks.

| Use | Example |
|-----|---------|
| Directions | `DirectionsBottomSheet` — map app links |
| Short menus | Future: place detail overflow |
| Add to collection | Acceptable on mobile |

### Behavior

- Enter: scrim fade + sheet translateY 8px→0, 320ms
- Drag handle visible on mobile
- Close: X button, scrim tap, Escape
- Focus trap while open

---

# 19. Modal Rules

| Rule | Detail |
|------|--------|
| **One modal at a time** | No stack |
| **Purpose** | Focused decision — collection pick, delete confirm, crop |
| **Width** | max-w-md typical |
| **Radius** | `--radius-md` |
| **Shadow** | `--shadow-lg` |
| **Scroll** | Body scroll locked |
| **Primary action** | Right or full-width bottom on mobile |

**Not modals:** full create form (page), place detail (page).

---

# 20. Toast Rules

Toasts are **secondary** to inline success — use sparingly.

| Use toast | Use inline instead |
|-----------|-------------------|
| Background action completed after navigation | Form success before redirect |
| Copy address “복사됨” | Already inline on location card |
| Non-blocking confirm | Save toggle |

### Toast spec (when implemented)

- Position: bottom center, above mobile safe area
- Duration: 3s default
- Motion: slide 8px + fade 200ms
- Max one toast visible
- Korean, Short

**No** toast for errors that need retry UI — use banner or inline.

---

# 21. Motion References

From [Design System v2 §10](../foundation/DESIGN_SYSTEM_V2.md):

| Token | Duration | Use |
|-------|----------|-----|
| `--motion-fast` | 120ms | hover colors |
| `--motion-base` | 200ms | card lift, toast |
| `--motion-slow` | 320ms | modal/sheet |
| `--motion-emphasis` | 400ms | optional section reveal |

### `prefers-reduced-motion`

All durations → 0ms; opacity changes instant; information never lost.

---

# 22. Interaction Anti-Patterns

| Anti-pattern | Why |
|--------------|-----|
| `window.confirm` / `alert` | Breaks calm branded flow |
| Confetti / bounce on save | Gamification |
| Auto-advancing carousel | Consumption loop |
| Infinite scroll | Feed behavior |
| Optimistic delete without undo | Trust risk — confirm required |
| Double primary CTAs | Decision paralysis |
| Loading spinner only | Feels slow vs skeleton |
| Technical error toast | Breaks trust |
| Share modal immediately after create | Performance pressure |
| Pull-to-refresh on archive lists | Social app trope |
| Swipe-to-delete without confirm | Accidental loss |
| Haptic overload (future mobile) | Not calm |

---

# 23. Accessibility Interaction Rules

| Requirement | Implementation |
|-------------|----------------|
| Touch target | Min 44×44px |
| Focus visible | All interactives |
| Color not sole state | Icons + text for save/saved |
| `aria-live` | Inline errors polite; form success status |
| `role="alert"` | Error banners |
| `role="status"` | Loading when no skeleton |
| Modal | `aria-modal`, labelled title |
| Images | Meaningful `alt` on content images |

---

# 24. Decision Checklist

Before shipping an interaction:

- [ ] Feels **calm** — no celebration, bounce, or urgency
- [ ] **Consistent** with same action elsewhere (save, delete, submit)
- [ ] **Destructive** actions use Dialog — not native confirm
- [ ] **Loading** uses skeleton or inline button state — not blocking text box for lists
- [ ] **Errors** humanized — no infrastructure leak
- [ ] **Success** understated — user knows outcome
- [ ] **Focus** and **keyboard** work
- [ ] **Reduced motion** respected
- [ ] **One primary action** per section
- [ ] Aligns with [Visual Language Guide](../foundation/VISUAL_LANGUAGE_GUIDE.md) motion philosophy

---

*Interaction Specification v1.0 — how every interaction in Re:Place should feel.*

---

This document is part of the Re:Place documentation system.
