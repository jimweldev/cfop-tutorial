import { Link } from "react-router";
import { SearchX } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center text-muted-foreground">
      <SearchX className="size-10" />
      <p>
        This page doesn't exist. <Link to="/" className="underline">Go home</Link>
      </p>
    </div>
  );
}
