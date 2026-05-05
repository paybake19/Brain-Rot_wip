import { useState } from 'react'

const AGENTS = [
  { id: 1, name: 'Orion',  role: 'Research Assistant', status: 'online',   initials: 'Or' },
  { id: 2, name: 'Nyx',   role: 'Code Analyst',        status: 'thinking', initials: 'Nx' },
  { id: 3, name: 'Astra', role: 'Data Engineer',       status: 'idle',     initials: 'As' },
  { id: 4, name: 'Nova',  role: 'Creative Writer',     status: 'idle',     initials: 'Nv' },
  { id: 5, name: 'Echo',  role: 'Task Manager',        status: 'offline',  initials: 'Ec' },
]

// Status dot: accent-driven for online, amber for thinking, muted for rest
const STATUS_DOT: Record<string, string> = {
  online:   'bg-[rgb(var(--accent))] shadow-[0_0_6px_rgb(var(--accent)/0.6)]',
  thinking: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]',
  idle:     'bg-[rgb(var(--text)/0.25)]',
  offline:  'border border-[rgb(var(--text)/0.2)] bg-transparent',
}

const STATUS_LABEL: Record<string, string> = {
  online:   'text-[rgb(var(--accent))]',
  thinking: 'text-amber-400',
  idle:     'text-[rgb(var(--text)/0.3)]',
  offline:  'text-[rgb(var(--text)/0.2)]',
}

const MODES = [
  {
    id: 'chat', label: 'Chat',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M2 2.5a.5.5 0 01.5-.5h10a.5.5 0 01.5.5v7a.5.5 0 01-.5.5H5l-3 2.5V2.5z"
          stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'voice', label: 'Voice',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="5" y="1" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M2.5 8a5 5 0 0010 0M7.5 13v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'listen', label: 'Listen',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M1 7.5C1 4 4 1 7.5 1S14 4 14 7.5c0 2-1 3.8-2.5 5v2H11v-2"
          stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M4 8.5C4 6.6 5.6 5 7.5 5S11 6.6 11 8.5"
          stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'focus', label: 'Focus',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="6"   stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="7.5" cy="7.5" r="0.8" fill="currentColor"/>
      </svg>
    ),
  },
]

const NAV_ICONS = [
  // Grid
  <svg key="grid" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1"/>
    <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1"/>
    <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1"/>
    <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1"/>
  </svg>,
  // Chart
  <svg key="chart" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 9.5l3-4 2.5 3L10 5l2 4.5"
      stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  // Settings
  <svg key="settings" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.1"/>
    <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.1"/>
  </svg>,
]

export default function Sidebar() {
  const [activeAgent, setActiveAgent] = useState(1)
  const [activeMode, setActiveMode]   = useState('chat')

  return (
    <aside className="w-79.25 shrink-0 flex flex-col border-r border-[rgb(var(--text)/0.04)] bg-[rgb(var(--bg)/0.4)] overflow-hidden transition-colors duration-700">

      {/* Agents header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
        <span className="text-[10px] font-semibold text-[rgb(var(--text)/0.4)] uppercase tracking-widest">
          Agents
        </span>
        <button className="text-[rgb(var(--accent))] text-[10px] font-medium hover:opacity-70 transition-opacity">
          + New Agent
        </button>
      </div>

      {/* Agent list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-.75 pb-2">
        {AGENTS.map(agent => (
          <button
            key={agent.id}
            onClick={() => setActiveAgent(agent.id)}
            className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-all duration-200 border ${
              activeAgent === agent.id
                ? 'bg-[rgb(var(--text)/0.04)] border-[rgb(var(--text)/0.08)]'
                : 'border-transparent hover:bg-[rgb(var(--text)/0.02)]'
            }`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 border transition-all duration-700 ${
              activeAgent === agent.id
                ? 'border-[rgb(var(--accent)/0.4)] text-[rgb(var(--accent))] bg-[rgb(var(--accent)/0.1)] shadow-[inset_0_0_10px_rgb(var(--accent)/0.1)]'
                : 'border-[rgb(var(--text)/0.08)] text-[rgb(var(--text)/0.4)] bg-[rgb(var(--text)/0.02)]'
            }`}>
              {agent.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-[rgb(var(--text)/0.8)] leading-none">
                {agent.name}
              </div>
              <div className="text-[10px] text-[rgb(var(--text)/0.3)] mt-1.25 truncate">
                {agent.role}
              </div>
              <div className="flex items-center gap-1.5 mt-1.25">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${STATUS_DOT[agent.status]}`} />
                <span className={`text-[9px] capitalize transition-colors duration-700 ${STATUS_LABEL[agent.status]}`}>
                  {agent.status}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Nav icon strip */}
      <div className="border-t border-[rgb(var(--text)/0.04)] px-3 py-3 flex items-center justify-around shrink-0">
        {NAV_ICONS.map((icon, i) => (
          <button
            key={i}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[rgb(var(--text)/0.3)] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--text)/0.04)] transition-colors duration-200"
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Modes */}
      <div className="border-t border-[rgb(var(--text)/0.04)] p-3 shrink-0">
        <div className="text-[10px] font-semibold text-[rgb(var(--text)/0.4)] uppercase tracking-widest px-1 mb-3">
          Modes
        </div>
        <div className="grid grid-cols-2 gap-2">
          {MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex flex-col items-center gap-2 py-3 rounded-xl text-[10px] font-medium transition-all duration-200 border ${
                activeMode === mode.id
                  ? 'bg-[rgb(var(--accent)/0.1)] text-[rgb(var(--accent))] border-[rgb(var(--accent)/0.3)] shadow-[inset_0_0_12px_rgb(var(--accent)/0.05)]'
                  : 'text-[rgb(var(--text)/0.3)] border-[rgb(var(--text)/0.04)] bg-[rgb(var(--text)/0.01)] hover:bg-[rgb(var(--text)/0.04)] hover:text-[rgb(var(--text)/0.6)] hover:border-[rgb(var(--text)/0.08)]'
              }`}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>
      </div>

    </aside>
  )
}
