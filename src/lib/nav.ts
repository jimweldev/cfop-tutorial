import type { LucideIcon } from "lucide-react";
import { BookOpen, Box, GraduationCap, Trophy } from "lucide-react";

export type NavItem = { title: string; to: string };
export type NavSection = { title: string; icon: LucideIcon; items: NavItem[] };

export const BEGINNER_STEPS: NavItem[] = [
  { title: "1. White cross", to: "/beginner/cross" },
  { title: "2. First layer corners", to: "/beginner/first-layer" },
  { title: "3. Second layer", to: "/beginner/second-layer" },
  { title: "4. Yellow cross", to: "/beginner/yellow-cross" },
  { title: "5. Yellow edges", to: "/beginner/yellow-edges" },
  { title: "6. Position corners", to: "/beginner/position-corners" },
  { title: "7. Orient corners", to: "/beginner/orient-corners" },
];

export const NAV: NavSection[] = [
  {
    title: "Basics",
    icon: BookOpen,
    items: [
      { title: "Pieces of the cube", to: "/pieces" },
      { title: "Color scheme", to: "/color-scheme" },
      { title: "Notation", to: "/notation" },
      { title: "Triggers", to: "/triggers" },
      { title: "Finger tricks", to: "/finger-tricks" },
    ],
  },
  {
    title: "Beginner's method",
    icon: Box,
    items: BEGINNER_STEPS,
  },
  {
    title: "Beginner CFOP",
    icon: GraduationCap,
    items: [
      { title: "Intuitive F2L", to: "/beginner-cfop/f2l" },
      { title: "2-look OLL", to: "/beginner-cfop/oll" },
      { title: "2-look PLL", to: "/beginner-cfop/pll" },
    ],
  },
  {
    title: "Full CFOP",
    icon: Trophy,
    items: [
      { title: "OLL (57)", to: "/cfop/oll" },
      { title: "PLL (21)", to: "/cfop/pll" },
    ],
  },
];
