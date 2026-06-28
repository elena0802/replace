---
title: Component Specification
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Component Specification

**Document type:** Component architecture reference  
**Status:** v1.0 — permanent reference  
**Authority:** Implements [Design System v2](../foundation/DESIGN_SYSTEM_V2.md); subordinate to [Visual Language Guide](../foundation/VISUAL_LANGUAGE_GUIDE.md)  
**Companion docs:** [Interaction Specification](INTERACTION_SPECIFICATION.md) · [Information Architecture](INFORMATION_ARCHITECTURE.md)  
**Purpose:** Define every major UI component and answer: **How should components be designed and extended?**

---

## How to Use This Document

1. **New UI** composes primitives from `components/ui/` (target) — not bespoke duplicated markup.
2. **Feature components** (`PlaceCard`, `PlaceDetail`) wrap primitives — they do not invent new tokens.
3. Before adding a component, check **taxonomy** and **anti-patterns** below.
4. Current codebase may predate `components/ui/` — migration is Tier 1 debt.

---

# 1. Component Philosophy

| Principle | Meaning |
|-----------|---------|
| **Composition over duplication** | One PlaceCard with variants — not FeaturedPlaceCard |
| **Tokens only** | No raw hex in components |
| **States are explicit** | loading, empty, error, disabled — designed not accidental |
| **Content leads** | Components frame memory — not compete with it |
| **Accessible by default** | Focus, labels, roles built in |
| **Mobile-first** | Touch targets and single-column defaults |

Components are **archival furniture** — shelves, labels, covers — not dashboard widgets.

---

# 2. Component Taxonomy

```
components/
├── ui/                    ← Primitives (target — Design System v2)
│   ├── Button, IconButton, Card, Input, …
│   └── Dialog, BottomSheet, Skeleton, PageHeader
├── [feature]/             ← Domain composition
│   ├── PlaceCard, CollectionCard, PlaceForm
│   └── PlaceDetail, CollectionsList
└── [integration]/         ← Third-party wrappers
    ├── PlaceMap, KakaoShareButton, PremiumCheckout
```

### Layers

| Layer | Role | Examples |
|-------|------|----------|
| **Primitive** | Token-bound, reusable, no domain logic | Button, Card, Input |
| **Pattern** | Repeated UI structure | PageHeader, EmptyState |
| **Feature** | Data + domain behavior | ExplorePlacesList, PlaceDetail |
| **Integration** | External SDK/API | PlaceMap, ImageCropModal |

**Rule:** Feature components may fetch data; primitives never fetch.

---

# 3. PageHeader

### Purpose

Unified page title block: eyebrow → H1 → lead → optional CTA slot.

### Responsibilities

- Orient user on list/form pages
- Replace copy-pasted header markup across routes
- One H1 per page

### Variants

| Variant | CTA |
|---------|-----|
| `default` | No CTA |
| `withAction` | Single secondary or primary button/link right-aligned on `sm+` |

### Composition

```
PageHeader
├── eyebrow (Small, brand color)
├── title (H1)
├── description (Lead)
└── action? (Button link)
```

### States

- Static only

### Responsive

- Stack title + action on mobile; `flex-row items-end justify-between` on `sm+`

### Accessibility

- H1 is real `<h1>`; eyebrow is `<p>` not heading

### Token usage

- Text: `--color-text-brand`, `--color-text-primary`, `--color-text-secondary`
- Spacing: `--space-8` below header

### Interaction

- CTA follows Button spec

### Do

- Use on explore, saved, collections, my-places, pricing, places/new

### Don't

- Put H1 styling on card titles
- Two CTAs in header action slot

---

# 4. Navigation

### Purpose

Global orientation: logo, primary routes, auth.

### Responsibilities

- Link to primary IA destinations
- Show active route (target)
- Auth entry/logout

### Variants

| Variant | Viewport |
|---------|----------|
| `header-inline` | Desktop `md+` |
| `header-menu` | Mobile `<details>` (current — migrate to bottom nav) |
| `bottom-tabs` | Mobile target: 기록 / 둘러보기 / 내 아카이브 |

### Composition

```
Navigation
├── Logo
├── NavLinks[]
└── AuthNav
```

### States

- `active` link (target)
- `open` mobile menu

### Responsive

- See [Information Architecture](INFORMATION_ARCHITECTURE.md) §5–7

### Accessibility

- `<nav>` landmark; current page `aria-current="page"`

