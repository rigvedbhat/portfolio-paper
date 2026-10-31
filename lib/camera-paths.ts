import type { DestinationId } from "./types";

/* ── Camera Waypoint ─────────────────────────────────────────── */

export interface CameraWaypoint {
  position: [number, number, number];
  target: [number, number, number];
  /** Duration of the travel to this waypoint (seconds) */
  travelDuration: number;
  /** Fog density override at this position */
  fogDensity?: number;
}

/* ── Waypoint Map ────────────────────────────────────────────── */

export const cameraWaypoints: Record<DestinationId, CameraWaypoint> = {
  origin: {
    position: [0, 0, 4.5],
    target: [0, 0, 0],
    travelDuration: 1.5,
    fogDensity: 0.03,
  },
  projects: {
    position: [-0.2, 0, 4.5],
    target: [0, 0, 0],
    travelDuration: 1.2,
    fogDensity: 0.03,
  },
  research: {
    position: [0.2, 0, 4.5],
    target: [0, 0, 0],
    travelDuration: 1.2,
    fogDensity: 0.03,
  },
  journey: {
    position: [0, 0.1, 4.5],
    target: [0, 0, 0],
    travelDuration: 1.2,
    fogDensity: 0.03,
  },
  about: {
    position: [0, 0, 4.5],
    target: [0, 0, 0],
    travelDuration: 1.2,
    fogDensity: 0.03,
  },
  contact: {
    position: [0, -0.1, 4.5],
    target: [0, 0, 0],
    travelDuration: 1.2,
    fogDensity: 0.03,
  },
  dlc: {
    position: [0, 0, 4.5],
    target: [0, 0, 0],
    travelDuration: 1.2,
    fogDensity: 0.03,
  },
};

/* ── Gentle Atmospheric Idle Drift Settings ───────────────────── */

export const idleDrift = {
  amplitudeX: 0.012,
  amplitudeY: 0.006,
  speed: 0.2,
};
