# Portfolio Website — Technology Stack

**Project:** Interactive 3D Developer Portfolio
**Architecture:** Full-Stack Next.js Application
**Language:** TypeScript
**Development Approach:** AI-assisted / Vibe Coding using Cursor

---

# 1. Technology Philosophy

The portfolio should use a modern, maintainable, performance-conscious technology stack capable of supporting:

* 3D web experiences
* Smooth scrolling
* GSAP animations
* Scroll-driven animations
* Parallax effects
* Interactive UI
* AI-generated video
* Animated SVGs
* Dynamic project/skill/service content
* Contact forms
* Database-backed content where required
* Responsive design
* SEO
* CI/CD
* Containerization
* Production deployment

The stack should remain intentionally focused.

> Do not add a library simply because it can create an effect that can already be implemented using an existing dependency.

---

# 2. Core Stack

| Area                 | Technology         | Purpose                            |
| -------------------- | ------------------ | ---------------------------------- |
| Framework            | Next.js            | Application framework              |
| Language             | TypeScript         | Type-safe development              |
| UI                   | React              | Component-based UI                 |
| Styling              | Tailwind CSS       | Utility-first styling              |
| 3D                   | Three.js           | WebGL / 3D rendering               |
| 3D React Integration | React Three Fiber  | React-based Three.js scenes        |
| 3D Utilities         | Drei               | Reusable R3F/Three.js helpers      |
| Animation            | GSAP               | Advanced animation system          |
| Scroll Animation     | GSAP ScrollTrigger | Scroll-driven animations           |
| Smooth Scroll        | Lenis              | Smooth scrolling                   |
| Database             | MongoDB            | Persistent application data        |
| Database ODM         | Mongoose           | MongoDB data modeling              |
| Validation           | Zod                | Runtime/schema validation          |
| Forms                | React Hook Form    | Form management                    |
| Containerization     | Docker             | Consistent environments            |
| CI/CD                | GitHub Actions     | Automated testing/build/deployment |
| Deployment           | Render             | Production hosting                 |
| Version Control      | Git + GitHub       | Source control                     |
| Code Quality         | ESLint             | Static code analysis               |
| Formatting           | Prettier           | Consistent formatting              |

---

# 3. Frontend Framework

## Next.js

Next.js will be the primary application framework.

### Responsibilities

* Application routing
* Page rendering
* Server-side functionality
* API endpoints / route handlers where appropriate
* SEO metadata
* Image optimization
* Font optimization
* Static generation
* Server rendering where beneficial
* Client-side interactive components
* Application deployment

### Routing

The application should use the Next.js App Router.

Primary routes:

```text
/
├── /projects
├── /services
└── /skills
```

Additional routes may be introduced if required by the product architecture.

### Important Rule

Use Server Components by default where possible.

Use Client Components only when browser-side functionality is required, such as:

* GSAP
* Three.js
* React Three Fiber
* Mouse interaction
* Scroll interaction
* Video controls
* Interactive forms
* Browser APIs

---

# 4. Programming Language

## TypeScript

TypeScript will be used throughout the application.

### Requirements

* Strict TypeScript configuration
* Avoid `any` unless absolutely necessary
* Define interfaces/types for structured content
* Type component props
* Type API responses
* Type database models where appropriate
* Type animation/3D configuration objects

Example data structures should be strongly typed.

```text
Project
Skill
Service
Education
Experience
SocialProfile
ContactMessage
```

---

# 5. UI Framework

## React

React will be used through Next.js.

The UI should be constructed using reusable components.

Example architecture:

```text
components/
├── navigation/
├── hero/
├── about/
├── education/
├── projects/
├── skills/
├── services/
├── contact/
├── footer/
├── ui/
└── three/
```

Avoid creating unnecessarily large components.

---

# 6. Styling

## Tailwind CSS

Tailwind CSS will be the primary styling system.

### Responsibilities

* Layout
* Spacing
* Responsive design
* Typography
* Colors
* Borders
* Gradients
* States
* Component styling