### Token usage

- Header height `--layout-header-height`
- Background page bg + blur

### Interaction

- Menu closes on navigate (target)

### Do

- Keep ≤5 top-level items

### Don't

- Add notification bell; engagement badges

---

# 5. BottomNavigation

### Purpose

Mobile primary IA — thumb-zone access to create, discover, archive.

### Responsibilities

- Three–four tabs max
- Fixed bottom safe area

### Variants

| Tab set (target) |
|------------------|
| 기록하기, 둘러보기, 내 아카이브, (계정) |

### States

- Active tab indicator

### Responsive

- `md:hidden` or show only below breakpoint

### Accessibility

- `role="navigation"`; labels visible; not icon-only without `aria-label`

### Do

- Ship with archive hub RFC

### Don't

- Duplicate all seven current header links

---

# 6. Button

### Purpose

Primary user commitment — one clear action.

### Responsibilities

- Execute submit, navigate, open modal
- Show loading label

### Variants

| Variant | Design System |
|---------|---------------|
| `primary` | Moss fill |
| `secondary` | Surface + border |
| `ghost` | Transparent |
| `destructive` | Blush error |

### Sizes

`sm` (36px), `md` (44px), `lg` (48px)

### States

`default`, `hover`, `focus`, `disabled`, `loading` (label change)

### Responsive

- Full width on mobile for form submit; auto width on `sm+` optional

### Accessibility

- `<button type="button|submit">`; disabled not on critical confirm without explanation

### Token usage

- Per [Design System v2 §6](../foundation/DESIGN_SYSTEM_V2.md)

### Interaction

- Per [Interaction Specification](INTERACTION_SPECIFICATION.md) §2–3

### Do

- One primary per section
- Verb-first Korean labels

### Don't

- Two primaries side by side
- Unicode hearts as icons

---

# 7. IconButton

### Purpose

Compact icon-only control where label would clutter (close, copy).

### Responsibilities

- Single icon action
- Must have accessible name

### Variants

`ghost` (default), `outline`

### States

Same as Button

### Sizes

36px or 40px hit area minimum 44px with padding

### Accessibility

- **Required** `aria-label` — icon-only never unlabeled

### Do

- Close modal, copy address, password visibility toggle

### Don't

- Primary record CTA as icon-only

---

# 8. Card

### Purpose

Surface container for archival content — place, collection, form section.

### Responsibilities

- Elevation, border, radius, padding
- Optional hover lift when interactive

### Variants

| Variant | Usage |
|---------|-------|
| `default` | Static panel |
| `interactive` | Link wrapper — hover lift |
| `inset` | Form sections on `--color-bg-subtle` |

### States

`default`, `hover` (interactive), `focus-visible` (interactive)

### Composition

```
Card
├── media? (aspect ratio slot)
├── body (padding)
└── footer? (border-top subtle)
```

### Token usage

- `--radius-md`, `--shadow-md`, `--color-surface-default`, `--color-border-default`

### Do

- Wrap PlaceCard and CollectionCard content

### Don't

- Nest interactive cards

---

# 9. PlaceCard

### Purpose

Represent one place record in a grid or carousel.

### Responsibilities

- Display image, category, region, name, memory, revisit footer
- Link to `/places/[id]` unless `href` null (forbidden in production)

### Variants

| Variant | Media | Radius |
|---------|-------|--------|
| `grid` | 4:3 | md |
| `featured` | 4:3 or 16:10 | lg |
| `compact` | 4:3 | md, no footer |

### States

- Image / EmptyCard fallback
- Overlay badges: 공개/비공개, 저장일 (absolute)

### Responsive

- Full width mobile; grid 1→2→3 columns

### Accessibility

- Link `aria-label="{name} 상세 보기"`
- Image: `alt` or decorative fallback text in card

### Token usage

- Chip for category; Meta for region

### Interaction

- Whole card navigates; hover lift desktop

### Do

- Use Next.js `Image` (target) — migrate from background-image
- Single component for homepage featured + explore

### Don't

- `FeaturedPlaceCard` duplicate
- Mock cards with `href: null` on homepage

---

# 10. CollectionCard

### Purpose

Represent one collection in grid or carousel.

### Responsibilities

- Cover image via `CollectionCoverImage`
- Name, description, count, visibility, date
- Link to `/collections/[id]`

### Variants

`grid`, `carousel` (fixed ~240px width)

### States

- Empty cover placeholder
- Hover lift

