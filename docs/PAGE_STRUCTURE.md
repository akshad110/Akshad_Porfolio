

PAGE STRUCTURE

Project: Akshad Vengurlekar — Personal Developer Portfolio
Document Type: Page Structure & Layout Specification
Version: 1.0
Status: Development Specification

1. Purpose

This document defines the complete page structure of the portfolio website.

It specifies:

Public pages
Admin pages
Section ordering
Content hierarchy
Layout structure
Component responsibilities
Desktop/tablet/mobile behavior
Navigation relationships
CTA destinations
Dynamic content sources
Featured-content behavior

This document works together with:

01_PRD.md → Product requirements
02_DESIGN_SYSTEM.md → Visual design system
TECH_STACK.md → Technology decisions
PROJECT_DATA.md → Project data structure
CONTENT.md → Initial content/seed data
ANIMATIONS.md → Animation behavior
3D_SPEC.md → 3D implementation specification
Important Rule

PAGE_STRUCTURE.md defines what appears where.

It does not define detailed animation implementation, Three.js implementation, database schemas, or styling tokens unless required to explain the layout.

2. Global Website Structure

The website has two major areas:

APPLICATION
│
├── PUBLIC WEBSITE
│   ├── /
│   ├── /about
│   ├── /projects
│   ├── /skills
│   ├── /services
│   ├── /achievements
│   └── /course-certifications
│
└── ADMIN CMS
    └── /admin
        ├── /admin
        ├── /admin/projects
        ├── /admin/skills
        ├── /admin/achievements
        ├── /admin/certifications
        └── /admin/messages

The public website is focused on:

Discover → Understand → Explore → Trust → Contact

The admin system is focused on:

Manage → Publish → Feature → Reorder → Maintain

3. Global Public Layout

Every public page should follow a consistent overall structure.

┌─────────────────────────────────────────────┐
│                  NAVBAR                     │
├─────────────────────────────────────────────┤
│                                             │
│                PAGE CONTENT                 │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│                  FOOTER                     │
└─────────────────────────────────────────────┘
Global Components
PublicLayout
│
├── Navbar
├── Main
│   └── Page Content
└── Footer
4. Navbar

The navbar is shared across all public pages.

Navigation Items
Logo / Name

Home
About Me
Projects
Services
Contact Me

Optional utility elements:

Theme / Visual control
Resume
Hire Me

The exact utility controls should remain minimal.

Desktop Structure
┌────────────────────────────────────────────────────┐
│ LOGO        Home  About  Projects  Services  Contact│
└────────────────────────────────────────────────────┘
Mobile Structure
┌──────────────────────────────┐
│ LOGO                  MENU ☰ │
└──────────────────────────────┘

Opening the menu should display:

Home
About Me
Projects
Services
Skills
Achievements
Certifications
Contact Me
Navbar Rules
Navbar must remain visually consistent throughout the website.
Current page should have a clear active state.
Navigation should never cover important content.
Desktop navigation should remain minimal.
Mobile navigation should use a dedicated menu experience.
Avoid excessive navbar animations.
Navbar may use subtle transparency/glass treatment according to the Design System.
5. HOME PAGE
Route
/

The homepage is the primary storytelling experience.

The page should introduce the developer first and progressively reveal:

Identity
↓
About
↓
Education
↓
Projects
↓
Skills
↓
Competitive Programming
↓
Achievements
↓
Certifications
↓
Contact
6. Home Page Structure
HOME
│
├── Navbar
│
├── Hero
│
├── About Preview
│
├── Education
│
├── Featured Projects
│
├── Skills
│
├── Competitive Programming
│
├── Featured Achievements
│
├── Featured Certifications
│
├── Contact / Hire Me
│
└── Footer
7. Hero Section

The hero is the first major visual experience.