### Rules

Prefer Tailwind utility classes for normal UI styling.

Avoid creating large amounts of custom CSS when Tailwind can reasonably handle the requirement.

Custom CSS may be used when necessary for:

* Complex animation
* 3D-specific styling
* Advanced visual effects
* CSS variables
* Special browser behavior
* Third-party library integration

---

# 7. Design Tokens

The design system should use CSS variables/design tokens for reusable values.

Potential tokens:

```text
--background
--foreground
--primary
--secondary
--muted
--border
--accent
--radius
--container-width
```

Exact values will be defined separately in:

```text
design_system.md
```

The visual implementation must follow the design system rather than independently creating colors or spacing values throughout components.

---

# 8. 3D Engine

## Three.js

Three.js will provide the underlying 3D/WebGL functionality.

Use Three.js for:

* 3D scenes
* Models
* Cameras
* Lighting
* Materials
* Geometry
* Particles
* Shaders where required
* Post-processing where justified

---

# 9. React 3D Integration

## React Three Fiber

React Three Fiber will be used to integrate Three.js into the React/Next.js architecture.

Potential use cases:

* Hero 3D scene
* Interactive objects
* Scroll-driven 3D scenes
* Project visualizations
* 3D backgrounds
* Particle systems
* Interactive environments

3D scenes should be isolated into dedicated components rather than being mixed with normal UI components.

Example:

```text
three/
├── HeroScene.tsx
├── ProjectScene.tsx
├── CameraRig.tsx
├── Lighting.tsx
├── Particles.tsx
└── models/
```

---

# 10. 3D Utility Library

## @react-three/drei

Drei should be used for common React Three Fiber functionality where appropriate.

Potential utilities include:

* Cameras
* Controls
* Environment lighting
* Text
* Models
* Loaders
* Helpers
* Instances
* Effects

Do not use Drei components blindly.

Prefer lightweight custom implementations when a utility is extremely simple and introducing unnecessary complexity would not provide value.

---

# 11. 3D Asset Format

Preferred 3D asset format:

```text
GLB / GLTF
```

3D assets should be optimized before being added to the project.

Requirements:

* Reduce unnecessary polygon count
* Compress textures
* Optimize materials
* Remove unused assets
* Lazy-load heavy models
* Avoid loading all 3D assets during initial page load

---

# 12. 3D Specification

The actual 3D experience will be defined separately in:

```text
3d_spec.md
```

This document will define:

* Scenes
* Models
* Camera
* Lighting
* Materials
* Interactions
* Scroll behavior
* 3D transitions
* Asset requirements
* Mobile behavior
* Performance constraints

The implementation must follow `3d_spec.md`.

---

# 13. Animation Engine

## GSAP

GSAP will be the primary animation library.

Use GSAP for:

* Complex timeline animations
* Hero animations
* Text reveals
* Section transitions
* UI micro-interactions
* 3D object animation
* Camera animation
* SVG animation
* Project transitions

GSAP should be preferred over creating complicated custom animation systems.

---

# 14. Scroll Animation

## GSAP ScrollTrigger

ScrollTrigger will be used for scroll-driven animation.

Potential use cases:

* Section reveals
* Parallax
* Pinned sections
* Horizontal scroll experiences
* Project storytelling
* 3D camera movement
* Progress-based animations

Animations should be tied to meaningful user interactions and not applied indiscriminately.

---

# 15. Smooth Scrolling

## Lenis

Lenis will provide the smooth scrolling experience.

Responsibilities:

* Smooth page scrolling
* Scroll interpolation
* Scroll velocity
* Integration with GSAP/ScrollTrigger

Lenis and ScrollTrigger must be integrated carefully so that scroll position remains synchronized.

---

# 16. Animation Specification

The exact animation behavior will be defined in:

```text
animations.md
```

This document will define:

* Animation types
* Animation timing
* Easing
* Scroll behavior
* Parallax
* Transitions
* Micro-interactions
* SVG animations
* Hero animations
* Project animations

