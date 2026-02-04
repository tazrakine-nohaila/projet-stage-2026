import React from "react";

function Carousel() {
  return (
    <div className="carousel-container my-5">
      <div
        id="carouselExampleInterval"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="5000">
            <img src="/img/img2.jpeg" className="d-block w-100" alt="Image 1" />
          </div>
          <div className="carousel-item" data-bs-interval="5000">
            <img src="/img/img6.jpg" className="d-block w-100" alt="Image 2" />
          </div>
          <div className="carousel-item" data-bs-interval="5000">
            <img src="/img/img3.jpeg" className="d-block w-100" alt="Image 3" />
          </div>
          <div className="carousel-item" data-bs-interval="5000">
            <img src="/img/img4.jpeg" className="d-block w-100" alt="Image 4" />
          </div>
          <div className="carousel-item" data-bs-interval="5000">
            <img src="/img/img5.jpeg" className="d-block w-100" alt="Image 5" />
          </div>
        </div>

        {/* Boutons Previous et Next */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* CSS intégré */}
      <style>{`
        .carousel-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .carousel-inner img {
          width: 100%;
          height: 450px;
          object-fit: cover;
          border-radius: 10px;
        }

        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          background-color: rgba(0,0,0,0.5);
          border-radius: 50%;
        }

        @media (max-width: 768px) {
          .carousel-inner img {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
}

export default Carousel;
