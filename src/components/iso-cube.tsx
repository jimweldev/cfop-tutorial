import { cn } from "@/lib/utils";

const COLORS: Record<string, string> = {
  y: "#ffe500",
  w: "#ffffff",
  r: "#e8102e",
  o: "#ff7a00",
  g: "#16b84e",
  b: "#1f6fe0",
  l: "#3f3f46", // dark gray: not solved yet / doesn't matter
};

export type IsoFaces = {
  // 9 stickers each, row by row. u: from the back-left corner; f and r: from the
  // top-left as you look straight at that face.
  u: string;
  f: string;
  r: string;
};

// isometric projection of a cube spanning 0..3 on each axis (x right, y up, z toward you)
const project = (x: number, y: number, z: number): [number, number] => [(x - z) * 0.866, (x + z) * 0.5 - y];

function sticker(corners: [number, number, number][]) {
  const pts = corners.map(([x, y, z]) => project(x, y, z));
  // shrink toward the center so the black frame shows between stickers
  const cx = pts.reduce((s, p) => s + p[0], 0) / 4;
  const cy = pts.reduce((s, p) => s + p[1], 0) / 4;
  return pts.map(([x, y]) => `${cx + (x - cx) * 0.86},${cy + (y - cy) * 0.86}`).join(" ");
}

const STICKERS = {
  u: Array.from({ length: 9 }, (_, i) => {
    const [r, c] = [Math.floor(i / 3), i % 3];
    return sticker([[c, 3, r], [c + 1, 3, r], [c + 1, 3, r + 1], [c, 3, r + 1]]);
  }),
  f: Array.from({ length: 9 }, (_, i) => {
    const [r, c] = [Math.floor(i / 3), i % 3];
    return sticker([[c, 3 - r, 3], [c + 1, 3 - r, 3], [c + 1, 2 - r, 3], [c, 2 - r, 3]]);
  }),
  r: Array.from({ length: 9 }, (_, i) => {
    const [r, c] = [Math.floor(i / 3), i % 3];
    return sticker([[3, 3 - r, 3 - c], [3, 3 - r, 2 - c], [3, 2 - r, 2 - c], [3, 2 - r, 3 - c]]);
  }),
};

const OUTLINE = [
  // silhouette: the six outer corners of the hexagon
  project(0, 3, 0), project(3, 3, 0), project(3, 0, 0), project(3, 0, 3), project(0, 0, 3), project(0, 3, 3),
]
  .map(([x, y]) => `${x},${y}`)
  .join(" ");

/** A cube seen from above-front-right, for showing what a step should look like. */
export function IsoCube({ faces, className }: { faces: IsoFaces; className?: string }) {
  return (
    <svg viewBox="-2.75 -3.15 5.5 6.3" className={cn("size-28", className)} aria-hidden>
      <polygon points={OUTLINE} fill="#0a0a0a" stroke="#0a0a0a" strokeWidth={0.12} strokeLinejoin="round" />
      {(["u", "f", "r"] as const).map((face) =>
        STICKERS[face].map((points, i) => (
          <polygon key={`${face}${i}`} points={points} fill={COLORS[faces[face][i]] ?? COLORS.l} strokeLinejoin="round" />
        )),
      )}
    </svg>
  );
}
