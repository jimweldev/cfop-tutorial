import { Link } from "react-router";
import { AlgText } from "@/components/alg-text";
import { CaseDiagram } from "@/components/case-diagram";
import { StatusBadge } from "@/components/status-toggle";
import { Card } from "@/components/ui/card";
import type { AlgCase, AlgSet } from "@/data/types";
import { algView } from "@/lib/alg-view";
import { cn } from "@/lib/utils";
import { algKey, useProgress } from "@/stores/progress";

export function CaseCard({
  set,
  algCase,
  nickname,
  algIndex = 0,
}: {
  set: AlgSet;
  algCase: AlgCase;
  nickname?: string;
  algIndex?: number;
}) {
  const status = useProgress((s) => s.statuses[algKey(set, algCase.id)]);
  const view = algView(algCase.algs[algIndex].alg);
  const to = `/alg/${set}/${algCase.id}${algIndex ? `?alg=${algIndex}` : ""}`;

  return (
    <Link to={to} className="group rounded-4xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
      <Card
        size="sm"
        className={cn(
          "h-full gap-3 px-3 pt-3 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-xl group-active:scale-[0.98]",
          status === "learned" && "ring-2 ring-emerald-500/60",
          status === "learning" && "ring-2 ring-amber-500/60",
        )}
      >
        <div className="relative flex justify-center rounded-3xl bg-muted/70 py-4 transition-colors group-hover:bg-primary/15">
          <CaseDiagram
            stickers={algCase.stickers}
            arrows={set === "pll"}
            rotate={view.rotate}
            className="size-24 transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <StatusBadge status={status} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 px-1 pb-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-heading font-semibold">{algCase.name}</span>
            {nickname && <span className="truncate text-xs text-muted-foreground">{nickname}</span>}
          </div>
          <AlgText
            alg={view.alg}
            className="justify-start text-left text-[0.7rem] leading-relaxed text-muted-foreground"
          />
        </div>
      </Card>
    </Link>
  );
}
