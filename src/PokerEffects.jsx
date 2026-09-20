import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RotateCcw, X } from "lucide-react";
import "./poker-effects.css";

const suits = {
  "Desarrollo web": "♠",
  "Aplicaciones a medida": "♣",
  "Integraciones y automatización": "♦",
};
export function ServiceChips({ selected, onRemove, paused }) {
  const reduced = useReducedMotion();
  const quiet = paused || reduced;
  return (
    <div className="poker-chip-tray" aria-label="Servicios elegidos">
      <span className="poker-chip-caption">Tu mano</span>
      <div className="poker-chip-stack">
        <AnimatePresence initial={false}>
          {selected.map((name, index) => (
            <motion.button
              type="button"
              key={name}
              layout={!quiet}
              className="poker-service-chip"
              style={{ zIndex: index + 1 }}
              aria-label={"Quitar " + name}
              title={"Quitar " + name}
              initial={{
                opacity: quiet ? 1 : 0,
                y: quiet ? 0 : -65,
                rotate: quiet ? 0 : -150,
              }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: quiet ? 0 : -35, scale: quiet ? 1 : 0.7 }}
              transition={{ duration: quiet ? 0 : 0.45, type: "tween" }}
              onClick={() => onRemove(name)}
            >
              <span aria-hidden="true">{suits[name]}</span>
              <X className="poker-chip-remove" size={12} />
            </motion.button>
          ))}
        </AnimatePresence>
        {!selected.length && (
          <span className="poker-empty-chip" aria-hidden="true">
            ♤
          </span>
        )}
      </div>
      <span className="poker-chip-count">
        {selected.length
          ? selected.length +
            (selected.length === 1 ? " servicio" : " servicios")
          : "Elige tus servicios"}
      </span>
    </div>
  );
}

export function ProjectReveal({ children, paused }) {
  const reduced = useReducedMotion();
  const quiet = paused || reduced;
  const [seen, setSeen] = useState(false);
  const [replay, setReplay] = useState(0);
  return (
    <motion.div
      className="poker-project-reveal"
      onViewportEnter={() => setSeen(true)}
      viewport={{ once: true, amount: 0.45 }}
    >
      {children}
      {seen && (
        <motion.div
          key={replay}
          className="poker-project-cover"
          aria-hidden="true"
          initial={{
            opacity: quiet ? 0 : 1,
            scale: 0.82,
            rotateY: 0,
            borderRadius: 8,
          }}
          animate={{
            opacity: quiet ? 0 : [1, 1, 0],
            scale: quiet ? 1 : [0.82, 1.04, 1],
            rotateY: quiet ? 0 : [0, 160, 360],
            borderRadius: 28,
          }}
          transition={{
            duration: quiet ? 0 : 1.35,
            times: [0, 0.62, 1],
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span>J</span>
          <b>♦</b>
          <strong>
            Una idea.
            <br />
            Un producto.
          </strong>
          <span>J</span>
        </motion.div>
      )}
      <button
        type="button"
        className="poker-replay"
        onClick={() => {
          setSeen(true);
          setReplay((value) => value + 1);
        }}
        disabled={quiet}
        aria-label="Repetir transformación de carta a demo"
      >
        <RotateCcw size={13} />
        Repetir entrada
      </button>
    </motion.div>
  );
}

export function CardBurst({ active, quiet }) {
  return (
    <div className="poker-burst" aria-hidden="true">
      <AnimatePresence>
        {active &&
          !quiet &&
          Array.from({ length: 9 }, (_, i) => (
            <motion.span
              key={i}
              className="poker-burst-card"
              initial={{ opacity: 0, x: 0, y: 40, rotate: 0, scale: 0.4 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: (i - 4) * 35,
                y: [40, -130 - (i % 3) * 25, -35],
                rotate: (i - 4) * 38,
                scale: [0.4, 1, 0.8],
              }}
              transition={{ duration: 1.55, delay: i * 0.035, ease: "easeOut" }}
            >
              {["♠", "♦", "♣", "♥"][i % 4]}
            </motion.span>
          ))}
      </AnimatePresence>
    </div>
  );
}
