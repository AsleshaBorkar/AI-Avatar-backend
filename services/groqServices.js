import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqResponse(userMessage) {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are Jane Smith. Speak short and natural. you are having a short water cooler conversation." },
      { role: "user", content: userMessage }
    ],
  });

  return response.choices[0].message.content;
}
