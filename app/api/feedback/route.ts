import type { WithId } from "mongodb";
import { getCollection } from "@/lib/mongodb";
import { COLOR_HEXES, MOOD_IDS, LIMITS, isBatchId } from "@/lib/config";
import type { Feedback, FeedbackDoc } from "@/lib/types";

export const dynamic = "force-dynamic";

// Small per-instance rate limits. Not bulletproof, just discourages spam-clicking.
// Students on campus Wi-Fi share one public IP, so the strict cooldown is per
// browser (IP + a random id the browser keeps), with a looser cap per IP.
const lastHit = new Map<string, number>();
const ipHits = new Map<string, number[]>();
const COOLDOWN_MS = 15_000;
const IP_WINDOW_MS = 60_000;
const IP_MAX_PER_WINDOW = 40;

function serialize(doc: WithId<FeedbackDoc>): Feedback {
  return {
    id: doc._id.toString(),
    batch: doc.batch,
    anonymous: !!doc.anonymous,
    name: doc.anonymous ? null : doc.name,
    message: doc.message,
    color: doc.color,
    mood: doc.mood ?? null,
    hand: doc.hand ?? "right",
    createdAt: new Date(doc.createdAt).toISOString(),
    isDemo: !!doc.isDemo,
  };
}

function bad(error: string, status = 400) {
  return Response.json({ error }, { status });
}

export async function GET(request: Request) {
  try {
    const batch = new URL(request.url).searchParams.get("batch");
    const filter = isBatchId(batch) ? { batch } : {};
    const col = await getCollection();
    const docs = await col.find(filter).sort({ createdAt: -1 }).limit(1000).toArray();
    return Response.json({ items: docs.map(serialize) });
  } catch (err) {
    console.error("GET /api/feedback failed:", err instanceof Error ? err.message : err);
    const msg = err instanceof Error ? err.message : "";
    const isIpBlocked = msg.includes("tlsv1 alert internal error") || msg.includes("SSL alert number 80");
    return bad(
      isIpBlocked
        ? "MongoDB Atlas blocked your IP! Go to MongoDB Atlas -> Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0)."
        : "The wall is still drying (database unreachable).",
      500
    );
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad("That doesn't look like a handprint.");
  }

  // Honeypot: real humans never see this field.
  if (body.website) {
    return Response.json({ item: null });
  }

  const batch = body.batch;
  const anonymous = !!body.anonymous;
  const name = String(body.name ?? "").trim().slice(0, LIMITS.nameMax);
  const message = String(body.message ?? "").trim();
  const color = typeof body.color === "string" && COLOR_HEXES.includes(body.color) ? body.color : COLOR_HEXES[0];
  const mood = typeof body.mood === "string" && MOOD_IDS.includes(body.mood) ? body.mood : null;

  if (!isBatchId(batch)) return bad("Pick your batch. Yes, it's mandatory.");
  if (!anonymous && !name) return bad("Either tell me your name or go anonymous. Pick one.");
  if (message.length < LIMITS.messageMin) return bad("That's... not much of an opinion. Say a bit more?");
  if (message.length > LIMITS.messageMax) {
    return bad(`Keep it under ${LIMITS.messageMax} characters. This isn't your thesis.`);
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  const clientId = String(body.clientId ?? "").slice(0, 64);
  const key = `${ip}:${clientId}`;
  const now = Date.now();
  if (now - (lastHit.get(key) ?? 0) < COOLDOWN_MS) {
    return bad("Whoa, slow down. One hand at a time.", 429);
  }
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);
  if (recent.length >= IP_MAX_PER_WINDOW) {
    return bad("The whole class is slapping the wall at once. Give it a few seconds and try again.", 429);
  }

  try {
    const col = await getCollection();
    const doc: FeedbackDoc = {
      batch,
      anonymous,
      name: anonymous ? null : name,
      message,
      color,
      mood,
      hand: Math.random() > 0.5 ? "right" : "left",
      createdAt: new Date(),
    };
    const { insertedId } = await col.insertOne(doc);
    lastHit.set(key, now);
    ipHits.set(ip, [...recent, now]);
    return Response.json({ item: serialize({ ...doc, _id: insertedId }) }, { status: 201 });
  } catch (err) {
    console.error("POST /api/feedback failed:", err);
    return bad("Couldn't stick your hand on the wall. Try again in a bit.", 500);
  }
}

