"use client";

import { useEffect, useState } from "react";
import { STACK, cardAtPosition, cardLabel, isRed } from "@/lib/stack";
import PlayingCard from "@/components/PlayingCard";
import StackReference from "@/components/StackReference";
import DeckView from "@/components/DeckView";
import RangeControl from "@/components/RangeControl";

const N = STACK.length;

type View = "practice" | "deck";
type Mode = "numberToCard" | "cardToNumber";

interface Round {
  current: number; // position being asked (1-based)
  queue: number[]; // upcoming positions this round (no repeats)
}

// A shuffled list of every position in [start, end].
function shuffledRange(start: number, end: number): number[] {
  const arr: number[] = [];
  for (let p = start; p <= end; p++) arr.push(p);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Build a round covering the whole range once (no repeats). `avoidFirst` keeps
// the previous round's last card from leading the new one, without dropping it.
function buildRound(start: number, end: number, avoidFirst?: number): Round {
  const arr = shuffledRange(start, end);
  if (avoidFirst !== undefined && arr.length > 1 && arr[0] === avoidFirst) {
    const j = 1 + Math.floor(Math.random() * (arr.length - 1));
    [arr[0], arr[j]] = [arr[j], arr[0]];
  }
  return { current: arr[0], queue: arr.slice(1) };
}

export default function Home() {
  const [view, setView] = useState<View>("practice");
  const [mode, setMode] = useState<Mode>("numberToCard");
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(N);
  const [round, setRound] = useState<Round>({ current: 1, queue: [] });
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [showStack, setShowStack] = useState(false);

  // Build the first round on mount (keeps SSR deterministic — no Math.random
  // during render).
  useEffect(() => {
    setRound(buildRound(1, N));
  }, []);

  function next() {
    setRound((r) => {
      if (r.queue.length > 0) {
        return { current: r.queue[0], queue: r.queue.slice(1) };
      }
      // round exhausted — reshuffle the whole range for a new pass
      return buildRound(rangeStart, rangeEnd, r.current);
    });
    setRevealed(false);
  }

  function applyRange(start: number, end: number) {
    setRangeStart(start);
    setRangeEnd(end);
    setRound(buildRound(start, end));
    setRevealed(false);
  }

  function switchMode(m: Mode) {
    if (m === mode) return;
    setMode(m);
    setRevealed(false);
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

  const card = cardAtPosition(round.current);
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const roundSize = rangeEnd - rangeStart + 1;
  const roundIndex = roundSize - round.queue.length;

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

      <RangeControl
        start={rangeStart}
        end={rangeEnd}
        onChange={applyRange}
        roundIndex={roundIndex}
        roundSize={roundSize}
      />

      <section className="stage">
        {mode === "numberToCard" ? (
          <>
            <div className="prompt-label">Position</div>
            <div className={`prompt-number ${revealed ? "small" : ""}`}>
              {round.current}
            </div>
            {revealed ? (
              <div className="reveal">
                <PlayingCard card={card} glow />
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
            <PlayingCard card={card} glow />
            {revealed ? (
              <div className="answer">
                Position <b>{round.current}</b>
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
        <div className="controls-row">
          <button className="btn secondary" onClick={next}>
            Skip
          </button>
          <button className="btn ghost" onClick={() => setShowStack(true)}>
            View full stack
          </button>
        </div>
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
