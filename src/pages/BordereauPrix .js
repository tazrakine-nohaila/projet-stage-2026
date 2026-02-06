import React, { useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function BordereauPrix() {
  const { id } = useParams();
  const { state: marche } = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // États
  const [aoNumber, setAoNumber] = useState('');
  const [projectTitle, setProjectTitle] = useState(marche?.titre || '');
  const [maitreOuvrage, setMaitreOuvrage] = useState(marche?.maitreOuvrage || '');
  const [marcheNumber, setMarcheNumber] = useState(marche?.numeroMarche || '');
  const [titulaire, setTitulaire] = useState(marche?.titulaire || '');
  const [objetMarche, setObjetMarche] = useState(marche?.objetMarche || '');
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState(null);

  // Afficher un message temporaire
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Fonction pour importer le fichier Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        // Extraire les données à partir de la ligne 3 (index 2)
        const extractedItems = [];
        let startRow = 3; // Ligne 4 dans Excel (index 3)
        
        for (let i = startRow; i < data.length; i++) {
          const row = data[i];
          
          // Vérifier si c'est une ligne de données valide
          if (row[0] && typeof row[0] === 'number') {
            const item = {
              id: Date.now() + i,
              noPrix: row[0],
              designation: row[1] || '',
              unite: row[2] || '',
              quantite: row[3] || 0,
              prixUnitaire: row[4] || 0,
              prixTotal: row[5] || (row[3] * row[4])
            };
            extractedItems.push(item);
          } else if (row[0] === 'TOTAL HORS TVA' || 
                     row[0]?.toString().includes('TOTAL')) {
            break; // Arrêter à la ligne des totaux
          }
        }

        setItems(extractedItems);
        showMessage(`Fichier importé avec succès ! ${extractedItems.length} lignes chargées.`, "success");
        
        // Réinitialiser l'input
        e.target.value = null;
      } catch (error) {
        console.error('Erreur lors de la lecture du fichier:', error);
        showMessage('Erreur lors de l\'importation du fichier Excel', "error");
      }
    };
    reader.readAsBinaryString(file);
  };

  // Ajouter une nouvelle ligne manuellement
  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      noPrix: items.length + 1,
      designation: '',
      unite: '',
      quantite: 0,
      prixUnitaire: 0,
      prixTotal: 0
    };
    setItems([...items, newItem]);
    showMessage("Nouvelle ligne ajoutée", "success");
  };

  // Mettre à jour un item
  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculer le prix total si quantité ou prix unitaire change
        if (field === 'quantite' || field === 'prixUnitaire') {
          updatedItem.prixTotal = (updatedItem.quantite || 0) * (updatedItem.prixUnitaire || 0);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // Supprimer un item
  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    showMessage("Ligne supprimée", "success");
  };

  // Gérer la sélection des items
  const toggleItemSelection = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Sélectionner/Désélectionner tout
  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
  };

  // Calculer les totaux
  const calculateTotals = () => {
    const totalHT = items.reduce((sum, item) => sum + (item.prixTotal || 0), 0);
    const totalTVA = totalHT * 0.20; // TVA 20%
    const totalTTC = totalHT + totalTVA;
    return { totalHT, totalTVA, totalTTC };
  };

  const totals = calculateTotals();

  // Fonction pour imprimer
  const handlePrint = () => {
    if (items.length === 0) {
      showMessage('Aucune donnée à imprimer', 'error');
      return;
    }
    window.print();
  };

  // Fonction pour télécharger en PDF
  const downloadPDF = () => {
    if (items.length === 0) {
      showMessage('Aucune donnée à télécharger', 'error');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape
    
    // En-tête
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`AOOI N° : ${aoNumber || 'Non spécifié'}`, 14, 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const titleLines = doc.splitTextToSize(projectTitle || 'Projet sans titre', 260);
    doc.text(titleLines, 14, 25);
    
    // Informations centrées
    let yPos = 35;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    
    if (maitreOuvrage) {
      doc.text(`Maître d'ouvrage : ${maitreOuvrage}`, 148, yPos, { align: 'center' });
      yPos += 6;
    }
    if (marcheNumber) {
      doc.text(`Marché N° : ${marcheNumber}`, 148, yPos, { align: 'center' });
      yPos += 6;
    }
    if (titulaire) {
      doc.text(`Titulaire du marché : ${titulaire}`, 148, yPos, { align: 'center' });
      yPos += 6;
    }
    if (objetMarche) {
      doc.setFont('helvetica', 'normal');
      const objetLines = doc.splitTextToSize(`Objet du marché : ${objetMarche}`, 260);
      doc.text(objetLines, 148, yPos, { align: 'center' });
      yPos += (objetLines.length * 5);
    }
    
    yPos += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DEVIS MARCHE', 148, yPos, { align: 'center' });
    yPos += 10;

    // Tableau des données
    const tableData = items.map(item => [
      item.noPrix,
      item.designation,
      item.unite,
      item.quantite.toLocaleString('fr-FR'),
      item.prixUnitaire.toLocaleString('fr-FR', { minimumFractionDigits: 2 }),
      item.prixTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })
    ]);

    doc.autoTable({
      startY: yPos,
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

    doc.save(`Bordereau_${aoNumber.replace(/\//g, '-') || 'document'}.pdf`);
    showMessage('PDF téléchargé avec succès', 'success');
  };

  // Naviguer vers la page Attachement avec les items sélectionnés
  const goToAttachement = () => {
    if (selectedItems.length === 0) {
      showMessage('Veuillez sélectionner au moins un élément', 'error');
      return;
    }
    
    const selectedData = items.filter(item => selectedItems.includes(item.id));
    
    // Préparer les données au format attendu par Attachements.js
    const formattedData = selectedData.map((item) => ({
      id: item.id,
      numero: item.noPrix,
      designation: item.designation,
      unite: item.unite,
      quantiteInitiale: item.quantite, // Quantité initiale (ne peut pas être dépassée)
      quantiteCourante: item.quantite, // Quantité courante (modifiable)
      prixUnitaire: item.prixUnitaire
    }));

    // Stocker dans localStorage
    localStorage.setItem('bordereauData', JSON.stringify({
      items: formattedData,
      aoNumber: aoNumber,
      projectTitle: projectTitle,
      maitreOuvrage: maitreOuvrage,
      marcheNumber: marcheNumber,
      titulaire: titulaire,
      objetMarche: objetMarche
    }));
    
    // Navigation vers Attachements
    navigate(`/marches/${id}/attachements`, { 
      state: {
        ...marche,
        bordereauItems: formattedData
      }
    });
  };

  // Retour à la liste
  const goBack = () => {
    navigate('/marches');
  };

  // Formatter les nombres
  const formatNumber = (num) => {
    if (isNaN(num)) return "0.00";
    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div style={containerStyle}>
      {/* Message de notification */}
      {message && (
        <div style={{
          ...messageStyle,
          background: message.type === "success" ? "#4CAF50" : "#f44336"
        }} className="print-hide">
          {message.text}
        </div>
      )}

      {/* En-tête */}
      <div style={headerSection}>
        <div style={aoNumberBox}>
          <label style={labelStyle}>AOOI N° :</label>
          <input 
            type="text" 
            value={aoNumber}
            onChange={(e) => setAoNumber(e.target.value)}
            style={inputStyle}
            placeholder="Ex: 78/2025/OR/OZ"
            className="no-print-border"
          />
        </div>
        
        <div style={projectTitleBox}>
          <textarea 
            placeholder="Titre du projet..."
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            rows="3"
            style={textareaStyle}
            className="no-print-border"
          />
        </div>

        {/* Informations centrées */}
        <div style={centeredInfoBox}>
          <div style={infoRow}>
            <label style={infoLabelStyle}>Maître d'ouvrage :</label>
            <input 
              type="text" 
              value={maitreOuvrage}
              onChange={(e) => setMaitreOuvrage(e.target.value)}
              style={infoInputStyle}
              placeholder="Nom du maître d'ouvrage"
              className="no-print-border"
            />
          </div>
          
          <div style={infoRow}>
            <label style={infoLabelStyle}>Marché N° :</label>
            <input 
              type="text" 
              value={marcheNumber}
              onChange={(e) => setMarcheNumber(e.target.value)}
              style={infoInputStyle}
              placeholder="Numéro du marché"
              className="no-print-border"
            />
          </div>
          
          <div style={infoRow}>
            <label style={infoLabelStyle}>Titulaire du marché :</label>
            <input 
              type="text" 
              value={titulaire}
              onChange={(e) => setTitulaire(e.target.value)}
              style={infoInputStyle}
              placeholder="Nom du titulaire"
              className="no-print-border"
            />
          </div>
          
          <div style={infoRow}>
            <label style={infoLabelStyle}>Objet du marché :</label>
            <textarea 
              value={objetMarche}
              onChange={(e) => setObjetMarche(e.target.value)}
              rows="2"
              style={infoTextareaStyle}
              placeholder="Description de l'objet du marché"
              className="no-print-border"
            />
          </div>
        </div>

        <h2 style={titleStyle}>DEVIS MARCHE</h2>
      </div>

      {/* Zone d'import et actions */}
      <div style={importSection} className="print-hide">
        <input 
          type="file" 
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button 
          onClick={() => fileInputRef.current.click()} 
          style={importButton}
        >
          📁 Importer un fichier Excel
        </button>
        <button onClick={addNewItem} style={addButton}>
          ➕ Ajouter une ligne
        </button>
        {items.length > 0 && (
          <>
            <button onClick={toggleSelectAll} style={selectAllButton}>
              {selectedItems.length === items.length ? '☑ Tout désélectionner' : '☐ Tout sélectionner'}
            </button>
            <button onClick={handlePrint} style={printButton}>
              🖨️ Imprimer
            </button>
            <button onClick={downloadPDF} style={pdfButton}>
              📄 Télécharger PDF
            </button>
          </>
        )}
      </div>

      {/* Tableau des données */}
      <div style={tableWrapper}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle} className="print-hide">☑</th>
              <th style={thStyle}>N° Prix</th>
              <th style={thStyle}>Désignations des prestations</th>
              <th style={thStyle}>Unité de mesure ou de compte</th>
              <th style={thStyle}>Quantité</th>
              <th style={thStyle}>Prix unitaire en Dhs (Hors TVA) En chiffres</th>
              <th style={thStyle}>Total en chiffres</th>
              <th style={thStyle} className="print-hide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ ...tdStyle, textAlign: 'center', padding: '40px', color: '#999' }}>
                  Aucune donnée. Importez un fichier Excel ou ajoutez des lignes manuellement.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} style={selectedItems.includes(item.id) ? selectedRowStyle : {}}>
                  <td style={tdStyle} className="print-hide">
                    <input 
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      style={checkboxStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input 
                      type="number"
                      value={item.noPrix}
                      onChange={(e) => updateItem(item.id, 'noPrix', parseInt(e.target.value) || 0)}
                      style={tableInputStyle}
                      className="no-print-border"
                    />
                  </td>
                  <td style={tdStyle}>
                    <input 
                      type="text"
                      value={item.designation}
                      onChange={(e) => updateItem(item.id, 'designation', e.target.value)}
                      style={{...tableInputStyle, textAlign: 'left'}}
                      className="no-print-border"
                    />
                  </td>
                  <td style={tdStyle}>
                    <input 
                      type="text"
                      value={item.unite}
                      onChange={(e) => updateItem(item.id, 'unite', e.target.value)}
                      style={tableInputStyle}
                      className="no-print-border"
                    />
                  </td>
                  <td style={tdStyle}>
                    <input 
                      type="number"
                      value={item.quantite}
                      onChange={(e) => updateItem(item.id, 'quantite', parseFloat(e.target.value) || 0)}
                      style={tableInputStyle}
                      className="no-print-border"
                    />
                  </td>
                  <td style={tdStyle}>
                    <input 
                      type="number"
                      step="0.01"
                      value={item.prixUnitaire}
                      onChange={(e) => updateItem(item.id, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                      style={tableInputStyle}
                      className="no-print-border"
                    />
                  </td>
                  <td style={{...tdStyle, ...totalCellStyle}}>
                    {formatNumber(item.prixTotal)}
                  </td>
                  <td style={tdStyle} className="print-hide">
                    <button 
                      onClick={() => deleteItem(item.id)}
                      style={deleteButtonStyle}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {items.length > 0 && (
            <tfoot>
              <tr style={totalRowStyle}>
                <td colSpan="6" style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold' }} className="total-colspan-print">
                  TOTAL HORS TVA
                </td>
                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{formatNumber(totals.totalHT)}</td>
                <td style={tdStyle} className="print-hide"></td>
              </tr>
              <tr style={totalRowStyle}>
                <td colSpan="6" style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold' }} className="total-colspan-print">
                  TOTAL TVA (Taux TVA = 20 %)
                </td>
                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{formatNumber(totals.totalTVA)}</td>
                <td style={tdStyle} className="print-hide"></td>
              </tr>
              <tr style={totalTTCStyle}>
                <td colSpan="6" style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold' }} className="total-colspan-print">
                  TOTAL TTC
                </td>
                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{formatNumber(totals.totalTTC)}</td>
                <td style={tdStyle} className="print-hide"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Boutons d'action */}
      <div style={actionButtonsStyle} className="print-hide">
        <button style={backButtonStyle} onClick={goBack}>
          ⬅️ Retour à la liste
        </button>
        <button 
          style={{
            ...attachementButtonStyle,
            opacity: selectedItems.length === 0 ? 0.5 : 1,
            cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer'
          }}
          onClick={goToAttachement}
          disabled={selectedItems.length === 0}
        >
          📎 Attachement ({selectedItems.length} élément{selectedItems.length > 1 ? 's' : ''} sélectionné{selectedItems.length > 1 ? 's' : ''})
        </button>
      </div>
    </div>
  );
}

// ===== STYLES =====
const containerStyle = {
  maxWidth: "1400px",
  margin: "20px auto",
  padding: "20px",
  background: "white",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  borderRadius: "8px"
};

const messageStyle = {
  position: "fixed",
  top: "20px",
  right: "20px",
  padding: "15px 25px",
  color: "white",
  borderRadius: "6px",
  zIndex: 1000,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  animation: "slideIn 0.3s ease-out",
  fontWeight: "500"
};

const headerSection = {
  marginBottom: "30px",
  padding: "20px",
  border: "2px solid #333",
  borderRadius: "6px"
};

const aoNumberBox = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px"
};

const labelStyle = {
  fontWeight: "bold",
  fontSize: "16px"
};

const inputStyle = {
  padding: "8px 12px",
  fontSize: "15px",
  fontWeight: "bold",
  border: "1px solid #ddd",
  borderRadius: "4px",
  minWidth: "200px"
};

const projectTitleBox = {
  marginBottom: "20px"
};

const textareaStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
  resize: "vertical",
  fontFamily: "Arial, sans-serif"
};

const titleStyle = {
  textAlign: "center",
  margin: "20px 0 0 0",
  fontSize: "20px",
  textDecoration: "underline"
};

const centeredInfoBox = {
  marginTop: "20px",
  marginBottom: "20px",
  padding: "15px",
  background: "#f9f9f9",
  borderRadius: "6px",
  border: "1px solid #ddd"
};

const infoRow = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  marginBottom: "12px"
};

