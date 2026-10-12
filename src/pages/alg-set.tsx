import { useState } from "react";
import { TriggerNamesToggle } from "@/components/alg-text";
import { CaseCard } from "@/components/case-card";
import { ProgressHeader } from "@/components/progress-header";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ALG_SETS } from "@/data";
import type { AlgSet } from "@/data/types";
import { algKey, useProgress } from "@/stores/progress";

type Filter = "all" | "none" | "learning" | "learned";

const FILTERS: { value: Filter; label: string; short?: string }[] = [
  { value: "all", label: "All" },
  { value: "none", label: "Not started", short: "New" },
  { value: "learning", label: "Learning" },
  { value: "learned", label: "Learned" },
];

const META: Record<AlgSet, { title: string; description: string }> = {
  oll: {
    title: "OLL — Orient the Last Layer",
    description: "57 cases that make the whole top face yellow in one look. Learn them group by group.",
  },
  pll: {
    title: "PLL — Permute the Last Layer",
    description: "21 cases that move the top-layer pieces into place. Arrows show where each piece goes.",
  },
  f2l: {
    title: "F2L — First Two Layers",
    description: "Cases where the corner and edge are both in the top layer.",
  },
};

export function AlgSetPage({ set }: { set: AlgSet }) {
  const cases = ALG_SETS[set];
  const statuses = useProgress((s) => s.statuses);
  const [filter, setFilter] = useState<Filter>("all");

  const statusOf = (id: string) => statuses[algKey(set, id)] ?? "none";
  const count = (f: Filter) => cases.filter((c) => f === "all" || statusOf(c.id) === f).length;
  const visible = cases.filter((c) => filter === "all" || statusOf(c.id) === filter);
  const groups = [...new Set(visible.map((c) => c.group))];

  return (
    <div className="flex flex-col gap-8">
      <ProgressHeader
        eyebrow="Full CFOP"
        title={META[set].title}
        description={META[set].description}
        keys={cases.map((c) => algKey(set, c.id))}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          variant="outline"
          size="sm"
          spacing={0}
          value={[filter]}
          onValueChange={(v) => v[0] && setFilter(v[0] as Filter)}
          className="w-full bg-card sm:w-fit"
        >
          {FILTERS.map((f) => (
            <ToggleGroupItem key={f.value} value={f.value} className="flex-1 px-2 sm:flex-none sm:px-3">
              {f.short ? (
                <>
                  <span className="sm:hidden">{f.short}</span>
                  <span className="hidden sm:inline">{f.label}</span>
                </>
              ) : (
                f.label
              )}
              <span className="text-xs text-muted-foreground tabular-nums">{count(f.value)}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <TriggerNamesToggle />
      </div>

      {groups.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">No cases match this filter.</p>
      )}

      {groups.map((group) => {
        const inGroup = visible.filter((c) => c.group === group);
        const allInGroup = cases.filter((c) => c.group === group);
        const learned = allInGroup.filter((c) => statusOf(c.id) === "learned").length;
        return (
          <section key={group} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="h-6 w-1.5 rounded-full bg-primary" />
              <h2 className="font-heading text-xl font-semibold">{group}</h2>
              <span className="rounded-full bg-card px-2.5 py-0.5 text-xs text-muted-foreground ring-1 ring-foreground/10">
                {learned}/{allInGroup.length} learned
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {inGroup.map((c) => (
                <CaseCard key={c.id} set={set} algCase={c} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
