// Ambient animated backdrop: blurred playing cards slowly drift and rotate while
// a soft "shuffle fan" springs open and closed. Purely decorative — sits behind
// the app, ignores pointer events, and goes still for reduced-motion users.
// No randomness at render time so it stays SSR-deterministic.

const SUITS = [
  { glyph: "♠", red: false }, // ♠
  { glyph: "♥", red: true }, //  ♥
  { glyph: "♦", red: true }, //  ♦
  { glyph: "♣", red: false }, // ♣
];

// Drifting cards scattered across the viewport. Each value is tuned by hand so
// they spread out and never march in lockstep.
const DRIFT = [
  { top: "8%", left: "6%", suit: 1, size: 150, dur: 26, delay: 0, rot: -18 },
  { top: "14%", left: "78%", suit: 0, size: 190, dur: 32, delay: -6, rot: 12 },
  { top: "44%", left: "-4%", suit: 2, size: 220, dur: 38, delay: -14, rot: 20 },
  { top: "62%", left: "70%", suit: 3, size: 170, dur: 30, delay: -3, rot: -14 },
  { top: "80%", left: "16%", suit: 1, size: 160, dur: 34, delay: -20, rot: 8 },
  { top: "30%", left: "40%", suit: 0, size: 130, dur: 28, delay: -10, rot: -6 },
  { top: "88%", left: "84%", suit: 2, size: 200, dur: 36, delay: -24, rot: 16 },
  { top: "4%", left: "44%", suit: 3, size: 140, dur: 30, delay: -16, rot: 22 },
];

// A small fan of cards near the centre that springs open, like a shuffle.
const FAN = [-32, -16, 0, 16, 32];

export default function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-glow" />

      {DRIFT.map((c, i) => {
        const suit = SUITS[c.suit];
        return (
          <div
            key={`d${i}`}
            className={`ambient-card ${suit.red ? "ac-red" : "ac-black"}`}
            style={
              {
                top: c.top,
                left: c.left,
                "--size": `${c.size}px`,
                "--dur": `${c.dur}s`,
                "--delay": `${c.delay}s`,
                "--rot": `${c.rot}deg`,
              } as React.CSSProperties
            }
          >
            <span className="ambient-suit">{suit.glyph}</span>
          </div>
        );
      })}

      <div className="ambient-fan">
        {FAN.map((angle, i) => {
          const suit = SUITS[i % SUITS.length];
          return (
            <div
              key={`f${i}`}
              className={`ambient-fancard ${suit.red ? "ac-red" : "ac-black"}`}
              style={
                { "--angle": `${angle}deg`, "--i": i } as React.CSSProperties
              }
            >
              <span className="ambient-suit">{suit.glyph}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
