import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Home from "./pages/home";
import AsignacionRoles from "./pages/asignacion_roles";
import PieDashboard from "./pages/home_pie";
import ProfesoresDashboard from "./pages/home_profesores";

import ProtectedRoute from "./middleware/ProtectedRoute";

// PONER A FUTURO
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/" element={<Login />} />

        {/* Cualquier usuario autenticado */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Solo Administrativos */}
        <Route
          path="/asignacion-roles"
          element={
            <ProtectedRoute roles={["Administrativo"]}>
              <AsignacionRoles />
            </ProtectedRoute>
          }
        />

        {/* Equipo PIE */}
        <Route
          path="/pie"
          element={
            <ProtectedRoute roles={["Equipo PIE"]}>
              <PieDashboard />
            </ProtectedRoute>
          }
        />

        {/* Profesores */}
        <Route
          path="/profesores"
          element={
            <ProtectedRoute roles={["Profesor"]}>
              <ProfesoresDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;