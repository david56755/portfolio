import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  MoveHorizontal,
  RotateCcw,
  Play,
  Pause,
  ScanLine,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import "./workbench.css";

const phases = [
  {
    name: "La pregunta",
    title: "Todo empieza con algo por resolver.",
    copy: "¿Cómo puede una manicurista cotizar sin perder de vista cada detalle? Primero entendemos la necesidad; después elegimos la tecnología.",
    detail: "Objetivo: convertir una necesidad real en una herramienta útil.",
  },
  {
    name: "La estructura",
    title: "Le damos un lugar a cada decisión.",
    copy: "Servicio, largo y decoración. La información se organiza alrededor de lo que la persona necesita decidir, en el orden en que lo necesita.",
    detail: "Resultado: un flujo que se entiende antes de escribir código.",
  },
  {
    name: "La lógica",
    title: "El diseño empieza a responder.",
    copy: "Cada selección se convierte en un estado y cada importe en una regla. Conectamos la interfaz y comprobamos que el resultado sea coherente.",
    detail: "Ejemplo ilustrativo: base + largo + decoración.",
  },
  {
    name: "El producto",
    title: "La idea ya se puede utilizar.",
    copy: "Probamos la experiencia completa, ajustamos los detalles y documentamos la entrega. El resultado se puede recorrer y mejorar.",
    detail:
      "Cotiza Nails: proyecto Android en desarrollo, con demo disponible arriba.",
  },
];

