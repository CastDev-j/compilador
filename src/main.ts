import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";
import { tokenize } from "./lexer/engine.js";
import { formatSource } from "./formatter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const samplePath = join(__dirname, "examples", "demo.nv");
const outputPath = join(__dirname, "examples", "output.txt");

function processFile() {
  const source = readFileSync(samplePath, "utf-8");
  const tokens = tokenize(formatSource(source));

  if (!tokens) return;

  console.log(source);
  console.log(tokens.map((t) => t.token).flat().join(" "));
  console.log(tokens);

  writeFileSync(outputPath, tokens.map((t) => t.token).flat().join(" "));

  return tokens;
}

processFile();
