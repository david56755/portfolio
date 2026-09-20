import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Minus, Spade } from "lucide-react";
import "./casino.css";

// SVG propio: las piezas se animan con CSS, sin vídeos ni imágenes pesadas.
export default function CasinoCompanion({ paused }) {
  const [compact, setCompact] = useState(false);
  const [dealing, setDealing] = useState(false);
  const [hiddenPage, setHiddenPage] = useState(false);
  const reduced = useReducedMotion();
  const still = paused || reduced || hiddenPage;
  useEffect(() => {
    const sync = () => setHiddenPage(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  useEffect(() => {
    if (!dealing) return;
    const timer = setTimeout(() => setDealing(false), 1600);
    return () => clearTimeout(timer);
  }, [dealing]);
  return (
    <aside
      className={
        "casino-companion" +
        (still ? " casino-still" : "") +
        (dealing ? " casino-dealing" : "") +
        (compact ? " casino-compact" : "")
      }
      aria-label="Comodín del portafolio"
    >
      {compact ? (
        <button
          className="casino-restore"
          onClick={() => setCompact(false)}
          aria-label="Mostrar comodín"
        >
          <Spade size={20} />
        </button>
      ) : (
        <>
          <button
            className="casino-minimize"
            onClick={() => setCompact(true)}
            aria-label="Minimizar comodín"
          >
            <Minus size={15} />
          </button>
          <button
            className="casino-character"
            onClick={() => setDealing(true)}
            aria-label="Barajar cartas con el comodín"
            disabled={still || dealing}
          >
            <svg viewBox="0 0 220 250" aria-hidden="true" focusable="false">
              <ellipse
                cx="110"
                cy="231"
                rx="68"
                ry="9"
                fill="#090610"
                opacity=".35"
              />
              <g className="casino-body">
                <path
                  d="M72 148 Q48 178 45 214 L83 226 L110 208 L140 228 L179 212 Q172 168 148 148Z"
                  fill="#633b8a"
                  stroke="#201426"
                  strokeWidth="3"
                />
                <path
                  d="M92 141 L111 162 L130 141 L142 207 L110 217 L78 207Z"
                  fill="#a4ce65"
                  stroke="#201426"
                  strokeWidth="3"
                />
                <path
                  d="M86 143 L105 158 L87 172 L77 153 M135 143 L115 158 L135 173 L145 153"
                  fill="#d9bce9"
                  stroke="#201426"
                  strokeWidth="3"
                />
                <path
                  d="M105 159 L117 159 L121 172 L111 183 L101 172Z"
                  fill="#482640"
                />
                <path
                  d="M72 152 L58 191 L86 187 M150 153 L164 191 L137 188"
                  fill="none"
                  stroke="#a383bf"
                  strokeWidth="3"
                />
                <g className="casino-head">
                  <path
                    d="M72 78 Q64 36 105 34 Q158 25 153 83 L145 111 Q132 143 111 145 Q84 139 75 108Z"
                    fill="#f1e9dc"
                    stroke="#24192a"
                    strokeWidth="3"
                  />
                  <path
                    d="M69 86 Q51 54 77 34 L72 19 L98 30 L112 11 L124 28 L146 17 L144 36 Q174 49 153 88 L144 65 Q129 62 117 43 Q99 62 77 64Z"
                    fill="#91be54"
                    stroke="#24192a"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M76 51 L95 40 M127 34 L147 48"
                    stroke="#cfef8a"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M83 82 L100 87 M122 86 L140 79"
                    stroke="#36243e"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <g className="casino-eyes">
                    <path
                      d="M88 94 L99 96 M124 96 L135 91"
                      stroke="#24192a"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </g>
                  <path
                    d="M111 94 L106 108 L115 108"
                    fill="none"
                    stroke="#bbab9e"
                    strokeWidth="2"
                  />
                  <path
                    d="M83 112 Q110 138 139 108 Q127 132 111 132 Q95 129 83 112Z"
                    fill="#9b365d"
                  />
                  <path
                    d="M92 116 Q112 126 130 114"
                    fill="none"
                    stroke="#fff7e8"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </g>
                <g className="casino-arm casino-arm-left">
                  <path
                    d="M69 165 Q43 171 60 191 L95 188"
                    fill="none"
                    stroke="#201426"
                    strokeWidth="24"
                    strokeLinecap="round"
                  />
                  <path
                    d="M69 165 Q43 171 60 191 L95 188"
                    fill="none"
                    stroke="#8157a4"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="97"
                    cy="187"
                    rx="13"
                    ry="9"
                    fill="#f1e9dc"
                    stroke="#201426"
                    strokeWidth="2"
                  />
                </g>
                <g className="casino-arm casino-arm-right">
                  <path
                    d="M151 165 Q177 174 160 190 L130 186"
                    fill="none"
                    stroke="#201426"
                    strokeWidth="24"
                    strokeLinecap="round"
                  />
                  <path
                    d="M151 165 Q177 174 160 190 L130 186"
                    fill="none"
                    stroke="#8157a4"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="128"
                    cy="186"
                    rx="13"
                    ry="9"
                    fill="#f1e9dc"
                    stroke="#201426"
                    strokeWidth="2"
                  />
                </g>
              </g>
              {["♠", "♦", "♣"].map((suit, index) => (
                <g
                  key={suit}
                  className={"casino-flying-card casino-card-" + index}
                >
                  <rect
                    x="93"
                    y="161"
                    width="34"
                    height="46"
                    rx="4"
                    fill="#f6eedf"
                    stroke="#3b2547"
                    strokeWidth="2"
                  />
                  <text
                    x="110"
                    y="193"
                    textAnchor="middle"
                    fontSize="27"
                    fill={index === 1 ? "#9b365d" : "#3b2547"}
                  >
                    {suit}
                  </text>
                </g>
              ))}
              <g className="casino-spark">
                <path
                  d="M37 119 L41 129 L51 133 L41 137 L37 147 L33 137 L23 133 L33 129Z"
                  fill="#d1ed91"
                />
                <path
                  d="M182 75 L185 83 L193 86 L185 89 L182 97 L179 89 L171 86 L179 83Z"
                  fill="#c3a0dd"
                />
              </g>
            </svg>
            <span>{dealing ? "Tu próxima jugada…" : "¿Barajamos?"}</span>
          </button>
        </>
      )}
    </aside>
  );
}
