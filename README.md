
# Brain Rot [WIP]

**Brain Rot** is a local-first LLM interface designed to act as a operating system — deeply integrated with your Obsidian vault and built for real-time interaction, automation, and agent-based workflows.

This is not just a chat UI - its a bandwagon second brain.
It’s a step toward a **Jarvis-like system** that can think, act, observe, and organize alongside you.

---

## ⚡ Core Concept

Brain Rot turns your local environment into an **augmented thinking space**:

* 🧠 LLM-powered reasoning (local + remote models)
* 📂 Direct integration with your Obsidian “second brain”
* 🎙️ Voice-first interaction (speech-to-text + text-to-speech)
* 🤖 Multi-agent system (extensible, user-defined)
* 🪟 Hyprland-inspired window management for agents/tasks
* 🔄 Live data feeds + reactive workflows (in progress)

---

## 🧩 Architecture Overview

```
brainrot-app/
├── backend/        # Core system logic, agents, services
├── frontend/       # UI (Vite + React + Tailwind v4)
├── shared/         # Shared types/utilities (future expansion)
```

---

## 🖥️ Frontend

Built with:

* React (TSX)
* Vite
* TailwindCSS v4

### Key Features

* 🪟 **Window Manager** (working towards Hyprland-style snapping + tiling)
* 🧠 **Boot Screen** 
* 📊 **Topbar Metrics** (UI placeholders for now)

  * Context %
  * Token usage
  * Report generation
* 📂 **Right Panel**

  * Active Tasks
  * Obsidian Vault Status
* 🧍 **Sidebar**

  * Agent selection
  * Mode switching (Chat, Voice, Focus, etc.)

---

## 🧠 Backend

Structured for modular, extensible intelligence:

```
backend/src/
├── agents/        # Agent definitions + orchestration
├── llm/           # Model abstraction layer
├── tools/         # Tool use (web, file, etc.)
├── services/      # Core system services
├── routes/        # API endpoints
├── middleware/    # Request handling
├── scheduler/     # Background tasks / automation
├── events/        # Event-driven system hooks
├── vector/        # Embeddings + retrieval
├── vision/        # Screen capture / visual processing
├── browser/       # Web interaction layer
├── email/         # Email integration
└── utils/         # Shared helpers
```

---

## 🔗 Obsidian Integration (Core Feature)

Brain Rot connects directly to your Obsidian vault to:

* 📖 Read and index notes
* ✍️ Create / modify files
* 🧠 Use your vault as long-term memory
* 🔍 Perform semantic search (vector-based)
* 🔄 Trigger actions from LLM outputs *(in progress)*

---

## 🎙️ Voice System

* Speech-to-text input
* Text-to-speech output
* Real-time interaction layer *(planned enhancements)*

---

## 🤖 Agent System

Agents are:

* Modular
* UI-spawnable (planned)
* Task-oriented

Examples:

* Research agent
* Code analyst
* Task manager
* Data processor

Future:

* User-defined agents
* Persistent agent memory
* Parallel execution

---

## 🚧 Work In Progress

* 🔄 Live data feeds (system + external)
* 🧠 Persistent memory across sessions
* 🛠️ Obsidian action execution (write/edit/organize)
* 🧩 Tool chaining + autonomous workflows
* 🎛️ Advanced window tiling + resizing
* 📡 Event-driven automation (Jarvis-like behavior)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

---

### 2. Run frontend

```bash
cd frontend
npm run dev
```

---

### 3. Run backend

```bash
cd backend
npm run dev
```

---

## 🧠 Philosophy

Brain Rot is built around one idea:

> Vibe coding and poor search history will drive llm performance.

This project explores what happens when:

* your notes become memory
* your UI becomes an environment
* your assistant becomes a system

---

## ⚠️ Status

Early-stage, actively evolving.

Expect:

* breaking changes
* rapid iteration
* experimental features

---

## 🛣️ Roadmap (High-Level)

* [ ] Full Obsidian action layer
* [ ] Agent creation UI
* [ ] Persistent multi-agent orchestration
* [ ] Real-time voice interaction loop
* [ ] Local-first model optimization
* [ ] System-wide automation hooks

---

## 🧩 Inspiration

* Obsidian (second brain)
* Hyprland (window management)
* Jarvis (system behavior)

---

## 📜 License

TBD

---

## 👁️ Final Note

This isn't just a UI.

It's the beginning of a **personal intelligence layer**.

---

