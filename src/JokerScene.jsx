import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RotateCw, Shuffle } from "lucide-react";
import { Tilt } from "./Animations";

const messages = [
  [
    "La mejor carta",
    "es una buena idea.",
    "Diseño y desarrollo para darle forma.",
  ],
  [
    "Cada detalle",
    "cambia la partida.",
    "Interfaces pensadas para personas reales.",
  ],
  [
    "Su proyecto.",
    "Mi próxima jugada.",
    "Construyamos algo que merezca recordarse.",
  ],
];

export default function JokerScene() {
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [deal, setDeal] = useState(0);
  const current = messages[deal % messages.length];
  return (
    <div className="joker-scene">
      <div className="stage-halo" aria-hidden="true" />
      <div className="scene-cross cross-one" aria-hidden="true">
        +
      </div>
      <div className="scene-cross cross-two" aria-hidden="true">
        +
      </div>
      <motion.div
        aria-hidden="true"
        className="card-back back-one"
        animate={{
          rotate: [-19, -28, -12][deal % 3],
          x: [-44, -64, -27][deal % 3],
          y: [0, -8, 14][deal % 3],
        }}
        transition={{
          duration: reduced ? 0 : 0.65,
          type: "spring",
          bounce: 0.2,
        }}
      >
        <span>BL</span>
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="card-back back-two"
        animate={{
          rotate: [14, 24, 8][deal % 3],
          x: [32, 49, 20][deal % 3],
          y: [0, 14, -12][deal % 3],
        }}
        transition={{
          duration: reduced ? 0 : 0.65,
          type: "spring",
          bounce: 0.2,
        }}
      >
        <span>✦</span>
      </motion.div>
      <Tilt className="joker-tilt">
        <div className="joker-card">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="card-content"
              key={flipped ? `back-${deal}` : "front"}
              initial={{ rotateY: reduced ? 0 : -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: reduced ? 0 : 90, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.23 }}
            >
              {!flipped ? (
                <>
                  <div className="card-corner" aria-hidden="true">
                    J<span>♠</span>
                  </div>
                  <span className="card-edition">The creative mind</span>
                  <div className="joker-emblem" aria-hidden="true">
                    <div className="eye eye-left" />
                    <div className="eye eye-right" />
                    <div className="grin">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                  <div className="card-title">
                    JOKER<span>Una perspectiva diferente.</span>
                  </div>
                  <div className="card-corner bottom-corner" aria-hidden="true">
                    J<span>♠</span>
                  </div>
                </>
              ) : (
                <div className="card-reverse">
                  <span aria-hidden="true">✦</span>
                  <p>
                    {current[0]}
                    <br />
                    {current[1]}
                  </p>
                  <small>{current[2]}</small>
                  <b>BRANDON LOZADA</b>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <button
            className="card-flip-control"
            onClick={() => setFlipped(!flipped)}
            aria-label={
              flipped
                ? "Mostrar frente de la carta"
                : "Descubrir el reverso de la carta"
            }
          />
        </div>
      </Tilt>
      <span className="floating-suit suit-one" aria-hidden="true">
        ♣
      </span>
      <span className="floating-suit suit-two" aria-hidden="true">
        ♦
      </span>
      <div className="deck-controls">
        <button onClick={() => setFlipped(!flipped)}>
          <RotateCw size={14} />
          {flipped ? "Ver frente" : "Girar carta"}
        </button>
        <button onClick={() => setDeal(deal + 1)}>
          <Shuffle size={14} />
          Repartir cartas
        </button>
      </div>
      <span className="deck-announcement" role="status">
        {deal > 0
          ? `Composición ${(deal % 3) + 1}`
          : "Toca la carta. Descubre otra perspectiva."}
      </span>
    </div>
  );
}
