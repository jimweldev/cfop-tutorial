export type Trigger = { name: string; alg: string; note: string };

// Also used to show algs with trigger names (see src/lib/triggers.ts).
export const TRIGGERS: Trigger[] = [
  { name: "Sexy move", alg: "R U R' U'", note: "The most common trigger in CFOP. Inside OLL 45, F (R U R' U') F', and T Perm." },
  { name: "Reverse sexy", alg: "U R U' R'", note: "The sexy move backwards. Ends the 'pair from the right' F2L insert." },
  { name: "Left sexy", alg: "L' U' L U", note: "The sexy move mirrored for the left hand." },
  { name: "Sledgehammer", alg: "R' F R F'", note: "Common in F2L and OLL." },
  { name: "Long sledge", alg: "R2 F R F'", note: "A sledgehammer that starts with R2 instead of R'. In OLL 1, 18 and 35." },
  { name: "Hedgeslammer", alg: "F R' F' R", note: "The sledgehammer backwards. It's the 'pair from the front' F2L insert." },
  { name: "Sune", alg: "R U R' U R U2 R'", note: "A whole OLL case (OLL 27) and a building block for many others." },
  { name: "Antisune", alg: "R U2 R' U' R U' R'", note: "Sune backwards. Solves OLL 26." },
];
