import type { AlgSet } from "./types";

// 2-look OLL/PLL reuse the full OLL/PLL data; these lists only pick cases and
// which of each case's algs suits a beginner (default: the standard alg).
export type TwoLookCase = {
  set: AlgSet;
  id: string;
  nickname: string;
  algIndex?: number;
};

export type TwoLookStep = {
  title: string;
  goal: string;
  cases: TwoLookCase[];
};

export const TWO_LOOK_OLL: TwoLookStep[] = [
  {
    title: "Step 1: Yellow cross",
    goal: "Orient the edges so a yellow cross shows on top. If you see a dot, the dot alg makes the cross directly.",
    cases: [
      { set: "oll", id: "45", nickname: "Line" },
      { set: "oll", id: "44", nickname: "L shape" },
      { set: "oll", id: "2", nickname: "Dot" },
    ],
  },
  {
    title: "Step 2: Yellow corners",
    goal: "With the cross done, orient the corners so the whole top face is yellow.",
    cases: [
      { set: "oll", id: "27", nickname: "Sune" },
      { set: "oll", id: "26", nickname: "Antisune" },
      { set: "oll", id: "21", nickname: "H" },
      { set: "oll", id: "22", nickname: "Pi" },
      { set: "oll", id: "23", nickname: "Headlights" },
      { set: "oll", id: "24", nickname: "Chameleon" },
      { set: "oll", id: "25", nickname: "Bowtie" },
    ],
  },
];

export const TWO_LOOK_PLL: TwoLookStep[] = [
  {
    title: "Step 1: Corners",
    goal: "Swap corners until every side has matching 'headlights'. One pair of headlights: T Perm with them on the left. None: Y Perm.",
    cases: [
      { set: "pll", id: "T", nickname: "Adjacent swap" },
      { set: "pll", id: "Y", nickname: "Diagonal swap" },
    ],
  },
  {
    title: "Step 2: Edges",
    goal: "Cycle or swap the edges to finish the cube.",
    cases: [
      // the RU alg is easier to learn first than the M-slice standard
      { set: "pll", id: "Ua", nickname: "3-edge cycle", algIndex: 1 },
      { set: "pll", id: "Ub", nickname: "3-edge cycle" },
      { set: "pll", id: "H", nickname: "Opposite swap" },
      { set: "pll", id: "Z", nickname: "Adjacent swap" },
    ],
  },
];
