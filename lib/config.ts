// Site-wide settings. Tweak freely.
import type { Batch, BatchId, Mood, PaintColor } from "./types";

export const TEACHER_NAME = process.env.NEXT_PUBLIC_TEACHER_NAME || "Your Favourite Teacher";

export const BATCHES: Batch[] = [
  {
    id: "64",
    label: "CSE 64",
    nickname: "The Seniors",
    tagline: "Have seen things. Survived me anyway.",
    wall: "#F6E3CF",
    accent: "#FF5A36",
  },
  {
    id: "69",
    label: "CSE 69",
    nickname: "The Juniors",
    tagline: "Still have hope. Let's keep it that way.",
    wall: "#DCE8F5",
    accent: "#3B82F6",
  },
];

export const BATCH_IDS: string[] = BATCHES.map((b) => b.id);

export const isBatchId = (v: unknown): v is BatchId => typeof v === "string" && BATCH_IDS.includes(v);

export const COLORS: PaintColor[] = [
  { id: "tomato", hex: "#FF5A36", name: "Tomato" },
  { id: "sunny", hex: "#FFB800", name: "Sunny" },
  { id: "mint", hex: "#1FBF84", name: "Mint" },
  { id: "teal", hex: "#14B8A6", name: "Teal" },
  { id: "sky", hex: "#3B82F6", name: "Sky" },
  { id: "grape", hex: "#8B5CF6", name: "Grape" },
  { id: "bubblegum", hex: "#FF5FA2", name: "Bubblegum" },
  { id: "ink", hex: "#26221E", name: "Ink" },
];

export const COLOR_HEXES: string[] = COLORS.map((c) => c.hex);

export const MOODS: Mood[] = [
  { id: "legend", emoji: "🔥", label: "Absolute legend" },
  { id: "learned", emoji: "🧠", label: "Actually learned stuff" },
  { id: "wholesome", emoji: "🫶", label: "Wholesome" },
  { id: "survived", emoji: "💀", label: "I survived" },
  { id: "sleepy", emoji: "😴", label: "Slept through some" },
  { id: "chaos", emoji: "🌀", label: "Beautiful chaos" },
];

export const MOOD_IDS: string[] = MOODS.map((m) => m.id);

export const LIMITS = {
  nameMax: 40,
  messageMin: 3,
  messageMax: 600,
} as const;

export const SNARK: string[] = [
  "No, this won't affect your grades. Results are already out. Relax.",
  "Anonymous means anonymous. I won't analyze your grammar to find you. Much.",
  "Typos allowed. I'm officially off grading duty.",
  "Roasts accepted. Threats politely declined.",
  "No attendance taken here. For once.",
  "This is not on the exam. Nothing is anymore.",
];

