export default async function handler(req, res) {
  try {
    const { message } = req.body;

    // ✅ Check API key
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY missing" });
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
            content: message || "Hello"
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    // ✅ IMPORTANT: log for debugging
    console.log("Groq response:", data);

    // ✅ Safe extraction
    if (!data || !data.choices || data.choices.length === 0) {
      return res.status(500).json({
        error: "Invalid response from AI",
        fullResponse: data
      });
    }

    const reply = data.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
``
