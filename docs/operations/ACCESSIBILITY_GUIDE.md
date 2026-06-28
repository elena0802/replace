---
title: Accessibility Guide
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Accessibility Guide

**Document type:** Accessibility standards reference  
**Status:** v1.0 — permanent reference  
**Authority:** Subordinate to [Visual Language Guide](../foundation/VISUAL_LANGUAGE_GUIDE.md) §11; implements [Interaction Specification](../architecture/INTERACTION_SPECIFICATION.md)  
**Companion docs:** [Design System v2](../foundation/DESIGN_SYSTEM_V2.md) · [Component Specification](../architecture/COMPONENT_SPECIFICATION.md) · [Release Process](RELEASE_PROCESS.md)  
**Purpose:** Define accessibility standards for every screen — **part of product quality, not compliance checkbox**

---

## How to Use This Document

Accessibility in Re:Place is **calm design made universal** ([Visual Language Guide](../foundation/VISUAL_LANGUAGE_GUIDE.md)). Low contrast and tiny targets create anxiety — exclusion breaks trust.

Apply this guide to **every new screen and component**. Include accessibility in [Release Process](RELEASE_PROCESS.md) review before production.

Target: **WCAG 2.2 Level AA** principles — warm palette must still meet contrast and usability requirements.

---

# Accessibility Philosophy

| Principle | Re:Place expression |
|-----------|---------------------|
| **Clarity reduces load** | Readable type, generous line height — calm for everyone |
| **Keyboard is first-class** | Archive must work without pointer |
| **Focus is visible** | Soft but unmistakable — olive outline, not removed |
| **Motion is optional** | `prefers-reduced-motion` — information never in animation alone |
| **Words over color** | State not conveyed by color only |
| **Touch without precision stress** | 44px targets — recording on location |
| **Errors guide** | Associated messages — not color-only |

Accessibility is not a bolt-on — it is how we honor **every archivist**.

---

# Keyboard Navigation

Reference: [Interaction Specification](../architecture/INTERACTION_SPECIFICATION.md) §5.

### Global

| Key | Behavior |
|-----|----------|
| Tab / Shift+Tab | Move focus between interactives in logical order |
| Enter / Space | Activate buttons, links, summary/details |
| Escape | Close modal, sheet, dropdown |

### Requirements

- All actions available via keyboard (or equivalent alternative)
- No keyboard traps except modals with Escape exit
- Skip to main content — target future enhancement
- Mobile: external keyboard on tablet must work

### Focus order

1. Header nav
2. Main content (top to bottom)
3. Footer

Modals: trap focus inside until closed.

---

# Focus Management

Per [Design System v2](../foundation/DESIGN_SYSTEM_V2.md) §11.4:

| Property | Spec |
|----------|------|
| Outline | 3px `--color-primary-hover` |
| Offset | 4px |
| Never | `outline: none` without replacement |

### Modal / sheet open

1. Move focus to first focusable (close button or primary action)
2. Trap Tab cycle inside
3. On close: return focus to trigger element

### Route change

- Focus management on client navigation — target: move focus to `h1` or main landmark (future enhancement)

### Dropdown (place search)

- Escape closes
- Arrow key navigation through results (target)

---

# Color Contrast

Warm palette **must** meet readable contrast.

### Minimum targets (WCAG AA)

| Pair | Ratio target |
|------|--------------|
| Body text on surface | ≥ 4.5:1 |
| Large text (≥18px bold / 24px) | ≥ 3:1 |
| UI components & graphical objects | ≥ 3:1 |
| Error text on blush surface | Verify — adjust `--color-error` if needed |
| Primary button label on moss fill | Verify white/cream on `#87977F` |

### Rules

- **Soft ≠ faint** — tertiary text still readable in daylight
- Do not use color alone for errors — icon or text label
- Placeholder not sole label — visible `<label>` required
- Test with WebAIM contrast checker when adding tokens

---

# Typography

Align with [Design System v2 §2](../foundation/DESIGN_SYSTEM_V2.md).

| Requirement | Detail |
|-------------|--------|
| Body size | ≥ 16px for reading text |
| Line height | ≥ 1.5 for Korean multi-line |
| Resize | Support browser text zoom to 200% without loss of function |
| No ALL CAPS Korean | Readability |
| Hierarchy | Size + weight — not color alone |

---

# Touch Targets

| Requirement | Size |
|-------------|------|
| Minimum interactive | **44×44 CSS px** |
| Spacing | Adequate gap between adjacent targets |
| Cards as links | Full card clickable — one target |

Especially critical on:

- `/places/new` form
- Place detail actions (save, share, directions)
- Mobile nav menu items

---

# Screen Reader Behavior

### Landmarks

| Element | Tag |
|---------|-----|
| Header nav | `<header>` + `<nav>` |
| Main | `<main>` |
| Footer | `<footer>` |
| Page title | Single `<h1>` per route |

### Headings

- Logical order — no skipped levels for styling
- Card titles: `<h3>` inside lists — not `<h1>`

### Images

| Type | `alt` |
|------|-------|
| Place photo | `"{place name} 사진"` |
| Decorative | `alt=""` |
| Empty placeholder | Text content inside — not redundant alt |

### Dynamic updates

| Event | Technique |
|-------|-----------|
| Inline error | `role="alert"` or `aria-live="assertive"` sparingly |
| Loading | `role="status"` on StatusMessage |
| Save toggle notice | `aria-live="polite"` |
| Toggle button | `aria-pressed` |

