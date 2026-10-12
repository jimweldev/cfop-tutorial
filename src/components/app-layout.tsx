import { Outlet, useLocation, useMatches, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

// Each route sets `handle: { title }`; the deepest match names the page.
// Detail pages also set `back`: where the back button goes when there's no history.
type Params = Record<string, string | undefined>;
export type RouteHandle = {
  title?: string | ((params: Params) => string);
  back?: (params: Params) => string;
};

export function AppLayout() {
  const matches = useMatches();
  const location = useLocation();
  const navigate = useNavigate();

  const deepest = (key: keyof RouteHandle) =>
    matches
      .map((m) => {
        const value = (m.handle as RouteHandle | undefined)?.[key];
        return typeof value === "function" ? value(m.params) : value;
      })
      .filter(Boolean)
      .at(-1);
  const title = deepest("title");
  const back = deepest("back");

  // "default" key = the first page of this session, so there's nothing to go back to
  const goBack = () => (location.key !== "default" ? navigate(-1) : navigate(back!));

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-muted/40">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/80 px-4 pt-[env(safe-area-inset-top)] backdrop-blur h-[calc(--spacing(14)+env(safe-area-inset-top))]">
            {back ? (
              <Button variant="ghost" size="icon-sm" onClick={goBack} aria-label="Back">
                <ArrowLeft />
              </Button>
            ) : (
              <SidebarTrigger />
            )}
            <h1 className="truncate font-heading font-semibold">{title ?? "CFOP Tutorial"}</h1>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 p-4 pb-[max(--spacing(4),env(safe-area-inset-bottom))] md:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
