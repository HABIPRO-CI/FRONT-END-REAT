import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Proprietaire from "./proprietaire/proprietaire";
import Locataire from "./locataire/loacataire";

function Navigation() {
  const location = useLocation();
  // Masquer la nav sur /proprietaire et /Locataire
  if (location.pathname === "/proprietaire" || location.pathname === "/Locataire") return null;
  return (
    <nav>
      <Link to="/proprietaire">Propriétaire</Link> |{" "}
      <Link to="/Locataire">Locataire</Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/proprietaire" element={<Proprietaire />} />
        <Route path="/Locataire" element={<Locataire />} />
        {/* Ajoutez d'autres routes ici si besoin */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;