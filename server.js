import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { startSession, endSession } from "./controllers/chatController.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.post("/session/create", startSession);
app.post("/session/end", endSession);

app.listen(process.env.PORT, () =>
  console.log(`Backend running on port ${process.env.PORT}`)
);