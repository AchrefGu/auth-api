import User from "../models/User.js";
import bcrypt from "bcrypt";




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const country = req.country || "Unknown";

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Vérification changement de pays
    let riskScore = 0;
    if (user.lastCountry && user.lastCountry !== country) {
      riskScore += 60;
      console.log(`⚠️ Suspicious login: ${user.lastCountry} → ${country}`);
    }

    if (riskScore >= 70) {
      return res.status(403).json({
        error: "Suspicious login location",
        country
      });
    }

    user.lastCountry = country;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      country,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      country: req.country || "Unknown"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};