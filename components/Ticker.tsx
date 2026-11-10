import { SNARK } from "@/lib/config";
import { Sparkle } from "./Doodles";

export default function Ticker() {
  const lines = [...SNARK, ...SNARK];
  return (
    <div className="ticker" aria-label="Some honest disclaimers">
      <div className="ticker-track">
        {lines.map((line, i) => (
          <span key={i} className="ticker-item" aria-hidden={i >= SNARK.length}>
            <Sparkle className="ticker-spark" />
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

