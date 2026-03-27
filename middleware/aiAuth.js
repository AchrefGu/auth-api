import axios from "axios";

const loginAttempts = {};
const knownLocations = {}; // stockage simple par email

export const aiCheck = async (req, res, next) => {
  const ip = req.ip;
  const userAgent = req.headers["user-agent"] || "";
  const { email } = req.body;

  // Initialiser compteur
  if (!loginAttempts[ip]) loginAttempts[ip] = { count: 0, lastAttempt: Date.now() };
  loginAttempts[ip].count++;

  let riskScore = 0;

  // 🔴 Trop de tentatives : augmenter progressivement le score
  if (loginAttempts[ip].count > 3) riskScore += 30;
  if (loginAttempts[ip].count > 5) riskScore += 50;

  // 🔴 Bot detection
  if (userAgent.toLowerCase().includes("bot")) riskScore += 40;

  // Gestion IP locale pour dev
  const isLocal = ip === "::1" || ip === "127.0.0.1";
  const ipToCheck = isLocal ? "8.8.8.8" : ip; // fallback IP pour dev
  let country = isLocal ? "Localhost (dev)" : "Unknown";

  // 🌍 Récupérer pays via IP
  try {
    const response = await axios.get(`https://ipapi.co/${ipToCheck}/json/`);
    if (!isLocal) country = response.data.country_name || "Unknown";
  } catch (err) {
    console.log("Geo API error:", err.message);
  }

  // 🔍 Vérification pays suspect
  if (email) {
    if (!knownLocations[email]) {
      knownLocations[email] = country; // première connexion
    } else if (knownLocations[email] !== country) {
      riskScore += 60; // pays différent → suspect
      console.log(`⚠️ Suspicious login for ${email}: ${knownLocations[email]} → ${country}`);
    }
  }

  // 🧠 LOGS pour debug
  console.log(`IP: ${ip} | Checked IP: ${ipToCheck} | Country: ${country}`);
  console.log(`Attempts: ${loginAttempts[ip].count} | Risk Score: ${riskScore}`);

  // 🚨 Blocage si score trop élevé
  if (riskScore >= 70) {
    return res.status(403).json({
      error: "Blocked: suspicious activity",
      country,
      riskScore
    });
  }

  req.country = country; // passer au controller
  next();
};