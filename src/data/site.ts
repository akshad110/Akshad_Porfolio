export const site = {
  name: "Akshad Vengurlekar",
  shortName: "Akshad",
  role: "Full Stack Developer",
  tagline: "Building ideas into experiences.",
  description:
    "Computer Science Engineering student and full-stack developer building reliable, interactive digital products.",
  email: "akshadvengurlekar35@gmail.com",
  phone: "+91 78755 48084",
  phoneRaw: "7875548084",
  location: "Vadodara, Gujarat, India",
  github: "https://github.com/akshad110",
  linkedin: "https://www.linkedin.com/in/akshad-vengurlekar/",
  leetcode: "https://leetcode.com/u/akshad60/",
  codechef: "https://www.codechef.com/users/akshad_06",
  codeforces: "https://codeforces.com/profile/akshad_06",
  portrait: "/images/akshad-portrait.png",
  heroVideo: "/videos/hero-intro.mp4?v=20260914165400",
  heroVideoPoster: "/videos/hero-intro-poster.webp?v=20260914165400",
  ogImage: "/images/akshad-portrait.png",
  resume: "/docs/akshad-vengurlekar-resume.pdf",
} as const;

export const heroCopy = {
  greeting: "Hello, I'm",
  name: "Akshad Vengurlekar",
  role: "Full Stack Developer",
  statement:
    "I design and build modern web products — from AI-powered platforms to cinematic, interactive experiences.",
  aside: "Building ideas into experiences.",
} as const;

export const aboutCopy = {
  intro:
    "I’m Akshad Vengurlekar, a Computer Science Engineering student pursuing my B.Tech from Parul University. I have 1.5+ years of freelance experience as a Full-Stack Developer, where I’ve built and delivered 10+ real-world projects for clients using React, Node.js, JavaScript, SQL, and NoSQL databases.",
  dsa: "Alongside development, I have a strong focus on Data Structures and Algorithms and problem solving. I’ve solved 650+ problems on LeetCode and regularly practice competitive programming to strengthen my logical and analytical skills.",
  aim: "My aim is to grow as a software engineer, continuously improve my technical skills, and build reliable and meaningful solutions to real-world problems.",
} as const;

export const education = [
  {
    id: "btech",
    title: "B.Tech, Computer Science Engineering",
    institution: "Parul University",
    location: "Vadodara, Gujarat",
    duration: "2023 — 2027",
    description:
      "Currently a 4th-year Computer Science Engineering student. Focused on full-stack product development, data structures, and building production-ready software.",
  },
  {
    id: "hsc",
    title: "Higher Secondary Education",
    institution: "Deepvihar Higher Secondary School",
    location: "Headland Sada, Vasco da Gama, Goa",
    duration: "2021 — 2023",
    description:
      "Completed higher secondary education before beginning the Computer Science Engineering program at Parul University.",
  },
] as const;

export const services = [
  {
    title: "Full Stack Web Development",
    description:
      "End-to-end product development with React, Node.js, and modern databases — from architecture to deployment.",
    deliverables: ["Product architecture", "Web application", "Admin systems", "Deployment"],
  },
  {
    title: "Frontend Development",
    description:
      "Responsive, accessible interfaces with strong typography, motion, and interaction design.",
    deliverables: ["UI implementation", "Animation", "Design systems", "Performance"],
  },
  {
    title: "Backend & API Development",
    description:
      "Secure APIs, authentication, payments, and data models that keep products reliable as they grow.",
    deliverables: ["REST APIs", "Auth", "Database design", "Integrations"],
  },
  {
    title: "E-Commerce Development",
    description:
      "Storefronts with product management, orders, and payment flows built for real operations.",
    deliverables: ["Storefront", "Admin dashboard", "Payments", "Order workflows"],
  },
  {
    title: "Interactive / 3D Web Experiences",
    description:
      "Cinematic web experiences using GSAP, scroll-driven motion, and Three.js where they serve the story.",
    deliverables: ["Motion systems", "3D scenes", "Scroll experiences", "Performance tuning"],
  },
  {
    title: "Deployment & CI/CD",
    description:
      "Containerized delivery, automated pipelines, and production-ready hosting setups.",
    deliverables: ["Docker", "CI/CD", "Cloud hosting", "Monitoring basics"],
  },
] as const;

export const processSteps = [
  {
    title: "Discover",
    text: "Understand the problem, audience, and constraints before a single screen is designed.",
  },
  {
    title: "Design",
    text: "Shape information architecture, interface, and interaction so the product feels intentional.",
  },
  {
    title: "Build",
    text: "Implement with a maintainable stack, real data, and production-grade engineering practices.",
  },
  {
    title: "Ship",
    text: "Deploy, iterate, and keep the experience fast, accessible, and easy to evolve.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Akshad delivered our full-stack web app on time with clean UI and solid backend work. Communication was clear throughout the project.",
    name: "Rohan Mehta",
    role: "Client · Startup Founder",
  },
  {
    quote:
      "He understood the product requirements quickly and built a responsive, production-ready experience. Very reliable freelancer to work with.",
    name: "Priya Sharma",
    role: "Client · Product Manager",
  },
  {
    quote:
      "From API design to frontend polish, everything felt thoughtful. Our admin flow and client-facing pages both improved a lot after his work.",
    name: "Aarav Patel",
    role: "Client · Business Owner",
  },
  {
    quote:
      "Great attention to detail and performance. Akshad turned our ideas into a smooth, modern website without unnecessary complexity.",
    name: "Ananya Iyer",
    role: "Client · Marketing Lead",
  },
  {
    quote:
      "Professional, fast, and easy to collaborate with. He handled React, Node, and deployment confidently and kept us updated at every step.",
    name: "Vikram Singh",
    role: "Client · Agency Partner",
  },
  {
    quote:
      "The final delivery looked polished and worked well on mobile. Happy to recommend Akshad for full-stack freelance projects.",
    name: "Sneha Nair",
    role: "Client · E-commerce Founder",
  },
] as const;

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Me" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact Me" },
] as const;

export const mobileNavItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Me" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact Me" },
] as const;
