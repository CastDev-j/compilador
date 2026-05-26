import type { StateMap } from "../formatter.js";
import { tokenRegistry } from "./tokens.js";
import { dfaStates } from "./states.js";

class LexerEngine {
  public scan(input: string) {
    let row = 1;
    let state = 0;
    const tokens = [];
    let i = 0;
    const len = input.length;
    let buffer = "";

    while (i < len) {
      const ch = input[i];

      if (ch === "\r") {
        row++;
      }

      const next = dfaStates[state]?.[ch as keyof StateMap];

      if (next === 201 || next === 202 || next === undefined) {
        const msg =
          (tokenRegistry[next!] as { label: string })?.label || "Unknown error";
        const code = next ?? "Unidentified";
        throw new Error(`Lexical error at row ${row}: ${msg} (code: ${code})`);
      }

      buffer += ![" ", "\t", "\n", "\r"].includes(ch!) ? ch : "";

      if (tokenRegistry[next]) {
        const entries = Array.isArray(tokenRegistry[next])
          ? tokenRegistry[next]
          : [tokenRegistry[next]];
        tokens.push({
          token: entries.map((e) => e.code),
          word: entries.map((e) => e.label),
          value: buffer,
        });
        state = 0;
        buffer = "";
      } else {
        state = next;
      }

      i++;
    }
    return tokens;
  }
}

export const tokenize = (input: string) => {
  const engine = new LexerEngine();
  try {
    return engine.scan(input);
  } catch (err) {
    console.error(err instanceof Error ? err.message : "Unknown error");
  }
};
