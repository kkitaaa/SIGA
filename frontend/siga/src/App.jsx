import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/login";
import AsignacionRoles from "./pages/asignacion_roles";
// PONER A FUTURO
//import Register from "./pages/Register";
//import Dashboard from "./pages/Dashboard";
//import Profile from "./pages/Profile";

function AppContent() {
  const location = useLocation();
  // la navbar solo se muestra si NO estamos en la pagina de login
  const showNavbar = location.pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/asignacion_roles" element={<Roles />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/asignacion-roles" element={<AsignacionRoles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
