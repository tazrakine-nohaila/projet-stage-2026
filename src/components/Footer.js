import React from "react";

function Footer() {
  return (
    <footer style={styles.footer} id="contact">
      <div style={styles.container}>
        <div>
          <h5>RÉSEAUX SOCIAUX</h5>
          <p>Suivez-nous pour rester informé des activités agricoles.</p>
          <div style={styles.socials}>
            <span>📘</span>
            <span>📸</span>
            <span>🔗</span>
            <span>▶️</span>
          </div>
        </div>
        <div>
          <h5>SERVICES</h5>
          <ul style={styles.list}>
            <li>Gestion de l'irrigation</li>
            <li>Appui aux agriculteurs</li>
            <li>Suivi des projets agricoles</li>
            <li>Mise en valeur des terres</li>
          </ul>
        </div>
        <div>
          <h5>CONTACT</h5>
          <ul style={styles.list}>
            <li>📍 Route de Skoura, Ouarzazate</li>
            <li>📞 +212 5 24 88 77 66</li>
            <li>📧 ormva.ozt@agriculture.gov.ma</li>
            <li>🌐 www.ormvaozt.ma</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#212529",
    color: "#fff",
    padding: "50px 20px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "30px",
  },
  socials: { display: "flex", gap: "10px", fontSize: "1.5rem" },
  list: { listStyle: "none", padding: 0 },
};

export default Footer;