### Icons

- Decorative icons: `aria-hidden="true"`
- Icon-only buttons: **required** `aria-label` ([Component Specification](../architecture/COMPONENT_SPECIFICATION.md))

### Unicode symbols

- Replace ♥/♡ with labeled icon or text “저장됨” — screen readers read Unicode inconsistently

---

# Form Accessibility

Reference: `PlaceForm`, `LoginForm`, `CollectionsList` create forms.

| Requirement | Implementation |
|-------------|----------------|
| Labels | Visible `<label>` associated via `htmlFor` / `id` |
| Required | “(필수)” in label — `aria-required="true"` |
| Errors | `aria-invalid="true"` + `aria-describedby` pointing to error id |
| Hints | `aria-describedby` for helper text |
| Grouping | `<fieldset>` + `<legend>` for radio groups |
| Autocomplete | `autoComplete` on login fields |

### Place search

- `aria-autocomplete="list"`
- `aria-controls` when dropdown open
- Dropdown results in associated listbox (target enhancement)

---

# Modal Accessibility

Per [Interaction Specification](../architecture/INTERACTION_SPECIFICATION.md) §17–19.

| Attribute | Value |
|-----------|-------|
| `role` | `dialog` |
| `aria-modal` | `true` |
| Title | `aria-labelledby` on heading |
| Focus | Trap + Escape |
| Scrim | Click to close — only non-destructive modals |

Destructive delete: scrim click should **not** dismiss without explicit cancel.

---

# Loading Accessibility

| Pattern | A11y |
|---------|------|
| Skeleton | `aria-busy="true"` on container; remove when loaded |
| StatusMessage loading | `role="status"` |
| Button loading | `aria-disabled` or disabled + label “저장하는 중…” |
| No infinite spinner without text | Provide visible “불러오는 중” or skeleton |

Do not rely on motion alone for loading state.

---

# Error Accessibility

| Pattern | A11y |
|---------|------|
| Field error | Linked via `aria-describedby`; not color-only |
| Form banner | `role="alert"` |
| List error | StatusMessage `role="alert"` |
| Login errors | `role="alert"` in banner |

Messages must be **understandable** — plain Korean, no codes ([Security Guide](SECURITY_GUIDE.md)).

---

# Motion Accessibility

Per [Design System v2 §10.4](../foundation/DESIGN_SYSTEM_V2.md) and [Visual Language Guide](../foundation/VISUAL_LANGUAGE_GUIDE.md) §8.

```css
@media (prefers-reduced-motion: reduce) {
  /* durations → 0ms; opacity instant */
}
```

| Allowed with reduced motion | Forbidden as only signal |
|----------------------------|---------------------------|
| Instant state change | Skeleton pulse required to know loading |
| Opacity fade optional | Content only appears after bounce |

---

# Semantic HTML

| Use | Not |
|-----|-----|
| `<button>` for actions | `<div onClick>` |
| `<a href>` for navigation | Button styled as link for route change |
| `<main>`, `<nav>`, `<article>` | Div soup |
| `<h1>`–`<h3>` hierarchy | Styled `<div>` headings |
| `<ul>`/`<li>` for nav lists (optional) | — |
| Native `<details>` for 추가 정보 | Custom accordion without keyboard |

---

# Testing Checklist

Run before release with UI changes.

### Automated (target)

- [ ] axe or Lighthouse accessibility scan — fix critical/serious
- [ ] eslint jsx-a11y where configured

### Manual keyboard

- [ ] Tab through entire changed flow without trap
- [ ] Escape closes modals/sheets
- [ ] Enter submits forms appropriately
- [ ] Focus visible on every stop

### Screen reader (spot check)

- [ ] VoiceOver (macOS/iOS) or NVDA (Windows) on one core flow
- [ ] H1 announced on page load
- [ ] Form errors announced
- [ ] Toggle save state clear

### Visual

- [ ] 200% zoom usable
- [ ] Contrast spot-check on new tokens
- [ ] Touch targets on mobile

### Motion

- [ ] Reduced motion OS setting — no lost information

---

# Accessibility Anti-Patterns

| Anti-pattern | Why |
|--------------|-----|
| Removing focus outline | Keyboard users lost |
| Placeholder as only label | Screen readers, memory |
| Color-only error states | Color-blind users |
| Icon-only without label | Unknown action |
| `div` button | No semantics, keyboard |
| Auto-playing motion | Vestibular disorders |
| Tiny text to fit dashboard density | Readability |
| Low contrast “aesthetic” gray | Exclusion |
| `window.alert` | Poor SR experience + off-brand |
| Infinite scroll without announcement | Disorientation |
| Time limits on forms | Anxiety — not used |

---

# Decision Checklist

Before shipping UI:

- [ ] Keyboard path complete
- [ ] Focus visible and managed in modals
- [ ] Contrast verified on new color pairs
- [ ] 44px touch targets
- [ ] Labels, errors, required fields associated
- [ ] Images have correct `alt`
- [ ] Dynamic updates use live regions appropriately
- [ ] `prefers-reduced-motion` respected
- [ ] Semantic HTML for new components
- [ ] Tested manually per §Testing Checklist

---

## Closing

An archive nobody can read is not trustworthy. Re:Place accessibility is how we keep the promise that **everyone** can record and revisit the places they loved — calmly, clearly, and with dignity.

---

*Accessibility Guide v1.0 — accessibility standards for every Re:Place screen.*

---

This document is part of the Re:Place documentation system.
