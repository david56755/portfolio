# Versión actual: portada de cartas y mesa de trabajo

## Publicación en GitHub Pages

`vite.config.js` utiliza `base: "./"` para que JavaScript, CSS y favicon se resuelvan bajo la ruta del repositorio. `.env.pages` solo contiene `VITE_STATIC_SITE=true`; no contiene secretos. El comando `build:pages` selecciona ese modo y `App.jsx` omite la petición a `/api/portfolio`, conservando el JSON importado. React y todas las interacciones siguen funcionando sin un servidor Python.

`public/.nojekyll` se copia al resultado de Vite. `scripts/deploy-pages.mjs` ejecuta la compilación, crea un directorio temporal, recupera `gh-pages` si existe, sustituye los archivos públicos y crea un commit. El push normal conserva el historial y rechaza actualizaciones en conflicto. Finalmente elimina únicamente su propio directorio temporal. Nunca copia `.venv`, el backend ni credenciales al sitio servido. El código completo se conserva en `main`; el README explica cómo subirlo y publicar de nuevo.

La portada abre con “IDEAS CON / CARÁCTER.” sobre un fondo violeta profundo. Tres cartas presentan un proyecto, el proceso y la conversación con un posible cliente. La paleta, los símbolos de la baraja y los giros mantienen la referencia a Joker; los textos explican el trabajo de diseño y desarrollo. La portada se construye con React, Motion y CSS.

## WildTable.jsx: contenido que también permite navegar

`src/App.jsx` monta `<WildTable paused={motionPaused} />` como portada, en lugar de la composición anterior. `src/WildTable.jsx` importa `src/wild-table.css` y contiene tanto la mesa como el componente interno `TableCard`, que reutiliza la misma estructura para las tres cartas.

El arreglo `cards` guarda sus datos: título, símbolo, texto del reverso, estado del proyecto y enlace. `cards.map(...)` produce una carta por objeto. Su `type` identifica cada una con una clave estable y añade una clase visual: proyecto en rosa, proceso en violeta y conversación en verde claro. Los enlaces llevan a `#proyectos`, `#como-trabajo` y `#contacto`; no abren servicios externos.

`selected` guarda el índice de la carta activa. Elegir uno de los tres botones, enfocar un control de una carta o empezar a moverla cambia esa selección. La carta activa usa un `z-index` mayor para quedar al frente, sin cambiar su altura. `aria-pressed` comunica qué botón está seleccionado y permite acceder a cada carta aunque las otras la cubran parcialmente. `cardLinks = useRef([])` conserva referencias a los enlaces; al elegir una carta, `focus({ preventScroll: true })` lleva el foco a su enlace sin desplazar la página.

Cada `TableCard` tiene su propio estado `flipped`. El botón de giro invierte ese booleano y Motion lleva `rotateY` de 0 a 180 grados. En CSS, `perspective` da profundidad, `transform-style: preserve-3d` mantiene las dos caras en el espacio y `backface-visibility: hidden` oculta su dorso. `aria-hidden` retira del lector de pantalla el texto de la cara que no se muestra. El pie de la carta conserva el enlace y el botón de giro fuera de las caras, de modo que ambos siguen disponibles.

`spread` decide si la baraja está repartida o recogida. `deal` cuenta las recomposiciones; `deal % 3` selecciona uno de tres juegos de ángulos. No es una elección al azar. `arrange()` actualiza la disposición y solicita que las cartas vuelvan a sus posiciones de base. “Recomponer” reparte las cartas y cambia sus ángulos; “Recoger cartas” y “Repartir cartas” alternan las dos disposiciones.

## Movimiento de las cartas y adaptación al tamaño

Cada carta separa dos movimientos. El contenedor `wt-placement` recibe `position` con la ubicación y el ángulo de la baraja. El `motion.article` interior añade el desplazamiento manual mediante `x` e `y`, creados con `useMotionValue(0)`. Estos valores permiten a Motion actualizar la transformación sin volver a renderizar React por cada píxel del arrastre. `x.get()` lee la posición actual y `x.set(...)` la cambia; `y` funciona igual para el eje vertical.

