"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ChevronDown, ChevronUp, Plus, RotateCw, Search } from "lucide-react";
import HandPrint from "./HandPrint";
import HandShape from "./HandShape";
import { Squiggle } from "./Doodles";
import { BATCHES } from "@/lib/config";
import { cellSize, layoutWall, perBand } from "@/lib/wallLayout";
import type { BatchId, Feedback } from "@/lib/types";

export type LoadStatus = "loading" | "ready" | "error";

/** Bands (loose rows) shown before the "show all" button appears. */
const COLLAPSED_BANDS = 5;
/** Above this many prints, the wall switches to smaller prints. */
const DENSE_AFTER = 60;
/** Show the name search once a wall has this many prints. */
const SEARCH_AFTER = 12;

const ADD_ID = "__your-hand-here__";
const SKELETON_IDS = Array.from({ length: 12 }, (_, i) => `skeleton-${i}`);

interface WallsProps {
  byBatch: Record<BatchId, Feedback[]>;
  status: LoadStatus;
  active: BatchId;
  setActive: (id: BatchId) => void;
  onAdd: (batch: BatchId) => void;
  onOpen: (id: string) => void;
  onRetry: () => void;
  freshId: string | null;
}

export default function Walls({ byBatch, status, active, setActive, onAdd, onOpen, freshId, onRetry }: WallsProps) {
  const batch = BATCHES.find((b) => b.id === active) ?? BATCHES[0];
  const items = byBatch[batch.id] ?? [];

  const boardRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");

  // Measure the wall so the layout can adapt to any screen.
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const measure = () => setWidth(Math.round(board.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(board);
    return () => ro.disconnect();
  }, []);

  // Fold the wall back up and clear the search when switching batches.
  useEffect(() => {
    setExpanded(false);
    setQuery("");
  }, [active]);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const matches = searching
    ? items.filter((i) => !i.anonymous && i.name && i.name.toLowerCase().includes(q))
    : items;

  // Crowded walls get slightly smaller prints so more fit.
  const dense = items.length > DENSE_AFTER;
  const cell = cellSize(width, dense);

  const visibleCount = Math.max(perBand(width, cell) * COLLAPSED_BANDS - 1, 1); // -1 for "your hand here"
  const collapsible = !searching && matches.length > visibleCount;
  const shown = expanded || !collapsible ? matches : matches.slice(0, visibleCount);
  const hiddenCount = matches.length - shown.length;

  const ids = status === "loading" ? SKELETON_IDS : status === "ready" ? [ADD_ID, ...shown.map((i) => i.id)] : [];
  const idsKey = ids.join("|");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const layout = useMemo(() => layoutWall(ids, width, cell), [idsKey, width, cell]);

  const fold = () => {
    setExpanded(false);
    document.getElementById("walls")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="walls" className="walls">
      <div className="walls-head">
        <h2 className="section-title">
          The Walls
          <Squiggle className="title-squiggle" color="#3B82F6" />
        </h2>
        <p className="section-sub">One per batch. Hover a hand to peek, click it to read the whole thing.</p>
      </div>

      <div className="tabs" role="tablist" aria-label="Choose a batch wall">
        {BATCHES.map((b) => (
          <button
            key={b.id}
            role="tab"
            type="button"
            aria-selected={b.id === active}
            className={`tab ${b.id === active ? "tab-active" : ""}`}
            style={{ "--accent": b.accent } as CSSProperties}
            onClick={() => setActive(b.id)}
          >
            {b.label}
            <span className="tab-count">{status === "ready" ? (byBatch[b.id] ?? []).length : "…"}</span>
          </button>
        ))}
      </div>

      <div className="wall" role="tabpanel" style={{ "--wall": batch.wall, "--accent": batch.accent } as CSSProperties}>
        <div className="wall-sign">
          <span className="wall-sign-label">{batch.label}</span>
          <span className="wall-sign-nick">{batch.nickname}</span>
          <span className="wall-sign-tag">{batch.tagline}</span>
        </div>
        {/* <span className="wall-graffiti" aria-hidden="true">
          {batch.label} was here
        </span> */}

        {status === "error" && (
          <div className="wall-empty">
            <p className="wall-empty-big">The wall&apos;s still drying… 🎨</p>
            <p>
              Couldn&apos;t reach the database. If you&apos;re the teacher, check <code>MONGODB_URI</code>.
            </p>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onRetry}>
              <RotateCw size={16} strokeWidth={2.5} /> Try again
            </button>
          </div>
        )}

        {status === "ready" && items.length > SEARCH_AFTER && (
          <div className="wall-search">
            <Search size={18} strokeWidth={2.5} className="wall-search-icon" />
            <input
              type="search"
              className="input wall-search-input"
              placeholder="Find your hand (or your friend's)…"
              aria-label={`Search ${batch.label} handprints by name`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {searching && (
              <span className="wall-search-count">
                {matches.length} {matches.length === 1 ? "match" : "matches"}
              </span>
            )}
          </div>
        )}

        {/* The board is always mounted so it can be measured. */}
        <div className={`wall-board-wrap ${collapsible && !expanded ? "wall-collapsed" : ""}`}>
          <div
            ref={boardRef}
            className="wall-board"
            style={{ height: layout.height, "--cell": `${cell}px` } as CSSProperties}
          >
            {status === "loading" &&
              layout.points.map((p, i) => (
                <div className="cell" key={SKELETON_IDS[i]} style={{ left: p.x, top: p.y }}>
                  <div className="print skeleton" style={{ animationDelay: `${i * 90}ms` }}>
                    <span className="print-hand" style={{ transform: `rotate(${(i * 37) % 50 - 25}deg)` }}>
                      <span className="painted-hand" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />
                    </span>
                  </div>
                </div>
              ))}

            {status === "ready" && layout.points.length > 0 && (
              <>
                <div className="cell" style={{ left: layout.points[0].x, top: layout.points[0].y }}>
                  <button
                    type="button"
                    className="print add-print"
                    onClick={() => onAdd(batch.id)}
                    aria-label={`Add your handprint to ${batch.label}`}
                  >
                    <span className="print-hand">
                      <HandShape outline />
                      <span className="add-plus">
                        <Plus size={20} strokeWidth={3} />
                      </span>
                    </span>
                  </button>
                </div>
                {shown.map((item, i) => {
                  const pos = layout.points[i + 1];
                  if (!pos) return null;
                  return (
                    <HandPrint
                      key={item.id}
                      item={item}
                      index={i}
                      pos={pos}
                      onOpen={onOpen}
                      fresh={item.id === freshId}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>

        {status === "ready" && collapsible && (
          <div className="wall-more">
            {expanded ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={fold}>
                <ChevronUp size={18} strokeWidth={2.5} /> Fold it back up
              </button>
            ) : (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setExpanded(true)}>
                <ChevronDown size={18} strokeWidth={2.5} /> Show all {matches.length} hands 👀
                <span className="wall-more-count">+{hiddenCount}</span>
              </button>
            )}
          </div>
        )}

        {status === "ready" && searching && matches.length === 0 && (
          <div className="wall-empty wall-empty-inline">
            <p className="wall-empty-big">No hand by that name.</p>
            <p>Either they went ninja mode, or they still owe me feedback. 👀</p>
          </div>
        )}

        {status === "ready" && items.length === 0 && (
          <div className="wall-empty wall-empty-inline">
            <p className="wall-empty-big">Suspiciously clean wall.</p>
            <p>Be the first from {batch.label} to mess it up.</p>
          </div>
        )}
      </div>
    </section>
  );
}
