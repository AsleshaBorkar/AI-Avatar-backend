import { createLiveAvatarSession, stopLiveAvatarSession } from "../services/liveAvatarService.js";

const activeSessions = new Map();

// Create session
export async function startSession(req, res) {
  try {
    console.log("Creating new LiveAvatar session...");
    
    const sessionData = await createLiveAvatarSession();
    
    activeSessions.set(sessionData.sessionId, {
      sessionToken: sessionData.sessionToken,
      createdAt: Date.now()
    });

    console.log("✅ Session ready:", sessionData.sessionId);

    res.json({ 
      success: true,
      sessionId: sessionData.sessionId,
      sessionToken: sessionData.sessionToken,
      livekitUrl: sessionData.livekitUrl,
      livekitToken: sessionData.livekitToken
    });

  } catch (err) {
    console.error("SESSION ERROR", err.response?.data || err.message);
    res.status(500).json({ 
      error: "Failed to create session",
      details: err.response?.data || err.message 
    });
  }
}

// End session
export async function endSession(req, res) {
  try {
    const { sessionId } = req.body;

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    await stopLiveAvatarSession(session.sessionToken);
    activeSessions.delete(sessionId);

    console.log("✅ Session ended:", sessionId);
    res.json({ success: true, message: "Session ended" });

  } catch (err) {
    console.error("END SESSION ERROR", err.response?.data || err.message);
    res.status(500).json({ 
      error: "Failed to end session",
      details: err.response?.data || err.message 
    });
  }
}