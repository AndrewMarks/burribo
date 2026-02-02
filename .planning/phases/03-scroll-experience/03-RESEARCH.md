# Phase 3: Scroll Experience - Research

**Researched:** 2026-02-01
**Domain:** Scroll-triggered animations for static portfolio site (Jekyll/GitHub Pages)
**Confidence:** HIGH

<research_summary>
## Summary

Researched the scroll animation ecosystem for building the core value of the portfolio: scroll-triggered text reveals, persistent headers, and section transitions. The standard approach uses GSAP with ScrollTrigger (now 100% free) for complex animations, with CSS scroll-driven animations as a progressive enhancement for supported browsers.

Key finding: GSAP became 100% free in 2025 (including SplitText, ScrollTrigger, and all premium plugins) thanks to Webflow sponsorship. This removes the previous cost barrier and makes GSAP the clear choice over Intersection Observer for anything beyond basic reveals.

For smooth scrolling, Lenis (3KB) is the de facto standard that preserves `position: sticky` compatibility and integrates seamlessly with GSAP ScrollTrigger.

**Primary recommendation:** Use GSAP ScrollTrigger + SplitText + Lenis stack. Progressive enhancement with CSS scroll-driven animations where browser support allows. Animate only `transform` and `opacity` to stay on the compositor thread.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GSAP | 3.12+ | Animation engine | Industry standard, now 100% free, best-in-class performance |
| ScrollTrigger | (bundled) | Scroll-based triggers | Pinning, scrubbing, snapping, toggleActions - complete solution |
| SplitText | (bundled) | Text splitting for reveals | Handles accessibility (aria), responsive re-splitting, masking |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Lenis | 1.0+ | Smooth scroll | When smooth scroll physics desired (recommended for polish) |
| Observer | (bundled) | Touch/wheel detection | If needing custom scroll-hijacking (not recommended for portfolio) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GSAP | Intersection Observer + CSS | IO sufficient for simple reveals only; lacks scrubbing, pinning, complex timelines |
| GSAP | CSS scroll-driven animations | Native but Safari 26+ only (Sept 2025), no IE/old browser support |
| SplitText | SplitType | SplitType is free alternative but lacks accessibility features, responsive re-splitting |
| Lenis | Native CSS scroll-behavior | Native is simpler but lacks the physics/momentum feel |

**Installation:**
```html
<!-- Via CDN (recommended for Jekyll/GitHub Pages) -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js"></script>
```

```bash
# Or via npm (if using build process)
npm install gsap lenis
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
assets/
├── js/
│   ├── main.js           # GSAP registration, Lenis init, global setup
│   ├── animations/
│   │   ├── header.js     # Sticky header transforms
│   │   ├── reveals.js    # Text reveal animations
│   │   └── sections.js   # Section transition animations
│   └── utils/
│       └── scroll.js     # Scroll utilities, debounce helpers
└── css/
    └── animations.scss   # Animation-related styles (initial states)
```

### Pattern 1: Register GSAP Plugins First
**What:** Always register plugins before creating animations
**When to use:** Every GSAP project
**Example:**
```javascript
// Source: GSAP official docs
gsap.registerPlugin(ScrollTrigger, SplitText);
```

### Pattern 2: SplitText with ScrollTrigger for Text Reveals
**What:** Split text into lines/words/chars, animate on scroll
**When to use:** Hero text, section headings, decorative reveals
**Example:**
```javascript
// Source: GSAP SplitText docs
SplitText.create(".reveal-text", {
  type: "words,lines",
  mask: "lines",  // Creates clipping wrapper for reveal effect
  autoSplit: true,
  onSplit(self) {
    return gsap.from(self.lines, {
      yPercent: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: self.elements[0],
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }
});
```

### Pattern 3: Sticky Header with Scroll-Based Transform
**What:** Header shrinks/transforms as user scrolls
**When to use:** Persistent navigation that adapts to scroll position
**Example:**
```javascript
// Source: Community pattern, verified with ScrollTrigger docs
gsap.to(".header", {
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "100",
    scrub: true
  },
  height: "60px",
  backgroundColor: "rgba(0,0,0,0.95)",
  ease: "none"
});
```

### Pattern 4: Batch Processing for Multiple Elements
**What:** Use ScrollTrigger.batch() for many similar elements
**When to use:** Cards, list items, portfolio grid items
**Example:**
```javascript
// Source: GSAP ScrollTrigger docs
ScrollTrigger.batch(".card", {
  onEnter: (elements) => {
    gsap.from(elements, {
      opacity: 0,
      y: 50,
      stagger: 0.15,
      duration: 0.6
    });
  },
  start: "top 85%"
});
```

