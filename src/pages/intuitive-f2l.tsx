import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { AlgBlock } from "@/components/alg-block";
import { CaseCard } from "@/components/case-card";
import { Button } from "@/components/ui/button";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { F2L } from "@/data/f2l";
import type { F2LCategory } from "@/data/types";

// Grouping and every alg below were checked on a simulated cube (see scripts/scrape-speedcubedb.mjs).
const CATEGORIES: {
  category: F2LCategory;
  title: string;
  recognize: string;
  idea: string;
  finish?: { alg: string; label: string }[];
}[] = [
  {
    category: "same",
    title: "1. Same color on top",
    recognize: "The corner's top sticker and the edge's top sticker are the same color.",
    idea: "These two pieces need to be joined. Bring the edge next to the corner so their colors line up into a pair, then insert the pair into the slot.",
    finish: [
      { alg: "U R U' R'", label: "pair from the right (F2L 1)" },
      { alg: "F R' F' R", label: "pair from the front (F2L 2)" },
    ],
  },
  {
    category: "different",
    title: "2. Different colors on top",
    recognize: "The corner's top sticker and the edge's top sticker are different colors.",
    idea: "These two pieces need to be split apart. Put the corner above the slot and the edge on the far side of the top layer — then one short move inserts both. If they're stuck together, separate them first.",
    finish: [
      { alg: "R U R'", label: "edge at the back (F2L 4)" },
      { alg: "F' U' F", label: "edge on the left (F2L 3)" },
    ],
  },
  {
    category: "white-top",
    title: "3. White on top",
    recognize: "The corner's white sticker faces up.",
    idea: "Turn the corner so white faces the side first. With the corner above the slot, do one of the moves below. Now it's a 'same color' or 'different colors' case — solve it like above.",
    finish: [
      { alg: "R U2 R'", label: "edge anywhere except the left" },
      { alg: "F' U2 F", label: "edge on the left of the top layer" },
    ],
  },
];

export function IntuitiveF2LPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        <p className="text-lg">
          F2L (First Two Layers) replaces beginner steps 2 and 3. Instead of placing a white corner
          and then a middle edge, you pair each corner with its edge in the top layer and insert them
          together.
        </p>
        <p className="text-muted-foreground">
          Start with the white cross on the bottom. Find a white corner and its matching edge in the
          top layer, and hold the cube so their slot is at front-right. Then look at the corner's
          top sticker: it tells you which of the three cases you have.
        </p>
        <YouTubeEmbed
          videoId="Ar_Zit1VLG0"
          title="Learn F2L in 6 minutes (Full Intuitive F2L Tutorial) — J Perm"
          className="mt-2"
        />
        <p className="text-xs text-muted-foreground">Video: J Perm, "Learn F2L in 6 minutes".</p>
      </div>

      {CATEGORIES.map((c) => (
        <section key={c.category} className="flex flex-col gap-4">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
            <h2 className="font-heading text-xl font-semibold">{c.title}</h2>
            <p className="font-medium">{c.recognize}</p>
            <p className="text-muted-foreground">{c.idea}</p>
            {c.finish && (
              <div className="grid gap-2 sm:grid-cols-2">
                {c.finish.map((f) => (
                  <div key={f.alg} className="flex flex-col gap-1">
                    <AlgBlock alg={f.alg} />
                    <p className="px-1 text-xs text-muted-foreground">{f.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {F2L.filter((f) => f.category === c.category).map((f) => (
              <CaseCard key={f.id} set="f2l" algCase={f} />
            ))}
          </div>
        </section>
      ))}

      <p className="mx-auto max-w-3xl text-sm text-muted-foreground">
        Pieces stuck in a wrong slot? Hold that slot at front-right and do R U R' to lift them into
        the top layer, then solve them as one of the cases above. Each R or F you use to lift a slot
        must be undone later, or the cross breaks — only U turns are free.
      </p>

      <div className="flex justify-end">
        <Button nativeButton={false} render={<Link to="/beginner-cfop/oll" />}>
          Next: 2-look OLL <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
