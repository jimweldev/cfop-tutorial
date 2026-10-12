import { Link, useParams, useSearchParams } from "react-router";
import { ExternalLink } from "lucide-react";
import { AlgText, TriggerNamesToggle } from "@/components/alg-text";
import { CaseDiagram } from "@/components/case-diagram";
import { StatusToggle } from "@/components/status-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { getCase, isAlgSet } from "@/data";
import { openExternal } from "@/lib/open-external";
import { algView, setupForView } from "@/lib/alg-view";
import { cn } from "@/lib/utils";

export function AlgDetailPage() {
  const { set, id } = useParams();
  const [params, setParams] = useSearchParams();
  const algCase = isAlgSet(set) && id ? getCase(set, id) : undefined;

  if (!isAlgSet(set) || !algCase) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Case not found. <Link to="/" className="underline">Go home</Link>
      </p>
    );
  }

  const selected = Math.min(Number(params.get("alg") ?? 0) || 0, algCase.algs.length - 1);
  const alg = algCase.algs[selected];
  const view = algView(alg.alg);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CaseDiagram
            stickers={algCase.stickers}
            arrows={set === "pll"}
            rotate={view.rotate}
            className="size-16"
          />
          <div>
            <h2 className="font-heading text-2xl font-semibold">{algCase.name}</h2>
            <Badge variant="outline">{algCase.group}</Badge>
          </div>
        </div>
        <StatusToggle set={set} id={algCase.id} />
      </div>

      {alg.videoId && <YouTubeEmbed videoId={alg.videoId} title={`${algCase.name} video`} />}

      <Card size="sm">
        <CardHeader>
          <CardTitle>{algCase.algs.length > 1 ? "Algorithms" : "Algorithm"}</CardTitle>
          <CardAction>
            <TriggerNamesToggle />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {algCase.algs.map((a, i) => (
            <button
              key={a.alg}
              disabled={algCase.algs.length === 1}
              onClick={() => setParams(i ? { alg: String(i) } : {}, { replace: true })}
              className={cn(
                "rounded-2xl px-3 py-2 text-left transition-colors enabled:hover:bg-muted",
                i === selected && algCase.algs.length > 1 && "bg-muted",
              )}
            >
              <AlgText alg={algView(a.alg).alg} className="justify-start text-base" />
            </button>
          ))}
          {algCase.algs.length > 1 && (
            <p className="px-3 pt-1 text-xs text-muted-foreground">Tap an alg to watch its video.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-sm text-muted-foreground">
          Practice: from solved (yellow on top), do{" "}
          <code className="text-foreground">{setupForView(algCase.setup, view.rotation)}</code> to get this case.
        </p>
        {alg.videoId && (
          <Button
            variant="outline"
            onClick={() => openExternal(`https://www.youtube.com/watch?v=${alg.videoId}`)}
          >
            <ExternalLink /> Watch on YouTube
          </Button>
        )}
      </div>
    </div>
  );
}
