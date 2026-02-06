import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "./DecomptesPage.css";

function DecomptesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  
  // Récupérer les données envoyées depuis Attachement
  const marche = state?.marche || {};
  const lignesFromAttachement = state?.lignesTravaux || [];
  const fromAttachement = state?.fromAttachement || false;
  const numeroAttachement = state?.numeroAttachement || '001';
  const dateAttachement = state?.dateAttachement || new Date().toISOString().split('T')[0];
  
  const pdfRef = useRef();

  /* =========================
     ÉTAT POUR LE MODE D'AFFICHAGE
  ========================== */
  const [isPrintMode, setIsPrintMode] = useState(false);

  /* =========================
     DONNÉES PRINCIPALES
  ========================== */
  const [formData, setFormData] = useState({
    numeroMarche: marche.reference || "M 01/2024",
    exercice: new Date().getFullYear().toString(),
    partie: "",
    chapitre: "",
    article: "",
    paragraphe: "",
    objet: marche.titre || "TRAVAUX DE CONSTRUCTION DE LA PISTE RELIANT AMEZRI ET TASSAWATE À TRAVERS TICHKI, CT IMINOULAOUEN, PROVINCE D'OUARZAZATE",
    nomSociete: "SOCIETE ABC",
    ville: "OUARZAZATE",
    montantAcompte: "81.000,00",
    rc: "123456",
    compteEntreprise: "01234567890123456789",
    banqueEntreprise: "CREDIT DU MAROC",
    villeOuvertureCompte: "OUARZAZATE",
    cnss: "CN12345",
    patente: "P12345",
    dateApprobation: "01/01/2024",
    dateExecution: dateAttachement,
    montantMarcheTTC: marche.montant || 6395520,
    directeur: "Directeur de l'Office Régional de Mise en Valeur Agricole de Ouarzazate",
    imputationSource: "",
  });

  /* =========================
     ÉTATS POUR LES SIGNATURES
  ========================== */
  const [signatures, setSignatures] = useState({
    chargeSuivi: "",
    chefDepartement: "",
    serviceType: "",
  });

  const serviceOptions = [
    { value: "", label: "Sélectionner un service" },
    { value: "BET", label: "BET" },
    { value: "BTEHA", label: "BTEHA" },
    { value: "BARES", label: "BARES" },
  ];

  /* =========================
     LIGNES DE TRAVAUX (IMPORTÉES DEPUIS L'ATTACHEMENT)
  ========================== */
  const [lignesTravaux, setLignesTravaux] = useState([]);
  const [editingCell, setEditingCell] = useState({ row: null, key: null });

  // Effet pour charger les lignes depuis l'attachement
  useEffect(() => {
    if (fromAttachement && lignesFromAttachement.length > 0) {
      console.log("Chargement des lignes depuis l'attachement:", lignesFromAttachement);
      
      // Transformer les données de l'attachement au format DecomptesPage
      const transformedLignes = lignesFromAttachement.map((item, index) => ({
        id: index + 1,
        designation: item.designation || `Ligne ${index + 1}`,
        unite: item.unite || "U",
        quantite: item.quantite || 1,
        prixUnitaire: item.prixUnitaire || 2500,
        prixTotal: item.prixTotal || ((item.quantite || 1) * (item.prixUnitaire || 2500))
      }));
      
      setLignesTravaux(transformedLignes);
      
      // Calculer le total TTC initial
      const totalHT = transformedLignes.reduce((sum, ligne) => sum + ligne.prixTotal, 0);
      const totalTTC = totalHT * 1.2; // Avec TVA 20%
      
      setFormData(prev => ({
        ...prev,
        montantMarcheTTC: totalTTC
      }));
      
      // Mettre à jour les calculs
      setCalculs(prev => ({
        ...prev,
        totalHT: totalHT,
        totalGlobalHT: totalHT,
        tvaMontant: totalHT * 0.2,
        totalGlobalTTC: totalTTC
      }));
    } else {
      // Si pas d'importation, utiliser les données statiques
      setLignesTravaux([
        { id: 1, designation: "Libellé 01", unite: "U", quantite: 1, prixUnitaire: 2500, prixTotal: 2500 },
        { id: 2, designation: "Libellé 02", unite: "U", quantite: 4, prixUnitaire: 2500, prixTotal: 10000 },
        { id: 3, designation: "Libellé 03", unite: "U", quantite: 4, prixUnitaire: 2500, prixTotal: 10000 },
        { id: 4, designation: "Libellé 04", unite: "U", quantite: 4, prixUnitaire: 2500, prixTotal: 10000 },
        { id: 5, designation: "Libellé 05", unite: "U", quantite: 4, prixUnitaire: 2500, prixTotal: 10000 },
        { id: 6, designation: "Libellé 06", unite: "U", quantite: 3, prixUnitaire: 2500, prixTotal: 7500 },
        { id: 7, designation: "Libellé 07", unite: "U", quantite: 4, prixUnitaire: 2500, prixTotal: 10000 },
        { id: 8, designation: "Libellé 08", unite: "U", quantite: 3, prixUnitaire: 2500, prixTotal: 7500 },
      ]);
    }
  }, [fromAttachement, lignesFromAttachement, numeroAttachement]);

  // Fonction pour mettre à jour une cellule spécifique
  const updateCell = (rowIndex, key, value) => {
    const updated = [...lignesTravaux];
    if (key === "quantite" || key === "prixUnitaire") {
      value = parseFloat(value) || 0;
      updated[rowIndex][key] = value;
      updated[rowIndex].prixTotal = updated[rowIndex].quantite * updated[rowIndex].prixUnitaire;
    } else {
      updated[rowIndex][key] = value;
    }
    setLignesTravaux(updated);
  };

  // Fonction pour rendre une cellule (lecture ou édition)
  const renderCell = (ligne, rowIndex, key, isPrint = false) => {
    if (isPrint) {
      return (
        <span className="cell-value-print">
          {key === "prixTotal" ? formatNumber(ligne[key]) : 
           key === "quantite" || key === "prixUnitaire" ? formatNumber(ligne[key]) : ligne[key]}
        </span>
      );
    }
    
    if (editingCell.row === rowIndex && editingCell.key === key) {
      return (
        <input
          type={key === "quantite" || key === "prixUnitaire" ? "number" : "text"}
          value={ligne[key]}
          onChange={(e) => updateCell(rowIndex, key, e.target.value)}
          onBlur={() => setEditingCell({ row: null, key: null })}
          onKeyDown={(e) => e.key === 'Enter' && setEditingCell({ row: null, key: null })}
          autoFocus
          className="cell-input"
        />
      );
    }
    return (
      <span 
        onClick={() => setEditingCell({ row: rowIndex, key })}
        className="cell-value"
      >
        {key === "prixTotal" ? formatNumber(ligne[key]) : 
         key === "quantite" || key === "prixUnitaire" ? formatNumber(ligne[key]) : ligne[key]}
      </span>
    );
  };

  // Fonction pour supprimer une ligne
  const deleteLine = (index) => {
    if (!window.confirm("Supprimer cette ligne ?")) return;
    setLignesTravaux(lignesTravaux.filter((_, i) => i !== index));
    if (editingCell.row === index) setEditingCell({ row: null, key: null });
  };

  // Fonction pour ajouter une ligne
  const addNewLine = () => {
    const newLine = { 
      id: lignesTravaux.length + 1, 
      designation: `Libellé ${(lignesTravaux.length + 1).toString().padStart(2, '0')}`, 
      unite: "U", 
      quantite: 1, 
      prixUnitaire: 2500, 
      prixTotal: 2500 
    };
    setLignesTravaux([...lignesTravaux, newLine]);
  };

  /* =========================
     ÉTATS POUR LES DÉPENSES
  ========================== */
  const [depenses, setDepenses] = useState({
    travauxTermines: 0,
    travauxNonTermines: 0,
    approvisionnement: 0,
  });

  /* =========================
     ÉTATS POUR LES CALCULS
  ========================== */
  const [calculs, setCalculs] = useState({
    totalHT: 0,
    revisionPrix: 0,
    totalGlobalHT: 0,
    tvaPourcentage: 20,
    tvaMontant: 0,
    totalGlobalTTC: 0,
    retenueGarantie: 0,
    montantPaye: 0,
    acompteDelivrer: 0,
  });

  /* =========================
     CALCULS AUTOMATIQUES
  ========================== */
  useEffect(() => {
    // Calcul du total HT des travaux
    const totalHT = lignesTravaux.reduce((sum, ligne) => sum + ligne.prixTotal, 0);

    // Calcul du total global HT
    const totalGlobalHT = totalHT + calculs.revisionPrix;
    
    // Calcul TVA
    let tvaMontant;
    if (calculs.tvaPourcentage > 0) {
      tvaMontant = totalGlobalHT * (calculs.tvaPourcentage / 100);
    } else {
      tvaMontant = calculs.tvaMontant;
    }
    
    // Calcul total TTC
    const totalGlobalTTC = totalGlobalHT + tvaMontant;

    setCalculs(prev => ({
      ...prev,
      totalHT,
      totalGlobalHT,
      tvaMontant,
      totalGlobalTTC,
    }));
  }, [lignesTravaux, calculs.revisionPrix, calculs.tvaPourcentage, calculs.tvaMontant]);

  /* =========================
     GESTION DES FORMULAIRES
  ========================== */
  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSignatureChange = (field, value) => {
    setSignatures({ ...signatures, [field]: value });
  };

  const handleDepenseChange = (field, value) => {
    setDepenses({
      ...depenses,
      [field]: parseFloat(value) || 0
    });
  };

  const handleCalculChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    
    if (field === 'tvaPourcentage') {
      setCalculs({
        ...calculs,
        tvaPourcentage: numValue,
        tvaMontant: 0,
      });
    } else if (field === 'tvaMontant') {
      setCalculs({
        ...calculs,
        tvaMontant: numValue,
        tvaPourcentage: 0,
      });
    } else {
      setCalculs({
        ...calculs,
        [field]: numValue
      });
    }
  };

  /* =========================
     FONCTION POUR TÉLÉCHARGER PDF
  ========================== */
  const downloadPDF = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      const input = pdfRef.current;
      html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`decompte_${formData.numeroMarche}_${new Date().toISOString().split('T')[0]}.pdf`);
        setIsPrintMode(false);
      });
    }, 100);
  };

  /* =========================
     FONCTION POUR IMPRIMER
  ========================== */
  const printDocument = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  /* =========================
     TÉLÉCHARGEMENT EXCEL
  ========================== */
  const downloadExcel = () => {
    const wsData = [
      ["DÉCOMPTE DE TRAVAUX"],
      [`N° Marché: ${formData.numeroMarche}`],
      [`Objet: ${formData.objet}`],
      [`Date: ${formData.dateExecution}`],
      [],
      ["N° prix", "Désignation des prestations", "Unité", "Quantité", "Prix unitaire hors TVA (DH)", "Prix total hors TVA (DH)"]
    ];

    lignesTravaux.forEach(ligne => {
      wsData.push([
        ligne.id,
        ligne.designation,
        ligne.unite,
        ligne.quantite,
        formatNumber(ligne.prixUnitaire),
        formatNumber(ligne.prixTotal)
      ]);
    });

    wsData.push([]);
    wsData.push(["TOTAL HORS TAXES", "", "", "", "", formatNumber(calculs.totalHT)]);
    wsData.push(["TOTAL GLOBAL HORS TAXES", "", "", "", "", formatNumber(calculs.totalGlobalHT)]);
    wsData.push([`MONTANT DE LA TVA ${calculs.tvaPourcentage}%`, "", "", "", "", formatNumber(calculs.tvaMontant)]);
    wsData.push(["TOTAL GLOBAL TTC", "", "", "", "", formatNumber(calculs.totalGlobalTTC)]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Décompte");
    
    XLSX.writeFile(wb, `decompte_${formData.numeroMarche}.xlsx`);
  };

  /* =========================
     FONCTIONS UTILITAIRES
  ========================== */
  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  /* =========================
     RENDER PRINCIPAL
  ========================== */
  return (
    <section className="decomptes-container">
      {/* Afficher un message si les données viennent de l'attachement */}
      {fromAttachement && (
        <div className="import-success-message">
          ✅ Décompte créé à partir de l'attachement {numeroAttachement} du {dateAttachement}
          <br />
          {lignesTravaux.length} lignes importées
        </div>
      )}

      {/* Version édition (affichée normalement) */}
      <div ref={pdfRef} className="decompte-pdf-view">
        {/* En-tête */}
        <div className="header-edition">
          <div className="header-left">
            <div className="ministry">
              ROYAUME DU MAROC<br />
              MINISTERE DE L'AGRICULTURE,<br />
              DE LA PECHE MARITIME, DU<br />
              DEVELOPPEMENT RURAL ET DES EAUX<br />
              ET FORETS<br />
              OFFICE REGIONAL DE MISE EN VALEUR<br />
              AGRICOLE DE OUARZAZATE
            </div>
          </div>
          
          <div className="header-right">
            <div className="fiche-title">FICHE DE DEPENSE</div>
            <div className="fiche-details">
              <div className="input-group">
                <label>EXERCICE</label>
                <input
                  type="text"
                  value={formData.exercice}
                  onChange={(e) => handleFormChange('exercice', e.target.value)}
                  className="input-small"
                />
              </div>
              <div className="input-group">
                <label>PARTIE</label>
                <input
                  type="text"
                  value={formData.partie}
                  onChange={(e) => handleFormChange('partie', e.target.value)}
                  className="input-small"
                />
              </div>
              <div className="input-group">
                <label>CHAPITRE</label>
                <input
                  type="text"
                  value={formData.chapitre}
                  onChange={(e) => handleFormChange('chapitre', e.target.value)}
                  className="input-small"
                />
              </div>
              <div className="input-group">
                <label>ARTICLE</label>
                <input
                  type="text"
                  value={formData.article}
                  onChange={(e) => handleFormChange('article', e.target.value)}
                  className="input-small"
                />
              </div>
              <div className="input-group">
                <label>PARAGRAPHE</label>
                <input
                  type="text"
                  value={formData.paragraphe}
                  onChange={(e) => handleFormChange('paragraphe', e.target.value)}
                  className="input-small"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Imputation source financement */}
        <div className="imputation-section">
          <strong>Imputation source financement</strong>
        </div>

        {/* Informations du marché */}
        <div className="marche-info">
          <div className="info-row">
            <strong>MARCHE N° :</strong>
            <input
              type="text"
              value={formData.numeroMarche}
              onChange={(e) => handleFormChange('numeroMarche', e.target.value)}
              className="input-medium"
              placeholder="......"
            />
          </div>
          <div className="info-row">
            <strong>Objet :</strong>
            <input
              type="text"
              value={formData.objet}
              onChange={(e) => handleFormChange('objet', e.target.value)}
              className="input-large"
              placeholder="......"
            />
          </div>
        </div>

        {/* Informations entreprise */}
        <div className="entreprise-info">
          <div className="info-row">
            <strong>M.</strong>
            <input
              type="text"
              value={formData.nomSociete}
              onChange={(e) => handleFormChange('nomSociete', e.target.value)}
              className="input-medium"
              placeholder="......"
            />
            <strong>A.</strong>
            <input
              type="text"
              value={formData.ville}
              onChange={(e) => handleFormChange('ville', e.target.value)}
              className="input-medium"
              placeholder="......"
            />
          </div>
          
          <div className="info-row">
            <strong>Montant de l'acompte</strong>
            <input
              type="text"
              value={formData.montantAcompte}
              onChange={(e) => handleFormChange('montantAcompte', e.target.value)}
              className="input-medium"
              placeholder="81.000,00 DHS"
            />
          </div>
          
          <div className="info-row">
            <strong>R.C. N° :</strong>
            <input
              type="text"
              value={formData.rc}
              onChange={(e) => handleFormChange('rc', e.target.value)}
              className="input-medium"
              placeholder="......"
            />
            <strong>A</strong>
          </div>
          
          <div className="info-row">
            <strong>CREDIT DU MAROC N° :</strong>
            <input
              type="text"
              value={formData.compteEntreprise}
              onChange={(e) => handleFormChange('compteEntreprise', e.target.value)}
              className="input-medium"
              placeholder="xxxxxxxxxxxxxxxxxxxxxx"
            />
            <strong>A AGENCE</strong>
            <input
              type="text"
              value={formData.villeOuvertureCompte}
              onChange={(e) => handleFormChange('villeOuvertureCompte', e.target.value)}
              className="input-small"
              placeholder="......"
            />
          </div>
          
          <div className="info-row">
            <strong>OUVERT AU NOM DE LA SOCIETE</strong>
            <input
              type="text"
              value={formData.nomSociete}
              onChange={(e) => handleFormChange('nomSociete', e.target.value)}
              className="input-large"
              placeholder="......"
            />
          </div>
          
          <div className="info-row">
            <strong>C.N.S.S N° :</strong>
            <input
              type="text"
              value={formData.cnss}
              onChange={(e) => handleFormChange('cnss', e.target.value)}
              className="input-medium"
              placeholder="......"
            />
            <strong>PATENTE N° :</strong>
            <input
              type="text"
              value={formData.patente}
              onChange={(e) => handleFormChange('patente', e.target.value)}
              className="input-medium"
              placeholder="......"
            />
          </div>
        </div>

        {/* Marché approuvé */}
        <div className="marche-approuve">
          <div className="info-row">
            <strong>Marché O.R.M.V.A.O. Approuvé le</strong>
            <input
              type="text"
              value={formData.dateApprobation}
              onChange={(e) => handleFormChange('dateApprobation', e.target.value)}
              className="input-medium"
              placeholder="......"
            />
            <strong>par {formData.directeur}</strong>
          </div>
        </div>

        {/* Titre du décompte */}
        <div className="decompte-title">
          <h2>DECOMPTE PROVISOIRE N° <input type="text" className="input-numero-decompte" placeholder="X" /></h2>
          <h3>des prestations exécutées et des dépenses faites à la date du <input type="text" value={formData.dateExecution} onChange={(e) => handleFormChange('dateExecution', e.target.value)} className="input-date-decompte" /></h3>
        </div>

        {/* Tableau des travaux - STRUCTURE IDENTIQUE À L'IMAGE */}
        <table className="travaux-table">
          <thead>
            <tr>
              <th>N° prix</th>
              <th>Désignation des prestations</th>
              <th>Unité</th>
              <th>Quantité</th>
              <th>Prix unitaire hors TVA (DH)</th>
              <th>Prix total hors TVA (DH)</th>
              {!isPrintMode && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {lignesTravaux.map((ligne, index) => (
              <tr key={ligne.id}>
                <td>{ligne.id}</td>
                <td>{renderCell(ligne, index, 'designation', isPrintMode)}</td>
                <td>{renderCell(ligne, index, 'unite', isPrintMode)}</td>
                <td>{renderCell(ligne, index, 'quantite', isPrintMode)}</td>
                <td>{renderCell(ligne, index, 'prixUnitaire', isPrintMode)}</td>
                <td>{renderCell(ligne, index, 'prixTotal', isPrintMode)}</td>
                {!isPrintMode && (
                  <td>
                    <button 
                      className="btn-delete-line"
                      onClick={() => deleteLine(index)}
                    >
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Section récapitulative - STRUCTURE IDENTIQUE À L'IMAGE */}
        <div className="recap-section">
          <div className="recap-row">
            <span>TOTAL HORS TAXES</span>
            <span className="recap-value">{formatNumber(calculs.totalHT)}</span>
          </div>
          
          <div className="recap-row">
            <span>TOTAL GLOBAL HORS TAXES</span>
            <span className="recap-value">{formatNumber(calculs.totalGlobalHT)}</span>
          </div>
          
          <div className="recap-row tva-row">
            <span>MONTANT DE LA TVA {calculs.tvaPourcentage}%</span>
            {!isPrintMode ? (
              <div className="tva-inputs">
                <div className="tva-percentage">
                  <span>%</span>
                  <input
                    type="number"
                    value={calculs.tvaPourcentage}
                    onChange={(e) => handleCalculChange('tvaPourcentage', e.target.value)}
                    className="input-tva-percent"
                  />
                </div>
                <div className="tva-separator">ou</div>
                <div className="tva-amount">
                  <span>Montant</span>
                  <input
                    type="number"
                    value={calculs.tvaMontant}
                    onChange={(e) => handleCalculChange('tvaMontant', e.target.value)}
                    className="input-tva-amount"
                  />
                </div>
              </div>
            ) : (
              <span className="recap-value">{formatNumber(calculs.tvaMontant)}</span>
            )}
          </div>
          
          <div className="recap-row total-row">
            <span>TOTAL GLOBAL TTC</span>
            <span className="recap-value">{formatNumber(calculs.totalGlobalTTC)}</span>
          </div>
        </div>

        {/* Section signatures - STRUCTURE MODIFIÉE */}
        <div className="signatures-section">
          <div className="signatures-grid">
            <div className="signature-block">
              <div className="signature-line">Le Chargé de suivi</div>
              {!isPrintMode ? (
                <input
                  type="text"
                  value={signatures.chargeSuivi}
                  onChange={(e) => handleSignatureChange('chargeSuivi', e.target.value)}
                  className="signature-input"
                  placeholder="Nom et signature"
                />
              ) : (
                <div className="signature-space"></div>
              )}
            </div>
            
            <div className="signature-block">
              <div className="signature-line">Le Chef de département</div>
              {!isPrintMode ? (
                <input
                  type="text"
                  value={signatures.chefDepartement}
                  onChange={(e) => handleSignatureChange('chefDepartement', e.target.value)}
                  className="signature-input"
                  placeholder="Nom et signature"
                />
              ) : (
                <div className="signature-space"></div>
              )}
            </div>
            
            <div className="signature-block service-block">
              <div className="signature-line">Le Chef de service</div>
              {!isPrintMode ? (
                <div className="service-selection">
                  <select
                    value={signatures.serviceType}
                    onChange={(e) => handleSignatureChange('serviceType', e.target.value)}
                    className="service-select"
                  >
                    {serviceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {signatures.serviceType && (
                    <div className="selected-service">{signatures.serviceType}</div>
                  )}
                </div>
              ) : (
                <div className="signature-space service-space"></div>
              )}
            </div>
          </div>
        </div>

        {/* Bouton ajouter ligne (uniquement en mode édition) */}
        {!isPrintMode && (
          <div className="add-line-section">
            <button onClick={addNewLine} className="btn-add-line">
              + Ajouter une ligne
            </button>
          </div>
        )}
      </div>

      {/* Boutons d'action (uniquement en mode édition) */}
      {!isPrintMode && (
        <div className="action-buttons-bottom">
          <button onClick={() => alert("Décompte enregistré !")} className="btn-save">
            💾 Enregistrer le décompte
          </button>
          <button onClick={downloadExcel} className="btn-excel">
            📊 Télécharger Excel
          </button>
          <button onClick={downloadPDF} className="btn-pdf">
            📄 Télécharger PDF
          </button>
          <button onClick={printDocument} className="btn-print">
            🖨️ Imprimer
          </button>
          <button onClick={() => navigate(`/marches/${id}/attachements`)} className="btn-back">
            ↩️ Retour à l'attachement
          </button>
        </div>
      )}
    </section>
  );
}

export default DecomptesPage;