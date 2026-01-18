'use client';

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AnalysisResult,
  MarketSnapshot,
  analyzeMarket,
  parseLevelsInput,
  parseNewsInput
} from "../lib/analysis";

const trendOptions: MarketSnapshot["trend"][] = ["Bullish", "Bearish", "Sideways"];
const volatilityOptions: MarketSnapshot["volatility"][] = [
  "Calm",
  "Balanced",
  "Elevated"
];

export default function HomePage() {
  const [price, setPrice] = useState("2365.40");
  const [trend, setTrend] = useState<MarketSnapshot["trend"]>("Bullish");
  const [rsi, setRsi] = useState("58.2");
  const [ma50, setMa50] = useState("2352.5");
  const [ma200, setMa200] = useState("1986.0");
  const [support, setSupport] = useState("2350, 2328, 2300");
  const [resistance, setResistance] = useState("2378, 2405, 2418");
  const [volatility, setVolatility] =
    useState<MarketSnapshot["volatility"]>("Balanced");
  const [news, setNews] = useState(
    [
      "US CPI moderates | Softer inflation dents USD yield premium | bullish",
      "Fed speakers lean patient | Lower odds of near-term hikes | bullish",
      "Middle East tensions simmer | Geopolitical premium stays bid | bullish"
    ].join("\n")
  );
  const [userNotes, setUserNotes] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const parsedSnapshot = useMemo<MarketSnapshot>(() => {
    const priceValue = Number.parseFloat(price);
    const rsiValue = Number.parseFloat(rsi);
    const ma50Value = Number.parseFloat(ma50);
    const ma200Value = Number.parseFloat(ma200);

    return {
      price: Number.isFinite(priceValue) ? priceValue : 0,
      trend,
      rsi: Number.isFinite(rsiValue) ? rsiValue : 0,
      ma50: Number.isFinite(ma50Value) ? ma50Value : null,
      ma200: Number.isFinite(ma200Value) ? ma200Value : null,
      supportLevels: parseLevelsInput(support),
      resistanceLevels: parseLevelsInput(resistance),
      volatility,
      news: parseNewsInput(news),
      userNotes: userNotes.trim()
    };
  }, [price, trend, rsi, ma50, ma200, support, resistance, volatility, news, userNotes]);

  useEffect(() => {
    setResult(analyzeMarket(parsedSnapshot));
  }, [parsedSnapshot]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(analyzeMarket(parsedSnapshot));
  };

  return (
    <main>
      <div className="shell">
        <section className="panel">
          <header>
            <h1>Gold Pulse Assistant</h1>
            <p>
              Dedicated XAU/USD analyst blending technical structure, macro catalysts,
              and disciplined trade preparation. Update the market snapshot to generate
              fresh guidance instantly.
            </p>
          </header>

          <form className="input-grid" onSubmit={handleSubmit}>
            <div className="input-cluster">
              <h2>Market Snapshot</h2>
              <label>
                Price (Spot XAU/USD)
                <input
                  type="number"
                  step="0.1"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                />
              </label>
              <label>
                RSI (14 period)
                <input
                  type="number"
                  step="0.1"
                  value={rsi}
                  onChange={(event) => setRsi(event.target.value)}
                />
              </label>
              <label>
                Dominant Trend
                <select
                  value={trend}
                  onChange={(event) =>
                    setTrend(event.target.value as MarketSnapshot["trend"])
                  }
                >
                  {trendOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Volatility Mood
                <select
                  value={volatility}
                  onChange={(event) =>
                    setVolatility(event.target.value as MarketSnapshot["volatility"])
                  }
                >
                  {volatilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="input-cluster">
              <h2>Moving Averages</h2>
              <label>
                50 EMA
                <span>Leave blank if not in play.</span>
                <input
                  type="number"
                  step="0.1"
                  value={ma50}
                  placeholder="e.g. 2350"
                  onChange={(event) => setMa50(event.target.value)}
                />
              </label>
              <label>
                200 EMA
                <span>Leave blank if not in play.</span>
                <input
                  type="number"
                  step="0.1"
                  value={ma200}
                  placeholder="e.g. 1980"
                  onChange={(event) => setMa200(event.target.value)}
                />
              </label>
            </div>

            <div className="input-cluster">
              <h2>Key Levels</h2>
              <label>
                Support Zones
                <span>Comma, space, or newline separated. Example: 2340, 2325</span>
                <textarea
                  value={support}
                  onChange={(event) => setSupport(event.target.value)}
                />
              </label>
              <label>
                Resistance Zones
                <span>Comma, space, or newline separated. Example: 2380, 2400</span>
                <textarea
                  value={resistance}
                  onChange={(event) => setResistance(event.target.value)}
                />
              </label>
            </div>

            <div className="input-cluster">
              <h2>Macro Drivers</h2>
              <span>
                One per line using <code>Headline | Why it matters | bias</code>. Bias can
                be bullish / bearish / neutral.
              </span>
              <textarea
                value={news}
                onChange={(event) => setNews(event.target.value)}
                placeholder="FOMC minutes | Dovish tone lowers USD yields | bullish"
              />
              <label>
                Operator Notes
                <textarea
                  value={userNotes}
                  onChange={(event) => setUserNotes(event.target.value)}
                  placeholder="Add any personal observations or trading rules."
                />
              </label>
              <button type="submit">Refresh Analysis</button>
            </div>
          </form>
        </section>

        <section className="panel">
          <InsightsPanel result={result} />
        </section>
      </div>
    </main>
  );
}

function InsightsPanel({ result }: { result: AnalysisResult | null }) {
  if (!result) {
    return (
      <div className="insight-grid">
        <div className="insight">
          <strong>Awaiting snapshot.</strong>
          <span>
            Update price, trend, levels, and macro context to receive a full brief from
            the gold desk.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="insight-grid">
      <div className="insight">
        <div className="badge">
          {result.bias} bias · {(result.confidence * 100).toFixed(0)}% confidence
        </div>
        <section>
          {result.biasRationale.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </section>
      </div>

      {result.technical.map((section) => (
        <div key={section.title} className="insight">
          <strong>{section.title}</strong>
          <section>
            {section.points.map((point) => (
              <span key={point}>{point}</span>
            ))}
          </section>
        </div>
      ))}

      <div className="insight">
        <strong>{result.newsImpact.title}</strong>
        <section>
          {result.newsImpact.points.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </section>
      </div>

      <div className="insight">
        <strong>Key Levels To Track</strong>
        <section className="key-levels">
          <span>
            <strong>Watch:</strong> {result.keyLevels.watch.join(" ")}
          </span>
          <span>
            <strong>Alerts:</strong> {result.keyLevels.alert.join(" ")}
          </span>
        </section>
      </div>

      <div className="insight">
        <strong>Risk Discipline</strong>
        <section>
          {result.riskGuidance.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </section>
      </div>

      <div className="insight">
        <strong>Operator Reminders</strong>
        <section>
          {result.reminders.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </section>
        <span className="footer-note">
          No guarantees. The assistant frames probability, not certainty. Respect daily
          loss limits and stay adaptive.
        </span>
      </div>
    </div>
  );
}
