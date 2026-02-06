import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Attachement.css';

const Attachement = () => {
  const navigate = useNavigate();
  const [aoNumber, setAoNumber] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [items, setItems] = useState([]);
  const [tauxTVA, setTauxTVA] = useState(20);
  const [message, setMessage] = useState(null);
  
  // Nouveaux états
  const [numeroAttachement, setNumeroAttachement] = useState('001');
  const [dateAttachement, setDateAttachement] = useState(new Date().toISOString().split('T')[0]);
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    // Récupérer les données depuis localStorage
    const bordereauData = JSON.parse(localStorage.getItem('bordereauData') || '{}');
    
    if (bordereauData.items && bordereauData.items.length > 0) {
      setItems(bordereauData.items);
      setAoNumber(bordereauData.aoNumber || '');
      setProjectTitle(bordereauData.projectTitle || '');
    }
  }, []);

  // Afficher un message temporaire
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Mettre à jour la quantité d'un item
  const updateQuantite = (id, newQuantite) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const quantiteNum = parseFloat(newQuantite) || 0;
        
        if (quantiteNum > item.quantiteInitiale) {
          showMessage(`La quantité ne peut pas dépasser ${item.quantiteInitiale}`, 'error');
          return item;
        }
        
        return {
          ...item,
          quantiteCourante: quantiteNum
        };
      }
      return item;
    }));
  };

  // Supprimer un item avec confirmation
  const deleteItem = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
      setItems(items.filter(item => item.id !== id));
      selectedItems.delete(id);
      setSelectedItems(new Set(selectedItems));
      showMessage('Ligne supprimée avec succès', 'success');
    }
  };

  // Gérer la sélection d'items
  const toggleItemSelection = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // Sélectionner/Désélectionner tous les items
  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  // Importer un fichier Excel
  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Supposons que la première ligne contient les en-têtes
        // Format attendu: N° Prix | Désignations | Unité | Quantité Initiale | Quantité Courante | Prix unitaire
        const headers = jsonData[0];
        const rows = jsonData.slice(1);

        const importedItems = rows
          .filter(row => row.length > 0 && row[0]) // Ignorer les lignes vides
          .map((row, index) => ({
            id: Date.now() + index,
            numero: row[0] || '',
            designation: row[1] || '',
            unite: row[2] || '',
            quantiteInitiale: parseFloat(row[3]) || 0,
            quantiteCourante: parseFloat(row[4]) || parseFloat(row[3]) || 0,
            prixUnitaire: parseFloat(row[5]) || 0
          }));

        if (importedItems.length === 0) {
          showMessage('Aucune donnée valide trouvée dans le fichier Excel', 'error');
          return;
        }

        setItems(importedItems);
        showMessage(`${importedItems.length} lignes importées avec succès`, 'success');
      } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        showMessage('Erreur lors de l\'importation du fichier Excel', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = ''; // Reset input
  };

  // Naviguer vers la page de décompte avec les lignes cochées
  const goToDecompte = () => {
    if (selectedItems.size === 0) {
      showMessage('Veuillez sélectionner au moins une ligne pour créer un décompte', 'error');
      return;
    }

    // Filtrer uniquement les items sélectionnés
    const selectedItemsData = items.filter(item => selectedItems.has(item.id));
    
    // Préparer les données pour la page de décompte
    const decompteData = {
      numeroAttachement,
      dateAttachement,
      aoNumber,
      projectTitle,
      items: selectedItemsData,
      tauxTVA
    };

    // Sauvegarder dans localStorage
    localStorage.setItem('decompteData', JSON.stringify(decompteData));
    
    console.log('Navigation vers DecomptesPage avec les données:', decompteData);
    
    // Naviguer vers la page de décompte
    navigate('/decomptes/nouveau', { 
      state: { 
        titre: projectTitle,
        attachementData: decompteData 
      } 
    });
  };

  // Calculer les totaux
  const calculateTotals = () => {
    const totalHT = items.reduce((sum, item) => {
      const prixTotal = (item.quantiteCourante || 0) * (item.prixUnitaire || 0);
      return sum + prixTotal;
    }, 0);
    const totalTVA = totalHT * (tauxTVA / 100);
    const totalTTC = totalHT + totalTVA;
    return { totalHT, totalTVA, totalTTC };
  };

  const totals = calculateTotals();

  // Télécharger en Excel
  const downloadExcel = () => {
    const ws_data = [
      [`Attachement N° ${numeroAttachement}`],
      [`Date: ${new Date(dateAttachement).toLocaleDateString('fr-FR')}`],
      [aoNumber],
      [projectTitle],
      [],
      ['ATTACHEMENT - BORDEREAU DES PRIX'],
      [],
      ['N° Prix', 'Désignations des prestations', 'Unité', 'Quantité Initiale', 'Quantité Courante', 'Prix unitaire (Hors TVA)', 'Total']
    ];

    items.forEach(item => {
      const prixTotal = (item.quantiteCourante || 0) * (item.prixUnitaire || 0);
      ws_data.push([
        item.numero,
        item.designation,
        item.unite,
        item.quantiteInitiale,
        item.quantiteCourante,
        item.prixUnitaire,
        prixTotal
      ]);
    });

    ws_data.push([]);
    ws_data.push(['', '', '', '', '', 'TOTAL HORS TVA', totals.totalHT]);
    ws_data.push(['', '', '', '', '', `TOTAL TVA (${tauxTVA}%)`, totals.totalTVA]);
    ws_data.push(['', '', '', '', '', 'TOTAL TTC', totals.totalTTC]);

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    
    ws['!cols'] = [
      { wch: 10 },
      { wch: 50 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 18 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attachement');
    
    XLSX.writeFile(wb, `Attachement_${numeroAttachement}_${aoNumber.replace(/\//g, '-')}.xlsx`);
    showMessage('Excel téléchargé avec succès', 'success');
  };

  // Télécharger en PDF
  const downloadPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // En-tête
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Attachement N° ${numeroAttachement}`, 14, 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(dateAttachement).toLocaleDateString('fr-FR')}`, 14, 22);
    
    doc.text(`AOOI N° : ${aoNumber}`, 14, 29);
    
    const titleLines = doc.splitTextToSize(projectTitle, 260);
    doc.text(titleLines, 14, 36);
    
    let startY = 36 + (titleLines.length * 5) + 5;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ATTACHEMENT - BORDEREAU DES PRIX', 14, startY);
    
    startY += 10;
    
    const tableData = items.map(item => {
      const prixTotal = (item.quantiteCourante || 0) * (item.prixUnitaire || 0);
      return [
        item.numero,
        item.designation,
        item.unite,
        item.quantiteInitiale.toLocaleString('fr-FR'),
        item.quantiteCourante.toLocaleString('fr-FR'),
        item.prixUnitaire.toLocaleString('fr-FR', { minimumFractionDigits: 2 }),
        prixTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })
      ];
    });

    doc.autoTable({
      head: [['N° Prix', 'Désignations', 'Unité', 'Qté Init.', 'Qté Cour.', 'P.U. (HT)', 'Total']],
      body: tableData,
      startY: startY,
      theme: 'grid',
      styles: { 
        fontSize: 9,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 90 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25, halign: 'right' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 30, halign: 'right' },
        6: { cellWidth: 30, halign: 'right' }
      }
    });

    const finalY = doc.lastAutoTable.finalY + 5;

    doc.autoTable({
      startY: finalY,
      body: [
        ['TOTAL HORS TVA', totals.totalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH'],
        [`TOTAL TVA (${tauxTVA}%)`, totals.totalTVA.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH'],
        ['TOTAL TTC', totals.totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH']
      ],
      theme: 'plain',
      styles: { 
        fontSize: 10,
        cellPadding: 3,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { halign: 'right', cellWidth: 207 },
        1: { halign: 'right', cellWidth: 30 }
      }
    });

    doc.save(`Attachement_${numeroAttachement}_${aoNumber.replace(/\//g, '-')}.pdf`);
    showMessage('PDF téléchargé avec succès', 'success');
  };

  // Imprimer
  const handlePrint = () => {
    window.print();
  };

  // Retour
  const goBack = () => {
    window.history.back();
  };

  // Formatter les nombres
  const formatNumber = (num) => {
    if (isNaN(num)) return "0.00";
    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="attachement-container">
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

      {/* En-tête modifiable */}
      <div className="header-section">
        <div className="header-row">
          <div className="header-item">
            <label>Attachement N° :</label>
            <input 
              type="text" 
              value={numeroAttachement}
              onChange={(e) => setNumeroAttachement(e.target.value)}
              className="header-input"
            />
          </div>
          <div className="header-item">
            <label>Date :</label>
            <input 
              type="date" 
              value={dateAttachement}
              onChange={(e) => setDateAttachement(e.target.value)}
              className="header-input"
            />
          </div>
        </div>
        
        <div className="ao-number-display">
          AOOI N° : {aoNumber}
        </div>
        
        <div className="project-title-display">
          {projectTitle}
        </div>

        <h2>ATTACHEMENT - BORDEREAU DES PRIX</h2>
      </div>

      {/* Contrôles */}
      <div className="controls-section print-hide">
        <div className="tva-control">
          <label htmlFor="tauxTVA">
            <strong>Taux de TVA (%) :</strong>
          </label>
          <input 
            id="tauxTVA"
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

        <div className="import-control">
          <label htmlFor="importExcel" className="btn-import">
            📥 Importer Excel
          </label>
          <input 
            id="importExcel"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Tableau des items */}
      <div className="table-wrapper">
        <table className="attachement-table">
          <thead>
            <tr>
              <th className="print-hide">
                <input 
                  type="checkbox"
                  checked={selectedItems.size === items.length && items.length > 0}
                  onChange={toggleSelectAll}
                  title="Sélectionner tout"
                />
              </th>
              <th>N° Prix</th>
              <th>Désignations des prestations</th>
              <th>Unité</th>
              <th>Quantité Initiale</th>
              <th>Quantité Courante</th>
              <th>Prix unitaire (Hors TVA)</th>
              <th>Total</th>
              <th className="print-hide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  Aucune donnée. Importez un bordereau ou un fichier Excel.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const prixTotal = (item.quantiteCourante || 0) * (item.prixUnitaire || 0);
                return (
                  <tr key={item.id} className={selectedItems.has(item.id) ? 'selected-row' : ''}>
                    <td className="print-hide">
                      <input 
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                      />
                    </td>
                    <td>{item.numero}</td>
                    <td className="designation-cell">{item.designation}</td>
                    <td>{item.unite}</td>
                    <td className="quantite-cell">
                      {item.quantiteInitiale.toLocaleString('fr-FR')}
                    </td>
                    <td className="quantite-cell">
                      <input 
                        type="number"
                        min="0"
                        max={item.quantiteInitiale}
                        step="0.01"
                        value={item.quantiteCourante}
                        onChange={(e) => updateQuantite(item.id, e.target.value)}
                        className="quantite-input"
                        title={`Max: ${item.quantiteInitiale}`}
                      />
                    </td>
                    <td className="prix-cell">
                      {formatNumber(item.prixUnitaire)}
                    </td>
                    <td className="total-cell">
                      {formatNumber(prixTotal)}
                    </td>
                    <td className="print-hide">
                      <button 
                        className="btn-delete"
                        onClick={() => deleteItem(item.id)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {items.length > 0 && (
            <tfoot>
              <tr className="total-row">
                <td colSpan="7">TOTAL HORS TVA</td>
                <td>{formatNumber(totals.totalHT)}</td>
                <td className="print-hide"></td>
              </tr>
              <tr className="total-row">
                <td colSpan="7">TOTAL TVA ({tauxTVA} %)</td>
                <td>{formatNumber(totals.totalTVA)}</td>
                <td className="print-hide"></td>
              </tr>
              <tr className="total-row total-ttc">
                <td colSpan="7">TOTAL TTC</td>
                <td>{formatNumber(totals.totalTTC)}</td>
                <td className="print-hide"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Boutons d'action */}
      <div className="action-buttons print-hide">
        <button className="btn-decompte" onClick={goToDecompte} disabled={selectedItems.size === 0}>
          📋 Créer Décompte ({selectedItems.size})
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
          ⬅️ Retour
        </button>
      </div>
    </div>
  );
};

export default Attachement;
