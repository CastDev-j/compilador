import { tokenRegistry } from "./tokens.js";
import { dfaStates } from "./states.js";
import { _f } from "../main.js";



class LexerEngine {
  public scan(input: string) {
    let row = 1;
    let state = 0;
    const tokens: any[] = [];
    let i = 0;
    const len = input.length;
    let buffer = "";

    while (i < len) {
      const ch = input[i];

      if (ch === "\n") {
        row++;
      }

      const next = (dfaStates as any)[state]?.[ch];

      if (next === 202) {
        throw new Error(`Lexical error at line ${row}: [001] INVALID IDENTIFIER`);
      }
      if (next === 201) {
        throw new Error(`Lexical error at line ${row}: [002] INVALID NUMERIC CONSTANT`);
      }
      if (next === undefined) {
        throw new Error(`Lexical error at line ${row}: UNKNOWN`);
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
    return engine.scan(_f(input));
  } catch (err) {
    console.error(err instanceof Error ? err.message : "Unknown error");
  }
};
