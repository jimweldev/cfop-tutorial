import { Fragment } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { splitTriggers } from "@/lib/triggers";
import { cn } from "@/lib/utils";
import { useSettings } from "@/stores/settings";

/** An alg, shown with trigger names ("Sexy move") when that setting is on. */
export function AlgText({ alg, className }: { alg: string; className?: string }) {
  const triggerNames = useSettings((s) => s.triggerNames);
  if (!triggerNames) return <code className={className}>{alg}</code>;

  return (
    <code className={cn("inline-flex flex-wrap items-center justify-center gap-1", className)}>
      {splitTriggers(alg).map((part, i) => (
        <Fragment key={i}>
          {"moves" in part ? (
            <span>{part.moves}</span>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="cursor-help rounded bg-primary px-1 font-sans text-[0.8em] leading-snug font-medium text-primary-foreground" />
                }
              >
                {part.trigger.name}
              </TooltipTrigger>
              <TooltipContent>
                <code>{part.trigger.alg}</code>
              </TooltipContent>
            </Tooltip>
          )}
        </Fragment>
      ))}
    </code>
  );
}

export function TriggerNamesToggle() {
  const triggerNames = useSettings((s) => s.triggerNames);
  const setTriggerNames = useSettings((s) => s.setTriggerNames);

  return (
    <Label className="flex cursor-pointer items-center gap-2 text-sm font-normal">
      <Switch checked={triggerNames} onCheckedChange={setTriggerNames} />
      Show trigger names
    </Label>
  );
}
