import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./middleware/ProtectedRoute";

// Auth
import Login from "./pages/login";

// General
import DashboardRouter from "./components/dashboard/DashboardRouter";

// Documentos
import DocumentosPage from "./pages/documentos/DocumentosPage";

// Roles
import UsuariosPage from "./pages/usuarios/UsuariosPage";



// Directiva
import AsignacionRoles from "./pages/directiva/AsignacionRoles";





// PIE
import PieDashboard from "./pages/pie/PieDashboard";
import AsignacionPIEPage from "./pages/pie/AsignacionPIEPage";
import EstudiantesPIEPage from "./pages/pie/EstudiantesNEEPage";

function App() {

  return (
    <Routes>

      {/* 🔓 Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/documentos" element={<DocumentosPage />} />

      {/* 🏠 Home general */}
      <Route
        path="/home"
        element={
          <ProtectedRoute rolesPermitidos={[
            "Directiva",
            "Administracion",
            "Equipo PIE",
            "PIE",
            "Profesor",
            "Funcionario",
            "Coordinador PIE",
            "Coordinador Administrativo"
          ]}>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />

      {/* 👤 Usuarios */}
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute rolesPermitidos={["Directiva", "Administrativo", "Coordinador Administrativo"]}>
            <UsuariosPage />
          </ProtectedRoute>
        }
      />

      {/* 🏢 Directiva */}
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
          <ProtectedRoute rolesPermitidos={["Equipo PIE", "PIE"]}>
            <PieDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pie/estudiantes"
        element={
          <ProtectedRoute rolesPermitidos={["Equipo PIE", "PIE", "Coordinador PIE", "Directiva"]}>
            <EstudiantesPIEPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/asignacion-pie"
        element={
          <ProtectedRoute rolesPermitidos={["Equipo PIE", "PIE", "Coordinador PIE"]}>
            <AsignacionPIEPage />
          </ProtectedRoute>
        }
      />

    {/*
      <Route
        path="/profesores"
        element={
          <ProtectedRoute rolesPermitidos={["Profesor"]}>
            <ProfesoresDashboard />
          </ProtectedRoute>
        }
      />
      */}

      {/* 🚫 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;