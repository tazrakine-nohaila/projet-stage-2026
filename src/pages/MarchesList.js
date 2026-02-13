import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function MarchesList() {
  const [filterTitle, setFilterTitle] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [hovered, setHovered] = useState(null);
  const [marches, setMarches] = useState([]);

  // Fonction pour charger les marchés
  const loadMarches = () => {
    const savedMarches = localStorage.getItem('marches');
    if (savedMarches) {
      setMarches(JSON.parse(savedMarches));
    } else {
      // Marchés par défaut si aucun n'est sauvegardé
      const defaultMarches = [
        { id: 1, titre: "Irrigation Nord", titulaire: "Société A", service: "Irrigation", budget: 100000, dateLimite: "2026-03-31", delai: "6 mois", statut: "En cours" },
        { id: 2, titre: "Drainage Sud", titulaire: "Société B", service: "Drainage", budget: 80000, dateLimite: "2026-04-30", delai: "4 mois", statut: "En attente" },
        { id: 3, titre: "Aménagement Ouest", titulaire: "Société C", service: "Aménagement", budget: 120000, dateLimite: "2026-05-15", delai: "8 mois", statut: "Terminé" },
        { id: 4, titre: "Station de pompage Est", titulaire: "HydroTech", service: "Irrigation", budget: 95000, dateLimite: "2026-06-10", delai: "5 mois", statut: "En cours" },
        { id: 5, titre: "Curage des canaux", titulaire: "AquaPlus", service: "Drainage", budget: 67000, dateLimite: "2026-04-20", delai: "3 mois", statut: "En attente" },
        { id: 6, titre: "Réhabilitation barrage", titulaire: "InfraBat", service: "Aménagement", budget: 210000, dateLimite: "2026-08-01", delai: "10 mois", statut: "En cours" },
        { id: 7, titre: "Extension réseau hydraulique", titulaire: "HydroSys", service: "Irrigation", budget: 150000, dateLimite: "2026-07-15", delai: "9 mois", statut: "Terminé" },
        { id: 8, titre: "Protection contre inondations", titulaire: "SafeWater", service: "Drainage", budget: 185000, dateLimite: "2026-09-01", delai: "12 mois", statut: "En cours" },
      ];
      setMarches(defaultMarches);
      localStorage.setItem('marches', JSON.stringify(defaultMarches));
    }
  };

  // Charger les marchés au montage du composant
  useEffect(() => {
    loadMarches();
  }, []);

  // Écouter les changements de localStorage (utile si on ajoute depuis une autre fenêtre)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'marches') {
        loadMarches();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredMarches = marches.filter(
    (m) =>
      m && m.titre && m.titre.toLowerCase().includes(filterTitle.toLowerCase()) &&
      (filterService ? m.service === filterService : true) &&
      (filterStatus ? m.statut === filterStatus : true)
  );

  const statusColor = (statut) => {
    switch (statut) {
      case "En cours":
        return "#2e7d32";
      case "En attente":
        return "#ffc107";
      case "Terminé":
        return "#007bff";
      default:
        return "#6c757d";
    }
  };

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      padding: "50px 20px",
      overflow: "hidden",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    }}>

      {/* Fond flou avec overlay moderne */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/img/img1.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
         
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
         
        }}
      />

      {/* Contenu */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>

        {/* Titre dans une carte */}
        <div style={{
          background: "#fff",
          border: "1px solid #2e7d32",
          padding: "20px",
          borderRadius: "16px",
          textAlign: "center",
          marginBottom: "35px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          position: "relative",
        }}>
          <h2 style={{ color: "#2e7d32", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", margin: 0 }}>
            <i className="bi bi-folder-fill"></i>
            Consultation des marchés
          </h2>

          <Link
            to="/ajouter-marche"
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              padding: "8px 16px",
              backgroundColor: "#0a722b",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "14px",
              boxShadow: "0 4px 15px rgba(10, 114, 43, 0.3)",
              transition: "all 0.3s ease",
              border: "1px solid #096520",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(10, 114, 43, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(10, 114, 43, 0.3)";
            }}
          >
            Ajouter un marché
          </Link>
        </div>

        {/* Filtres */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginBottom: "35px" }}>
          <input placeholder="Rechercher par titre" value={filterTitle} onChange={(e) => setFilterTitle(e.target.value)} style={inputStyle} />
          <select value={filterService} onChange={(e) => setFilterService(e.target.value)} style={inputStyle}>
            <option value="">Tous les services</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Drainage">Drainage</option>
            <option value="Aménagement">Aménagement</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={inputStyle}>
            <option value="">Tous les statuts</option>
            <option value="En cours">En cours</option>
            <option value="En attente">En attente</option>
            <option value="Terminé">Terminé</option>
          </select>
        </div>

        {/* Cartes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {filteredMarches.map((m) => (
            <div
              key={m.id}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "relative",
                background: "#fff",
                border: "1px solid #2e7d32",
                padding: "20px 20px 20px 26px",
                borderRadius: "16px",
                color: "#000",
                maxWidth: "360px",
                transform: hovered === m.id ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                boxShadow: hovered === m.id ? "0 20px 40px rgba(46, 125, 50, 0.3)" : "0 8px 20px rgba(0,0,0,0.1)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "6px", backgroundColor: statusColor(m.statut) }} />

              <h4>{m.titre}</h4>
              <p style={textStyle}><strong>Titulaire :</strong> {m.titulaire}</p>
              <p style={textStyle}><strong>Service :</strong> {m.service}</p>
              <p style={textStyle}><strong>Budget :</strong> {m.budget} DH</p>
              <p style={textStyle}><strong>Date limite :</strong> {m.dateLimite}</p>
              <p style={textStyle}><strong>Délai :</strong> {m.delai}</p>

              <span style={{ display: "inline-block", marginTop: "6px", padding: "3px 10px", borderRadius: "14px", backgroundColor: statusColor(m.statut), color: "#1A2B3D", fontSize: "12px", fontWeight: "bold" }}>
                {m.statut}
              </span>

              <br />

              {/* 🔥 ENVOI DES DONNÉES */}
              <Link
                to={`/marche/${m.id}`}
                state={m}
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  padding: "6px 12px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "13px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}
              >
                Ouvrir
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.6)",
  backgroundColor: "rgba(255,255,255,0.85)",
  width: "100%",
};

const textStyle = {
  fontSize: "14px",
  margin: "4px 0",
  lineHeight: "1.4",
};

export default MarchesList;