## 📋 Next Session: Implementation Plan

> Generated: 2026-05-12 | Session scope: DeepSeek API, Multi-Agent System, Sidebar Wiring

### What was completed this session

- ✅ Fixed `vault.api.ts` URLs (`/api/v1/vault` → `/api/vault`) to match backend routes
- ✅ Implemented `frontend/src/hooks/useVault.ts` (was empty) — live vault data fetching
- ✅ Wired `RightPanel.tsx` vault section to `useVault` hook — real note counts, connection status, sync button
- ✅ Fixed TypeScript errors: `theme` prop threaded through `AppLayout` → `WindowManager` → `ChatWindow`
- ✅ Removed Windows-only `@rolldown/binding-win32-x64-msvc` from `package.json` (re-add when back on Windows)
- ✅ Designed agent pipeline (Chad → Kyle → Karen, orchestrated by Brody)
- ✅ Designed LLM routing (DeepSeek primary → Ollama fallback)

---

### Phase 1: DeepSeek API Service + Ollama Fallback

#### 1a. Add DeepSeek config to `backend/src/config/index.ts`

Add to the `config` object inside `require_env` / env reads:

```ts
deepseek: {
  apiKey: require_env("DEEPSEEK_API_KEY"),
  model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
  baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
},
```

Remove the hardcoded console.log debug block at the top of the file.

#### 1b. Create `backend/src/services/deepseek.service.ts`

DeepSeek uses an OpenAI-compatible API. Implement the same interface as `ollama.service.ts`:

```ts
// Interface to implement:
export interface LLMService {
  streamChat(messages: OllamaMessage[]): AsyncGenerator<StreamChunk>;
  generate(prompt: string, imageBase64?: string): Promise<string>;
  embed(text: string): Promise<number[]>;  // may throw / fall back to Ollama
}
```

Key differences from Ollama:

| Aspect | Ollama | DeepSeek |
|---|---|---|
| Endpoint | `POST /api/chat` | `POST /v1/chat/completions` |
| Auth header | None | `Authorization: Bearer <key>` |
| Stream format | NDJSON lines `{"message":{"content":"..."}}` | SSE `data: {"choices":[{"delta":{"content":"..."}}]}` |
| Embeddings | `POST /api/embeddings` | ❌ Not supported — must fall back to Ollama |
| Tool calling | Manual prompt-based | Native `tools` + `tool_choice` params |

**Stream parsing for DeepSeek SSE:**
```ts
// Each SSE line looks like:
// data: {"id":"...","choices":[{"index":0,"delta":{"content":"Hello"}}]}
// data: {"id":"...","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}
// data: [DONE]

const json = JSON.parse(line.slice(6));  // strip "data: "
const delta = json?.choices?.[0]?.delta;
if (delta?.content) yield { type: "token", content: delta.content };
if (json?.choices?.[0]?.finish_reason) yield { type: "done", content: "" };
```

**`embed()` should throw** so the fallback kicks in. DeepSeek has no embedding endpoint.

#### 1c. Create `backend/src/services/llm.service.ts` (Facade)

This is the router that tries DeepSeek first, falls back to Ollama:

```ts
import { deepseekService } from "./deepseek.service";
import { ollamaService } from "./ollama.service";
import { logger } from "./logger.service";

export const llmService = {
  async *streamChat(messages: OllamaMessage[]): AsyncGenerator<StreamChunk> {
    try {
      for await (const chunk of deepseekService.streamChat(messages)) {
        yield chunk;
      }
    } catch (err: any) {
      logger.warn("DeepSeek failed, falling back to Ollama", { error: err.message });
      for await (const chunk of ollamaService.streamChat(messages)) {
        yield chunk;
      }
    }
  },

  async generate(prompt: string, imageBase64?: string): Promise<string> {
    try {
      return await deepseekService.generate(prompt, imageBase64);
    } catch {
      logger.warn("DeepSeek generate failed, falling back to Ollama");
      return await ollamaService.generate(prompt, imageBase64);
    }
  },

  async embed(text: string): Promise<number[]> {
    // DeepSeek has no embeddings — go straight to Ollama
    return await ollamaService.embed(text);
  },
};
```

#### 1d. Update `backend/src/routes/chat.route.ts`

Change the import:
```ts
// Before:
import { ollamaService, OllamaMessage } from "../services/ollama.service";
// After:
import { llmService } from "../services/llm.service";
import { OllamaMessage } from "../services/ollama.service";  // keep the type
```