Structure
Hero
│
├── Background / 3D Environment
│
├── Personal Intro
│   ├── Greeting
│   ├── Name
│   ├── Role
│   ├── Short Description
│   └── CTA
│
├── AI Generated Character Video
│
├── Video Controls
│
└── Scroll Indicator
Content Hierarchy
Small Label
    ↓
Hello, I'm
    ↓
AKSHAD VENGURLEKAR
    ↓
Developer / Full Stack Developer
    ↓
Short personal statement
    ↓
[ View Projects ] [ Hire Me ]

The AI-generated character/video should act as a storytelling element rather than replacing the textual introduction.

Hero CTA

Primary:

View My Work

Destination:

/projects

Secondary:

Hire Me

Destination:

#contact
Hero Video Controls

Controls may include:

Mute / Unmute
Pause / Play
Stop

Captions should be available when the character is speaking.

8. About Preview

The homepage should contain a short version of the About section.

Layout

Desktop:

┌──────────────────────┬──────────────────────┐
│                      │                      │
│     ABOUT TEXT       │       IMAGE          │
│                      │                      │
│     Introduction     │                      │
│     Background       │                      │
│     Interests        │                      │
│                      │                      │
│     [Read More]      │                      │
└──────────────────────┴──────────────────────┘

Mobile:

IMAGE
   ↓
ABOUT TEXT
   ↓
READ MORE
Content

Include:

Short introduction
Developer identity
Main technical interests
Development philosophy
Short personal statement

CTA:

Read More

Destination:

/about
9. ABOUT PAGE
Route
/about

The About page provides a deeper introduction.

Structure
ABOUT
│
├── Page Hero
│
├── Introduction
│
├── Personal Background
│
├── Development Journey
│
├── What I Build
│
├── Technical Interests
│
├── Education Preview
│
└── CTA
Page Hero
ABOUT ME

A short statement introducing the developer.
Main About Layout
┌──────────────────────────────┐
│ Image / Visual               │
├──────────────────────────────┤
│ Introduction                 │
│ Background                   │
│ Development Journey          │
└──────────────────────────────┘

On desktop, image and text may be arranged side-by-side.

On mobile, content becomes vertically stacked.

10. Education Section

Education is primarily presented on the homepage but may also be incorporated into /about.

Structure
Education
│
├── Degree
├── Institution
├── Duration
├── Location
├── Description
└── Relevant Information

Possible visual structure:

Timeline

● Degree
│
│
● Previous Education
│
│
● Earlier Education

The layout should remain editorial and minimal.

11. PROJECTS PAGE
Route
/projects

This page displays all published projects.

Projects are dynamically retrieved from MongoDB.

Structure
PROJECTS
│
├── Page Hero
│
├── Project Introduction
│
├── Project Filters / Categories
│
├── Project Grid
│   ├── Project Card
│   ├── Project Card
│   ├── Project Card
│   └── ...
│
└── CTA
12. Project Grid

Desktop:

┌─────────────────────┬─────────────────────┐
│                     │                     │
│     PROJECT 01      │     PROJECT 02      │
│                     │                     │
└─────────────────────┴─────────────────────┘

┌─────────────────────┬─────────────────────┐
│                     │                     │
│     PROJECT 03      │     PROJECT 04      │
│                     │                     │
└─────────────────────┴─────────────────────┘

The exact grid can vary depending on project imagery and visual composition.

Project Card

Each card should contain:

Project Thumbnail
Project Title
Short Description
Category
Technology / Skills
View Project

Optional:

Live Demo
GitHub

The card should remain visually clean and not contain every piece of project information.

13. Project Detail Page

Each project should have a dynamic route:

/projects/[slug]
Structure
PROJECT DETAIL
│
├── Project Hero
│   ├── Title
│   ├── Category
│   ├── Description
│   └── Hero Media
│
├── Project Overview
│
├── Problem / Purpose
│
├── Solution
│
├── Key Features
│
├── Technologies Used
│
├── Project Gallery
│
├── Demo / Video
│
├── Links
│   ├── Live Website
│   └── GitHub / Source Code
│
└── Next Project
Source Code Behavior

