import React from "react";
import Carousel from "./Carousel"; // Carrousel

function Services() {
  return (
    <section className="py-5 text-center" id="services" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <h2 className="fw-bold display-5 mb-4">Nos Services</h2>
        <p className="text-muted mb-5">
          L’ORMVA de Ouarzazate œuvre pour le développement agricole durable à travers des services diversifiés.
        </p>

        <div className="row g-4">
          {/* Service Cards */}
          {[
            { title: "Gestion de l'Irrigation", desc: "Modernisation des systèmes d'irrigation pour une gestion durable de l'eau agricole.", icon: "bi-droplet-half", color: "success" },
            { title: "Aménagement Agricole", desc: "Travaux de remembrement, drainage et amélioration des périmètres irrigués.", icon: "bi-hammer", color: "primary" },
            { title: "Encadrement des Agriculteurs", desc: "Formations, sensibilisation et accompagnement technique sur les bonnes pratiques agricoles.", icon: "bi-person-video", color: "danger" },
            { title: "Maintenance des Équipements", desc: "Assurer le bon fonctionnement des équipements et machines agricoles.", icon: "bi-tools", color: "warning" },
            { title: "Planification des Cultures", desc: "Optimisation des rotations culturales et des semis pour une meilleure productivité.", icon: "bi-calendar-event", color: "info" },
            { title: "Protection de l’Environnement", desc: "Actions pour la préservation des ressources naturelles et la biodiversité.", icon: "bi-tree", color: "secondary" }
          ].map((service, index) => (
            <div key={index} className="col-md-4 col-sm-6">
              <div className="service-card p-4 bg-white rounded shadow-sm text-center">
                <div className={`iconbox mb-3 text-${service.color}`}>
                  <i className={`bi ${service.icon}`} style={{ fontSize: "2rem" }}></i>
                </div>
                <h5 className="fw-bold">{service.title}</h5>
                <p>{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carrousel */}
      <>
      <Carousel />
      
      </>

      {/* CSS Hover Fade Down */}
      <style>{`
        .service-card {
          position: relative;
          overflow: hidden;
          background-color: #fff;
          transition: transform 0.6s ease, background-color 0.6s ease;
          cursor: pointer;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: rgba(0, 128, 0, 0.1); /* vert clair */
          transition: all 0.6s ease;
          z-index: 0;
        }

        .service-card:hover::before {
          left: 0;
        }

        .service-card:hover {
          transform: translateY(-10px) translateX(10px);
          box-shadow: 0 15px 25px rgba(0,0,0,0.2);
          background-color: #e6f4ea; /* vert très clair pour hover */
        }

        .service-card .iconbox {
          position: relative;
          z-index: 1;
          transition: transform 0.6s ease;
        }

        .service-card:hover .iconbox i {
          transform: scale(1.4);
        }

        .service-card h5,
        .service-card p {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </section>
  );
}

export default Services;

