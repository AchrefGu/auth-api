import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const Auth = () => {
  // États pour register
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // États pour login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // États globaux
  const [message, setMessage] = useState("");
  const [country, setCountry] = useState("");

  // ---------------- REGISTER ----------------
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/register`, { username, email, password });
      setMessage(res.data.message || "Utilisateur enregistré !");
      setCountry(res.data.country || ""); // afficher pays si backend le renvoie
    } catch (err) {
      setMessage(err.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  // ---------------- LOGIN ----------------
const handleLogin = async (e) => {
  e.preventDefault();
  console.log("🔥 Login button clicked");

  try {
    const res = await axios.post(`${API_URL}/login`, {
      email: loginEmail,
      password: loginPassword
    });

    console.log("✅ RESPONSE:", res.data);

    setMessage(res.data.message || "Connexion réussie !");
    setCountry(res.data.country || "");
  } catch (err) {
    console.log("❌ ERROR:", err.response?.data || err.message);
    setMessage(err.response?.data?.error || "Erreur lors de la connexion");
    setCountry("");
  }
};
  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    try {
      const res = await axios.post(`${API_URL}/logout`);
      setMessage(res.data.message || "Déconnecté !");
      setCountry("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Erreur lors de la déconnexion");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      {/* ====== REGISTER ====== */}
      <h2>Inscription</h2>
      <form onSubmit={handleRegister}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>

      {/* ====== LOGIN ====== */}
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* ====== Affichage message + pays ====== */}
      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
      {country && <p>Pays détecté: {country}</p>}

      {/* ====== LOGOUT ====== */}
      <h2>Déconnexion</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Auth;