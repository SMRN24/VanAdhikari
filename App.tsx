import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { BrandLoader } from "./components/BrandLoader";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Landing from "./pages/Landing";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function RouteTransition() {
  const [location] = useLocation();
  const previousLocation = useRef(location);
  const [visible, setVisible] = useState(() => window.sessionStorage.getItem("vanadhikar-route-transition") === "1");

  useEffect(() => {
    window.sessionStorage.removeItem("vanadhikar-route-transition");
    const handleInternalNavigation = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.origin !== window.location.origin) return;
      window.sessionStorage.setItem("vanadhikar-route-transition", "1");
    };
    document.addEventListener("click", handleInternalNavigation);
    return () => document.removeEventListener("click", handleInternalNavigation);
  }, []);

  useEffect(() => {
    if (!visible || previousLocation.current !== location) return;
    const timer = window.setTimeout(() => setVisible(false), 560);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (previousLocation.current === location) return;
    previousLocation.current = location;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 560);
    return () => window.clearTimeout(timer);
  }, [location]);

  if (!visible) return null;
  return (
    <div className="route-transition" role="status" aria-label="Opening VanAdhikar workspace">
      <div className="route-transition-scene" aria-hidden="true">
        <svg className="transition-tree" viewBox="0 0 120 140" fill="none">
          <path d="M57 122C59 103 58 82 58 61" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <path d="M59 83L39 68M58 73L78 53M58 61L46 42M59 58L68 33" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M59 22C49 9 29 15 32 31C18 30 14 48 27 54C22 67 38 76 49 67C56 80 73 75 75 62C90 66 98 48 86 40C94 27 78 14 67 23C66 11 52 8 59 22Z" fill="currentColor" opacity=".82" />
          <path d="M57 122H72" stroke="#d59c4a" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <BrandLoader size="lg" label="Opening page" />
      </div>
      <strong>Opening workspace</strong>
      <span>Following the field signal…</span>
    </div>
  );
}

function SiteScrollMotion() {
  const [location] = useLocation();
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".app-shell .intro-row, .app-shell .demo-route, .app-shell .kpi-strip, .app-shell .workspace-grid, .app-shell .lower-grid, .app-shell .state-panel, .app-shell .page-footer"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    items.forEach((item) => item.classList.add("site-reveal"));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [location]);
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <RouteTransition />
          <SiteScrollMotion />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
