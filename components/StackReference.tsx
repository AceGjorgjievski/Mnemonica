import { STACK } from "@/lib/stack";
import PlayingCard from "./PlayingCard";

export default function StackReference({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Full Mnemonica stack"
      onClick={onClose}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2 className="modal-title">Mnemonica — full stack</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <p className="modal-sub">All 52 cards, top of deck (1) to face (52).</p>
        <div className="stack-grid">
          {STACK.map((card, i) => (
            <div className="stack-cell" key={i}>
              <span className="stack-pos">{i + 1}</span>
              <PlayingCard card={card} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
