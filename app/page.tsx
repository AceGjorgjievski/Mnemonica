"use client";

import { useCallback, useEffect, useState } from "react";
import { STACK, cardAtPosition, cardLabel, isRed } from "@/lib/stack";
import PlayingCard from "@/components/PlayingCard";
import StackReference from "@/components/StackReference";
import DeckView from "@/components/DeckView";

type View = "practice" | "deck";
type Mode = "numberToCard" | "cardToNumber";

interface Question {
  position: number; // 1-52
}

function randomPosition(exclude?: number): number {
  let p = Math.floor(Math.random() * STACK.length) + 1;
  if (exclude && STACK.length > 1) {
    while (p === exclude) p = Math.floor(Math.random() * STACK.length) + 1;
  }
  return p;
}

export default function Home() {
  const [view, setView] = useState<View>("practice");
  const [mode, setMode] = useState<Mode>("numberToCard");
  const [question, setQuestion] = useState<Question>({ position: 1 });
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [showStack, setShowStack] = useState(false);

  const next = useCallback(() => {
    setQuestion((q) => ({ position: randomPosition(q.position) }));
    setRevealed(false);
  }, []);

  // First question on mount (avoids hydration mismatch from Math.random on server).
  useEffect(() => {
    setQuestion({ position: randomPosition() });
  }, []);

  function switchMode(m: Mode) {
    if (m === mode) return;
    setMode(m);
    setRevealed(false);
    setQuestion({ position: randomPosition() });
  }

  function grade(wasRight: boolean) {
    setTotal((t) => t + 1);
    if (wasRight) setCorrect((c) => c + 1);
    next();
  }

  function resetScore() {
    setCorrect(0);
    setTotal(0);
  }

  const card = cardAtPosition(question.position);
  const pct = total ? Math.round((correct / total) * 100) : 0;

  return (
    <main className="app">
      <header className="header">
        <h1 className="title">Mnemonica</h1>
        {view === "practice" && (
          <div className="score">
            <b>
              {correct}/{total}
            </b>{" "}
            {total ? `· ${pct}%` : ""}
          </div>
        )}
      </header>

      <nav className="nav">
        <button
          className={`nav-btn ${view === "practice" ? "active" : ""}`}
          onClick={() => setView("practice")}
        >
          Practice
        </button>
        <button
          className={`nav-btn ${view === "deck" ? "active" : ""}`}
          onClick={() => setView("deck")}
        >
          Deck
        </button>
      </nav>

      {view === "deck" ? (
        <DeckView />
      ) : (
        <>
      <div className="modes" role="tablist">
        <button
          className={`mode-btn ${mode === "numberToCard" ? "active" : ""}`}
          onClick={() => switchMode("numberToCard")}
        >
          Number → Card
        </button>
        <button
          className={`mode-btn ${mode === "cardToNumber" ? "active" : ""}`}
          onClick={() => switchMode("cardToNumber")}
        >
          Card → Number
        </button>
      </div>

      <section className="stage">
        {mode === "numberToCard" ? (
          <>
            <div className="prompt-label">Position</div>
            <div className={`prompt-number ${revealed ? "small" : ""}`}>
              {question.position}
            </div>
            {revealed ? (
              <div className="reveal">
                <PlayingCard card={card} />
                <div className={`answer ${isRed(card.suit) ? "red" : ""}`}>
                  {cardLabel(card)}
                </div>
              </div>
            ) : (
              <div className="answer-hint">Which card is here?</div>
            )}
          </>
        ) : (
          <>
            <div className="prompt-label">Card</div>
            <PlayingCard card={card} />
            {revealed ? (
              <div className="answer">
                Position <b>{question.position}</b>
              </div>
            ) : (
              <div className="answer-hint">What position is this?</div>
            )}
          </>
        )}
      </section>

      <div className="controls">
        {!revealed ? (
          <button className="btn" onClick={() => setRevealed(true)}>
            Reveal
          </button>
        ) : (
          <div className="grade-row">
            <button className="btn wrong" onClick={() => grade(false)}>
              Missed it
            </button>
            <button className="btn right" onClick={() => grade(true)}>
              Got it
            </button>
          </div>
        )}
        <button className="btn secondary" onClick={next}>
          Skip
        </button>
        <button className="btn ghost" onClick={() => setShowStack(true)}>
          View full stack
        </button>
      </div>
        </>
      )}

      <footer className="footer">
        Tamariz Mnemonica stack · 52 cards
        {total > 0 && (
          <>
            {" · "}
            <button className="link-btn" onClick={resetScore}>
              reset score
            </button>
          </>
        )}
      </footer>

      {showStack && <StackReference onClose={() => setShowStack(false)} />}
    </main>
  );
}
