// Zustand global store for all chat state

import { create } from 'zustand'
import { Message } from '@brainrot/shared'

interface ChatState {
  messages: Message[]
  isStreaming: boolean
  sessionId: string
  // SUDO: add addMessage(message: Message): void
  // SUDO: add appendToken(id: string, token: string): void — for streaming
  // SUDO: add setStreaming(value: boolean): void
  // SUDO: add clearSession(): void — resets messages, generates new sessionId
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  sessionId: crypto.randomUUID(),
  // SUDO: implement all actions above using set()
}))
