import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function MarcheDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: marche } = useLocation();

 للوثائق
  const [documents, setDocuments] = useState([]);
  const [docType, setDocType] = useState("");
  const [inputMode, setInputMode] = useState("select"); 
  const [customType, setCustomType] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    
    const finalType = inputMode === "select" ? docType : customType;
    
    if (!file || !finalType) {
      alert("Veuillez choisir le type de document et sélectionner un fichier");
      return;
    }

    setDocuments([
      ...documents,
      {
        id: Date.now(),
        type: finalType,
        description: getDocDescription(finalType),
        name: file.name,
        file,
        date: new Date().toLocaleDateString("fr-FR"),
      },
    ]);

    
    setDocType("");
    setCustomType("");
    e.target.value = "";
  };

  const deleteDoc = (docId) => {
    if (window.confirm("Supprimer ce document ?")) {
      setDocuments(documents.filter((d) => d.id !== docId));
    }
  };


  const downloadDoc = (doc) => {
    const url = URL.createObjectURL(doc.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  
  const getDocDescription = (type) => {
    const map = {
      
    };
    return map[type] || type;
  };

  if (!marche) {
    return (
      <div style={notFoundStyle}>
        <h2 style={{ color: COLOR_PALETTE.danger }}>⚠️ Marché introuvable</h2>
        <button
          onClick={() => navigate("/marches")}
          style={returnButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.15)";
          }}
        >
          ← Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div style={pageContainerStyle}>
      {/* ===== BACKGROUND IMAGE ===== */}
      <div style={backgroundStyle} />

      {/* ===== CONTENT ===== */}
      <div style={contentWrapperStyle}>
        
        {/* ===== BOUTON RETOUR ===== */}
        <button
          onClick={() => navigate(-1)}
          style={backButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
        >
          ← Retour
        </button>
        
        
        <div style={headerStyle}>
          <h2 style={mainTitleStyle}>
            <span style={logoIconStyle}>🌱</span>
            {marche.titre}
            <span style={subtitleBadgeStyle}>{marche.service}</span>
          </h2>
          <div style={projectTitleStyle}>CRÉDIT AGRICOLE DU MAROC</div>
        </div>

        
        <div style={infoCardStyle}>
          <h3 style={sectionTitleStyle}>📋 Informations du Marché</h3>

          <div style={infoGridStyle}>
            <div 
              style={infoItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={infoLabelStyle}>🔢 NUMÉRO</span>
              <span style={infoValueStyle}>{marche.id || "Non spécifié"}</span>
            </div>

            <div 
              style={infoItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={infoLabelStyle}>📅 DATE DE DÉBUT</span>
              <span style={infoValueStyle}>Non spécifié</span>
            </div>

            <div 
              style={infoItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={infoLabelStyle}>📅 DATE DE FIN</span>
              <span style={infoValueStyle}>{marche.dateLimite || "Non spécifié"}</span>
            </div>

            <div 
              style={infoItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={infoLabelStyle}>💰 MONTANT</span>
              <span style={infoValueStyle}>{marche.budget ? `${marche.budget} DH` : "Non spécifié"}</span>
            </div>

            <div 
              style={infoItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={infoLabelStyle}>🏢 TITULAIRE</span>
              <span style={infoValueStyle}>{marche.titulaire || "Non spécifié"}</span>
            </div>

            <div 
              style={infoItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={infoLabelStyle}>🔧 SERVICE</span>
              <span style={infoValueStyle}>{marche.service || "Non spécifié"}</span>
            </div>

            <div 
              style={infoItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={infoLabelStyle}>📍 LOCALISATION</span>
              <span style={infoValueStyle}>Non spécifié</span>
            </div>

            <div 
              style={infoItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={infoLabelStyle}>⏱️ DÉLAI</span>
              <span style={infoValueStyle}>{marche.delai || "Non spécifié"}</span>
            </div>
          </div>

          <div 
            style={objetBoxStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.08)";
            }}
          >
            <span style={infoLabelStyle}>📝 OBJET</span>
            <p style={objetTextStyle}>
              {marche.service === "Irrigation"
                ? "Travaux liés à l'aménagement et à l'amélioration des systèmes d'irrigation."
                : marche.service === "Drainage"
                ? "Travaux de drainage et de protection des infrastructures hydrauliques."
                : marche.service === "Aménagement"
                ? "Travaux d'aménagement et de réhabilitation des ouvrages hydrauliques."
                : "Travaux relatifs au projet sélectionné."}
            </p>
          </div>
        </div>

       
        <div style={actionButtonsStyle}>
          <button
            style={actionBtnStyle}
            onClick={() => navigate(`/marches/${id}/bordereau-prix`, { state: marche })}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.15)";
              e.currentTarget.style.background = `linear-gradient(135deg, ${COLOR_PALETTE.primary}, ${COLOR_PALETTE.primaryDark})`;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
              e.currentTarget.style.background = COLOR_PALETTE.card;
              e.currentTarget.style.color = COLOR_PALETTE.primary;
            }}
          >
            <span style={iconStyle}>📋</span>
            Bordereau des Prix Unitaires
            <div style={btnSubtextStyle}>Gérer son prix</div>
          </button>

          <button
            style={actionBtnStyle}
            onClick={() => navigate(`/marches/${id}/attachements`, { state: marche })}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.15)";
              e.currentTarget.style.background = `linear-gradient(135deg, ${COLOR_PALETTE.primary}, ${COLOR_PALETTE.primaryDark})`;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
              e.currentTarget.style.background = COLOR_PALETTE.card;
              e.currentTarget.style.color = COLOR_PALETTE.primary;
            }}
          >
            <span style={iconStyle}>📎</span>
            Attachements
            <div style={btnSubtextStyle}>Gérer les documents joints</div>
          </button>

          <button
            style={actionBtnStyle}
            onClick={() => navigate(`/marches/${id}/decomptes`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.15)";
              e.currentTarget.style.background = `linear-gradient(135deg, ${COLOR_PALETTE.primary}, ${COLOR_PALETTE.primaryDark})`;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
              e.currentTarget.style.background = COLOR_PALETTE.card;
              e.currentTarget.style.color = COLOR_PALETTE.primary;
            }}
          >
            <span style={iconStyle}>📊</span>
            Décomptes
            <div style={btnSubtextStyle}>Gérer les décomptes</div>
          </button>
        </div>

  
        <div style={uploadCardStyle}>
          <h3 style={sectionTitleStyle}>📁 Ajouter un Document</h3>
          
 
          <div style={radioGroupStyle}>
            <label 
              style={radioLabelStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${COLOR_PALETTE.primary}15`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <input
                type="radio"
                value="select"
                checked={inputMode === "select"}
                onChange={(e) => setInputMode(e.target.value)}
                style={radioInputStyle}
              />
              Choisir depuis la liste
            </label>
            
            <label 
              style={radioLabelStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${COLOR_PALETTE.primary}15`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <input
                type="radio"
                value="manual"
                checked={inputMode === "manual"}
                onChange={(e) => setInputMode(e.target.value)}
                style={radioInputStyle}
              />
              Entrer manuellement
            </label>
          </div>

          <div style={uploadRowStyle}>
            {/* Mode SELECT */}
            {inputMode === "select" && (
              <select
                style={selectStyle}
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLOR_PALETTE.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${COLOR_PALETTE.primary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLOR_PALETTE.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">Choisir le type de document</option>
                
                <optgroup label="📋 Documents Contractuels">
                  <option value="Cahier des Prescriptions Spéciales (CPS)">Cahier des Prescriptions Spéciales (CPS)</option>
                  <option value="Cahier des Clauses Techniques Particulières (CCTP)">Cahier des Clauses Techniques Particulières (CCTP)</option>
                  <option value="Cahier des Clauses Administratives Particulières (CCAP)">Cahier des Clauses Administratives Particulières (CCAP)</option>
                  <option value="Cahier des Clauses Administratives Générales (CCAG)">Cahier des Clauses Administratives Générales (CCAG)</option>
                  <option value="Bordereau des Prix Unitaires (BPU)">Bordereau des Prix Unitaires (BPU)</option>
                  <option value="Détail Quantitatif Estimatif (DQE)">Détail Quantitatif Estimatif (DQE)</option>
                  <option value="Décomposition du Prix Global et Forfaitaire (DPGF)">Décomposition du Prix Global et Forfaitaire (DPGF)</option>
                  <option value="Acte d'Engagement">Acte d'Engagement</option>
                  <option value="Cahier des Charges">Cahier des Charges</option>
                </optgroup>
                
                <optgroup label="📝 Ordres de Service">
                  <option value="Ordre de Service de Commencement">Ordre de Service de Commencement</option>
                  <option value="Ordre de Service d'Arrêt">Ordre de Service d'Arrêt</option>
                  <option value="Ordre de Service de Reprise">Ordre de Service de Reprise</option>
                  <option value="Ordre de Service de Prolongation">Ordre de Service de Prolongation</option>
                  <option value="Ordre de Service Modificatif">Ordre de Service Modificatif</option>
                </optgroup>
                
                <optgroup label="✅ Procès-Verbaux">
                  <option value="Procès-Verbal de Réception Provisoire">Procès-Verbal de Réception Provisoire</option>
                  <option value="Procès-Verbal de Réception Définitive">Procès-Verbal de Réception Définitive</option>
                  <option value="Procès-Verbal de Réunion de Chantier">Procès-Verbal de Réunion de Chantier</option>
                  <option value="Procès-Verbal de Recette">Procès-Verbal de Recette</option>
                  <option value="Procès-Verbal de Constat">Procès-Verbal de Constat</option>
                  <option value="Procès-Verbal d'Essai">Procès-Verbal d'Essai</option>
                </optgroup>
                
                <optgroup label="📐 Documents Techniques">
                  <option value="Plan d'Exécution">Plan d'Exécution</option>
                  <option value="Plan d'Architecture">Plan d'Architecture</option>
                  <option value="Plan de Recollement">Plan de Recollement</option>
                  <option value="Note de Calcul">Note de Calcul</option>
                  <option value="Étude Technique">Étude Technique</option>
                  <option value="Rapport Géotechnique">Rapport Géotechnique</option>
                  <option value="Rapport Topographique">Rapport Topographique</option>
                  <option value="Étude d'Impact Environnemental">Étude d'Impact Environnemental</option>
                  <option value="Dossier Technique">Dossier Technique</option>
                </optgroup>
                
                <optgroup label="📊 Suivi des Travaux">
                  <option value="Attachement">Attachement</option>
                  <option value="Décompte Provisoire">Décompte Provisoire</option>
                  <option value="Décompte Général et Définitif">Décompte Général et Définitif</option>
                  <option value="Situation des Travaux">Situation des Travaux</option>
                  <option value="Métré">Métré</option>
                  <option value="Planning d'Exécution">Planning d'Exécution</option>
                  <option value="Planning Prévisionnel">Planning Prévisionnel</option>
                  <option value="Planning Actualisé">Planning Actualisé</option>
                  <option value="Rapport d'Avancement">Rapport d'Avancement</option>
                </optgroup>
                
                <optgroup label="💰 Documents Financiers">
                  <option value="Facture">Facture</option>
                  <option value="Devis">Devis</option>
                  <option value="Mémoire des Travaux">Mémoire des Travaux</option>
                  <option value="Demande d'Acompte">Demande d'Acompte</option>
                  <option value="Garantie Bancaire">Garantie Bancaire</option>
                  <option value="Caution de Retenue de Garantie">Caution de Retenue de Garantie</option>
                  <option value="Police d'Assurance">Police d'Assurance</option>
                  <option value="Assurance Décennale">Assurance Décennale</option>
                  <option value="Sous-Détail de Prix">Sous-Détail de Prix</option>
                </optgroup>
                
                <optgroup label="🏆 Qualité & Conformité">
                  <option value="Fiche Technique">Fiche Technique</option>
                  <option value="Certificat de Conformité">Certificat de Conformité</option>
                  <option value="Agrément Technique">Agrément Technique</option>
                  <option value="Rapport de Contrôle Qualité">Rapport de Contrôle Qualité</option>
                  <option value="Plan d'Assurance Qualité (PAQ)">Plan d'Assurance Qualité (PAQ)</option>
                  <option value="Dossier des Ouvrages Exécutés (DOE)">Dossier des Ouvrages Exécutés (DOE)</option>
                  <option value="Dossier d'Intervention Ultérieure sur l'Ouvrage (DIUO)">Dossier d'Intervention Ultérieure sur l'Ouvrage (DIUO)</option>
                  <option value="Plan Particulier de Sécurité et de Protection de la Santé (PPSPS)">Plan Particulier de Sécurité et de Protection de la Santé (PPSPS)</option>
                </optgroup>
                
                <optgroup label="📧 Correspondances Administratives">
                  <option value="Courrier Administratif">Courrier Administratif</option>
                  <option value="Lettre de Notification">Lettre de Notification</option>
                  <option value="Mise en Demeure">Mise en Demeure</option>
                  <option value="Réclamation">Réclamation</option>
                  <option value="Avenant au Marché">Avenant au Marché</option>
                </optgroup>
                
                <optgroup label="📷 Documentation Chantier">
                  <option value="Photos de Chantier">Photos de Chantier</option>
                  <option value="Vidéo de Chantier">Vidéo de Chantier</option>
                  <option value="Rapport Journalier">Rapport Journalier</option>
                  <option value="Compte Rendu de Réunion">Compte Rendu de Réunion</option>
                  <option value="Bon de Livraison">Bon de Livraison</option>
                  <option value="Bordereau d'Envoi">Bordereau d'Envoi</option>
                </optgroup>
                
                <optgroup label="🔍 Documents d'Expertise">
                  <option value="Rapport d'Expertise">Rapport d'Expertise</option>
                  <option value="Rapport d'Audit">Rapport d'Audit</option>
                  <option value="Étude de Faisabilité">Étude de Faisabilité</option>
                </optgroup>
                
                <optgroup label="📄 Autres Documents">
                  <option value="Autre Document">Autre Document</option>
                </optgroup>
              </select>
            )}

            {inputMode === "manual" && (
              <input
                type="text"
                placeholder="Entrez le type de document (ex: Rapport technique, Plan...)"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                style={textInputStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLOR_PALETTE.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${COLOR_PALETTE.primary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLOR_PALETTE.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            )}

            <input
              type="file"
              accept=".pdf,.xlsx,.xls,.jpg,.png,.doc,.docx"
              onChange={handleUpload}
              style={fileInputStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLOR_PALETTE.primary;
                e.currentTarget.style.backgroundColor = `${COLOR_PALETTE.primary}15`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${COLOR_PALETTE.primaryLight}`;
                e.currentTarget.style.backgroundColor = `${COLOR_PALETTE.primaryLight}10`;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            />

            <span style={maxSizeTextStyle}>Taille maximale: 10MB</span>
          </div>
        </div>

        {/* ===== TABLE DOCUMENTS ===== */}
        <div style={tableCardStyle}>
          <h3 style={sectionTitleStyle}>
            📄 Documents ajoutés ({documents.length})
          </h3>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>TYPE</th>
                <th style={thStyle}>DESCRIPTION</th>
                <th style={thStyle}>NOM DU FICHIER</th>
                <th style={thStyle}>DATE</th>
                <th style={thStyle}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr 
                  key={doc.id} 
                  style={trStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${COLOR_PALETTE.hover}`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <td style={tdStyle}>
                    <span 
                      style={typeBadgeStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {doc.type}
                    </span>
                  </td>
                  <td style={tdStyle}>{doc.description}</td>
                  <td style={tdStyle}>{doc.name}</td>
                  <td style={tdStyle}>{doc.date}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => downloadDoc(doc)}
                      style={downloadButtonStyle}
                      title="Télécharger"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = COLOR_PALETTE.success;
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.transform = "scale(1.1)";
                        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = COLOR_PALETTE.success;
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={() => deleteDoc(doc.id)}
                      style={deleteButtonStyle}
                      title="Supprimer"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = COLOR_PALETTE.danger;
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.transform = "scale(1.1)";
                        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = COLOR_PALETTE.danger;
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}

              {documents.length === 0 && (
                <tr>
                  <td colSpan="5" style={emptyStateStyle}>
                    <div style={{ fontSize: "48px", marginBottom: "20px" }}>📁</div>
                    Aucun document ajouté pour le moment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


const COLOR_PALETTE = {
  primary: "#2e7d32",    
  primaryLight: "#4caf50", 
  primaryDark: "#1b5e20",  
  secondary: "#388e3c",    
  accent: "#8bc34a",      
  background: "#f8f9fa",   
  card: "#ffffff",    
  text: "#212529",        
  textLight: "#6c757d",    
  border: "#dee2e6",      
  success: "#28a745",    
  danger: "#dc3545",       
  info: "#17a2b8",         
  hover: "#e8f5e9",        
};

/* ===================== STYLES ===================== */

const pageContainerStyle = {
  position: "relative",
  minHeight: "100vh",
  overflow: "hidden",
  backgroundColor: COLOR_PALETTE.background,
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const backgroundStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: "url('/img/img1.jpeg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  opacity: "0.O1", // إزالة الضبابية
  zIndex: 0,
};

const contentWrapperStyle = {
  position: "relative",
  zIndex: 1,
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "30px 20px",
};

const backButtonStyle = {
  position: "absolute",
  top: "20px",
  left: "20px",
  padding: "12px 24px",
  background: `linear-gradient(135deg, ${COLOR_PALETTE.primary}, ${COLOR_PALETTE.primaryDark})`,
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const headerStyle = {
  marginBottom: "30px",
  textAlign: "center",
  padding: "30px 20px",
  background: `linear-gradient(135deg, ${COLOR_PALETTE.primaryDark}, ${COLOR_PALETTE.primary})`,
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  position: "relative",
  overflow: "hidden",
  marginTop: "40px",
  animation: "slideInDown 0.5s ease-out",
};

const mainTitleStyle = {
  color: "#fff",
  fontSize: "34px",
  fontWeight: "700",
  textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "15px",
  flexWrap: "wrap",
  margin: "0 0 10px 0",
};

const logoIconStyle = {
  fontSize: "40px",
  filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
  animation: "pulse 2s infinite",
};

const subtitleBadgeStyle = {
  background: COLOR_PALETTE.accent,
  color: COLOR_PALETTE.text,
  padding: "8px 20px",
  borderRadius: "25px",
  fontSize: "18px",
  fontWeight: "600",
  boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
  animation: "bounceIn 0.8s ease-out",
};

const projectTitleStyle = {
  color: "#fff",
  fontSize: "20px",
  fontWeight: "500",
  opacity: "0.9",
  letterSpacing: "1px",
  marginTop: "10px",
  textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
  animation: "fadeIn 1s ease-out",
};

const infoCardStyle = {
  background: COLOR_PALETTE.card,
  borderRadius: "12px",
  padding: "30px",
  marginBottom: "25px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  border: `1px solid ${COLOR_PALETTE.border}`,
  transition: "box-shadow 0.3s ease",
  animation: "fadeInUp 0.6s ease-out",
};

const sectionTitleStyle = {
  color: COLOR_PALETTE.primary,
  borderBottom: `3px solid ${COLOR_PALETTE.primary}`,
  paddingBottom: "12px",
  marginBottom: "25px",
  fontSize: "24px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  animation: "slideInLeft 0.5s ease-out",
};

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginBottom: "25px",
};

const infoItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "18px",
  background: "#f8f9fa",
  borderRadius: "10px",
  borderLeft: `4px solid ${COLOR_PALETTE.primary}`,
  transition: "all 0.3s ease",
  cursor: "default",
  animation: "fadeIn 0.8s ease-out",
};

const infoLabelStyle = {
  fontSize: "13px",
  fontWeight: "700",
  color: COLOR_PALETTE.primary,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const infoValueStyle = {
  fontSize: "17px",
  color: COLOR_PALETTE.text,
  fontWeight: "500",
};

const objetBoxStyle = {
  background: `linear-gradient(135deg, ${COLOR_PALETTE.hover}, ${COLOR_PALETTE.primaryLight}15)`,
  padding: "22px",
  borderRadius: "10px",
  border: `1px solid ${COLOR_PALETTE.primaryLight}30`,
  transition: "all 0.3s ease",
  animation: "fadeIn 1s ease-out",
};

const objetTextStyle = {
  margin: "12px 0 0 0",
  color: COLOR_PALETTE.text,
  fontSize: "16px",
  lineHeight: "1.7",
};

const actionButtonsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "25px",
  marginBottom: "30px",
  animation: "fadeInUp 0.7s ease-out",
};

const actionBtnStyle = {
  background: COLOR_PALETTE.card,
  border: `2px solid ${COLOR_PALETTE.primary}`,
  borderRadius: "12px",
  padding: "28px 20px",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  textAlign: "center",
  fontSize: "20px",
  fontWeight: "600",
  color: COLOR_PALETTE.primary,
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  position: "relative",
  overflow: "hidden",
};

const iconStyle = {
  fontSize: "40px",
  display: "block",
  marginBottom: "5px",
  transition: "transform 0.3s ease",
};

const btnSubtextStyle = {
  fontSize: "15px",
  color: COLOR_PALETTE.textLight,
  fontWeight: "normal",
  marginTop: "5px",
  transition: "color 0.3s ease",
};

const uploadCardStyle = {
  background: COLOR_PALETTE.card,
  borderRadius: "12px",
  padding: "30px",
  marginBottom: "25px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  border: `1px solid ${COLOR_PALETTE.border}`,
  animation: "fadeInUp 0.8s ease-out",
};

const uploadRowStyle = {
  display: "flex",
  gap: "18px",
  alignItems: "center",
  flexWrap: "wrap",
  marginTop: "20px",
};

const radioGroupStyle = {
  display: "flex",
  gap: "35px",
  marginBottom: "25px",
  padding: "18px",
  background: "#f8f9fa",
  borderRadius: "10px",
  border: `1px solid ${COLOR_PALETTE.border}`,
  animation: "fadeIn 0.9s ease-out",
};

const radioLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  fontSize: "16px",
  fontWeight: "500",
  cursor: "pointer",
  color: COLOR_PALETTE.text,
  padding: "10px 18px",
  borderRadius: "8px",
  transition: "all 0.3s ease",
};

const radioInputStyle = {
  cursor: "pointer",
  width: "20px",
  height: "20px",
  accentColor: COLOR_PALETTE.primary,
  transform: "scale(1)",
  transition: "transform 0.2s ease",
};

const textInputStyle = {
  padding: "14px 18px",
  borderRadius: "10px",
  border: `2px solid ${COLOR_PALETTE.border}`,
  fontSize: "16px",
  minWidth: "350px",
  flex: 1,
  transition: "all 0.3s ease",
  outline: "none",
  backgroundColor: COLOR_PALETTE.card,
  color: COLOR_PALETTE.text,
  animation: "fadeIn 1s ease-out",
};

const selectStyle = {
  padding: "14px 18px",
  borderRadius: "10px",
  border: `2px solid ${COLOR_PALETTE.border}`,
  fontSize: "16px",
  minWidth: "350px",
  cursor: "pointer",
  backgroundColor: COLOR_PALETTE.card,
  color: COLOR_PALETTE.text,
  transition: "all 0.3s ease",
  outline: "none",
  animation: "fadeIn 1s ease-out",
};

const fileInputStyle = {
  flex: 1,
  minWidth: "280px",
  padding: "14px",
  border: `2px dashed ${COLOR_PALETTE.primaryLight}`,
  borderRadius: "10px",
  backgroundColor: `${COLOR_PALETTE.primaryLight}10`,
  cursor: "pointer",
  transition: "all 0.3s ease",
  fontSize: "15px",
  animation: "fadeIn 1.1s ease-out",
};

const maxSizeTextStyle = {
  fontSize: "14px",
  color: COLOR_PALETTE.textLight,
  fontStyle: "italic",
  padding: "10px 15px",
  background: "#f8f9fa",
  borderRadius: "8px",
  border: `1px solid ${COLOR_PALETTE.border}`,
  animation: "fadeIn 1.2s ease-out",
};

const tableCardStyle = {
  background: COLOR_PALETTE.card,
  borderRadius: "12px",
  padding: "30px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  border: `1px solid ${COLOR_PALETTE.border}`,
  overflow: "hidden",
  animation: "fadeInUp 0.9s ease-out",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const thStyle = {
  textAlign: "left",
  padding: "18px 15px",
  background: `linear-gradient(135deg, ${COLOR_PALETTE.primary}, ${COLOR_PALETTE.primaryDark})`,
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  border: "none",
  animation: "slideInDown 0.5s ease-out",
};

const tdStyle = {
  padding: "18px 15px",
  borderBottom: `1px solid ${COLOR_PALETTE.border}`,
  fontSize: "16px",
  color: COLOR_PALETTE.text,
  verticalAlign: "middle",
  transition: "all 0.3s ease",
};

const trStyle = {
  transition: "all 0.3s ease",
  animation: "fadeIn 0.6s ease-out",
};

const typeBadgeStyle = {
  background: `${COLOR_PALETTE.primary}15`,
  color: COLOR_PALETTE.primaryDark,
  padding: "8px 16px",
  borderRadius: "25px",
  fontSize: "14px",
  fontWeight: "600",
  display: "inline-block",
  border: `1px solid ${COLOR_PALETTE.primary}30`,
  transition: "all 0.3s ease",
};

const downloadButtonStyle = {
  background: "transparent",
  border: `1px solid ${COLOR_PALETTE.success}`,
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
  padding: "10px 15px",
  marginRight: "10px",
  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  color: COLOR_PALETTE.success,
};

const deleteButtonStyle = {
  background: "transparent",
  border: `1px solid ${COLOR_PALETTE.danger}`,
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
  padding: "10px 15px",
  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  color: COLOR_PALETTE.danger,
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "60px",
  color: COLOR_PALETTE.textLight,
  fontStyle: "italic",
  fontSize: "18px",
  background: "#f8f9fa",
  borderRadius: "10px",
  border: `1px dashed ${COLOR_PALETTE.border}`,
  animation: "pulse 2s infinite",
};

const notFoundStyle = {
  padding: "50px",
  textAlign: "center",
  background: COLOR_PALETTE.background,
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  animation: "fadeIn 0.5s ease-out",
};

const returnButtonStyle = {
  marginTop: "25px",
  padding: "15px 35px",
  background: `linear-gradient(135deg, ${COLOR_PALETTE.primary}, ${COLOR_PALETTE.primaryDark})`,
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "17px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  letterSpacing: "0.5px",
  position: "relative",
  overflow: "hidden",
};


const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default MarcheDetail;
