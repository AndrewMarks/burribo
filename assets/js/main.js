/**
 * Main JavaScript - Animation Foundation
 * GSAP + ScrollTrigger + SplitText + Lenis
 */

// ============================================
// Register GSAP Plugins
// ============================================
gsap.registerPlugin(ScrollTrigger, SplitText);

// ============================================
// Lenis Smooth Scroll Initialization
// ============================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,  // Better for iOS compatibility
  touchMultiplier: 2
});

// Sync Lenis with GSAP ticker (Pattern 5 from RESEARCH.md)
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// ============================================
// Header Scroll Behavior
// ============================================
// Placeholder for Task 2 implementation

// ============================================
// Text Reveal Animations
// ============================================
// Placeholder for Plan 03-02 implementation

// ============================================
// Section Transitions
// ============================================
// Placeholder for Plan 03-03 implementation
