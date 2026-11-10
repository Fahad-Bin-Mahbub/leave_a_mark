"use client";

import type { CSSProperties } from "react";
import { jitter, moodOf, displayName, truncate } from "@/lib/handprint";
import type { Point } from "@/lib/wallLayout";
import type { Feedback } from "@/lib/types";

interface HandPrintProps {
  item: Feedback;
  index: number;
  pos: Point;
  fresh: boolean;
  onOpen: (id: string) => void;
}

export default function HandPrint({ item, onOpen, fresh, index, pos }: HandPrintProps) {
  const j = jitter(item.id);
  const mood = moodOf(item.mood);
  const name = displayName(item);
  const initial = item.anonymous || !item.name ? "?" : item.name.trim()[0].toUpperCase();

  return (
    <div
      className="cell"
      style={{ left: pos.x, top: pos.y, "--d": `${Math.min(index, 24) * 35}ms` } as CSSProperties}
    >
      <button
        type="button"
        className={`print ${fresh ? "print-fresh" : ""}`}
        onClick={() => onOpen(item.id)}
        aria-label={`Handprint by ${name}. Open to read.`}
      >
        <span className="print-hand" style={{ transform: `rotate(${j.rot}deg) scale(${j.scale})` }}>
          <span
            className={`painted-hand ${item.hand === "left" ? "painted-hand-flip" : ""}`}
            style={{ backgroundColor: item.color, opacity: j.opacity }}
            aria-hidden="true"
          />
          <span className="print-initial">{initial}</span>
        </span>

        <span className="tip" role="tooltip">
          <span className="tip-head">
            <span className="tip-dot" style={{ background: item.color }} />
            <strong>{name}</strong>
            {mood && (
              <span className="tip-mood" title={mood.label}>
                {mood.emoji}
              </span>
            )}
          </span>
          <span className="tip-msg">&ldquo;{truncate(item.message, 140)}&rdquo;</span>
          <span className="tip-more">click to read the whole thing</span>
        </span>
      </button>
    </div>
  );
}
