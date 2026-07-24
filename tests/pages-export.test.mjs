import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const outputUrl = new URL("../out/index.html", import.meta.url);

test("exports a GitHub Pages-ready static app", () => {
  assert.equal(existsSync(outputUrl), true, "out/index.html is missing");
  const html = readFileSync(outputUrl, "utf8");

  assert.match(html, /<html lang="ja">/i);
  assert.match(html, /ドパクエ/);
  assert.match(html, /公開β/);
  assert.match(html, /登録不要/);
  assert.match(html, /\/dopagaki-quest\/_next\//);
  assert.doesNotMatch(html, /oai-authenticated-user-email/);
});
