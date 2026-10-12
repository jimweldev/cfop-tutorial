import { AlgBlock } from "@/components/alg-block";
import { MoveDiagram } from "@/components/move-diagram";
import { Card } from "@/components/ui/card";
import { YouTubeEmbed } from "@/components/youtube-embed";

const GRIP = [
  "Hold the cube with your fingertips, not your palms.",
  "Thumbs rest on the front face, the other fingers on the back.",
  "Keep your index fingers free on top — they do most U turns.",
  "Stay relaxed. A loose grip turns faster than a tight one.",
];

const MOVES = [
  { move: "R", how: "Turn your right wrist up, like turning a doorknob. Don't let go of the cube." },
  { move: "R'", how: "Turn your right wrist back down." },
  { move: "U", how: "Flick the top layer with your right index finger so the front stickers move left." },
  { move: "U'", how: "Flick the top layer with your left index finger so the front stickers move right." },
  { move: "U2", how: "Two right-index flicks in a row, or right index then right middle finger." },
  { move: "F", how: "Pull the top-right of the front face down with your right index finger." },
  { move: "F'", how: "Pull the top-left of the front face down with your left index finger." },
  { move: "D", how: "Pull the bottom layer toward you from the left with your left ring finger." },
  { move: "M", how: "Push the back of the middle layer up with your left ring finger, so the front stickers move down. Used a lot in Ua, Ub, H and Z perms." },
];

const DRILLS = [
  { alg: "R U R' U'", how: "Wrist, right index, wrist back, left index. Do it 6 times in a row — the cube returns to solved." },
  { alg: "R' F R F'", how: "Wrist down, right index pulls F, wrist up, left index pulls F'." },
  { alg: "R U R' U R U2 R'", how: "Sune: the U2 is a double flick with the right index and middle fingers." },
];

export function FingerTricksPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <p className="text-lg">
        Finger tricks are the ways to turn each face without moving your hands around the cube. Good
        finger tricks keep you from stopping to regrip, which is where most time goes.
      </p>

      <div className="flex flex-col gap-2">
        <YouTubeEmbed
          videoId="wLuVF9Dk3AQ"
          title="Rubik's Cube: Finger Tricks Tutorial (Beginner to Advanced) — J Perm"
        />
        <p className="text-xs text-muted-foreground">
          Video: J Perm, "Finger Tricks Tutorial (Beginner to Advanced)".
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">The grip</h2>
        <ul className="flex flex-col gap-2">
          {GRIP.map((g) => (
            <li key={g} className="rounded-2xl bg-muted px-4 py-3 text-sm">
              {g}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold">Turning each face</h2>
          <p className="text-sm text-muted-foreground">
            The most common way to do each move from the grip above.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {MOVES.map((m) => (
            <Card key={m.move} size="sm" className="flex-row items-center gap-4 px-4">
              <MoveDiagram move={m.move} className="size-14 shrink-0" />
              <div>
                <code className="font-heading text-xl font-semibold">{m.move}</code>
                <p className="text-sm">{m.how}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold">Practice drills</h2>
          <p className="text-sm text-muted-foreground">
            Go slowly until each move flows into the next without stopping, then speed up.
          </p>
        </div>
        {DRILLS.map((d) => (
          <div key={d.alg} className="flex flex-col gap-2">
            <AlgBlock alg={d.alg} />
            <p className="px-1 text-sm text-muted-foreground">{d.how}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
