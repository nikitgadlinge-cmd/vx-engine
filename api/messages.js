export default async function handler(req, res) {
  try {
    const { message } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(200).json({
        reply: "⚠️ Missing API key. Please configure GROQ_API_KEY."
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: message || "Generate a VX experience design brief"
          }
        ]
      })
    });

    const data = await response.json();

    // ✅ HARD FAIL SAFE
    let reply = "⚠️ AI could not generate response.";

    if (data && data.choices && data.choices.length > 0) {
      reply = data.choices[0].message?.content || reply;
    } else if (data?.error?.message) {
      reply = `⚠️ Groq Error: ${data.error.message}`;
    }

    res.status(200).json({ reply });

  } catch (error) {
    res.status(200).json({
      reply: `⚠️ Server error: ${error.message}`
    });
  }
}