`useDragControls()` crea el controlador de arrastre. `dragListener={false}` evita que tocar cualquier parte de la carta la mueva: solo el asa llama a `controls.start(event)`. Así, girar una carta o pulsar su enlace sigue teniendo un objetivo claro. `dragConstraints` limita el recorrido a 48 píxeles hacia cada lado, 20 hacia arriba y 28 hacia abajo. `dragElastic={0.08}` permite una pequeña elasticidad en los límites y `dragMomentum={false}` evita que la carta siga desplazándose por inercia al soltarla.

El asa es un botón y también recibe `onKeyDown={moveWithKeyboard}`. Las flechas cambian la posición en pasos de ocho píxeles. `Math.max` y `Math.min` mantienen esos pasos dentro de los mismos límites del arrastre. Inicio (`Home`) pone ambos valores en cero. `preventDefault()` evita que esas teclas desplacen la página mientras se mueve una carta. `aria-describedby="wt-move-help"` relaciona el asa con una explicación para lectores de pantalla.

`stage = useRef(null)` apunta a la mesa. Un `useEffect` conecta un `ResizeObserver` a ese elemento y lee su ancho cuando cambia. Calcula `spacing` a partir del ancho disponible y del ancho real de una carta, con un mínimo de 24 píxeles y un máximo equivalente a 1.06 veces el ancho de la carta. Al repartir, `(index - 1) * spacing` coloca la primera a la izquierda, la segunda al centro y la tercera a la derecha. CSS reduce también los tamaños de carta según la pantalla.

`resetKey` es un contador que cambia al recoger, repartir, recomponer o redimensionar la mesa. Aunque su nombre contiene “key”, no se usa como clave de un elemento del DOM. Cada carta lo observa con este efecto:

```jsx
useEffect(() => {
  x.set(0);
  y.set(0);
}, [resetKey, x, y]);
```

Así vuelve a su posición de base sin desmontar y crear de nuevo la carta: conserva `flipped`, sus controles y sus referencias. La limpieza del efecto que observa el tamaño llama a `observer.disconnect()` cuando se desmonta la portada.

`quiet = reduced || paused` reúne la preferencia del sistema, leída con `useReducedMotion()`, y la pausa global recibida de `App.jsx`. Cuando es verdadero, los cambios de posición y giro usan duración cero y el asa se desactiva. Se pueden seguir eligiendo cartas, mostrar su reverso de forma inmediata, recoger o repartir y navegar por sus enlaces. La regla CSS `prefers-reduced-motion` elimina también las transiciones de este apartado.

## wild-table.css: composición de la portada

Las clases `wt-` agrupan los estilos del apartado. `.wt-intro` compone el titular, la presentación y las notas laterales; `.wt-stage` contiene la baraja; `.wt-placement` coloca cada carta; `.wt-card` construye su contenido. Esta separación permite combinar la posición de la baraja con el desplazamiento individual de una carta.

`--wt-paper` y `--wt-ink` definen fondo y texto. Barlow Condensed aporta el titular grande, Space Grotesk identifica Cotiza Nails y los detalles en serif aportan el aspecto de una pieza impresa. Los puntos de adaptación de CSS reducen los tamaños y reorganizan controles y notas en pantallas pequeñas. El contorno de `:focus-visible` identifica el control utilizado con teclado.

## Mesa de trabajo interactiva

Quitamos la cinta verde de texto en movimiento y la cuadrícula de cuatro pasos. Su lugar en el recorrido lo ocupa una mesa de trabajo: puedes pasar de una pregunta escrita en papel a una estructura de pantalla, observar una regla de cálculo y revelar una interfaz ilustrativa de Cotiza Nails. La estética conserva los tonos violeta, verde y papel del portafolio.

