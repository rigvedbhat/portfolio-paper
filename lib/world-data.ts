import type { Destination, JourneyStage, Project } from "./types";

/* ── Destinations ────────────────────────────────────────────── */

export const destinations: Destination[] = [
  { id: "origin", label: "THE LORE", subtitle: "The living world" },
  { id: "about", label: "ABOUT", subtitle: "The story" },
  { id: "projects", label: "PROJECTS", subtitle: "The living archive" },
  { id: "research", label: "RESEARCH", subtitle: "The inquiry" },
  { id: "journey", label: "EXPERIENCE", subtitle: "The path" },
  { id: "contact", label: "CONTACT", subtitle: "The signal" },
  { id: "dlc", label: "DLC", subtitle: "Real life gallery" },
];

/* ── Loading Tips ────────────────────────────────────────────── */

export const loadingTips = [
  "Every project starts with a real point of friction.",
  "The goal is not to make technology louder. It is to make complex things more usable.",
  "Useful AI earns trust by staying close to the user.",
  "Engineering is not only about correctness. It is about grace.",
  "Research begins where intuition is no longer enough.",
];

/* ── Categorized Projects ────────────────────────────────────── */

export interface CategorizedProject extends Project {
  category: "WEBSITE" | "RESEARCH" | "MACHINE LEARNING";
  imageUrl: string;
  tags: string[];
}

export const categorizedProjects: CategorizedProject[] = [
  // ── WEBSITE ──
  {
    slug: "seromod",
    owner: "rigvedbhat",
    repo: "Cruxy---ModVerse",
    title: "SEROMOD",
    subtitle: "A living Discord infrastructure and server management system (formerly Cruxy).",
    quote: "A server should not need an operations team to feel alive.",
    theme: "engineering",
    category: "WEBSITE",
    imageUrl: "/Crux AI logo.png",
    tags: ["Next.js", "Discord API", "Python"],
  },
  {
    slug: "portfolio",
    owner: "rigvedbhat",
    repo: "portfolio-preview",
    title: "PORTFOLIO",
    subtitle: "An interactive cinematic portfolio world inspired by Ghost of Tsushima.",
    quote: "Forget web conventions. Build handcrafted atmospheres.",
    theme: "engineering",
    category: "WEBSITE",
    imageUrl: "/rig-photo.jpg",
    tags: ["Three.js", "React", "Next.js"],
  },
  {
    slug: "vyanjan-dravyani",
    owner: "rigvedbhat",
    repo: "vyanjan_dravyani_website",
    title: "VYANJAN DRAVYANI WEBSITE",
    subtitle: "A web application dedicated to culinary formulations and ingredient digital archives.",
    quote: "Crafting digital spaces for culinary heritage and formulation.",
    theme: "engineering",
    category: "WEBSITE",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    tags: ["Web Application", "JavaScript", "HTML/CSS"],
  },

  // ── RESEARCH ──
  {
    slug: "tourism-ai-dss",
    owner: "rigvedbhat",
    repo: "tourism-ai-dss",
    title: "TOURISM FLOW REDISTRIBUTION",
    subtitle: "A decision support system exploring how spatial intelligence reshapes visitor movement.",
    quote: "Research begins where intuition is no longer enough.",
    theme: "research",
    category: "RESEARCH",
    imageUrl: "/sakaime-logo.png",
    tags: ["LightGBM", "DBSCAN", "Python"],
  },
  {
    slug: "anvil-piedpiper",
    owner: "rigvedbhat",
    repo: "anvil-piedpiper",
    title: "ANVIL PIEDPIPER",
    subtitle: "A computational research model for data compression & stream optimization.",
    quote: "Efficiency is the quiet backbone of modern intelligence.",
    theme: "research",
    category: "RESEARCH",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    tags: ["Research", "Algorithms", "Python"],
  },

  // ── MACHINE LEARNING ──
  {
    slug: "resume-analyzer",
    owner: "rigvedbhat",
    repo: "ai-resume-analyzer",
    title: "RESUME ANALYZER",
    subtitle: "A quiet intelligence tool designed to turn uncertainty into career clarity.",
    quote: "Useful AI turns raw documents into actionable insight.",
    theme: "creative",
    category: "MACHINE LEARNING",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
    tags: ["NLP", "Flask", "React"],
  },
];

export const projects: Project[] = categorizedProjects;

/* ── Journey Experiences ─────────────────────────────────────── */