### Pattern 5: Lenis + GSAP Integration
**What:** Sync Lenis smooth scroll with GSAP ticker
**When to use:** When using both libraries together
**Example:**
```javascript
// Source: Lenis official docs
const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
```

### Anti-Patterns to Avoid
- **Animating layout properties:** Never animate width, height, top, left, margin, padding - causes reflow/repaint jank
- **Creating ScrollTriggers out of DOM order:** Create top-to-bottom for accurate pinning calculations
- **Animating the pinned element itself:** Nest animations within pinned container instead
- **Using scroll event listeners directly:** Use ScrollTrigger's built-in throttling instead
- **Heavy JS in scroll callbacks:** Keep onUpdate callbacks minimal; pre-calculate values
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Text splitting | Manual DOM manipulation for chars/words | GSAP SplitText | Accessibility (aria-label), responsive re-splitting, cleanup, mask support |
| Scroll position tracking | scroll event listener + manual calculations | ScrollTrigger | Debounced, pre-calculated, synchronized with RAF |
| Smooth scroll | CSS scroll-behavior or custom physics | Lenis | Physics feel, momentum, touch support, sticky compatibility |
| Intersection detection | Custom IntersectionObserver setup | ScrollTrigger | More features (scrub, pin, snap), unified API |
| Animation chaining | setTimeout/setInterval sequences | GSAP Timeline | Proper timing, pause/play/reverse, easier maintenance |

**Key insight:** Scroll animations have subtle timing issues (jank, async scroll lag) that established libraries have solved. GSAP runs off the main thread where possible. Hand-rolled scroll listeners compete with browser rendering and cause jank.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Main Thread Blocking (Jank)
**What goes wrong:** Animations stutter, page feels unresponsive
**Why it happens:** Animating layout properties (width, height, top, left) forces reflow/repaint
**How to avoid:** Only animate `transform` (translate, scale, rotate) and `opacity` - these run on compositor thread
**Warning signs:** GPU/CPU spikes in DevTools Performance tab, dropped frames

### Pitfall 2: Async Scroll Lag
**What goes wrong:** Animations lag behind actual scroll position
**Why it happens:** Scroll events fire on main thread, but visual scroll happens on compositor thread
**How to avoid:** Use ScrollTrigger's built-in sync; avoid raw scroll event listeners
**Warning signs:** Elements "chase" scroll position, snapping after scroll stops

### Pitfall 3: Mobile Touch Jank
**What goes wrong:** Scroll feels broken or blocked on mobile
**Why it happens:** Non-passive event listeners block scroll, touch handlers interfere
**How to avoid:** Use Lenis (handles touch properly); ensure passive listeners; test on real devices
**Warning signs:** Can't scroll on mobile, or scroll feels "sticky"

### Pitfall 4: Font Loading Breaks Text Split
**What goes wrong:** Line breaks change after fonts load, text reveals look wrong
**Why it happens:** SplitText calculated lines before web fonts loaded
**How to avoid:** Use SplitText's `autoSplit: true` with `onSplit()` callback; or wait for fonts with `document.fonts.ready`
**Warning signs:** Text wrapping changes after page load, animations target wrong elements

### Pitfall 5: ScrollTrigger Position Miscalculation
**What goes wrong:** Animations trigger at wrong scroll positions after DOM changes
**Why it happens:** ScrollTrigger calculates positions once at init
**How to avoid:** Call `ScrollTrigger.refresh()` after images load, DOM changes, or resize
**Warning signs:** Triggers fire too early/late, pinned elements jump

### Pitfall 6: Memory Leaks on Page Navigation
**What goes wrong:** Animations keep running after leaving page, memory grows
**Why it happens:** ScrollTriggers and animations not cleaned up
**How to avoid:** Use `scrollTrigger.kill()` or `ScrollTrigger.killAll()` on page unload; store references
**Warning signs:** Performance degrades over time in SPA, memory in DevTools grows
</common_pitfalls>

<code_examples>
## Code Examples

### Complete Text Reveal Animation
```javascript
// Source: GSAP SplitText + ScrollTrigger docs
gsap.registerPlugin(ScrollTrigger, SplitText);

document.querySelectorAll('.reveal-heading').forEach(heading => {
  SplitText.create(heading, {
    type: "words,lines",
    mask: "lines",
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    }
  });
});
```

### Sticky Header with Transform on Scroll
```javascript
// Source: ScrollTrigger docs + community patterns
const header = document.querySelector('.site-header');

gsap.to(header, {
  scrollTrigger: {
    trigger: document.body,
    start: "top top",
    end: "100px",
    scrub: 0.5
  },
  "--header-height": "60px",
  "--header-bg": "rgba(0, 0, 0, 0.98)",
  ease: "none"
});
```

