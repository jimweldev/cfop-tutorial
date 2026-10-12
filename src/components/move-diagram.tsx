import { useId } from "react";
import { cn } from "@/lib/utils";

type Axis = "col" | "row" | "face";

// For each move letter: which front-view cells turn, and the arrow for the
// clockwise (unprimed) turn as seen from the front.
const MOVES: Record<string, { axis: Axis; cells: (r: number, c: number) => boolean; dir: 1 | -1; hidden?: boolean }> = {
  // col: dir 1 = up, row: dir 1 = left, face: dir 1 = clockwise
  R: { axis: "col", cells: (_, c) => c === 2, dir: 1 },
  r: { axis: "col", cells: (_, c) => c >= 1, dir: 1 },
  L: { axis: "col", cells: (_, c) => c === 0, dir: -1 },
  l: { axis: "col", cells: (_, c) => c <= 1, dir: -1 },
  M: { axis: "col", cells: (_, c) => c === 1, dir: -1 },
  x: { axis: "col", cells: () => true, dir: 1 },
  U: { axis: "row", cells: (r) => r === 0, dir: 1 },
  u: { axis: "row", cells: (r) => r <= 1, dir: 1 },
  D: { axis: "row", cells: (r) => r === 2, dir: -1 },
  E: { axis: "row", cells: (r) => r === 1, dir: -1 },
  y: { axis: "row", cells: () => true, dir: 1 },
  F: { axis: "face", cells: () => true, dir: 1 },
  f: { axis: "face", cells: () => true, dir: 1 },
  z: { axis: "face", cells: () => true, dir: 1 },
  // B and S turn layers you can't see from the front
  B: { axis: "face", cells: () => true, dir: -1, hidden: true },
  S: { axis: "face", cells: () => true, dir: 1, hidden: true },
};

const CELL = 12;
const PAD = 6;
const SIZE = PAD * 2 + CELL * 3;

/** Front view of the cube: highlighted cells turn, the arrow shows which way. */
export function MoveDiagram({ move, className }: { move: string; className?: string }) {
  const markerId = useId();
  const spec = MOVES[move[0]];
  if (!spec) return null;
  const prime = move.includes("'");
  const double = move.includes("2");
  const dir = prime ? -spec.dir : spec.dir;

  // columns/rows covered by the move, for placing straight arrows
  const lines = [0, 1, 2].filter((i) =>
    spec.axis === "col" ? spec.cells(0, i) : spec.cells(i, 0),
  );
  const center = (i: number) => PAD + CELL * i + CELL / 2;
  const mid = (center(lines[0]) + center(lines[lines.length - 1])) / 2;

  let arrow: string;
  if (spec.axis === "col") {
    const [from, to] = dir === 1 ? [SIZE - 2, 2] : [2, SIZE - 2];
    arrow = `M ${mid} ${from} L ${mid} ${to}`;
  } else if (spec.axis === "row") {
    const [from, to] = dir === 1 ? [SIZE - 2, 2] : [2, SIZE - 2];
    arrow = `M ${from} ${mid} L ${to} ${mid}`;
  } else {
    // three-quarter circle around the center
    const c = SIZE / 2;
    const rad = CELL * 1.1;
    arrow =
      dir === 1
        ? `M ${c - rad} ${c} A ${rad} ${rad} 0 1 1 ${c} ${c + rad}`
        : `M ${c + rad} ${c} A ${rad} ${rad} 0 1 0 ${c} ${c + rad}`;
  }

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={cn("size-20", className)} aria-hidden>
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-foreground" />
        </marker>
      </defs>
      {[0, 1, 2].flatMap((r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`${r}${c}`}
            x={PAD + c * CELL + 0.75}
            y={PAD + r * CELL + 0.75}
            width={CELL - 1.5}
            height={CELL - 1.5}
            rx={1.5}
            className={cn(
              spec.cells(r, c) ? "fill-primary" : "fill-foreground/15",
              spec.hidden && "opacity-40",
            )}
          />
        )),
      )}
      <path
        d={arrow}
        className="fill-none stroke-foreground"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={spec.hidden ? "3 2" : undefined}
        markerEnd={`url(#${markerId})`}
        markerStart={double ? `url(#${markerId})` : undefined}
      />
    </svg>
  );
}
