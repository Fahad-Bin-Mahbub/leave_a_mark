"use client";

import type { CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Ghost, CalendarDays } from "lucide-react";
import Modal from "./Modal";
import HandShape from "./HandShape";
import { moodOf, displayName } from "@/lib/handprint";
import { BATCHES } from "@/lib/config";
import type { Feedback } from "@/lib/types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

interface PrintModalProps {
  item: Feedback | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  position: { index: number; total: number } | null;
}

export default function PrintModal({ item, onClose, onPrev, onNext, position }: PrintModalProps) {
  if (!item) return null;
  const mood = moodOf(item.mood);
  const batch = BATCHES.find((b) => b.id === item.batch);

  return (
    <Modal open onClose={onClose} label={`Feedback from ${displayName(item)}`} className="print-modal">
      <div className="pm-art" style={{ "--c": item.color } as CSSProperties}>
        <HandShape color={item.color} flip={item.hand === "left"} />
      </div>

      <div className="pm-body">
        <div className="pm-meta">
          {batch && (
            <span className="chip" style={{ "--accent": batch.accent } as CSSProperties}>
              {batch.label}
            </span>
          )}
          {mood && (
            <span className="chip chip-soft">
              {mood.emoji} {mood.label}
            </span>
          )}
        </div>

        <blockquote className="pm-quote">{item.message}</blockquote>

        <div className="pm-foot">
          <span className="pm-author">
            {item.anonymous ? (
              <>
                <Ghost size={18} strokeWidth={2.5} /> Anonymous ninja
              </>
            ) : (
              `— ${item.name}`
            )}
          </span>
          <span className="pm-date">
            <CalendarDays size={15} strokeWidth={2.5} /> {formatDate(item.createdAt)}
          </span>
        </div>

        {position && position.total > 1 && (
          <div className="pm-nav">
            <button type="button" className="icon-btn" onClick={onPrev} aria-label="Previous handprint">
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <span>
              {position.index + 1} / {position.total}
            </span>
            <button type="button" className="icon-btn" onClick={onNext} aria-label="Next handprint">
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