If GitHub is public:

View Source Code

If GitHub is private:

Request access for the source code

The UI must respect the project's githubAccess state.

14. FEATURED PROJECTS ON HOME

The homepage displays exactly the selected top projects.

Maximum:

3 projects

These are controlled from the Admin CMS.

Data Flow
MongoDB
   ↓
Published Projects
   ↓
Featured Projects
   ↓
featuredOrder
   ↓
LIMIT 3
   ↓
Homepage

The homepage must NOT contain hardcoded project names.

Home Layout
FEATURED PROJECTS

Project 1
Project 2
Project 3

             [See All Projects]

CTA:

See All Projects

Destination:

/projects
15. SERVICES PAGE
Route
/services

The Services page explains what services the developer offers.

Structure
SERVICES
│
├── Page Hero
│
├── Services Introduction
│
├── Service Cards
│
├── Development Process
│
├── Why Work With Me
│
├── CTA
│
└── Footer
Service Card
Icon
Service Title
Short Description
Key Deliverables

Potential services:

Full Stack Web Development
Frontend Development
Backend Development
E-Commerce Development
3D / Interactive Web Experiences
API Development
Deployment / CI/CD
Website Optimization

Only services actually offered should be displayed.

16. SKILLS PAGE
Route
/skills

This page provides a complete overview of technical skills.

Structure
SKILLS
│
├── Page Hero
│
├── Skills Introduction
│
├── Development Skills
│
│   ├── Frontend
│   ├── Backend
│   ├── Database
│   ├── DevOps / Cloud
│   └── Tools
│
├── Competitive Programming
│
│   ├── LeetCode
│   ├── CodeChef
│   └── Codeforces
│
└── CTA
17. Skill Card

Skill cards should contain:

Skill Icon
Skill Name
Category

When interacted with:

Skill Popup
│
├── Skill Name
├── Proficiency
├── Short Explanation
├── Used In
│
└── View Projects

The Used In section should be dynamically derived from project relationships.

Example:

React

Proficiency
Advanced

Used In
• Project A
• Project B
• Project C
18. ACHIEVEMENTS PAGE
Route
/achievements

This page contains all published achievements.

Structure
ACHIEVEMENTS
│
├── Page Hero
│
├── Introduction
│
├── Achievement Grid / Timeline
│
│   ├── Achievement Card
│   ├── Achievement Card
│   └── ...
│
└── CTA
19. Achievement Card

Each achievement should contain:

Image / Certificate / Visual
Achievement Title
Organization
Date
Short Description

Optional:

Category
External Link

Cards should prioritize the achievement itself rather than excessive metadata.

20. FEATURED ACHIEVEMENTS ON HOME

Homepage displays:

Top 3 Featured Achievements

Selection is controlled by Admin CMS.

Data Flow
MongoDB
   ↓
Published Achievements
   ↓
Featured Achievements
   ↓
featuredOrder
   ↓
LIMIT 3
   ↓
Homepage
Layout
ACHIEVEMENTS

Achievement 1
Achievement 2
Achievement 3

            [See More]

CTA:

See More

Destination:

/achievements

No achievement should be manually hardcoded into the homepage.

21. COURSE & CERTIFICATIONS PAGE
Route
/course-certifications

This page combines courses and professional certifications.

Structure
COURSES & CERTIFICATIONS
│
├── Page Hero
│
├── Introduction
│
├── Certifications
│
├── Courses
│
└── CTA

Possible separation:

CERTIFICATIONS

[Certification Card]
[Certification Card]
[Certification Card]


COURSES

[Course Card]
[Course Card]
[Course Card]
22. Certification / Course Card

Each item may contain:

Logo / Certificate Image
Title
Issuing Organization
Completion Date
Short Description
Credential ID (if available)
Credential Link (if available)

Optional:

