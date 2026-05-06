import { useState } from 'react'

/**
 * CodeBlock — syntax-highlighted code block for chat messages.
 * Fully themed via CSS vars — works in both default (green) and psychedelic (violet) themes.
 *
 * Usage:
 *   <CodeBlock language="typescript" code={`const x = 1`} />
 */
type Props = {
  language?: string
  code: string
}

export default function CodeBlock({ language = 'code', code }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="rounded-xl overflow-hidden my-2 text-[12px] transition-all duration-700"
      style={{
        background: 'rgb(var(--bg) / 0.8)',
        border:     '1px solid rgb(var(--text) / 0.07)',
        boxShadow:  '0 0 0 1px rgb(var(--accent) / 0.04)',
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{
          borderColor: 'rgb(var(--text) / 0.06)',
          background:  'rgb(var(--panel) / 0.6)',
        }}
      >
        <span
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'rgb(var(--accent) / 0.7)' }}
        >
          {language}
        </span>

        <button
          onClick={handleCopy}
          className="text-[10px] font-medium transition-all duration-200 px-2 py-1 rounded-md"
          style={{
            color:       copied ? 'rgb(var(--accent))' : 'rgb(var(--text) / 0.35)',
            background:  copied ? 'rgb(var(--accent) / 0.1)' : 'transparent',
            border:      copied ? '1px solid rgb(var(--accent) / 0.2)' : '1px solid transparent',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Code area */}
      <pre
        className="overflow-x-auto p-4 leading-relaxed font-mono"
        style={{ color: 'rgb(var(--text) / 0.85)' }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}
