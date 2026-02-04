import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import MarchesList from "./pages/MarchesList";
import AjouterMarche from "./pages/AjouterMarche";
import MarcheDetail from "./pages/MarcheDetail";
import Connexion from "./pages/Connexion"; 
import Attachement from "./pages/Attachement";
import BordereauPrix from "./pages/BordereauPrix";

function App() {
  return (
    <BrowserRouter>
      <div style={{ paddingTop: "0px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marches" element={<MarchesList />} />
          <Route path="/ajouter-marche" element={<AjouterMarche />} />
          <Route path="/marche/:id" element={<MarcheDetail />} />
          <Route path="/marches/:id/bordereau-prix" element={<BordereauPrix />} />
          <Route path="/marches/:id/attachements" element={<Attachement />} /> 
          
          <Route path="/connexion" element={<Connexion />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
