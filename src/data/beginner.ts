import type { IsoFaces } from "@/components/iso-cube";
import type { AlgCase } from "./types";

// Content for the beginner's (layer-by-layer) method. Algorithms and the
// piece positions they describe were checked on a simulated cube.

export type StepPart = {
  heading: string;
  text: string;
  alg?: string;
  // e.g. "Repeat until the corner is solved (1, 3 or 5 times)."
  repeat?: string;
  // top-down last-layer picture, same format as the OLL/PLL data
  diagram?: AlgCase["stickers"];
};

export type BeginnerStep = {
  slug: string;
  goal: string;
  // what the cube looks like when this step is done
  goalImage: IsoFaces;
  // where this step starts in J Perm's beginner video (seconds)
  videoStart: number;
  parts: StepPart[];
  tip?: string;
};

// top-face-only diagrams for the yellow cross step (sides don't matter)
const top = (s: string): AlgCase["stickers"] => ({ s, f: "lll", r: "lll", b: "lll", l: "lll" });

export const BEGINNER: BeginnerStep[] = [
  {
    slug: "cross",
    goal: "Make a white cross on top, with each edge's other color matching the center next to it.",
    goalImage: { u: "lwlwwwlwl", f: "lgllgllll", r: "lrllrllll" },
    videoStart: 20,
    parts: [
      {
        heading: "Hold white on top",
        text: "Hold the cube with the white center on top. You'll place the four white edges around it one at a time. Each rule below keeps the edges you've already placed.",
      },
      {
        heading: "Edge on the bottom, white facing down",
        text: "Turn D until the edge's other color sits right under its matching center. Then turn that face twice — F2 if it's in front. The edge jumps up into the cross.",
      },
      {
        heading: "Edge in the middle, white facing front",
        text: "Turn the cube so the edge is at front-right. This drops it to the bottom with white facing down — then use the rule above.",
        alg: "R' D R",
      },
      {
        heading: "Edge in the middle, white facing right",
        text: "Same idea with the edge at front-right, but white on the right side:",
        alg: "F D F'",
      },
      {
        heading: "Edge on the bottom, white facing out",
        text: "Turn D so the edge is in front, then do this. The edge ends up on the bottom with white facing down — then use the first rule.",
        alg: "F' R' D R F",
      },
      {
        heading: "Edge on top in the wrong spot or flipped",
        text: "Turn its face twice (like F2) to send it to the bottom, then use one of the rules above.",
      },
    ],
    tip: "Check the top: a white cross, and each cross edge's other color matches its center. Now turn the cube over — white stays on the bottom for the rest of the solve.",
  },
  {
    slug: "first-layer",
    goal: "Finish the white layer: place the four white corners so each matches both side centers.",
    goalImage: { u: "llllyllll", f: "llllglggg", r: "llllolooo" },
    videoStart: 105,
    parts: [
      {
        heading: "Line up a corner",
        text: "With the white cross on the bottom, find a corner in the top layer with white on it — its other two colors tell you where it goes. Turn U until it sits right above its spot, between the two matching centers. Turn the whole cube so that spot is at the front-right.",
      },
      {
        heading: "Insert it",
        text: "Do the move below with the corner at front-right, top layer.",
        alg: "R U R' U'",
        repeat: "Repeat until the corner is solved — 1, 3 or 5 times.",
      },
      {
        heading: "Stuck corner",
        text: "If a white corner is in the bottom layer but in the wrong spot or twisted, hold it at front-right and do R U R' U' once. That lifts it to the top, then insert it normally.",
      },
    ],
  },
  {
    slug: "second-layer",
    goal: "Place the four middle-layer edges. After this step the first two layers are done.",
    goalImage: { u: "llllyllll", f: "lllgggggg", r: "llloooooo" },
    videoStart: 241,
    parts: [
      {
        heading: "Find an edge and line it up",
        text: "Keep white on the bottom and yellow on top. Find an edge in the top layer with no yellow on it. Turn U until its front sticker matches the front center — together they look like an upside-down T.",
      },
      {
        heading: "Edge goes right",
        text: "If the edge's top sticker matches the right center:",
        alg: "U R U' R' U' F' U F",
      },
      {
        heading: "Edge goes left",
        text: "If the edge's top sticker matches the left center:",
        alg: "U' L' U L U F U' F'",
      },
      {
        heading: "Stuck edge",
        text: "If every top-layer edge has yellow but a middle edge is wrong or flipped, hold it at front-right and do the 'goes right' alg once. That pops it into the top layer.",
      },
    ],
  },
  {
    slug: "yellow-cross",
    goal: "Make a yellow cross on top. Ignore the corners for now.",
    goalImage: { u: "lylyyylyl", f: "lllgggggg", r: "llloooooo" },
    videoStart: 345,
    parts: [
      {
        heading: "The alg",
        text: "One alg does the whole step: F, then the 'sexy move', then F'. Look only at the yellow edges on top.",
        alg: "F R U R' U' F'",
      },
      {
        heading: "Line",
        text: "Hold the line horizontally (left to right) and do the alg. You get the cross.",
        diagram: top("lllyyylll"),
      },
      {
        heading: "L shape",
        text: "Hold the L so its two yellow edges are at the back and left, then do the alg. You get a line.",
        diagram: top("lylyyllll"),
      },
      {
        heading: "Dot",
        text: "Do the alg from any angle. You get an L shape — continue from there.",
        diagram: top("llllyllll"),
      },
    ],
    tip: "Line → cross. L → line → cross. Dot → L → line → cross.",
  },
  {
    slug: "yellow-edges",
    goal: "Match each yellow edge's side color with the center below it.",
    goalImage: { u: "lylyyylyl", f: "lglgggggg", r: "loloooooo" },
    videoStart: 390,
    parts: [
      {
        heading: "Find two matching edges",
        text: "Turn U until at least two edges match their centers. If all four match, this step is done.",
      },
      {
        heading: "Two neighbors match",
        text: "Hold the cube so the two matching edges are at the back and right, then do the alg. All four edges now match.",
        alg: "R U R' U R U2 R' U",
      },
      {
        heading: "Two opposite edges match",
        text: "Do the same alg once from any angle. Then turn U until two neighbors match and use the case above.",
      },
    ],
  },
  {
    slug: "position-corners",
    goal: "Move each yellow corner to its correct spot. Twisted is fine — that's the next step.",
    // corners in place; front-right and back-left still twisted
    goalImage: { u: "byyyyyyyo", f: "ggygggggg", r: "goooooooo" },
    videoStart: 437,
    parts: [
      {
        heading: "What counts as correct",
        text: "A corner is in the right spot when its three colors match the three centers around it, even if yellow isn't facing up.",
      },
      {
        heading: "Cycle the other three",
        text: "Hold a correct corner at front-right, top layer, and do the alg. It stays put while the other three corners swap around.",
        alg: "U R U' L' U R' U' L",
        repeat: "Repeat until all four corners are in place.",
      },
      {
        heading: "No corner is correct",
        text: "Do the alg once from any angle. One corner will then be correct — start from there.",
      },
    ],
  },
  {
    slug: "orient-corners",
    goal: "Twist the yellow corners so the whole top is yellow. This finishes the cube.",
    goalImage: { u: "yyyyyyyyy", f: "ggggggggg", r: "ooooooooo" },
    videoStart: 500,
    parts: [
      {
        heading: "Twist one corner",
        text: "Hold the cube with an unsolved corner at front-right, top layer. Do the alg until that corner's yellow faces up.",
        alg: "R' D' R D",
        repeat: "Repeat 2 or 4 times.",
      },
      {
        heading: "Next corner",
        text: "Turn only U — never the whole cube — to bring the next unsolved corner to front-right. Twist it the same way. Repeat until every corner is yellow on top, then turn U to finish.",
      },
    ],
    tip: "The bottom layers look scrambled halfway through. That's expected: they fix themselves once the last corner is twisted, as long as you only turn U between corners.",
  },
];
