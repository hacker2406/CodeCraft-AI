import 'dotenv/config';
import Session from "../models/Session.js";
import redis from "../config/redis.js";

export const chatWithLLM = async (req, res) => {
  const { sessionId, prompt } = req.body;
  if (!sessionId || !prompt) return res.status(400).json({ error: "Missing sessionId or prompt" });

  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  // Prepare messages for LLM (user/assistant format)
  const messages = (session.data?.messages || []).map(m => ({
    role: m.role,
    content: m.content,
  }));
  messages.push({ role: "user", content: prompt });

  // Call OpenRouter API
  try {
    const llmRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-11b-vision-instruct:free", // or llama3, gemini, etc.
        messages,
        max_tokens: 4096,
      }),
    });
    const llmData = await llmRes.json();
    console.log("LLM API status:", llmRes.status, "data:", llmData);
    const aiMessage = llmData.choices?.[0]?.message?.content || "No response";

    // Optionally extract code block from AI message
    const codeMatch = aiMessage.match(/```(?:\w*\n)?([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : "";

    // Save new messages and code to session
    const updatedMessages = [...messages, { role: "assistant", content: aiMessage }];
    session.data = { ...session.data, messages: updatedMessages, code };
    await session.save();

    // Update Redis cache for this session
    await redis.set(`session:${session._id}`, JSON.stringify(session));

    console.log("Session updated in MongoDB and Redis:", session._id);

    res.json({ messages: updatedMessages, code });
  } catch (err) {
    res.status(500).json({ error: "LLM API error", details: err.message });
  }
};