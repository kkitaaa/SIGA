import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AsignacionRoles from "./pages/asignacion_roles";
// PONER A FUTURO
//import Register from "./pages/Register";
//import Dashboard from "./pages/Dashboard";
//import Profile from "./pages/Profile";

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
