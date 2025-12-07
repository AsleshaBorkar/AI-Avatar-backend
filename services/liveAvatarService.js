import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

const LIVEAVATAR_BASE = "https://api.liveavatar.com";
const LIVEAVATAR_API_KEY = process.env.LIVEAVATAR_API_KEY;

const DEFAULT_AVATAR = process.env.AVATAR_ID || "998e5637-cfca-4700-891e-8a40ce33f562";
const DEFAULT_VOICE = process.env.VOICE_ID;  // Optional now
const CONTEXT_ID = process.env.CONTEXT_ID;

// Create session in FULL mode
export async function createLiveAvatarSession() {
  try {
    if (!CONTEXT_ID) {
      throw new Error("CONTEXT_ID not found in .env! Run createContext.js first.");
    }

    console.log("Creating LiveAvatar session (FULL mode)...");

    // Build avatar_persona object conditionally
    const avatarPersona = {
      language: "en",
      context_id: CONTEXT_ID
    };

    // Only add voice_id if it's provided
    if (DEFAULT_VOICE) {
      avatarPersona.voice_id = DEFAULT_VOICE;
      console.log("Using custom voice:", DEFAULT_VOICE);
    } else {
      console.log("Using avatar's default voice");
    }

    const tokenRes = await axios.post(
      `${LIVEAVATAR_BASE}/v1/sessions/token`,
      {
        mode: "FULL",
        avatar_id: DEFAULT_AVATAR,
        avatar_persona: avatarPersona
      },
      {
        headers: {
          "X-API-KEY": LIVEAVATAR_API_KEY,
          "accept": "application/json",
          "content-type": "application/json"
        }
      }
    );

    const sessionId = tokenRes.data.data.session_id;
    const sessionToken = tokenRes.data.data.session_token;

    console.log("✅ Session token created:", sessionId);

    // Start session
    const startRes = await axios.post(
      `${LIVEAVATAR_BASE}/v1/sessions/start`,
      {},
      {
        headers: {
          "accept": "application/json",
          "authorization": `Bearer ${sessionToken}`
        }
      }
    );

    console.log("✅ Session started!");

    return {
      sessionId,
      sessionToken,
      livekitUrl: startRes.data.data.livekit_url,
      livekitToken: startRes.data.data.livekit_client_token
    };

  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    throw error;
  }
}

// Stop session
export async function stopLiveAvatarSession(sessionToken) {
  try {
    console.log("Stopping session...");

    const res = await axios.post(
      `${LIVEAVATAR_BASE}/v1/sessions/stop`,
      {},
      {
        headers: {
          "accept": "application/json",
          "authorization": `Bearer ${sessionToken}`
        }
      }
    );

    console.log("✅ Session stopped!");
    return res.data;
  } catch (error) {
    console.error("❌ Failed to stop session:", error.response?.data || error.message);
    throw error;
  }
}