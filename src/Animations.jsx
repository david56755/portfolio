import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

// Las entradas se reproducen una vez para no ocultar contenido al volver a leer.
export function Reveal({ children, className, delay = 0 }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduced ? 0 : 0.75,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function HeroTitle() {
  const reduced = useReducedMotion();
  return (
    <h1 aria-label="Diseño fuera del molde.">
      {["Diseño", "fuera del", "molde."].map((line, index) => (
        <span className="title-mask" key={line} aria-hidden="true">
          <motion.span
            initial={{ y: reduced ? 0 : "110%" }}
            animate={{ y: 0 }}
            transition={{
              duration: reduced ? 0 : 1,
              delay: 0.15 + index * 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

// MotionValue actualiza transformaciones sin renderizar React por cada píxel.
export function Tilt({ children, className, paused = false }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 180, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 180, damping: 24 });
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  function move(event) {
    if (reduced || paused || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(-((event.clientY - rect.top) / rect.height - 0.5) * 7);
    y.set(((event.clientX - rect.left) / rect.width - 0.5) * 7);
  }
  return (
    <motion.div
      className={className}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
      style={{
        rotateX: reduced || paused ? 0 : rotateX,
        rotateY: reduced || paused ? 0 : rotateY,
        transformPerspective: 1100,
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollArtwork({ children }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [22, -22]);
  return (
    <motion.div
      ref={ref}
      className="scroll-artwork"
      style={{ y: reduced ? 0 : y }}
    >
      {children}
    </motion.div>
  );
}

// Cada línea sube desde una máscara cuando el título entra en pantalla.
export function SplitReveal({
  lines,
  as: Tag = "h2",
  className,
  delay = 0,
  ...rest
}) {
  const reduced = useReducedMotion();
  return (
    <Tag className={className} aria-label={lines.join(" ")} {...rest}>
      {lines.map((line, index) => (
        <span className="split-mask" key={index} aria-hidden="true">
          <motion.span
            className="split-line"
            initial={{ y: reduced ? 0 : "108%", rotate: reduced ? 0 : 2 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: reduced ? 0 : 0.9,
              delay: reduced ? 0 : delay + index * 0.11,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// Las cartas de servicio se reparten desde el mazo, una tras otra.
export function DealIn({ children, className, index = 0 }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, x: -70, y: 90, rotate: -14 + index * 4, scale: 0.9 }
      }
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduced ? 0 : 0.85,
        delay: reduced ? 0 : 0.1 + index * 0.16,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// El botón se inclina hacia el cursor y regresa con un resorte al salir.
export function Magnetic({ children, className, paused = false, strength = 0.32 }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dx = useSpring(x, { stiffness: 220, damping: 18 });
  const dy = useSpring(y, { stiffness: 220, damping: 18 });
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  function move(event) {
    if (reduced || paused || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  }
  return (
    <motion.div
      className={className}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
      style={{ x: reduced || paused ? 0 : dx, y: reduced || paused ? 0 : dy, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}

// Un brillo sigue al cursor sobre la tarjeta mediante variables CSS.
export function useSpotlight(paused = false) {
  const reduced = useReducedMotion();
  return {
    onPointerMove(event) {
      if (reduced || paused || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
      event.currentTarget.style.setProperty("--spot", "1");
    },
    onPointerLeave(event) {
      event.currentTarget.style.setProperty("--spot", "0");
    },
  };
}
