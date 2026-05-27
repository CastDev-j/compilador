import { tokenRegistry } from "./tokens.js";
import { dfaStates } from "./states.js";

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

const _f = (s: string) =>
  (s + "\r").replaceAll("\r", " \r").replace(_x, (m) => ` ${m} `);

function findNextState(state: number, ch: string): number | undefined {
  const stateEntry = dfaStates.find(([id]) => id === state);
  if (!stateEntry) return undefined;
  const transition = stateEntry[1].find(([c]) => c === ch);
  return transition?.[1];
}

function findTokenEntry(next: number): { code: number; label: string }[] | undefined {
  const entry = tokenRegistry.find(([id]) => id === next);
  if (!entry) return undefined;
  if (entry.length === 3) {
    const [, code, label] = entry as [number, number, string];
    return [{ code, label }];
  }
  const [, compound] = entry as [number, [number, string][]];
  return compound.map(([c, l]) => ({ code: c, label: l }));
}

class LexerEngine {
  private idMap = new Map<string, number>();
  private intMap = new Map<string, number>();
  private floatMap = new Map<string, number>();
  private idCounter = 601;
  private intCounter = 701;
  private floatCounter = 901;

  private getValue(buffer: string, entries: { code: number; label: string }[]): string {
    if (entries.length <= 1) return buffer;
    const trailing = entries.slice(1).map((e) => e.label).join("");
    return buffer.slice(0, -trailing.length);
  }

  private assignDynamicCode(
    next: number,
    buffer: string,
    entries: { code: number; label: string }[],
  ): number {
    const value = this.getValue(buffer, entries);

    if (next >= 2000) {
      let code = this.idMap.get(value);
      if (!code) {
        code = this.idCounter++;
        this.idMap.set(value, code);
      }
      return code;
    }

    if (next === 1320) {
      let code = this.floatMap.get(value);
      if (!code) {
        code = this.floatCounter++;
        this.floatMap.set(value, code);
      }
      return code;
    }

    if (next >= 1310) {
      let code = this.intMap.get(value);
      if (!code) {
        code = this.intCounter++;
        this.intMap.set(value, code);
      }
      return code;
    }

    return entries[0].code;
  }

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

      const next = findNextState(state, ch);

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

      const entries = findTokenEntry(next);
      if (entries) {
        const dynamicCode = this.assignDynamicCode(next, buffer, entries);
        tokens.push({
          token: entries.map((e, idx) => (idx === 0 ? dynamicCode : e.code)),
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
