const BLOCKED_PATH_PATTERNS = [
  "../",
  "..\\",
  "C:\\Windows",
  "/etc",
  "/root",
  "system32",
];

const SHELL_METACHARACTERS = /[;&|><`$(){}]/g;

export function sanitizePath(input: string): string {
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (input.includes(pattern)) {
      throw new Error(`Blocked path pattern detected: ${pattern}`);
    }
  }
  const cleaned = input.replace(/^[./\\]+/, "").trim();
  if (!cleaned) throw new Error("Sanitized path is empty");
  return cleaned;
}

export function sanitizeShellArg(input: string): string {
  const cleaned = input.replace(SHELL_METACHARACTERS, "").trim();
  if (!cleaned) throw new Error("Sanitized shell arg is empty");
  return cleaned;
}
