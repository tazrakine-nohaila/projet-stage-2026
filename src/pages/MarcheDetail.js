import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function MarcheDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: marche } = useLocation();

  if (!marche) {
    return (
      <section style={{ padding: "50px 20px", minHeight: "80vh" }}>
        <h2>Marché introuvable</h2>
        <button onClick={() => navigate("/marches")}>Retour à la liste</button>
      </section>
    );
  }

  // 🔹 Description selon le service
  const getDescription = (service) => {
    switch (service) {
      case "Irrigation":
        return "Travaux liés à l'aménagement et à l'amélioration des systèmes d'irrigation.";
      case "Drainage":
        return "Travaux de drainage et de protection des infrastructures hydrauliques.";
      case "Aménagement":
        return "Travaux d'aménagement et de réhabilitation des ouvrages hydrauliques.";
      default:
        return "Travaux relatifs au projet sélectionné.";
    }
  };

  return (
    <section style={{ padding: "50px 20px", minHeight: "80vh" }}>
      {/* ===== TITRE ===== */}
      <h2 style={{ marginBottom: "30px" }}>
        Détails du marché : {marche.titre}
      </h2>

      {/* ===== BOUTONS ===== */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        <button style={btnStyle} onClick={() => alert("Télécharger BPU")}>
          Télécharger le BPU
        </button>

        <button
          style={btnStyle}
          onClick={() =>
            navigate(`/marches/${id}/bordereau-prix`, { state: marche })
          }
        >
          📋 Bordereau de Prix
        </button>

        <button
          style={btnStyle}
          onClick={() =>
            navigate(`/marches/${id}/attachements`, { state: marche })
          }
        >
          Attachement
        </button>

        <button
          style={btnPrimary}
          onClick={() => navigate(`/marches/${id}/decomptes`)}
        >
          Préparer les décomptes
        </button>
      </div>

      {/* ===== SELECTS ===== */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* Objet du marché */}
        <div style={selectBox}>
          <label style={labelStyle}>Objet du marché</label>
          <div style={objetBox}>
            <strong>{marche.titre}</strong>
            <p style={descriptionStyle}>
              {getDescription(marche.service)}
            </p>
          </div>
        </div>

        {/* Entreprise */}
        <div style={selectBox}>
          <label style={labelStyle}>Entreprise</label>
          <select style={selectStyle}>
            <option>{marche.titulaire}</option>
          </select>
        </div>

        {/* Pièces jointes */}
        <div style={selectBox}>
          <label style={labelStyle}>Pièces jointes</label>
          <select style={selectStyle}>
            <option>Choisir un document</option>
            <option>BPU</option>
            <option>CPS</option>
            <option>OS de commencement</option>
            <option>OS d'arrêt</option>
            <option>OS de reprise</option>
          </select>
        </div>
      </div>
    </section>
  );
}

/* ===== Styles ===== */
const btnStyle = {
  padding: "10px 18px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const btnPrimary = {
  ...btnStyle,
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
};

const selectBox = {
  flex: 1,
  minWidth: "220px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "bold",
};

const selectStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const objetBox = {
  backgroundColor: "#f8f9fa",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
};

const descriptionStyle = {
  marginTop: "6px",
  fontSize: "13px",
  color: "#555",
};

export default MarcheDetail;
