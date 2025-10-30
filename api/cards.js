export default async function handler(req, res) {
  const API_TOKEN = process.env.CLASH_API_TOKEN;

  try {
    // If you have your official token, use the real API.
    // Otherwise, fall back to the public RoyaleAPI mirror.
    const useOfficial = !!API_TOKEN;
    const url = useOfficial
      ? "https://api.clashroyale.com/v1/cards"
      : "https://royaleapi.dev/api/cards";

    const headers = useOfficial
      ? { Authorization: `Bearer ${API_TOKEN}` }
      : {};

    const resp = await fetch(url, { headers });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ error: "Upstream error", detail: text });
    }

    const data = await resp.json();

    // Normalize both APIs into a consistent shape
    const rawCards = data.items || data; // "items" for official, array for mirror
    const cards = (rawCards || []).map((c) => ({
      name: c.name,
      elixir: c.elixir ?? c.elixirCost ?? 3,
      // You can later enrich these with your own role logic
      role: [],
      tags: [],
    }));

    return res.status(200).json({ cards });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch cards",
      detail: err.message,
    });
  }
}
