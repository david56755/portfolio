# Portafolio de Brandon Lozada

Portafolio en React con API en Python y diseño editorial inspirado en Joker. Incluye una baraja interactiva, animaciones al recorrer las secciones, selección de servicios, una mesa de trabajo y demo ilustrativa de Cotiza Nails. Las consultas se preparan para WhatsApp.

## GitHub y publicación

- Repositorio: https://github.com/david56755/portfolio
- Sitio: https://david56755.github.io/portfolio/
- `main` conserva el código fuente y `gh-pages` contiene solo la compilación pública.

GitHub Pages sirve la interfaz estática. `npm run build:pages` usa `.env.pages` para cargar `src/content.json` directamente, sin llamar a Python. El backend sigue disponible para desarrollo local. Vite genera enlaces relativos para que los recursos funcionen dentro de `/portfolio/`.

Para guardar cambios y publicar una nueva versión, desde esta carpeta:

```powershell
git add .
git commit -m "Actualizar portafolio"
git push origin main
npm run deploy
```

`scripts/deploy-pages.mjs` construye la web, prepara un repositorio temporal y actualiza `gh-pages` conservando su historial, sin forzar el push. GitHub Pages termina el despliegue después de recibir esa rama. Necesitas una sesión Git autenticada; no se guardan credenciales en el proyecto. Subir a `main` por sí solo no vuelve a publicar: ejecuta también `npm run deploy`.

## Versión actual: una portada que puedes explorar

La portada usa un fondo violeta profundo, el titular “IDEAS CON / CARÁCTER.” y tres cartas que funcionan como accesos al contenido: Cotiza Nails, el proceso de trabajo y contacto. `src/WildTable.jsx` construye la interacción y `src/wild-table.css` define la composición. La referencia a Joker se expresa mediante la paleta, los símbolos y la baraja, con textos orientados a presentar el trabajo de desarrollo.

Puedes elegir una carta para traerla al frente, girarla para leer más, moverla desde su asa, recoger o repartir la baraja y recomponer sus posiciones. Cada carta conserva un enlace a su sección. La portada anterior de `JokerScene.jsx` y el título `HeroTitle` quedan como código histórico y ya no se montan en la página.

El asa también admite las flechas del teclado para mover la carta e Inicio para devolverla a su sitio. La distribución se adapta al ancho disponible; al cambiar el tamaño de la ventana, las cartas recuperan su posición sin perder la cara elegida. “Pausar efectos” y la preferencia de movimiento reducido desactivan el arrastre y las transiciones de la portada, manteniendo los giros instantáneos, la selección y los enlaces.

## Mesa de trabajo: del primer trazo a la interfaz

