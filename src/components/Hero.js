
import Navbar from "./components/Navbar";
import React from "react";

function Hero() {
  return (
    <>
     <Navbar />
    <section style={styles.hero}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <h1 style={styles.title}>Bienvenue à l'ORMVA</h1>
        <h5 style={styles.subtitle}>
          L’Office Régional de Mise en Valeur Agricole de Ouarzazate
        </h5>
      </div>
      
    </section>
    </>
  );
}

const styles = {
  hero: {
    position: "relative",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start", // texte en haut
    backgroundImage: "url('/img/img1.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#fff",
    textAlign: "center",
    paddingTop: "120px", // espace entre le haut et le texte
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(to bottom, rgba(63, 156, 63, 0.5), rgba(146, 206, 146, 0))", // shade vert en haut
    zIndex: 1,
  },
  content: {
    position: "relative",
    zIndex: 2, // texte au-dessus de l'overlay
  },
  title: {
    fontWeight: 900, // très gras
    fontSize: "3rem",
  },
  subtitle: {
    fontWeight: 700, // gras
    fontSize: "2rem",
    marginTop: "10px",
  },
   // Media queries pour mobile
  '@media(maxWidth: 768px)': {
    title: { fontSize: "2rem" },
    subtitle: { fontSize: "1rem" },
  }
};

export default Hero;
