export default async function handler(req, res) {
  try {
    const { message } = req.body;

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
            content: message || "Generate VX experience brief"
          }
        ]
      })
    });

    const data = await response.json();

    console.log("FULL GROQ RESPONSE:", JSON.stringify(data));

    // ✅ GUARANTEED RETURN FORMAT
    let reply = "";

    if (data && data.choices && data.choices.length > 0) {
      reply = data.choices[0].message.content;
    }

    // ✅ FORCE reply ALWAYS
    if (!reply || reply.trim() === "") {
      reply = "AI returned empty. Try again.";
    }

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({
      reply: "Server error: " + error.message
    });
  }
}