### Composition

```
CollectionCard
├── CollectionCoverImage
├── meta chips
├── title + description
└── “열어보기” optional
```

### Do

- Reuse on homepage when wired to real data

### Don't

- Hardcoded mock carousel separate from this component

---

# 11. FormField

### Purpose

Label + control + error helper wrapper.

### Responsibilities

- Associate label `htmlFor` with input
- Show required “(필수)”
- Display field-level error

### Variants

`text`, `textarea`, `select`, `radio-group`, `checkbox`

### States

`default`, `focus`, `error`, `disabled`

### Accessibility

- `aria-invalid`, `aria-describedby` for errors

### Token usage

- Label: Body Strong; error: Small `--color-error`

### Do

- Wrap all PlaceForm inputs (target refactor)

### Don't

- Red asterisk alone without Korean required marker

---

# 12. TextArea

### Purpose

Multi-line memory input (“한 줄 기록” may expand).

### Responsibilities

- Min 3 rows; vertical resize only

### States

Same as Input

### Token usage

- Body Strong 16px — not xl

### Do

- Use for memory field

### Don't

- Oversized `text-xl` (current debt)

---

# 13. Input

### Purpose

Single-line text, email, password, search.

### Responsibilities

- 44px min height
- Placeholder tertiary color

### Variants

`default`, `search` (with icon), `password` (with visibility toggle)

### States

`default`, `focus`, `error`, `disabled`

### Token usage

- `--radius-sm`, focus ring sage

### Interaction

- Place search opens `PlaceSearchDropdown` below

---

# 14. Badge

### Purpose

System/state metadata — visibility, dates on overlays.

### Responsibilities

- Display-only status

### Variants

`neutral`, `accent`, `success`, `warning`, `error`

### States

Static

### Token usage

- Per Design System §9.2

### Do

- 공개/비공개 on cards and detail

### Don't

- “NEW”, “HOT”, streak counts

---

# 15. Chip

### Purpose

Taxonomy — category, space tags, counts.

### Responsibilities

- Categorize content
- Toggle in forms (space tags)

### Variants

`filled` (default), `outline` (rare)

### States

`default`, `selected` (form toggle)

### Do

- Category on cards

### Don't

- Use as primary button

---

# 16. EmptyState

### Purpose

Page-level no-data invitation.

### Responsibilities

- Title + description + one CTA
- Auth-required variant

### Variants

`default`, `compact` (optional less padding)

### States

Static

### Composition

- Centered; `rounded-3xl` card surface

### Do

- Login required, no data, not found (with CTA to explore)

### Don't

- Whimsical illustration; failure tone

**Current:** `components/EmptyState.tsx` — migrate to `ui/EmptyState` with token classes.

---

# 17. LoadingSkeleton

### Purpose

Layout-preserving loading placeholder.

### Responsibilities

- Match final component geometry
- Pulse animation

### Variants

`place-card`, `collection-card`, `place-detail-hero`, `text-lines`

### States

`animating` | respects reduced motion

### Do

- Replace StatusMessage for list loading

### Don't

- Generic gray box without proportions

---

# 18. Dialog

### Purpose

Focused decision — delete confirm, edit collection metadata.

### Responsibilities

- Focus trap, scrim, title, body, actions
- Replace `window.confirm`

### Variants

`default`, `destructive` (blush border title area)

### States

`open`, `closed`

### Responsive

- Centered modal `sm+`; may use full-width bottom on mobile

### Accessibility

- `role="dialog"`, `aria-modal`, labelled title, Escape close

### Interaction

- Per Interaction Spec §17

### Do

- Delete place/collection confirm

### Don't

- Stack dialogs; use for full create flow

---

# 19. BottomSheet

### Purpose

Mobile-first secondary panel — directions, future overflow menu.

### Responsibilities

- Scrim + sheet + handle
- Focus trap

### Variants

`default`, `menu` (list of actions)

### States

`open`, `closed`

### Current

`DirectionsBottomSheet`, `SaveToCollectionButton` modal pattern — unify over time.

### Do

- Directions, add-to-collection on mobile

### Don't

- Primary navigation in sheet only

---

# 20. Dropdown

### Purpose

Anchored list — place search results, future select menus.

### Responsibilities

- Position below trigger
- Keyboard navigation (target)
- Close on select / Escape

### Variants

`search-results`, `menu`

### Current

`PlaceSearchDropdown` — loading, empty, error inline states

