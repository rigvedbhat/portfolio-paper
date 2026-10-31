/* ── Shared Types ─────────────────────────────────────────────── */

/** Possible destinations the camera can travel to */
export type DestinationId =
  | "origin"
  | "projects"
  | "research"
  | "journey"
  | "about"
  | "contact"
  | "dlc";

/** A navigable destination in the world */
export interface Destination {
  id: DestinationId;
  label: string;
  subtitle?: string;
}

/** A portfolio project */
export interface Project {
  slug: string;
  owner: string;
  repo: string;
  title: string;
  subtitle: string;
  quote: string;
  theme: "research" | "engineering" | "creative";
}

/** A stage in the career journey */
export interface JourneyStage {
  rank: string;
  role: string;
  duration: string;
  organization: string;
  technologies: string[];
  achievements: string[];
  story: string;
}

/** GitHub repository metadata (fetched at runtime) */
export interface RepoMeta {
  stars: number;
  language: string | null;
  lastUpdate: string;
  description: string | null;
  openIssues: number;
}

/** The global state of the world experience */
export interface WorldState {
  phase: "boot" | "menu" | "destination";
  activeDestination: DestinationId;
  selectedProject: string | null;
  soundEnabled: boolean;
  bootProgress: number;
  isTransitioning: boolean;
}
