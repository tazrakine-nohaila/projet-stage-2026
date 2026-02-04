import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Attachement.css';

const Attachement = () => {
  const [aoNumber, setAoNumber] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    // Récupérer les données depuis localStorage
    const items = JSON.parse(localStorage.getItem('selectedItems') || '[]');
    const ao = localStorage.getItem('aoNumber') || '';
    const title = localStorage.getItem('projectTitle') || '';
    
    setSelectedItems(items);
    setAoNumber(ao);
    setProjectTitle(title);
  }, []);

  // Calculer les totaux
  const calculateTotals = () => {
    const totalHT = selectedItems.reduce((sum, item) => sum + (item.prixTotal || 0), 0);
    const totalTVA = totalHT * 0.20;
    const totalTTC = totalHT + totalTVA;
    return { totalHT, totalTVA, totalTTC };
  };

  const totals = calculateTotals();

  // Télécharger en Excel
  const downloadExcel = () => {
    const ws_data = [
      [aoNumber],
      [projectTitle],
      [],
      ['BORDEREAU DES PRIX - DETAIL ESTIMATIF'],
      [],
      ['N° Prix', 'Désignations des prestations', 'Unité de mesure ou de compte', 'Quantité', 'Prix unitaire en Dhs (Hors TVA)', 'Total en chiffres']
    ];

    selectedItems.forEach(item => {
      ws_data.push([
        item.noPrix,
        item.designation,
        item.unite,
        item.quantite,
        item.prixUnitaire,
        item.prixTotal
      ]);
    });

    ws_data.push([]);
    ws_data.push(['', '', '', '', 'TOTAL HORS TVA', totals.totalHT]);
    ws_data.push(['', '', '', '', 'TOTAL TVA (Taux TVA = 20%)', totals.totalTVA]);
    ws_data.push(['', '', '', '', 'TOTAL TTC', totals.totalTTC]);

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    
    // Définir les largeurs de colonnes
    ws['!cols'] = [
      { wch: 10 },
      { wch: 50 },
      { wch: 15 },
      { wch: 12 },
      { wch: 20 },
      { wch: 18 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bordereau');
    
    XLSX.writeFile(wb, `Bordereau_${aoNumber.replace(/\//g, '-')}.xlsx`);
  };

  // Télécharger en PDF
  const downloadPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape pour plus d'espace
    
    // En-tête
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`AOOI N° : ${aoNumber}`, 14, 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const titleLines = doc.splitTextToSize(projectTitle, 260);
    doc.text(titleLines, 14, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BORDEREAU DES PRIX - DETAIL ESTIMATIF', 14, 40);

    // Tableau
    const tableData = selectedItems.map(item => [
      item.noPrix,
      item.designation,
      item.unite,
      item.quantite.toLocaleString('fr-FR'),
      item.prixUnitaire.toLocaleString('fr-FR', { minimumFractionDigits: 2 }),
      item.prixTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })
    ]);

    doc.autoTable({
      startY: 50,
      head: [[
        'N° Prix',
        'Désignations des prestations',
        'Unité',
        'Quantité',
        'Prix unitaire (DH)',
        'Total (DH)'
      ]],
      body: tableData,
      theme: 'grid',
      styles: { 
        fontSize: 9,
        cellPadding: 3,
        font: 'helvetica'
      },
      headStyles: { 
        fillColor: [224, 224, 224],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 20 },
        1: { halign: 'left', cellWidth: 100 },
        2: { halign: 'center', cellWidth: 30 },
        3: { halign: 'center', cellWidth: 25 },
        4: { halign: 'right', cellWidth: 35 },
        5: { halign: 'right', cellWidth: 35 }
      }
    });

    // Totaux
    const finalY = doc.lastAutoTable.finalY + 5;
    
    doc.autoTable({
      startY: finalY,
      body: [
        ['TOTAL HORS TVA', totals.totalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH'],
        ['TOTAL TVA (Taux TVA = 20%)', totals.totalTVA.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH'],
        ['TOTAL TTC', totals.totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' DH']
      ],
      theme: 'plain',
      styles: { 
        fontSize: 10,
        cellPadding: 3,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { halign: 'right', cellWidth: 210 },
        1: { halign: 'right', cellWidth: 35 }
      }
    });

    doc.save(`Bordereau_${aoNumber.replace(/\//g, '-')}.pdf`);
  };

  // Imprimer
  const handlePrint = () => {
    window.print();
  };

  // Retour à la liste
  const goBack = () => {
    window.location.href = '/'; // À adapter selon votre router
  };

  return (
    <div className="attachement-container">
      {/* En-tête */}
      <div className="header-section print-show">
        <div className="ao-number-display">
          AOOI N° : {aoNumber}
        </div>
        
        <div className="project-title-display">
          {projectTitle}
        </div>

        <h2>BORDEREAU DES PRIX - DETAIL ESTIMATIF</h2>
      </div>

      {/* Tableau des items sélectionnés */}
      <div className="table-wrapper">
        <table className="attachement-table">
          <thead>
            <tr>
              <th>N° Prix</th>
              <th>Désignations des prestations</th>
              <th>Unité de mesure ou de compte</th>
              <th>Quantité</th>
              <th>Prix unitaire en Dhs (Hors TVA) En chiffres</th>
              <th>Total en chiffres</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item) => (
              <tr key={item.id}>
                <td>{item.noPrix}</td>
                <td className="designation-cell">{item.designation}</td>
                <td>{item.unite}</td>
                <td>{item.quantite.toLocaleString('fr-FR')}</td>
                <td>{item.prixUnitaire.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
                <td className="total-cell">{item.prixTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td colSpan="5">TOTAL HORS TVA</td>
              <td>{totals.totalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr className="total-row">
              <td colSpan="5">TOTAL TVA (Taux TVA = 20 %)</td>
              <td>{totals.totalTVA.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr className="total-row total-ttc">
              <td colSpan="5">TOTAL TTC</td>
              <td>{totals.totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Boutons d'action */}
      <div className="action-buttons print-hide">
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
          ⬅️ Retour à la liste
        </button>
      </div>
    </div>
  );
};

export default Attachement;
