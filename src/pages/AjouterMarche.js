import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AjouterMarche() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: '',
    titulaire: '',
    budget: '',
    service: 'Irrigation',
    date: '',
    delai: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation basique
    if (!formData.titre || !formData.titulaire || !formData.budget) {
      alert('Veuillez remplir tous les champs obligatoires (Titre, Titulaire, Budget)');
      return;
    }

    // Récupérer les marchés existants depuis localStorage
    const existingMarches = JSON.parse(localStorage.getItem('marches') || '[]');

    // Créer le nouveau marché avec un ID unique
    const newMarche = {
      id: Date.now(), // ID basé sur timestamp pour l'unicité
      titre: formData.titre,
      titulaire: formData.titulaire,
      service: formData.service,
      budget: parseFloat(formData.budget),
      dateLimite: formData.date || new Date().toISOString().split('T')[0], // Date actuelle si non spécifiée
      delai: formData.delai || 'Non spécifié',
      statut: 'En attente' // Statut par défaut pour les nouveaux marchés
    };

    // Ajouter le nouveau marché à la liste existante
    const updatedMarches = [...existingMarches, newMarche];

    // Sauvegarder dans localStorage
    localStorage.setItem('marches', JSON.stringify(updatedMarches));

    alert('Marché ajouté avec succès!');

    // Rediriger vers la liste des marchés
    navigate('/marches');

    // Réinitialiser le formulaire (au cas où on reviendrait à cette page)
    setFormData({
      titre: '',
      titulaire: '',
      budget: '',
      service: 'Irrigation',
      date: '',
      delai: ''
    });
  };

  return (
    <section style={sectionStyle}>
      {/* Background image */}
      <div style={bgStyle} />

      {/* Form card */}
      <div
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.28)";
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 18px 40px rgba(0,0,0,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.18)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.25)";
        }}
      >
        <h2 style={titleStyle}>Ajouter un marché</h2>

        {/* INLINE STYLE FOR PLACEHOLDER */}
        <style>
          {`
            input::placeholder {
              color: rgba(30,30,30,0.75);
              font-weight: 500;
            }
            input:focus::placeholder {
              color: rgba(30,30,30,0.45);
            }
          `}
        </style>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="titre"
            placeholder="Titre du marché"
            value={formData.titre}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />
          <input
            type="text"
            name="titulaire"
            placeholder="Nom du titulaire"
            value={formData.titulaire}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />
          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={formData.budget}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            style={inputStyle}
          />
          <select
            name="service"
            value={formData.service || 'Irrigation'}
            onChange={handleInputChange}
            style={inputStyle}
            required
          >
            <option value="">Choisir un service</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Drainage">Drainage</option>
            <option value="Aménagement">Aménagement</option>
          </select>

          <input
            type="text"
            name="delai"
            placeholder="Délais"
            value={formData.delai}
            onChange={handleInputChange}
            style={inputStyle}
          />

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.filter = "brightness(1.05)";
              e.target.style.boxShadow = "0 10px 28px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.filter = "brightness(1)";
              e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
            }}
          >
            Ajouter
          </button>
        </form>
      </div>
    </section>
  );
}

/* STYLES */

const sectionStyle = {
  position: "relative",
  minHeight: "100vh",
  padding: "50px 20px",
  overflow: "hidden",
};

const bgStyle = {
  position: "absolute",
  inset: 0,
  backgroundImage: "url('/img/img1.jpeg')",
  backgroundSize: "cover",
  backgroundPosition: "center",

  zIndex: 0,
};

const cardStyle = {
  position: "relative",
  zIndex: 1,
  maxWidth: "600px",
  margin: "auto",
  padding: "40px 30px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  transition: "all 0.3s ease",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "30px",
  color: "#0e0d0d",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.4)",
  background: "rgba(255,255,255,0.25)",
  color: "#111",
  fontSize: "15px",
  outline: "none",
  backdropFilter: "blur(5px)",
  boxShadow: "inset 0 2px 6px rgba(0,0,0,0.2)",
  transition: "all 0.2s ease",
};

const buttonStyle = {
  width: "100%",
  padding: "12px 20px",
  borderRadius: "10px",
  border: "none",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  color: "#111",
  background: "linear-gradient(90deg, #d8b6d8 0%, #ebcda4 50%, #60bdda 100%)",
  boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
  transition: "all 0.3s ease",
};

export default AjouterMarche;
