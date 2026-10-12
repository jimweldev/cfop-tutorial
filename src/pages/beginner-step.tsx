import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import { AlgBlock } from "@/components/alg-block";
import { CaseDiagram } from "@/components/case-diagram";
import { IsoCube } from "@/components/iso-cube";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BEGINNER } from "@/data/beginner";
import { BEGINNER_STEPS } from "@/lib/nav";

const BEGINNER_VIDEO = "7Ron6MN45LY";

export function BeginnerStepPage() {
  const { step } = useParams();
  const index = BEGINNER.findIndex((s) => s.slug === step);
  const data = BEGINNER[index];

  if (!data) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Step not found. <Link to="/" className="underline">Go home</Link>
      </p>
    );
  }

  const prev = BEGINNER_STEPS[index - 1];
  const next = BEGINNER_STEPS[index + 1];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-center gap-5 rounded-4xl bg-linear-to-br from-primary/30 via-primary/10 to-card p-5 ring-1 ring-primary/25">
        <IsoCube faces={data.goalImage} className="size-24 shrink-0 sm:size-28" />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-widest text-primary-foreground uppercase">
            Step {index + 1} of {BEGINNER.length} · Goal
          </p>
          <p className="text-lg leading-snug">{data.goal}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <YouTubeEmbed
          videoId={BEGINNER_VIDEO}
          start={data.videoStart}
          title="Learn How to Solve a Rubik's Cube in 10 Minutes (Beginner Tutorial) — J Perm"
        />
        <p className="text-xs text-muted-foreground">
          Video: J Perm, "Learn How to Solve a Rubik's Cube in 10 Minutes" — starts at this step.
        </p>
      </div>

      {data.parts.map((part) => (
        <Card key={part.heading} size="sm">
          <CardHeader>
            <CardTitle>{part.heading}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-start gap-4">
              {part.diagram && <CaseDiagram stickers={part.diagram} className="size-20 shrink-0" />}
              <p>{part.text}</p>
            </div>
            {part.alg && <AlgBlock alg={part.alg} repeat={part.repeat} />}
          </CardContent>
        </Card>
      ))}

      {data.tip && (
        <div className="flex gap-3 rounded-2xl border border-primary/50 bg-primary/10 p-4 text-sm">
          <Lightbulb className="size-5 shrink-0" />
          <p>{data.tip}</p>
        </div>
      )}

      <div className="flex justify-between gap-3">
        {prev ? (
          <Button variant="outline" nativeButton={false} render={<Link to={prev.to} />}>
            <ArrowLeft /> Back
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button nativeButton={false} render={<Link to={next.to} />}>
            {next.title} <ArrowRight />
          </Button>
        ) : (
          <Button nativeButton={false} render={<Link to="/beginner-cfop/f2l" />}>
            Next: Beginner CFOP <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}
