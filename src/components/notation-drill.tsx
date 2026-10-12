import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Shuffle } from "lucide-react";
import { CubeNet } from "@/components/cube-net";
import { IsoCube } from "@/components/iso-cube";
import { MoveDiagram } from "@/components/move-diagram";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { applyAlg, applyMove, cubeFaces, randomScramble, solvedCube } from "@/lib/cube";
import { cn } from "@/lib/utils";

const FACE_NAME: Record<string, string> = {
  R: "Right face",
  L: "Left face",
  U: "Top layer",
  D: "Bottom layer",
  F: "Front face",
  B: "Back face",
};

const describe = (move: string) =>
  `${FACE_NAME[move[0]]}, ${move.includes("2") ? "half turn" : move.includes("'") ? "counter-clockwise" : "clockwise"}`;

/**
 * Step through a scramble one move at a time (→ / ←, or the buttons) and watch the
 * cube follow. Meant for doing the same moves on a real cube alongside it.
 */
export function NotationDrill() {
  const [scramble, setScramble] = useState(() => randomScramble());
  const [step, setStep] = useState(0);

  // states[i] = cube after the first i moves. Scrambles are done white on top,
  // green in front (the official WCA way), so start from the app's solved cube flipped with z2.
  const states = useMemo(() => {
    const list = [applyAlg(solvedCube(), "z2")];
    for (const move of scramble) list.push(applyMove(list[list.length - 1], move));
    return list;
  }, [scramble]);
  const faces = cubeFaces(states[step]);

  const next = () => setStep((s) => Math.min(s + 1, scramble.length));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const newScramble = () => {
    setScramble(randomScramble());
    setStep(0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setStep((s) => Math.min(s + 1, scramble.length));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setStep((s) => Math.max(s - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scramble.length]);

  const current = scramble[step];
  const done = step === scramble.length;

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-1.5">
          {scramble.map((move, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={cn(
                "min-w-10 rounded-xl px-2 py-1 font-mono text-base font-semibold ring-1 ring-foreground/10 transition-colors",
                i < step && "bg-muted text-muted-foreground",
                i === step && "bg-primary text-primary-foreground ring-2 ring-primary",
                i > step && "bg-card",
              )}
              aria-label={`Go to move ${i + 1}: ${move}`}
            >
              {move}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
          <IsoCube faces={faces} className="size-40" />
          <CubeNet faces={faces} />
        </div>

        <div className="flex min-h-20 items-center gap-4 rounded-2xl bg-muted px-4 py-3">
          {done ? (
            <p className="text-sm">
              <span className="font-semibold">Scrambled.</span> Your cube should now match the
              picture — check every face in the flat view.
            </p>
          ) : (
            <>
              <MoveDiagram move={current} className="size-14 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Move {step + 1} of {scramble.length}
                </p>
                <p className="font-mono text-2xl font-bold">{current}</p>
                <p className="text-sm">{describe(current)}</p>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="lg" onClick={back} disabled={step === 0} aria-label="Previous move">
              <ArrowLeft />
            </Button>
            <Button size="lg" onClick={next} disabled={done}>
              Do {current ?? "move"} <ArrowRight />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(0)} disabled={step === 0}>
              <RotateCcw /> Reset
            </Button>
            <Button variant="ghost" onClick={newScramble}>
              <Shuffle /> New
            </Button>
          </div>
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Tip: use the → and ← arrow keys.
        </p>
      </CardContent>
    </Card>
  );
}
