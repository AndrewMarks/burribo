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
const header = document.querySelector('.site-header');

if (header) {
  // Use ScrollTrigger for discrete state change (not scrub)
  // Toggles between "top" and "scrolled" states at 100px scroll
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top -100',
    end: 'max',
    onEnter: () => {
      header.setAttribute('data-scroll-state', 'scrolled');
    },
    onLeaveBack: () => {
      header.setAttribute('data-scroll-state', 'top');
    }
  });
}

// ============================================
// Text Reveal Animations
// ============================================

// Hero name - split by lines, reveal from bottom with mask
// Dramatic, slower reveal for the main title
SplitText.create(".reveal-hero", {
  type: "lines",
  mask: "lines",
  autoSplit: true,
  onSplit(self) {
    return gsap.from(self.lines, {
      yPercent: 100,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.3  // Slight delay after page load
    });
  }
});

// Tagline reveal - fade + slide up after hero text
gsap.from(".reveal-tagline", {
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  delay: 0.8  // After hero text animation
});

// Section heading reveals - scroll-triggered
// Each heading animates when it enters the viewport
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

// ============================================
// Section Transitions
// ============================================
// Placeholder for Plan 03-03 implementation
