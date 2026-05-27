import { deepEqual, strictEqual } from "node:assert";
import { tokenize } from "../lexer/engine.js";

const codes = (input: string): number[] | undefined => {
  const result = tokenize(input);
  if (!result) return undefined;
  return result.map((t) => t.token).flat();
};

const keywords: [string, number][] = [
  ["break", 101], ["case", 102], ["class", 103],
  ["console", 104], ["const", 105], ["default", 106],
  ["do", 107], ["enum", 108], ["for", 109],
  ["if", 110], ["interface", 111], ["let", 112],
  ["log", 113], ["of", 114], ["push", 115],
  ["return", 116], ["switch", 117], ["type", 118],
  ["var", 119], ["while", 120], ["and", 121],
  ["get", 122], ["has", 123], ["hex", 124],
  ["map", 125], ["nil", 126], ["use", 127],
  ["key", 128], ["yes", 129], ["zip", 130],
];

const operators: [string, number][] = [
  ["=", 201], ["++", 202], ["--", 203],
  ["*", 204], ["/", 205], ["%", 206],
  ["+", 207], ["-", 208], ["<", 209],
  ["<=", 210], [">=", 211], [">", 212],
  ["==", 213], ["!=", 214], ["===", 215],
  ["!==", 216], ["!", 217], ["||", 218],
  ["&&", 219],
];

const punctuation: [string, number][] = [
  [".", 301], [",", 302], [";", 303], [":", 304],
  ["{", 401], ["}", 402],
  ["(", 501], [")", 502], ["[", 503], ["]", 504],
];

let passed = 0;
let failed = 0;

const test = (name: string, fn: () => void) => {
  try {
    fn();
    passed++;
  } catch (e) {
    failed++;
    console.error(`FAIL: ${name} — ${(e as Error).message}`);
  }
};

console.log("\n=== KEYWORDS ===");
for (const [word, code] of keywords) {
  test(`'${word}' → ${code}`, () => deepEqual(codes(word), [code]));
}

console.log("\n=== IDENTIFIERS ===");
test("identifier 'foo'", () => deepEqual(codes("foo"), [601]));
test("identifier 'bar123'", () => deepEqual(codes("bar123"), [601]));
test("identifier '_tmp'", () => deepEqual(codes("_tmp"), [601]));
test("identifier 'abc_def'", () => deepEqual(codes("abc_def"), [601]));

console.log("\n=== INTEGERS ===");
test("integer '42'", () => deepEqual(codes("42"), [701]));
test("integer '0'", () => deepEqual(codes("0"), [701]));
test("integer '999'", () => deepEqual(codes("999"), [701]));

console.log("\n=== FLOATS ===");
test("float '3.14'", () => {
  const result = codes("3.14");
  deepEqual(result, [901]);
});

console.log("\n=== STRINGS ===");
test("string '\"hello\"'", () => deepEqual(codes('"hello"'), [801]));

console.log("\n=== OPERATORS ===");
for (const [op, code] of operators) {
  const input = `x${op}y`;
  test(`'${op}' → ${code} (in '${input}')`, () => {
    const result = codes(input);
    deepEqual(result, [601, code, 602]);
  });
}

console.log("\n=== PUNCTUATION ===");
for (const [sym, code] of punctuation) {
  test(`'${sym}' → ${code}`, () => deepEqual(codes(sym), [code]));
}

console.log("\n=== ERROR CASES ===");
test("error 001: identifier with ñ", () => {
  strictEqual(codes("ñ"), undefined);
});
test("error 002: invalid numeric '01'", () => {
  strictEqual(codes("01"), undefined);
});
test("error 002: invalid numeric '012'", () => {
  strictEqual(codes("012"), undefined);
});

console.log("\n=== COMPOUND EXPRESSIONS ===");
test("'let x = 42'", () => deepEqual(codes("let x = 42"), [112, 601, 201, 701]));
test("'if x > y { log name }'", () => {
  deepEqual(codes("if x > y { log name }"), [110, 601, 212, 602, 401, 113, 603, 402]);
});
test("'x == 42 && y == 10'", () => {
  deepEqual(codes("x == 42 && y == 10"), [601, 213, 701, 219, 602, 213, 702]);
});

console.log("\n=== NEW KEYWORDS IN CONTEXT ===");
test("'let a = nil'", () => deepEqual(codes("let a = nil"), [112, 601, 201, 126]));
test("'let b = get map'", () => deepEqual(codes("let b = get map"), [112, 601, 201, 122, 125]));
test("'let c = has key'", () => deepEqual(codes("let c = has key"), [112, 601, 201, 123, 128]));
test("'let d = hex zip'", () => deepEqual(codes("let d = hex zip"), [112, 601, 201, 124, 130]));
test("'let e = use and'", () => deepEqual(codes("let e = use and"), [112, 601, 201, 127, 121]));
test("'let f = yes'", () => deepEqual(codes("let f = yes"), [112, 601, 201, 129]));

const total = passed + failed;
console.log(`\n${"=".repeat(40)}`);
console.log(`${passed}/${total} tests passed`);
if (failed > 0) {
  console.log(`${failed}/${total} tests FAILED`);
  process.exit(1);
}
