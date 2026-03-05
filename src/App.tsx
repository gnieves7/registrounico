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
import DreamRecord from "./pages/DreamRecord";
import Psychobiography from "./pages/Psychobiography";
import Psychodiagnostic from "./pages/Psychodiagnostic";
import LauraChat from "./pages/LauraChat";
import Sessions from "./pages/Sessions";
import Documents from "./pages/Documents";
import Admin from "./pages/Admin";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import Forensic from "./pages/Forensic";
import AnxietyRecord from "./pages/AnxietyRecord";
import JuntaMedicaLaboral from "./pages/JuntaMedicaLaboral";
import AptoPsicologico from "./pages/AptoPsicologico";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PendingApproval from "./pages/PendingApproval";
import NotFound from "./pages/NotFound";
import CaseFormulation from "./pages/CaseFormulation";
import EmotionalThermometer from "./pages/EmotionalThermometer";
import NarrativeAnalysis from "./pages/NarrativeAnalysis";
import SymptomNetwork from "./pages/SymptomNetwork";
import TherapeuticAlliance from "./pages/TherapeuticAlliance";
import LifeTimeline from "./pages/LifeTimeline";
import MicroTasks from "./pages/MicroTasks";
import OutcomeMonitoring from "./pages/OutcomeMonitoring";

const queryClient = new QueryClient();

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
            <Route path="/pending-approval" element={<PendingApproval />} />
            
            {/* Protected routes with sidebar layout */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/psychobiography" element={<Psychobiography />} />
              <Route path="/psychodiagnostic" element={<Psychodiagnostic />} />
              <Route path="/forensic" element={<Forensic />} />
              <Route path="/anxiety-record" element={<AnxietyRecord />} />
              <Route path="/junta-medica" element={<JuntaMedicaLaboral />} />
              <Route path="/apto-psicologico" element={<AptoPsicologico />} />
              <Route path="/emotional-record" element={<EmotionalRecord />} />
              <Route path="/dream-record" element={<DreamRecord />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/laura" element={<LauraChat />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/professional-profile" element={<ProfessionalProfile />} />
              {/* Admin routes */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/case-formulation" element={<CaseFormulation />} />
              <Route path="/emotional-thermometer" element={<EmotionalThermometer />} />
              <Route path="/narrative-analysis" element={<NarrativeAnalysis />} />
              <Route path="/symptom-network" element={<SymptomNetwork />} />
              <Route path="/therapeutic-alliance" element={<TherapeuticAlliance />} />
              <Route path="/life-timeline" element={<LifeTimeline />} />
              <Route path="/micro-tasks" element={<MicroTasks />} />
              <Route path="/outcome-monitoring" element={<OutcomeMonitoring />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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
