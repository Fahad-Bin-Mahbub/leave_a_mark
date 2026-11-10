"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Hero from "./Hero";
import Ticker from "./Ticker";
import Walls, { type LoadStatus } from "./Walls";
import FeedbackForm from "./FeedbackForm";
import PrintModal from "./PrintModal";
import Footer from "./Footer";
import { PaintDefs } from "./HandShape";
import { BATCHES } from "@/lib/config";
import { makeDemoPrints } from "@/lib/demo";
import type { BatchId, Feedback } from "@/lib/types";

const IS_DEV = process.env.NODE_ENV !== "production";

export default function Home() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [demo, setDemo] = useState(false);
  const [demoBusy, setDemoBusy] = useState(false);
  const [active, setActive] = useState<BatchId>(BATCHES[0].id);
  const [formOpen, setFormOpen] = useState(false);
  const [formBatch, setFormBatch] = useState<BatchId | "">("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [freshId, setFreshId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setDemo(false);
    setStatus("loading");
    try {
      const res = await fetch("/api/feedback", { cache: "no-store" });
      const data: { items?: Feedback[] } = await res.json();
      if (!res.ok || !data.items) throw new Error();
      setItems(data.items);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  const seedDemo = useCallback(async (perBatch = 60) => {
    setDemoBusy(true);
    try {
      const res = await fetch("/api/feedback/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perBatch }),
      });
      if (res.ok) {
        await load();
        return;
      }
    } catch {} finally {
      setDemoBusy(false);
    }
    // Fallback to in-memory demo if DB isn't reachable yet
    setItems(makeDemoPrints(perBatch));
    setDemo(true);
    setStatus("ready");
  }, [load]);

  const clearDemo = useCallback(async () => {
    setDemoBusy(true);
    try {
      await fetch("/api/feedback/demo", { method: "DELETE" });
    } catch {} finally {
      setDemoBusy(false);
    }
    await load();
  }, [load]);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("demo");
    if (param !== null) {
      const n = parseInt(param, 10);
      seedDemo(Number.isFinite(n) && n > 1 ? Math.min(n, 300) : 60);
    } else {
      load();
    }
  }, [load, seedDemo]);

  const byBatch = useMemo(() => {
    const map = Object.fromEntries(BATCHES.map((b) => [b.id, [] as Feedback[]])) as Record<BatchId, Feedback[]>;
    for (const item of items) map[item.batch]?.push(item);
    return map;
  }, [items]);

  const openForm = useCallback((batch: BatchId | "" = "") => {
    setFormBatch(batch);
    setFormOpen(true);
  }, []);
  const closeForm = useCallback(() => setFormOpen(false), []);

  const onSubmitted = useCallback((item: Feedback) => {
    setItems((prev) => [item, ...prev]);
    setActive(item.batch);
    setFreshId(item.id);
  }, []);

  // When the form closes after a successful post, scroll to the new print.
  useEffect(() => {
    if (!formOpen && freshId) {
      document.getElementById("walls")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [formOpen, freshId]);

  // Modal navigation within the wall the print belongs to.
  const selected = items.find((i) => i.id === selectedId) ?? null;
  const siblings = selected ? byBatch[selected.batch] : [];
  const index = selected ? siblings.findIndex((i) => i.id === selected.id) : -1;
  const step = (delta: number) => {
    if (index < 0 || siblings.length === 0) return;
    setSelectedId(siblings[(index + delta + siblings.length) % siblings.length].id);
  };
  const closePrint = useCallback(() => setSelectedId(null), []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <PaintDefs />
      <Hero total={status === "ready" ? items.length : null} onShare={() => openForm()} />
      <Ticker />
      <main>
        <Walls
          byBatch={byBatch}
          status={status}
          active={active}
          setActive={setActive}
          onAdd={openForm}
          onOpen={setSelectedId}
          onRetry={load}
          freshId={freshId}
        />
      </main>
      <Footer onShare={() => openForm()} />

      <FeedbackForm open={formOpen} defaultBatch={formBatch} onClose={closeForm} onSubmitted={onSubmitted} />
      <PrintModal
        item={selected}
        onClose={closePrint}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        position={selected ? { index, total: siblings.length } : null}
      />

      {(IS_DEV || demo || items.some((i) => i.isDemo)) && (
        <div className="demo-bar">
          {demo || items.some((i) => i.isDemo) ? (
            <button
              type="button"
              className="demo-pill demo-pill-danger"
              disabled={demoBusy}
              onClick={clearDemo}
            >
              {demoBusy
                ? "Deleting demo hands…"
                : `🗑️ Delete all ${items.filter((i) => i.isDemo).length || items.length} demo hands`}
            </button>
          ) : (
            <button
              type="button"
              className="demo-pill"
              disabled={demoBusy}
              onClick={() => seedDemo(60)}
            >
              {demoBusy ? "Adding 120 demo hands…" : "🧪 Add 120 demo hands (60 per batch)"}
            </button>
          )}
        </div>
      )}
    </>
  );
}

