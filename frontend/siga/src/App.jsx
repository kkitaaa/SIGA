import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioDeSesión from "./pages/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioDeSesión />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;