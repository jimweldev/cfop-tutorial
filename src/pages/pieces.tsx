import { IsoCube, type IsoFaces } from "@/components/iso-cube";
import { Quiz, type QuizQuestion } from "@/components/quiz";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";

// Highlight one kind of piece: keep the face color at these sticker indices, gray elsewhere.
const highlight = (indices: number[]): IsoFaces => {
  const face = (color: string) =>
    Array.from({ length: 9 }, (_, i) =>
      indices.includes(i) ? color : "l",
    ).join("");
  return { u: face("y"), f: face("g"), r: face("o") };
};

const PIECES = [
  {
    name: "Centers",
    count: 6,
    stickers: "1 sticker",
    faces: highlight([4]),
    text: "The middle of each face. Centers never move relative to each other, so a center's color tells you that face's color — the white center means the white face, wherever the other white stickers are right now.",
  },
  {
    name: "Edges",
    count: 12,
    stickers: "2 stickers",
    faces: highlight([1, 3, 5, 7]),
    text: "The pieces between two centers. Each edge has exactly one home: the white-green edge belongs between the white and green centers.",
  },
  {
    name: "Corners",
    count: 8,
    stickers: "3 stickers",
    faces: highlight([0, 2, 6, 8]),
    text: "The pieces where three faces meet. A corner is solved only when all three of its colors match the three centers around it.",
  },
];

type Kind = "Center" | "Edge" | "Corner";
const KINDS: Kind[] = ["Center", "Edge", "Corner"];

// Every piece's stickers that this view shows, as [face, sticker index]. Pieces at the
// back or bottom show fewer stickers, so the quiz also checks recognizing them by position.
const VISIBLE: Record<Kind, [keyof IsoFaces, number][][]> = {
  Center: [[["u", 4]], [["f", 4]], [["r", 4]]],
  Edge: [
    [
      ["u", 7],
      ["f", 1],
    ],
    [
      ["u", 5],
      ["r", 1],
    ],
    [
      ["f", 5],
      ["r", 3],
    ],
    [["u", 1]],
    [["u", 3]],
    [["f", 3]],
    [["f", 7]],
    [["r", 5]],
    [["r", 7]],
  ],
  Corner: [
    [
      ["u", 8],
      ["f", 2],
      ["r", 0],
    ],
    [
      ["u", 6],
      ["f", 0],
    ],
    [
      ["u", 2],
      ["r", 2],
    ],
    [
      ["f", 8],
      ["r", 6],
    ],
    [["u", 0]],
    [["f", 6]],
    [["r", 8]],
  ],
};
const FACE_COLOR: Record<keyof IsoFaces, string> = { u: "y", f: "g", r: "o" };
const STICKER_COUNT: Record<Kind, number> = { Center: 1, Edge: 2, Corner: 3 };

const EXPLAIN: Record<Kind, string> = {
  Center: "It's the middle of a face — a center, with just one sticker.",
  Edge: "It sits between two centers — an edge, with two stickers.",
  Corner: "It sits where three faces meet — a corner, with three stickers.",
};

const QUESTIONS_PER_ROUND = 10;

function pieceQuestions(): QuizQuestion[] {
  // a few of each kind, then random kinds, never the same piece twice in a row
  const kinds: Kind[] = [...KINDS, ...KINDS, ...KINDS];
  while (kinds.length < QUESTIONS_PER_ROUND)
    kinds.push(KINDS[Math.floor(Math.random() * 3)]);

  let last: unknown;
  return kinds.map((kind) => {
    const options = VISIBLE[kind].filter((p) => p !== last);
    const piece = options[Math.floor(Math.random() * options.length)];
    last = piece;
    const faces = Object.fromEntries(
      (["u", "f", "r"] as const).map((f) => [
        f,
        Array.from({ length: 9 }, (_, i) =>
          piece.some(([pf, pi]) => pf === f && pi === i) ? FACE_COLOR[f] : "l",
        ).join(""),
      ]),
    ) as IsoFaces;
    const hidden = STICKER_COUNT[kind] - piece.length;
    return {
      prompt: "What is this piece?",
      image: <IsoCube faces={faces} className="size-36" />,
      options: KINDS,
      fixedOptions: true,
      answer: kind,
      explain:
        EXPLAIN[kind] +
        (hidden > 0
          ? ` You can only see ${piece.length} here — the other ${hidden === 1 ? "is" : "s are"} on a hidden face.`
          : ""),
    };
  });
}

export function PiecesPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-lg">
          A cube isn't 54 loose stickers — it's 26 pieces, and the stickers on a
          piece always stay together. You solve pieces, not stickers.
        </p>
        <p className="text-muted-foreground">
          There are three kinds of pieces, and every step in this app talks
          about them.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {PIECES.map((p) => (
          <Card key={p.name} size="sm">
            <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <IsoCube faces={p.faces} className="size-28 shrink-0" />
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <h2 className="font-heading text-xl font-semibold">
                    {p.name}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {p.count} pieces · {p.stickers}
                  </span>
                </div>
                <p className="text-sm">{p.text}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold">Quiz yourself</h2>
          <p className="text-sm text-muted-foreground">
            What is this piece — center, edge or corner? 10 questions, new
            pieces every try.
          </p>
        </div>
        <Quiz makeQuestions={pieceQuestions} />
      </section>

      <p className="text-sm text-muted-foreground">
        Next: which colors go where —{" "}
        <Link to="/color-scheme" className="underline">
          Color scheme
        </Link>
        .
      </p>
    </div>
  );
}
