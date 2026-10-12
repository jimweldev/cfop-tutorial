// Algs that start with a y rotation are shown pre-rotated: the diagram turns to
// match and the y is dropped from the alg. Direction checked on a simulated cube:
// y turns the top-down picture 90° clockwise.

const QUARTER_TURNS: Record<string, number> = { y: 1, "y'": 3, y2: 2, "y2'": 2 };
const Y_TOKEN = ["", "y", "y2", "y'"];

export type AlgView = {
  // alg without its leading y
  alg: string;
  // clockwise degrees to rotate the case diagram
  rotate: number;
  // the dropped rotation ("y", "y'", "y2"), if any
  rotation?: string;
};

export function algView(alg: string): AlgView {
  const match = alg.match(/^(y2'?|y'?)\s+/);
  if (!match) return { alg, rotate: 0 };
  return { alg: alg.slice(match[0].length), rotate: QUARTER_TURNS[match[1]] * 90, rotation: match[1] };
}

/** The case's setup, ending in the same rotated view the alg now starts from. */
export function setupForView(setup: string, rotation?: string) {
  if (!rotation) return setup;
  const moves = setup.split(/\s+/).filter(Boolean);
  let turns = QUARTER_TURNS[rotation];
  // merge with y turns already at the end of the setup (often a y' that this cancels)
  while (moves.length && moves[moves.length - 1] in QUARTER_TURNS) {
    turns += QUARTER_TURNS[moves.pop()!];
  }
  const y = Y_TOKEN[turns % 4];
  return [...moves, y].filter(Boolean).join(" ");
}
