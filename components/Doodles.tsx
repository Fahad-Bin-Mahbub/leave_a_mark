// Little hand-drawn doodles used as decoration.

interface DoodleProps {
  className?: string;
  color?: string;
}

export function Squiggle({ className = "", color = "currentColor" }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 20" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path
        d="M3 13 C 25 3, 40 3, 55 12 S 85 20, 100 10 S 135 2, 150 11 S 180 19, 197 8"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Sparkle({ className = "", color = "currentColor" }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M20 2 C21.5 14 26 18.5 38 20 C26 21.5 21.5 26 20 38 C18.5 26 14 21.5 2 20 C14 18.5 18.5 14 20 2Z" fill={color} />
    </svg>
  );
}

export function Star({ className = "", color = "currentColor" }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 4 l5.6 12.4 13.4 1.4 -10 9.2 2.8 13.2 L24 33.6 12.2 40.2 15 27 5 17.8l13.4-1.4z"
        fill={color}
        stroke="#1a1714"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CurlyArrow({ className = "" }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
      <path
        d="M6 10 C 40 0, 70 10, 60 32 C 52 50, 30 40, 42 28 C 56 14, 90 30, 104 62"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M92 58 L105 66 L110 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Splat({ className = "", color = "currentColor" }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        fill={color}
        d="M52 8c6 0 7 12 13 13s12-9 17-4-4 13 0 18 15 1 15 8-12 6-13 12 9 12 4 17-13-3-18 1-2 15-9 16-8-11-14-11-9 11-15 8 0-13-5-17-15 0-16-7 10-9 9-15S6 46 8 40s13 1 16-4-5-14 1-17 10 8 16 6S46 8 52 8z"
      />
      <circle cx="90" cy="14" r="4" fill={color} />
      <circle cx="10" cy="86" r="3" fill={color} />
      <circle cx="84" cy="90" r="2.5" fill={color} />
    </svg>
  );
}

