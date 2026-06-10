import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { DemoProvider } from "@/hooks/useDemoMode";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import DashboardHome from "./pages/DashboardHome";
import Notebook from "./pages/Notebook";
import DreamRecord from "./pages/DreamRecord";
import Psychobiography from "./pages/Psychobiography";
import Psychodiagnostic from "./pages/Psychodiagnostic";
import LauraChat from "./pages/LauraChat";
import Sessions from "./pages/Sessions";
import Documents from "./pages/Documents";

import ProfessionalProfile from "./pages/ProfessionalProfile";
import Forensic from "./pages/Forensic";
import JudicialCase from "./pages/JudicialCase";
import AnxietyRecord from "./pages/AnxietyRecord";
import JuntaMedicaLaboral from "./pages/JuntaMedicaLaboral";
import AptoPsicologico from "./pages/AptoPsicologico";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import CaseFormulation from "./pages/CaseFormulation";
import EmotionalThermometer from "./pages/EmotionalThermometer";
import NarrativeAnalysis from "./pages/NarrativeAnalysis";
import SymptomNetwork from "./pages/SymptomNetwork";
import TherapeuticAlliance from "./pages/TherapeuticAlliance";
import LifeTimeline from "./pages/LifeTimeline";
import MicroTasks from "./pages/MicroTasks";
import OutcomeMonitoring from "./pages/OutcomeMonitoring";
import CamaraGesell from "./pages/CamaraGesell";
import SymbolicAwards from "./pages/SymbolicAwards";
import TelegramCenter from "./pages/TelegramCenter";
import AdminDashboard from "./pages/AdminDashboard";
import DemoEntry from "./pages/DemoEntry";
import { ProfessionalAccessGate } from "@/components/professional/ProfessionalAccessGate";
import { ProfessionalOnlyRoute } from "@/components/professional/ProfessionalOnlyRoute";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ReflexionarInformedConsent from "./pages/ReflexionarInformedConsent";
import EvaluarInformedConsent from "./pages/EvaluarInformedConsent";
import Suggestions from "./pages/Suggestions";
import SimplePanel from "./pages/SimplePanel";
import PatientWorkspace from "./pages/PatientWorkspace";
import SchoolSelection from "./pages/SchoolSelection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
   <ErrorBoundary>
    <AuthProvider>
      <DemoProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              {/* Compatibilidad: rutas antiguas redirigen al login unificado */}
              <Route path="/profesional" element={<Navigate to="/login" replace />} />
              <Route path="/profesional/login" element={<Navigate to="/login" replace />} />
              <Route path="/profesional/registro" element={<Navigate to="/login" replace />} />
              <Route path="/profesional/consentimiento" element={<Navigate to="/login" replace />} />
              <Route path="/profesional/suscripcion" element={<Navigate to="/login" replace />} />
              <Route path="/pending-approval" element={<Navigate to="/login" replace />} />
              <Route path="/demo" element={<DemoEntry />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              {/* Protected routes — solo profesionales aprobados o admin */}
              <Route element={<ProfessionalAccessGate><AppLayout /></ProfessionalAccessGate>}>
                <Route path="/profesional/escuela" element={<SchoolSelection />} />
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/psychobiography" element={<ProfessionalOnlyRoute><Psychobiography /></ProfessionalOnlyRoute>} />
                <Route path="/psychodiagnostic" element={<ProfessionalOnlyRoute><Psychodiagnostic /></ProfessionalOnlyRoute>} />
                <Route path="/reflexionar/informed-consent" element={<ProfessionalOnlyRoute><ReflexionarInformedConsent /></ProfessionalOnlyRoute>} />
                <Route path="/evaluar/informed-consent" element={<ProfessionalOnlyRoute><EvaluarInformedConsent /></ProfessionalOnlyRoute>} />
                <Route path="/forensic" element={<ProfessionalOnlyRoute><Forensic /></ProfessionalOnlyRoute>} />
                <Route path="/forensic/:section" element={<ProfessionalOnlyRoute><Forensic /></ProfessionalOnlyRoute>} />
                <Route path="/judicial-case" element={<ProfessionalOnlyRoute><JudicialCase /></ProfessionalOnlyRoute>} />
                <Route path="/anxiety-record" element={<ProfessionalOnlyRoute><AnxietyRecord /></ProfessionalOnlyRoute>} />
                <Route path="/junta-medica" element={<ProfessionalOnlyRoute><JuntaMedicaLaboral /></ProfessionalOnlyRoute>} />
                <Route path="/apto-psicologico" element={<ProfessionalOnlyRoute><AptoPsicologico /></ProfessionalOnlyRoute>} />
                <Route path="/camara-gesell" element={<ProfessionalOnlyRoute><CamaraGesell /></ProfessionalOnlyRoute>} />
                <Route path="/notebook" element={<ProfessionalOnlyRoute><Notebook /></ProfessionalOnlyRoute>} />
                <Route path="/dream-record" element={<ProfessionalOnlyRoute><DreamRecord /></ProfessionalOnlyRoute>} />
                <Route path="/sessions" element={<ProfessionalOnlyRoute><Sessions /></ProfessionalOnlyRoute>} />
                <Route path="/laura" element={<ProfessionalOnlyRoute><LauraChat /></ProfessionalOnlyRoute>} />
                <Route path="/documents" element={<ProfessionalOnlyRoute><Documents /></ProfessionalOnlyRoute>} />
                <Route path="/professional-profile" element={<ProfessionalOnlyRoute><ProfessionalProfile /></ProfessionalOnlyRoute>} />
                <Route path="/symbolic-awards" element={<ProfessionalOnlyRoute><SymbolicAwards /></ProfessionalOnlyRoute>} />
                <Route path="/telegram" element={<ProfessionalOnlyRoute><TelegramCenter /></ProfessionalOnlyRoute>} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                <Route path="/admin/patient/:id" element={<AdminGuard><PatientWorkspace /></AdminGuard>} />
                <Route path="/case-formulation" element={<ProfessionalOnlyRoute><CaseFormulation /></ProfessionalOnlyRoute>} />
                <Route path="/emotional-thermometer" element={<ProfessionalOnlyRoute><EmotionalThermometer /></ProfessionalOnlyRoute>} />
                <Route path="/narrative-analysis" element={<ProfessionalOnlyRoute><NarrativeAnalysis /></ProfessionalOnlyRoute>} />
                <Route path="/symptom-network" element={<ProfessionalOnlyRoute><SymptomNetwork /></ProfessionalOnlyRoute>} />
                <Route path="/therapeutic-alliance" element={<ProfessionalOnlyRoute><TherapeuticAlliance /></ProfessionalOnlyRoute>} />
                <Route path="/life-timeline" element={<ProfessionalOnlyRoute><LifeTimeline /></ProfessionalOnlyRoute>} />
                <Route path="/micro-tasks" element={<ProfessionalOnlyRoute><MicroTasks /></ProfessionalOnlyRoute>} />
                <Route path="/outcome-monitoring" element={<ProfessionalOnlyRoute><OutcomeMonitoring /></ProfessionalOnlyRoute>} />
                <Route path="/suggestions" element={<ProfessionalOnlyRoute><Suggestions /></ProfessionalOnlyRoute>} />
                <Route path="/panel" element={<ProfessionalOnlyRoute><SimplePanel /></ProfessionalOnlyRoute>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DemoProvider>
    </AuthProvider>
   </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
