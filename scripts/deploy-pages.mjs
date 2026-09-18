import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Ejecutar con npm run deploy: construye solo los archivos públicos de React.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
function git(args, cwd = root) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}
if (!process.env.npm_execpath) throw new Error("Usa npm run deploy.");
const remote = git(["remote", "get-url", "origin"]);
const authorName = git(["config", "user.name"]);
const authorEmail = git(["config", "user.email"]);
const sourceCommit = git(["rev-parse", "--short", "HEAD"]);
execFileSync(process.execPath, [process.env.npm_execpath, "run", "build:pages"], {
  cwd: root,
  stdio: "inherit",
});
const tempRoot = realpathSync(tmpdir());
const checkout = mkdtempSync(join(tempRoot, "portfolio-pages-"));
try {
  git(["init", "-b", "gh-pages"], checkout);
  git(["remote", "add", "origin", remote], checkout);
  git(["config", "user.name", authorName], checkout);
  git(["config", "user.email", authorEmail], checkout);
  const existing = spawnSync("git", ["ls-remote", "--exit-code", "--heads", "origin", "gh-pages"], { cwd: checkout, encoding: "utf8" });
  if (existing.status === 0) {
    git(["fetch", "--depth=1", "origin", "gh-pages"], checkout);
    git(["checkout", "-B", "gh-pages", "FETCH_HEAD"], checkout);
    git(["rm", "-r", "--ignore-unmatch", "."], checkout);
  } else if (existing.status !== 2) {
    throw new Error(existing.stderr || "No se pudo consultar la rama publicada.");
  }
  cpSync(join(root, "dist"), checkout, { recursive: true });
  git(["add", "--all"], checkout);
  if (git(["status", "--porcelain"], checkout)) {
    git(["commit", "-m", `Publish portfolio from ${sourceCommit}`], checkout);
    git(["push", "origin", "gh-pages"], checkout);
    console.log("Versión enviada a gh-pages. GitHub Pages finalizará la publicación.");
  } else {
    console.log("La versión publicada ya coincide con esta compilación.");
  }
} finally {
  // Solo se elimina el directorio temporal creado por este proceso.
  if (dirname(checkout) !== tempRoot || !basename(checkout).startsWith("portfolio-pages-")) {
    throw new Error("Ruta temporal inesperada; no se elimina.");
  }
  rmSync(checkout, { recursive: true, force: true });
}
