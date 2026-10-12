import { CaseCard } from "@/components/case-card";
import { ProgressHeader } from "@/components/progress-header";
import { getCase } from "@/data";
import type { TwoLookStep } from "@/data/two-look";
import { algKey } from "@/stores/progress";

export function TwoLookPage({
  title,
  intro,
  steps,
}: {
  title: string;
  intro: string;
  steps: TwoLookStep[];
}) {
  const keys = steps.flatMap((s) => s.cases.map((c) => algKey(c.set, c.id)));

  return (
    <div className="flex flex-col gap-8">
      <ProgressHeader eyebrow="Beginner CFOP" title={title} description={intro} keys={keys} />
      {steps.map((step, i) => (
        <section key={step.title} className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading font-bold text-primary-foreground">
              {i + 1}
            </span>
            <div>
              <h2 className="font-heading text-xl font-semibold">{step.title.replace(/^Step \d+: /, "")}</h2>
              <p className="text-sm text-muted-foreground">{step.goal}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {step.cases.map((c) => {
              const algCase = getCase(c.set, c.id);
              return (
                algCase && (
                  <CaseCard
                    key={c.id}
                    set={c.set}
                    algCase={algCase}
                    nickname={c.nickname}
                    algIndex={c.algIndex}
                  />
                )
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
