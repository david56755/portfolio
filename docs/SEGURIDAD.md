# Revisión del portafolio — 20 de septiembre de 2026

## Alcance y resultado

Se revisaron el frontend React, el backend Python local, las dependencias instaladas, los enlaces de contacto y la publicación GitHub Pages de este repositorio. No se auditó Cotiza Nails ni ningún otro proyecto. Esto es una revisión de código y configuración, no una prueba de penetración ni una garantía de ausencia de fallos.

- npm audit: cero vulnerabilidades conocidas antes y después de actualizar. Lucide pasó de 1.46.0 a 1.47.0 y Prettier de 3.9.7 a 3.9.8.
- pip-audit sobre backend/requirements-lock.txt: ninguna vulnerabilidad conocida. Se actualizó idna de 3.19 a 3.20 y pip local de 25.0.1 a 26.2.1. Se conservan las versiones compatibles de FastAPI/Pydantic; no se fuerza pydantic_core fuera de la versión que requiere Pydantic.
- pip check: no hay requisitos incompatibles.
- HTTPS obligatorio confirmado con la API de GitHub Pages.
- Búsqueda de patrones de claves privadas, tokens GitHub y claves AWS en archivos versionados actuales: sin coincidencias. No es un escaneo completo del historial ni detecta todo tipo de secreto.

## Protecciones añadidas

1. security/policy.json define una CSP que permite scripts solo del mismo origen, sin unsafe-inline ni unsafe-eval para JavaScript. Bloquea objetos, frames y cambios de URL base; limita conexiones al mismo origen y envíos del formulario a destinos WhatsApp. La política se incorpora al HTML de producción mediante Vite; no se aplica al servidor HMR de desarrollo.
2. La política de referentes no-referrer evita enviar la URL de origen al navegar. Los enlaces y el formulario externos conservan noopener/noreferrer.
3. src/contentValidation.js valida el contenido de la API antes de utilizarlo: teléfono internacional solo numérico, correo sin parámetros ni caracteres de control, cadenas con límites y listas de textos. React sigue escapando el texto: no se introduce HTML recibido mediante dangerouslySetInnerHTML.
4. Python añade CSP por cabecera, frame-ancestors none, X-Frame-Options DENY, nosniff y restricciones de cámara, micrófono, ubicación y pagos. TrustedHostMiddleware permite solo localhost por defecto. Para desplegar Python detrás de HTTPS configura PORTFOLIO_ALLOWED_HOSTS con los nombres concretos del servidor; no uses un comodín. No se añadió un despliegue público de Python.
5. La API sigue siendo de lectura. La documentación automática está deshabilitada; el servidor sirve únicamente dist y sus dos endpoints, no la raíz del repositorio.
6. .gitignore protege archivos de entorno y claves privadas. .env.pages es la excepción intencional: solo contiene el indicador público VITE_STATIC_SITE=true. Ninguna variable VITE_* debe contener secretos.
7. .github/dependabot.yml configura revisiones semanales de npm y pip, con cambios propuestos mediante pull requests. No hay fusión automática.

## Límites y decisiones explícitas

GitHub Pages publica archivos estáticos: las cabeceras del backend Python no se aplican allí. La CSP HTML no puede establecer frame-ancestors, por lo que no se atribuye protección contra clickjacking a la versión Pages. Para controlar esas cabeceras se necesita un servidor o proveedor que las permita.

style-src conserva unsafe-inline porque Motion y la interfaz actual generan estilos dinámicos. Esa excepción es para estilos; no permite JavaScript inline. Se permiten las hojas y fuentes de Google Fonts, que reciben las solicitudes normales del navegador. script-src self confía en el mismo origen, incluido el contenido que publique la cuenta bajo ese dominio.

El contacto no tiene una base de datos, contraseñas, sesiones ni carga de archivos. El mensaje permanece en memoria del navegador hasta que el visitante abre WhatsApp; entonces se transmite a ese servicio para revisión y envío. La revisión no envió mensajes reales.

## Comprobaciones reproducibles

- npm run test:security: compila y prueba entradas malformadas y CSP resultante.
- npm audit --audit-level=low: audita npm con avisos actuales.
- .venv/Scripts/python.exe -m tests.security_backend: prueba cabeceras, rechazo de host desconocido, API de solo lectura y ausencia de archivos privados.
- pip-audit -r backend/requirements-lock.txt --disable-pip --no-deps: consulta avisos de todas las versiones fijadas. La herramienta se ejecutó en un entorno temporal separado.

En el navegador se revisaron selección de las tres cartas, conservación del mensaje, combinación de servicios, Escape/restauración de foco, funcionamiento con efectos pausados, tamaños de escritorio y móvil y consola sin errores de CSP.

Fuentes: [CSP de MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), [limitación de frame-ancestors en meta](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors), [HTTPS en GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).

## Control previo a la publicación

scripts/check-publication.mjs revisa nombres sensibles y patrones comunes de credenciales sin imprimir su contenido. Con --staged revisa exactamente los archivos preparados para el commit. Con --dist permite únicamente los recursos públicos previstos; deploy-pages.mjs lo ejecuta antes de subir. Es una defensa adicional, no un detector universal de secretos. La revisión manual sigue siendo necesaria.
