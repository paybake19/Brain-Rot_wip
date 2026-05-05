export default function VoiceWaveform() {
  return (
    <div className="flex items-center gap-2px h-10">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="w-2px bg-green-400/60 animate-pulse"
          style={{
            height: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
    </div>
  )
}