Replace `ollamaService.streamChat(ollamaMessages)` with `llmService.streamChat(ollamaMessages)`.

#### 1e. Environment variables

Add to `.env`:
```env
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

Existing Ollama vars remain unchanged (used as fallback):
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL_DEFAULT=gemma4:e4b
OLLAMA_EMBED_MODEL=nomic-embed-text
```


#### 2b. Create `frontend/src/hooks/useAgent.ts`

Hook that wraps `useAgentStore` with convenience methods:

```ts
import { useAgentStore, type AgentDefinition } from "../store/agent.store";
import { useChatStore } from "../store/chat.store";
import { useCallback } from "react";

export function useAgent() {
  const agents = useAgentStore((s) => s.agents);
  const activeAgentId = useAgentStore((s) => s.activeAgentId);
  const activeAgent = agents.find((a) => a.id === activeAgentId) ?? agents[0];

  const setActiveAgent = useAgentStore((s) => s.setActiveAgent);
  const updatePrompt = useAgentStore((s) => s.updateAgentPrompt);
  const addCustom = useAgentStore((s) => s.addCustomAgent);
  const removeCustom = useAgentStore((s) => s.removeCustomAgent);
  const addMessageToAgent = useAgentStore((s) => s.addMessageToAgent);
  const clearAgentMessages = useAgentStore((s) => s.clearAgentMessages);

  // Per-agent message history from store
  const agentMessages = useAgentStore(
    (s) => s.conversations[activeAgentId] ?? []
  );

  // Load agent messages into chat.store when switching agents
  const clearMessages = useChatStore((s) => s.clearMessages);
  const addMessage = useChatStore((s) => s.addMessage);

  const switchAgent = useCallback(
    (id: string) => {
      // Save current chat to old agent, load new agent's chat
      setActiveAgent(id);
    },
    [setActiveAgent]
  );

  return {
    agents,
    activeAgent,
    activeAgentId,
    switchAgent,
    updatePrompt,
    addCustomAgent: addCustom,
    removeCustomAgent: removeCustom,
    agentMessages,
    addMessageToAgent,
    clearAgentMessages,
  };
}
```

#### 2c. Rewrite `frontend/src/components/layout/Sidebar.tsx`

Replace the hardcoded `AGENTS` array with data from `useAgent()`. Keep the existing styling 100% intact — all classes, transitions, and CSS variable tokens stay the same.

Key changes:

1. **Import `useAgent`** instead of the static `AGENTS` constant
2. **Map over `agents` from the hook** instead of `AGENTS`
3. **Agent status** — use the `STATUS_DOT` and `STATUS_LABEL` maps exactly as they are (supports `online`, `thinking`, `idle`, `offline`)
4. **Active agent highlight** — compare `activeAgentId` instead of hardcoded `activeAgent` state
5. **Agent icon** — use `agent.emoji` inside the avatar circle instead of `agent.initials` (or keep initials in the circle and show emoji elsewhere — your choice, just be consistent)
6. **"+ New Agent" button** — opens a modal/inline form to create a custom agent (name, role, emoji, prompt). Use `addCustomAgent()`.
7. **Edit prompt** — clicking an agent's `⋯` button or a small edit icon opens an inline textarea to edit the system prompt. Use `updatePrompt(agent.id, newPrompt)`.
8. **Remove custom agent** — only for non-built-in agents, show a small ✕ that calls `removeCustomAgent(id)`.

**Styling rules (CRITICAL):**
- Use `rgb(var(--accent))`, `rgb(var(--text))`, `rgb(var(--panel))` for ALL colors
- Use existing classes: `glass`, `glass-strong`, `glow-neon`, `hover-glow`, `btn`, `btn-accent`
- Use `transition-colors duration-700` on elements that change with theme
- The psychedelic theme targets `aside:first-of-type` — keep the `<aside>` as the root element
- The form for new agent / edit prompt should use `glass-strong` panel styling
- Do NOT introduce hardcoded hex colors except for status dots (amber/red/green) — same as existing pattern

---

### Phase 3: Chat Store — Per-Agent Isolation

#### 3a. Update `frontend/src/store/chat.store.ts`

Add a `syncToAgent` helper so messages get saved to the active agent's conversation in `agent.store.ts`:

```ts
// In useChat() hook (frontend/src/hooks/useChat.ts):
// After addMessage() calls, also call:
//   useAgentStore.getState().addMessageToAgent(activeAgentId, message)
//
// When switching agents, restore their messages:
//   clearMessages();
//   for (const msg of agentMessages) { addMessage(msg); }
```

