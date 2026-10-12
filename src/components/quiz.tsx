import { useMemo, useState, type ReactNode } from "react";
import { Check, RotateCcw, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type QuizQuestion = {
  prompt: string;
  image?: ReactNode;
  options: string[];
  answer: string;
  // shown after answering
  explain: string;
  // keep the options in the given order (e.g. the same Center / Edge / Corner buttons every time)
  fixedOptions?: boolean;
  // show options in the monospace alg font (moves like l vs I need it)
  monoOptions?: boolean;
};

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Multiple-choice quiz, one question at a time. `makeQuestions` runs again on each retry. */
export function Quiz({
  makeQuestions,
}: {
  makeQuestions: () => QuizQuestion[];
}) {
  const [round, setRound] = useState(0);
  const questions = useMemo(
    () =>
      shuffle(makeQuestions()).map((q) => ({
        ...q,
        options: q.fixedOptions ? q.options : shuffle(q.options),
      })),
    // only `round` matters: a new round deals a new set of questions
    [round],
  );
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const restart = () => {
    setRound((r) => r + 1);
    setIndex(0);
    setPicked(null);
    setScore(0);
  };

  if (index >= questions.length) {
    const perfect = score === questions.length;
    return (
      <Card size="sm">
        <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
          <Trophy
            className={cn(
              "size-10",
              perfect ? "text-amber-500" : "text-muted-foreground",
            )}
          />
          <p className="font-heading text-2xl font-bold">
            {score} / {questions.length}
          </p>
          <p className="text-muted-foreground">
            {perfect
              ? "Perfect — you know your pieces."
              : "Review the cards above and try again."}
          </p>
          <Button onClick={restart}>
            <RotateCcw /> Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const q = questions[index];
  const answered = picked !== null;
  const choose = (option: string) => {
    if (answered) return;
    setPicked(option);
    if (option === q.answer) setScore((s) => s + 1);
  };

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground tabular-nums">
            {index + 1} / {questions.length}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            Score {score}
          </span>
        </div>

        {q.image && <div className="flex justify-center">{q.image}</div>}
        <p className="text-center font-heading text-lg font-semibold">
          {q.prompt}
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          {q.options.map((option) => {
            const isAnswer = option === q.answer;
            const isPicked = option === picked;
            return (
              <button
                key={option}
                onClick={() => choose(option)}
                disabled={answered}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left font-medium ring-1 ring-foreground/10 transition-colors",
                  q.monoOptions && "font-mono text-base",
                  !answered && "bg-card hover:bg-muted active:scale-[0.99]",
                  answered &&
                    isAnswer &&
                    "bg-emerald-500/15 ring-2 ring-emerald-500",
                  answered &&
                    isPicked &&
                    !isAnswer &&
                    "bg-red-500/10 ring-2 ring-red-500",
                  answered && !isAnswer && !isPicked && "opacity-50",
                )}
              >
                {option}
                {answered && isAnswer && (
                  <Check className="size-4 text-emerald-600" />
                )}
                {answered && isPicked && !isAnswer && (
                  <X className="size-4 text-red-600" />
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              <span
                className={cn(
                  "font-semibold",
                  picked === q.answer ? "text-emerald-600" : "text-red-600",
                )}
              >
                {picked === q.answer ? "Correct. " : "Not quite. "}
              </span>
              {q.explain}
            </p>
            <Button
              onClick={() => {
                setIndex((i) => i + 1);
                setPicked(null);
              }}
              className="shrink-0"
            >
              {index + 1 < questions.length ? "Next" : "See score"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
