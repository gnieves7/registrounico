import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/hooks/useDemoMode";

/**
 * Entry point for demo mode — sets the flag and redirects to the dashboard.
 */
export default function DemoEntry() {
  const { enterDemoMode } = useDemoMode();
  const navigate = useNavigate();

  useEffect(() => {
    // Set a default area so the sidebar renders properly
    sessionStorage.setItem("user_area", "reflexionar");
    enterDemoMode();
    navigate("/dashboard", { replace: true });
  }, [enterDemoMode, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="animate-pulse text-primary">Preparando demostración…</div>
    </div>
  );
}
