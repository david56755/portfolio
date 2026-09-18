import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Calculator,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

// Demostración independiente: los importes son ejemplos, no tarifas reales.
export default function NailPreview() {
  const [tab, setTab] = useState("Cotizar");
  const [length, setLength] = useState(3);
  const [art, setArt] = useState(true);
  const total = 180 + length * 30 + (art ? 60 : 0);
  return (
    <div className="phone">
      <div className="phone-top">
        <span>9:41</span>
        <div className="island" />
        <span>••• ▰</span>
      </div>
      <div className="phone-body">
        <div className="app-brand">
          <span className="app-symbol">
            <Sparkles size={17} />
          </span>
          cotiza nails<span className="avatar">B</span>
        </div>
        <div className="app-tabs" aria-label="Vistas de la demostración">
          {["Cotizar", "Finanzas"].map((label) => (
            <button
              key={label}
              aria-pressed={tab === label}
              onClick={() => setTab(label)}
              className={tab === label ? "selected" : ""}
            >
              {label === "Cotizar" ? (
                <Calculator size={13} />
              ) : (
                <ChartNoAxesColumnIncreasing size={13} />
              )}
              {label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {tab === "Cotizar" ? (
              <>
                <p className="phone-eyebrow">Tu talento tiene valor</p>
                <h3>
                  Cada detalle
                  <br />
                  cuenta.
                </h3>
                <div className="nail-art" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <Sparkles className="nail-spark" />
                </div>
                <div className="app-field">
                  <span>Servicio</span>
                  <strong>
                    Uñas acrílicas <Check size={13} />
                  </strong>
                </div>
                <div className="length-label">
                  <span>Largo de uñas</span>
                  <b>#{length}</b>
                </div>
                <div className="lengths" aria-label="Largo de uñas">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      className={length === n ? "selected" : ""}
                      onClick={() => setLength(n)}
                      aria-pressed={length === n}
                    >
                      #{n}
                    </button>
                  ))}
                </div>
                <label className="art-toggle">
                  <span>Arte y decoración</span>
                  <input
                    type="checkbox"
                    checked={art}
                    onChange={(e) => setArt(e.target.checked)}
                  />
                  <span className="switch" aria-hidden="true" />
                </label>
                <div className="quote-total">
                  <span>
                    Total estimado
                    <strong aria-live="polite">
                      ${total}
                      <small> MXN</small>
                    </strong>
                  </span>
                  <ArrowUpRight size={22} />
                </div>
              </>
            ) : (
              <>
                <p className="phone-eyebrow">Una mirada a tu negocio</p>
                <h3>
                  Tu trabajo.
                  <br />
                  Tus ganancias.
                </h3>
                <div className="balance">
                  <span>Balance del mes</span>
                  <strong>$8,450</strong>
                  <small>Ingresos menos gastos</small>
                </div>
                <div
                  className="chart"
                  aria-label="Ejemplo de ingresos semanales"
                >
                  <div style={{ "--height": "44%" }} />
                  <div style={{ "--height": "70%" }} />
                  <div style={{ "--height": "57%" }} />
                  <div style={{ "--height": "92%" }} />
                </div>
                <div className="chart-labels">
                  <span>Sem 1</span>
                  <span>Sem 2</span>
                  <span>Sem 3</span>
                  <span>Sem 4</span>
                </div>
                <div className="money-row">
                  <span>Ingresos</span>
                  <strong>$12,500</strong>
                </div>
                <div className="money-row">
                  <span>Gastos</span>
                  <strong>− $4,050</strong>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
        <p className="demo-note">Demo ilustrativa · Datos de ejemplo</p>
      </div>
      <div className="phone-bottom">
        <ChevronLeft size={13} />
        <span />
        <span>○</span>
      </div>
    </div>
  );
}