Skills Learned
23. FEATURED CERTIFICATIONS ON HOME

Homepage displays exactly:

Top 3 Featured Certifications / Courses

The admin controls which records are featured and their order.

Data Flow
MongoDB
   ↓
Published Certifications / Courses
   ↓
Featured Items
   ↓
featuredOrder
   ↓
LIMIT 3
   ↓
Homepage
Home Layout
COURSES & CERTIFICATIONS

Item 1
Item 2
Item 3

             [See More]

Destination:

/course-certifications
24. CONTACT SECTION

The homepage contains a full contact section near the bottom.

It should also be accessible through:

#contact
Structure
CONTACT
│
├── Heading
├── Short Message
│
├── Contact Information
│
│   ├── Email
│   ├── Phone (if publicly displayed)
│   ├── Location (if publicly displayed)
│   └── Social Links
│
├── Contact Form
│
├── Resume CTA
│
└── Hire Me CTA
25. Contact Form

Fields:

Name
Email
Subject
Message
Submit

Optional:

Project Type
Budget

The form should have:

Loading State
Success State
Error State
Validation Messages

Messages submitted through the form should be available inside:

/admin/messages
26. HIRE ME CTA

The Hire Me CTA should appear in strategic locations:

Hero
Services
Contact
Footer

Primary destination:

#contact

The goal is to avoid forcing users to search for a way to contact the developer.

27. FOOTER

Footer is shared across all public pages.

Structure
FOOTER
│
├── Logo / Name
├── Short Description
│
├── Navigation
│
├── Social Links
│
├── Resume
│
├── Contact
│
└── Copyright

Example:

AKSHAD VENGURLEKAR

Building modern, interactive digital experiences.

Navigation
Socials
Contact

© 2026 Akshad Vengurlekar
28. ADMIN CMS

The Admin CMS is a private management interface.

Base Route
/admin

The public portfolio and admin system should be treated as two different UI experiences.

29. Admin Structure
ADMIN
│
├── Authentication
│
└── Dashboard
    │
    ├── Projects
    ├── Skills
    ├── Achievements
    ├── Certifications
    └── Messages
30. Admin Authentication

Before accessing the dashboard:

/admin
      ↓
Authentication
      ↓
Authenticated?
   ↙       ↘
 NO         YES
 ↓           ↓
Login      Dashboard

Unauthenticated users must not access admin management pages.

31. Admin Dashboard
Route
/admin

The dashboard provides a high-level overview.

Structure
ADMIN DASHBOARD
│
├── Sidebar
│
├── Header
│
├── Statistics
│   ├── Projects
│   ├── Skills
│   ├── Achievements
│   ├── Certifications
│   └── Messages
│
├── Featured Content
│   ├── Featured Projects
│   ├── Featured Achievements
│   └── Featured Certifications
│
└── Recent Activity
32. Admin Sidebar
Dashboard

Content
├── Projects
├── Skills
├── Achievements
└── Certifications

Communication
└── Messages

System
└── Logout

On mobile, the sidebar should become a drawer/navigation menu.

33. ADMIN PROJECT MANAGEMENT
Route
/admin/projects
Structure
PROJECT MANAGEMENT
│
├── Page Header
│   ├── Projects
│   └── Add Project
│
├── Filters
│   ├── Status
│   ├── Category
│   └── Featured
│
├── Project Table / Cards
│
└── Pagination

Each project should expose:

Title
Status
Featured
Featured Order
Category
Updated At
Actions

Actions:

Edit
View
Publish / Unpublish
Feature / Unfeature
Archive
Delete
34. ADMIN PROJECT FORM

The create/edit project interface should contain:

Basic Information
├── Title
├── Slug
├── Category
└── Description

Technology
└── Skills

Links
├── Live Link
└── GitHub

Media
├── Thumbnail
├── Images
└── Video

Visibility
├── Status
├── Featured
└── Featured Order

