import { useId } from "react";
import type { AlgCase } from "@/data/types";
import { cn } from "@/lib/utils";

const COLORS: Record<string, string> = {
  y: "#ffe500",
  w: "#ffffff",
  r: "#e8102e",
  o: "#ff7a00",
  g: "#16b84e",
  b: "#1f6fe0",
  l: "#3f3f46", // dark gray: stickers that don't matter for this case
};

const CELL = 10;
const STRIP = 4.5; // depth of the side stickers
const TOP = STRIP + 0.8;
const SIZE = TOP * 2 + CELL * 3;
const C = SIZE / 2;
const SLANT = 0.8; // outer edge of the side stickers narrows toward the corners

// The back-side sticker strip; the other three sides are this rotated around the center.
const STRIP_POINTS = [0, 1, 2].map((i) => {
  const x0 = TOP + i * CELL;
  const x1 = TOP + (i + 1) * CELL;
  const yIn = TOP - 0.8;
  const yOut = yIn - STRIP;
  const out = (x: number) => C + (x - C) * SLANT;
  return `${x0},${yIn} ${x1},${yIn} ${out(x1)},${yOut} ${out(x0)},${yOut}`;
});

// Side-face color in the solved cube (yellow top, green front), per speedcubedb's data.
const FACE_OF: Record<string, string> = { g: "f", o: "r", b: "b", r: "l" };

/**
 * For a PLL case, where each top-layer piece has to go: [from, to] cell indices
 * (0–8, row by row from back-left). Pieces already home are left out.
 */
function pllMoves({ f, r, b, l }: AlgCase["stickers"]): [number, number][] {
  // each position's side stickers (as faces they belong to) — position index → faces
  const pieces: [number, string[]][] = [
    [0, [b[2], l[0]]],
    [1, [b[1]]],
    [2, [b[0], r[2]]],
    [3, [l[1]]],
    [5, [r[1]]],
    [6, [l[2], f[0]]],
    [7, [f[1]]],
    [8, [f[2], r[0]]],
  ];
  const homeFaces: Record<number, string> = {
    0: "bl",
    1: "b",
    2: "br",
    3: "l",
    5: "r",
    6: "fl",
    7: "f",
    8: "fr",
  };
  const homeOf = (faces: string) =>
    Number(
      Object.keys(homeFaces).find(
        (k) => [...homeFaces[Number(k)]].sort().join("") === faces,
      ),
    );

  const homes = pieces.map(([pos, colors]): [number, number] => [
    pos,
    homeOf(
      colors
        .map((c) => FACE_OF[c])
        .sort()
        .join(""),
    ),
  ]);
  if (homes.some(([, to]) => Number.isNaN(to))) return [];

  // Some cases are drawn with the top layer a turn off (the alg ends with a U).
  // Show the moves relative to whichever U turn leaves the fewest pieces moving.
  let best: [number, number][] = [];
  for (
    let k = 0, shifted = homes;
    k < 4;
    k++, shifted = shifted.map(([p, to]) => [p, U_TURN[to]])
  ) {
    const moving = shifted.filter(([from, to]) => from !== to);
    if (k === 0 || moving.length < best.length) best = moving;
  }
  return best;
}

// where each top-layer cell goes on a clockwise U turn
const U_TURN: Record<number, number> = {
  0: 2,
  2: 8,
  8: 6,
  6: 0,
  1: 5,
  5: 7,
  7: 3,
  3: 1,
};

const cellCenter = (i: number) => [
  TOP + (i % 3) * CELL + CELL / 2,
  TOP + Math.floor(i / 3) * CELL + CELL / 2,
];

/**
 * Top-down view of the last layer: the 3x3 top face plus the top row of each
 * side face, drawn slanted like the cube's sides. speedcubedb lists the top face
 * row by row from the back-left corner, and each side's row left-to-right as seen
 * facing that side — so every side reads right-to-left when rotated into place.
 * With `arrows`, PLL cases also show where each piece moves.
 */
export function CaseDiagram({
  stickers,
  arrows = false,
  rotate = 0,
  className,
}: {
  stickers: AlgCase["stickers"];
  arrows?: boolean;
  // clockwise degrees, for algs that start with a y rotation
  rotate?: number;
  className?: string;
}) {
  const markerId = useId();
  const { s, f, r, b, l } = stickers;
  const sides: [string, number][] = [
    [b, 0],
    [r, 90],
    [f, 180],
    [l, 270],
  ];

  const moves = arrows ? pllMoves(stickers) : [];
  // a swap shows as one double-headed arrow
  const lines = moves
    .filter(([from, to]) => {
      const swap = moves.some(([a, z]) => a === to && z === from);
      return !swap || from < to;
    })
    .map(([from, to]) => ({
      from,
      to,
      swap: moves.some(([a, z]) => a === to && z === from),
    }));

  return (
    <svg
      viewBox={`-0.5 -0.5 ${SIZE + 1} ${SIZE + 1}`}
      className={cn("size-20", className)}
      aria-hidden
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#000" />
        </marker>
      </defs>
      <g transform={`rotate(${rotate} ${C} ${C})`}>
        <g stroke="#000" strokeWidth={0.5} strokeLinejoin="round">
          {Array.from({ length: 9 }, (_, i) => (
            <rect
              key={i}
              x={TOP + (i % 3) * CELL}
              y={TOP + Math.floor(i / 3) * CELL}
              width={CELL}
              height={CELL}
              fill={COLORS[s[i]] ?? COLORS.l}
            />
          ))}
          {sides.map(([row, angle]) => (
            <g key={angle} transform={`rotate(${angle} ${C} ${C})`}>
              {STRIP_POINTS.map((points, i) => (
                <polygon
                  key={i}
                  points={points}
                  fill={COLORS[row[2 - i]] ?? COLORS.l}
                />
              ))}
            </g>
          ))}
        </g>
        {lines.map(({ from, to, swap }) => {
          const [x1, y1] = cellCenter(from);
          const [x2, y2] = cellCenter(to);
          // stop short of the cell centers so arrowheads don't overlap
          const len = Math.hypot(x2 - x1, y2 - y1);
          const k = 2.2 / len;
          return (
            <line
              key={`${from}-${to}`}
              x1={x1 + (x2 - x1) * k}
              y1={y1 + (y2 - y1) * k}
              x2={x2 - (x2 - x1) * k}
              y2={y2 - (y2 - y1) * k}
              stroke="#000"
              strokeWidth={0.7}
              markerEnd={`url(#${markerId})`}
              markerStart={swap ? `url(#${markerId})` : undefined}
            />
          );
        })}
      </g>
    </svg>
  );
}
