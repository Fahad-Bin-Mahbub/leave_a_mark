"use client";

import { Hand, ArrowDown, Clock3 } from "lucide-react";
import HandShape from "./HandShape";
import { Squiggle, Sparkle, Star, CurlyArrow, Splat } from "./Doodles";
import { TEACHER_NAME } from "@/lib/config";

const DECOR = [
  { color: "#FF5A36", x: 8, y: 14, r: -18, s: 1.05, flip: false },
  { color: "#FFB800", x: 40, y: 6, r: 8, s: 0.9, flip: true },
  { color: "#3B82F6", x: 66, y: 22, r: 22, s: 1, flip: false },
  { color: "#8B5CF6", x: 20, y: 50, r: 12, s: 0.85, flip: true },
  { color: "#1FBF84", x: 46, y: 48, r: -10, s: 1.1, flip: false },
];

interface HeroProps {
  total: number | null;
  onShare: () => void;
}

export default function Hero({ total, onShare }: HeroProps) {
  return (
    <header className="hero">
      <nav className="topbar">
        <span className="logo">
          <span className="logo-mark">
            <Hand size={18} strokeWidth={2.5} />
          </span>
          leave&nbsp;a&nbsp;mark
        </span>
        <a href="#walls" className="topbar-link">
          the walls <ArrowDown size={16} strokeWidth={2.5} />
        </a>
      </nav>

      <div className="hero-grid">
        <div className="hero-copy">
          <span className="badge">
            <span className="badge-dot" /> Semester&apos;s done. We made it. 🎉
          </span>

          <h1 className="hero-title">
            Leave your{" "}
            <span className="hl">
              mark
              <Squiggle className="hl-squiggle" color="#FF5A36" />
            </span>{" "}
            on my wall.
          </h1>

          <p className="hero-sub">
            Before you vanish into the next semester, tell me how I did. Graders should be graded too, don't you think? 
            Put your name on it or go full ninja. 
            Every handprint stays here as a memory of you lot.
          </p>

          <div className="hero-ctas">
            <button type="button" className="btn btn-primary" onClick={onShare}>
              <Hand size={20} strokeWidth={2.5} /> Slap your hand on the wall
            </button>
            <a href="#walls" className="btn btn-ghost">
              Peek at the walls
            </a>
          </div>

          <p className="hero-note">
            <Clock3 size={16} strokeWidth={2.5} /> Takes 1 minute. Shorter than my &ldquo;quick 5&nbsp;min recap&rdquo;.
          </p>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="mini-wall">
            {DECOR.map((d, i) => (
              <div
                key={i}
                className="mini-print"
                style={{
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  ["--t" as string]: `rotate(${d.r}deg) scale(${d.s})`,
                  animationDelay: `${0.25 + i * 0.18}s`,
                }}
              >
                <HandShape color={d.color} flip={d.flip} />
              </div>
            ))}
            <div className="mini-print mini-print-ghost" style={{ left: "70%", top: "58%" }}>
              <HandShape outline />
            </div>
            <span className="mini-wall-graffiti">we were here</span>
          </div>

          <div className="sticky-note">
            <strong>House rules</strong>
            <ol>
              <li>Be honest.</li>
              <li>Be kind. Ish.</li>
              <li>Name optional. Batch is not.</li>
            </ol>
          </div>

          <div className="bubble">
            be nice. or don&apos;t.
            <br />
            <small>(be nice.)</small>
          </div>

          <div className="this-could-be-you">
            <span>this spot&apos;s yours</span>
            <CurlyArrow className="curly" />
          </div>

          <div className="counter-sticker">
            <span className="counter-num">{total ?? "–"}</span>
            <span>hands so far</span>
          </div>

          <Star className="float f1" color="#FFB800" />
          <Sparkle className="float f2" color="#8B5CF6" />
          <Sparkle className="float f3" color="#FF5FA2" />
          <Splat className="float f4" color="#1FBF84" />
        </div>
      </div>

      <p className="hero-sign">
        — {TEACHER_NAME}, <span>your least avoidable teacher</span>
      </p>
    </header>
  );
}