The `useChat` hook should be updated to:
1. Accept an optional `systemPrompt` override (the active agent's prompt)
2. Sync messages to `agent.store` after each `addMessage`
3. On agent switch, clear the chat store and replay the new agent's history

#### 3b. Update LLM call to use agent prompt

In `backend/src/routes/chat.route.ts`, the system prompt is built by `contextService.buildSystemPrompt()`. For the agent system to work, the frontend should send the active agent's `systemPrompt` as part of the request, or the backend should accept an `agentId` parameter and load the appropriate prompt.

**Simplest approach:** Add an optional `agentSystemPrompt` field to the chat request schema:

```ts
// In shared/src/chat.types.ts or backend/src/utils/validate.ts
export const ChatRequestSchema = z.object({
  sessionId: z.string().uuid(),
  messages: z.array(/* ... existing ... */),
  imageBase64: z.string().optional(),
  agentSystemPrompt: z.string().optional(),  // NEW
});
```

Then in `chat.route.ts`, if `agentSystemPrompt` is provided, prepend it to the system prompt:

```ts
const systemPrompt = agentSystemPrompt
  ? `${agentSystemPrompt}\n\n${await contextService.buildSystemPrompt(vaultSnippets)}`
  : await contextService.buildSystemPrompt(vaultSnippets);
```

In the frontend `chat.api.ts`, add the `agentSystemPrompt` field to the payload.

---

### Phase 4: Verification Checklist

After implementing, verify each of these:

- [ ] `npm install` succeeds on Linux (no Windows-only bindings)
- [ ] `npx tsc --noEmit` passes in both `frontend/` and `backend/`
- [ ] Backend starts and `/health` returns 200
- [ ] DeepSeek API key works — send a test message
- [ ] Ollama fallback works — stop Ollama, send a message, see the fallback kick in
- [ ] Vault status in RightPanel shows real note counts (requires Obsidian Local REST API plugin running on `127.0.0.1:27124`)
- [ ] Sidebar shows 4 built-in agents (Chad, Kyle, Karen, Brody)
- [ ] Clicking an agent switches the active agent — chat clears and loads that agent's history
- [ ] "+ New Agent" creates a custom agent with user-defined name/role/prompt
- [ ] Edit prompt saves and persists across page reloads (localStorage)
- [ ] Remove custom agent works (built-in agents cannot be removed)
- [ ] Theme toggle (Matrix ↔ Psychedelic) works correctly on all new UI elements
- [ ] Sidebar psychedelic animation (`psych-layout-breathe`) still triggers on `aside:first-of-type`

---

### File Manifest (all files touched this session + next)

| File | Status | Phase |
|---|---|---|
| `frontend/src/api/vault.api.ts` | ✅ Fixed URLs | — |
| `frontend/src/hooks/useVault.ts` | ✅ Implemented | — |
| `frontend/src/components/layout/RightPanel.tsx` | ✅ Wired to vault | — |
| `frontend/src/components/layout/AppLayout.tsx` | ✅ Fixed theme prop | — |
| `frontend/src/components/WindowManager.tsx` | ✅ Fixed theme prop | — |
| `frontend/package.json` | ✅ Removed win32 binding | — |
| `backend/src/config/index.ts` | 🔜 Add deepseek config | 1a |
| `backend/src/services/deepseek.service.ts` | 🔜 NEW | 1b |
| `backend/src/services/llm.service.ts` | 🔜 NEW | 1c |
| `backend/src/routes/chat.route.ts` | 🔜 Switch to llmService | 1d |
| `.env` | 🔜 Add DEEPSEEK_* vars | 1e |
| `frontend/src/store/agent.store.ts` | 🔜 NEW | 2a |
| `frontend/src/hooks/useAgent.ts` | 🔜 NEW | 2b |
| `frontend/src/components/layout/Sidebar.tsx` | 🔜 Rewrite with agent store | 2c |
| `frontend/src/store/chat.store.ts` | 🔜 Per-agent isolation | 3a |
| `frontend/src/hooks/useChat.ts` | 🔜 Agent prompt + sync | 3a |
| `frontend/src/api/chat.api.ts` | 🔜 Add agentSystemPrompt | 3b |
| `backend/src/utils/validate.ts` | 🔜 Add agentSystemPrompt | 3b |
=======
