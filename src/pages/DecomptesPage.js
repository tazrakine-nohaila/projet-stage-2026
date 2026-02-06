import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './DecomptesPage.css';

const DecomptePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // États principaux
  const [numeroDecompte, setNumeroDecompte] = useState('001');
  const [dateDecompte, setDateDecompte] = useState(new Date().toISOString().split('T')[0]);
  const [periodeDecompte, setPeriodeDecompte] = useState('');
  const [aoNumber, setAoNumber] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [tauxTVA, setTauxTVA] = useState(20);
  
  // États pour les items (initialisés depuis location.state)
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(null);

  // Initialisation des données depuis location.state
  useEffect(() => {
    if (location.state?.attachementData) {
      const { 
        numeroAttachement, 
        dateAttachement, 
        aoNumber: aoNum, 
        projectTitle: title, 
        items: attachementItems,
        tauxTVA: tva 
      } = location.state.attachementData;
      
      // Préparer les items pour le décompte
      const decompteItems = attachementItems.map(item => ({
        ...item,
        id: item.id || Date.now() + Math.random(),
        quantiteCumulee: 0, // Quantité cumulée des décomptes précédents
        quantiteDecomptee: 0, // Quantité à décompter dans ce décompte
        quantiteRestante: item.quantiteCourante, // Quantité restante à décompter
        montantDecompte: 0 // Montant = quantiteDecomptee * prixUnitaire
      }));
      
      setItems(decompteItems);
      setAoNumber(aoNum || '');
      setProjectTitle(title || '');
      setTauxTVA(tva || 20);
      
      // Générer un numéro de décompte basé sur l'attachement
      setNumeroDecompte(`DEC-${numeroAttachement}`);
      setDateDecompte(dateAttachement || new Date().toISOString().split('T')[0]);
    } else {
      // Fallback vers localStorage si pas de state
      const decompteData = JSON.parse(localStorage.getItem('decompteData') || '{}');
      if (decompteData.items && decompteData.items.length > 0) {
        setItems(decompteData.items);
        setAoNumber(decompteData.aoNumber || '');
        setProjectTitle(decompteData.projectTitle || '');
        setTauxTVA(decompteData.tauxTVA || 20);
        setNumeroDecompte(decompteData.numeroDecompte || '001');
        setDateDecompte(decompteData.dateDecompte || new Date().toISOString().split('T')[0]);
        setPeriodeDecompte(decompteData.periodeDecompte || '');
      }
    }
  }, [location.state]);

  // Afficher un message temporaire
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Mettre à jour la quantité décomptée
  const updateQuantiteDecomptee = (id, newQuantite) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const quantiteNum = parseFloat(newQuantite) || 0;
        const quantiteRestante = item.quantiteRestante || item.quantiteCourante;
        
        // Validation : ne pas dépasser la quantité restante
        if (quantiteNum > quantiteRestante) {
          showMessage(`La quantité ne peut pas dépasser ${quantiteRestante.toFixed(2)}`, 'error');
          return item;
        }
        
        const montantDecompte = quantiteNum * (item.prixUnitaire || 0);
        
        return {
          ...item,
          quantiteDecomptee: quantiteNum,
          montantDecompte: montantDecompte
        };
      }
      return item;
    }));
  };

  // Calculer les totaux
  const calculateTotals = () => {
    const totalDecompteHT = items.reduce((sum, item) => sum + (item.montantDecompte || 0), 0);
    const totalTVA = totalDecompteHT * (tauxTVA / 100);
    const totalDecompteTTC = totalDecompteHT + totalTVA;
    
    const totalInitialHT = items.reduce((sum, item) => {
      const totalItem = (item.quantiteCourante || 0) * (item.prixUnitaire || 0);
      return sum + totalItem;
    }, 0);
    
    const totalCumuleHT = items.reduce((sum, item) => sum + (item.quantiteCumulee || 0) * (item.prixUnitaire || 0), 0);
    const totalRestantHT = totalInitialHT - totalCumuleHT - totalDecompteHT;
    
    return { 
      totalDecompteHT, 
      totalTVA, 
      totalDecompteTTC,
      totalInitialHT,
      totalCumuleHT,
      totalRestantHT
    };
  };

  const totals = calculateTotals();

  // Télécharger en Excel
  const downloadExcel = () => {
    if (items.length === 0) {
      showMessage('Aucune donnée à exporter', 'error');
      return;
    }

    const ws_data = [
      [`DÉCOMPTE N° ${numeroDecompte}`],
      [`Date: ${new Date(dateDecompte).toLocaleDateString('fr-FR')}`],
      [`Période: ${periodeDecompte || 'Non spécifiée'}`],
      [`AOOI N° : ${aoNumber}`],
      [projectTitle],
      [],
      ['DÉCOMPTE DES QUANTITÉS'],
      [],
      ['N° Prix', 'Désignation', 'Unité', 'Qté Initiale', 'Qté Cumulée', 'Qté à décompter', 'Qté Restante', 'Prix unitaire (HT)', 'Montant']
    ];

    items.forEach(item => {
      const quantiteRestante = (item.quantiteRestante || item.quantiteCourante) - (item.quantiteDecomptee || 0);
      ws_data.push([
        item.numero,
        item.designation,
        item.unite,
        item.quantiteCourante,
        item.quantiteCumulee || 0,
        item.quantiteDecomptee || 0,
        Math.max(0, quantiteRestante).toFixed(2),
        item.prixUnitaire,
        item.montantDecompte || 0
      ]);
    });

    ws_data.push([]);
    ws_data.push(['', '', '', '', '', '', '', 'TOTAL DÉCOMPTE HT', totals.totalDecompteHT]);
    ws_data.push(['', '', '', '', '', '', '', `TVA (${tauxTVA}%)`, totals.totalTVA]);
    ws_data.push(['', '', '', '', '', '', '', 'TOTAL DÉCOMPTE TTC', totals.totalDecompteTTC]);
    ws_data.push([]);
    ws_data.push(['', '', '', '', '', '', '', 'TOTAL INITIAL HT', totals.totalInitialHT]);
    ws_data.push(['', '', '', '', '', '', '', 'TOTAL CUMULÉ HT', totals.totalCumuleHT]);
    ws_data.push(['', '', '', '', '', '', '', 'TOTAL RESTANT HT', totals.totalRestantHT]);

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    
    ws['!cols'] = [
      { wch: 10 },
      { wch: 45 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Décompte');
    
    XLSX.writeFile(wb, `Decompte_${numeroDecompte}_${aoNumber.replace(/\//g, '-')}.xlsx`);
    showMessage('Excel téléchargé avec succès', 'success');
  };

  // Télécharger en PDF
  const downloadPDF = () => {
    if (items.length === 0) {
      showMessage('Aucune donnée à exporter', 'error');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    
    // En-tête
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`DÉCOMPTE N° ${numeroDecompte}`, 14, 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(dateDecompte).toLocaleDateString('fr-FR')}`, 14, 22);
    
    if (periodeDecompte) {
      doc.text(`Période: ${periodeDecompte}`, 14, 29);
    }
    
    doc.text(`AOOI N° : ${aoNumber}`, 14, 36);
    
    const titleLines = doc.splitTextToSize(projectTitle, 260);
    let startY = 36;
    titleLines.forEach(line => {
      doc.text(line, 14, startY + 5);
      startY += 5;
    });
    
    startY += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉCOMPTE DES QUANTITÉS', 14, startY);
    
    startY += 10;

    // Tableau des données
    const tableData = items.map(item => {
      const quantiteRestante = (item.quantiteRestante || item.quantiteCourante) - (item.quantiteDecomptee || 0);
      return [
        item.numero,
        item.designation,
        item.unite,
        item.quantiteCourante.toLocaleString('fr-FR', { minimumFractionDigits: 2 }),
        (item.quantiteCumulee || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 }),
        (item.quantiteDecomptee || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 }),
        Math.max(0, quantiteRestante).toLocaleString('fr-FR', { minimumFractionDigits: 2 }),
        item.prixUnitaire.toLocaleString('fr-FR', { minimumFractionDigits: 2 }),
        (item.montantDecompte || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })
      ];
    });

    doc.autoTable({
      head: [['N°', 'Désignation', 'Unité', 'Qté Init.', 'Qté Cum.', 'Qté Décomp.', 'Qté Rest.', 'P.U. (HT)', 'Montant']],
      body: tableData,
      startY: startY,
      theme: 'grid',
      styles: { 
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 65 },
        2: { cellWidth: 15 },
        3: { cellWidth: 20, halign: 'right' },
        4: { cellWidth: 20, halign: 'right' },
        5: { cellWidth: 20, halign: 'right' },
        6: { cellWidth: 20, halign: 'right' },
        7: { cellWidth: 20, halign: 'right' },
        8: { cellWidth: 25, halign: 'right' }
      }
    });

    const finalY = doc.lastAutoTable.finalY + 5;

    // Tableau des totaux
    doc.autoTable({
      startY: finalY,
      body: [
        ['TOTAL DÉCOMPTE HT', totals.totalDecompteHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH'],
        [`TOTAL TVA (${tauxTVA}%)`, totals.totalTVA.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH'],
        ['TOTAL DÉCOMPTE TTC', totals.totalDecompteTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH'],
        ['', ''],
        ['TOTAL INITIAL HT', totals.totalInitialHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH'],
        ['TOTAL CUMULÉ HT', totals.totalCumuleHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH'],
        ['TOTAL RESTANT HT', totals.totalRestantHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH']
      ],
      theme: 'plain',
      styles: { 
        fontSize: 9,
        cellPadding: 3,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { halign: 'right', cellWidth: 185 },
        1: { halign: 'right', cellWidth: 40 }
      }
    });

    doc.save(`Decompte_${numeroDecompte}_${aoNumber.replace(/\//g, '-')}.pdf`);
    showMessage('PDF téléchargé avec succès', 'success');
  };

  // Sauvegarder le décompte
  const saveDecompte = () => {
    if (items.length === 0) {
      showMessage('Aucune donnée à sauvegarder', 'error');
      return;
    }

    const decompteData = {
      numeroDecompte,
      dateDecompte,
      periodeDecompte,
      aoNumber,
      projectTitle,
      items: items.map(item => ({
        ...item,
        quantiteCumulee: (item.quantiteCumulee || 0) + (item.quantiteDecomptee || 0),
        quantiteDecomptee: 0, // Réinitialiser pour nouveau décompte
        quantiteRestante: (item.quantiteRestante || item.quantiteCourante) - (item.quantiteDecomptee || 0)
      })),
      tauxTVA,
      totals: calculateTotals()
    };

    // Sauvegarder dans localStorage
    localStorage.setItem('decompteData', JSON.stringify(decompteData));
    
    showMessage('Décompte sauvegardé avec succès', 'success');
  };

  // Imprimer
  const handlePrint = () => {
    if (items.length === 0) {
      showMessage('Aucune donnée à imprimer', 'error');
      return;
    }
    window.print();
  };

  // Retour à l'attachement
  const goBack = () => {
    navigate(-1);
  };

  // Formatter les nombres
  const formatNumber = (num) => {
    if (isNaN(num)) return "0.00";
    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Calculer le pourcentage de réalisation
  const calculatePourcentage = () => {
    if (totals.totalInitialHT === 0) return 0;
    const realise = totals.totalCumuleHT + totals.totalDecompteHT;
    return ((realise / totals.totalInitialHT) * 100).toFixed(2);
  };

  return (
    <div className="decompte-container">
      {/* Message de notification */}
      {message && (
        <div 
          className="message-notification print-hide"
          style={{
            background: message.type === "success" ? "#4CAF50" : "#f44336"
          }}
        >
          {message.text}
        </div>
      )}

      {/* En-tête */}
      <div className="header-section">
        <div className="header-row">
          <div className="header-item">
            <label>DÉCOMPTE N° :</label>
            <input 
              type="text" 
              value={numeroDecompte}
              onChange={(e) => setNumeroDecompte(e.target.value)}
              className="header-input no-print-border"
            />
          </div>
          <div className="header-item">
            <label>Date :</label>
            <input 
              type="date" 
              value={dateDecompte}
              onChange={(e) => setDateDecompte(e.target.value)}
              className="header-input no-print-border"
            />
          </div>
          <div className="header-item">
            <label>Période :</label>
            <input 
              type="text" 
              value={periodeDecompte}
              onChange={(e) => setPeriodeDecompte(e.target.value)}
              placeholder="Ex: Juin 2024"
              className="header-input no-print-border"
            />
          </div>
        </div>
        
        <div className="ao-number">
          <strong>AOOI N° :</strong> {aoNumber}
        </div>
        
        <div className="project-title">
          {projectTitle}
        </div>

        <h2 className="page-title">DÉCOMPTE DES QUANTITÉS</h2>
      </div>

      {/* Informations TVA */}
      <div className="tva-section print-hide">
        <div className="tva-control">
          <label>
            <strong>Taux de TVA (%) :</strong>
          </label>
          <input 
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={tauxTVA}
            onChange={(e) => {
              const newTaux = parseFloat(e.target.value);
              if (newTaux >= 0 && newTaux <= 100) {
                setTauxTVA(newTaux);
              }
            }}
            className="tva-input"
          />
        </div>
      </div>

      {/* Tableau des décomptes */}
      <div className="table-wrapper">
        <table className="decompte-table">
          <thead>
            <tr>
              <th>N° Prix</th>
              <th>Désignations des prestations</th>
              <th>Unité</th>
              <th>Quantité Initiale</th>
              <th>Quantité Cumulée</th>
              <th>Quantité à décompter</th>
              <th>Quantité Restante</th>
              <th>Prix unitaire (Hors TVA)</th>
              <th>Montant Décompte</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data-message">
                  Aucune donnée. Veuillez sélectionner des items depuis l'attachement.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const quantiteRestante = (item.quantiteRestante || item.quantiteCourante) - (item.quantiteDecomptee || 0);
                const montantDecompte = (item.quantiteDecomptee || 0) * (item.prixUnitaire || 0);
                
                return (
                  <tr key={item.id}>
                    <td className="numero-cell">{item.numero}</td>
                    <td className="designation-cell">{item.designation}</td>
                    <td className="unite-cell">{item.unite}</td>
                    <td className="quantite-cell">{formatNumber(item.quantiteCourante)}</td>
                    <td className="quantite-cell">{formatNumber(item.quantiteCumulee || 0)}</td>
                    <td className="quantite-input-cell">
                      <input 
                        type="number"
                        min="0"
                        max={item.quantiteRestante || item.quantiteCourante}
                        step="0.01"
                        value={item.quantiteDecomptee || 0}
                        onChange={(e) => updateQuantiteDecomptee(item.id, e.target.value)}
                        className="quantite-input no-print-border"
                        title={`Max: ${formatNumber(item.quantiteRestante || item.quantiteCourante)}`}
                      />
                    </td>
                    <td className="quantite-cell">
                      {formatNumber(Math.max(0, quantiteRestante))}
                    </td>
                    <td className="prix-cell">{formatNumber(item.prixUnitaire)}</td>
                    <td className="montant-cell">
                      {formatNumber(montantDecompte)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {items.length > 0 && (
            <tfoot>
              <tr className="total-row">
                <td colSpan="8" className="total-label">
                  TOTAL DÉCOMPTE HT
                </td>
                <td className="total-value">{formatNumber(totals.totalDecompteHT)}</td>
              </tr>
              <tr className="total-row">
                <td colSpan="8" className="total-label">
                  TOTAL TVA ({tauxTVA} %)
                </td>
                <td className="total-value">{formatNumber(totals.totalTVA)}</td>
              </tr>
              <tr className="total-row total-ttc">
                <td colSpan="8" className="total-label">
                  TOTAL DÉCOMPTE TTC
                </td>
                <td className="total-value">{formatNumber(totals.totalDecompteTTC)}</td>
              </tr>
              <tr className="separator-row">
                <td colSpan="9" className="separator-cell"></td>
              </tr>
              <tr className="info-row">
                <td colSpan="8" className="info-label">
                  <strong>TOTAL INITIAL HT :</strong>
                </td>
                <td className="info-value">{formatNumber(totals.totalInitialHT)}</td>
              </tr>
              <tr className="info-row">
                <td colSpan="8" className="info-label">
                  <strong>TOTAL CUMULÉ HT :</strong>
                </td>
                <td className="info-value">{formatNumber(totals.totalCumuleHT)}</td>
              </tr>
              <tr className="info-row">
                <td colSpan="8" className="info-label">
                  <strong>TOTAL RESTANT HT :</strong>
                </td>
                <td className="info-value">{formatNumber(totals.totalRestantHT)}</td>
              </tr>
              <tr className="info-row">
                <td colSpan="8" className="info-label">
                  <strong>% DE RÉALISATION :</strong>
                </td>
                <td className="info-value">
                  <span className="pourcentage-realisation">
                    {calculatePourcentage()}%
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Boutons d'action */}
      <div className="action-buttons print-hide">
        <button className="btn-save" onClick={saveDecompte}>
          💾 Sauvegarder Décompte
        </button>
        <button className="btn-excel" onClick={downloadExcel}>
          📊 Télécharger Excel
        </button>
        <button className="btn-pdf" onClick={downloadPDF}>
          📄 Télécharger PDF
        </button>
        <button className="btn-print" onClick={handlePrint}>
          🖨️ Imprimer
        </button>
        <button className="btn-back" onClick={goBack}>
          ⬅️ Retour à l'Attachement
        </button>
      </div>
    </div>
  );
};

export default DecomptePage;