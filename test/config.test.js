import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as prettier from "prettier";

const fixture = (name) => new URL(`fixtures/${name}`, import.meta.url).pathname;
const oxlint = (file) => {
  try {
    execFileSync("node_modules/.bin/oxlint", ["-c", "oxlint.json", "--format", "json", file], { encoding: "utf8" });
    return [];
  } catch (err) {
    return JSON.parse(err.stdout).diagnostics.map((d) => d.code);
  }
};

test("Prettier reads the shared settings and leaves well-formatted code as it is", async () => {
  const options = await prettier.resolveConfig(fixture("good.tsx"));
  assert.equal(options.printWidth, 160);
  const source = readFileSync(fixture("good.tsx"), "utf8");
  assert.equal(await prettier.format(source, { ...options, filepath: fixture("good.tsx") }), source);
});

test("oxlint passes good code", () => {
  assert.deepEqual(oxlint(fixture("good.tsx")), []);
});

test("oxlint finds a hook called conditionally and a list item without a key", () => {
  const codes = oxlint(fixture("bad.tsx"));
  assert.ok(
    codes.some((c) => c.includes("rules-of-hooks")),
    codes.join(", "),
  );
  assert.ok(
    codes.some((c) => c.includes("jsx-key")),
    codes.join(", "),
  );
});