GitHub Access
├── Public
├── Private
├── Request Access
└── Not Available

The same form can be used for:

Create
Edit
35. ADMIN SKILLS MANAGEMENT
Route
/admin/skills
Structure
SKILLS MANAGEMENT
│
├── Page Header
├── Add Skill
├── Skill Categories
│
└── Skills List

Skill fields:

Name
Category
Icon
Proficiency
Description
Order
Status

Skill relationships should connect skills to projects.

36. ADMIN ACHIEVEMENT MANAGEMENT
Route
/admin/achievements
Structure
ACHIEVEMENTS MANAGEMENT
│
├── Page Header
├── Add Achievement
├── Filters
└── Achievement List

Achievement management must support:

Create
Edit
Delete
Archive
Publish
Unpublish
Feature
Unfeature
Reorder

Featured limit:

Maximum 3
37. ADMIN CERTIFICATION MANAGEMENT
Route
/admin/certifications

This section manages:

Certifications
Courses
Structure
CERTIFICATIONS & COURSES
│
├── Page Header
├── Add Item
├── Type Filter
│   ├── Certification
│   └── Course
│
├── Status Filter
└── Item List

Management:

Create
Edit
Delete
Archive
Publish
Unpublish
Feature
Unfeature
Reorder

Featured limit:

Maximum 3
38. ADMIN MESSAGES
Route
/admin/messages
Structure
MESSAGES
│
├── Message List
│
└── Message Detail

Message list:

Name
Email
Subject
Date
Status

Message statuses:

Unread
Read
Replied
Archived

The admin should be able to:

Open
Mark as Read
Archive
Delete
39. RESPONSIVE PAGE STRUCTURE

The website must support:

Desktop
Tablet
Mobile
40. Desktop Layout

Desktop should take advantage of:

12-column grid
Large typography
Wide visual compositions
Side-by-side layouts
3D environments
Horizontal project layouts
Large imagery

Typical structure:

┌─────────────────────────────────────────────┐
│                 NAVBAR                      │
├─────────────────────────────────────────────┤
│                                             │
│              FULL WIDTH HERO                │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│       TWO COLUMN / GRID CONTENT             │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│                  FOOTER                     │
└─────────────────────────────────────────────┘
41. Tablet Layout

Tablet should reduce:

Column count
Typography scale
Image sizes
3D complexity
Horizontal spacing

Two-column layouts may remain where useful.

42. Mobile Layout

Mobile should prioritize:

Readable
Scrollable
Touch-friendly
Fast
Simple

Most layouts become:

1 Column

Example:

Image
↓
Heading
↓
Description
↓
CTA

Avoid layouts that require hover to understand content.

43. Mobile Navigation

Desktop:

Logo | Navigation

Mobile:

Logo | Menu

Menu opens into:

Home
About
Projects
Skills
Services
Achievements
Certifications
Contact
44. Mobile 3D Behavior

3D should not be treated as mandatory at full desktop complexity.

On mobile:

Reduce object count
Reduce visual complexity
Reduce movement
Avoid blocking content
Avoid hover-dependent interactions
Prioritize performance
Provide fallback visuals when necessary

The page content must remain understandable even if 3D is disabled.

45. Page-to-Page Navigation

Primary navigation:

Home
 ↓
About
 ↓
Projects
 ↓
Services
 ↓
Contact

Secondary exploration:

Home
 ├── Featured Projects → /projects
 │                       └── /projects/[slug]
 │
 ├── Skills → /skills
 │
 ├── Achievements → /achievements
 │
 └── Certifications → /course-certifications
46. Homepage CTA Map
Hero
│
├── View Projects
│       ↓
│   /projects
│
└── Hire Me
        ↓
     #contact


About Preview
│
└── Read More
        ↓
      /about


Featured Projects
│
└── See All Projects
        ↓
     /projects


Featured Achievements
│
└── See More
        ↓
   /achievements


