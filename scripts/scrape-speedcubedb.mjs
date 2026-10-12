// One-off importer: pulls OLL/PLL/F2L cases from speedcubedb.com into src/data/*.ts.
// Run: npm run import-algs
// Re-running overwrites the generated files, so review the diff afterwards.
import { writeFileSync } from "node:fs";
import { parse } from "node-html-parser";
import { Alg } from "cubing/alg";
import { cube3x3x3 } from "cubing/puzzles";

const SETS = [
  { set: "oll", url: "https://www.speedcubedb.com/a/3x3/OLL" },
  { set: "pll", url: "https://www.speedcubedb.com/a/3x3/PLL" },
  // F2L 1–24: corner and edge both in the top layer (the cases taught on the Intuitive F2L page)
  { set: "f2l", url: "https://www.speedcubedb.com/a/3x3/F2L", only: (id) => Number(id) <= 24 },
];

const clean = (s) => s.replace(/\s+/g, " ").trim();
// for comparing algs regardless of trigger parentheses and spacing
const normalize = (alg) => clean(alg.replace(/[()]/g, " "));

function parseCase(row, set) {
  const raw = row.getAttribute("data-alg");
  const id = raw.replace(/^(OLL|F2L) /, "");
  const setup = clean(row.querySelector(".setup-case")?.text.replace("setup:", "") ?? "");
  const standard = clean(
    row.querySelector(".scdb-panel")?.text.replace("Standard Alg:", "") ?? "",
  );

  // only the default orientation's list (F2L has more lists for the other slots)
  const alternatives = (row.querySelector("div[data-ori='0']")?.querySelectorAll("li") ?? []).map(
    (li) => {
      const alg = clean(li.querySelector(".formatted-alg")?.text ?? "");
      const video = li.querySelector("a[href*='youtube.com/watch']")?.getAttribute("href");
      const votes = li.text.match(/Community Votes:\s*(\d+)/)?.[1];
      return {
        alg,
        ...(video && { videoId: new URL(video).searchParams.get("v") }),
        ...(votes && { votes: Number(votes) }),
      };
    },
  );

  // Only algs with a video are kept, so every alg shown can be watched.
  // The standard alg goes first when it has one (keeping its trigger parentheses).
  const match = standard && alternatives.find((a) => normalize(a.alg) === normalize(standard));
  const ordered = match
    ? [{ ...match, alg: standard }, ...alternatives.filter((a) => a !== match)]
    : alternatives;
  const withVideo = ordered.filter((a) => a.videoId);
  // a few F2L cases have no video at all; keep their top alg so the set stays complete
  const algs = withVideo.length || set !== "f2l" ? withVideo : ordered.slice(0, 1);

  const base = {
    id,
    name: set === "pll" ? `${id} Perm` : `${set.toUpperCase()} ${id}`,
    group: row.getAttribute("data-subgroup"),
    setup,
    algs,
  };

  if (set === "f2l") return { ...base, ...f2lState(setup, algs) };

  const cube = row.querySelector(".jcube");
  const stickers = Object.fromEntries(
    ["us", "uf", "ur", "ub", "ul"].map((k) => [k.slice(1), cube.getAttribute(`data-${k}`)]),
  );
  return { ...base, stickers };
}

// --- F2L: simulate the case to draw it and classify it -----------------------
// cubing.js piece order; the pair being solved is the DRF corner + FR edge.
const kpuzzle = await cube3x3x3.kpuzzle();
const solved = kpuzzle.defaultPattern();
const EDGES = ["UF", "UR", "UB", "UL", "DF", "DR", "DB", "DL", "FR", "FL", "BR", "BL"];
const CORNERS = ["UFR", "URB", "UBL", "ULF", "DRF", "DFL", "DLB", "DBR"];
// facelets of each top-layer corner, clockwise from U. Orientation o puts the corner's
// white sticker on facelet o, its front color (green) on o+1, its right color (orange) on o+2.
const CORNER_FACELETS = { UFR: "urf", URB: "ubr", UBL: "ulb", ULF: "ufl" };
// where each top-layer piece's stickers sit in the diagram: top-face index, and for each
// side face the index in that face's row (read left-to-right facing it)
const TOP_INDEX = { UBL: 0, UB: 1, URB: 2, UL: 3, UR: 5, ULF: 6, UF: 7, UFR: 8 };
const SIDE_INDEX = {
  ULF: { f: 0, l: 2 }, UF: { f: 1 }, UFR: { f: 2, r: 0 },
  UR: { r: 1 }, URB: { r: 2, b: 0 }, UB: { b: 1 },
  UBL: { b: 2, l: 0 }, UL: { l: 1 },
};

