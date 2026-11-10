// Organic "real wall" layout for handprints.
//
// Prints are placed one by one using best-candidate sampling: for each print we
// try several random spots and keep the one furthest from its neighbours. The
// result looks like people slapped their hands wherever there was space, rather
// than a table, while never piling prints on top of each other.
//
// Prints fill the wall top-to-bottom in loose horizontal bands, so collapsing
// the wall to its first few bands still looks natural, and everything is seeded
// by the print's id so the layout is stable between visits.

export interface Point {
  x: number;
  y: number;
}

export interface WallLayout {
  points: Point[];
  height: number;
}

/** Print size (px) for a given wall width. Crowded walls use smaller prints. */
export function cellSize(width: number, dense: boolean): number {
  if (width >= 700) return dense ? 106 : 124;
  if (width >= 420) return dense ? 92 : 108;
  return dense ? 72 : 90;
}

/** How many prints roughly fit across one band of the wall. */
export function perBand(width: number, cell: number): number {
  return Math.max(2, Math.floor(width / (cell * 1.04)));
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32: tiny seeded PRNG
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CANDIDATES = 32;

export function layoutWall(ids: string[], width: number, cell: number): WallLayout {
  if (width <= 0 || ids.length === 0) return { points: [], height: 0 };

  const n = perBand(width, cell);
  const bandH = cell * 0.96; // pure handprints without text underneath
  const maxX = Math.max(0, width - cell);
  const points: Point[] = [];

  ids.forEach((id, i) => {
    const band = Math.floor(i / n);
    const rand = rng(hash(id) ^ Math.imul(i + 1, 2654435761));
    const yBase = band * bandH;

    let best: Point = { x: rand() * maxX, y: yBase };
    let bestScore = -1;

    for (let k = 0; k < CANDIDATES; k++) {
      const x = rand() * maxX;
      const y = Math.max(0, yBase + (rand() - 0.5) * bandH * 0.75);

      // distance to the nearest already-placed print (only nearby bands matter)
      let nearest = Infinity;
      for (let j = Math.max(0, points.length - n * 3); j < points.length; j++) {
        const dx = points[j].x - x;
        const dy = (points[j].y - y) * 1.2;
        const d = dx * dx + dy * dy;
        if (d < nearest) nearest = d;
      }
      // also keep a little breathing room from the side edges
      const edge = Math.min(x, maxX - x) + cell * 0.5;
      const score = Math.min(nearest, edge * edge * 4);

      if (score > bestScore) {
        bestScore = score;
        best = { x, y };
      }
    }

    points.push(best);
  });

  const height = points.reduce((m, p) => Math.max(m, p.y), 0) + cell * 1.05;
  return { points, height };
}