Featured Certifications
│
└── See More
        ↓
 /course-certifications
47. Dynamic Content Architecture

The following content must be dynamic:

Projects
Skills
Achievements
Certifications / Courses
Messages

The public website should retrieve published content from the backend/database.

Initial Data Flow
CONTENT.md
     ↓
Seed / Initialization
     ↓
MongoDB
     ↓
Public Website

After initial setup:

ADMIN CMS
     ↓
MongoDB
     ↓
Public Website

CONTENT.md should NOT remain the permanent source of truth for dynamic entities.

48. Featured Content Architecture

Featured content is controlled by the admin.

Projects
Maximum: 3
Achievements
Maximum: 3
Certifications / Courses
Maximum: 3

Each featured collection should support:

isFeatured
featuredOrder

The homepage queries:

published
+
featured
+
sorted by featuredOrder
+
limit 3
49. Empty States

Every dynamic page must have a useful empty state.

Example:

No projects available yet.

For homepage featured content:

If no featured items exist,
the section should gracefully hide
or show an appropriate fallback.

Do not render broken cards or empty containers.

50. Loading States

Dynamic content should support loading states.

Examples:

Projects Loading
Skills Loading
Achievements Loading
Certifications Loading
Messages Loading

Use lightweight skeletons or appropriate loading UI.

Avoid unnecessarily complex loading animations.

51. Error States

If dynamic content fails to load:

Something went wrong.
Please try again.

Where appropriate:

Retry

Errors should not cause the entire website to become unusable.

52. 404 Page
Route
/not-found

The 404 experience should follow the same visual language.

Structure:

404

Page Not Found

The page you're looking for doesn't exist.

[Back Home]

Optional interactive/3D visual can be used, but it should remain lightweight.

53. General Component Hierarchy

A recommended component hierarchy:

app/
│
├── layout
│   ├── Navbar
│   └── Footer
│
├── page
│   ├── Hero
│   ├── AboutPreview
│   ├── Education
│   ├── FeaturedProjects
│   ├── SkillsPreview
│   ├── CompetitiveProgramming
│   ├── FeaturedAchievements
│   ├── FeaturedCertifications
│   └── Contact
│
├── projects
│   ├── ProjectsHero
│   ├── ProjectFilters
│   ├── ProjectGrid
│   └── ProjectCard
│
├── skills
│   ├── SkillsHero
│   ├── SkillCategories
│   └── SkillCard
│
├── achievements
│   ├── AchievementsHero
│   └── AchievementCard
│
├── course-certifications
│   ├── PageHero
│   ├── CertificationSection
│   ├── CourseSection
│   └── CertificationCard
│
└── admin
    ├── AdminLayout
    ├── Sidebar
    ├── Dashboard
    ├── ProjectManagement
    ├── SkillManagement
    ├── AchievementManagement
    ├── CertificationManagement
    └── MessageManagement

This is a conceptual hierarchy. Cursor may reorganize folders if doing so improves maintainability, but page responsibilities must remain equivalent.

54. Separation of Concerns

The implementation should maintain a strict separation:

PAGE
 ↓
SECTION
 ↓
COMPONENT
 ↓
DATA

For example:

FeaturedProjects
      ↓
ProjectCard
      ↓
Project Data
      ↓
MongoDB

Do not place database queries directly inside purely presentational components when avoidable.

55. Visual Hierarchy Rule

Every page should have:

1. Clear Entry Point
2. Strong Heading
3. Supporting Context
4. Primary Content
5. Action / CTA

Avoid presenting large amounts of information immediately.

The user should understand:

Where am I?
What is this?
Why does it matter?
What can I do next?

within the first viewport or two.

56. Content Density

The portfolio should not feel like a resume pasted onto a website.

Use:

Large visual sections
Short paragraphs
Strong headings
Cards where appropriate
Whitespace
Visual storytelling
Progressive disclosure

Detailed information should appear deeper in the relevant page.

