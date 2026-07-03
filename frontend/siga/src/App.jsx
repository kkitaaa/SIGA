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

//Estudiantes
import EstudiantesPage from "./pages/estudiantes/EstudiantesPage";
import EstudianteDetallePage from "./pages/estudiantes/EstudianteDetallePage";

// Directiva
import AsignacionRoles from "./pages/directiva/AsignacionRoles";

// Cursos
import CursoDetallePage from "./pages/cursos/CursoDetallePage";
import CursosPage from "./pages/cursos/CursosPage";

//Profesores
import ProfesoresDashboard from "./pages/profesor/ProfesorDashboard";
import MisCursosPage from "./pages/profesor/MisCursosPage";

// PIE
import PieDashboard from "./pages/pie/PieDashboard";
import AsignacionPIEPage from "./pages/pie/AsignacionPIEPage";
import EstudiantesPIEPage from "./pages/pie/EstudiantesPIEPage";
import FuncionariosPage from "./pages/pie/FuncionariosPage";

function App() {
  return (
    <Routes>

      {/* 🔓 Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/documentos" element={<DocumentosPage />} />
      <Route path="/estudiantes/:id" element={<EstudianteDetallePage />} />
      <Route path="/cursos/:id" element={<CursoDetallePage />} />
      <Route path="/cursos" element={<CursosPage />} />

      {/* 🏠 Home general */}
      <Route
        path="/home"
        element={
          <ProtectedRoute rolesPermitidos={[
            "Directiva",
            "Administrativo",
            "SinRol",
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

      <Route
        path="/admin/estudiantes"
        element={
          <ProtectedRoute rolesPermitidos={["Directiva", "Coordinador Administrativo", "Administrativo", "Funcionario"]}>
            <EstudiantesPage />
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
          <ProtectedRoute rolesPermitidos={["PIE", "Coordinador PIE"]}>
            <PieDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pie/estudiantes"
        element={
          <ProtectedRoute rolesPermitidos={["PIE", "Coordinador PIE", "Directiva"]}>
            <EstudiantesPIEPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/asignacion-pie"
        element={
          <ProtectedRoute rolesPermitidos={["Coordinador PIE"]}>
            <AsignacionPIEPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/funcionarios"
        element={
          <ProtectedRoute rolesPermitidos={["PIE", "Coordinador PIE", "Directiva"]}>
            <FuncionariosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mis-cursos"
        element={
          <ProtectedRoute rolesPermitidos={["Profesor"]}>
            <MisCursosPage />
          </ProtectedRoute>
        }
      />

      {/* 🚫 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;
