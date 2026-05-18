import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatMessage } from "./chat.store";

export interface AgentDefinition {
  id: string;           // unique slug, e.g. "chad", "kyle", "custom-1718abcd"
  name: string;         // display name, e.g. "Chad"
  initials: string;     // 2-char abbreviation for avatar, e.g. "Ch"
  emoji: string;        // single emoji for icon, e.g. "⚡"
  role: string;         // short role description, e.g. "First-Pass Output"
  systemPrompt: string; // editable system prompt
  status: "online" | "thinking" | "idle" | "offline";
  isBuiltIn: boolean;   // true for Chad/Kyle/Karen/Brody, false for custom
}

// Default built-in agents
export const BUILT_IN_AGENTS: AgentDefinition[] = [
  {
    id: "chad",
    name: "Chad",
    initials: "Ch",
    emoji: "⚡",
    role: "First-Pass Output",
    systemPrompt: "You are Chad, the first-pass LLM. You provide quick, direct, and accurate initial responses. Be concise and get straight to the point. When you're uncertain, flag it — Kyle will refine your work.",
    status: "online",
    isBuiltIn: true,
  },
  {
    id: "kyle",
    name: "Kyle",
    initials: "Ky",
    emoji: "🔍",
    role: "Refinement",
    systemPrompt: "You are Kyle, the refinement agent. You review and polish Chad's initial output. Improve clarity, fix mistakes, add necessary depth and nuance. For complex tasks, your output goes to Karen for final audit.",
    status: "idle",
    isBuiltIn: true,
  },
  {
    id: "karen",
    name: "Karen",
    initials: "Ka",
    emoji: "🔒",
    role: "Code Auditor",
    systemPrompt: "You are Karen, the code quality auditor. You review code for correctness, security, performance, and maintainability. Nothing ships without your sign-off. Be thorough and uncompromising.",
    status: "idle",
    isBuiltIn: true,
  },
  {
    id: "brody",
    name: "Brody",
    initials: "Br",
    emoji: "🧠",
    role: "Planner / Orchestrator",
    systemPrompt: "You are Brody, the planner and orchestrator. You decompose complex tasks into sub-tasks and assign them to the right agents. You determine whether a task is simple (Chad handles it alone) or complex (Chad → Kyle → Karen pipeline). Always explain your orchestration plan before delegating.",
    status: "online",
    isBuiltIn: true,
  },
];

interface AgentStore {
  agents: AgentDefinition[];
  activeAgentId: string;
  conversations: Record<string, ChatMessage[]>;  // per-agent message histories

  // Actions
  setActiveAgent: (id: string) => void;
  updateAgentPrompt: (id: string, prompt: string) => void;
  updateAgentStatus: (id: string, status: AgentDefinition["status"]) => void;
  addCustomAgent: (agent: Omit<AgentDefinition, "id" | "isBuiltIn" | "status">) => string;
  removeCustomAgent: (id: string) => void;
  getAgentMessages: (id: string) => ChatMessage[];
  addMessageToAgent: (id: string, msg: ChatMessage) => void;
  clearAgentMessages: (id: string) => void;
}

export const useAgentStore = create<AgentStore>()(
  persist(
    (set, get) => ({
      agents: BUILT_IN_AGENTS,
      activeAgentId: "chad",
      conversations: {},

      setActiveAgent: (id) => set({ activeAgentId: id }),

      updateAgentPrompt: (id, prompt) =>
        set((s) => ({
          agents: s.agents.map((a) =>
            a.id === id ? { ...a, systemPrompt: prompt } : a
          ),
        })),

      updateAgentStatus: (id, status) =>
        set((s) => ({
          agents: s.agents.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),

      addCustomAgent: (agent) => {
        const id = `custom-${crypto.randomUUID().slice(0, 8)}`;
        set((s) => ({
          agents: [
            ...s.agents,
            { ...agent, id, isBuiltIn: false, status: "online" as const },
          ],
        }));
        return id;
      },

      removeCustomAgent: (id) =>
        set((s) => ({
          agents: s.agents.filter((a) => !(a.id === id && !a.isBuiltIn)),
          activeAgentId:
            s.activeAgentId === id ? "chad" : s.activeAgentId,
        })),

      getAgentMessages: (id) => get().conversations[id] ?? [],

      addMessageToAgent: (id, msg) =>
        set((s) => ({
          conversations: {
            ...s.conversations,
            [id]: [...(s.conversations[id] ?? []), msg],
          },
        })),

      clearAgentMessages: (id) =>
        set((s) => ({
          conversations: { ...s.conversations, [id]: [] },
        })),
    }),
    { name: "brainrot-agent-store" }
  )
);
