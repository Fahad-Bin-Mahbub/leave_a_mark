// A painted handprint, drawn from simple shapes and roughed up with an SVG filter
// so the edges look like real paint on a wall.
import type { SVGProps } from "react";

export function PaintDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="paint" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={2} seed={4} result="edge" />
          <feDisplacementMap in="SourceGraphic" in2="edge" scale={5} xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves={1} seed={11} result="grain" />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.4"
            result="grainAlpha"
          />
          <feComposite in="rough" in2="grainAlpha" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

interface HandShapeProps {
  color?: string;
  flip?: boolean;
  paint?: boolean;
  outline?: boolean;
  className?: string;
}

export default function HandShape({
  color = "#FF5A36",
  flip = false,
  paint = true,
  outline = false,
  className = "",
}: HandShapeProps) {
  const groupProps: SVGProps<SVGGElement> = outline
    ? { fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeDasharray: "6 5", strokeLinecap: "round" }
    : { fill: color, filter: paint ? "url(#paint)" : undefined };

  return (
    <svg viewBox="-8 0 108 120" className={`hand-svg ${className}`} aria-hidden="true" focusable="false">
      <g {...groupProps} transform={flip ? "translate(92 0) scale(-1 1)" : undefined}>
        {/* palm */}
        <rect x="23" y="50" width="56" height="56" rx="24" />
        {/* index, middle, ring, pinky */}
        <rect x="22" y="16" width="13" height="46" rx="6.5" transform="rotate(-10 28 60)" />
        <rect x="38" y="5" width="13" height="53" rx="6.5" transform="rotate(-3 44 58)" />
        <rect x="54" y="9" width="13" height="51" rx="6.5" transform="rotate(4 60 58)" />
        <rect x="69" y="24" width="11" height="40" rx="5.5" transform="rotate(12 74 62)" />
        {/* thumb */}
        <rect x="14" y="58" width="14" height="38" rx="7" transform="rotate(-30 26 96)" />
      </g>
    </svg>
  );
}

