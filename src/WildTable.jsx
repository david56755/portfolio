import { useEffect, useRef, useState } from "react";
import {
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Grip,
  RotateCw,
  Shuffle,
  Undo2,
} from "lucide-react";
import "./wild-table.css";

const cards = [
  {
    title: "Cotiza Nails",
    label: "El proyecto",
    suit: "♦",
    type: "project",
    href: "#proyectos",
    link: "Probar la demo",
    reverseTitle: "Tu talento tiene valor.",
    reverse:
      "Una aplicación Android para cotizar servicios de manicura y organizar ingresos y gastos.",
    detail: "React Native · Expo · Firebase",
    status: "Android · En desarrollo",
  },
  {
    title: "Una idea. Un método.",
    label: "El proceso",
    suit: "♣",
    type: "process",
    href: "#como-trabajo",
    link: "Construir una idea",
    reverseTitle: "Creatividad con dirección.",
    reverse:
      "Definir una necesidad, darle estructura y convertirla en una experiencia que se pueda probar.",
    detail: "Una mesa de trabajo que puedes controlar",
    status: "De la pregunta al producto",
  },
  {
    title: "Tu próximo proyecto.",
    label: "La conversación",
    suit: "♠",
    type: "contact",
    href: "#contacto",
    link: "Contarme tu idea",
    reverseTitle: "Hablemos de tu proyecto.",
    reverse:
      "Un sitio web, una aplicación o una herramienta para tu negocio. Cuéntame qué necesitas resolver.",
    detail: "Brandon Lozada · Diseño & desarrollo",
    status: "Desde CDMX, para cualquier lugar",
  },
];

