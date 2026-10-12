import { AlgBlock } from "@/components/alg-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TRIGGERS } from "@/data/triggers";

export function TriggersPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-lg">
          A trigger is a short group of moves you learn to do as one quick motion.
        </p>
        <p className="text-muted-foreground">
          Algorithms mark triggers with parentheses, like <code>F (R U R' U') F'</code>. Instead of
          reading six moves, you read "F, sexy move, F'". Learn these first and longer algs get much
          easier to memorize.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TRIGGERS.map((t) => (
          <Card key={t.name} size="sm">
            <CardHeader>
              <CardTitle>{t.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <AlgBlock alg={t.alg} />
              <p className="text-sm text-muted-foreground">{t.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
