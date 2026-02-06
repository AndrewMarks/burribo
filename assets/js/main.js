/**
 * Main JavaScript - Animation Foundation
 * GSAP + ScrollTrigger + Lenis
 *
 * Performance notes:
 * - All animations use transform/opacity (compositor-only)
 * - Lenis lerp: 0.1 is typical, we use duration-based easing
 * - ScrollTrigger start: "top 85%" for natural reveal timing
 * - Reduced motion preference is respected throughout
 */

// ============================================
// Reduced Motion Detection
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// Register GSAP Plugins
// ============================================
gsap.registerPlugin(ScrollTrigger);

// ============================================
// Lenis Smooth Scroll Initialization
// ============================================
// Only initialize Lenis if user doesn't prefer reduced motion
let lenis = null;

if (!prefersReducedMotion) {
  lenis = new Lenis({
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
}

// ============================================
// Text Reveal Animations (without SplitText)
// ============================================
// Skip animations if user prefers reduced motion

if (!prefersReducedMotion) {
  // Hero name - dramatic reveal from bottom with clip mask
  const heroText = document.querySelector('.reveal-hero');
  if (heroText) {
    gsap.from(heroText, {
      yPercent: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.3
    });
  }

  // Tagline reveal - fade + slide up after hero text
  gsap.from(".reveal-tagline", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    delay: 1.0  // After hero text animation
  });

  // Section heading reveals - scroll-triggered
  document.querySelectorAll('.reveal-heading').forEach(heading => {
    gsap.from(heading, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: heading,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });

  // ============================================
  // Section Transitions
  // ============================================

  // Section content fade-in
  // Set initial state (hidden)
  gsap.set(".reveal-section", { opacity: 0, y: 40 });

  // Animate each section when it enters viewport
  document.querySelectorAll('.reveal-section').forEach(section => {
    gsap.to(section, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        toggleActions: "play none none none"  // Don't reverse
      }
    });
  });

  // Card batch animation (staggered reveal)
  // Set initial state for cards
  gsap.set(".card", { opacity: 0, y: 30 });

  // Batch animate cards when they enter viewport
  ScrollTrigger.batch(".card", {
    onEnter: batch => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out"
      });
    },
    start: "top 90%",
    once: true  // Only animate once
  });
}

// ============================================
// Navigation Smooth Scroll
// ============================================

// Smooth scroll for anchor links
// Uses Lenis if available, otherwise native scrollIntoView
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      if (lenis) {
        lenis.scrollTo(target);
      } else {
        // Fallback for reduced motion - instant scroll
        target.scrollIntoView({ behavior: 'auto' });
      }
    }
  });
});
