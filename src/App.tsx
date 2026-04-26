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
import DescargarPdf from "./pages/DescargarPdf";
import DiagnosticoAcceso from "./pages/DiagnosticoAcceso";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
                <Route path="/forensic" element={<Forensic />} />
                <Route path="/forensic/:section" element={<Forensic />} />
                <Route path="/judicial-case" element={<JudicialCase />} />
                <Route path="/anxiety-record" element={<PatientOnlyRoute><AnxietyRecord /></PatientOnlyRoute>} />
                <Route path="/junta-medica" element={<JuntaMedicaLaboral />} />
                <Route path="/apto-psicologico" element={<AptoPsicologico />} />
                <Route path="/camara-gesell" element={<CamaraGesell />} />
                <Route path="/notebook" element={<PatientOnlyRoute><Notebook /></PatientOnlyRoute>} />
                <Route path="/dream-record" element={<PatientOnlyRoute><DreamRecord /></PatientOnlyRoute>} />
                <Route path="/sessions" element={<PatientOnlyRoute><Sessions /></PatientOnlyRoute>} />
                <Route path="/laura" element={<PatientOnlyRoute><LauraChat /></PatientOnlyRoute>} />
                <Route path="/documents" element={<PatientOnlyRoute><Documents /></PatientOnlyRoute>} />
                <Route path="/professional-profile" element={<ProfessionalProfile />} />
                <Route path="/symbolic-awards" element={<PatientOnlyRoute><SymbolicAwards /></PatientOnlyRoute>} />
                <Route path="/telegram" element={<TelegramCenter />} />
                {/* Admin routes */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/case-formulation" element={<CaseFormulation />} />
                <Route path="/emotional-thermometer" element={<EmotionalThermometer />} />
                <Route path="/narrative-analysis" element={<NarrativeAnalysis />} />
                <Route path="/symptom-network" element={<SymptomNetwork />} />
                <Route path="/therapeutic-alliance" element={<TherapeuticAlliance />} />
                <Route path="/life-timeline" element={<LifeTimeline />} />
                <Route path="/micro-tasks" element={<MicroTasks />} />
                <Route path="/outcome-monitoring" element={<OutcomeMonitoring />} />
              </Route>
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DemoProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