const infoLabelStyle = {
  fontWeight: "bold",
  fontSize: "14px",
  minWidth: "180px",
  paddingTop: "8px"
};

const infoInputStyle = {
  flex: 1,
  padding: "8px 12px",
  fontSize: "14px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontFamily: "Arial, sans-serif"
};

const infoTextareaStyle = {
  flex: 1,
  padding: "8px 12px",
  fontSize: "14px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontFamily: "Arial, sans-serif",
  resize: "vertical"
};

const importSection = {
  display: "flex",
  gap: "15px",
  marginBottom: "20px",
  flexWrap: "wrap"
};

const importButton = {
  padding: "12px 24px",
  background: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
  transition: "background 0.3s"
};

const addButton = {
  padding: "12px 24px",
  background: "#2196F3",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
  transition: "background 0.3s"
};

const selectAllButton = {
  padding: "12px 24px",
  background: "#FF9800",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
  transition: "background 0.3s"
};

const printButton = {
  padding: "12px 24px",
  background: "#9C27B0",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
  transition: "background 0.3s"
};

const pdfButton = {
  padding: "12px 24px",
  background: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
  transition: "background 0.3s"
};

const tableWrapper = {
  overflowX: "auto",
  marginBottom: "30px"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  border: "2px solid #333"
};

