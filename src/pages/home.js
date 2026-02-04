import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Services from "../components/Services";

function Home() {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          backgroundImage: "url('/img/img1.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start", // texte en haut
          paddingTop: "120px", // espace du navbar
          color: "#fff",
          textAlign: "center",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom, rgba(63, 156, 63, 0.5), rgba(146, 206, 146, 0))",
            zIndex: 1,
          }}
        ></div>

        {/* Texte Hero */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1
            style={{
              fontWeight: 900,
              fontSize: "3rem",
              margin: 0,
            }}
          >
            Bienvenue à l'ORMVA
          </h1>
          <h5
            style={{
              fontWeight: 700,
              fontSize: "2rem",
              marginTop: "10px",
            }}
          >
            L’Office Régional de Mise en Valeur Agricole de Ouarzazate
          </h5>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <Services />

      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default Home;