57. Design Consistency

All pages must follow the Design System.

Use:

Defined color palette
Defined typography
Defined spacing
Defined border radius
Defined container widths
Defined grid
Defined button styles
Defined interaction language

Do not introduce random:

Colors
Fonts
Gradients
Shadows
Border styles
UI patterns

without a clear reason.

58. Accessibility Structure

Page structure must remain accessible without visual effects.

Important requirements:

Semantic HTML
Proper heading hierarchy
Accessible navigation
Keyboard-accessible interactive elements
Visible focus states
Meaningful alt text
Accessible form labels
Accessible error messages
Reduced-motion support
No information available only through hover

The website must remain understandable without 3D or animation.

59. SEO Structure

Every public page should have:

Unique Title
Unique Description
Canonical URL
Open Graph Metadata
Relevant Heading Structure

Project detail pages should dynamically generate metadata from project data.

Example:

/projects/project-slug

should use:

Project Title
Project Description
Project Image

for metadata where appropriate.

60. Final Public Sitemap
/
│
├── /about
│
├── /projects
│   └── /projects/[slug]
│
├── /skills
│
├── /services
│
├── /achievements
│
├── /course-certifications
│
└── #contact
61. Final Admin Sitemap
/admin
│
├── /admin
│
├── /admin/projects
│
├── /admin/skills
│
├── /admin/achievements
│
├── /admin/certifications
│
└── /admin/messages
62. Source-of-Truth Rules

Cursor must follow these rules when implementing the page structure:

Rule 1 — PRD

01_PRD.md defines what the product must accomplish.

Rule 2 — Design System

02_DESIGN_SYSTEM.md defines visual language.

Rule 3 — Page Structure

PAGE_STRUCTURE.md defines where content appears.

Rule 4 — Project Data

PROJECT_DATA.md defines project-related data and behavior.

Rule 5 — Content

CONTENT.md provides initial content/seed data.

Rule 6 — Database

MongoDB becomes the source of truth for dynamic content after initial seeding.

Rule 7 — Admin

The Admin CMS is the primary interface for managing dynamic portfolio content.

Rule 8 — Homepage

The homepage must consume dynamic featured content.

Never hardcode:

Top 3 Projects
Top 3 Achievements
Top 3 Certifications
Rule 9 — Responsive

Every page must work on:

Desktop
Tablet
Mobile
Rule 10 — Progressive Enhancement

3D and animation enhance the experience but must never be required to understand or use the website.

63. Implementation Priority

Implement the website in this order:

PHASE 1
│
├── Global Layout
├── Navbar
├── Footer
└── Routing

PHASE 2
│
├── Home
├── About
├── Projects
├── Services
├── Skills
├── Achievements
└── Certifications

PHASE 3
│
├── Project Detail
└── Contact Form

PHASE 4
│
├── Admin Authentication
├── Admin Dashboard
├── Project Management
├── Skill Management
├── Achievement Management
├── Certification Management
└── Message Management

PHASE 5
│
├── MongoDB Integration
├── Dynamic Featured Content
└── Content Seeding

PHASE 6
│
├── Animation
├── Scroll Effects
├── 3D
└── Advanced Interactions

PHASE 7
│
├── Performance
├── Accessibility
├── SEO
├── Testing
└── Deployment
64. Core Principle

The portfolio should feel like a single cohesive interactive experience, not a collection of unrelated pages.

The user journey should naturally progress:

INTRODUCTION
      ↓
WHO AM I?
      ↓
WHAT HAVE I BUILT?
      ↓
WHAT DO I KNOW?
      ↓
WHAT HAVE I ACHIEVED?
      ↓
WHAT HAVE I LEARNED?
      ↓
WHAT CAN I DO FOR YOU?
      ↓
CONTACT / HIRE

The design, 3D environment, animations, typography, content and navigation should all reinforce this journey.

The website should communicate capability through experience, not through excessive visual decoration.