import { Repeat } from "lucide-react";

/** An algorithm to perform, shown large, with an optional repeat instruction. */
export function AlgBlock({ alg, repeat }: { alg: string; repeat?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-muted px-4 py-3">
      <code className="font-heading text-xl font-semibold tracking-wide">{alg}</code>
      {repeat && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Repeat className="size-3.5" /> {repeat}
        </p>
      )}
    </div>
  );
}
