export default function StatusBar() {
  return (
    <footer className="h-6.5 flex items-center gap-3 px-5 border-t border-[rgb(var(--text)/0.04)] glass shrink-0 transition-colors duration-700 z-50">
      <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent))] shadow-[0_0_6px_rgb(var(--accent)/0.6)] animate-pulse transition-colors duration-700" />
      <span className="text-[10px] text-[rgb(var(--text)/0.4)] tracking-wide font-medium">
        Ready · 3 agents active · Vault synced 21m ago
      </span>
      <div className="ml-auto flex items-center gap-3 text-[10px] font-mono text-[rgb(var(--text)/0.3)]">
        <span>Brain Rot v0.1</span>
      </div>
    </footer>
  )
}
