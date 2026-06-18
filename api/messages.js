export default async function handler(req, res) {
  try {
    const { message } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Missing GROQ_API_KEY" });
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

    // 🔍 DEBUG (helps understand what is happening)
    console.log("Groq Raw Response:", JSON.stringify(data, null, 2));

    // ✅ Handle errors from Groq
    if (data.error) {
      return res.status(500).json({
        error: data.error.message || "Groq API error"
      });
    }

    // ✅ Extract response safely
    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      null;

    if (!reply) {
      return res.status(500).json({
        error: "Empty response from AI",
        fullResponse: data
      });
    }

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