const thStyle = {
  padding: "12px 8px",
  border: "1px solid #333",
  fontWeight: "bold",
  fontSize: "13px",
  textAlign: "center",
  background: "#e0e0e0"
};

const tdStyle = {
  padding: "8px",
  border: "1px solid #333",
  textAlign: "center",
  fontSize: "13px"
};

const tableInputStyle = {
  width: "100%",
  padding: "6px",
  border: "1px solid #ddd",
  borderRadius: "3px",
  fontSize: "13px",
  boxSizing: "border-box",
  textAlign: "center"
};

const checkboxStyle = {
  width: "18px",
  height: "18px",
  cursor: "pointer"
};

const totalCellStyle = {
  fontWeight: "bold",
  background: "#f0f0f0"
};

const selectedRowStyle = {
  background: "#e3f2fd"
};

const totalRowStyle = {
  background: "#f5f5f5"
};

const totalTTCStyle = {
  background: "#e0e0e0",
  fontSize: "15px"
};

const deleteButtonStyle = {
  background: "#f44336",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "background 0.3s"
};

const actionButtonsStyle = {
  display: "flex",
  gap: "15px",
  justifyContent: "center",
  marginTop: "30px",
  paddingTop: "20px",
  borderTop: "2px solid #ddd",
  flexWrap: "wrap"
};

const backButtonStyle = {
  padding: "14px 30px",
  background: "#757575",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background 0.3s"
};

const attachementButtonStyle = {
  padding: "14px 30px",
  background: "#FF9800",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background 0.3s"
};

// Animation CSS et styles d'impression
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @media print {
    .print-hide {
      display: none !important;
    }
    
    .no-print-border input,
    .no-print-border textarea {
      border: none !important;
      background: transparent !important;
      padding: 2px !important;
    }
    
    .total-colspan-print {
      text-align: right !important;
    }
    
    body {
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    
    table {
      page-break-inside: auto;
    }
    
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
  }
`;
if (!document.head.querySelector('style[data-bordereau-animation]')) {
  styleTag.setAttribute('data-bordereau-animation', 'true');
  document.head.appendChild(styleTag);
}

export default BordereauPrix;