### Do

- Show Naver search results in create form

### Don't

- Use for primary nav

---

# 21. SearchBar

### Purpose

Scoped search input — archive search (future), place attach search (today: inside form).

### Responsibilities

- Debounced query
- Clear button when has value

### Variants

`archive` (future), `place-attach` (Naver)

### States

`idle`, `loading`, `empty-results`, `error`

### Do

- Live only in create/edit or archive hub per IA

### Don't

- Global header search until archive search RFC ships

---

# 22. Tabs

### Purpose

Switch views within **one IA destination** — e.g. 내 아카이브 hub (future).

### Responsibilities

- Local section switch without route change OR with shallow route per RFC

### Variants

`underline`, `pill`

### States

`active` tab

### Accessibility

- `role="tablist"`, `aria-selected`

### Do

- Archive hub: 내 장소 | 저장 | 컬렉션

### Don't

- Tabs that duplicate global nav jobs across app

---

# 23. Avatar

### Purpose

**Minimal use** — Re:Place is places-before-people.

### Responsibilities

- Optional future: account menu only
- Not creator profiles

### Variants

`sm`, `md` — initials or neutral placeholder

### Do

- Account settings if needed

### Don't

- Creator avatar on place cards; follower headers

---

# 24. Image

### Purpose

Photography display — cards, hero, cover, crop preview.

### Responsibilities

- Correct `sizes`, `alt`, aspect ratio container
- Fallback to EmptyCard pattern

### Variants

`cover` (fill), `contain` (rare)

### States

`loading` (skeleton), `error`, `empty`

### Do

- Next.js `Image` for all card media
- Meaningful alt: “{place name} 사진”

### Don't

- CSS background-image on cards (debt)
- Stock photos as user memories

---

# 25. Map Section

### Purpose

Location context on place detail — `PlaceLocationCard` + `PlaceMap` + directions.

### Responsibilities

- Embed map when lat/lng exist
- Address text + copy
- 길찾기 → BottomSheet

### Composition

```
MapSection
├── PlaceMap
├── address row + copy IconButton
└── directions Button → BottomSheet
```

### States

- No coordinates: address text only; map empty; directions disabled

### Integration

- Naver Maps SDK — loading internal to PlaceMap

### Do

- Keep below memory content on detail

### Don't

- Map as homepage hero; tracking user location without consent

---

# 26. Component Lifecycle

| Stage | Activity |
|-------|----------|
| **Proposal** | RFC + fits taxonomy layer |
| **Primitive** | Add to `components/ui/` with tokens |
| **Adoption** | Feature components migrate to primitive |
| **Deprecation** | Mark duplicate; remove in same tier sprint |
| **Removal** | No imports remain; doc updated |

Duplicates (`FeaturedPlaceCard`, mock `CollectionsSection` cards) → deprecate on PlaceCard/CollectionCard unification.

---

# 27. Component Evolution Rules

1. **Extend variants** before creating `PlaceCardV2`.
2. **Add tokens** before adding props that accept className overrides for colors.
3. **Breaking visual change** → Design System version note + migrate all instances in one tier.
4. **Third-party wrappers** stay in integration layer — not forked per page.
5. **AI-generated components** must map to this spec before merge.

---

# 28. Component Anti-Patterns

| Anti-pattern | Replace with |
|--------------|--------------|
| Copy-pasted page headers | PageHeader |
| Third card component for places | PlaceCard variant |
| Inline modal markup ×5 | Dialog |
| StatusMessage as list loader | LoadingSkeleton |
| `bg-[#hex]` in feature components | Tokens |
| Giant monolith without composition | Split primitive + feature |
| Dashboard stat card | Not in Re:Place |
| Native confirm | Dialog destructive |

---

# 29. Decision Checklist

Before adding or changing a component:

- [ ] Fits **taxonomy** layer (primitive / pattern / feature / integration)
- [ ] No duplicate of existing component — variant instead?
- [ ] Uses **Design System v2** tokens exclusively
- [ ] **States** defined: loading, empty, error, disabled
- [ ] **Accessibility**: focus, labels, roles
- [ ] **Interaction spec** aligned
- [ ] **IA** placement clear — not dashboard widget
- [ ] **RFC** if new primitive or new domain concept
- [ ] Documented in this file when primitive is new

---

*Component Specification v1.0 — how Re:Place components are designed and extended.*

---

This document is part of the Re:Place documentation system.
