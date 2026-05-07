import React from 'react'

type Props = {
  tilingEnabled: boolean
  onToggleTiling: () => void
  theme: 'default' | 'psychedelic'
  onToggleTheme: () => void
}

const BrainIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="glow-neon transition-[filter] duration-700">
    <path d="M12 4.5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18.5V4.5Z" stroke="rgb(var(--accent))" strokeWidth="1.5" />
    <path d="M12 4.5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18.5V4.5Z" stroke="rgb(var(--accent))" strokeWidth="1.5" />
  </svg>
)

function ProgressMetric({ label, display, pct, danger = false }: { label: string, display: string, pct: number, danger?: boolean }) {
  return (
    <div className="flex flex-col gap-1 w-30">
      <div className="flex justify-between text-[10px]">
        <span className="text-[rgb(var(--text)/0.4)]">{label}</span>
        <span className="transition-colors duration-700 font-medium" style={{ color: danger ? '#f87171' : 'rgb(var(--accent-2))' }}>
          {display}
        </span>
      </div>
      <div className="w-full h-1 rounded-full overflow-hidden bg-[rgb(var(--panel))] border border-[rgb(var(--text)/0.05)]">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: danger ? '#f87171' : 'rgb(var(--accent))' }} />
      </div>
    </div>
  )
}

export default function Topbar({ tilingEnabled, onToggleTiling, theme, onToggleTheme }: Props) {
  return (
    <header className="h-11.5 flex items-center justify-between px-4 glass shrink-0 transition-colors duration-700 z-50">

      {/* LEFT — logo + title */}
      <div className="flex items-center gap-2.5 shrink-0 hover-glow cursor-pointer">
        <BrainIcon size={24} />
        <span className="text-[rgb(var(--accent))] text-neon font-semibold text-[15px] transition-colors duration-700">
          Brain Rot
        </span>
      </div>

      {/* CENTER — metrics + generate report */}
      <div className="flex items-center gap-6 flex-1 pl-12">
        <ProgressMetric label="Context" display="73%" pct={73} />
        <ProgressMetric label="Token Usage" display="128K / 200K" pct={64} danger />

        <button className="btn btn-accent hover-glow">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="mr-1.5">
            <rect x="1" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.1"/>
            <path d="M3 3.5h5M3 5.5h5M3 7.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          Create Report
        </button>
      </div>

      {/* RIGHT — time, stats, controls */}
      <div className="flex items-center gap-3 text-[11px] shrink-0">
        <span className="text-[rgb(var(--text)/0.4)] font-medium tabular-nums">22:48</span>
        <div className="w-px h-3.5 bg-[rgb(var(--text)/0.1)]" />
        <span className="text-[rgb(var(--text)/0.4)]">🌡 25°C</span>

        {/* Battery */}
        <div className="flex items-center gap-1 hover-glow">
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <rect x="0.5" y="0.5" width="13" height="9" rx="2" stroke="rgb(var(--text)/0.4)" strokeWidth="1"/>
            <rect x="2" y="2" width="7" height="6" rx="1" fill="rgb(var(--accent))"/>
            <path d="M14 3.5v3" stroke="rgb(var(--text)/0.4)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="text-[rgb(var(--text)/0.4)]">43%</span>
        </div>

        <div className="w-px h-3.5 bg-[rgb(var(--text)/0.1)]" />

        {/* Combined Theme Toggle / Indicator */}
                <button
                  onClick={onToggleTheme}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1.25 cursor-pointer transition-all duration-700 active:scale-95 ${
                    theme === 'psychedelic'
                      ? 'psych-glass-strong border-[rgb(var(--accent-4)/0.5)] hover:border-[rgb(var(--accent-4))] hover:shadow-[0_0_15px_rgb(var(--accent-4)/0.4)]'
                      : 'glass-strong border border-[rgb(var(--accent)/0.2)] hover-glow'
                  }`}
                >
                  <span className="text-[10px]">{theme === 'psychedelic' ? '👁' : '🧠'}</span>
                  <span className={`text-[10px] transition-colors duration-700 ${theme === 'psychedelic' ? 'psych-text-neon uppercase tracking-widest font-bold' : 'text-[rgb(var(--text)/0.6)] font-medium'}`}>
                    {theme === 'psychedelic' ? 'Net of Being' : 'Matrix'}
                  </span>
                </button>



        <button onClick={onToggleTiling} className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium rounded-lg transition-colors duration-700 ${tilingEnabled ? 'btn-accent glow-neon' : 'btn glass hover-glow'}`}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <rect x="0.5" y="0.5" width="4.5" height="4.5" rx="1" stroke="currentColor"/>
            <rect x="6"   y="0.5" width="4.5" height="4.5" rx="1" stroke="currentColor"/>
            <rect x="0.5" y="6"   width="4.5" height="4.5" rx="1" stroke="currentColor"/>
            <rect x="6"   y="6"   width="4.5" height="4.5" rx="1" stroke="currentColor"/>
          </svg>
          {tilingEnabled ? 'Tiling On' : 'Tiling'}
        </button>
      </div>
    </header>
  )
}