function TableCard({
  card,
  index,
  active,
  onSelect,
  position,
  linkRef,
  quiet,
  resetKey,
}) {
  const [flipped, setFlipped] = useState(false);
  const controls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    x.set(0);
    y.set(0);
  }, [resetKey, x, y]);
  function moveWithKeyboard(event) {
    const steps = {
      ArrowLeft: [-8, 0],
      ArrowRight: [8, 0],
      ArrowUp: [0, -8],
      ArrowDown: [0, 8],
    };
    if (event.key === "Home") {
      event.preventDefault();
      x.set(0);
      y.set(0);
    } else if (steps[event.key]) {
      event.preventDefault();
      const [dx, dy] = steps[event.key];
      x.set(Math.max(-48, Math.min(48, x.get() + dx)));
      y.set(Math.max(-20, Math.min(28, y.get() + dy)));
    }
  }
  return (
    <motion.div
      className={`wt-placement wt-placement-${index} ${active ? "wt-active" : ""}`}
      initial={false}
      animate={{
        x: position.x,
        y: position.y,
        rotate: position.rotate,
      }}
      transition={
        quiet
          ? { duration: 0 }
          : { type: "spring", stiffness: 140, damping: 24 }
      }
      style={{ zIndex: active ? 10 : index + 1 }}
    >
      <motion.article
        className={`wt-card wt-${card.type}`}
        style={{ x, y }}
        drag={!quiet}
        dragListener={false}
        dragControls={controls}
        dragConstraints={{ left: -48, right: 48, top: -20, bottom: 28 }}
        dragElastic={0.08}
        dragMomentum={false}
        onDragStart={onSelect}
        onPointerDown={onSelect}
        onFocusCapture={onSelect}
        whileDrag={{ scale: 1.04, cursor: "grabbing" }}
        aria-label={card.label}
      >
        <div className="wt-card-toolbar">
          <span>
            {String(index + 1).padStart(2, "0")} / {card.label}
          </span>
          <button
            className="wt-drag-handle"
            type="button"
            aria-label={`Mover carta: ${card.label}`}
            title="Arrastra para mover esta carta"
            aria-describedby="wt-move-help"
            disabled={quiet}
            onKeyDown={moveWithKeyboard}
            onPointerDown={(event) => {
              event.preventDefault();
              onSelect();
              controls.start(event);
            }}
          >
            <Grip size={16} />
          </button>
        </div>
        <div className="wt-face-space">
          <motion.div
            className="wt-face-turn"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={
              quiet
                ? { duration: 0 }
                : { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div className="wt-face wt-front" aria-hidden={flipped}>
              <span className="wt-suit" aria-hidden="true">
                {card.suit}
              </span>
              {index === 0 ? (
                <h2 className="wt-nails-name">
                  cotiza
                  <br />
                  <span>nails.</span>
                </h2>
              ) : (
                <h2>{card.title}</h2>
              )}
              {index === 1 && (
                <p className="wt-sequence">
                  Descubrir. Diseñar.
                  <br />
                  Desarrollar. Mejorar.
                </p>
              )}
              {index === 2 && (
                <span className="wt-card-signature">Brandon Lozada</span>
              )}
              <p className="wt-card-status">
                <i />
                {card.status}
              </p>
            </div>
            <div className="wt-face wt-back" aria-hidden={!flipped}>
              <span className="wt-back-mark" aria-hidden="true">
                {card.suit}
              </span>
              <h3>{card.reverseTitle}</h3>
              <p>{card.reverse}</p>
              <small>{card.detail}</small>
            </div>
          </motion.div>
        </div>
        <div className="wt-card-footer">
          <a href={card.href} ref={linkRef}>
            {card.link}
            <ArrowUpRight size={16} />
          </a>
          <button
            type="button"
            onClick={() => {
              onSelect();
              setFlipped(!flipped);
            }}
            aria-label={`${flipped ? "Ver frente" : "Girar carta"}: ${card.label}`}
            aria-pressed={flipped}
          >
            <RotateCw size={17} />
          </button>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function WildTable({ paused = false }) {
  const stage = useRef(null);
  const cardLinks = useRef([]);
  const reduced = useReducedMotion();
  const quiet = reduced || paused;
  const [spread, setSpread] = useState(true);
  const [selected, setSelected] = useState(0);
  const [deal, setDeal] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [spacing, setSpacing] = useState(55);
  // Una carta arrastrada vuelve a su lugar si cambia el tamaño de la mesa.
  useEffect(() => {
    let previousWidth;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      const cardWidth =
        stage.current.querySelector(".wt-placement").offsetWidth;
      setSpacing(
        Math.min(cardWidth * 1.06, Math.max(24, (width - cardWidth - 50) / 2)),
      );
      if (previousWidth !== undefined && width !== previousWidth) {
        setResetKey((value) => value + 1);
      }
      previousWidth = width;
    });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  const rotations = [
    [-7, 2, 8],
    [-3, -6, 5],
    [-9, 5, -3],
  ][deal % 3];
  function arrange(nextSpread, shuffle = false) {
    setSpread(nextSpread);
    if (shuffle) setDeal((value) => value + 1);
    setResetKey((value) => value + 1);
  }
  return (
    <section className="wild-table" id="inicio" aria-labelledby="wt-heading">
      <div className="wt-intro wrap">
        <p className="wt-byline">
          Brandon Lozada <span>Diseño & desarrollo independiente</span>
        </p>
        <motion.h1
          id="wt-heading"
          initial={{ opacity: 0, y: quiet ? 0 : 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: quiet ? 0 : 0.8 }}
        >
          IDEAS CON
          <br />
          <span>CARÁCTER.</span>
        </motion.h1>
        <div className="wt-margin-note">
          <span className="wt-note-symbol" aria-hidden="true">
            ↙
          </span>
          <p>
            Diseño con identidad.
            <br /> Desarrollo a medida.
            <br /> Atención a cada detalle.
          </p>
          <a href="#proyectos">
            Explorar Cotiza Nails
            <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="wt-edition" aria-hidden="true">
          Desarrollo independiente.
          <br />
          CDMX · Trabajo remoto.
        </div>
      </div>
      <div
        className={`wt-stage wrap ${spread ? "wt-spread" : "wt-stacked"}`}
        ref={stage}
      >
        <span className="wt-stage-word" aria-hidden="true">
          ♠
        </span>
        <span className="wt-table-note" aria-hidden="true">
          Una perspectiva diferente.
          <br />
          Un propósito claro.
        </span>
        {cards.map((card, index) => (
          <TableCard
            key={card.type}
            card={card}
            index={index}
            linkRef={(node) => {
              cardLinks.current[index] = node;
            }}
            quiet={quiet}
            active={selected === index}
            onSelect={() => setSelected(index)}
            resetKey={resetKey}
            position={
              spread
                ? {
                    x: (index - 1) * spacing,
                    y: index === 1 ? 4 : 20,
                    rotate: rotations[index],
                  }
                : {
                    x: (index - 1) * 12,
                    y: index * 5,
                    rotate: (index - 1) * 5,
                  }
            }
          />
        ))}
      </div>
      <div className="wt-bottom wrap">
        <div className="wt-selector" role="group" aria-label="Elegir carta">
          {cards.map((card, index) => (
            <button
              type="button"
              key={card.type}
              aria-pressed={selected === index}
              onClick={() => {
                setSelected(index);
                cardLinks.current[index]?.focus({ preventScroll: true });
              }}
            >
              <span>0{index + 1}</span>
              {card.label}
            </button>
          ))}
        </div>
        <div className="wt-table-controls">
          <button
            type="button"
            onClick={() => arrange(!spread)}
            aria-pressed={spread}
          >
            <Shuffle size={16} />
            {spread ? "Recoger cartas" : "Repartir cartas"}
          </button>
          <button type="button" onClick={() => arrange(true, true)}>
            <Undo2 size={15} />
            Recomponer
          </button>
        </div>
      </div>
      <div className="wt-colophon wrap">
        <span className="sr-only" id="wt-move-help">
          Usa las flechas para mover la carta. Inicio la devuelve a su posición.
        </span>
        <p>
          Mueve las cartas desde <Grip size={13} />. Gíralas para descubrir más.
        </p>
        <a href="#proyectos">
          Ver el proyecto completo
          <ArrowDownRight size={20} />
        </a>
      </div>
    </section>
  );
}
