/**
 * ToolCallBadge — displays when the assistant invokes a tool mid-stream.
 * Renders as a small animated pill with the tool name.
 */
type Props = {
  name: string
}

export default function ToolCallBadge({ name }: Props) {
  return (
    <div className="flex items-center gap-1.5 my-1">
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider"
        style={{
          background: 'rgb(var(--accent) / 0.12)',
          color:      'rgb(var(--accent) / 0.9)',
          border:     '1px solid rgb(var(--accent) / 0.2)',
        }}
      >
        {/* Animated dot indicating active tool call */}
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: 'rgb(var(--accent))' }}
          aria-hidden="true"
        />
        {name}
      </span>
    </div>
  )
}
