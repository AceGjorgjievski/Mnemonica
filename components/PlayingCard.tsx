import { SUIT_SYMBOL, isRed, cardLabel, type Card } from "@/lib/stack";

type Col = "L" | "C" | "R";

const COL_X: Record<Col, string> = { L: "27%", C: "50%", R: "73%" };

// Pip positions as [column, top%]. Pips in the lower half (top > 50) are
// rendered upside-down, like a real card.
const PIP_LAYOUT: Record<string, [Col, number][]> = {
  A: [["C", 50]],
  "2": [["C", 16], ["C", 84]],
  "3": [["C", 16], ["C", 50], ["C", 84]],
  "4": [["L", 16], ["R", 16], ["L", 84], ["R", 84]],
  "5": [["L", 16], ["R", 16], ["C", 50], ["L", 84], ["R", 84]],
  "6": [["L", 16], ["R", 16], ["L", 50], ["R", 50], ["L", 84], ["R", 84]],
  "7": [["L", 16], ["R", 16], ["C", 33], ["L", 50], ["R", 50], ["L", 84], ["R", 84]],
  "8": [["L", 16], ["R", 16], ["C", 33], ["L", 50], ["R", 50], ["C", 67], ["L", 84], ["R", 84]],
  "9": [["L", 16], ["R", 16], ["L", 38], ["R", 38], ["C", 50], ["L", 62], ["R", 62], ["L", 84], ["R", 84]],
  "10": [["L", 16], ["R", 16], ["C", 29], ["L", 38], ["R", 38], ["L", 62], ["R", 62], ["C", 71], ["L", 84], ["R", 84]],
};

const COURT = new Set(["J", "Q", "K"]);

function Pips({ card }: { card: Card }) {
  const layout = PIP_LAYOUT[card.rank];
  if (!layout) return null;
  const symbol = SUIT_SYMBOL[card.suit];
  return (
    <>
      {layout.map(([col, top], i) => (
        <span
          key={i}
          className="pc-pip"
          style={{
            left: COL_X[col],
            top: `${top}%`,
            transform: `translate(-50%, -50%)${top > 50 ? " rotate(180deg)" : ""}`,
          }}
        >
          {symbol}
        </span>
      ))}
    </>
  );
}

export default function PlayingCard({
  card,
  size = "lg",
}: {
  card: Card;
  size?: "lg" | "sm";
}) {
  const colorClass = isRed(card.suit) ? "pc-red" : "pc-black";
  const symbol = SUIT_SYMBOL[card.suit];
  const isCourt = COURT.has(card.rank);

  return (
    <div
      className={`pcard pcard-${size} ${colorClass}`}
      aria-label={cardLabel(card)}
    >
      <div className="pc-corner pc-tl">
        <span className="pc-rank">{card.rank}</span>
        <span className="pc-csuit">{symbol}</span>
      </div>

      <div className="pc-face">
        {isCourt ? (
          <div className="pc-court">
            <span className="pc-court-rank">{card.rank}</span>
            <span className="pc-court-suit">{symbol}</span>
          </div>
        ) : (
          <Pips card={card} />
        )}
      </div>

      <div className="pc-corner pc-br">
        <span className="pc-rank">{card.rank}</span>
        <span className="pc-csuit">{symbol}</span>
      </div>
    </div>
  );
}