Como referencia se consultó el [índice de sitios experimentales de Awwwards](https://www.awwwards.com/websites/experimental/?page=60). La composición y las interacciones se implementaron para este portafolio; no se afirma que sean algo nunca realizado antes.

## ProjectWorkbench.jsx: archivos y funcionamiento

- `src/App.jsx` importa y coloca `<ProjectWorkbench paused={motionPaused} />` entre servicios y contacto. La propiedad `paused` conecta la reproducción de este apartado con el botón global “Pausar efectos”. Se retiraron el marcado de la cinta y el bloque anterior de metodología, junto con sus reglas específicas en los estilos existentes.
- `src/ProjectWorkbench.jsx` contiene los textos, el estado y las capas de la mesa. `src/workbench.css`, importado por ese componente, define su composición, hojas superpuestas, colores, controles y adaptación a pantallas pequeñas. Sus clases `wb-` mantienen los estilos del apartado separados de las otras secciones.
- `position` es un estado numérico de 0 a 100. `setPosition` lo actualiza. `visualPosition = compare ? 0 : position` muestra el boceto durante la comparación; `progress = visualPosition / 100` convierte ese valor a una proporción para mover las hojas. Es un porcentaje de la demostración visual, no el avance real del proyecto.
- `phases` contiene cuatro objetos: pregunta, estructura, lógica y producto. `Math.floor(position / 25)` elige la etapa; `Math.min(3, ...)` mantiene el último índice válido al llegar a 100. Los valores `structure`, `logic` y `product` se limitan entre 0 y 1 para controlar la opacidad y transformación de las capas.
- El `input type="range"` nativo permite arrastrar, tocar y usar las flechas del teclado. Su `label` lo identifica y `aria-valuetext` expresa la etapa y el porcentaje. Los cuatro botones saltan a posiciones representativas `[0, 34, 60, 100]`; `aria-pressed` indica la etapa activa. Reiniciar vuelve a 0 y está desactivado cuando ya estás al principio. Todos pasan por `seek(value)`: detiene la reproducción, cierra la comparación y guarda la nueva posición.
- `.wb-copy` coloca los cuatro bloques de explicación en una misma celda de CSS Grid. Todos reservan espacio, así la altura depende del texto más largo y el control no cambia de lugar al elegir otra etapa. Solo el bloque activo es visible; los demás usan `visibility: hidden` y `aria-hidden`. Motion anima la entrada del texto, respetando `useReducedMotion`.

Las hojas y la pantalla de Cotiza Nails son elementos HTML/CSS ilustrativos. Mover el control no programa, compila ni publica una aplicación. Tampoco cambia la demo interactiva del proyecto, que sigue en `NailPreview.jsx`, ni consulta datos reales. El enlace “Explorar el proyecto” lleva a esa sección. Las capas decorativas usan `aria-hidden` porque la explicación y los controles ya describen el recorrido.

## Reproducción, pausa y comparación, paso a paso

`playing` recuerda si el recorrido está avanzando. `togglePlayback()` lo detiene si ya está activo. Al iniciarlo guarda la posición en `startPosition.current`; si estaba en 100, comienza desde 0. `useRef(0)` conserva ese punto de partida entre renderizados sin provocar una actualización por sí mismo. Así, pausar y volver a pulsar “Ver transformación” continúa desde la posición actual.

`useEffect` inicia el movimiento cuando `playing` cambia a `true`. Guarda la hora inicial con `performance.now()` y pide al navegador un fotograma con `requestAnimationFrame(tick)`. Dentro de `tick`, la posición se calcula así:

```js
const next = Math.min(100, startPosition.current + (now - started) / 80);
setPosition(Math.round(next));
```

`now - started` es el tiempo transcurrido en milisegundos. Dividir entre 80 avanza un punto cada 80 ms: de 0 a 100 son 8,000 ms, es decir, ocho segundos. Si empieza a mitad, solo reproduce la parte restante. El cálculo depende del tiempo y no del número de fotogramas, por lo que no necesita asumir una frecuencia de pantalla. `Math.min` limita el final a 100 y `Math.round` conserva porcentajes enteros. Mientras queda recorrido se solicita otro fotograma; al terminar, `playing` vuelve a `false`.

El efecto depende de `[playing, paused, reduced]`. Si se activa la pausa global o la preferencia de movimiento reducido, detiene la reproducción. También escucha `visibilitychange` y para cuando la pestaña se oculta. La función de limpieza cancela el fotograma pendiente con `cancelAnimationFrame` y quita el listener: evita dejar tareas activas al pausar, cambiar esas dependencias o desmontar el componente. Reanudar los efectos globales no vuelve a reproducir el recorrido por sí solo.

`compare` guarda si se está mostrando el boceto. “Comparar con el boceto” pausa el recorrido y cambia ese estado; está disponible a partir de la posición 25. Conserva `position`, la explicación y la selección de etapa, pero lleva `visualPosition` a 0. Por eso “Volver al resultado” recupera exactamente las capas del punto elegido. `aria-pressed` comunica si la comparación está activa. La comparación no cambia los importes ni el estado de la demo del teléfono.

`useReducedMotion()` lee la preferencia del sistema. En ese caso el botón pasa a “Mostrar resultado” y usa `seek(100)` para llegar al final directamente. Los cambios de texto de Motion tienen duración cero y CSS elimina la transición de las hojas. Los controles manuales siguen disponibles. Con pausa global, “Ver transformación” queda desactivado; “Mostrar resultado” sigue permitido porque no inicia una reproducción.

En `workbench.css`, las transiciones de `transform` y `opacity` suavizan el cambio de las capas. La clase `is-playing` ilumina el indicador de la mesa mientras el recorrido avanza. En pantallas pequeñas, los botones de reproducción y comparación se apilan y mantienen una altura mínima de 44 píxeles.

## Evolución visual y código histórico

La web evolucionó desde la primera versión hacia una dirección inspirada en Joker, con cartas dibujadas en HTML/CSS. No se generó una ilustración del personaje: el generador la rechazó. Pinterest permitió localizar referencias indexadas, pero no se usó una maqueta de Figma ni se copiaron imágenes externas. La composición actual se desarrolló en código.

## Archivos nuevos y orden de estilos

`main.jsx` carga los estilos generales en este orden: `styles.css` (base y demo), `professional.css` (estructura profesional), `joker.css` (paleta y estilos heredados), `editorial.css` (composición, tipografía y secciones) e `interactive.css` (controles y selección). Las reglas posteriores refinan las anteriores. Además, `WildTable.jsx` importa `wild-table.css` y `ProjectWorkbench.jsx` importa `workbench.css`: empieza por esos archivos para cambiar sus respectivos apartados. Barlow Condensed, cargada en `index.html`, aporta los titulares de cartel.

- `Animations.jsx`: `Reveal` muestra contenido al entrar en pantalla mediante `whileInView`, una sola vez; `Tilt` convierte la posición del puntero en inclinación mediante valores de Motion y resortes. `HeroTitle` pertenece a la portada anterior y ya no se monta; `ScrollArtwork` también queda como utilidad sin montar.
- `JokerScene.jsx`: componente histórico de la baraja anterior; ya no se importa ni se monta en `App.jsx`. Sus estados de giro y reparto explican una versión previa, pero para modificar las cartas actuales debes editar `WildTable.jsx`.
- `App.jsx`: `selectedServices` es un arreglo. `toggleService` añade un nombre si no existe o lo elimina con `filter` si ya estaba seleccionado. Las tarjetas usan `aria-pressed`; el resumen anuncia cambios con `role="status"`. Las selecciones también aparecen como botones eliminables en el contacto.
- `inquiry` combina los servicios seleccionados y el texto escrito. El campo oculto `name="text"` contiene esa consulta, que el navegador prepara al abrir WhatsApp. El área de texto conserva su propio estado: quitar servicios no borra lo escrito. No hay envío automático ni almacenamiento de consultas.
- `motionPaused` añade la clase `motion-paused` y se pasa como `paused` a `WildTable` y `ProjectWorkbench`. La portada cambia sus estados sin transiciones y la mesa de trabajo detiene su reproducción. Las respuestas a clics y las entradas de otras secciones siguen funcionando. La preferencia del sistema `prefers-reduced-motion` también se respeta mediante CSS y Motion. La cinta de texto pertenecía al diseño anterior y fue retirada.

## Cambios respecto a la explicación de la primera versión

La demo de Cotiza Nails ahora se encuentra dentro de la presentación del proyecto. Sus cálculos siguen siendo de ejemplo. Los detalles del proyecto se montan y desmontan con `AnimatePresence` y animación de altura, en lugar de usar `hidden`. El formulario conserva un `textarea` requerido y un campo oculto con la consulta completa. Se añadió selección de servicios; la metodología pasó de una cuadrícula a la mesa de trabajo explicada arriba. Las capturas `desktop.png`, `mobile-*.png` y `phone-mobile.png` de `docs/` documentan la primera versión.

## Cómo ajustar las animaciones

En `Animations.jsx`, `duration` controla la duración y `delay` el retraso. `viewport.once` impide que la entrada se repita. En `WildTable.jsx`, `rotations` define los ángulos de las tres composiciones y `position` combina la separación, la altura y el giro de cada carta. Las transiciones con resorte usan `stiffness` para su rigidez y `damping` para amortiguar el movimiento. El botón fijo permite pausar los efectos sin perder los enlaces y la selección. La mesa de trabajo solo reproduce al pulsar “Ver transformación”; cambiar el divisor `80` de su cálculo cambia la velocidad: un valor mayor hace el recorrido más lento.

La explicación original de React, Python y la estructura base se conserva a continuación como material de aprendizaje; las diferencias vigentes están descritas arriba.

---

# Archivo de aprendizaje: la primera versión, paso a paso

## 1. Qué construimos y por qué

El objetivo es presentar tu trabajo y conseguir conversaciones con posibles clientes. La portada resume lo que haces; Cotiza Nails demuestra un proyecto concreto; la sección personal explica tu enfoque; servicios orienta al visitante; contacto abre WhatsApp.

Usamos una paleta azul tinta `#101b2c`, paneles `#172538`, texto claro `#f3f4f5`, azul suave `#addcf5`, rosa `#eec8d4` y texto secundario `#aab5c4`. Space Grotesk da personalidad a los títulos y Manrope hace legibles los párrafos. El teléfono es la pieza visual principal y también permite probar una interacción.

Las animaciones incluyen la entrada de la portada, la posición del teléfono al pasar el cursor, cambios entre cotización y finanzas, barras del gráfico, el icono al abrir detalles, una tarjeta que cambia de inclinación y una barra de progreso de lectura. Respetamos la preferencia del sistema de reducir movimiento.

## 2. Cómo se conectan las piezas

```text
Navegador → index.html → src/main.jsx → App.jsx
                                      ├─ NailPreview.jsx
                                      ├─ content.json (respaldo)
                                      └─ fetch /api/portfolio
                                              ↓
                                         Vite proxy
                                              ↓
                                     Python / FastAPI
                                              ↓
                                      src/content.json
```

React dibuja la interfaz y la actualiza cuando interactúas. Vite transforma JSX en JavaScript que el navegador entiende y actualiza la vista durante el desarrollo. Python responde a las peticiones de datos. En desarrollo son dos procesos; después de compilar, Python también puede entregar la página y sus archivos.

El backend tiene una responsabilidad pequeña y real: servir el contenido. No necesita una base de datos para esta primera versión. El formulario funciona directamente con WhatsApp y no pasa por Python.

## 3. Mapa de todos los archivos y carpetas

| Archivo o carpeta                            | Para qué existe                                                                                 |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `index.html`                                 | Documento inicial en español, título, descripción SEO, favicon, fuentes y el contenedor `root`. |
| `src/main.jsx`                               | Punto de entrada de React. Importa la aplicación y sus estilos.                                 |
| `src/App.jsx`                                | Secciones, navegación, apertura del proyecto, contacto y conexión con la API.                   |
| `src/NailPreview.jsx`                        | Demo interactiva independiente del teléfono.                                                    |
| `src/content.json`                           | Nombre, ubicación, contacto y contenido de Cotiza Nails; compartido con Python.                 |
| `src/styles.css`                             | Diseño, maquetas dibujadas con CSS, estados, tamaños de pantalla y accesibilidad de movimiento. |
| `public/favicon.svg`                         | Icono vectorial de la pestaña; Vite lo copia a la compilación.                                  |
| `vite.config.js`                             | Activa React y envía las peticiones `/api` al servidor Python.                                  |
| `package.json`                               | Lista de librerías y comandos disponibles.                                                      |
| `package-lock.json`                          | Versiones exactas de las dependencias JavaScript; se genera automáticamente.                    |
| `backend/main.py`                            | Servidor FastAPI, rutas de salud y contenido, y entrega de la web compilada.                    |
| `backend/requirements.txt`                   | Dependencias directas de Python.                                                                |
| `backend/requirements-lock.txt`              | Versiones exactas de las dependencias Python comprobadas en esta máquina.                       |
| `.gitignore`                                 | Evita subir dependencias, compilaciones y variables privadas al usar Git.                       |
| `README.md`                                  | Instrucciones para instalar, ejecutar y personalizar.                                           |
| `docs/GUIA-CODIGO.md`                        | Esta explicación.                                                                               |
| `docs/desktop.png`, `docs/mobile-*.png`      | Capturas de revisión de diseño, generadas durante las comprobaciones.                           |
| `legacy/`                                    | Copia completa de la web anterior, con HTML, CSS, JavaScript e imágenes.                        |
| `styles.css`, `script.js`, `img/` en la raíz | Originales conservados; no se importan en React.                                                |
| `.nojekyll`                                  | Archivo heredado para GitHub Pages; no interviene en el servidor actual.                        |
| `node_modules/`                              | Librerías instaladas por npm. No se edita ni se entrega como código propio.                     |
| `.venv/`                                     | Entorno aislado de Python y sus dependencias. No se edita manualmente.                          |
| `dist/`                                      | Resultado de `npm run build`. No lo edites: la siguiente compilación lo reemplaza.              |
| `backend/__pycache__/`                       | Caché que Python genera automáticamente.                                                        |

## 4. Entrada: index.html y main.jsx

`<div id="root"></div>` empieza vacío. `createRoot(document.getElementById('root'))` encuentra ese elemento y `.render(...)` coloca la aplicación en él.

`<App />` representa una función que devuelve interfaz. Se llama **componente**. Los nombres de componentes empiezan con mayúscula para distinguirlos de etiquetas HTML como `div`.

`React.StrictMode` ayuda a detectar efectos mal limpiados en desarrollo. Puede ejecutar un efecto más de una vez durante esa revisión. `MotionConfig reducedMotion="user"` configura la librería Motion para respetar la preferencia de movimiento del sistema. `import './styles.css'` incorpora los estilos al paquete.

## 5. App.jsx: página y comportamiento

### Imports y datos repetidos

`import` trae funciones, componentes o datos de otro archivo o librería. `lucide-react` aporta iconos SVG; puedes cambiar un icono sin descargar imágenes. `services` es un arreglo con tres objetos. Cada objeto guarda un icono, título, descripción y categorías.

`services.map(...)` recorre ese arreglo y produce una tarjeta por objeto. `key={name}` ayuda a React a identificar cada tarjeta cuando la lista cambia. El mismo mecanismo muestra etiquetas y funciones del proyecto. En la función de `map`, `icon: Icon` cambia el nombre de la propiedad a una variable con mayúscula para poder renderizar `<Icon />`.

### useState: recordar cambios

```jsx
const [menu, setMenu] = useState(false);
```

`menu` es el valor actual y `setMenu` lo cambia. Empieza en `false`. Al pulsar el botón, `setMenu(!menu)` invierte su valor y React actualiza la interfaz. `content` guarda los datos; `details` abre o cierra la explicación del proyecto; `message` guarda lo escrito en el formulario.

`className={menu ? 'navigation open' : 'navigation'}` usa un **operador ternario**: si el menú está abierto, aplica ambas clases. CSS decide cómo se ven. `aria-expanded` comunica ese estado a lectores de pantalla. Escape lo cierra; elegir un enlace también lo cierra.

### useEffect y fetch: pedir contenido a Python

`useEffect` ejecuta una tarea después de montar la interfaz. El arreglo vacío `[]` indica que no depende de cambios de estado. Dentro se pide `/api/portfolio` con `fetch`, se comprueba `response.ok`, se interpreta JSON y se valida una estructura básica antes de cambiar `content`.

`AbortController` permite cancelar esa solicitud. La función devuelta por el efecto hace la limpieza cuando el componente se desmonta. En el otro efecto, la limpieza elimina el listener de teclado.

Si Python no responde, se conserva el JSON importado. Así puedes usar la web estática. El fallo no se presenta como un envío exitoso: aquí solo estamos leyendo contenido público. `data.project?.name` usa encadenamiento opcional para evitar errores si falta `project`.

### Movimiento

`motion.div` es un `div` con capacidad de animación. `initial` define su aspecto inicial; `animate`, el final; `transition`, duración y aceleración. `y: 32` significa 32 píxeles de desplazamiento vertical. `opacity` va de 0 a 1. `whileHover` responde al cursor.

`useScroll` obtiene el avance de lectura entre 0 y 1. `useSpring` suaviza sus cambios. La barra fija usa `scaleX` y crece desde la izquierda gracias a `transform-origin: left`. `useReducedMotion` evita el desplazamiento de entrada y la interacción animada del teléfono si así lo pidió el usuario en su sistema.

### Secciones y enlaces

Cada sección tiene un `id`. `href="#proyectos"` navega a la sección con ese identificador. `<main>`, `<nav>`, `<header>`, `<section>` y `<footer>` describen la estructura semántica. El enlace “Saltar al contenido” sirve para navegación con teclado.

El caso de estudio usa `hidden={!details}`. Cuando está cerrado, sus elementos no quedan visibles ni accesibles por tabulación. El botón declara `aria-controls` para relacionarlo con ese contenido.

### Contacto

El `textarea` es un control asociado a un `label` por su `id`. `value={message}` y `onChange` sincronizan lo que escribes con React. `required` impide continuar vacío y `maxLength` limita el tamaño.

El formulario hace una navegación GET a `https://wa.me/NUMERO`, con el campo `text` como parámetro. El navegador codifica el mensaje. Se abre WhatsApp para que el visitante pueda revisarlo y enviarlo: no enviamos nada automáticamente ni guardamos mensajes en el servidor.

El enlace del pie crea su texto predeterminado con `encodeURIComponent`, que transforma espacios y caracteres especiales en un valor seguro para una URL. El correo usa `mailto:` y abre la aplicación de correo configurada.

## 6. NailPreview.jsx: la demo del teléfono

Tiene tres estados: `tab` elige Cotizar o Finanzas; `length` recuerda un largo del 1 al 5; `art` indica si añadiste decoración.

```js
const total = 180 + length * 30 + (art ? 60 : 0);
```

Es una fórmula **de demostración**, independiente del motor real de Cotiza Nails. Con largo 3 y decoración: 180 + 90 + 60 = 330 MXN. Al elegir largo 5: 390 MXN. Al quitar decoración: 330 MXN. El total se deriva del estado; no necesitamos guardar otra variable que pueda quedar desactualizada.

`aria-live="polite"` permite anunciar el nuevo precio a lectores de pantalla sin interrumpir bruscamente. Los botones tienen `aria-pressed` para indicar qué largo o vista está seleccionado. El interruptor conserva un `input type="checkbox"` real, aunque su aspecto se dibuje con CSS.

`AnimatePresence` conserva temporalmente una vista mientras reproduce su animación de salida. `key={tab}` distingue las dos vistas y `mode="wait"` espera que termine la salida antes de mostrar la nueva.

Finanzas muestra datos de ejemplo: 12,500 de ingresos menos 4,050 de gastos = 8,450 de balance. Las barras usan la variable CSS `--height`. No hay conexión a cuentas ni guardado. Las uñas son formas CSS decorativas, no capturas de la app real; `aria-hidden` evita que un lector de pantalla intente interpretarlas.

## 7. styles.css: cómo leer el diseño

El archivo está dividido por comentarios: tokens; portada y navegación; proyectos y servicios; contacto y adaptación. `:root` define variables reutilizables. Cambiar `--blue` cambia el acento en los selectores que lo usan. Algunos colores de la maqueta de uñas se especifican directamente para mantener su paleta separada.

`box-sizing: border-box` incluye padding y bordes en el ancho calculado. `.wrap` centra el contenido y limita su ancho. `display: grid` organiza columnas y `display: flex` alinea elementos dentro de una fila. `gap` añade separación sin márgenes individuales.

`clamp(mínimo, ideal, máximo)` permite escalar títulos con la ventana sin hacerlos demasiado pequeños o grandes. `vw` es una unidad relativa al ancho de pantalla. `border-radius` redondea esquinas, `box-shadow` crea profundidad y `transform: rotate(...)` inclina las maquetas.

Las reglas `@media` cambian el diseño para 1100, 800 y 520 píxeles. En móvil las columnas se apilan y aparece el botón de menú. La regla final `prefers-reduced-motion` desactiva animaciones CSS y desplazamiento suave. `:focus-visible` dibuja un contorno cuando usas teclado.

El gráfico usa `@keyframes bar-grow`: cambia `scaleY(0)` a `scaleY(1)` desde la base. No usa un bucle de JavaScript. Las ilustraciones y los iconos son CSS/SVG, de modo que no requieren imágenes pesadas.

## 8. Python: backend/main.py

`Path(__file__).resolve().parent.parent` localiza la raíz del proyecto a partir del archivo Python, sin depender del directorio desde el que lo ejecutes. `app = FastAPI(...)` crea el servidor lógico.

`@app.get('/api/health')` es un **decorador**: registra la función siguiente para atender peticiones GET a esa ruta. Devuelve un diccionario que FastAPI convierte automáticamente a JSON. `/api/portfolio` abre `src/content.json` con UTF-8 y lo interpreta mediante `json.loads`.

`StaticFiles` sirve `dist` cuando existe. Las rutas API se registran primero para evitar que el servidor de archivos las oculte. `html=True` permite devolver el `index.html` al visitar la raíz. No hay rutas dinámicas del lado del cliente en esta versión: las secciones usan anclas.

Uvicorn es el proceso que escucha en el puerto 8000 y entrega las solicitudes a FastAPI. `--reload` lo reinicia cuando cambias código durante el desarrollo. No se requiere CORS en este diseño: Vite hace de intermediario en desarrollo y Python sirve todo desde el mismo origen al compilar.

## 9. Configuración y librerías

React y React DOM construyen la interfaz. Motion anima estados y elementos. Lucide aporta iconos. Vite compila y sirve en desarrollo; su plugin React transforma JSX. FastAPI define rutas; Uvicorn ejecuta el servidor.

Prettier ordena sangrías y saltos de línea para que el código sea más fácil de leer. No añade comportamiento a la web. Puedes usar `npx prettier --write src` después de editar. `docs/phone-mobile.png` es una captura de detalle de la demo, utilizada en la revisión visual.

`package.json` usa `type: module` para habilitar `import`/`export`. Sus scripts permiten `npm run dev`, `npm run build` y `npm run preview`. `package-lock.json` se genera con npm; `npm ci` instala exactamente ese árbol de dependencias. No se debe editar a mano.

`requirements.txt` indica rangos de dependencias directas. Para reproducir las versiones probadas, instala `backend/requirements-lock.txt` en su lugar. El entorno `.venv` mantiene estas librerías separadas de otros proyectos Python.

## 10. Ejercicios para comenzar

1. Abre `src/content.json` y cambia el correo. Guarda y observa el enlace de contacto.
2. Cambia el texto de un servicio en `services` dentro de `App.jsx`.
3. Cambia `--blue` en `styles.css` y observa el acento.
4. Cambia el cargo de decoración de 60 a 70 en `NailPreview.jsx`. Con largo 3 debe mostrar 340.
5. Ejecuta `npm run build` para comprobar que tu edición sigue compilando.

Antes de publicar, confirma contacto, presentación personal y el estado actual de Cotiza Nails. La web aún no está desplegada en Internet; abrirla localmente no la publica.
