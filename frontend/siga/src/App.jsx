import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./middleware/ProtectedRoute";

// Auth
import Login from "./pages/login";

// General
import Home from "./pages/home";

// Roles
import AsignacionRoles from "./pages/asignacion_roles";

// PIE
import PieDashboard from "./pages/home_pie";
import ProfesoresDashboard from "./pages/home_profesores";
import AsignacionPIEPage from "./pages/asignacion_PIE";

function App() {
  return (
    <Routes>

      {/* 🔓 Públicas */}
      <Route path="/" element={<Login />} />

      {/* 🏠 Home general */}
      <Route
        path="/home"
        element={
          <ProtectedRoute rolesPermitidos={[
            "Directiva",
            "Administracion",
            "Equipo PIE",
            "Profesor",
            "Funcionario",
            "Coordinador PIE",
            "Coordinador Administrativo"
          ]}>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* 👤 Roles */}
      <Route
        path="/asignacion-roles"
        element={
          <ProtectedRoute rolesPermitidos={["Directiva"]}>
            <AsignacionRoles />
          </ProtectedRoute>
        }
      />

      {/* 🧩 PIE */}
      <Route
        path="/pie"
        element={
          <ProtectedRoute rolesPermitidos={["Equipo PIE"]}>
            <PieDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/asignacion-pie"
        element={
          <ProtectedRoute rolesPermitidos={["Equipo PIE", "Coordinador PIE"]}>
            <AsignacionPIEPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profesores"
        element={
          <ProtectedRoute rolesPermitidos={["Profesor"]}>
            <ProfesoresDashboard />
          </ProtectedRoute>
        }
      />

      {/* 🚫 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;