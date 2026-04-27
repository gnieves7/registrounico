import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { DemoProvider } from "@/hooks/useDemoMode";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import ProfessionalLanding from "./pages/ProfessionalLanding";
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
import PatientPrivacy from "./pages/PatientPrivacy";
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
import CamaraGesell from "./pages/CamaraGesell";
import SymbolicAwards from "./pages/SymbolicAwards";
import TelegramCenter from "./pages/TelegramCenter";
import AdminDashboard from "./pages/AdminDashboard";
import DemoEntry from "./pages/DemoEntry";
import ProfessionalRegistration from "./pages/ProfessionalRegistration";
import ProfessionalLogin from "./pages/ProfessionalLogin";
import { ProfessionalAccessGate } from "@/components/professional/ProfessionalAccessGate";
import { PatientOnlyRoute } from "@/components/professional/PatientOnlyRoute";
import { ProfessionalOnlyRoute } from "@/components/professional/ProfessionalOnlyRoute";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import DescargarPdf from "./pages/DescargarPdf";
import DiagnosticoAcceso from "./pages/DiagnosticoAcceso";

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
              <Route path="/profesional" element={<ProfessionalLanding />} />
              <Route path="/pending-approval" element={<PendingApproval />} />
              <Route path="/demo" element={<DemoEntry />} />
              <Route path="/profesional/registro" element={<ProfessionalRegistration />} />
              <Route path="/profesional/consentimiento" element={<ProfessionalRegistration />} />
              <Route path="/profesional/login" element={<ProfessionalLogin />} />
              <Route path="/profesional/suscripcion" element={<ProfessionalAccessGate><Navigate to="/dashboard" replace /></ProfessionalAccessGate>} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/paciente/privacidad" element={<PatientPrivacy />} />
              <Route path="/descargar" element={<DescargarPdf />} />
              <Route path="/diagnostico-acceso" element={<DiagnosticoAcceso />} />
              
              {/* Protected routes with sidebar layout */}

              <Route element={<ProfessionalAccessGate><AppLayout /></ProfessionalAccessGate>}>
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/psychobiography" element={<Psychobiography />} />
                <Route path="/psychodiagnostic" element={<Psychodiagnostic />} />
                <Route path="/forensic" element={<ProfessionalOnlyRoute><Forensic /></ProfessionalOnlyRoute>} />
                <Route path="/forensic/:section" element={<ProfessionalOnlyRoute><Forensic /></ProfessionalOnlyRoute>} />
                <Route path="/judicial-case" element={<ProfessionalOnlyRoute><JudicialCase /></ProfessionalOnlyRoute>} />
                <Route path="/anxiety-record" element={<PatientOnlyRoute><AnxietyRecord /></PatientOnlyRoute>} />
                <Route path="/junta-medica" element={<ProfessionalOnlyRoute><JuntaMedicaLaboral /></ProfessionalOnlyRoute>} />
                <Route path="/apto-psicologico" element={<ProfessionalOnlyRoute><AptoPsicologico /></ProfessionalOnlyRoute>} />
                <Route path="/camara-gesell" element={<ProfessionalOnlyRoute><CamaraGesell /></ProfessionalOnlyRoute>} />
                <Route path="/notebook" element={<PatientOnlyRoute><Notebook /></PatientOnlyRoute>} />
                <Route path="/dream-record" element={<PatientOnlyRoute><DreamRecord /></PatientOnlyRoute>} />
                <Route path="/sessions" element={<PatientOnlyRoute><Sessions /></PatientOnlyRoute>} />
                <Route path="/laura" element={<PatientOnlyRoute><LauraChat /></PatientOnlyRoute>} />
                <Route path="/documents" element={<PatientOnlyRoute><Documents /></PatientOnlyRoute>} />
                <Route path="/professional-profile" element={<ProfessionalOnlyRoute><ProfessionalProfile /></ProfessionalOnlyRoute>} />
                <Route path="/symbolic-awards" element={<PatientOnlyRoute><SymbolicAwards /></PatientOnlyRoute>} />
                <Route path="/telegram" element={<ProfessionalOnlyRoute><TelegramCenter /></ProfessionalOnlyRoute>} />
                {/* Admin routes */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                <Route path="/case-formulation" element={<ProfessionalOnlyRoute><CaseFormulation /></ProfessionalOnlyRoute>} />
                <Route path="/emotional-thermometer" element={<PatientOnlyRoute><EmotionalThermometer /></PatientOnlyRoute>} />
                <Route path="/narrative-analysis" element={<ProfessionalOnlyRoute><NarrativeAnalysis /></ProfessionalOnlyRoute>} />
                <Route path="/symptom-network" element={<ProfessionalOnlyRoute><SymptomNetwork /></ProfessionalOnlyRoute>} />
                <Route path="/therapeutic-alliance" element={<ProfessionalOnlyRoute><TherapeuticAlliance /></ProfessionalOnlyRoute>} />
                <Route path="/life-timeline" element={<ProfessionalOnlyRoute><LifeTimeline /></ProfessionalOnlyRoute>} />
                <Route path="/micro-tasks" element={<ProfessionalOnlyRoute><MicroTasks /></ProfessionalOnlyRoute>} />
                <Route path="/outcome-monitoring" element={<ProfessionalOnlyRoute><OutcomeMonitoring /></ProfessionalOnlyRoute>} />
              </Route>
              
              {/* Catch-all */}
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
