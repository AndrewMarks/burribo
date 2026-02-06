---
layout: default
title: Blog
description: Thoughts on design, development, and creative work.
---

<div class="blog-index">
  <header class="blog-index__header">
    <h1>Blog</h1>
    <p>Thoughts on design, development, and the creative process.</p>
  </header>

  <ul class="blog-index__list">
    {% for post in site.posts %}
      <li class="blog-index__item">
        <a href="{{ post.url | relative_url }}" class="blog-index__link">
          <h2 class="blog-index__title">{{ post.title }}</h2>
          <time class="blog-index__date" datetime="{{ post.date | date_to_xmlschema }}">
            {{ post.date | date: "%B %-d, %Y" }}
          </time>
          {% if post.description %}
            <p class="blog-index__excerpt">{{ post.description }}</p>
          {% elsif post.excerpt %}
            <p class="blog-index__excerpt">{{ post.excerpt | strip_html | truncate: 160 }}</p>
          {% endif %}
        </a>
      </li>
    {% endfor %}
  </ul>

  {% if site.posts.size == 0 %}
    <p>No posts yet. Check back soon.</p>
  {% endif %}
</div>
