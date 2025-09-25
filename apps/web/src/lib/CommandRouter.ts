// Normalizes speech to improve matching (lowercase, strip punctuation/extra spaces)
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[’'"]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type Command = {
  test: RegExp;
  run: () => void;
};

export function executeCommands(input: string, commands: Command[]) {
  const n = normalize(input);
  for (const c of commands) {
    if (c.test.test(n)) c.run();
  }
}
