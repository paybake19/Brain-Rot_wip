import { useState, useRef } from "react"
import ChatWindow from "./chat/ChatWindow"

type Win = {
  id: number
  type: "chat"
  x: number
  y: number
  w: number
  h: number
}

type SnapZone = "left" | "right" | "top" | "fullscreen" | null

export default function WindowManager() {
  const [windows, setWindows] = useState<Win[]>([
    { id: 1, type: "chat", x: 260, y: 140, w: 520, h: 420 }
  ])

  const [activeId, setActiveId] = useState<number | null>(1)
  const [snapZone, setSnapZone] = useState<SnapZone>(null)

  const dragRef = useRef<any>(null)

  const SNAP_THRESHOLD = 80

  const detectSnap = (x: number, y: number): SnapZone => {
    const width = window.innerWidth
    const height = window.innerHeight

    if (y < SNAP_THRESHOLD) return "fullscreen"
    if (x < SNAP_THRESHOLD) return "left"
    if (x > width - SNAP_THRESHOLD) return "right"

    return null
  }

  const applySnap = (zone: SnapZone) => {
    if (!zone || !dragRef.current) return

    const width = window.innerWidth
    const height = window.innerHeight

    setWindows(prev =>
      prev.map(w => {
        if (w.id !== dragRef.current.id) return w

        if (zone === "left") {
          return { ...w, x: 0, y: 0, w: width / 2, h: height }
        }

        if (zone === "right") {
          return { ...w, x: width / 2, y: 0, w: width / 2, h: height }
        }

        if (zone === "fullscreen") {
          return { ...w, x: 0, y: 0, w: width, h: height }
        }

        return w
      })
    )
  }

  const onMouseDown = (e: any, id: number) => {
    const win = windows.find(w => w.id === id)
    if (!win) return

    dragRef.current = {
      id,
      offsetX: e.clientX - win.x,
      offsetY: e.clientY - win.y
    }

    setActiveId(id)
  }

  const onMouseMove = (e: any) => {
    if (!dragRef.current) return

    const zone = detectSnap(e.clientX, e.clientY)
    setSnapZone(zone)

    setWindows(prev =>
      prev.map(w =>
        w.id === dragRef.current.id
          ? {
              ...w,
              x: e.clientX - dragRef.current.offsetX,
              y: e.clientY - dragRef.current.offsetY
            }
          : w
      )
    )
  }

  const onMouseUp = () => {
    if (snapZone) applySnap(snapZone)

    dragRef.current = null
    setSnapZone(null)
  }

  return (
    <div
      className="absolute inset-0"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* SNAP PREVIEW */}
      {snapZone && (
        <div
          className="absolute bg-green-500/10 border border-green-400/30 backdrop-blur-md z-50 pointer-events-none"
          style={{
            left:
              snapZone === "left"
                ? 0
                : snapZone === "right"
                ? window.innerWidth / 2
                : 0,
            top: 0,
            width:
              snapZone === "left" || snapZone === "right"
                ? window.innerWidth / 2
                : window.innerWidth,
            height: window.innerHeight
          }}
        />
      )}

      {windows.map(w => (
        <div
          key={w.id}
          onMouseDown={() => setActiveId(w.id)}
          className={`absolute rounded-xl overflow-hidden transition-all duration-200
            ${w.id === activeId
              ? "glass-strong glow border-white/20 z-20"
              : "glass border-white/5 opacity-80 z-10"}
          `}
          style={{
            left: w.x,
            top: w.y,
            width: w.w,
            height: w.h
          }}
        >
          {/* HEADER */}
          <div
            onMouseDown={(e) => onMouseDown(e, w.id)}
            className="h-8 flex items-center justify-between px-3 border-b border-white/10 text-xs cursor-move bg-black/20"
          >
            <span className="uppercase tracking-wide text-white/60">
              {w.type}
            </span>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <div className="w-3 h-3 rounded-full bg-green-400/70" />
            </div>
          </div>

          {/* CONTENT */}
          <div className="h-[calc(100%-32px)] overflow-auto">
            <ChatWindow />
          </div>

          {/* RESIZE HANDLE (visual only for now) */}
          <div className="absolute bottom-1 right-1 text-white/30 text-xs">
            ⤡
          </div>
        </div>
      ))}
    </div>
  )
}
