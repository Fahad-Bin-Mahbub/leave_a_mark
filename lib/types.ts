export type BatchId = "64" | "69";

export interface Batch {
  id: BatchId;
  label: string;
  nickname: string;
  tagline: string;
  wall: string;
  accent: string;
}

export interface PaintColor {
  id: string;
  hex: string;
  name: string;
}

export interface Mood {
  id: string;
  emoji: string;
  label: string;
}

/** A handprint asSent to the browser. */
export interface Feedback {
  id: string;
  batch: BatchId;
  anonymous: boolean;
  name: string | null;
  message: string;
  color: string;
  mood: string | null;
  hand: "left" | "right";
  createdAt: string;
  isDemo?: boolean;
}

/** A handprint as stored in MongoDB. */
export interface FeedbackDoc {
  batch: BatchId;
  anonymous: boolean;
  name: string | null;
  message: string;
  color: string;
  mood: string | null;
  hand: "left" | "right";
  createdAt: Date;
  isDemo?: boolean;
}

export interface FeedbackInput {
  batch: string;
  anonymous: boolean;
  name: string;
  message: string;
  color: string;
  mood: string | null;
  website: string; // honeypot
}

