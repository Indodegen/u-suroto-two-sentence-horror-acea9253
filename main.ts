import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve entry.txt next to this file: the grader may run main.ts from
// any working directory, so a relative path would break.
const here = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(here, "entry.txt"), "utf8");
const trimmed = text.trim();

// Gate (RULES.txt, "The gate"): /output/entry.txt must be UTF-8 text of
// 1 to 400 characters, not only white space; the judge brief also requires
// the story told in exactly two sentences, so enforce both here.
if (trimmed.length < 1 || trimmed.length > 400) {
  throw new Error(`entry must be 1-400 characters, got ${trimmed.length}`);
}
const sentences = trimmed
  .split(/[.!?]+/)
  .map((s) => s.trim())
  .filter(Boolean);
if (sentences.length !== 2) {
  throw new Error(`entry must be exactly two sentences, got ${sentences.length}`);
}

// A two-sentence story must end on a sentence terminator; without one the
// final sentence is unterminated and the count above would be silently
// counting a trailing fragment as a complete sentence.
if (!/[.!?]$/.test(trimmed)) {
  throw new Error("entry must end with a sentence terminator");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text);
