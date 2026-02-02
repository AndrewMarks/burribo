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

// ============================================
// Navigation Smooth Scroll
// ============================================

// Smooth scroll for anchor links using Lenis
// Lenis handles the smooth scrolling, we add offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      // Lenis scrollTo with offset for fixed header
      lenis.scrollTo(target, {
        offset: -80  // Account for header height
      });
    }
  });
});

// ============================================
// Navigation Active State
// ============================================

// Update active nav link based on scroll position
function setActiveNav(activeId) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('is-active');
    if (link.getAttribute('href') === `#${activeId}`) {
      link.classList.add('is-active');
    }
  });
}

// Create ScrollTriggers for each section to update active nav
const sections = ['hero', 'work', 'about', 'contact'];

sections.forEach(sectionId => {
  ScrollTrigger.create({
    trigger: `#${sectionId}`,
    start: "top center",
    end: "bottom center",
    onEnter: () => setActiveNav(sectionId),
    onEnterBack: () => setActiveNav(sectionId)
  });
});
