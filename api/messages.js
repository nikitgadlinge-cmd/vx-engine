// Vercel Serverless Function — proxies requests to the Anthropic Messages API.
// The browser calls /api/messages; this function adds the secret API key
// (never exposed to the client) and forwards the request.
//
// Required environment variable on Vercel: ANTHROPIC_API_KEY

export default async function handler(req, res) {
  // CORS / preflight (harmless for same-origin, helps if called cross-origin)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Method not allowed. Use POST." } });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: {
        message:
          "ANTHROPIC_API_KEY is not set on the server. In Vercel: Settings -> Environment Variables -> add ANTHROPIC_API_KEY, then redeploy.",
      },
    });
    return;
  }

  // Read the request body robustly. Depending on Vercel's parsing, req.body may
  // be an object, a string, or undefined — so fall back to reading the raw stream.
  let bodyString;
  try {
    if (req.body && typeof req.body === "object") {
      bodyString = JSON.stringify(req.body);
    } else if (typeof req.body === "string" && req.body.length > 0) {
      bodyString = req.body;
    } else {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      bodyString = Buffer.concat(chunks).toString("utf8");
    }
  } catch (err) {
    res.status(400).json({ error: { message: `Could not read request body: ${err.message}` } });
    return;
  }

  if (!bodyString) {
    res.status(400).json({ error: { message: "Empty request body." } });
    return;
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: bodyString,
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", "application/json");
    res.send(text || JSON.stringify({ error: { message: `Upstream returned HTTP ${upstream.status} with no body.` } }));
  } catch (err) {
    res.status(502).json({ error: { message: `Proxy could not reach the Anthropic API: ${err.message}` } });
  }
}
