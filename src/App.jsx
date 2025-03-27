import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Biseccion from "./components/Biseccion/Biseccion";
import Navbar from "./components/Navbar/Navbar";
import Secante from "./components/Secante/Secante";
import ReglaFalse from "./components/Regla-falsa/ReglaFalse";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Biseccion />} />
        <Route path="/secante" element={<Secante />} />
        <Route path="/regla-falsa" element={<ReglaFalse />} />
      </Routes>
    </Router>
  );
}

export default App;
