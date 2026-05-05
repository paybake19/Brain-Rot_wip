import VoiceButton from "./VoiceButton"
import VoiceWaveform from "./VoiceWaveform"

export default function VoiceStatusBar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 glass border-t border-white/10">

      <VoiceButton />

      <VoiceWaveform />

      <div className="text-xs text-white/50">
        Listening...
      </div>

    </div>
  )
}
