import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// SSR-safe storage: on the server `localStorage` doesn't exist, so rehydration
// falls back to a no-op storage and simply yields an empty log (matching what
// the server rendered) until the client re-hydrates for real.
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

export type LogEntry = {
  id: string
  base: string
  quote: string
  amount: number
  converted: number
  rate: number
  timestamp: number
}

type NewLogEntry = Omit<LogEntry, 'id' | 'timestamp'>

// Two entries are "the same conversion" when everything the row displays
// matches. Re-logging an identical conversion bumps the existing row instead
// of stacking a second copy; a later log of the same pair/amount at a *different*
// rate still earns its own row, since that's a genuinely new data point.
const isSameConversion = (log: LogEntry, entry: NewLogEntry) =>
  log.base === entry.base &&
  log.quote === entry.quote &&
  log.amount === entry.amount &&
  log.converted === entry.converted

type LogStore = {
  logs: LogEntry[]
  hasHydrated: boolean
  addLog: (entry: NewLogEntry) => void
  removeLog: (id: string) => void
  clearLogs: () => void
  setHasHydrated: (hasHydrated: boolean) => void
}

export const useLogStore = create<LogStore>()(
  persist(
    (set) => ({
      logs: [],
      hasHydrated: false,

      addLog: (entry) =>
        set((state) => {
          const existing = state.logs.find((log) =>
            isSameConversion(log, entry),
          )

          // Already logged: move it back to the top with a fresh timestamp
          // rather than adding a duplicate row.
          if (existing) {
            return {
              logs: [
                { ...existing, timestamp: Date.now() },
                ...state.logs.filter((log) => log.id !== existing.id),
              ],
            }
          }

          return {
            logs: [
              {
                ...entry,
                id: crypto.randomUUID(),
                timestamp: Date.now(),
              },
              ...state.logs,
            ],
          }
        }),
      removeLog: (id) =>
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== id),
        })),
      clearLogs: () => set({ logs: [] }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'fx-conversion-log',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : noopStorage,
      ),
      partialize: (state) => ({ logs: state.logs }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)