The implementation must follow `animations.md`.

Do not invent major animation behavior that conflicts with the specification.

---

# 17. UI Component Library

A UI component library may be used where it improves consistency and development speed.

Preferred approach:

```text
Custom UI
+
Tailwind CSS
+
Small reusable UI primitives
```

Potential libraries may include:

* shadcn/ui
* Radix UI
* Lucide

### Rule

Do not turn the portfolio into a generic component-library website.

Highly visual portfolio components should maintain their custom design language.

---

# 18. Icons

## Lucide

Lucide can be used for standard interface icons such as:

* Menu
* Close
* Arrow
* External link
* Mail
* Download
* Play
* Pause
* Volume
* GitHub
* Navigation controls

Brand/platform logos should use appropriate official or open-source icon assets where licensing permits.

---

# 19. Forms

## React Hook Form

React Hook Form should be used for the contact form.

Responsibilities:

* Form state
* Validation integration
* Submission handling
* Error handling
* Input state management

---

# 20. Validation

## Zod

Zod will be used for validation.

Use it for:

* Contact form input
* API request validation
* Environment configuration validation where appropriate
* Structured content validation
* Server-side input validation

Client-side validation must not replace server-side validation.

---

# 21. Database

## MongoDB

MongoDB will be the primary database.

Potential data:

```text
Contact Messages
Projects
Skills
Services
Experience
Education
Other dynamic portfolio data
```

However, static content should not automatically be placed into MongoDB.

Content that changes rarely may remain in:

```text
TypeScript / JSON / Markdown
```

The database should be used when persistence, dynamic updates, submissions, or future administrative functionality requires it.

---

# 22. MongoDB ODM

## Mongoose

Mongoose can be used for:

* Schema definition
* Data modeling
* Validation
* Database interaction
* Relationships/references where appropriate

Example models:

```text
ContactMessage
Project
Skill
Service
```

Only create database models that provide actual value.

---

# 23. Backend

The application can use Next.js server functionality for backend requirements.

Potential technologies:

```text
Next.js Route Handlers
+
Server Actions where appropriate
+
MongoDB
+
Mongoose
```

Do not create a separate backend service unless the project requirements actually justify it.

---

# 24. Contact Form Architecture

The contact form should follow:

```text
User
 ↓
React Hook Form
 ↓
Zod Validation
 ↓
Server-side validation
 ↓
Next.js Server Action / Route Handler
 ↓
MongoDB
 ↓
Success / Error response
```

Additional email notification functionality may be introduced later.

---

# 25. Email Service

If contact form notifications are required, an external transactional email provider may be introduced.

Possible provider:

```text
Resend
```

The provider should only be added when required.

The email architecture should not expose private API keys to the browser.

---

# 26. Video

The hero introduction will contain an AI-generated video.

Preferred approach:

```text
Optimized video asset
+
HTML5 video
+
Custom controls
+
Captions
```

Potential formats:

```text
MP4
WebM
```

Video requirements:

* Optimized file size
* Responsive playback
* Poster image
* Captions/subtitles
* Mute/unmute
* Play/pause/stop behavior
* Mobile consideration
* Lazy/preload strategy based on UX requirements

The video should not unnecessarily block the rendering of the rest of the page.

---

# 27. SVG

SVG will be used for:

* Icons
* Decorative elements
* Animated illustrations
* Hero visuals
* Technical diagrams where useful

SVG animations may be implemented through:

* GSAP
* CSS
* React

The preferred method should depend on complexity and performance.

---

# 28. Image Handling

Next.js image optimization should be used where appropriate.

Potential requirements:

* Responsive images
* Appropriate image dimensions
* Modern image formats
* Lazy loading
* Correct aspect ratios
* Avoiding layout shift

Large portfolio images should be optimized before deployment.

---

# 29. Fonts

Use a modern web font system through Next.js font optimization where possible.

Potential implementation:

```text
next/font
```

