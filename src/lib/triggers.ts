import { TRIGGERS, type Trigger } from "@/data/triggers";

export type AlgPart = { moves: string } | { trigger: Trigger };

type Token = { move: string; group: number };

// Moves tagged with the parenthesized group they're in; a move outside parentheses
// is a group of its own. "U2'" and "U2" are the same turn.
function tokenize(alg: string): Token[] {
  const tokens: Token[] = [];
  let group = 0;
  let inParens = false;
  for (const piece of alg.split(/(\(|\))/)) {
    if (piece === "(" || piece === ")") {
      inParens = piece === "(";
      group++;
      continue;
    }
    for (const move of piece.split(/\s+/).filter(Boolean)) {
      tokens.push({ move: move.replace(/2'$/, "2"), group });
      if (!inParens) group++;
    }
  }
  return tokens;
}

// A trigger fits if it stays inside one group, or covers whole groups exactly.
function fits(tokens: Token[], start: number, length: number) {
  const end = start + length - 1;
  if (tokens[start].group === tokens[end].group) return true;
  const startsGroup = start === 0 || tokens[start - 1].group !== tokens[start].group;
  const endsGroup = end === tokens.length - 1 || tokens[end + 1].group !== tokens[end].group;
  return startsGroup && endsGroup;
}

// longest first, so Sune wins over the sexy move it starts like
const PATTERNS = TRIGGERS.map((t) => ({ trigger: t, moves: tokenize(t.alg).map((x) => x.move) })).sort(
  (a, b) => b.moves.length - a.moves.length,
);

/**
 * Splits an alg into plain moves and named triggers, matching greedily left to right.
 * Matches follow the alg's own parentheses: a trigger never cuts a group in half.
 */
export function splitTriggers(alg: string): AlgPart[] {
  const tokens = tokenize(alg);
  const parts: AlgPart[] = [];
  let plain: string[] = [];
  const flush = () => {
    if (plain.length) parts.push({ moves: plain.join(" ") });
    plain = [];
  };

  for (let i = 0; i < tokens.length; ) {
    const hit = PATTERNS.find(
      (p) => p.moves.every((m, k) => tokens[i + k]?.move === m) && fits(tokens, i, p.moves.length),
    );
    if (hit) {
      flush();
      parts.push({ trigger: hit.trigger });
      i += hit.moves.length;
    } else {
      plain.push(tokens[i].move);
      i++;
    }
  }
  flush();
  return parts;
}
