export function buildVisionPrompt(): string {
  return `You are analyzing a screenshot of the user's screen.
Describe what you see in precise detail.
Focus on: active application, visible text, UI state, any errors or alerts.
Be concise and structured. Use bullet points for clarity.`;
}