// Algs and setups may rotate the whole cube (y); turn it back so the centers are home.
const ROTATIONS = ["", "y", "y2", "y'", "x2", "z2", "x2 y", "x2 y'"];
const unrotate = (pattern) => {
  for (const r of ROTATIONS) {
    const p = r ? pattern.applyAlg(Alg.fromString(r)) : pattern;
    if (p.patternData.CENTERS.pieces.every((piece, i) => piece === i)) return p;
  }
  throw new Error("couldn't undo cube rotation");
};

const firstTwoLayersSolved = (pattern) => {
  const { EDGES: e, CORNERS: c } = pattern.patternData;
  return (
    [4, 5, 6, 7, 8, 9, 10, 11].every((i) => e.pieces[i] === i && e.orientation[i] === 0) &&
    [4, 5, 6, 7].every((i) => c.pieces[i] === i && c.orientation[i] === 0)
  );
};

function f2lState(setup, algs) {
  const state = unrotate(solved.applyAlg(Alg.fromString(setup)));
  for (const { alg } of algs) {
    if (!firstTwoLayersSolved(unrotate(state.applyAlg(Alg.fromString(normalize(alg)))))) {
      throw new Error(`F2L setup "${setup}": "${alg}" doesn't solve the pair`);
    }
  }

  const { EDGES: e, CORNERS: c } = state.patternData;
  const cornerPos = CORNERS[c.pieces.indexOf(CORNERS.indexOf("DRF"))];
  const co = c.orientation[CORNERS.indexOf(cornerPos)];
  const edgePos = EDGES[e.pieces.indexOf(EDGES.indexOf("FR"))];
  const eo = e.orientation[EDGES.indexOf(edgePos)];
  if (!(cornerPos in TOP_INDEX) || !(edgePos in TOP_INDEX)) throw new Error(`pair not on top: ${setup}`);

  // top-down picture: only the pair is colored, the yellow center for orientation
  const sides = { f: [..."lll"], r: [..."lll"], b: [..."lll"], l: [..."lll"] };
  const top = [..."llllyllll"];
  const paint = (pos, face, color) => {
    if (face === "u") top[TOP_INDEX[pos]] = color;
    else sides[face][SIDE_INDEX[pos][face]] = color;
  };
  const facelets = CORNER_FACELETS[cornerPos];
  ["w", "g", "o"].forEach((color, k) => paint(cornerPos, facelets[(co + k) % 3], color));
  // edge orientation 0: its front color (green) faces up
  const edgeSide = Object.keys(SIDE_INDEX[edgePos])[0];
  paint(edgePos, "u", eo === 0 ? "g" : "o");
  paint(edgePos, edgeSide, eo === 0 ? "o" : "g");

  // white up, or compare the corner's top color with the edge's top color
  const cornerTop = top[TOP_INDEX[cornerPos]];
  const edgeTop = top[TOP_INDEX[edgePos]];
  const category = cornerTop === "w" ? "white-top" : cornerTop === edgeTop ? "same" : "different";

  return {
    category,
    stickers: { s: top.join(""), f: sides.f.join(""), r: sides.r.join(""), b: sides.b.join(""), l: sides.l.join("") },
  };
}

// -----------------------------------------------------------------------------
const TYPES = { oll: "AlgCase", pll: "AlgCase", f2l: "F2LCase" };

for (const { set, url, only = () => true } of SETS) {
  const res = await fetch(url, { headers: { "User-Agent": "cfop-tutorial importer" } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const root = parse(await res.text());
  const cases = root
    .querySelectorAll(".row.singlealgorithm")
    .filter((row) => only(row.getAttribute("data-alg").replace(/^(OLL|F2L) /, "")))
    .map((row) => parseCase(row, set));

  const missing = cases.filter((c) => !c.algs.length || !c.setup);
  if (missing.length) throw new Error(`${set}: cases without a video or setup ${missing.map((c) => c.id)}`);

  const file = `src/data/${set}.ts`;
  writeFileSync(
    file,
    `// Generated by scripts/scrape-speedcubedb.mjs from ${url} — edit by hand only to fix data.\n` +
      `import type { ${TYPES[set]} } from "./types";\n\n` +
      `export const ${set.toUpperCase()}: ${TYPES[set]}[] = ${JSON.stringify(cases, null, 2)};\n`,
  );
  console.log(`${file}: ${cases.length} cases, ${cases.reduce((n, c) => n + c.algs.length, 0)} algs`);
}
