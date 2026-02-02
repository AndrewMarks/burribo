---
plan: 03-02
phase: 03-scroll-experience
status: complete
completed: 2026-02-01
---

# Plan 03-02: Text Reveals - Summary

## Objective
Implement scroll-triggered text reveal animations for headings using GSAP SplitText.

## Tasks Completed

### Task 1: Add reveal classes to index.md content
- **Status:** Complete
- **Commit:** `408dba0` - feat(03-02): add reveal animation classes to index.md
- **Files:**
  - `index.md` - Added reveal-hero, reveal-tagline, and reveal-heading classes

### Task 2: Implement SplitText scroll-triggered reveals
- **Status:** Complete
- **Commit:** `da78602` - feat(03-02): implement SplitText scroll-triggered reveals
- **Files:**
  - `assets/js/main.js` - Added hero, tagline, and section heading reveal animations
  - `assets/css/main.scss` - Added CSS fallback states for no-JS scenarios

## Files Modified
| File | Change |
|------|--------|
| `index.md` | Added reveal-hero, reveal-tagline, reveal-heading classes |
| `assets/js/main.js` | Added SplitText reveal animations with ScrollTrigger |
| `assets/css/main.scss` | Added fallback styles for reveal elements |

## Deviations
None - plan executed as specified.

## Verification Checklist
- [x] Hero "Andrew Marks" text reveals line-by-line on page load
- [x] Tagline fades in after hero text (0.8s delay)
- [x] "Work" heading reveals when scrolling to that section
- [x] "About" heading reveals when scrolling to that section
- [x] "Contact" heading reveals when scrolling to that section
- [x] Scrolling back up reverses the section heading animations (toggleActions: reverse)
- [x] Only transform/opacity animated for compositor thread performance
- [x] autoSplit: true handles font loading edge cases

## Technical Details

### Hero Animation
- Uses SplitText with `mask: "lines"` for clean reveal effect
- Lines animate from yPercent: 100 with stagger: 0.15
- Duration: 1s with power3.out easing
- Delay: 0.3s after page load

### Tagline Animation
- Simple gsap.from animation (no text splitting needed)
- Fades in with y: 30 slide-up
- Delay: 0.8s (after hero completes)

### Section Heading Animations
- SplitText with `type: "words,lines"` and `mask: "lines"`
- ScrollTrigger with start: "top 80%"
- toggleActions: "play none none reverse" for scroll-back reversal
- Duration: 0.8s with stagger: 0.1

## Notes
- All animations use transform/opacity only for compositor thread performance
- autoSplit: true ensures text splitting recalculates after font loading
- CSS provides no-JS fallback (elements remain visible without animation)
- Ready for Plan 03-03 (section transitions)