### Section Fade-In with Stagger
```javascript
// Source: ScrollTrigger batch documentation
ScrollTrigger.batch(".section-item", {
  onEnter: batch => {
    gsap.to(batch, {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.6,
      ease: "power2.out"
    });
  },
  start: "top 85%",
  once: true  // Only animate once, don't reverse
});

// Initial state (set in CSS or JS)
gsap.set(".section-item", { opacity: 0, y: 40 });
```

### Lenis Smooth Scroll Setup
```javascript
// Source: Lenis official docs
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,  // Better for iOS
  touchMultiplier: 2
});

// Sync with GSAP
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

### Progressive Enhancement with CSS Scroll Animations
```css
/* Source: MDN CSS scroll-driven animations */
@supports (animation-timeline: scroll()) {
  .fade-on-scroll {
    animation: fadeIn linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 40%;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| GSAP paid plugins | GSAP 100% free | May 2025 | SplitText, ScrollSmoother, MorphSVG now free for everyone |
| Intersection Observer for reveals | ScrollTrigger for everything | 2020+ | ScrollTrigger handles IO use cases + much more |
| Custom smooth scroll | Lenis | 2023+ | Lenis is now standard for smooth scroll with GSAP |
| JavaScript scroll listeners | CSS scroll-driven animations | Chrome 115 / Safari 26 | Native, compositor-thread animations |

**New tools/patterns to consider:**
- **CSS scroll-driven animations:** Use as progressive enhancement (`@supports`). Chrome/Firefox/Safari 26+ support. Better performance when supported.
- **Chrome 145 scroll-triggered animations:** New in 2026 - time-based animations triggered at scroll offsets, declarative in CSS
- **GSAP 3.13+ SplitText:** Major rewrite with 14 new features, half the size, autoSplit for responsive

**Deprecated/outdated:**
- **Scroll event listeners:** Use ScrollTrigger instead (better performance, debounced)
- **scroll-behavior: smooth (alone):** Lacks physics feel; use Lenis for better UX
- **Manual text splitting:** Use SplitText for accessibility and responsive support
</sota_updates>

<open_questions>
## Open Questions

1. **CSS scroll-driven animations polyfill performance**
   - What we know: Polyfill exists for non-supporting browsers
   - What's unclear: Performance overhead of polyfill vs just using GSAP
   - Recommendation: Use GSAP as primary, CSS as progressive enhancement (no polyfill)

2. **Lenis on iOS Safari**
   - What we know: Lenis recommends `smoothTouch: false` for iOS
   - What's unclear: Edge cases with iOS Safari rubber-banding
   - Recommendation: Test on real iOS devices; have fallback to native scroll
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) - API, best practices
- [GSAP SplitText Docs](https://gsap.com/docs/v3/Plugins/SplitText/) - Text splitting API, v3.13 features
- [GSAP Pricing Page](https://gsap.com/pricing/) - Confirmed all plugins now free
- [Lenis GitHub](https://github.com/darkroomengineering/lenis) - Integration patterns
- [MDN CSS Scroll-driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations) - Browser API reference

### Secondary (MEDIUM confidence)
- [CSS-Tricks Scroll Technologies Overview](https://css-tricks.com/an-overview-of-scroll-technologies/) - Comparison of approaches
- [Chrome Developers Blog](https://developer.chrome.com/blog/scroll-animation-performance-case-study) - Performance case study
- [WebKit Scroll-Driven Animations Guide](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/) - Safari support announcement

### Tertiary (LOW confidence - needs validation)
- Browser support percentages cited may shift; verify on [caniuse.com](https://caniuse.com/css-scroll-timeline) for current data
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: GSAP ecosystem (ScrollTrigger, SplitText)
- Ecosystem: Lenis smooth scroll, CSS scroll-driven animations
- Patterns: Text reveals, sticky headers, batch animations, scrub/pin
- Pitfalls: Jank, async lag, mobile touch, font loading, memory leaks

**Confidence breakdown:**
- Standard stack: HIGH - verified with official docs, major 2025 licensing change confirmed
- Architecture: HIGH - patterns from GSAP official docs and community examples
- Pitfalls: HIGH - documented in Chrome/Mozilla performance guides
- Code examples: HIGH - from official GSAP documentation

**Research date:** 2026-02-01
**Valid until:** 2026-03-01 (30 days - GSAP ecosystem is stable)
</metadata>

---

*Phase: 03-scroll-experience*
*Research completed: 2026-02-01*
*Ready for planning: yes*
