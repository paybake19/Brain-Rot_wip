<<<<<<< HEAD
# 🧠 Brain Rot [WIP]

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

This isn’t just a UI.

It’s the beginning of a **personal intelligence layer**.
=======
