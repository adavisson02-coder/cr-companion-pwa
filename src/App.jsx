import { useState, useEffect } from "react";

export default function App() {
  const [trophies, setTrophies] = useState(3500);
  const [deck, setDeck] = useState([
    "Giant",
    "Witch",
    "Baby Dragon",
    "Valkyrie",
    "Log",
    "Zap",
    "Minions",
    "Skeletons",
  ]);
  const [advice, setAdvice] = useState("");

  // Automatically suggest a better deck depending on trophy range
  useEffect(() => {
    let suggestion = "";
    if (trophies < 3000) {
      suggestion =
        "Try a simple Giant + Witch push deck. Focus on defense first, then counter-push.";
    } else if (trophies >= 3000 && trophies < 4000) {
      suggestion =
        "Use Giant–Witch–Baby Dragon as your core. Keep Zap for Inferno counters. Replace Skeletons with Cannon if you face Hog or Royal Giant often.";
    } else if (trophies >= 4000 && trophies < 5000) {
      suggestion =
        "Add Fireball or Mega Minion for flexibility. Play around double elixir and stack support units.";
    } else {
      suggestion =
        "At high ladder, experiment with Miner or Balloon variants. Focus on tighter elixir management and counter-pushes.";
    }
    setAdvice(suggestion);
  }, [trophies]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #0b0b0f 30%, #1f4eb3 90%)",
        color: "#fff",
        fontFamily: "Poppins, sans-serif",
        padding: "2rem",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "1rem" }}>
        ⚔️ Clash Royale Companion
      </h1>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <label style={{ fontWeight: "bold" }}>🏆 Enter your current trophies:</label>
        <input
          type="number"
          value={trophies}
          onChange={(e) => setTrophies(parseInt(e.target.value))}
          style={{
            marginLeft: "0.5rem",
            width: "100px",
            padding: "0.3rem",
            borderRadius: "8px",
            border: "none",
            textAlign: "center",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {deck.map((card, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              padding: "1rem",
              textAlign: "center",
              fontWeight: "600",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
          >
            {card}
          </div>
        ))}
      </div>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "1rem",
          borderRadius: "12px",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.3rem" }}>💡 Strategy Tip</h2>
        <p style={{ fontSize: "1rem", lineHeight: "1.6" }}>{advice}</p>
      </div>

      <button
        onClick={() => alert("Feature coming soon! Deck Analyzer & Meta Sync.")}
        style={{
          display: "block",
          margin: "0 auto",
          backgroundColor: "#f6b90a",
          color: "#000",
          border: "none",
          borderRadius: "10px",
          padding: "0.7rem 1.5rem",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        🔍 Analyze My Deck
      </button>
    </div>
  );
}
