import { useState, useEffect } from "react";

const DEFAULT_DECK = [
  "Giant",
  "Witch",
  "Baby Dragon",
  "Valkyrie",
  "Log",
  "Zap",
  "Minions",
  "Skeletons",
];

const CARD_DATA = {
  "Giant": { elixir: 5, role: ["wincon", "tank"], tags: ["ground"] },
  "Witch": { elixir: 5, role: ["splash", "support"], tags: ["anti-swarm"] },
  "Baby Dragon": { elixir: 4, role: ["splash", "airdef"], tags: ["air","splash"] },
  "Valkyrie": { elixir: 4, role: ["splash", "grounddef"], tags: ["anti-swarm"] },
  "Log": { elixir: 2, role: ["smallspell"], tags: ["ground-only"] },
  "Zap": { elixir: 2, role: ["smallspell"], tags: ["reset","air-hit"] },
  "Minions": { elixir: 3, role: ["airdef","dps"], tags: ["air"] },
  "Skeletons": { elixir: 1, role: ["cycle"], tags: [] },
  "Cannon": { elixir: 3, role: ["building","grounddef"], tags: [] },
  "Fireball": { elixir: 4, role: ["bigspell"], tags: [] },
  "Mega Minion": { elixir: 3, role: ["airdef","dps"], tags: ["air"] },
};

