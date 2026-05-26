export const tokenRegistry: Record<
  number,
  { code: number; label: string } | { code: number; label: string }[]
> = {
  5: { code: 1010, label: "break" },
  9: { code: 1020, label: "case" },
  13: { code: 1030, label: "class" },
  19: { code: 1040, label: "console" },
  20: { code: 1050, label: "const" },
  27: { code: 1060, label: "default" },
  28: { code: 1070, label: "do" },
  32: { code: 1080, label: "enum" },
  35: { code: 1090, label: "for" },
  37: { code: 1100, label: "if" },
  45: { code: 1110, label: "interface" },
  48: { code: 1120, label: "let" },
  50: { code: 1130, label: "log" },
  52: { code: 1140, label: "of" },
  56: { code: 1150, label: "push" },
  62: { code: 1160, label: "return" },
  68: { code: 1170, label: "switch" },
  72: { code: 1180, label: "type" },
  75: { code: 1190, label: "var" },
  80: { code: 1200, label: "while" },

  1000: { code: 2005, label: "=" },
  101: { code: 2010, label: "++" },
  102: { code: 2020, label: "--" },
  103: { code: 2030, label: "*" },
  104: { code: 2040, label: "/" },
  105: { code: 2050, label: "%" },
  1060: { code: 2060, label: "+" },
  1070: { code: 2070, label: "-" },
  1080: { code: 2080, label: "<" },
  109: { code: 2090, label: "<=" },
  110: { code: 2100, label: ">=" },
  1110: { code: 2110, label: ">" },
  1120: { code: 2120, label: "==" },
  1130: { code: 2130, label: "!=" },
  114: { code: 2140, label: "===" },
  115: { code: 2150, label: "!==" },
  1160: { code: 2160, label: "!" },
  117: { code: 2170, label: "||" },
  118: { code: 2180, label: "&&" },
  1190: { code: 2190, label: "&" },
  1200: { code: 2200, label: "|" },

  121: { code: 3010, label: "." },
  122: { code: 3020, label: "," },
  123: { code: 3030, label: ";" },
  124: { code: 3040, label: ":" },

  125: { code: 4010, label: "{" },
  126: { code: 4020, label: "}" },

  127: { code: 5010, label: "(" },
  128: { code: 5020, label: ")" },
  129: { code: 5030, label: "[" },
  130: { code: 5040, label: "]" },

  2000: { code: 8000, label: "ID" },
  20001: [
    { code: 8000, label: "ID" },
    { code: 3020, label: "," },
  ],
  20002: [
    { code: 8000, label: "ID" },
    { code: 3030, label: ";" },
  ],
  20003: [
    { code: 8000, label: "ID" },
    { code: 2005, label: "=" },
  ],
  20004: [
    { code: 8000, label: "ID" },
    { code: 3030, label: "+" },
  ],
  20005: [
    { code: 8000, label: "ID" },
    { code: 3030, label: "-" },
  ],
  20006: [
    { code: 8000, label: "ID" },
    { code: 3030, label: "*" },
  ],
  20007: [
    { code: 8000, label: "ID" },
    { code: 3030, label: "/" },
  ],
  20008: [
    { code: 8000, label: "ID" },
    { code: 2010, label: "++" },
  ],
  20009: [
    { code: 8000, label: "ID" },
    { code: 2020, label: "--" },
  ],
  200010: [
    { code: 8000, label: "ID" },
    { code: 2050, label: "%" },
  ],
  200011: [
    { code: 8000, label: "ID" },
    { code: 3010, label: "." },
  ],

  1310: { code: 6000, label: "INT" },
  13101: [
    { code: 6000, label: "INT" },
    { code: 3030, label: ";" },
  ],
  13102: [
    { code: 6000, label: "INT" },
    { code: 3030, label: "+" },
  ],
  13103: [
    { code: 6000, label: "INT" },
    { code: 3030, label: "-" },
  ],
  13104: [
    { code: 6000, label: "INT" },
    { code: 3030, label: "*" },
  ],
  13105: [
    { code: 6000, label: "INT" },
    { code: 3030, label: "/" },
  ],
  1320: { code: 6010, label: "FLOAT" },
  134: { code: 7000, label: "STRING" },

  201: { code: 9000, label: "INVALID NUMERIC CONSTANT" },
  202: { code: 9000, label: "INVALID IDENTIFIER" },
};
