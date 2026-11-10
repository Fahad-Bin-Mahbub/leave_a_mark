// Fake handprints for previewing a crowded wall (doesn't touch the database).
import { BATCHES, COLOR_HEXES, MOOD_IDS } from "./config";
import type { Feedback, FeedbackDoc } from "./types";

const NAMES = [
  "Arif", "Nusrat", "Tanvir", "Sadia", "Rafi", "Mim", "Sakib", "Tasnim", "Nabil", "Farzana",
  "Mehedi", "Tania", "Fahim", "Jannatul", "Rakib", "Sumaiya", "Siam", "Nadia", "Hasib", "Anika",
  "Shuvo", "Maliha", "Sabbir", "Lamia", "Imran", "Fariha", "Ashik", "Raisa", "Nayeem", "Samia",
  "Tawsif", "Humaira", "Zahid", "Nafisa", "Rohan", "Zarin", "Mahir", "fabiha", "Adnan", "Promi",
  "Sourov", "Ishrat", "Tuhin", "Bushra", "Maruf", "Labiba", "Arafat", "Muntaha", "Rifat", "Mahi",
];

const MESSAGES = [
  "Honestly the only 8 AM class I didn't regret waking up for. Mostly.",
  "Your slides had memes. That alone deserves an A+ from us.",
  "Still recovering from that quiz you called 'easy'. We have trust issues now.",
  "Thanks for explaining pointers three different ways until my brain finally clicked.",
  "You actually listened when we said the deadline was killing us. Respect, sir.",
  "I came for attendance and accidentally learned data structures.",
  "Best chalk-throwing accuracy in the department. 10/10.",
  "When you said 'this is intuitive' it was in fact NOT intuitive, but we survived.",
  "Thank you for not reading off 2009 slides like a robot.",
  "That one live-coding session where your code also segfaulted healed my soul.",
  "Strict on deadlines, chill in class. Fair trade.",
  "Your 'quick 5 minute recap' is a unit of time known only to physicists.",
  "I sat in the back row every day and still somehow paid attention.",
  "Please never change the way you roast people who walk in 25 minutes late.",
  "Lowkey the reason I didn't drop this course in week 3.",
  "Lab viva was terrifying in the moment, funny in hindsight.",
  "You made the dry theoretical stuff tolerable. That's a superpower.",
  "One day I'll understand recursion. Today is not that day, but thanks for trying.",
  "Appreciate that you treated us like adults instead of roll numbers.",
  "See you next semester sir (hopefully not in a retake).",
  "Your marker ran out of ink mid-derivation and you just kept going with vibes.",
  "Tough marker, great teacher. Can't even be mad.",
  "The examples from real bugs you hit at 3 AM were the best part of the course.",
  "Thanks for staying after class whenever we swarmed the podium with dumb questions.",
];

/** Build `perBatch` fake prints per batch (default 65 -> 130 total, enough to trigger dense mode). */
export function makeDemoPrints(perBatch = 65): Feedback[] {
  const out: Feedback[] = [];
  const now = Date.now();

  for (const batch of BATCHES) {
    for (let i = 0; i < perBatch; i++) {
      const k = i + (batch.id === "69" ? 100 : 0);
      const anonymous = k % 4 === 0;
      const name = anonymous ? null : `${NAMES[k % NAMES.length]} (${batch.id}-${String((i % 90) + 1).padStart(2, "0")})`;
      const mood = k % 5 === 0 ? null : MOOD_IDS[k % MOOD_IDS.length];
      out.push({
        id: `demo-${batch.id}-${i}`,
        batch: batch.id,
        anonymous,
        name,
        message: MESSAGES[(k * 7) % MESSAGES.length],
        color: COLOR_HEXES[(k * 3) % COLOR_HEXES.length],
        mood,
        hand: k % 2 === 0 ? "right" : "left",
        createdAt: new Date(now - i * 3600_000 * 4).toISOString(),
        isDemo: true,
      });
    }
  }
  return out;
}

/** Build `perBatch` fake MongoDB documents per batch (tagged with `isDemo: true` so they can be wiped cleanly). */
export function makeDemoDocs(perBatch = 65): FeedbackDoc[] {
  const out: FeedbackDoc[] = [];
  const now = Date.now();

  for (const batch of BATCHES) {
    for (let i = 0; i < perBatch; i++) {
      const k = i + (batch.id === "69" ? 100 : 0);
      const anonymous = k % 4 === 0;
      const name = anonymous ? null : `${NAMES[k % NAMES.length]} (${batch.id}-${String((i % 90) + 1).padStart(2, "0")})`;
      const mood = k % 5 === 0 ? null : MOOD_IDS[k % MOOD_IDS.length];
      out.push({
        batch: batch.id,
        anonymous,
        name,
        message: MESSAGES[(k * 7) % MESSAGES.length],
        color: COLOR_HEXES[(k * 3) % COLOR_HEXES.length],
        mood,
        hand: k % 2 === 0 ? "right" : "left",
        createdAt: new Date(now - i * 3600_000 * 4),
        isDemo: true,
      });
    }
  }
  return out;
}
