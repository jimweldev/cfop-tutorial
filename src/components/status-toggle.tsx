import { BookOpen, Check, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { algKey, useProgress, type AlgStatus } from "@/stores/progress";

const NONE = "none";

export function StatusToggle({ set, id }: { set: string; id: string }) {
  const key = algKey(set, id);
  const status = useProgress((s) => s.statuses[key]);
  const setStatus = useProgress((s) => s.setStatus);

  return (
    <ToggleGroup
      variant="outline"
      spacing={0}
      className="w-full sm:w-fit"
      value={[status ?? NONE]}
      onValueChange={(value) => {
        // ignore deselecting the active item; always keep one selected
        const next = value[0];
        if (next) setStatus(key, next === NONE ? null : (next as AlgStatus));
      }}
    >
      <ToggleGroupItem value={NONE} className="flex-1 sm:flex-none">
        <Circle /> Not started
      </ToggleGroupItem>
      <ToggleGroupItem value="learning" className="flex-1 sm:flex-none">
        <BookOpen /> Learning
      </ToggleGroupItem>
      <ToggleGroupItem value="learned" className="flex-1 sm:flex-none">
        <Check /> Learned
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function StatusBadge({ status }: { status?: AlgStatus }) {
  if (status === "learned")
    return (
      <Badge className="bg-emerald-500 text-white">
        <Check /> Learned
      </Badge>
    );
  if (status === "learning")
    return (
      <Badge className="bg-amber-500 text-white">
        <BookOpen /> Learning
      </Badge>
    );
  return null;
}