The final font choices will be defined in:

```text
design_system.md
```

---

# 30. State Management

A global state-management library should not be introduced initially.

Prefer:

```text
React state
+
Context where genuinely necessary
+
URL state
+
Server state
```

A library such as Zustand may be introduced later if the application develops meaningful shared client state.

Do not introduce Redux unless there is a strong architectural requirement.

---

# 31. Data Architecture

Portfolio content should be structured.

Potential data modules:

```text
data/
├── projects.ts
├── skills.ts
├── services.ts
├── education.ts
├── experience.ts
└── social.ts
```

This allows the same data to power:

```text
Homepage
Projects page
Skills page
Services page
```

without duplicating content.

---

# 32. API Architecture

API endpoints should be created only when necessary.

Potential API:

```text
/api/contact
```

Possible future APIs:

```text
/api/projects
/api/skills
/api/services
```

Only create endpoints that are actually required.

---

# 33. Authentication

Authentication is not required for the initial public portfolio.

If a future admin dashboard is introduced, authentication can be added at that stage.

Possible future solutions:

* Auth.js
* Clerk
* Other appropriate authentication provider

Do not introduce authentication into the initial implementation unnecessarily.

---

# 34. Version Control

## Git

Git will be used for source control.

## GitHub

GitHub will host the source repository.

Recommended branch structure:

```text
main
development
feature/*
```

For a solo project, a simpler workflow may also be used:

```text
main
feature/*
```

---

# 35. CI/CD

## GitHub Actions

GitHub Actions will provide CI/CD automation.

Potential workflow:

```text
Push / Pull Request
        ↓
Install dependencies
        ↓
Lint
        ↓
Type Check
        ↓
Tests
        ↓
Build
        ↓
Deploy
```

The exact deployment workflow will depend on the selected hosting platform.

---

# 36. Docker

Docker will be used to provide a consistent production/development environment where appropriate.

Potential files:

```text
Dockerfile
.dockerignore
docker-compose.yml
```

Docker should be configured carefully for Next.js production builds.

Do not containerize unnecessary services if the deployment platform already handles them effectively.

---

# 37. Deployment

## Render

Render will be considered the primary deployment platform for the application.

Potential deployment architecture:

```text
GitHub
   ↓
GitHub Actions
   ↓
Build / Test
   ↓
Render
   ↓
Production
```

MongoDB may be hosted separately using MongoDB Atlas.

---

# 38. MongoDB Hosting

## MongoDB Atlas

MongoDB Atlas is recommended for production database hosting.

Architecture:

```text
Next.js Application
        ↓
MongoDB / Mongoose
        ↓
MongoDB Atlas
```

Database credentials must be stored using environment variables.

Never commit database credentials to Git.

---

# 39. Environment Variables

Sensitive configuration must be stored in environment variables.

Potential variables:

```text
MONGODB_URI
NEXT_PUBLIC_SITE_URL
RESEND_API_KEY
```

Additional variables may be added as required.

Public variables must use the appropriate:

```text
NEXT_PUBLIC_
```

prefix.

Secrets must never use public environment variables.

---

# 40. Security

The application should follow basic web security practices.

Requirements:

* Server-side validation
* Input sanitization where necessary
* Secure environment variables
* No exposed secrets
* Rate limiting for public forms where necessary
* Protection against spam submissions
* Safe database queries
* Secure HTTP configuration through deployment platform
* Dependency updates

---

# 41. Testing

Testing should be introduced progressively.

Potential stack:

```text
Vitest
+
React Testing Library
+
Playwright
```

### Unit Testing

Use for:

* Utility functions
* Data transformations
* Validation
* Important business logic

### Component Testing

Use for:

* Forms
* Interactive UI
* Important components

### End-to-End Testing

Use Playwright for critical flows such as:

```text
Homepage navigation
Contact form
Project navigation
Mobile navigation
Resume interaction
```

Not every decorative animation requires automated testing.

---

# 42. Code Quality

