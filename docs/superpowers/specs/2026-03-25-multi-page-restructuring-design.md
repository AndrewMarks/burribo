# Multi-Page Restructuring Design Spec

## Overview

Restructure burribo.com from a single scrolling page (hero + writing section) into a multi-page site. The hero becomes a standalone, no-scroll homepage with navigation links to separate pages. The writing section moves to its own page at `/writing/`. Typography gets bolder with Outfit 800 uppercase titles for a magazine-editorial feel.

## Goals

- Preserve the hero's design integrity as a self-contained landing page
- Give the writing section room to breathe as its own destination
- Establish a multi-page architecture that scales to future sections (about, work)
- Elevate typography — bolder, more confident, magazine-inspired

## Non-goals

- Building the about or work pages (future phases)
- Changing the hero's visual design, animations, or hotspots
- Redesigning the post reading body typography (Inter body text stays)
- Adding search, filtering, pagination, or categories navigation

---

## 1. Hero Page Changes

### Navigation

Replace the single "writing" anchor link with a `<nav>` element containing page links. Only "writing" is rendered now. "about" and "work" links are added to the nav when those pages are built — do not render placeholder links for pages that don't exist yet. The nav styling and layout should accommodate 2-3 links without changes when they're added.

**Desktop (showing future state for reference):** Horizontal row, bottom-left of hero. No separators — spacing does the work.

```
writing   about   work
```

**Mobile:** Stacked vertically, same bottom-left position.

### Nav Link Styling

| Property | Value |
|----------|-------|
| Font | Inter |
| Size | 13px |
| Weight | 400 |
| Letter-spacing | 0.06em |
| Case | lowercase |
| Gap (desktop) | 24px |
| Color | `#888` |
| Hover color | `#fff` |
| Transition | color 0.3s ease |

### Behavior

- "writing" links to `/writing/`
- Animation: nav fades in (opacity 0 → 1) after tagline animation, same timing as current (1.8s delay, 0.6s duration)
- `prefers-reduced-motion`: nav appears immediately
- No other hero changes — starfield, hotspots, title animation all untouched

### What Gets Removed from index.md

- The `<div class="hero-to-writing-transition">` gradient
- The entire `<section class="writing-section">` block
- The `#writing` anchor target

---

## 2. Writing Page (`/writing/`)

New standalone page replacing the homepage writing section.

### Page Structure

```
┌─────────────────────────────────────────┐
│  Starfield gradient (60px)              │
├─────────────────────────────────────────┤
│  ← back    WRITING    Andrew Marks      │  ← top bar
├─────────────────────────────────────────┤
│                                         │
│  March 2026        TO TASTE WHAT THE    │
│  Essay · 8 min     RAT MADE            │
│                    Excerpt text...       │
│  ─────────────────────────────────────  │
│  February 2026     THE SHAPE OF A       │
│  Craft · 5 min     DUNGEON             │
│                    Excerpt text...       │
│                                         │
└─────────────────────────────────────────┘
```

### Starfield Header

A subtle atmospheric echo of the hero at the top of the page.

| Property | Value |
|----------|-------|
| Height | 60px |
| Background | `linear-gradient(to bottom, #0a0a0a, #111)` |
| Star dots | CSS radial-gradient dots, opacity 0.6 |

If this proves complex or creates issues, it can be removed — it's decorative only.

### Top Bar

Sits inside the shared content container so its edges align with the entry content below.

| Property | Value |
|----------|-------|
| Layout | flex, space-between |
| Vertical padding | 28px |
| Bottom border | 1px solid `#1a1a1a` |
| Container max-width | 1100px |
| Container horizontal padding | 80px |

**Left element:** `← back` — links to `/` (home)

| Property | Value |
|----------|-------|
| Font | Inter |
| Size | 13px |
| Color | `#888` |
| Letter-spacing | 0.08em |
| Hover color | `#fff` |

**Center element:** `WRITING` — page identity label, not a link

| Property | Value |
|----------|-------|
| Font | Inter |
| Size | 13px |
| Weight | 600 |
| Color | `#fff` |
| Letter-spacing | 0.18em |
| Case | uppercase |

**Right element:** `Andrew Marks` — links to `/`

Same styling as the back link.

### Desktop Entry Layout (split)

Each entry is a flex row with a meta column left and content right.

**Container:**

| Property | Value |
|----------|-------|
| Max-width | 1100px |
| Horizontal padding | 80px |
| Margin | 0 auto |

**Entry row:**

| Property | Value |
|----------|-------|
| Display | flex |
| Gap | 64px |
| Vertical padding | 40px |
| Align-items | baseline |
| Cursor | pointer (entire entry is a link) |

**Meta column (left):**

| Property | Value |
|----------|-------|
| Min-width | 180px |
| Flex-shrink | 0 |
| Padding-top | 8px (align with title baseline) |

