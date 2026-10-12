import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AlgStatus = "learning" | "learned";

type ProgressState = {
  // keyed by "<set>:<caseId>", e.g. "oll:27", "pll:T"
  statuses: Record<string, AlgStatus>;
  setStatus: (key: string, status: AlgStatus | null) => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      statuses: {},
      setStatus: (key, status) =>
        set((state) => {
          const statuses = { ...state.statuses };
          if (status) statuses[key] = status;
          else delete statuses[key];
          return { statuses };
        }),
    }),
    { name: "cfop-progress" },
  ),
);

export const algKey = (set: string, caseId: string) => `${set}:${caseId}`;