## ESLint

ESLint will enforce code-quality rules.

## Prettier

Prettier will maintain consistent formatting.

The project should use automated formatting rather than manually formatting every file.

---

# 43. Performance Monitoring

Performance should be evaluated using:

* Lighthouse
* Chrome DevTools
* Network analysis
* Runtime performance
* FPS monitoring
* Bundle analysis

Important areas:

```text
Initial page load
JavaScript bundle
3D rendering
Video loading
Image loading
Animation performance
Mobile FPS
Memory usage
```

---

# 44. 3D Performance Strategy

Because 3D is one of the major features of the portfolio:

### Desktop

Can support:

* Higher-quality models
* More particles
* More complex effects
* Advanced post-processing where justified

### Mobile

Should potentially reduce:

* Polygon count
* Particle count
* Texture resolution
* Post-processing
* Animation intensity
* Number of simultaneous 3D objects

The 3D experience should degrade gracefully rather than simply breaking.

---

# 45. Animation Performance

Animations should primarily use GPU-friendly properties.

Prefer:

```text
transform
opacity
```

Avoid unnecessary animation of layout-triggering properties.

Examples that should be used carefully:

```text
width
height
top
left
margin
padding
```

GSAP and browser performance tools should be used to identify expensive animations.

---

# 46. Accessibility

The technology stack must support:

* Semantic HTML
* Keyboard navigation
* Accessible form controls
* Focus states
* Captions
* Reduced motion
* Screen reader compatibility

Animation systems must respect:

```text
prefers-reduced-motion
```

---

# 47. SEO

Next.js should handle SEO requirements.

Potential technologies/features:

```text
Metadata API
Open Graph
Twitter/X metadata
Sitemap
Robots
Structured Data
```

The final SEO specification will be defined separately.

---

# 48. Dependency Management

Dependencies should be kept minimal.

Before adding a new library, evaluate:

```text
1. Do we actually need it?
2. Can existing dependencies solve the problem?
3. Is it actively maintained?
4. What is its bundle impact?
5. Does it work with Next.js?
6. Does it work with SSR / Client Components?
7. Does it create unnecessary complexity?
8. Is its license appropriate?
```

Do not add libraries solely because they appear in an inspiration website.

---

# 49. Recommended Initial Dependencies

The initial project may use:

```text
next
react
react-dom
typescript

tailwindcss

three
@react-three/fiber
@react-three/drei

gsap
lenis

react-hook-form
zod

mongoose

lucide-react
```

Development tooling:

```text
eslint
prettier

vitest
@testing-library/react
playwright
```

Additional dependencies should be introduced only when justified.

---

# 50. Suggested Project Architecture

```text
src/
│
├── app/
│   ├── page.tsx
│   ├── projects/
│   │   └── page.tsx
│   ├── services/
│   │   └── page.tsx
│   ├── skills/
│   │   └── page.tsx
│   ├── api/
│   │   └── contact/
│   │       └── route.ts
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── navigation/
│   ├── hero/
│   ├── about/
│   ├── education/
│   ├── projects/
│   ├── skills/
│   ├── services/
│   ├── contact/
│   ├── footer/
│   └── ui/
│
├── three/
│   ├── scenes/
│   ├── components/
│   ├── models/
│   ├── materials/
│   ├── shaders/
│   └── utilities/
│
├── animations/
│   ├── hero/
│   ├── projects/
│   ├── sections/
│   └── utilities/
│
├── data/
│   ├── projects.ts
│   ├── skills.ts
│   ├── services.ts
│   ├── education.ts
│   └── experience.ts
│
├── hooks/
│
├── lib/
│   ├── db/
│   ├── validation/
│   └── utilities/
│
├── types/
│
└── styles/
```

---

# 51. Technology Responsibility Boundaries

Each technology should have a clearly defined responsibility.