export default function ProjectWorkbench({ paused = false }) {
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [compare, setCompare] = useState(false);
  const startPosition = useRef(0);
  const reduced = useReducedMotion();
  const phase = Math.min(3, Math.floor(position / 25));
  const current = phases[phase];
  const visualPosition = compare ? 0 : position;
  const progress = visualPosition / 100;
  const structure = Math.min(1, Math.max(0, (visualPosition - 12) / 23));
  const logic = Math.min(1, Math.max(0, (visualPosition - 38) / 24));
  const product = Math.min(1, Math.max(0, (visualPosition - 65) / 30));

  function seek(value) {
    setPlaying(false);
    setCompare(false);
    setPosition(value);
  }
  function togglePlayback() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (reduced) {
      seek(100);
      return;
    }
    startPosition.current = position === 100 ? 0 : position;
    setPosition(startPosition.current);
    setCompare(false);
    setPlaying(true);
  }
  // El recorrido solo empieza con un clic; se detiene al salir de la pestaña.
  useEffect(() => {
    if (!playing) return;
    if (paused || reduced) {
      setPlaying(false);
      return;
    }
    const started = performance.now();
    let frame;
    const tick = (now) => {
      const next = Math.min(100, startPosition.current + (now - started) / 80);
      setPosition(Math.round(next));
      if (next < 100) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    const stopWhenHidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", stopWhenHidden);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", stopWhenHidden);
    };
  }, [playing, paused, reduced]);

  return (
    <section
      id="como-trabajo"
      className="workbench-section wrap"
      aria-labelledby="workbench-heading"
    >
      <div className="workbench-intro">
        <div>
          <p className="section-kicker">Dentro del proceso</p>
          <h2 id="workbench-heading">
            Una idea no llega
            <br />
            <span>terminada.</span>
          </h2>
        </div>
        <p>
          No hace falta imaginar el recorrido.
          <br />
          Puede construirlo aquí.
          <ArrowDownRight size={28} strokeWidth={1.1} />
        </p>
      </div>
      <div
        className={playing ? "workbench is-playing" : "workbench"}
        style={{ "--wb-progress": progress }}
      >
        <div className="wb-topline">
          <span>
            <i />
            Mesa de trabajo / Cotiza Nails
          </span>
          <span>Del primer trazo a la interfaz</span>
        </div>
        <div className="wb-main">
          <div className="wb-explanation">
            <div className="wb-phase" aria-hidden="true">
              <span>{String(phase + 1).padStart(2, "0")}</span>
              <i />
              {current.name}
            </div>
            {/* Las capas comparten celda: reservan el alto del texto más largo. */}
            <div className="wb-copy">
              {phases.map((item, index) => (
                <motion.div
                  key={item.name}
                  aria-hidden={phase !== index}
                  style={{ visibility: phase === index ? "visible" : "hidden" }}
                  initial={false}
                  animate={{
                    opacity: phase === index ? 1 : 0,
                    y: reduced || phase === index ? 0 : 10,
                  }}
                  transition={{ duration: reduced ? 0 : 0.3 }}
                >
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <small>{item.detail}</small>
                </motion.div>
              ))}
            </div>
            <a href="#proyectos" className="wb-project-link">
              Explorar el proyecto
              <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="wb-scene" aria-hidden="true">
            <div className="wb-axis axis-horizontal" />
            <div className="wb-axis axis-vertical" />
            <span className="wb-coordinate coord-top">idea ↗</span>
            <span className="wb-coordinate coord-bottom">
              {visualPosition === 100 ? "listo para explorar" : "en construcción"}
            </span>
            <div
              className="wb-paper wb-sketch"
              style={{
                opacity: 1 - product * 0.8,
                transform: `translate(${-progress * 48}px, ${progress * 14}px) rotate(${-9 + progress * 3}deg)`,
              }}
            >
              <span className="wb-paper-label">La necesidad</span>
              <div className="wb-handwriting">
                ¿Cuánto
                <br />
                cobro?
              </div>
              <span className="wb-sketch-line" />
              <p>
                mi trabajo
                <br />+ materiales
                <br />+ cada detalle
              </p>
              <span className="wb-drawn-arrow">↗</span>
              <span className="wb-paper-footer">
                Una pregunta, muchas decisiones.
              </span>
            </div>
            <div
              className="wb-paper wb-wireframe"
              style={{
                opacity: structure * (1 - product * 0.65),
                transform: `translate(${36 - progress * 47}px, ${-15 + progress * 8}px) rotate(${7 - progress * 6}deg)`,
              }}
            >
              <span className="wb-paper-label">La estructura</span>
              <div className="wb-wire-title">Nueva cotización</div>
              <div className="wb-wire-field">
                Servicio <span>⌄</span>
              </div>
              <div className="wb-wire-options">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="wb-wire-field">
                Decoración <span>○</span>
              </div>
              <div className="wb-wire-total">
                Total <span>────</span>
              </div>
            </div>
            <div
              className="wb-code"
              style={{
                opacity: logic * (1 - product),
                transform: `translateY(${(1 - logic) * 18}px)`,
              }}
            >
              <span>La lógica</span>
              <code>
                <b>const</b> total =<br />
                &nbsp; base + largo * 30
                <br />
                &nbsp; + (arte ? 60 : 0);
                <br />
                <em>// Cada detalle cuenta.</em>
              </code>
            </div>
            <div
              className="wb-paper wb-product"
              style={{
                opacity: product,
                transform: `translate(${(1 - product) * 30}px, ${(1 - product) * -12}px) rotate(${(1 - product) * 6}deg) scale(${0.94 + product * 0.06})`,
              }}
            >
              <div className="wb-app-brand">
                <span>✳</span>cotiza nails<i>Ejemplo</i>
              </div>
              <h4>
                Su trabajo.
                <br />
                Su valor.
              </h4>
              <div className="wb-app-nails">
                <i />
                <i />
                <i />
              </div>
              <div className="wb-app-field">
                <span>Servicio</span>
                <b>Acrílico #3</b>
              </div>
              <div className="wb-app-field">
                <span>Decoración</span>
                <b>Incluida</b>
              </div>
              <div className="wb-app-total">
                <span>Total estimado</span>
                <strong>
                  $330<small> MXN</small>
                </strong>
                <ArrowUpRight size={20} />
              </div>
              <p>Vista ilustrativa · Datos de ejemplo</p>
            </div>
            <div className="wb-stage-tag">
              <span>{compare ? "Boceto original" : current.name}</span>
              <b>{String(visualPosition).padStart(2, "0")}%</b>
            </div>
          </div>
        </div>
        <div className="wb-controls">
          <div className="wb-playback">
            <button
              type="button"
              className="wb-play-button"
              onClick={togglePlayback}
              disabled={paused && !reduced}
            >
              {playing ? <Pause size={15} /> : <Play size={15} />}
              {reduced
                ? "Mostrar resultado"
                : playing
                  ? "Pausar recorrido"
                  : "Ver transformación"}
            </button>
            <button
              type="button"
              className="wb-compare-button"
              aria-pressed={compare}
              disabled={position < 25}
              onClick={() => {
                setPlaying(false);
                setCompare(!compare);
              }}
            >
              <ScanLine size={15} />
              {compare ? "Volver al resultado" : "Comparar con el boceto"}
            </button>
          </div>
          <div className="wb-control-title">
            <label htmlFor="build-progress">
              <MoveHorizontal size={17} />
              Deslice para construir
            </label>
            <button
              type="button"
              onClick={() => seek(0)}
              disabled={position === 0}
            >
              <RotateCcw size={13} />
              Reiniciar
            </button>
          </div>
          <input
            id="build-progress"
            type="range"
            min="0"
            max="100"
            step="1"
            value={position}
            aria-valuetext={`${current.name}, ${position}% del recorrido`}
            aria-describedby="build-help"
            onChange={(event) => seek(Number(event.target.value))}
            style={{ "--range-fill": `${position}%` }}
          />
          <div
            className="wb-stops"
            role="group"
            aria-label="Etapas del proyecto"
          >
            {phases.map((item, index) => (
              <button
                key={item.name}
                type="button"
                aria-pressed={phase === index}
                onClick={() => seek([0, 34, 60, 100][index])}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.name}
              </button>
            ))}
          </div>
          <p id="build-help">
            Arrastre el control, use las flechas del teclado o elija una etapa.
          </p>
        </div>
      </div>
    </section>
  );
}
