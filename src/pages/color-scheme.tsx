import { IsoCube } from "@/components/iso-cube";
import { Quiz, type QuizQuestion } from "@/components/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SWATCH: Record<string, string> = {
  w: "bg-white",
  y: "bg-[#ffe500]",
  g: "bg-[#16b84e]",
  b: "bg-[#1f6fe0]",
  r: "bg-[#e8102e]",
  o: "bg-[#ff7a00]",
};

const OPPOSITES = [
  ["w", "White", "y", "Yellow"],
  ["g", "Green", "b", "Blue"],
  ["r", "Red", "o", "Orange"],
];

// the cube unfolded, as the app holds it: yellow on top, green in front
const NET: { color: string; name: string; col: number; row: number }[] = [
  { color: "y", name: "Top", col: 2, row: 1 },
  { color: "r", name: "Left", col: 1, row: 2 },
  { color: "g", name: "Front", col: 2, row: 2 },
  { color: "o", name: "Right", col: 3, row: 2 },
  { color: "b", name: "Back", col: 4, row: 2 },
  { color: "w", name: "Bottom", col: 2, row: 3 },
];

// Each color as a direction in the solved cube held yellow-up, green-front (x right, y up, z toward you).
// Right = top × front works for any way you hold it, e.g. white top + green front gives red.
const DIRECTION: Record<string, [number, number, number]> = {
  y: [0, 1, 0],
  w: [0, -1, 0],
  g: [0, 0, 1],
  b: [0, 0, -1],
  o: [1, 0, 0],
  r: [-1, 0, 0],
};
const NAME: Record<string, string> = {
  w: "White",
  y: "Yellow",
  g: "Green",
  b: "Blue",
  r: "Red",
  o: "Orange",
};
const COLORS = Object.keys(DIRECTION);
const colorAt = (v: number[]) =>
  COLORS.find((c) => DIRECTION[c].every((x, i) => x === v[i]))!;
const opposite = (c: string) => colorAt(DIRECTION[c].map((x) => -x));
const cross = ([a, b, c]: number[], [d, e, f]: number[]) => [
  b * f - c * e,
  c * d - a * f,
  a * e - b * d,
];
const pick = <T,>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];

function colorQuestions(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  // which color is on the right, for 3 different ways of holding the cube
  const holds = new Set<string>();
  while (holds.size < 3) {
    const top = pick(COLORS);
    const front = pick(COLORS.filter((c) => c !== top && c !== opposite(top)));
    holds.add(top + front);
  }
  for (const [top, front] of [...holds].map((h) => [...h])) {
    const right = colorAt(cross(DIRECTION[top], DIRECTION[front]));
    questions.push({
      prompt: `${NAME[top]} on top, ${NAME[front].toLowerCase()} in front — which color goes on the right?`,
      image: (
        <IsoCube
          faces={{ u: top.repeat(9), f: front.repeat(9), r: "l".repeat(9) }}
          className="size-32"
        />
      ),
      options: COLORS.filter((c) => c !== top && c !== front).map(
        (c) => NAME[c],
      ),
      answer: NAME[right],
      explain: `With ${NAME[top].toLowerCase()} on top and ${NAME[front].toLowerCase()} in front, ${NAME[right].toLowerCase()} is on the right and ${NAME[opposite(right)].toLowerCase()} on the left.`,
    });
  }

  // opposite colors
  for (const c of [...COLORS].sort(() => Math.random() - 0.5).slice(0, 3)) {
    questions.push({
      prompt: `Which color is opposite ${NAME[c].toLowerCase()}?`,
      options: [
        opposite(c),
        ...COLORS.filter((x) => x !== c && x !== opposite(c))
          .sort(() => Math.random() - 0.5)
          .slice(0, 3),
      ].map((x) => NAME[x]),
      answer: NAME[opposite(c)],
      explain: `${NAME[c]} and ${NAME[opposite(c)].toLowerCase()} are always on opposite faces.`,
    });
  }

  // can one piece have both colors? one opposite pair, one neighboring pair
  const a = pick(COLORS);
  const neighbor = pick(COLORS.filter((c) => c !== a && c !== opposite(a)));
  for (const [x, y] of [
    [a, opposite(a)],
    [a, neighbor],
  ]) {
    const ok = y !== opposite(x);
    questions.push({
      prompt: `Can one piece have both a ${NAME[x].toLowerCase()} and a ${NAME[y].toLowerCase()} sticker?`,
      options: ["Yes", "No"],
      fixedOptions: true,
      answer: ok ? "Yes" : "No",
      explain: ok
        ? `${NAME[x]} and ${NAME[y].toLowerCase()} are neighboring faces, so edges and corners between them have both.`
        : `${NAME[x]} and ${NAME[y].toLowerCase()} are opposite faces, so no piece touches both.`,
    });
  }

  return questions;
}

function Face({ color, name }: { color: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="grid grid-cols-3 gap-0.5 rounded-md bg-neutral-950 p-0.5">
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className={cn("size-4 rounded-[3px] sm:size-5", SWATCH[color])}
          />
        ))}
      </div>
      <span className="text-[0.65rem] text-muted-foreground">{name}</span>
    </div>
  );
}

export function ColorSchemePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <p className="text-lg">
        Every standard cube uses the same color scheme. Knowing it tells you
        where a piece belongs before you've solved anything.
      </p>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Colors come in opposite pairs</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            These colors are always on opposite faces, so no piece ever has
            both.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {OPPOSITES.map(([a, aName, b, bName]) => (
              <div
                key={a}
                className="flex items-center justify-center gap-2 rounded-2xl bg-muted px-3 py-2 text-sm"
              >
                <span
                  className={cn(
                    "size-4 rounded ring-1 ring-black/30",
                    SWATCH[a],
                  )}
                />{" "}
                {aName}
                <span className="text-muted-foreground">↔</span>
                <span
                  className={cn(
                    "size-4 rounded ring-1 ring-black/30",
                    SWATCH[b],
                  )}
                />{" "}
                {bName}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>How this app holds the cube</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-around">
          <div className="flex flex-col items-center gap-2">
            <IsoCube
              faces={{ u: "yyyyyyyyy", f: "ggggggggg", r: "ooooooooo" }}
              className="size-32"
            />
            <p className="text-sm text-muted-foreground">
              Yellow top · green front · orange right
            </p>
          </div>
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: "repeat(4, auto)",
              gridTemplateRows: "repeat(3, auto)",
            }}
          >
            {NET.map((f) => (
              <div key={f.name} style={{ gridColumn: f.col, gridRow: f.row }}>
                <Face color={f.color} name={f.name} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Remembering the order</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <p>
            With yellow on top, start at the front and keep moving to the side
            on its right:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 font-medium">
            {[
              ["g", "Green"],
              ["o", "Orange"],
              ["b", "Blue"],
              ["r", "Red"],
            ].map(([c, name], i) => (
              <span key={c} className="flex items-center gap-2">
                {i > 0 && <span className="text-muted-foreground">→</span>}
                <span
                  className={cn(
                    "size-4 rounded ring-1 ring-black/30",
                    SWATCH[c],
                  )}
                />{" "}
                {name}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground">
            So if green is in front, orange is on the right, blue at the back
            and red on the left. With white on top instead, the order runs the
            other way.
          </p>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold">Quiz yourself</h2>
          <p className="text-sm text-muted-foreground">
            8 questions on opposite colors and which color goes where. New
            colors every try.
          </p>
        </div>
        <Quiz makeQuestions={colorQuestions} />
      </section>
    </div>
  );
}
