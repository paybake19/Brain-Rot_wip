import React from 'react'

const QUICK_ACTIONS = ['Research', 'Code', 'Write', 'Analyze']
const TOOL_PILLS = ['Web Search', 'Deep Research', 'File Analysis', 'Codebase Scan']

const BrainIcon = ({ size = 32 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className="drop-shadow-[0_0_10px_rgb(var(--accent)/0.5)] transition-[filter] duration-700"
  >
    <path
      d="M12 4.5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18.5V4.5Z"
      stroke="rgb(var(--accent))"
      strokeWidth="1.5"
    />
    <path
      d="M12 4.5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18.5V4.5Z"
      stroke="rgb(var(--accent))"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="18.5" r="1.5" fill="rgb(var(--accent))" />
  </svg>
)

type Props = {
  theme: 'default' | 'psychedelic'
}

export default function BootScreen({ theme }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center select-none overflow-hidden">

      {/* 1. BASE RADIANCE (Subtle depth foundation) */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000"
        style={{
          background: 'radial-gradient(circle at center, rgb(var(--accent) / 0.08) 0%, transparent 65%)',
        }}
      />

      {/* ✅ 2. PSYCHEDELIC ENGINE (The "Complete 180") */}
      {theme === 'psychedelic' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-70">

          {/* Layer A: Drifting Organic Color Blobs */}
          <div className="absolute inset-0 animate-[drift-soft_25s_ease-in-out_infinite]">
            <div
              className="absolute inset-0 blur-[120px] opacity-25"
              style={{ background: 'radial-gradient(circle at 35% 35%, rgb(var(--accent)), transparent 55%)' }}
            />
            <div
              className="absolute inset-0 blur-[120px] opacity-25"
              style={{ background: 'radial-gradient(circle at 65% 65%, rgb(var(--accent-2)), transparent 55%)' }}
            />
          </div>

          {/* Layer B: Perspective "Breathing" Tunnel (Depth) */}
          <div
            className="absolute inset-0 opacity-[0.12] animate-[breathe_18s_ease-in-out_infinite]"
            style={{
              background: `repeating-radial-gradient(circle at center, transparent 0, transparent 75px, rgb(var(--accent-3) / 0.15) 78px, transparent 82px)`
            }}
          />

          {/* Layer C: The Mandala Fractal (Rotating Sacred Geometry) */}
          <div className="absolute inset-0 opacity-[0.08] animate-[slow-rotate_80s_linear_infinite]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="mandalaPattern" width="400" height="400" patternUnits="userSpaceOnUse">
                  {/* Outer Interlocking Circles */}
                  <circle cx="200" cy="200" r="190" fill="none" stroke="rgb(var(--accent))" strokeWidth="0.4" strokeDasharray="5 10" />
                  <circle cx="200" cy="200" r="150" fill="none" stroke="rgb(var(--accent-2))" strokeWidth="0.6" />


                  {/* Recursive Petal Logic (Sacred Geometry) */}
                  {[...Array(12)].map((_, i) => (
                    <g key={i} transform={`rotate(${i * 30} 200 200)`}>
                      <ellipse cx="200" cy="110" rx="30" ry="85" fill="none" stroke="rgb(var(--accent-3) / 0.4)" strokeWidth="0.9" />
                      <circle cx="200" cy="40" r="6" fill="rgb(var(--accent-2) / 0.5)" />
                    </g>
                  ))}

                  {/* Central Eye / Singularity */}
                  <circle cx="200" cy="200" r="5" fill="rgb(var(--accent) / 0.05)" />
                  <circle cx="200" cy="200" r="6" fill="rgb(var(--accent-2))" className="animate-pulse" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mandalaPattern)" />
            </svg>
          </div>

          {/* Layer D: Soft Edge Vignette */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgb(var(--bg)) 100%)' }} />
        </div>
      )}

      {/* 3. MAIN CONTENT (Floating Floating UI) */}
      <div className="relative z-10 flex flex-col items-center w-full">

        {/* Floating Icon Ring */}
        <div
          className="mb-8 w-72px h-72px rounded-full flex items-center justify-center relative transition-all duration-700"
          style={{
            border: '1px solid rgb(var(--accent) / 0.2)',
            background: 'rgb(var(--panel) / 0.3)',
            boxShadow: '0 0 40px rgb(var(--accent) / 0.05)',
          }}
        >
          {/* Breathing Rings */}
          <div
            className="absolute rounded-full animate-pulse"
            style={{
              width: '135%', height: '135%',
              border: '1px dashed rgb(var(--accent) / 0.1)',
            }}
          />
          <div
            className="absolute rounded-full opacity-30"
            style={{
              width: '190%', height: '190%',
              border: '1px dotted rgb(var(--accent) / 0.08)',
            }}
          />
          <BrainIcon size={34} />
        </div>

        <h1 className="text-[34px] font-serif mb-2 text-center text-[rgb(var(--text))] transition-colors duration-700 tracking-tight">
          Welcome back.
        </h1>
        <p className="text-[18px] font-serif mb-10 text-center text-[rgb(var(--text)/0.4)] transition-colors duration-700">
          What shall we rot your brain with?
        </p>

        {/* Organic Input Card (High Blur) */}
        <div className="w-full max-w-144 px-6">
          <div
            className="rounded-3xl p-5 backdrop-blur-3xl mb-6 transition-all duration-700"
            style={{
              border: '1px solid rgb(var(--accent) / 0.15)',
              background: 'rgb(var(--panel) / 0.35)',
            }}
          >
            <input
              className="w-full bg-transparent outline-none text-[16px] mb-5 font-light caret-[rgb(var(--accent))] placeholder:text-white/20"
              style={{ color: 'rgb(var(--text))' }}
              placeholder="Ask anything or spawn an agent..."
            />

            <div className="flex items-center gap-2.5 flex-wrap">
              {QUICK_ACTIONS.map(label => (
                <button
                  key={label}
                  className="px-3.5 py-1.5 text-[11px] font-medium rounded-xl transition-all duration-300 hover:bg-white/5 border border-white/5"
                  style={{ color: 'rgb(var(--text) / 0.5)' }}
                >
                  {label}
                </button>
              ))}

              <button
                className="ml-auto w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-transform active:scale-95"
                style={{
                  border: '1px solid rgb(var(--accent) / 0.3)',
                  background: 'rgb(var(--accent) / 0.1)',
                  color: 'rgb(var(--accent))',
                }}
              >
                ↵
              </button>
            </div>
          </div>

          {/* Floating Tool Pills */}
          <div className="flex gap-2.5 justify-center flex-wrap">
            {TOOL_PILLS.map(t => (
              <button
                key={t}
                className="px-4 py-2 text-[11px] font-medium rounded-full transition-all duration-300 cursor-pointer border border-white/5 bg-white/2 backdrop-blur-md"
                style={{ color: 'rgb(var(--accent) / 0.65)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgb(var(--accent) / 0.1)';
                  e.currentTarget.style.color = 'rgb(var(--accent))';
                  e.currentTarget.style.borderColor = 'rgb(var(--accent) / 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'white/[0.02]';
                  e.currentTarget.style.color = 'rgb(var(--accent) / 0.65)';
                  e.currentTarget.style.borderColor = 'white/5';
                }}
              >
                ⊕ {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
