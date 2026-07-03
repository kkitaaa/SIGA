import React from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import AdminDashboard from "../../pages/directiva/DirectivaDashboard";
import AdministracionDashboard from "../../pages/directiva/AdministracionDashboard";
import ProfesorDashboard from "../../pages/profesor/ProfesorDashboard";
import FuncionarioDashboard from "../../pages/funcionario/FuncionarioDashboard";
import PieDashboard from "../../pages/pie/PieDashboard";
import PendingRoleDashboard from "../../pages/pending/PendingRoleDashboard";

const dashboardStrategy = {
  administrativo: AdministracionDashboard,
  administrador: AdministracionDashboard,
  profesor: ProfesorDashboard,
  pie: PieDashboard,
  funcionario: FuncionarioDashboard,
  "coordinador pie": PieDashboard,
  directiva: AdminDashboard,
  "coordinador administrativo": AdministracionDashboard,
};

function DashboardRouter() {
  const { user, role } = useCurrentUser();
  const pendingRoles = ["", "sinrol", "sin rol"];
  const normalizedRole = String(role || "").trim().toLowerCase();
  const isPendingRole = pendingRoles.includes(normalizedRole);
  const DashboardComponent = isPendingRole || !dashboardStrategy[normalizedRole]
    ? PendingRoleDashboard
    : dashboardStrategy[normalizedRole];

  if (!DashboardComponent) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Panel no disponible</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {`user: ${JSON.stringify(user, null, 2)}\nrole: ${String(role)}\nnormalizedRole: ${normalizedRole}`}
        </pre>
      </div>
    );
  }

  return <DashboardComponent user={user} />;
}

export default DashboardRouter;
