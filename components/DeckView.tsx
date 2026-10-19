"use client";

import { useState } from "react";
import { STACK, cardLabel } from "@/lib/stack";
import PlayingCard from "./PlayingCard";

export default function DeckView() {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setRevealed((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(i)) nextSet.delete(i);
      else nextSet.add(i);
      return nextSet;
    });
  }

  const anyRevealed = revealed.size > 0;

  return (
    <div className="deck-wrap">
      <div className="deck-head">
        <p className="deck-note">
          Tap a card to flip it face up. {STACK.length} cards, in Mnemonica
          order.
        </p>
        {anyRevealed ? (
          <button className="link-btn" onClick={() => setRevealed(new Set())}>
            flip all back
          </button>
        ) : (
          <button
            className="link-btn"
            onClick={() =>
              setRevealed(new Set(STACK.map((_, i) => i)))
            }
          >
            reveal all
          </button>
        )}
      </div>

      <ol className="deck">
        {STACK.map((card, i) => {
          const open = revealed.has(i);
          return (
            <li key={i} className="deck-item">
              <button
                className={`deck-slot ${open ? "open" : ""}`}
                onClick={() => toggle(i)}
                aria-label={
                  open
                    ? `Position ${i + 1}: ${cardLabel(card)}. Tap to hide.`
                    : `Position ${i + 1}: face down. Tap to reveal.`
                }
                aria-pressed={open}
              >
                {open ? (
                  <div className="deck-face">
                    <span className="deck-face-pos">Position {i + 1}</span>
                    <PlayingCard card={card} />
                  </div>
                ) : (
                  <div className="deck-back">
                    <span className="deck-num">{i + 1}</span>
                    <span className="deck-back-art" aria-hidden="true" />
                    <span className="deck-tap">tap to reveal</span>
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
