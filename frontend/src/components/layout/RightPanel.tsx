const TASKS = [
  { id: 1, title: 'Research LLM memory techniques', agent: 'Orion', status: 'active',  pct: 62 },
  { id: 2, title: 'Analyze codebase structure',     agent: 'Nyx',   status: 'active',  pct: 38 },
  { id: 3, title: 'Process data pipeline logs',     agent: 'Astra', status: 'active',  pct: 71 },
  { id: 4, title: 'Write blog draft: AI agents',    agent: 'Nova',  status: 'queued',  pct: 0  },
  { id: 5, title: 'Organize meeting notes',         agent: 'Echo',  status: 'waiting', pct: 0  },
]

const VAULT_STATS = [['Notes', '1,248'], ['Files', '2,531'], ['Folders', '142']]
const VAULT_META  = [
  ['Attachments', '1.2 GB', ''],
  ['Daily Sync',  '21m ago', ''],
  ['Status',      'Healthy',  'accent'],
]

function TaskRow({ title, agent, status, pct }: typeof TASKS[0]) {
  return (
    <div className="flex items-start gap-3 px-2.5 py-2.5 rounded-xl glass hover-glow transition-all duration-300 group cursor-default mb-1">
      <div className="w-7 h-7 rounded-full border border-[rgb(var(--text)/0.08)] bg-[rgb(var(--text)/0.03)] flex items-center justify-center text-[10px] font-medium text-[rgb(var(--text)/0.4)] shrink-0 mt-px">
        {agent.slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-medium leading-snug text-[rgb(var(--text)/0.85)]">
          {title}
        </div>
        <div className="text-[10px] text-[rgb(var(--text)/0.3)] mt-.75">{agent}</div>
        {status === 'active' && (
          <div className="flex items-center gap-2 mt-2">
            <div className="h-.75 flex-1 bg-[rgb(var(--text)/0.06)] rounded-full overflow-hidden">
              <div className="h-full bg-[rgb(var(--accent))] rounded-full transition-all duration-700 shadow-[0_0_8px_rgb(var(--accent))]" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[9px] text-[rgb(var(--text)/0.4)] tabular-nums shrink-0">{pct}%</span>
          </div>
        )}
        {status === 'queued'  && <span className="text-[10px] text-amber-400/60 mt-1 block">Queued</span>}
        {status === 'waiting' && <span className="text-[10px] text-[rgb(var(--text)/0.2)] mt-1 block">Waiting</span>}
      </div>
      <button className="text-[rgb(var(--text)/0.2)] hover:text-[rgb(var(--text)/0.6)] opacity-0 group-hover:opacity-100 transition-all text-lg leading-none shrink-0 px-1 cursor-pointer">
        ⋯
      </button>
    </div>
  )
}

export default function RightPanel() {
  return (
    <aside className="w-[320px] shrink-0 flex flex-col border-l border-[rgb(var(--text)/0.04)] glass overflow-hidden transition-colors duration-700 z-40">

      <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
        <span className="text-[10px] font-semibold text-[rgb(var(--text)/0.4)] uppercase tracking-widest">
          Active Tasks
        </span>
        <button className="btn hover-glow py-1 px-2 text-[10px]">
          View All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-.5">
        {TASKS.map(t => <TaskRow key={t.id} {...t} />)}
      </div>

      <div className="border-t border-[rgb(var(--text)/0.04)] shrink-0 mt-2">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <span className="text-[10px] font-semibold text-[rgb(var(--text)/0.4)] uppercase tracking-widest">
            Vault Status
          </span>
          <div className="flex items-center gap-1.5 text-[10px] text-[rgb(var(--accent))] font-medium transition-colors duration-700">
            <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent))] shadow-[0_0_6px_rgb(var(--accent)/0.6)] animate-pulse" />
            Connected
            <span className="text-[rgb(var(--accent)/0.5)] ml-0.5">▾</span>
          </div>
        </div>

        <div className="mx-3 mb-3 p-3 glass-strong rounded-xl glow-neon transition-colors duration-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[rgb(var(--accent)/0.08)] border border-[rgb(var(--accent)/0.15)] flex items-center justify-center shrink-0 hover-glow transition-all duration-700">
              <svg width="18" height="18" viewBox="0 0 17 17" fill="none">
                <path d="M8.5 1.5L2 5.5v6l6.5 4 6.5-4v-6L8.5 1.5z" stroke="rgb(var(--accent))" strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M8.5 1.5v10M2 5.5l6.5 4 6.5-4" stroke="rgb(var(--accent))" strokeWidth="1.1" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] text-[rgb(var(--text)/0.3)] uppercase tracking-wider mb-1">
                Obsidian Vault
              </div>
              <div className="text-[12px] font-semibold truncate text-[rgb(var(--text)/0.9)]">
                brain-rot-vault
              </div>
              <div className="text-[10px] text-[rgb(var(--text)/0.3)] mt-.5 font-mono truncate">
                ~/Brain/R0t/
              </div>
            </div>
            <button className="btn hover-glow py-1.5 px-2 text-[10px]">
              Change
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center mb-3">
            {VAULT_STATS.map(([l, v]) => (
              <div key={l} className="glass rounded-lg py-2 transition-all hover-glow">
                <div className="text-[9px] text-[rgb(var(--text)/0.4)] mb-1">{l}</div>
                <div className="text-[13px] font-semibold text-[rgb(var(--text)/0.85)]">{v}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center mb-4">
            {VAULT_META.map(([l, v, c]) => (
              <div key={l}>
                <div className="text-[9px] text-[rgb(var(--text)/0.4)] mb-1">{l}</div>
                <div className="text-[11px] font-medium transition-colors duration-700" style={{ color: c === 'accent' ? 'rgb(var(--accent))' : 'rgb(var(--text) / 0.6)' }}>
                  {v}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button className="flex-1 btn btn-accent hover-glow py-2">
              <svg width="12" height="12" viewBox="0 0 11 11" fill="none" className="mr-1.5">
                <path d="M9.5 5.5a4 4 0 11-1.2-2.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M9.5 2v3.5H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sync Now
            </button>
            <button className="w-9 h-9 btn hover-glow flex items-center justify-center p-0">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
