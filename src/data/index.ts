import { F2L } from "./f2l";
import { OLL } from "./oll";
import { PLL } from "./pll";
import type { AlgCase, AlgSet } from "./types";

export const ALG_SETS: Record<AlgSet, AlgCase[]> = { oll: OLL, pll: PLL, f2l: F2L };

export const getCase = (set: AlgSet, id: string) => ALG_SETS[set].find((c) => c.id === id);

export const isAlgSet = (s: string | undefined): s is AlgSet =>
  s === "oll" || s === "pll" || s === "f2l";
