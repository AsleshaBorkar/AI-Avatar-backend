import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { startSession, endSession } from "./controllers/chatController.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ===============================
   MIDDLEWARE
================================ */
app.use(
  cors({
    origin: "*", // frontend on port 80
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json());

/* ===============================
   HEALTH CHECK (IMPORTANT)
================================ */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "AI Avatar Backend is running 🚀"
  });
});

/* ===============================
   ROUTES
================================ */
app.post("/session/create", startSession);
app.post("/session/end", endSession);

/* ===============================
   START SERVER
================================ */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
