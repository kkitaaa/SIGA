import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Roles from "./pages/asignacion_roles";
import Navbar from "./components/Navbar"; // importacion de la navbar
import Home from "./pages/home"; // importacion pagina home
// IMPORTACIONES FUTURAS (solo unos ejemplos)
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
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

// PONER A FUTURO DENTRO DE <Routes>:
// <Route path="/register" element={<Register />} />
// <Route path="/dashboard" element={<Dashboard />} />
// <Route path="/profile" element={<Profile />} />
// y asi...