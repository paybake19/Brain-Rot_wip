const ALLOWED_SHELL_COMMANDS = [
  "git",
  "npm",
  "node",
  "python",
  "python3",
  "ping",
  "ls",
  "dir",
  "echo",
];

const BLOCKED_PATH_PATTERNS = [
  "../",
  "..\\",
  "C:\\Windows",
  "system32",
  "/etc",
  "/root",
  "/bin",
];

export function isCommandAllowed(command: string): boolean {
  const base = command.trim().split(/\s+/)[0].toLowerCase();
  if (!ALLOWED_SHELL_COMMANDS.includes(base)) return false;
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (command.includes(pattern)) return false;
  }
  return true;
}
