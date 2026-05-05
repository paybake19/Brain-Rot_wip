import { useState } from "react"

export default function VoiceButton() {
  const [active, setActive] = useState(false)

  return (
    <button
      onClick={() => setActive(!active)}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition
        ${active
          ? "bg-green-500/20 text-green-400 glow"
          : "bg-white/10 text-white/70"}
      `}
    >
      🎤
    </button>
  )
}
