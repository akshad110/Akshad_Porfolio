# CURSOR PROJECT RULES

**Project:** Akshad Vengurlekar — 3D Developer Portfolio
**Purpose:** Global development rules for Cursor AI

---

## 1. SOURCE OF TRUTH

Before implementing or changing anything, read and follow:

```text
PRD.md
DESIGN_SYSTEM.md
PAGE_STRUCTURE.md
SEO_SPEC.md
TECH_STACK.md
PROJECT_DATA.md
CONTENT.md
ANIMATIONS.md
3D_SPEC.md
```

Do not contradict these documents unless explicitly instructed by the user.

---

## 2. DESIGN SYSTEM

Always follow `02_DESIGN_SYSTEM.md`.

Do not introduce:

* Random colors
* Random fonts
* Unapproved gradients
* Excessive glassmorphism
* Generic AI-style purple/blue gradients
* Excessive shadows
* Unnecessary UI decoration

Maintain the defined typography, spacing, colors, grid and visual hierarchy.

---

## 3. ANIMATIONS & SMOOTHNESS

**`ANIMATIONS.md` must be followed carefully.**

The website must feel:

* Smooth
* Cinematic
* Fluid
* Premium
* Responsive
* Weight-aware

Use the defined animation system consistently.

You may use additional:

* Scroll animations
* Parallax effects
* Micro-interactions
* Page transitions
* Reveal effects
* Hover interactions

when they improve the experience.

You may take **inspiration from high-quality websites, portfolios, Awwwards, Dribbble, WebZoo/CreativeZoo and other relevant platforms**, but:

> Never directly copy another website's design or implementation.

Animations must always support the content rather than distract from it.

Avoid:

* Janky movement
* Excessive animation
* Random motion
* Long unnecessary delays
* Scroll hijacking
* Animation that hurts readability
* Heavy effects that reduce performance

Always preserve smooth scrolling and interaction quality.

Respect:

```text
prefers-reduced-motion
```

---

## 4. 3D

Follow `3D_SPEC.md`.

3D should be used as a storytelling and depth layer.

Do not add 3D merely for decoration.

Prioritize:

```text
Performance
↓
Readability
↓
Interaction
↓
Visual quality
```

Provide simplified/fallback behavior for weaker devices and mobile where necessary.

---

## 5. RESPONSIVE DESIGN

Every feature must work on:

```text
Desktop
Tablet
Mobile
```

Never design only for desktop.

Do not depend on hover for essential functionality.

Touch devices must receive appropriate alternatives.

---

## 6. TECH STACK

Follow `TECH_STACK.md`.

Preferred stack:

```text
Next.js
React
TypeScript
Tailwind CSS
Three.js
React Three Fiber
Drei
GSAP
ScrollTrigger
Lenis
MongoDB
Mongoose
Zod
Docker
GitHub Actions
```

Do not replace major technologies without explicit approval.

---

## 7. COMPONENT ARCHITECTURE

Build reusable components.

Prefer:

```text
Page
 → Section
   → Component
     → Data
```

Avoid:

* Giant components
* Repeated UI code
* Hardcoded dynamic content
* Mixing database logic with presentation components

Keep components focused and maintainable.

---

## 8. DYNAMIC CONTENT

Projects, skills, achievements, certifications and courses must be dynamic.

MongoDB becomes the source of truth after initial seeding from `CONTENT.md`.

Do NOT hardcode:

```text
Top 3 Projects
Top 3 Achievements
Top 3 Certifications
```

Featured content must come from the Admin CMS.

---

## 9. ADMIN CMS

The Admin CMS must remain separate from the public website.

Admin manages:

```text
Projects
Skills
Achievements
Certifications / Courses
Messages
```

Support appropriate:

```text
Create
Edit
Delete
Publish
Unpublish
Archive
Feature
Unfeature
Reorder
```

Only authenticated admins may modify content.

Never expose admin modification functionality to public users.

---

## 10. FEATURED CONTENT

Homepage limits:

```text
Projects        → 3
Achievements    → 3
Certifications  → 3
```

Use:

```text
isFeatured
featuredOrder
```

and query published featured content dynamically.

---

## 11. SEO

Follow `SEO_SPEC.md`.

Every public page should have appropriate:

```text
Title
Description
Canonical
Open Graph
Structured Data where appropriate
```

Do not index:

```text
/admin/*
Draft content
Archived content
Unpublished content
```

---

## 12. ACCESSIBILITY

Always maintain:

* Semantic HTML
* Keyboard accessibility
* Visible focus states
* Proper labels
* Alt text
* Good contrast
* Reduced-motion support

Important information must never depend exclusively on animation or hover.

---

## 13. PERFORMANCE

Performance is a first-class requirement.

Prioritize:

```text
Fast initial load
Optimized images
Lazy-loaded heavy assets
Optimized 3D
Code splitting
Minimal unnecessary JavaScript
Good Core Web Vitals
```

Do not add an effect if its performance cost is not justified.

---

## 14. CODE QUALITY

Use:

* TypeScript
* Strong typing
* Reusable utilities
* Clear naming
* Small focused functions
* Consistent formatting
* Existing project patterns

Avoid:

```text
any
```

unless genuinely necessary.

Validate external/user input with Zod where applicable.

---

## 15. DATA & SECURITY

Never trust client-side input.

Validate data on the server.

Protect:

* Admin routes
* Admin APIs
* Database operations
* Authentication
* Environment variables

Never expose secrets or credentials in frontend code.

---

## 16. CONTENT

Use `CONTENT.md` only for initial/seed content.

Do not invent personal information, projects, achievements, certifications or experience.

If required content is missing, use a clearly marked placeholder or ask the user.

---

## 17. FILE & DOCUMENT RULE

Before creating a new architecture or changing an existing one:

1. Check the relevant documentation.
2. Check the existing codebase.
3. Reuse existing patterns where possible.
4. Avoid unnecessary rewrites.

Do not create duplicate components or systems without checking whether one already exists.

---

## 18. TESTING

After meaningful changes:

```text
Typecheck
Lint
Build
```

Run relevant tests when available.

Fix errors introduced by the implementation before considering the task complete.

---

## 19. VISUAL QUALITY

The final result should feel like a:

> Premium, cinematic, modern developer portfolio.

Avoid making it look like:

* Generic SaaS dashboard
* Template portfolio
* Gaming website
* Overloaded AI landing page
* Basic Bootstrap website

Use strong composition, whitespace, typography, depth and intentional motion.

---

## 20. IMPLEMENTATION PRINCIPLE

Before coding a feature, think:

```text
Does it follow the PRD?
        ↓
Does it follow the Design System?
        ↓
Does it follow Page Structure?
        ↓
Does it follow the Animation / 3D specification?
        ↓
Is it responsive?
        ↓
Is it accessible?
        ↓
Is it performant?
        ↓
Is it maintainable?
```

If any answer is **No**, improve the implementation before proceeding.

---

## 21. FINAL RULE

> **Do not blindly code the user's request if it conflicts with the project's documented architecture. Read the relevant documentation, preserve consistency, and implement the cleanest solution that satisfies the requirement.**

The portfolio should always prioritize:

```text
Quality
→ Smoothness
→ Performance
→ Accessibility
→ Maintainability
→ Visual Impact
```
