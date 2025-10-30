export default async function handler(req, res) {
  const API_TOKEN = process.env.CLASH_API_TOKEN;

  try {
    // 1) official API if you ever get a token
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
      const cards = (data.items || []).map((c) => autoTag(c.name, c.elixirCost ?? 3));
      return res.status(200).json({ cards });
    }

    // 2) fallback: public JSON
    const resp = await fetch(
      "https://raw.githubusercontent.com/RoyaleAPI/cr-api-data/master/json/cards.json"
    );
    if (!resp.ok) {
      const text = await resp.text();
      return res
        .status(resp.status)
        .json({ error: "Upstream error (fallback)", detail: text });
    }

    const data = await resp.json();

    const cards = (data || []).map((c) => autoTag(c.name, c.elixir ?? 3));

    return res.status(200).json({ cards });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch cards", detail: err.message });
  }
}

// helper: add roles based on name
function autoTag(name, elixir) {
  const wincon = [
    "Hog Rider",
    "Giant",
    "Royal Giant",
    "Miner",
    "Balloon",
    "Graveyard",
    "X-Bow",
    "Mortar",
    "Ram Rider",
    "Battle Ram",
    "Goblin Drill",
    "Lava Hound",
  ];
  const buildings = [
    "Cannon",
    "Tesla",
    "Inferno Tower",
    "Bomb Tower",
    "Furnace",
    "Goblin Hut",
    "Barbarian Hut",
    "Tombstone",
    "Elixir Collector",
  ];
  const spells = [
    "Zap",
    "The Log",
    "Log",
    "Arrows",
    "Fireball",
    "Rocket",
    "Lightning",
    "Poison",
    "Freeze",
    "Earthquake",
    "Snowball",
    "Giant Snowball",
    "Barbarian Barrel",
    "Royal Delivery",
    "Party Rocket",
  ];
  const airUnits = [
    "Baby Dragon",
    "Minions",
    "Mega Minion",
    "Bats",
    "Lava Hound",
    "Inferno Dragon",
    "Phoenix",
    "Super Archers",
    "Super Magic Archer",
    "Super Lava Hound",
    "Balloon",
  ];
  const splashers = [
    "Wizard",
    "Witch",
    "Baby Dragon",
    "Executioner",
    "Valkyrie",
    "Bowler",
    "Mother Witch",
    "Ice Wizard",
  ];

  const role = [];
  const tags = [];

  if (wincon.includes(name)) {
    role.push("wincon");
    tags.push("wincon");
  }
  if (buildings.includes(name)) {
    role.push("building");
    tags.push("building");
  }
  if (spells.includes(name)) {
    role.push("spell");
    tags.push("spell");
  }
  if (airUnits.includes(name)) {
    role.push("air");
    tags.push("air");
  }
  if (splashers.includes(name)) {
    role.push("splash");
    tags.push("splash");
  }

  // cheap cards → cycle
  if (elixir <= 2 && role.length === 0) {
    role.push("cycle");
  }

  return {
    name,
    elixir,
    role,
    tags,
  };
}
