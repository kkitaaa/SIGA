import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Roles from "./pages/roles";
// PONER A FUTURO
//import Register from "./pages/Register";
//import Dashboard from "./pages/Dashboard";
//import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/roles" element={<Roles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// PONER A FUTURO DENTRO DE <Routes>:
// <Route path="/register" element={<Register />} />
// <Route path="/dashboard" element={<Dashboard />} />
// <Route path="/profile" element={<Profile />} />