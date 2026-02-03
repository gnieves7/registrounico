import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import DashboardHome from "./pages/DashboardHome";
import EmotionalRecord from "./pages/EmotionalRecord";
import Psychobiography from "./pages/Psychobiography";
import LauraChat from "./pages/LauraChat";
import Sessions from "./pages/Sessions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Placeholder pages for routes not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="container mx-auto flex h-[50vh] items-center justify-center px-4">
    <div className="text-center">
      <h1 className="font-serif text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">Esta sección estará disponible próximamente</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes with sidebar layout */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/psychobiography" element={<Psychobiography />} />
              <Route path="/emotional-record" element={<EmotionalRecord />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/laura" element={<LauraChat />} />
              <Route path="/documents" element={<PlaceholderPage title="Mis Documentos" />} />
              {/* Admin routes */}
              <Route path="/admin" element={<PlaceholderPage title="Panel de Administración" />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
