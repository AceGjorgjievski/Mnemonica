"use client";

import { useRef, useState } from "react";
import { STACK, cardLabel } from "@/lib/stack";
import PlayingCard from "./PlayingCard";
import CardBack from "./CardBack";

const N = STACK.length;

export default function DealDeck() {
  // index = the card currently shown face up (0-based). -1 = nothing dealt yet
  // (deck sits face down). N = whole deck dealt. indexRef mirrors it so rapid
  // taps always act on the latest value (state updates are async).
  const [index, setIndex] = useState(-1);
  const [leaving, setLeaving] = useState<number | null>(null);
  const indexRef = useRef(-1);

  // How many cards remain face down in the pile (behind the lifted card).
  const faceDownPile = index < 0 ? N : N - 1 - index;
  const thickness = Math.min(faceDownPile, 16);
  const done = index >= N;
  const current = index >= 0 && index < N ? STACK[index] : null;

  function tap() {
    const cur = indexRef.current;
    if (cur >= N) return;
    if (cur < 0) {
      indexRef.current = 0;
      setIndex(0);
      return;
    }
    // deal the current card away and reveal the next
    indexRef.current = cur + 1;
    setLeaving(cur);
    setIndex(cur + 1);
    window.setTimeout(() => setLeaving(null), 340);
  }

  function restart() {
    indexRef.current = -1;
    setLeaving(null);
    setIndex(-1);
  }

  function back() {
    if (indexRef.current <= -1) return;
    indexRef.current = indexRef.current - 1;
    setLeaving(null);
    setIndex(indexRef.current);
  }

  const shownNumber = index < 0 ? 0 : Math.min(index + 1, N);

  return (
    <div className="deal-wrap">
      <p className="deal-note">
        {index < 0
          ? "Tap the deck to deal the top card."
          : done
          ? "That's the whole stack."
          : "Tap to deal the next card."}
      </p>

      <button
        className="deal-stage"
        onClick={tap}
        aria-label={
          current
            ? `Showing position ${index + 1}: ${cardLabel(
                current
              )}. Tap to deal next.`
            : done
            ? "Deck finished. Use restart."
            : "Face-down deck. Tap to deal."
        }
      >
        <div className="deal-deck">
          {/* face-down pile */}
          {faceDownPile > 0 && (
            <>
              <div
                className="deal-thickness"
                style={{ ["--t" as string]: thickness }}
              />
              <div className="deal-cardlayer deal-back">
                <CardBack />
              </div>
            </>
          )}

          {done && (
            <div className="deal-empty">
              <span>Deck empty</span>
            </div>
          )}

          {/* card leaving (being dealt away) */}
          {leaving !== null && (
            <div className="deal-cardlayer deal-leaving" key={`leave-${leaving}`}>
              <PlayingCard card={STACK[leaving]} />
            </div>
          )}

          {/* current face-up card */}
          {current && (
            <div className="deal-cardlayer deal-current" key={`cur-${index}`}>
              <PlayingCard card={current} />
            </div>
          )}
        </div>
      </button>

      <div className="deal-meta">
        <span className="deal-count">
          {shownNumber > 0 ? (
            <>
              <b>{shownNumber}</b> / {N}
            </>
          ) : (
            <>Full deck · {N} cards</>
          )}
        </span>
      </div>

      <div className="deal-controls">
        <button
          className="btn secondary"
          onClick={back}
          disabled={index <= -1}
        >
          Back
        </button>
        <button className="btn secondary" onClick={restart}>
          Restart
        </button>
      </div>
    </div>
  );
}
