import type { CubeFaces, FaceName } from "@/lib/cube";
import { cn } from "@/lib/utils";

const COLORS: Record<string, string> = {
  y: "#ffe500",
  w: "#ffffff",
  r: "#e8102e",
  o: "#ff7a00",
  g: "#16b84e",
  b: "#1f6fe0",
  l: "#3f3f46",
};

// cross layout: top above front, left / front / right / back in a row, bottom below
const LAYOUT: { face: FaceName; col: number; row: number }[] = [
  { face: "u", col: 2, row: 1 },
  { face: "l", col: 1, row: 2 },
  { face: "f", col: 2, row: 2 },
  { face: "r", col: 3, row: 2 },
  { face: "b", col: 4, row: 2 },
  { face: "d", col: 2, row: 3 },
];

/** The whole cube unfolded flat, so hidden faces are visible too. */
export function CubeNet({ faces, className }: { faces: CubeFaces; className?: string }) {
  return (
    <div className={cn("grid w-fit grid-cols-4 grid-rows-3 gap-1", className)}>
      {LAYOUT.map(({ face, col, row }) => (
        <div
          key={face}
          className="grid grid-cols-3 gap-px rounded-md bg-neutral-950 p-px"
          style={{ gridColumn: col, gridRow: row }}
        >
          {[...faces[face]].map((c, i) => (
            <span key={i} className="size-3.5 rounded-[2px] sm:size-4" style={{ background: COLORS[c] }} />
          ))}
        </div>
      ))}
    </div>
  );
}
