export function SiteLoader() {
  // Keep this artwork in sync with the pre-bundle root placeholder (covered by parity tests).
  return (
    <svg aria-hidden="true" className="site-loader" focusable="false" viewBox="0 0 64 64">
      <g transform="translate(32 32) scale(0.89) translate(-32 -32)">
        <path d="M4.5 59.5 V30 A9 9 0 0 1 8.12 22.79 L32 5 L55.88 22.79 A9 9 0 0 1 59.5 30 V59.5 Z" fill="#16110e" stroke="#16110e" style={{ strokeWidth: "17", strokeLinejoin: "round" }} />
        <path d="M4.5 59.5 V30 A9 9 0 0 1 8.12 22.79 L32 5 L55.88 22.79 A9 9 0 0 1 59.5 30 V59.5 Z" fill="none" stroke="#ff4fa3" style={{ strokeWidth: "5", strokeLinejoin: "miter", opacity: "var(--tube,1)" }} />
        <path d="M7 57 V50 C12 46 16 44 20 44 C23 50 27 54 32 55 C40 56 50 56 57 56 V57 Z" fill="#b07f2f" />
        <path d="M27 57 C34 50 40 38 46 38 C49 44 50 49 54 50.5 C55.5 51 56.5 51 57 51 V57 Z" fill="#d9a23a" />
        <path d="M30 17 A12 12 0 0 0 30 41 A14 14 0 0 1 30 17 Z" fill="#35e0ff" />
        <path d="M42 24 L43.5 27.5 L47 29 L43.5 30.5 L42 34 L40.5 30.5 L37 29 L40.5 27.5 Z" fill="#35e0ff" />
        <path d="M4.5 59.5 V30 A9 9 0 0 1 8.12 22.79 L32 5 L55.88 22.79 A9 9 0 0 1 59.5 30 V59.5 Z" pathLength="100" fill="none" stroke="var(--tr,#ffd6ea)" style={{ strokeWidth: "5", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "14 86", strokeDashoffset: "var(--ld-off,0)", animation: "var(--ld-anim,trace 2.2s linear infinite)", filter: "var(--ld-glow,drop-shadow(0 0 3px #ff4fa3))" }} />
      </g>
    </svg>
  );
}
