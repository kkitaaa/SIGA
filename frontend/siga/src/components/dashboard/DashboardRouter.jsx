import React from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import AdminDashboard from "../../pages/directiva/DirectivaDashboard";
import ProfesorDashboard from "../../pages/profesor/ProfesorDashboard";
import PieDashboard from "../../pages/pie/PieDashboard";
import PendingRoleDashboard from "../../pages/pending/PendingRoleDashboard";

const dashboardStrategy = {
  administrativo: AdminDashboard,
  administrador: AdminDashboard,
  profesor: ProfesorDashboard,
  pie: PieDashboard,
  funcionario: ProfesorDashboard,
  "equipo pie": PieDashboard,
  "coordinador pie": PieDashboard,
  directiva: AdminDashboard,
  "coordinador administrativo": AdminDashboard,
};

function DashboardRouter() {
  const { user, role } = useCurrentUser();
  const pendingRoles = ["", "sinrol", "sin rol"];
  const normalizedRole = String(role || "").trim().toLowerCase();
  const isPendingRole = pendingRoles.includes(normalizedRole);
  const DashboardComponent = isPendingRole || !dashboardStrategy[normalizedRole]
    ? PendingRoleDashboard
    : dashboardStrategy[normalizedRole];

  return <DashboardComponent user={user} />;
}

export default DashboardRouter;
