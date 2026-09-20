import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Braces,
  Layers3,
  Menu,
  MessageCircle,
  Monitor,
  Plus,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import initialContent from "./content.json";
import NailPreview from "./NailPreview";
import WildTable from "./WildTable";
import ProjectWorkbench from "./ProjectWorkbench";
import NailsCaseStudy, { ProfileCard } from "./NailsCaseStudy";
import { Reveal, Tilt } from "./Animations";

const services = [
  {
    icon: Monitor,
    name: "Desarrollo web",
    detail:
      "Portafolios y páginas para negocios con una identidad propia, adaptados a cada pantalla.",
    tags: "Diseño web / Landing pages",
  },
  {
    icon: Smartphone,
    name: "Aplicaciones a medida",
    detail:
      "Aplicaciones pensadas alrededor de una necesidad real. Desde el primer flujo hasta una versión que puedas probar.",
    tags: "Aplicaciones / Interfaces",
  },
  {
    icon: Layers3,
    name: "Integraciones y automatización",
    detail:
      "Herramientas para organizar información, conectar procesos y simplificar el trabajo de todos los días.",
    tags: "APIs / Automatización",
  },
];

export default function App() {
  const [content, setContent] = useState(initialContent);
  const [menu, setMenu] = useState(false);
  const [message, setMessage] = useState("");
  const [motionPaused, setMotionPaused] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  function toggleService(name) {
    setSelectedServices((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }
  const inquiry = [
    selectedServices.length
      ? `Me interesan estos servicios: ${selectedServices.join(", ")}.`
      : "",
    message,
  ]
    .filter(Boolean)
    .join("\n\n");
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // El JSON local permite abrir el portafolio aunque Python esté apagado.
  useEffect(() => {
    if (import.meta.env.VITE_STATIC_SITE === "true") return;
    const controller = new AbortController();
    fetch("/api/portfolio", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("API no disponible");
        return response.json();
      })
      .then((data) => {
        if (
          typeof data.name === "string" &&
          typeof data.whatsapp === "string" &&
          typeof data.project?.name === "string" &&
          Array.isArray(data.project?.stack) &&
          Array.isArray(data.project?.features)
        )
          setContent(data);
      })
      .catch(() => {
        /* Se conserva el contenido local en modo estático. */
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const whatsapp = `https://wa.me/${content.whatsapp}?text=${encodeURIComponent("Hola Brandon, me gustaría platicar sobre un proyecto.")}`;

  return (
    <div className={motionPaused ? "portfolio motion-paused" : "portfolio"}>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <motion.div
        className="reading-progress"
        style={{ scaleX: reduced ? scrollYProgress : progress }}
      />
      <header className="header wrap">
        <a
          href="#inicio"
          className="brand"
          aria-label={`${content.name}, inicio`}
        >
          <span className="brand-initials">BL</span>
          <span className="brand-name">
            Brandon Lozada<small>Desarrollo digital</small>
          </span>
        </a>
        <nav
          className={menu ? "navigation open" : "navigation"}
          id="navigation"
          aria-label="Navegación principal"
        >
          <a href="#proyectos" onClick={() => setMenu(false)}>
            Proyectos
          </a>
          <a href="#sobre-mi" onClick={() => setMenu(false)}>
            Sobre mí
          </a>
          <a href="#servicios" onClick={() => setMenu(false)}>
            Servicios
          </a>
        </nav>
        <a href="#contacto" className="nav-contact">
          Contacto <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-button"
          aria-label={menu ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menu}
          aria-controls="navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main id="contenido">
        <WildTable paused={motionPaused} />
        <div className="tech-strip">
          <div className="wrap tech-inner">
            <span>Tecnologías de trabajo</span>
            <b>
              <Braces size={19} />
              React
            </b>
            <b>Python</b>
            <b>TypeScript</b>
            <b>Expo</b>
            <b>Firebase</b>
            <span className="strip-star">✳</span>
          </div>
        </div>
        <section id="proyectos" className="projects wrap section">
          <Reveal className="section-heading">
            <div>
              <p className="section-kicker">Portafolio de desarrollo</p>
              <h2>
                El trabajo
                <br />
                habla.
              </h2>
            </div>
            <span className="section-aside">De la necesidad a la solución</span>
          </Reveal>
          <Reveal>
            <Tilt className="project-card" paused={motionPaused}>
              <div className="project-visual">
                <div className="project-wordmark">
                  cotiza
                  <br />
                  <span>nails</span>
                  <Sparkles size={32} />
                </div>
                <div className="project-phone">
                  <NailPreview />
                </div>
                <span className="visual-caption">
                  Una herramienta para quienes crean con sus manos.
                </span>
              </div>
              <div className="project-copy">
                <span className="project-status">
                  <span />
                  {content.project.status}
                </span>
                <h3>{content.project.name}</h3>
                <p>{content.project.description}</p>
                <div className="tags">
                  {content.project.stack.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <a className="case-button" href="#caso-cotiza-nails">
                  Explorar el caso de estudio <ArrowUpRight size={22} />
                </a>
              </div>
            </Tilt>
          </Reveal>
        </section>
        <NailsCaseStudy
          paused={motionPaused}
          note={content.project.note}
          onInquiry={() => {
            setSelectedServices((current) =>
              current.includes("Aplicaciones a medida")
                ? current
                : [...current, "Aplicaciones a medida"],
            );
            setMessage(
              (current) =>
                current ||
                "Me interesa desarrollar una aplicación para mi negocio. Me gustaría conversar sobre las funcionalidades y el alcance.",
            );
          }}
        />
        <section id="sobre-mi" className="about wrap section">
          <Reveal>
            <ProfileCard paused={motionPaused} />
          </Reveal>
          <Reveal className="about-copy" delay={0.12}>
            <p className="section-kicker">Perfil profesional</p>
            <h2>
              Brandon Lozada.
              <br />
              Diseño y desarrollo digital.
            </h2>
            <p>
              Desarrollo sitios web y aplicaciones con un enfoque en
              funcionalidad, claridad y experiencia de usuario. Parto de los
              objetivos del proyecto para definir una solución que pueda
              implementarse y evolucionar.
            </p>
            <p>
              Cotiza Nails reúne este enfoque en una aplicación para
              profesionales de la manicura: cotización de servicios,
              organización de tarifas y seguimiento financiero.
            </p>
            <div className="location">
              <span />
              {content.location}
              <span className="location-divider">/</span>Trabajo remoto
            </div>
          </Reveal>
        </section>
        <section id="servicios" className="services wrap section">
          <Reveal className="section-heading">
            <div>
              <p className="section-kicker">Servicios profesionales</p>
              <h2>
                Diferentes cartas.
                <br />
                La misma atención al detalle.
              </h2>
            </div>
            <a className="text-link" href="#contacto">
              Consultar disponibilidad <ArrowUpRight size={16} />
            </a>
          </Reveal>
          <div className="service-grid">
            {services.map(({ icon: Icon, name, detail, tags }, index) => (
              <Reveal key={name} delay={index * 0.12}>
                <article
                  className={
                    selectedServices.includes(name)
                      ? "service service-selected"
                      : "service"
                  }
                >
                  <span className="service-suit" aria-hidden="true">
                    {["♠", "♣", "♦"][index]}
                  </span>
                  <Icon size={27} strokeWidth={1.4} />
                  <h3>{name}</h3>
                  <p>{detail}</p>
                  <span>{tags}</span>
                  <button
                    className="select-service"
                    aria-pressed={selectedServices.includes(name)}
                    onClick={() => toggleService(name)}
                  >
                    {selectedServices.includes(name)
                      ? "Seleccionado"
                      : "Seleccionar"}
                    <Plus size={17} />
                    <span className="sr-only"> {name}</span>
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="selection-summary">
            <div>
              <span className="selection-label">
                Su siguiente proyecto empieza aquí
              </span>
              <p role="status">
                {selectedServices.length
                  ? selectedServices.join(" + ")
                  : "Seleccione una o varias cartas para preparar su consulta."}
              </p>
            </div>
            <a className="button light" href="#contacto">
              {selectedServices.length
                ? "Preparar mi consulta"
                : "Consultar un proyecto"}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
        <ProjectWorkbench paused={motionPaused} />
        <section id="contacto" className="contact wrap">
          <Reveal className="contact-intro">
            <p className="section-kicker">Contacto profesional</p>
            <h2>
              Su próxima
              <br />
              gran jugada.
            </h2>
            <a href={`mailto:${content.email}`} className="email-link">
              {content.email}
              <ArrowUpRight size={20} />
            </a>
          </Reveal>
          <Reveal delay={0.15}>
            <form
              className="contact-form"
              action={`https://wa.me/${content.whatsapp}`}
              method="get"
              target="_blank"
              rel="noopener noreferrer"
            >
              <fieldset className="contact-options">
                <legend>1. ¿Qué te gustaría crear?</legend>
                <div>
                  {services.map(({ name }, index) => (
                    <button
                      type="button"
                      key={name}
                      aria-pressed={selectedServices.includes(name)}
                      onClick={() => toggleService(name)}
                    >
                      {
                        [
                          "Una página web",
                          "Una aplicación",
                          "Una automatización",
                        ][index]
                      }
                    </button>
                  ))}
                </div>
              </fieldset>
              <input type="hidden" name="text" value={inquiry} />
              <label htmlFor="idea">2. Cuéntame tu idea</label>
              <textarea
                id="idea"
                placeholder="Objetivos, funcionalidades y plazo estimado…"
                value={message}
                maxLength={1800}
                onChange={(event) => setMessage(event.target.value)}
                required
              />
              <details className="inquiry-preview">
                <summary>Revisar mi consulta</summary>
                <p>
                  {inquiry ||
                    "Elige un servicio y escribe tu idea para preparar el mensaje."}
                </p>
              </details>
              <button className="button light" type="submit">
                Continuar en WhatsApp <MessageCircle size={18} />
              </button>
              <p>
                Se abrirá WhatsApp con tu mensaje para que puedas revisarlo y
                enviarlo.
              </p>
            </form>
          </Reveal>
        </section>
      </main>
      <footer className="footer wrap">
        <a href="#inicio" className="footer-name">
          {content.name}
          <span>Diseño & desarrollo</span>
        </a>
        <p>Desarrollo web y aplicaciones · México</p>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer">
          Contacto <ArrowUpRight size={16} />
        </a>
        <button
          className="motion-toggle"
          aria-pressed={motionPaused}
          onClick={() => setMotionPaused(!motionPaused)}
        >
          {motionPaused ? "Reanudar efectos" : "Pausar efectos"}
        </button>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
