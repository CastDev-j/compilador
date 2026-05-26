import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";
import { tokenize } from "./lexer/engine.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const samplePath = join(__dirname, "examples", "demo.nv");
const outputPath = join(__dirname, "examples", "output.txt");

function processFile() {
  const source = readFileSync(samplePath, "utf-8");
  const tokens = tokenize(source);

  if (!tokens) return;

  console.log(source);
  console.log(
    tokens
      .map((t) => t.token)
      .flat()
      .join(" "),
  );
  console.log(tokens);

  writeFileSync(
    outputPath,
    tokens
      .map((t) => t.token)
      .flat()
      .join(" "),
  );

  return tokens;
}

const _ch = String.fromCharCode;
const _cd = [
  0x3d3d3d, 0x213d3d, 0x3c3d, 0x3e3d, 0x213d, 0x3d3d, 0x7c7c, 0x2626, 0x28,
  0x29, 0x7b, 0x7d, 0x3b, 0x3d, 0x21, 0x26, 0x7c, 0x3c, 0x3e, 0x2b2b, 0x2d2d,
  0x2b, 0x2d, 0x2a, 0x2f, 0x25,
];
const _p = _cd.map((n) => {
  let r = "";
  while (n > 0) {
    r = _ch(n & 0xff) + r;
    n >>= 8;
  }
  return r || _ch(0);
});
const _x = new RegExp(
  _p.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
  "g",
);

export const _f = (s: string) =>
  (s + "\r").replaceAll("\r", " \r").replace(_x, (m) => ` ${m} `);

processFile();
