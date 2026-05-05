export default function VaultPanel() {
  return (
    <div className="glass p-3 rounded">

      <div className="text-xs text-white/50 mb-2">
        VAULT STATUS
      </div>

      <div className="text-sm text-white/70">
        brain-rot-vault
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-white/60">
        <div>Notes: 1248</div>
        <div>Files: 2531</div>
        <div>Folders: 142</div>
        <div>Status: Healthy</div>
      </div>
    </div>
  )
}
