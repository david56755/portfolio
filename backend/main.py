"""API del portafolio: contenido compartido y servicio de la web compilada."""
import json
from pathlib import Path
import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.trustedhost import TrustedHostMiddleware

ROOT = Path(__file__).resolve().parent.parent
POLICY = json.loads((ROOT / "security" / "policy.json").read_text(encoding="utf-8"))
app = FastAPI(title="Portafolio de Brandon", version="1.0.0", docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=[host.strip() for host in os.getenv("PORTFOLIO_ALLOWED_HOSTS", "localhost,127.0.0.1,[::1]").split(",") if host.strip()])


@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = POLICY["csp"] + "; frame-ancestors 'none'"
    response.headers["Referrer-Policy"] = POLICY["referrer"]
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()"
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store"
    return response



@app.get("/api/health")
def health():
    """Comprueba que el proceso Python responde."""
    return {"status": "ok"}


@app.get("/api/portfolio")
def portfolio():
    """Lee el mismo JSON que React usa como respaldo local."""
    return json.loads((ROOT / "src" / "content.json").read_text(encoding="utf-8"))


# Registrar primero /api evita que los archivos estáticos oculten esas rutas.
# Ejecutar npm run build antes de iniciar Python para servir la web completa.
if (ROOT / "dist").is_dir():
    app.mount("/", StaticFiles(directory=ROOT / "dist", html=True), name="web")

