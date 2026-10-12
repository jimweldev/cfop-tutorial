import { MoveDiagram } from "@/components/move-diagram";
import { Link } from "react-router";
import { NotationDrill } from "@/components/notation-drill";
import { Quiz, type QuizQuestion } from "@/components/quiz";
import { Card } from "@/components/ui/card";

type Move = { move: string; name: string; note: string };

const SECTIONS: { title: string; intro: string; moves: Move[] }[] = [
  {
    title: "Face turns",
    intro:
      "Each letter turns one face 90° clockwise — clockwise as if you were looking straight at that face. Hold the cube with yellow on top and green in front.",
    moves: [
      { move: "R", name: "Right", note: "Right face turns up, away from you." },
      { move: "L", name: "Left", note: "Left face turns down, toward you." },
      { move: "U", name: "Up", note: "Top layer turns to the left." },
      { move: "D", name: "Down", note: "Bottom layer turns to the right." },
      { move: "F", name: "Front", note: "Front face turns clockwise." },
      {
        move: "B",
        name: "Back",
        note: "Back face turns clockwise as seen from behind — counter-clockwise from the front.",
      },
    ],
  },
  {
    title: "Prime and double turns",
    intro:
      "A letter alone is a clockwise quarter turn. Add ' or 2 to change it.",
    moves: [
      { move: "R", name: "R", note: "Clockwise quarter turn." },
      {
        move: "R'",
        name: "R prime",
        note: "Counter-clockwise quarter turn — the opposite of R.",
      },
      {
        move: "R2",
        name: "R two",
        note: "Half turn (180°). Either direction works.",
      },
    ],
  },
  {
    title: "Wide turns",
    intro:
      "A lowercase letter (or a w, like Rw) turns the face together with the middle layer next to it.",
    moves: [
      { move: "r", name: "r / Rw", note: "Right two layers turn up." },
      { move: "l", name: "l / Lw", note: "Left two layers turn down." },
      { move: "u", name: "u / Uw", note: "Top two layers turn left." },
      { move: "f", name: "f / Fw", note: "Front two layers turn clockwise." },
    ],
  },
  {
    title: "Slice turns",
    intro: "Turn only a middle layer. Each follows the face it's named after.",
    moves: [
      {
        move: "M",
        name: "Middle",
        note: "Layer between L and R. Turns like L (down).",
      },
      {
        move: "E",
        name: "Equator",
        note: "Layer between U and D. Turns like D (right).",
      },
      {
        move: "S",
        name: "Standing",
        note: "Layer between F and B. Turns like F (clockwise).",
      },
    ],
  },
  {
    title: "Cube rotations",
    intro:
      "Turn the whole cube in your hands. No layers move relative to each other.",
    moves: [
      { move: "x", name: "x", note: "Rotate the whole cube like R." },
      { move: "y", name: "y", note: "Rotate the whole cube like U." },
      { move: "z", name: "z", note: "Rotate the whole cube like F." },
    ],
  },
];

// Moves the quiz can show. Grouped by how they turn, so wrong answers look similar.
// F, f and z (and B' vs S) draw the same from the front, so only one of each is used.
const QUIZ_MOVES: Record<string, string[]> = {
  column: ["R", "R'", "R2", "L", "L'", "M", "M'", "r", "l", "x", "x'"],
  row: ["U", "U'", "U2", "D", "D'", "E", "u", "y", "y'"],
  face: ["F", "F'", "F2", "B"],
};

const shuffled = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

function notationQuestions(): QuizQuestion[] {
  const groups = Object.values(QUIZ_MOVES);
  // 7 diagram questions spread over the groups
  const picks = shuffled(groups.flatMap((g) => shuffled(g).slice(0, 3))).slice(
    0,
    7,
  );

  const diagramQuestions = picks.map((move): QuizQuestion => {
    const group = groups.find((g) => g.includes(move))!;
    return {
      prompt: "Which move is this?",
      image: <MoveDiagram move={move} className="size-28" />,
      options: [move, ...shuffled(group.filter((m) => m !== move)).slice(0, 3)],
      answer: move,
      monoOptions: true,
      explain: `Highlighted stickers turn the way the arrow points: that's ${move}.`,
    };
  });

  return [
    ...diagramQuestions,
    {
      prompt: "What does R' mean?",
      options: [
        "Right face counter-clockwise",
        "Right face clockwise",
        "Right face twice",
        "Right two layers clockwise",
      ],
      answer: "Right face counter-clockwise",
      explain: "The ' (prime) reverses a move: R' undoes R.",
    },
    {
      prompt: "What does R2 mean?",
      options: [
        "Half turn of the right face",
        "Right face counter-clockwise",
        "Right two layers",
        "Rotate the whole cube",
      ],
      answer: "Half turn of the right face",
      explain: "2 means a 180° turn — either direction works.",
    },
    {
      prompt: "What does a lowercase letter like r mean?",
      options: [
        "Turn the face and the middle layer next to it",
        "Turn the face counter-clockwise",
        "Turn only the middle layer",
        "Rotate the whole cube",
      ],
      answer: "Turn the face and the middle layer next to it",
      explain: "Lowercase (or Rw) is a wide turn: two layers at once.",
    },
  ];
}

export function NotationPage() {
  return (
    <div className="flex flex-col gap-10">
      {SECTIONS.map((section) => (
        <section key={section.title} className="flex flex-col gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold">
              {section.title}
            </h2>
            <p className="text-sm text-muted-foreground">{section.intro}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.moves.map((m) => (
              <Card
                key={m.move}
                size="sm"
                className="flex-row items-center gap-4 px-4"
              >
                <MoveDiagram move={m.move} className="size-16 shrink-0" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <code className="font-heading text-2xl font-semibold">
                      {m.move}
                    </code>
                    <span className="text-sm text-muted-foreground">
                      {m.name}
                    </span>
                  </div>
                  <p className="text-sm">{m.note}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}

      <p className="text-sm text-muted-foreground">
        The diagrams show the front of the cube. Highlighted stickers move; the
        arrow shows which way. Dashed arrows mean the turning layer is hidden
        behind the front face.
      </p>
      <p className="text-sm text-muted-foreground">
        Wondering about the parentheses in algorithms? See{" "}
        <Link to="/triggers" className="underline">
          Triggers
        </Link>
        .
      </p>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold">Scramble drill</h2>
          <p className="text-sm text-muted-foreground">
            Hold your solved cube with white on top and green in front — the official way to scramble.
            Do each move, then press → to see what it should look like.
          </p>
        </div>
        <NotationDrill />
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold">Quiz yourself</h2>
          <p className="text-sm text-muted-foreground">
            10 questions: read the diagram and name the move. New moves every
            try.
          </p>
        </div>
        <Quiz makeQuestions={notationQuestions} />
      </section>
    </div>
  );
}
