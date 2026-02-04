import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        
        {/* Logo */}
        <Link to="/" style={styles.brand}>
          <img
            src="/img/logo-ormvao1.png"
            alt="ORMVAO Logo"
            height="80"
          />
        </Link>

        {/* Liens */}
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Accueil</Link>
          <a href="#services" style={styles.link}>Services</a>
          <a href="#contact" style={styles.link}>Contact</a>

         

          <Link
            to="/connexion"
            style={{ ...styles.link, ...styles.button }}
          >
            Connexion
          </Link>
        </div>

      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    zIndex: 999,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
  },
  button: {
    padding: "5px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    borderRadius: "5px",
  },
};

export default Navbar;