Date:

| Property | Value |
|----------|-------|
| Font | Inter |
| Size | 14px |
| Color | `#999` |
| Letter-spacing | 0.03em |
| Line-height | 1.6 |

Category + reading time:

| Property | Value |
|----------|-------|
| Font | Inter |
| Size | 12px |
| Color | `#767676` |
| Letter-spacing | 0.04em |
| Margin-top | 4px |
| Format | `Essay · 8 min read` |

**Content column (right):**

Title:

| Property | Value |
|----------|-------|
| Font | Outfit |
| Size | 38px |
| Weight | 800 |
| Color | `#fff` |
| Line-height | 1.1 |
| Letter-spacing | 0.05em |
| Case | uppercase |
| Margin-bottom | 14px |
| Hover color | `#ff4a1a` (accent-hover) |
| Transition | color 0.2s ease |

Excerpt:

| Property | Value |
|----------|-------|
| Font | Inter |
| Size | 17px |
| Color | `#999` |
| Line-height | 1.5 |
| Max-width | 640px |

**Dividers between entries:**

| Property | Value |
|----------|-------|
| Height | 1px |
| Background | `#1a1a1a` |
| Margin | 0 |

### Mobile Entry Layout (stacked)

At mobile breakpoint (max-width: 767px), entries collapse to a single stacked column — the Display style validated in mockups.

| Property | Desktop | Mobile |
|----------|---------|--------|
| Entry layout | flex row | block (stacked) |
| Container padding | 0 80px | 0 24px |
| Entry vertical padding | 40px | 28px |
| Title size | 38px | 32px |
| Meta position | left column | above title |
| Gap | 64px | N/A |
| Top bar padding | 28px 0 | 20px 0 |

Mobile meta sits above the title as a single line: `March 2026 · Essay · 8 min read` in the same styling as the current writing section (12px, `#767676`, `letter-spacing: 0.05em`).

### Animations

Progressive reveal carries over from the current implementation:

- Entry opacity: 0 → 1, 0.7s duration, staggered 0.1s, triggered at `top 85%`
- Divider scaleX: 0 → 1, 0.6s, `transform-origin: left`
- `prefers-reduced-motion`: all content visible immediately

---

## 3. Post Page Updates

### Title Font Change

Post titles switch to Outfit 800 uppercase to match the writing index.

| Property | Current | New |
|----------|---------|-----|
| Font | Inter | Outfit |
| Weight | 700 | 800 |
| Case | normal | uppercase |
| Size | `clamp(1.75rem, 5vw, 2.5rem)` | `clamp(1.75rem, 5vw, 2.5rem)` (keep) |
| Letter-spacing | -0.01em | 0.04em |

### Navigation Changes

| Link | Current | New |
|------|---------|-----|
| ← back | `/#writing` | `/writing/` |
| Andrew Marks | `/` | `/` (unchanged) |

### No Other Changes

Post body typography, layout, spacing, blockquotes, code blocks — all remain as built.

---

## 4. Accessibility

All contrast ratios from the original spec remain valid:

| Element | Foreground | Background | Ratio |
|---------|-----------|------------|-------|
| Title (Outfit) | `#ffffff` | `#111111` | 17.4:1 |
| Excerpt | `#999999` | `#111111` | 5.7:1 |
| Date | `#999999` | `#111111` | 5.7:1 |
| Category | `#767676` | `#111111` | 4.5:1 |
| Nav link | `#888888` | `#0a0a0a` | 5.2:1 |

All pass WCAG AA. Reduced motion support unchanged from original spec.

---

## 5. New Dependency

**Outfit** from Google Fonts, weight 800.

Update the font link in `_layouts/default.html`:

```
Current:  Inter
New:      Inter + Outfit:wght@800
```

No other new dependencies.

---

## 6. File Changes

### New files

- `writing.md` (or `writing/index.md`) — writing index page
- `_layouts/writing.html` — writing page layout (top bar, entry list, starfield)

### Modified files

- `index.md` — remove writing section and transition, update nav link href
- `_layouts/default.html` — add Outfit to Google Fonts link
- `_layouts/post.html` — update back link to `/writing/`, apply Outfit title
- `assets/css/main.scss` — writing page styles (split layout, responsive collapse, starfield), hero nav updates for multi-link, post title Outfit override
- `assets/js/main.js` — remove hero-to-writing scroll logic, keep progressive reveal (re-targeted for writing page)

### Removed

- `.hero-to-writing-transition` element and styles
- `#writing` anchor scroll behavior
- Writing section styles that are replaced by the new layout (keep shared entry component styles where possible)

### Unchanged

- `_posts/` and post content
- Hero section markup (except nav links)
- `_config.yml`
- Favicon and image assets
