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
