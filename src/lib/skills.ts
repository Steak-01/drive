// Shared, client-safe driving-skill catalogue used by student & instructor views.

export interface SkillDef {
  key: string;
  label: string;
}

/** The fixed set of tracked driving competencies (in learning order). */
export const SKILLS: SkillDef[] = [
  { key: "vehicle_controls", label: "Vehicle Controls & Cockpit Drill" },
  { key: "moving_off", label: "Moving Off & Stopping" },
  { key: "observation", label: "Observation, Mirrors & Signals" },
  { key: "steering", label: "Steering & Lane Control" },
  { key: "gears", label: "Gears & Clutch Control" },
  { key: "intersections", label: "Intersections & Traffic Signals" },
  { key: "parking", label: "Parking & Reversing" },
  { key: "roundabouts", label: "Roundabouts & Yielding" },
  { key: "highway", label: "Highway & Freeway Driving" },
  { key: "emergency", label: "Emergency Manoeuvres" },
];

export const MAX_LEVEL = 3;

/** Human-readable label for each proficiency level. */
export const LEVEL_LABELS: Record<number, string> = {
  0: "Not started",
  1: "Introduced",
  2: "Developing",
  3: "Proficient",
};

/** Overall progress percentage from a map of skill_key -> level. */
export function overallProgress(levels: Record<string, number>): number {
  const total = SKILLS.length * MAX_LEVEL;
  if (total === 0) return 0;
  const sum = SKILLS.reduce((acc, s) => acc + (levels[s.key] ?? 0), 0);
  return Math.round((sum / total) * 100);
}
