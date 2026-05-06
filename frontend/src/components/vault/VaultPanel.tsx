export default function VaultPanel() {
  return (
    <div className="glass-strong p-4 rounded-xl border border-[rgb(var(--accent)/0.3)] glow-neon">
      <div className="text-[10px] font-bold text-[rgb(var(--accent-2))] uppercase tracking-widest mb-2 text-neon">
        SYSTEM REPOSITORY
      </div>
      <div className="text-[14px] font-bold text-gradient uppercase tracking-wide">
        MSS-ARCHIVE-NODE
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] font-bold text-[rgb(var(--text)/0.8)] uppercase tracking-wider">
        <div className="hover-glow p-2 rounded glass">Notes: 1.2K</div>
        <div className="hover-glow p-2 rounded glass">Files: 2.5K</div>
        <div className="hover-glow p-2 rounded glass">Media: 142</div>
        <div className="hover-glow p-2 rounded glass text-[rgb(var(--accent-2))] text-neon">Status: OPTIMAL</div>
      </div>
    </div>
  )
}