export default function App() {
  const [trophies, setTrophies] = useState(3500);
  const [deck, setDeck] = useState(DEFAULT_DECK);
  const [advice, setAdvice] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [newCard, setNewCard] = useState("");

  // trophy-based high-level tip (like before)
  useEffect(() => {
    let suggestion = "";
    if (trophies < 3000) {
      suggestion =
        "Try a simple Giant + Witch push deck. Defend first, then counter-push.";
    } else if (trophies >= 3000 && trophies < 4000) {
      suggestion =
        "Use Giant–Witch–Baby Dragon as your core. Keep Zap for Inferno. Swap Skeletons → Cannon if you see Hog/RG.";
    } else if (trophies >= 4000 && trophies < 5000) {
      suggestion =
        "Add Fireball or Mega Minion to handle mid-ladder air and stacked supports.";
    } else {
      suggestion =
        "Tighten cycle and add a hard spell. Consider Miner/Balloon variants.";
    }
    setAdvice(suggestion);
  }, [trophies]);

  function analyzeDeck(currentDeck) {
    let totalElixir = 0;
    let wincon = false;
    let airDef = 0;
    let splash = 0;
    let building = false;
    let smallSpell = 0;

    currentDeck.forEach((card) => {
      const data = CARD_DATA[card];
      if (!data) return;
      totalElixir += data.elixir || 0;
      if (data.role?.includes("wincon")) wincon = true;
      if (data.role?.includes("airdef")) airDef++;
      if (data.role?.includes("splash")) splash++;
      if (data.role?.includes("building")) building = true;
      if (data.role?.includes("smallspell")) smallSpell++;
    });

    const avgElixir = currentDeck.length ? (totalElixir / currentDeck.length) : 0;

    const messages = [];

    if (!wincon) {
      messages.push("No clear win condition. Keep Giant or add Hog/Miner.");
    } else {
      messages.push("Win condition detected ✅");
    }

    if (airDef === 0) {
      messages.push("Weak vs air. Add Minions/Mega Minion/Archers.");
    } else if (airDef === 1) {
      messages.push("Air defense is OK but thin. Protect Baby Dragon/Minions.");
    } else {
      messages.push("Air defense looks good ✅");
    }

    if (splash === 0) {
      messages.push("No splash damage. Add Valkyrie, Wizard, or Baby Dragon.");
    } else {
      messages.push("Splash coverage good ✅");
    }

    if (!building && trophies >= 3200) {
      messages.push("No defensive building. Consider Cannon/Tesla vs Hog/RG.");
    }

    if (smallSpell === 0) {
      messages.push("No small spell. Add Zap or Log.");
    }

    if (avgElixir > 4.0) {
      messages.push("Elixir is high. At 3.8k trophies try 3.2–3.8 for smoother defense.");
    } else if (avgElixir < 2.8) {
      messages.push("Elixir is very low. Make sure you still have a real win condition.");
    } else {
      messages.push("Elixir cost is healthy ✅");
    }

    return {
      avgElixir: Number(avgElixir.toFixed(2)),
      messages,
    };
  }

  function handleAnalyze() {
    const result = analyzeDeck(deck);
    setAnalysis(result);
  }

  function handleAddCard() {
    const cardName = newCard.trim();
    if (!cardName) return;
    // keep deck at 8 cards max, replace last one if over
    let next = [...deck, cardName];
    if (next.length > 8) {
      next = next.slice(0, 8);
    }
    setDeck(next);
    setNewCard("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0b0b0f 30%, #1f4eb3 90%)",
        color: "#fff",
        fontFamily: "Poppins, system-ui, -apple-system, sans-serif",
        padding: "1.5rem",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "1rem" }}>
        ⚔️ Clash Royale Companion
      </h1>

      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "bold" }}>🏆 Enter your current trophies:</label>
        <input
          type="number"
          value={trophies}
          onChange={(e) => setTrophies(parseInt(e.target.value || "0", 10))}
          style={{
            marginLeft: "0.5rem",
            width: "120px",
            padding: "0.35rem",
            borderRadius: "999px",
            border: "none",
            textAlign: "center",
            background: "rgba(0,0,0,0.35)",
            color: "#fff",
          }}
        />
      </div>

      {/* deck display */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        {deck.map((card, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.14)",
              borderRadius: "14px",
              padding: "0.8rem .7rem",
              textAlign: "center",
              fontWeight: 600,
              boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
            }}
          >
            {card}
          </div>
        ))}
      </div>

      {/* add card input */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <input
          value={newCard}
          onChange={(e) => setNewCard(e.target.value)}
          placeholder="Add/replace card (e.g. Cannon)"
          style={{
            flex: 1,
            padding: "0.5rem 0.7rem",
            borderRadius: "10px",
            border: "none",
            background: "rgba(0,0,0,0.15)",
            color: "#fff",
          }}
        />
        <button
          onClick={handleAddCard}
          style={{
            background: "#f6b90a",
            border: "none",
            borderRadius: "10px",
            padding: "0.5rem 1rem",
            fontWeight: 600,
            cursor: "pointer",
            color: "#000",
          }}
        >
          Add
        </button>
      </div>

      {/* strategy tip (trophy-based) */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "1rem",
          borderRadius: "12px",
          marginBottom: "1.2rem",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.3rem" }}>💡 Strategy Tip</h2>
        <p style={{ lineHeight: 1.5 }}>{advice}</p>
      </div>

      {/* analyze button */}
      <button
        onClick={handleAnalyze}
        style={{
          display: "block",
          width: "100%",
          maxWidth: "260px",
          margin: "0 auto 1.3rem",
          backgroundColor: "#f6b90a",
          color: "#000",
          border: "none",
          borderRadius: "12px",
          padding: "0.7rem 1rem",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
        }}
      >
        🔍 Analyze My Deck
      </button>

      {/* analysis results */}
      {analysis && (
        <div
          style={{
            background: "rgba(0,0,0,0.35)",
            borderRadius: "14px",
            padding: "1rem 1.1rem",
            lineHeight: 1.5,
          }}
        >
          <p style={{ marginBottom: "0.5rem" }}>
            📊 <strong>Estimated average elixir:</strong> {analysis.avgElixir}
          </p>
          <ul style={{ paddingLeft: "1.2rem" }}>
            {analysis.messages.map((m, idx) => (
              <li key={idx} style={{ marginBottom: "0.35rem" }}>
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
