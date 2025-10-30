import { useEffect, useState } from "react";
import "./App.css";

const LOCAL_CARD_DATA = {
  Giant: { elixir: 5, role: ["wincon", "tank"], tags: ["ground"] },
  Witch: { elixir: 5, role: ["splash", "support"], tags: ["anti-swarm"] },
  "Baby Dragon": { elixir: 4, role: ["splash", "air"], tags: ["air"] },
  Valkyrie: { elixir: 4, role: ["splash"], tags: [] },
  Log: { elixir: 2, role: ["spell"], tags: [] },
  Zap: { elixir: 2, role: ["spell"], tags: [] },
  Minions: { elixir: 3, role: ["air"], tags: ["air"] },
  Skeletons: { elixir: 1, role: ["cycle"], tags: [] },
};

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

function analyzeDeck(deck, cardData) {
  let totalElixir = 0;
  const summary = {
    wincon: 0,
    building: 0,
    spell: 0,
    air: 0,
    splash: 0,
    cycle: 0,
  };

  deck.forEach((card) => {
    const data = cardData[card];
    if (!data) return;
    totalElixir += data.elixir || 0;
    (data.role || []).forEach((r) => {
      if (summary[r] !== undefined) summary[r] += 1;
    });
  });

  const avgElixir = deck.length ? (totalElixir / deck.length).toFixed(2) : "0.0";

  const tips = [];
  if (summary.wincon === 0)
    tips.push("No win condition. Add Hog, Giant, Miner, or Royal Giant.");
  if (summary.air === 0)
    tips.push("No air defense. Add Minions, Mega Minion, Musketeer, or Baby Dragon.");
  if (summary.splash === 0)
    tips.push("No splash unit. Add Valkyrie, Witch, Wizard, or Baby Dragon.");
  if (summary.building === 0)
    tips.push("No defensive building. Add Cannon, Tesla, Bomb Tower, or Inferno Tower.");
  if (summary.spell === 0)
    tips.push("No spells. Add Zap, Log, Arrows, or Fireball.");
  if (Number(avgElixir) > 4.0)
    tips.push("Deck is heavy. Try to stay between 3.2 and 3.8 at 3.5–4k trophies.");

  return { avgElixir, summary, tips };
}

function App() {
  const [trophies, setTrophies] = useState(3500);
  const [cardData, setCardData] = useState(LOCAL_CARD_DATA);
  const [deck, setDeck] = useState(DEFAULT_DECK);
  const [analysis, setAnalysis] = useState(null);

  // load live cards from our API
  useEffect(() => {
    async function loadCards() {
      try {
        const resp = await fetch("/api/cards");
        if (!resp.ok) return;
        const json = await resp.json();
        if (!json.cards) return;

        const next = { ...LOCAL_CARD_DATA };
        json.cards.forEach((c) => {
          next[c.name] = {
            elixir: c.elixir ?? 3,
            role: c.role ?? [],
            tags: c.tags ?? [],
          };
        });
        setCardData(next);
      } catch (err) {
        console.warn("Using local card data because API failed.");
      }
    }
    loadCards();
  }, []);

  function handleAnalyze() {
    const result = analyzeDeck(deck, cardData);
    setAnalysis(result);
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>⚔️ Clash Royale Companion</h1>
        <label className="trophy-input">
          🏆 Enter your current trophies:
          <input
            type="number"
            value={trophies}
            onChange={(e) => setTrophies(Number(e.target.value))}
          />
        </label>
      </header>

      <section className="deck-row">
        {deck.map((card) => (
          <button key={card} className="card-pill">
            {card}
          </button>
        ))}
      </section>

      <section className="tip-box">
        <h2>💡 Strategy Tip</h2>
        <p>
          Use Giant–Witch–Baby Dragon as your core. Keep Zap for Inferno or Skarmy.
          Swap Skeletons for Cannon/Tesla if you’re seeing Hog or Royal Giant a lot.
        </p>
      </section>

      <div className="centered">
        <button onClick={handleAnalyze} className="analyze-btn">
          🔍 Analyze My Deck
        </button>
      </div>

      {analysis && (
        <section className="analysis-box">
          <h2>🧠 Deck Breakdown</h2>
          <p className="big-elixir">Avg. Elixir: {analysis.avgElixir}</p>
          <div className="summary-grid">
            <div className="summary-item">
              <span>Wincons</span>
              <strong>{analysis.summary.wincon}</strong>
            </div>
            <div className="summary-item">
              <span>Air Def</span>
              <strong>{analysis.summary.air}</strong>
            </div>
            <div className="summary-item">
              <span>Splash</span>
              <strong>{analysis.summary.splash}</strong>
            </div>
            <div className="summary-item">
              <span>Spells</span>
              <strong>{analysis.summary.spell}</strong>
            </div>
            <div className="summary-item">
              <span>Building</span>
              <strong>{analysis.summary.building}</strong>
            </div>
            <div className="summary-item">
              <span>Cycle</span>
              <strong>{analysis.summary.cycle}</strong>
            </div>
          </div>

          <h3>Suggestions</h3>
          {analysis.tips.length === 0 ? (
            <p>Your deck looks balanced for ~{trophies} trophies 👌</p>
          ) : (
            <ul className="tip-list">
              {analysis.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      <footer className="footer">
        <p>Powered by your deck + live Clash data.</p>
      </footer>
    </div>
  );
}

export default App;
