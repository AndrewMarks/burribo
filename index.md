---
layout: default
title: andrew marks | game developer, writer, advisor
description: Andrew Marks is a game developer, writer, and strategic advisor with experience in game development, TTRPG design, and interactive storytelling.
image: /assets/favicon/favicon-180x180.png
---

<section class="hero hero--fullscreen" id="hero">
  <!-- Space background layers -->
  <div class="space-bg">
    <div class="stars stars-1"></div>
    <div class="stars stars-2"></div>
    <div class="stars stars-3"></div>

    <!-- Clickable easter egg hotspots (safe zones: top half, bottom-left) -->
    <div class="hotspots">
      <a class="hotspot" href="https://quailworks.com/" target="_blank" rel="noopener" style="top: 25%; left: 20%;">
        <span class="tooltip">My consultancy.</span>
      </a>
      <a class="hotspot" href="https://www.kickstarter.com/projects/villageonstilts/trail-of-the-behemoth-second-edition-and-neon-hope-rpg" target="_blank" rel="noopener" style="top: 15%; left: 70%;">
        <span class="tooltip">Currently writing...</span>
      </a>
      <a class="hotspot" href="https://www.youtube.com/watch?v=mANS2qseQ2I" target="_blank" rel="noopener" style="top: 65%; left: 15%;">
        <span class="tooltip">Meet Gene Christ.</span>
      </a>
      <a class="hotspot" href="https://www.linkedin.com/in/andrewjohnmarks/" target="_blank" rel="noopener" style="top: 40%; left: 45%;">
        <span class="tooltip">Let's connect.</span>
      </a>
    </div>
  </div>

  <!-- Hero content (stays on top) -->
  <div class="hero-content">
    <h1 class="reveal-hero">Andrew<br>Marks</h1>
    <p class="tagline reveal-tagline">game developer, writer, advisor</p>
  </div>

  <!-- Bottom-left nav -->
  <nav class="hero-nav" id="hero-nav">
    <a href="#writing" class="hero-nav__link">writing</a>
  </nav>
</section>

<div class="hero-to-writing-transition"></div>

<section class="writing-section" id="writing">
  <div class="writing-section__inner">
    <span class="writing-section__label reveal-writing">Writing</span>

    <div class="writing-section__list">
      {% for post in site.posts %}
      <a href="{{ post.url | relative_url }}" class="writing-entry reveal-writing">
        <span class="writing-entry__meta">
          {{ post.date | date: "%B %Y" }} · {{ post.category | capitalize }} · {% assign words = post.content | number_of_words %}{% assign minutes = words | plus: 199 | divided_by: 200 %}{% if minutes < 1 %}{% assign minutes = 1 %}{% endif %}{{ minutes }} min read
        </span>
        <span class="writing-entry__title">{{ post.title }}</span>
        <span class="writing-entry__excerpt">{{ post.description }}</span>
      </a>
      {% unless forloop.last %}<hr class="writing-entry__divider reveal-writing-divider">{% endunless %}
      {% endfor %}
    </div>
  </div>
</section>
