import { navigate } from "../browser/actions";

export async function browserNavigateTool(args: { url: string }): Promise<string> {
  try {
    await navigate(args.url);
    return `Navigated to ${args.url}`;
  } catch {
    return `Error: failed to navigate to "${args.url}"`;
  }
}
