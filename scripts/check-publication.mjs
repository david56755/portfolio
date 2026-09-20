import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const staged = process.argv.includes("--staged");
const dist = process.argv.includes("--dist");
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /github_pat_[A-Za-z0-9_]{50,}/,
  /AKIA[0-9A-Z]{16}/,
];
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? walk(join(dir, entry.name))
      : [join(dir, entry.name).replaceAll("\\", "/")],
  );
}
const files = dist
  ? walk("dist")
  : execFileSync(
      "git",
      staged
        ? ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"]
        : ["ls-files", "-z"],
      { encoding: "utf8" },
    )
      .split("\0")
      .filter(Boolean);
const problems = [];
for (const file of files) {
  const sensitive =
    /(^|\/)(\.venv|node_modules|\.git)(\/|$)|(^|\/)\.env(?:\.|$)|\.(pem|key|p12|pfx|keystore|db|sqlite3?)$|(^|\/)(credentials|service-account)[^/]*\.json$/i.test(
      file,
    );
  const content = staged
    ? execFileSync("git", ["show", ":" + file])
    : readFileSync(file);
  const text = content.toString("utf8");
  if (
    sensitive &&
    !(file === ".env.pages" && text.trim() === "VITE_STATIC_SITE=true")
  )
    problems.push(file);
  if (
    dist &&
    !/^dist\/(?:index\.html|favicon\.svg|\.nojekyll|assets\/[^/]+\.(?:js|css)|cotiza-nails\/[^/]+\.png)$/.test(
      file,
    )
  )
    problems.push(file);
  if (patterns.some((pattern) => pattern.test(text))) problems.push(file);
}
if (problems.length) {
  console.error(
    "Publicación bloqueada. Revisa estos archivos (contenido omitido):\n" +
      [...new Set(problems)].join("\n"),
  );
  process.exit(1);
}
console.log(
  "Comprobación de publicación: " +
    files.length +
    " archivos revisados, sin coincidencias en las reglas configuradas.",
);
