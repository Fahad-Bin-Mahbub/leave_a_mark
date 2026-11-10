"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { ChevronDown, Ghost, UserRound, Hand, LoaderCircle, PartyPopper, Check } from "lucide-react";
import Modal from "./Modal";
import HandShape from "./HandShape";
import { BATCHES, COLORS, MOODS, LIMITS } from "@/lib/config";
import type { BatchId, Feedback, FeedbackInput } from "@/lib/types";

const PLACEHOLDERS = [
  "Remember that one class where…",
  "Honestly, your slides were…",
  "Something I never said in class:",
  "The thing I'll actually remember is…",
  "Okay, real talk…",
];

const initialState = (batch: string = ""): FeedbackInput => ({
  batch,
  anonymous: false,
  name: "",
  message: "",
  color: COLORS[0].hex,
  mood: null,
  website: "",
});

interface FeedbackFormProps {
  open: boolean;
  defaultBatch: BatchId | "";
  onClose: () => void;
  onSubmitted: (item: Feedback) => void;
}

export default function FeedbackForm({ open, defaultBatch, onClose, onSubmitted }: FeedbackFormProps) {
  const [form, setForm] = useState<FeedbackInput>(initialState(defaultBatch));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Feedback | null>(null);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);

  useEffect(() => {
    if (!open) return;
    setForm((f) => ({ ...initialState(defaultBatch || f.batch), color: f.color }));
    setError("");
    setDone(null);
    setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
  }, [open, defaultBatch]);

  const set = <K extends keyof FeedbackInput>(key: K, value: FeedbackInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const remaining = LIMITS.messageMax - form.message.length;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!form.batch) return setError("Pick your batch first. Old habits, I need to know.");
    if (!form.anonymous && !form.name.trim()) return setError("Name please. Or flip on ninja mode.");
    if (form.message.trim().length < LIMITS.messageMin) return setError("Say a little more than that. Come on.");

    setBusy(true);
    try {
      let clientId = "";
      try {
        clientId = localStorage.getItem("lam-cid") || "";
        if (!clientId) {
          clientId = Math.random().toString(36).slice(2) + Date.now().toString(36);
          localStorage.setItem("lam-cid", clientId);
        }
      } catch {}

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, clientId }),
      });
      const data: { item?: Feedback | null; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went sideways. Try again?");
      if (data.item) {
        setDone(data.item);
        onSubmitted(data.item);
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went sideways. Try again?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} label="Leave your handprint" className="form-modal">
      {done ? (
        <div className="success">
          <div className="success-hand">
            <HandShape color={done.color} flip={done.hand === "left"} />
          </div>
          <h3>
            Splat! You&apos;re on the wall <PartyPopper size={26} strokeWidth={2.5} className="inline-icon" />
          </h3>
          <p>Thanks, genuinely. No take-backs though. That&apos;s how walls work.</p>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Go see it
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="form" noValidate>
          <div className="form-head">
            <h3>Leave your handprint</h3>
            <p>Dip your hand in paint. Metaphorically. Please don&apos;t touch the real walls.</p>
          </div>

          <div className="form-grid">
            <div className="form-fields">
              <label className="field">
                <span className="field-label">
                  Your batch <em>(mandatory, sorry, old habits)</em>
                </span>
                <span className="select-wrap">
                  <select value={form.batch} onChange={(e) => set("batch", e.target.value)} required>
                    <option value="" disabled>
                      Choose your batch…
                    </option>
                    {BATCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label}: {b.nickname}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} strokeWidth={2.5} className="select-icon" />
                </span>
              </label>

              <div className="field">
                <span className="field-label">Who&apos;s this?</span>
                <div className="segmented" role="radiogroup" aria-label="Identity">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={!form.anonymous}
                    className={!form.anonymous ? "seg-on" : ""}
                    onClick={() => set("anonymous", false)}
                  >
                    <UserRound size={17} strokeWidth={2.5} /> With my name
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={form.anonymous}
                    className={form.anonymous ? "seg-on" : ""}
                    onClick={() => set("anonymous", true)}
                  >
                    <Ghost size={17} strokeWidth={2.5} /> Ninja mode
                  </button>
                </div>
                {form.anonymous ? (
                  <p className="field-hint">
                    Fully anonymous. I genuinely can&apos;t tell who you are. Go wild (responsibly).
                  </p>
                ) : (
                  <input
                    type="text"
                    className="input"
                    placeholder="Your name (or what I called you in class)"
                    aria-label="Your name"
                    value={form.name}
                    maxLength={LIMITS.nameMax}
                    onChange={(e) => set("name", e.target.value)}
                  />
                )}
              </div>

              <label className="field">
                <span className="field-label">Spill it</span>
                <textarea
                  className="input textarea"
                  placeholder={placeholder}
                  value={form.message}
                  maxLength={LIMITS.messageMax}
                  rows={5}
                  onChange={(e) => set("message", e.target.value)}
                />
                <span className={`counter ${remaining < 50 ? "counter-warn" : ""}`}>
                  {remaining < 50 ? `${remaining} left. Wrap it up, essay writer.` : `${remaining} characters left`}
                </span>
              </label>

              {/* Honeypot for bots: hidden from humans */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hp"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                aria-hidden="true"
              />
            </div>

            <div className="form-side">
              <div className="preview" style={{ "--c": form.color } as CSSProperties}>
                <HandShape color={form.color} />
                <span className="preview-label">this is you, apparently</span>
              </div>

              <div className="field">
                <span className="field-label">Pick your paint</span>
                <div className="swatches">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`swatch ${form.color === c.hex ? "swatch-on" : ""}`}
                      style={{ background: c.hex }}
                      onClick={() => set("color", c.hex)}
                      aria-label={c.name}
                      aria-pressed={form.color === c.hex}
                      title={c.name}
                    >
                      {form.color === c.hex && <Check size={16} strokeWidth={3.5} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <span className="field-label">
                  Vibe check <em>(optional)</em>
                </span>
                <div className="moods">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={form.mood === m.id}
                      className={`mood ${form.mood === m.id ? "mood-on" : ""}`}
                      onClick={() => set("mood", form.mood === m.id ? null : m.id)}
                    >
                      <span>{m.emoji}</span> {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-actions">
            <span className="form-fine">No grades will be harmed in the making of this handprint.</span>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? (
                <>
                  <LoaderCircle size={20} strokeWidth={2.5} className="spin" /> Applying paint…
                </>
              ) : (
                <>
                  <Hand size={20} strokeWidth={2.5} /> Slap it on the wall
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

