import { STACK } from "@/lib/stack";

const N = STACK.length;

const PRESETS: { label: string; s: number; e: number }[] = [
  { label: "1–10", s: 1, e: 10 },
  { label: "1–20", s: 1, e: 20 },
  { label: "1–26", s: 1, e: 26 },
  { label: "All", s: 1, e: N },
];

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export default function RangeControl({
  start,
  end,
  onChange,
  roundIndex,
  roundSize,
}: {
  start: number;
  end: number;
  onChange: (start: number, end: number) => void;
  roundIndex: number;
  roundSize: number;
}) {
  return (
    <div className="range">
      <div className="range-top">
        <span className="range-title">Range</span>
        <span className="range-current">
          {start}–{end} · {end - start + 1} cards
        </span>
      </div>

      <div className="range-presets">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={`chip ${start === p.s && end === p.e ? "active" : ""}`}
            onClick={() => onChange(p.s, p.e)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="range-steppers">
        <div className="stepper">
          <span className="stepper-label">From</span>
          <button
            className="stepper-btn"
            aria-label="Decrease start"
            onClick={() => onChange(clamp(start - 1, 1, end), end)}
            disabled={start <= 1}
          >
            −
          </button>
          <span className="stepper-val">{start}</span>
          <button
            className="stepper-btn"
            aria-label="Increase start"
            onClick={() => onChange(clamp(start + 1, 1, end), end)}
            disabled={start >= end}
          >
            +
          </button>
        </div>

        <div className="stepper">
          <span className="stepper-label">To</span>
          <button
            className="stepper-btn"
            aria-label="Decrease end"
            onClick={() => onChange(start, clamp(end - 1, start, N))}
            disabled={end <= start}
          >
            −
          </button>
          <span className="stepper-val">{end}</span>
          <button
            className="stepper-btn"
            aria-label="Increase end"
            onClick={() => onChange(start, clamp(end + 1, start, N))}
            disabled={end >= N}
          >
            +
          </button>
        </div>
      </div>

      <div className="range-progress">
        {roundIndex} / {roundSize} this round · no repeats
      </div>
    </div>
  );
}
