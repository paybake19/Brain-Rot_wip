import { useState, useEffect } from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'
import StatusBar from './StatusBar'
import WindowManager from '../WindowManager'
import ChatWindow from '../chat/ChatWindow'

export default function AppLayout() {
  const [tilingEnabled, setTilingEnabled] = useState(false)
  const [theme, setTheme] = useState<'default' | 'psychedelic'>('default')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'default') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'default' ? 'psychedelic' : 'default'))
  }

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-[rgb(var(--bg))] text-[rgb(var(--text))] transition-colors duration-700">
      <Topbar
        tilingEnabled={tilingEnabled}
        onToggleTiling={() => setTilingEnabled(t => !t)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar />

        <main className="flex-1 relative overflow-hidden bg-dot-pattern flex flex-col">
          {tilingEnabled ? <WindowManager theme={theme} /> : <ChatWindow theme={theme} />}
        </main>

        <RightPanel />
      </div>

      <StatusBar />
    </div>
  )
}
