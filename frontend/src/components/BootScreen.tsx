import React from 'react'

const QUICK_ACTIONS = ['Research', 'Code', 'Write', 'Analyze']
const TOOL_PILLS = ['Web Search', 'Deep Research', 'File Analysis', 'Codebase Scan']

const BrainIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="glow-neon transition-[filter] duration-700">
    <path d="M12 4.5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18.5V4.5Z" stroke="rgb(var(--accent))" strokeWidth="1.5" />
    <path d="M12 4.5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18.5V4.5Z" stroke="rgb(var(--accent))" strokeWidth="1.5" />
    <circle cx="12" cy="18.5" r="1.5" fill="rgb(var(--accent))" className="animate-pulse" />
  </svg>
)

type Props = {
  theme: 'default' | 'psychedelic'
}

export default function BootScreen({ theme }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center select-none overflow-hidden">

      {/* 1. BASE RADIANCE */}
      <div className="absolute inset-0 pointer-events-none transition-colors duration-1000" style={{ background: 'radial-gradient(circle at center, rgb(var(--accent) / 0.08) 0%, transparent 65%)' }} />

      {/* 2. PSYCHEDELIC ENGINE */}
      {theme === 'psychedelic' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-70">
          <div className="absolute inset-0 animate-[drift-soft_25s_ease-in-out_infinite]">
            <div className="absolute inset-0 blur-[120px] opacity-25" style={{ background: 'radial-gradient(circle at 35% 35%, rgb(var(--accent)), transparent 55%)' }} />
            <div className="absolute inset-0 blur-[120px] opacity-25" style={{ background: 'radial-gradient(circle at 65% 65%, rgb(var(--accent-2)), transparent 55%)' }} />
          </div>

          <div className="absolute inset-0 opacity-[0.12] animate-[breathe_18s_ease-in-out_infinite]" style={{ background: `repeating-radial-gradient(circle at center, transparent 0, transparent 75px, rgb(var(--accent-3) / 0.15) 78px, transparent 82px)` }} />

          <div className="absolute inset-0 opacity-[0.08] animate-[slow-rotate_80s_linear_infinite]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="mandalaPattern" width="400" height="400" patternUnits="userSpaceOnUse">
                  <circle cx="200" cy="200" r="190" fill="none" stroke="rgb(var(--accent))" strokeWidth="0.4" strokeDasharray="5 10" />
                  <circle cx="200" cy="200" r="150" fill="none" stroke="rgb(var(--accent-2))" strokeWidth="0.6" />
                  {[...Array(12)].map((_, i) => (
                    <g key={i} transform={`rotate(${i * 30} 200 200)`}>
                      <ellipse cx="200" cy="110" rx="30" ry="85" fill="none" stroke="rgb(var(--accent-3) / 0.4)" strokeWidth="0.9" />
                      <circle cx="200" cy="40" r="6" fill="rgb(var(--accent-2) / 0.5)" />
                    </g>
                  ))}
                  <circle cx="200" cy="200" r="5" fill="rgb(var(--accent) / 0.05)" />
                  <circle cx="200" cy="200" r="6" fill="rgb(var(--accent-2))" className="animate-pulse" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mandalaPattern)" />
            </svg>
          </div>

          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgb(var(--bg)) 100%)' }} />
        </div>
      )}

      {/* 3. MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center w-full">

        <div className="mb-8 w-[72px] h-[72px] rounded-full flex items-center justify-center relative glass-strong glow-neon transition-all duration-700">
          <div className="absolute rounded-full animate-pulse border border-dashed border-[rgb(var(--accent)/0.2)]" style={{ width: '135%', height: '135%' }} />
          <div className="absolute rounded-full opacity-30 border border-dotted border-[rgb(var(--accent)/0.15)]" style={{ width: '190%', height: '190%' }} />
          <BrainIcon size={34} />
        </div>

        <h1 className="text-[34px] font-serif mb-2 text-center text-neon transition-colors duration-700 tracking-tight">
          Welcome back.
        </h1>
        <p className="text-[18px] font-serif mb-10 text-center text-[rgb(var(--text)/0.4)] transition-colors duration-700">
          What shall we rot your brain with?
        </p>

        <div className="w-full max-w-2xl px-6">
          <div className="rounded-3xl p-5 mb-6 transition-all duration-700 glass-strong glow-neon focus-within:shadow-[0_0_40px_rgb(var(--accent)/0.15)]">
            <input className="input text-[16px] mb-5 font-light" placeholder="Ask anything or spawn an agent..." />

            <div className="flex items-center gap-2.5 flex-wrap">
              {QUICK_ACTIONS.map(label => (
                <button key={label} className="btn glass hover-glow !py-1.5 px-3.5 !rounded-xl text-[11px] border-[rgb(var(--text)/0.05)]">
                  {label}
                </button>
              ))}
              <button className="ml-auto w-9 h-9 flex items-center justify-center rounded-xl btn-accent hover-glow text-lg">
                ↵
              </button>
            </div>
          </div>

          <div className="flex gap-2.5 justify-center flex-wrap">
            {TOOL_PILLS.map(t => (
              <button key={t} className="btn glass hover-glow rounded-full px-4 py-2 text-[11px] font-medium text-[rgb(var(--accent))] border-[rgb(var(--text)/0.05)]">
                ⊕ {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
