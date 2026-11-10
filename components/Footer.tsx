"use client";

import { ArrowUp, Coffee, Hand, Meh, Sparkles, Terminal } from "lucide-react";
import { TEACHER_NAME } from "@/lib/config";
import HandShape from "./HandShape";
import { Sparkle, Squiggle, Star } from "./Doodles";

export default function Footer({ onShare }: { onShare: () => void }) {
  return (
    <footer className="footer">
      <div className="footer-board">
        {/* Washi tape corners */}
        <span className="footer-tape footer-tape-left" aria-hidden="true" />
        <span className="footer-tape footer-tape-right" aria-hidden="true" />

        {/* Floating background doodles */}
        <Star className="footer-float ff-1" color="#FFB800" />
        <Sparkle className="footer-float ff-2" color="#FF5FA2" />
        <Sparkle className="footer-float ff-3" color="#1FBF84" />

        <div className="footer-grid">
          <div className="footer-main">
            <div className="footer-pill">
              <Terminal size={15} strokeWidth={2.5} />
              <span>git commit -m &quot;end of semester&quot;</span>
            </div>

            <h2 className="footer-title">
              Still scrolling?{" "}
              <span className="footer-title-hand">
                Overthinking is my job.
                <Squiggle className="footer-squiggle" color="#FFB800" />
              </span>
            </h2>

            <p className="footer-copy">
              You survived the lectures, the labs, and my handwriting on the board. Drop a quick handprint before
              you disappear into the break.
            </p>

            <div className="footer-cta-row">
              <button type="button" className="btn btn-sunny" onClick={onShare}>
                <Hand size={20} strokeWidth={2.5} /> Fine, I&apos;ll leave a handprint
              </button>
              <a href="#walls" className="footer-top-link">
                <ArrowUp size={16} strokeWidth={2.5} /> Back to the walls
              </a>
            </div>
          </div>

          <div className="footer-collage" aria-hidden="true">
            <div className="footer-polaroid">
              <span className="polaroid-pin" />
              <div className="polaroid-frame">
                <div className="polaroid-hand p-hand-1">
                  <HandShape color="#FF5A36" />
                </div>
                <div className="polaroid-hand p-hand-2">
                  <HandShape color="#3B82F6" flip />
                </div>
                <div className="polaroid-hand p-hand-3">
                  <HandShape color="#1FBF84" />
                </div>
              </div>
              <div className="polaroid-caption">
                <span>CSE 64 &amp; 69 · Class of survivors</span>
              </div>
            </div>

            <div className="footer-receipt">
              <div className="receipt-head">SEMESTER RECEIPT</div>
              <div className="receipt-row">
                <span>&quot;Will this be on the exam?&quot;</span>
                <strong>Absolutely</strong>
              </div>
              <div className="receipt-row">
                <span>Extra marks for flattery</span>
                <strong>0.00</strong>
              </div>
              <div className="receipt-total">
                <span>MEMORIES KEPT</span>
                <strong>100%</strong>
              </div>
            </div>

            <div className="footer-stamp">
              <Sparkles size={14} strokeWidth={2.5} />
              <span>OFFICIALLY SURVIVED</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-fine">
          No students were graded while building this site <Meh size={16} strokeWidth={2.2} />
        </p>
      </div>
    </footer>
  );
}
