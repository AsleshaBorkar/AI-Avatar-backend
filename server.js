import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { startSession, endSession } from "./controllers/chatController.js";

const app = express();

app.use(express.json());

// CORS is OPTIONAL when using Nginx proxy
app.use(cors({ origin: "*" }));

app.post("/session/create", startSession);
app.post("/session/end", endSession);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Backend running on port ${PORT}`);
});
