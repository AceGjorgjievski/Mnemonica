// Original ornamental red card back (evokes a classic deck without copying any
// specific copyrighted artwork). Fills its parent; parent should be 5:7 ratio.
export default function CardBack() {
  return (
    <svg
      className="cardback-svg"
      viewBox="0 0 100 140"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="cb-lattice"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="6" height="6" fill="#c01f29" />
          <path
            d="M0 0H6M0 3H6"
            stroke="#e3656b"
            strokeWidth="0.5"
            opacity="0.8"
          />
          <path d="M3 0V6" stroke="#e3656b" strokeWidth="0.5" opacity="0.5" />
        </pattern>
        <radialGradient id="cb-medal" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#d83640" />
          <stop offset="100%" stopColor="#a9161f" />
        </radialGradient>
      </defs>

      {/* card body */}
      <rect x="0.5" y="0.5" width="99" height="139" rx="9" fill="#fdfdfb" />
      <rect x="3" y="3" width="94" height="134" rx="7" fill="#c01f29" />
      {/* lattice field */}
      <rect x="6" y="6" width="88" height="128" rx="5" fill="url(#cb-lattice)" />
      {/* white framing borders */}
      <rect
        x="8"
        y="8"
        width="84"
        height="124"
        rx="4"
        fill="none"
        stroke="#fdfdfb"
        strokeWidth="1.4"
      />
      <rect
        x="11"
        y="11"
        width="78"
        height="118"
        rx="3"
        fill="none"
        stroke="#fdfdfb"
        strokeWidth="0.7"
        opacity="0.85"
      />

      {/* corner flourishes */}
      {[
        [16, 16, 1],
        [84, 16, -1],
        [16, 124, 1],
        [84, 124, -1],
      ].map(([cx, cy], i) => (
        <g key={i} stroke="#fdfdfb" strokeWidth="0.9" fill="none" opacity="0.9">
          <circle cx={cx} cy={cy} r="3.4" />
          <circle cx={cx} cy={cy} r="1.3" fill="#fdfdfb" stroke="none" />
        </g>
      ))}

      {/* central dual medallion */}
      <g>
        <ellipse
          cx="50"
          cy="45"
          rx="18"
          ry="24"
          fill="url(#cb-medal)"
          stroke="#fdfdfb"
          strokeWidth="1.2"
        />
        <ellipse
          cx="50"
          cy="95"
          rx="18"
          ry="24"
          fill="url(#cb-medal)"
          stroke="#fdfdfb"
          strokeWidth="1.2"
        />
        {/* emblems */}
        {[45, 95].map((cy, i) => (
          <g key={i} stroke="#fdfdfb" strokeWidth="0.8" fill="none">
            <circle cx="50" cy={cy} r="7" />
            {Array.from({ length: 12 }).map((_, k) => {
              const a = (k * Math.PI) / 6;
              const x1 = 50 + Math.cos(a) * 8.5;
              const y1 = cy + Math.sin(a) * 8.5;
              const x2 = 50 + Math.cos(a) * 11;
              const y2 = cy + Math.sin(a) * 11;
              return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
            <circle cx="50" cy={cy} r="2" fill="#fdfdfb" stroke="none" />
          </g>
        ))}
      </g>
    </svg>
  );
}
