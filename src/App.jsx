import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Biseccion from "./components/Biseccion/Biseccion";
import Navbar from "./components/Navbar/Navbar";
import Secante from "./components/Secante/Secante";
import ReglaFalse from "./components/Regla-falsa/ReglaFalse";
import { Analytics } from "@vercel/analytics/react"
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <Router>
      <Navbar />
      <Analytics />
      
      <Routes>
        <Route path="/" element={<Biseccion />} />
        <Route path="/secante" element={<Secante />} />
        <Route path="/regla-falsa" element={<ReglaFalse />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