Se retiraron la cinta verde de texto en movimiento y la cuadrícula de metodología. `src/ProjectWorkbench.jsx` y `src/workbench.css` presentan el proceso mediante capas de papel, estructura de pantalla, lógica e interfaz ilustrativa de Cotiza Nails. La composición se desarrolló para este portafolio, tomando como referencia el [índice experimental de Awwwards](https://www.awwwards.com/websites/experimental/?page=60).

El control nativo permite arrastrar, tocar o usar las flechas del teclado; también puedes elegir una de cuatro etapas o reiniciar. “Ver transformación” reproduce el recorrido completo en ocho segundos y cambia a “Pausar recorrido” mientras avanza. Si lo pausas, puedes continuar desde ese punto; si ya terminó, vuelve a empezar. Mover el control o elegir una etapa detiene la reproducción.

“Comparar con el boceto” muestra la primera hoja sin perder la posición elegida. “Volver al resultado” recupera esa vista. La reproducción empieza solo al pulsar el botón y se detiene al ocultar la pestaña o activar “Pausar efectos”. Con movimiento reducido, “Mostrar resultado” pasa directamente al final.

El estado `position` recorre de 0 a 100 y determina la fase. `visualPosition` decide qué muestran las capas durante la comparación. Los textos se superponen en `.wb-copy` para reservar la altura del más largo y mantener el control en su lugar. Es una explicación visual: no compila ni publica software, y sus importes son ejemplos.

## Abrirlo

Necesitas Node.js 22.12 o superior (en esta máquina se usó 24) y Python 3.10 o superior.

Primera instalación:

```powershell
npm ci
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
```

En esta máquina el entorno `.venv` ya está preparado; no necesitas que el comando global `python` exista para los pasos siguientes.

Terminal 1, servidor de datos:

```powershell
.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2, interfaz con actualización automática:

```powershell
npm run dev
```

Abre http://127.0.0.1:5173. Para detener cada servidor, usa Ctrl+C en su terminal.

## Compilar y servir todo con Python

```powershell
npm run build
.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Abre http://127.0.0.1:8000. Compila **antes** de arrancar Python. Si estaba iniciado antes de que existiera `dist`, reinícialo. Estos comandos sirven para revisar localmente. La versión pública se publica por separado en GitHub Pages.

## Personalizar

- Nombre, correo, teléfono y datos del proyecto: `src/content.json`.
- Textos de presentación y servicios: `src/App.jsx`.
- Portada, textos de las cartas e interacciones: `src/WildTable.jsx`; composición y adaptación: `src/wild-table.css`.
- Estilos base: `src/styles.css`; resto de la composición: `src/joker.css`, `src/editorial.css` y `src/interactive.css`.
- Entradas e inclinación de otras secciones: `src/Animations.jsx`. `HeroTitle` y `src/JokerScene.jsx` pertenecen a la portada anterior y ya no se montan.
- Demo del teléfono: `src/NailPreview.jsx`.
- Mesa de trabajo, etapas y controles: `src/ProjectWorkbench.jsx`; composición y capas: `src/workbench.css`.

Nombre y contacto se recuperaron de la web anterior; hay que confirmar que sigan vigentes antes de publicar. La información de Cotiza Nails se verificó en su README local y en la tarea “Verificar acceso a la máquina”. No se publican enlaces a su repositorio privado ni a descargas temporales.

La maqueta es una **demo ilustrativa** con cantidades de ejemplo, sin conexión a Firebase ni a cuentas reales. El formulario abre WhatsApp; no almacena datos ni envía mensajes automáticamente. Las fuentes se descargan de Google Fonts; si no hay conexión se usan fuentes del sistema.

## Aprender cómo funciona

Lee **[docs/GUIA-CODIGO.md](docs/GUIA-CODIGO.md)**: explica la arquitectura, los archivos, los hooks, el cálculo, los estilos y Python, con ejemplos para empezar a modificarlo.

La web anterior completa está en `legacy/`. Los archivos originales `styles.css`, `script.js` e `img/` también se conservaron en la raíz, pero la nueva web no los carga.

## Historial de validación anterior a la mesa de trabajo

Pasaron la compilación de producción y las comprobaciones en Chrome automatizado: cotización al cambiar largo y decoración, vista de Finanzas, apertura y cierre del proyecto, menú móvil, configuración y validación del formulario, preferencia de movimiento reducido, API Python, contenido de respaldo y entrega de la compilación desde Python. Se revisaron capturas a 1440, 390 y 320 píxeles, sin desbordamiento horizontal ni errores de JavaScript. No se enviaron mensajes reales ni se probó una instalación Android en este portafolio.


### Revisión anterior del rediseño de cartas y servicios

La compilación final pasó. Se comprobaron en el navegador el giro por clic y teclado, el reparto de cartas, la selección múltiple de servicios, la eliminación de una selección conservando el texto, la pausa de efectos y el cierre del menú con Escape. Se revisaron pantallas de 320, 390 y 1440 píxeles y se corrigió el titular en el tamaño menor. No se enviaron mensajes reales. La consola no reportó errores de JavaScript durante la revisión.

## Caso de estudio y publicación actual

La web está publicada en https://david56755.github.io/portfolio/.

- Caso de estudio de Cotiza Nails con capturas reales de su versión web en modo demo, decisiones y estado de desarrollo.
- Galería que acompaña la lectura en escritorio, con selección manual de pantallas en todos los tamaños.
- Carta personal de dos caras y consulta de contacto con servicios seleccionables y vista previa del mensaje.
- Código: `src/NailsCaseStudy.jsx`, estilos: `src/case-study.css`, capturas: `public/cotiza-nails/`.

Para publicar cambios, primero confirma y sube el código a `main`; después ejecuta `npm run deploy`. El script compila con el modo Pages y actualiza la rama `gh-pages`. GitHub Pages sirve archivos estáticos; el backend Python no se ejecuta allí.
