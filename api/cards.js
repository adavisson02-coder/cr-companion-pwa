export default async function handler(req, res) {
  const API_TOKEN = process.env.CLASH_API_TOKEN;

  try {
    // 1) if you have an official token, use Supercell API
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

    // 2) fallback: public static JSON from RoyaleAPI GitHub
    const fallbackUrl =
      "https://royaleapi.github.io/cr-api-data/json/cards.json";
    const resp = await fetch(fallbackUrl);

    if (!resp.ok) {
      const text = await resp.text();
      return res
        .status(resp.status)
        .json({ error: "Upstream error (fallback)", detail: text });
    }

    const data = await resp.json(); // this is REAL json

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
