import { tokenRegistry } from "./tokens.js";
import { dfaStates, CHARS } from "./states.js";

const charToIndex: Record<string, number> = {};
for (let i = 0; i < CHARS.length; i++) charToIndex[CHARS[i]] = i;

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

type TEntry = { code: number; label: string };

function findNextState(state: number, ch: string) {
  const entry = dfaStates.find(([id]) => id === state);
  if (!entry) return;
  const idx = charToIndex[ch];
  return idx !== undefined ? entry[1 + idx] : undefined;
}

function findTokenEntry(next: number): TEntry[] | undefined {
  const entry = tokenRegistry.find(([id]) => id === next);
  if (!entry) return;
  if (entry.length === 3) {
    const [, code, label] = entry;
    return [{ code, label }];
  }
  const [, compound] = entry;
  return compound.map(([c, l]) => ({ code: c, label: l }));
}

class LexerEngine {
  private idMap = new Map<string, number>();
  private intMap = new Map<string, number>();
  private floatMap = new Map<string, number>();
  private idCounter = 601;
  private intCounter = 701;
  private floatCounter = 901;

  public scan(input: string) {
    let row = 1;
    let state = 0;
    const tokens: any[] = [];
    let buffer = "";

    for (const ch of input) {
      if (ch === "\n") row++;

      const next = findNextState(state, ch);
      if (next === 202)
        throw new Error(
          `Lexical error at line ${row}: [001] INVALID IDENTIFIER`,
        );
      if (next === 201)
        throw new Error(
          `Lexical error at line ${row}: [002] INVALID NUMERIC CONSTANT`,
        );
      if (next === undefined)
        throw new Error(`Lexical error at line ${row}: UNKNOWN`);

      if (ch !== " " && ch !== "\t" && ch !== "\n" && ch !== "\r") buffer += ch;

      const entries = findTokenEntry(next);
      if (entries) {
        const value =
          entries.length <= 1
            ? buffer
            : buffer.slice(
                0,
                -entries
                  .slice(1)
                  .map((e) => e.label)
                  .join("").length,
              );

        let code: number;
        if (next >= 2000) {
          code = this.idMap.get(value)!;
          if (!code) {
            code = this.idCounter++;
            this.idMap.set(value, code);
          }
        } else if (next === 1320) {
          code = this.floatMap.get(value)!;
          if (!code) {
            code = this.floatCounter++;
            this.floatMap.set(value, code);
          }
        } else if (next >= 1310) {
          code = this.intMap.get(value)!;
          if (!code) {
            code = this.intCounter++;
            this.intMap.set(value, code);
          }
        } else {
          code = entries[0].code;
        }

        tokens.push({
          token: entries.map((e, idx) => (idx === 0 ? code : e.code)),
          word: entries.map((e) => e.label),
          value,
        });
        state = 0;
        buffer = "";
      } else {
        state = next;
      }
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
