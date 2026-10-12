import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NAV } from "@/lib/nav";

const DESCRIPTIONS: Record<string, string> = {
  Basics: "Know the pieces, read moves like R, U' and F2, and learn the finger tricks.",
  "Beginner's method": "Solve the whole cube layer by layer with a handful of moves.",
  "Beginner CFOP": "Intuitive F2L, then the last layer in two looks with 16 algorithms.",
  "Full CFOP": "All 57 OLL and 21 PLL cases for a one-look last layer.",
};

export function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold">Pick where to start</h2>
        <p className="text-muted-foreground">
          New to cubing? Go top to bottom. Already solving? Jump to CFOP.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {NAV.map((section) => (
          <Link key={section.title} to={section.items[0].to} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-lg">
              <CardHeader>
                <section.icon className="mb-2 size-6 text-primary-foreground" />
                <CardTitle className="flex items-center justify-between">
                  {section.title}
                  <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardTitle>
                <CardDescription>{DESCRIPTIONS[section.title]}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
