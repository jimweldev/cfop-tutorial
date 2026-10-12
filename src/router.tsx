import { createHashRouter } from "react-router";
import { AppLayout, type RouteHandle } from "@/components/app-layout";
import { BEGINNER_STEPS } from "@/lib/nav";
import { HomePage } from "@/pages/home";
import { NotationPage } from "@/pages/notation";
import { PiecesPage } from "@/pages/pieces";
import { ColorSchemePage } from "@/pages/color-scheme";
import { NotFoundPage } from "@/pages/not-found";
import { BeginnerStepPage } from "@/pages/beginner-step";
import { FingerTricksPage } from "@/pages/finger-tricks";
import { IntuitiveF2LPage } from "@/pages/intuitive-f2l";
import { TriggersPage } from "@/pages/triggers";
import { AlgDetailPage } from "@/pages/alg-detail";
import { AlgSetPage } from "@/pages/alg-set";
import { TwoLookPage } from "@/pages/two-look";
import { getCase, isAlgSet } from "@/data";
import { TWO_LOOK_OLL, TWO_LOOK_PLL } from "@/data/two-look";

const handle = (title: RouteHandle["title"], back?: RouteHandle["back"]): RouteHandle => ({
  title,
  back,
});

// case pages fall back to their set's page when opened without history
const SET_PAGE: Record<string, string> = { oll: "/cfop/oll", pll: "/cfop/pll", f2l: "/beginner-cfop/f2l" };

// Hash routing: Tauri serves the app from a custom protocol, so a reload on a
// deep path can't rely on server-side fallback to index.html.
export const router = createHashRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "pieces", element: <PiecesPage />, handle: handle("Pieces of the cube") },
      { path: "color-scheme", element: <ColorSchemePage />, handle: handle("Color scheme") },
      { path: "notation", element: <NotationPage />, handle: handle("Notation") },
      { path: "triggers", element: <TriggersPage />, handle: handle("Triggers") },
      { path: "finger-tricks", element: <FingerTricksPage />, handle: handle("Finger tricks") },
      {
        path: "beginner/:step",
        element: <BeginnerStepPage />,
        handle: handle(
          ({ step }) =>
            BEGINNER_STEPS.find((s) => s.to === `/beginner/${step}`)?.title ?? "Beginner's method",
        ),
      },
      { path: "beginner-cfop/f2l", element: <IntuitiveF2LPage />, handle: handle("Intuitive F2L") },
      {
        path: "beginner-cfop/oll",
        element: (
          <TwoLookPage
            title="2-look OLL"
            intro="Orient the last layer in two looks: first the edges, then the corners. 10 algorithms instead of 57."
            steps={TWO_LOOK_OLL}
          />
        ),
        handle: handle("2-look OLL"),
      },
      {
        path: "beginner-cfop/pll",
        element: (
          <TwoLookPage
            title="2-look PLL"
            intro="Permute the last layer in two looks: first the corners, then the edges. 6 algorithms instead of 21."
            steps={TWO_LOOK_PLL}
          />
        ),
        handle: handle("2-look PLL"),
      },
      { path: "cfop/oll", element: <AlgSetPage set="oll" />, handle: handle("OLL") },
      { path: "cfop/pll", element: <AlgSetPage set="pll" />, handle: handle("PLL") },
      {
        path: "alg/:set/:id",
        element: <AlgDetailPage />,
        handle: handle(
          ({ set, id }) => (isAlgSet(set) && id ? (getCase(set, id)?.name ?? "Case") : "Case"),
          ({ set }) => SET_PAGE[set ?? ""] ?? "/",
        ),
      },
      { path: "*", element: <NotFoundPage />, handle: handle("Not found") },
    ],
  },
]);
