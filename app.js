import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.listen(process.env.PORT || 5000, () => console.log("Server running"));
export default app;