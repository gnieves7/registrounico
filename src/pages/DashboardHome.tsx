import { Navigate } from "react-router-dom";

/**
 * El panel profesional se unificó en /admin/dashboard (Workspace clínico).
 * Esta ruta sólo redirige para mantener compatibilidad con enlaces antiguos.
 */
const DashboardHome = () => <Navigate to="/admin/dashboard" replace />;

export default DashboardHome;
