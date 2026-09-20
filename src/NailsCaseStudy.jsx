import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ArrowDown, RotateCcw } from "lucide-react";
import "./case-study.css";

const chapters = [
  {
    label: "Cotizar",
    file: "cotizar",
    title: "Cada detalle tiene un valor.",
    question: "¿Cómo convertir un diseño en una cotización clara?",
    decision:
      "Separar el servicio base, el largo y los adicionales. Así se puede revisar qué incluye el trabajo antes de compartir el total.",
    detail: "Acrílico y Gelish · Largos del 1 al 10 · Adicionales por cantidad",
  },
  {
    label: "Mis precios",
    file: "precios",
    title: "El precio lo decide quien crea.",
    question: "Dos estudios no trabajan con las mismas tarifas.",
    decision:
      "Dar a cada profesional el control de sus precios, con importes fijos o rangos para los detalles que dependen del diseño.",
    detail:
      "Tarifas editables · Rangos mínimo y máximo · Configuración por cuenta",
  },
  {
    label: "Finanzas",
    file: "finanzas",
    title: "Cotizar y cobrar son cosas distintas.",
    question: "Una cotización todavía no es un ingreso.",
    decision:
      "Separar las propuestas de los pagos registrados. El balance reúne cobros y gastos del mes para mostrar lo que realmente queda.",
    detail: "Ingresos y gastos · Balance mensual · Categorías de gasto",
  },
];

export default function NailsCaseStudy({ paused, onInquiry, note }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const instant = paused || reduced;
  return (
    <section
      id="caso-cotiza-nails"
      className="nails-case"
      aria-labelledby="case-title"
    >
      <div className="wrap">
        <div className="case-masthead">
          <span>CASO DE ESTUDIO / 001</span>
          <span>PRODUCTO EN DESARROLLO ↗</span>
        </div>
        <div className="case-lead">
          <div>
            <p className="case-eyebrow">Cotiza Nails</p>
            <h2 id="case-title">
              Detrás de
              <br />
              cada <em>detalle.</em>
            </h2>
          </div>
          <div className="case-brief">
            <p>
              Una herramienta para ponerle precio al trabajo creativo de una
              manicurista y organizar su negocio desde el móvil.
            </p>
            <a href="#case-story">
              Explora las decisiones <ArrowDown size={17} />
            </a>
          </div>
        </div>
        <dl className="case-facts">
          <div>
            <dt>El reto</dt>
            <dd>Reunir cotización, tarifas y finanzas.</dd>
          </div>
          <div>
            <dt>La construcción</dt>
            <dd>React Native · TypeScript</dd>
          </div>
          <div>
            <dt>El resultado actual</dt>
            <dd>Versión de prueba, aún en desarrollo.</dd>
          </div>
        </dl>
        <div id="case-story" className="case-story">
          <div className="case-stage">
            <div className="case-stage-top">
              <span>LA INTERFAZ REAL</span>
              <span>0{active + 1} / 03</span>
            </div>
            <div className="case-phone-wrap">
              <span className="case-orbit" aria-hidden="true">
                ✳
              </span>
              <div className="case-phone">
                <AnimatePresence initial={false} mode="wait">
                  <motion.img
                    key={active}
                    src={`${import.meta.env.BASE_URL}cotiza-nails/${chapters[active].file}.png`}
                    alt={`Cotiza Nails: pantalla de ${chapters[active].label}, versión web en modo demo`}
                    width="390"
                    height="844"
                    initial={{ opacity: instant ? 1 : 0, y: instant ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: instant ? 1 : 0 }}
                    transition={{ duration: instant ? 0 : 0.24 }}
                  />
                </AnimatePresence>
              </div>
            </div>
            <div
              className="case-screen-controls"
              aria-label="Elegir captura de Cotiza Nails"
            >
              {chapters.map((chapter, index) => (
                <button
                  type="button"
                  key={chapter.file}
                  aria-pressed={active === index}
                  onClick={() => setActive(index)}
                >
                  {chapter.label}
                </button>
              ))}
            </div>
            <p className="case-capture-note">
              Capturas reales de la versión web en modo demo. Sin datos de
              clientes.
            </p>
          </div>
          <div className="case-chapters">
            {chapters.map((chapter, index) => (
              <motion.article
                key={chapter.file}
                className={`case-chapter ${active === index ? "is-active" : ""}`}
                onViewportEnter={() => {
                  if (window.matchMedia("(min-width: 801px)").matches)
                    setActive(index);
                }}
                viewport={{ amount: 0.65 }}
              >
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Mostrar captura: ${chapter.label}`}
                  className="case-chapter-number"
                >
                  0{index + 1}
                  <ArrowUpRight size={18} />
                </button>
                <h3>{chapter.title}</h3>
                <p className="case-question">{chapter.question}</p>
                <p>{chapter.decision}</p>
                <span className="case-chapter-detail">{chapter.detail}</span>
              </motion.article>
            ))}
          </div>
        </div>
        <div className="case-closing">
          <div>
            <span className="case-eyebrow">Lo que sigue</span>
            <h3>Un producto que sigue creciendo.</h3>
            <p>{note}</p>
          </div>
          <a className="case-inquiry" href="#contacto" onClick={onInquiry}>
            Quiero una app para mi negocio <ArrowUpRight size={22} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function ProfileCard({ paused }) {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();
  return (
    <div className="profile-deck">
      <div className="profile-shadow" aria-hidden="true" />
      <motion.div
        className="profile-card"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          duration: paused || reduced ? 0 : 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="profile-face profile-front" aria-hidden={flipped}>
          <span className="profile-corner">
            B<span>♣</span>
          </span>
          <span className="profile-edition">DISEÑO + CÓDIGO</span>
          <span className="profile-symbol" aria-hidden="true">
            ♣
          </span>
          <h3>
            La creatividad
            <br />
            tiene método.
          </h3>
          <p>
            Brandon Lozada
            <br />
            Desarrollo digital · México
          </p>
          <span className="profile-corner bottom">
            B<span>♣</span>
          </span>
        </div>
        <div className="profile-face profile-back" aria-hidden={!flipped}>
          <span className="profile-edition">EL OTRO LADO DE LA CARTA</span>
          <h3>
            De la idea
            <br />a la interfaz.
          </h3>
          <dl>
            <div>
              <dt>01 / Entender</dt>
              <dd>Definir qué necesita resolver el proyecto.</dd>
            </div>
            <div>
              <dt>02 / Construir</dt>
              <dd>Diseñar y desarrollar una versión que se pueda probar.</dd>
            </div>
            <div>
              <dt>03 / Afinar</dt>
              <dd>Revisar la experiencia y documentar la solución.</dd>
            </div>
          </dl>
          <span className="profile-tools">React / Python / TypeScript</span>
        </div>
      </motion.div>
      <button
        type="button"
        className="profile-flip"
        aria-pressed={flipped}
        onClick={() => setFlipped(!flipped)}
      >
        <RotateCcw size={17} />
        {flipped ? "Volver a mi carta" : "Conoce mi forma de trabajar"}
      </button>
    </div>
  );
}
