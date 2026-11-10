import { MOODS } from "./config";
import type { Feedback, Mood } from "./types";

// Deterministic pseudo-random numbers from the print id, so every print keeps
// its own tilt and wobble between visits.
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function jitter(id: string) {
  const h = hash(id);
  return {
    rot: (h % 61) - 30, // -30°..30°: hands go on walls at all sorts of angles
    scale: 0.84 + ((h >>> 8) % 30) / 100, // 0.84..1.13
    opacity: 0.84 + ((h >>> 14) % 17) / 100, // some coats of paint are thinner
  };
}

export const moodOf = (id: string | null): Mood | null => MOODS.find((m) => m.id === id) ?? null;

export const displayName = (item: Feedback): string => (item.anonymous || !item.name ? "Anonymous" : item.name);

export const truncate = (text: string, n: number): string =>
  text.length > n ? `${text.slice(0, n).trimEnd()}…` : text;

