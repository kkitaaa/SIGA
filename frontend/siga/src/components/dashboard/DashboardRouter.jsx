import React from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import AdminDashboard from "../../pages/admin/AdminDashboard";
import ProfesorDashboard from "../../pages/profesor/ProfesorDashboard";
import PieDashboard from "../../pages/pie/PieDashboard";
import PendingRoleDashboard from "../../pages/pending/PendingRoleDashboard";

const dashboardStrategy = {
  administrativo: AdminDashboard,
  administrador: AdminDashboard,
  profesor: ProfesorDashboard,
  pie: PieDashboard,
  "equipo pie": PieDashboard,
  "coordinador pie": PieDashboard,
  directiva: AdminDashboard,
  "coordinador administrativo": AdminDashboard,
};

function DashboardRouter() {
  const { user, role } = useCurrentUser();
  const pendingRoles = ["", "sinrol", "sin rol"];
  const isPendingRole = pendingRoles.includes(role);
  const DashboardComponent = isPendingRole || !dashboardStrategy[role]
    ? PendingRoleDashboard
    : dashboardStrategy[role];

  return <DashboardComponent user={user} />;
}

export default DashboardRouter;