export interface JourneyExperience {
  id: string;
  role: string;
  type: string;
  period: string;
  subtitle: string;
  description: string;
}

export const journeyExperiences: JourneyExperience[] = [
  {
    id: "discord-bot-developer",
    role: "Discord Bot Developer",
    type: "Freelance",
    period: "2024 - Present",
    subtitle: "A Tale of Custom Bot Systems",
    description:
      "I build custom Discord bots from scratch - modular cog systems, Gemini-powered AI chat, slash commands, XP leveling, automated moderation, event scheduling, and web dashboards. Every bot is tailored to what the server actually needs.",
  },
  {
    id: "discord-server-manager",
    role: "Discord Server Manager",
    type: "Freelance",
    period: "2024 - Present",
    subtitle: "A Tale of Community Operations",
    description:
      "I set up, organise, and moderate Discord communities - roles, channels, permission systems, automod rules, bots, and onboarding flows. I also handle ongoing moderation and keep servers running cleanly.",
  },
  {
    id: "web-developer",
    role: "Web Developer",
    type: "Freelance",
    period: "2025 - Present",
    subtitle: "A Tale of End-to-End Websites",
    description:
      "I help my clients go from idea to production ready websites. The package includes everything from UI/UX to End-User ready systems.",
  },
];

export const journeyStages: JourneyStage[] = journeyExperiences.map((exp) => ({
  rank: exp.role,
  role: exp.type,
  duration: exp.period,
  organization: exp.type,
  technologies: [],
  achievements: [],
  story: exp.description,
}));

/* ── About Info Data ─────────────────────────────────────────── */

export const aboutInfo = {
  name: "Rigved Mithun Bhat",
  role: "AI Engineer, Software Developer & Research Enthusiast",
  photoUrl: "/rig-photo.jpg",
  bio: [
    "I'm Rigved Mithun Bhat, a third-year undergraduate student from India, currently pursuing a Bachelor of Technology in Computer Science & Engineering with a specialization in Artificial Intelligence & Machine Learning, along with a Minor in Embedded Systems.",
    "I enjoy building technology that solves meaningful problems rather than simply demonstrating technical capability. My work spans Artificial Intelligence, Machine Learning, backend engineering, research, UI/UX design, and interactive experiences, where I combine engineering with thoughtful design to create products that people genuinely enjoy using.",
    "Currently, my primary focus is on AI-driven software development and research-oriented projects. I believe the best technology isn't the one with the most features, but the one that quietly solves the right problem.",
    "Beyond software engineering, I'm deeply inspired by Japan's culture, design philosophy, and craftsmanship. That influence shapes much of my work, encouraging me to value simplicity, intentional design, and attention to detail. My flagship research project, sakAIme, explores how Artificial Intelligence can help address overtourism and support regional revitalization in Japan through ethical recommendation systems.",
    "I also enjoy transforming ambitious ideas into real products. From developing AI-powered platforms like Seromod to experimenting with immersive web experiences, I constantly seek opportunities to merge creativity with technology."
  ],
  currently: {
    degree: "Bachelor of Technology (B.Tech)",
    specialization: "Computer Science & Engineering (Artificial Intelligence & Machine Learning)",
    minor: "Embedded Systems",
    year: "Third Year Undergraduate",
    trade: "AI Engineer, Software Developer & Research Enthusiast"
  },
  interests: [
    "Artificial Intelligence & Machine Learning",
    "Backend Engineering",
    "Intelligent Systems",
    "Human-Centered Design",
    "Research & Innovation",
    "Interactive Web Experiences",
    "Japanese Language & Culture",
    "Game Technology & Real-Time Graphics",
    "Open Source Development"
  ],
  futureGoals: [
    "My long-term ambition is to contribute to impactful AI research while building technology that improves people's lives. I aspire to pursue graduate research in Japan through the MEXT Scholarship, collaborate with leading researchers, and work on intelligent systems that bridge the gap between cutting-edge research and real-world applications.",
    "Whether I'm writing code, designing interfaces, or conducting research, my goal remains the same: to build thoughtful, elegant, and meaningful technology that leaves a lasting impact."
  ]
};

/* ── Contact ─────────────────────────────────────────────────── */

export const contactInfo = {
  email: "rigvedmb2@gmail.com",
  github: "https://github.com/rigvedbhat",
  linkedin: "https://www.linkedin.com/in/rigved-bhat-b4b46332a",
  githubHandle: "rigvedbhat",
};
