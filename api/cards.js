export default async function handler(req, res) {
  const API_TOKEN = process.env.CLASH_API_TOKEN;

  try {
    // 1) If you eventually get the official Clash Royale API token, this will use it.
    if (API_TOKEN) {
      const resp = await fetch("https://api.clashroyale.com/v1/cards", {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });

      if (!resp.ok) {
        const text = await resp.text();
        return res
          .status(resp.status)
          .json({ error: "Upstream error (official)", detail: text });
      }

      const data = await resp.json();
      const cards = (data.items || []).map((c) => ({
        name: c.name,
        elixir: c.elixirCost ?? 3,
        role: [],
        tags: [],
      }));

      return res.status(200).json({ cards });
    }

    // 2) Fallback: real JSON (raw) that does NOT return HTML
    const fallbackUrl =
      "https://raw.githubusercontent.com/RoyaleAPI/cr-api-data/master/json/cards.json";

    const resp = await fetch(fallbackUrl);
    if (!resp.ok) {
      const text = await resp.text();
      return res
        .status(resp.status)
        .json({ error: "Upstream error (fallback)", detail: text });
    }

    const data = await resp.json(); // this IS JSON

    const cards = (data || []).map((c) => ({
      name: c.name,
      elixir: c.elixir ?? 3,
      role: [],
      tags: [],
    }));

    return res.status(200).json({ cards });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch cards", detail: err.message });
  }
}
