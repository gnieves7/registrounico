import { useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDemoMode } from "@/hooks/useDemoMode";
import { applySystemTheme, getStoredSystemArea } from "@/lib/systemBranding";
import { toast } from "@/hooks/use-toast";
import { DemoBanner } from "./DemoBanner";
import { IdleTimeoutGuard } from "./IdleTimeoutGuard";
import { MacShell } from "@/components/macos/MacShell";

export function AppLayout() {
  const { user, isLoading, isApproved, isAdmin, profile } = useAuth();
  const { isDemoMode } = useDemoMode();
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isDemoMode) return;
    if (!isLoading && !user) {
      navigate("/login");
    } else if (!isLoading && user && !isAdmin && !isApproved) {
      navigate("/pending-approval");
    }
  }, [user, isLoading, isApproved, isAdmin, navigate, isDemoMode]);

  // Welcome toast — once per session
  useEffect(() => {
    if (isDemoMode) return;
    if (!user || !profile?.full_name) return;
    const key = "psi_welcome_shown";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    const firstName = profile.full_name.split(" ")[0];
    toast({
      title: `¡Un gusto saludarte, ${firstName}!`,
      description: "Bienvenido/a a Mi Práctica · PSI",
    });
  }, [user, profile, isDemoMode]);

  // Apply theme: instant on first render, smooth on route changes
  useEffect(() => {
    const area = getStoredSystemArea();
    if (isFirstRender.current) {
      applySystemTheme(area, false);
      isFirstRender.current = false;
    } else {
      applySystemTheme(area, true);
    }
  }, [location.pathname]);

  // Restore dark mode preference
  useEffect(() => {
    try {
      const pref = localStorage.getItem("psi_theme");
      if (pref === "dark") document.documentElement.classList.add("dark");
    } catch {}
  }, []);

  if (!isDemoMode && isLoading) {
    return (
      <div className="mac-lockscreen flex min-h-screen items-center justify-center">
        <div className="animate-pulse font-serif text-2xl text-[var(--mac-cream)]">.PSI.</div>
      </div>
    );
  }

  if (!isDemoMode && !user) return null;

  return (
    <>
      <DemoBanner />
      <MacShell>
        <Outlet />
      </MacShell>
      <IdleTimeoutGuard />
    </>
  );
}
