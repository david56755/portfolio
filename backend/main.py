"""API del portafolio: contenido compartido y servicio de la web compilada."""
import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

ROOT = Path(__file__).resolve().parent.parent
app = FastAPI(title="Portafolio de Brandon", version="1.0.0")


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

