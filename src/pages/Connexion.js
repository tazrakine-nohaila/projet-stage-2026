import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Connexion() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 Identifiants fixes
    if (email === "admin@gmail.com" && password === "12345") {
      setError("");
      navigate("/marches"); // ✅ redirection
    } else {
      setError("Email ou mot de passe incorrect ❌");
    }
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Accès Sécurisé</h2>
        <p style={styles.subtitle}>
          Connectez-vous à votre espace professionnel
        </p>

        <div style={styles.tabs}>
          <span style={styles.activeTab}>Connexion</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Votre email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.options}>
            <label>
              <input type="checkbox" />
              <span> Se souvenir de moi</span>
            </label>
          </div>

          <button type="submit" style={styles.button}>
            Se connecter
          </button>

          <p style={styles.forgot}>Mot de passe oublié ?</p>
          <p style={styles.ssl}>🔒 Connexion sécurisée SSL</p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  loginPage: {
    minHeight: "100vh",
    background: "url('/img/img1.jpeg') center/cover no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "120px",
  },
  loginBox: {
    width: "420px",
    background: "rgba(255,255,255,0.25)",
    backdropFilter: "blur(18px)",
    borderRadius: "18px",
    padding: "35px",
    color: "#fff",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  },
  title: { textAlign: "center", marginBottom: "5px" },
  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    marginBottom: "25px",
  },
  tabs: { display: "flex", justifyContent: "center", marginBottom: "25px" },
  activeTab: {
    fontWeight: "600",
    paddingBottom: "5px",
    borderBottom: "2px solid #fff",
  },
  formGroup: { marginBottom: "15px" },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },
  options: { fontSize: "13px", margin: "10px 0 20px" },
  button: {
    width: "100%",
    padding: "13px",
    borderRadius: "12px",
    border: "none",
    background: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "#ffdddd",
    background: "rgba(255,0,0,0.2)",
    padding: "8px",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "13px",
    marginBottom: "10px",
  },
  forgot: {
    textAlign: "center",
    fontSize: "13px",
    marginTop: "18px",
    textDecoration: "underline",
    cursor: "pointer",
  },
  ssl: {
    textAlign: "center",
    fontSize: "12px",
    marginTop: "8px",
    opacity: 0.85,
  },
};

export default Connexion;
