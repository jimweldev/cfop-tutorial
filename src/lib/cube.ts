// Minimal 3x3 sticker model for showing what moves do. Held the app's way:
// yellow top, green front, orange right (x right, y up, z toward you).
// Checked against speedcubedb's OLL/PLL pictures by applying each case's setup.

type Vec = [number, number, number];
type Sticker = { pos: Vec; normal: Vec; color: string };
export type CubeState = Sticker[];

export type FaceName = "u" | "d" | "f" | "b" | "r" | "l";
export type CubeFaces = Record<FaceName, string>;

const FACES: { name: FaceName; normal: Vec; color: string }[] = [
  { name: "u", normal: [0, 1, 0], color: "y" },
  { name: "d", normal: [0, -1, 0], color: "w" },
  { name: "f", normal: [0, 0, 1], color: "g" },
  { name: "b", normal: [0, 0, -1], color: "b" },
  { name: "r", normal: [1, 0, 0], color: "o" },
  { name: "l", normal: [-1, 0, 0], color: "r" },
];

export function solvedCube(): CubeState {
  const stickers: CubeState = [];
  for (const { normal, color } of FACES) {
    for (let a = -1; a <= 1; a++) {
      for (let b = -1; b <= 1; b++) {
        const pos = normal.map((n, i) => {
          if (n !== 0) return n;
          // the two axes that span this face
          const free = [0, 1, 2].filter((k) => normal[k] === 0);
          return i === free[0] ? a : b;
        }) as Vec;
        stickers.push({ pos, normal: [...normal], color });
      }
    }
  }
  return stickers;
}

// Rotate a vector a quarter turn around an axis; turns > 0 is counter-clockwise
// looking from the positive end of the axis (right-hand rule).
function rotate([x, y, z]: Vec, axis: 0 | 1 | 2, turns: number): Vec {
  let v: Vec = [x, y, z];
  for (let t = 0; t < ((turns % 4) + 4) % 4; t++) {
    const [a, b, c] = v;
    v = axis === 0 ? [a, -c, b] : axis === 1 ? [c, b, -a] : [-b, a, c];
  }
  return v;
}

// letter → axis, which layers turn (by coordinate on that axis), and quarter turns
// for the plain (clockwise) move. Clockwise looking at a face is -1 for R/U/F, +1 for L/D/B.
const MOVES: Record<string, { axis: 0 | 1 | 2; layers: number[]; turns: number }> = {
  R: { axis: 0, layers: [1], turns: -1 },
  L: { axis: 0, layers: [-1], turns: 1 },
  M: { axis: 0, layers: [0], turns: 1 },
  r: { axis: 0, layers: [0, 1], turns: -1 },
  l: { axis: 0, layers: [-1, 0], turns: 1 },
  x: { axis: 0, layers: [-1, 0, 1], turns: -1 },
  U: { axis: 1, layers: [1], turns: -1 },
  D: { axis: 1, layers: [-1], turns: 1 },
  E: { axis: 1, layers: [0], turns: 1 },
  u: { axis: 1, layers: [0, 1], turns: -1 },
  d: { axis: 1, layers: [-1, 0], turns: 1 },
  y: { axis: 1, layers: [-1, 0, 1], turns: -1 },
  F: { axis: 2, layers: [1], turns: -1 },
  B: { axis: 2, layers: [-1], turns: 1 },
  S: { axis: 2, layers: [0], turns: -1 },
  f: { axis: 2, layers: [0, 1], turns: -1 },
  b: { axis: 2, layers: [-1, 0], turns: 1 },
  z: { axis: 2, layers: [-1, 0, 1], turns: -1 },
};

/** Applies one move like "R", "U'", "F2", "Rw", "M'", "y2". */
export function applyMove(state: CubeState, move: string): CubeState {
  const match = move.match(/^([RLUDFBMESrludfbxyz])(w?)(2?)('?)$/);
  if (!match) throw new Error(`Unknown move: ${move}`);
  const [, letter, wide, double, prime] = match;
  const spec = MOVES[wide ? letter.toLowerCase() : letter];
  const turns = spec.turns * (double ? 2 : 1) * (prime ? -1 : 1);
  return state.map((s) =>
    spec.layers.includes(s.pos[spec.axis])
      ? { ...s, pos: rotate(s.pos, spec.axis, turns), normal: rotate(s.normal, spec.axis, turns) }
      : s,
  );
}

export const applyAlg = (state: CubeState, alg: string) =>
  alg
    .replace(/[()]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .reduce(applyMove, state);

/**
 * Each face's 9 stickers, row by row. u: from the back-left (front at the bottom);
 * d: from the front-left (seen from below, front at the top); f, b, r, l: from the
 * top-left as you look straight at that face. Same layout as IsoCube and CaseDiagram.
 */
export function cubeFaces(state: CubeState): CubeFaces {
  const faces = Object.fromEntries(FACES.map((f) => [f.name, Array(9).fill("l")])) as Record<FaceName, string[]>;
  for (const { pos: [x, y, z], normal, color } of state) {
    const face = FACES.find((f) => f.normal.every((n, i) => n === normal[i]))!.name;
    const [row, col] = {
      u: [z + 1, x + 1],
      d: [1 - z, x + 1],
      f: [1 - y, x + 1],
      b: [1 - y, 1 - x],
      r: [1 - y, 1 - z],
      l: [1 - y, z + 1],
    }[face];
    faces[face][row * 3 + col] = color;
  }
  return Object.fromEntries(Object.entries(faces).map(([k, v]) => [k, v.join("")])) as CubeFaces;
}

const SCRAMBLE_FACES = ["R", "L", "U", "D", "F", "B"];
const AXIS_OF: Record<string, number> = { R: 0, L: 0, U: 1, D: 1, F: 2, B: 2 };

/** Random face-turn scramble: no face twice in a row, no three turns on one axis in a row. */
export function randomScramble(length = 15): string[] {
  const moves: string[] = [];
  while (moves.length < length) {
    const face = SCRAMBLE_FACES[Math.floor(Math.random() * 6)];
    const last = moves.at(-1)?.[0];
    const beforeLast = moves.at(-2)?.[0];
    if (face === last) continue;
    if (last && beforeLast && AXIS_OF[face] === AXIS_OF[last] && AXIS_OF[last] === AXIS_OF[beforeLast]) continue;
    moves.push(face + ["", "'", "2"][Math.floor(Math.random() * 3)]);
  }
  return moves;
}
