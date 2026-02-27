import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Footer from "./Footer";
import { Menu, ChevronRight } from "lucide-react";

export function AppLayout() {
  const { user, isLoading, isApproved, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || (!isApproved && !isAdmin))) {
      navigate("/login");
    }
  }, [user, isLoading, isApproved, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          {/* Header with trigger */}
          <header className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:h-14 md:gap-4 md:px-4">
            <SidebarTrigger className="-ml-1 relative group">
              <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground md:hidden">
                <ChevronRight className="h-2 w-2" />
              </span>
            </SidebarTrigger>
            <span className="text-xs text-muted-foreground md:hidden">Menú</span>
            <div className="flex-1" />
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
          
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
