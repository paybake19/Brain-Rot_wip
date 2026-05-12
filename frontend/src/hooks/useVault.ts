import { useState, useEffect, useCallback } from 'react'
import { listNotes, searchVault, readNote, type VaultNote, type VaultSearchResult } from '../api/vault.api'

export interface VaultState {
  notes: string[]
  noteCount: number
  isLoading: boolean
  error: string | null
  searchResults: VaultSearchResult[]
  isSearching: boolean
  selectedNote: VaultNote | null
  isReadingNote: boolean
}

export function useVault() {
  const [state, setState] = useState<VaultState>({
    notes: [],
    noteCount: 0,
    isLoading: true,
    error: null,
    searchResults: [],
    isSearching: false,
    selectedNote: null,
    isReadingNote: false,
  })

  const refreshNotes = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }))
    try {
      const files = await listNotes('')
      setState((s) => ({
        ...s,
        notes: files,
        noteCount: files.length,
        isLoading: false,
      }))
    } catch (err: any) {
      setState((s) => ({
        ...s,
        error: err.message ?? 'Failed to load vault',
        isLoading: false,
      }))
    }
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return
    setState((s) => ({ ...s, isSearching: true }))
    try {
      const results = await searchVault(query)
      setState((s) => ({ ...s, searchResults: results, isSearching: false }))
    } catch (err: any) {
      setState((s) => ({
        ...s,
        error: err.message ?? 'Search failed',
        isSearching: false,
      }))
    }
  }, [])

  const handleReadNote = useCallback(async (notePath: string) => {
    setState((s) => ({ ...s, isReadingNote: true, selectedNote: null }))
    try {
      const note = await readNote(notePath)
      setState((s) => ({ ...s, selectedNote: note, isReadingNote: false }))
    } catch (err: any) {
      setState((s) => ({
        ...s,
        error: err.message ?? 'Failed to read note',
        isReadingNote: false,
      }))
    }
  }, [])

  useEffect(() => {
    refreshNotes()
  }, [refreshNotes])

  return {
    ...state,
    refreshNotes,
    search: handleSearch,
    readNote: handleReadNote,
  }
}
