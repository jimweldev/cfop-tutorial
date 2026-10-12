import type { ReactNode } from "react";
import { useProgress } from "@/stores/progress";

/** Page banner with a learned / learning progress bar over the given cases. */
export function ProgressHeader({
  eyebrow,
  title,
  description,
  keys,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  // progress keys ("oll:27") of the cases this page covers
  keys: string[];
  children?: ReactNode;
}) {
  const statuses = useProgress((s) => s.statuses);
  const learned = keys.filter((k) => statuses[k] === "learned").length;
  const learning = keys.filter((k) => statuses[k] === "learning").length;
  const pct = (n: number) => `${(n / keys.length) * 100}%`;

  return (
    <section className="relative overflow-hidden rounded-4xl bg-linear-to-br from-primary/30 via-primary/10 to-card p-5 ring-1 ring-primary/25 sm:p-6 md:p-8">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold tracking-widest text-primary-foreground uppercase">
          {eyebrow}
        </p>
        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4 text-sm">
          <span>
            <span className="font-heading text-2xl font-bold">{learned}</span>
            <span className="text-muted-foreground"> / {keys.length} learned</span>
          </span>
          <span className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" /> Learned
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500" /> Learning {learning > 0 && `(${learning})`}
            </span>
          </span>
        </div>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-foreground/10">
          <div className="bg-emerald-500 transition-all" style={{ width: pct(learned) }} />
          <div className="bg-amber-500 transition-all" style={{ width: pct(learning) }} />
        </div>
      </div>

      {children}
    </section>
  );
}
