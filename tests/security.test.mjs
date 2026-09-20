import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateContent } from "../src/contentValidation.js";
const content = JSON.parse(
  readFileSync(new URL("../src/content.json", import.meta.url)),
);
test("accepts real content and rejects malformed API data", () => {
  assert.equal(validateContent(content), true);
  for (const change of [
    { whatsapp: "123?text=redirect" },
    { whatsapp: "javascript:alert(1)" },
    { email: "x@example.com?subject=Injected" },
    { email: "x%0d%0a@example.com" },
    { email: "x\r\n@example.com" },
    { name: { html: "bad" } },
    { project: { ...content.project, stack: [{}] } },
    { project: { ...content.project, note: "x".repeat(2001) } },
  ])
    assert.equal(validateContent({ ...content, ...change }), false);
  for (const data of [null, [], {}, "bad"])
    assert.equal(validateContent(data), false);
});
test("production HTML restricts scripts, objects, base URLs and form destinations", () => {
  const html = readFileSync(
    new URL("../dist/index.html", import.meta.url),
    "utf8",
  ).replaceAll("&#39;", "'");
  assert.match(html, /http-equiv="Content-Security-Policy"/);
  assert.match(html, /script-src 'self';/);
  assert.doesNotMatch(
    html,
    /script-src[^;]*(unsafe-inline|unsafe-eval|https:|\*)/,
  );
  assert.match(html, /object-src 'none'/);
  assert.match(html, /base-uri 'none'/);
  assert.match(
    html,
    /form-action https:\/\/wa.me https:\/\/api.whatsapp.com https:\/\/web.whatsapp.com/,
  );
  assert.match(html, /name="referrer" content="no-referrer"/);
});