```text
Next.js
→ Application framework / routing / server functionality

React
→ UI component architecture

TypeScript
→ Type safety

Tailwind
→ Styling

Three.js
→ 3D rendering

React Three Fiber
→ React integration for Three.js

Drei
→ 3D utilities

GSAP
→ Advanced animation

ScrollTrigger
→ Scroll-driven animation

Lenis
→ Smooth scrolling

MongoDB
→ Persistent data

Mongoose
→ MongoDB data modeling

Zod
→ Validation

React Hook Form
→ Form state

Docker
→ Containerization

GitHub Actions
→ CI/CD

Render
→ Deployment

GitHub
→ Source control
```

---

# 52. Architecture Principles

The implementation should follow these principles:

### Separation of Concerns

UI, animation, 3D, data, and backend logic should not be unnecessarily coupled.

### Reusability

Reusable components should be created for repeated patterns.

### Progressive Enhancement

The website should remain useful even when advanced visual effects are reduced.

### Performance First

3D and animation should not compromise usability.

### Content / UI Separation

Content should be stored independently from presentation where practical.

### Mobile First Thinking

Desktop should not be treated as the only target platform.

### Minimal Dependencies

Use the smallest reasonable set of libraries.

---

# 53. AI / Cursor Development Rules

Cursor should read this document before making architectural decisions.

Cursor must:

* Follow the defined technology stack
* Reuse existing libraries
* Avoid unnecessary dependencies
* Follow TypeScript strictness
* Follow component architecture
* Follow animation specifications
* Follow 3D specifications
* Follow design system
* Preserve working functionality
* Avoid unnecessary rewrites

Cursor should not independently replace:

```text
Next.js
Three.js
GSAP
Lenis
MongoDB
Tailwind
```

with alternative technologies without explicit approval.

---

# 54. Source of Truth

The technology stack defines **which technologies are allowed and what they are responsible for**.

Other specifications define their respective concerns:

```text
PRD.md
→ Product requirements

design_system.md
→ Visual language

ux_flow.md
→ User experience

page_structure.md
→ Page/section structure

animations.md
→ Animation behavior

3d_spec.md
→ 3D behavior

content.md
→ Personal content

projects.md
→ Project information

services.md
→ Service information

skills.md
→ Skill information

tech_stack.md
→ Technology choices

cursor_rules.md
→ AI-assisted development rules
```

When implementing a feature, Cursor should consult the relevant specification instead of relying on assumptions.

---

# 55. Final Stack

The intended initial stack is:

```text
┌─────────────────────────────────────────┐
│                 FRONTEND                │
├─────────────────────────────────────────┤
│ Next.js                                 │
│ React                                   │
│ TypeScript                              │
│ Tailwind CSS                            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              3D / ANIMATION             │
├─────────────────────────────────────────┤
│ Three.js                                │
│ React Three Fiber                       │
│ Drei                                    │
│ GSAP                                    │
│ ScrollTrigger                           │
│ Lenis                                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              DATA / BACKEND             │
├─────────────────────────────────────────┤
│ Next.js Server Functions                │
│ MongoDB                                 │
│ Mongoose                                │
│ Zod                                     │
│ React Hook Form                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              DEVELOPMENT                │
├─────────────────────────────────────────┤
│ Git                                     │
│ GitHub                                  │
│ ESLint                                  │
│ Prettier                                │
│ Cursor                                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              TESTING                    │
├─────────────────────────────────────────┤
│ Vitest                                  │
│ React Testing Library                   │
│ Playwright                              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              DEVOPS                     │
├─────────────────────────────────────────┤
│ Docker                                  │
│ GitHub Actions                          │
│ Render                                  │
│ MongoDB Atlas                            │
└─────────────────────────────────────────┘
```

---

# 56. Technology Decision Principle

The goal is not to maximize the number of technologies used.

The goal is to build the portfolio with the **smallest coherent technology stack capable of producing the intended experience**.

Every technology should have a clear purpose.

The portfolio should prioritize:

**Performance + Maintainability + Visual Quality + Developer Experience + Scalability**

over unnecessary technical complexity.
