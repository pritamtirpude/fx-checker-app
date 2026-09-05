import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// SSR-safe storage: on the server `localStorage` doesn't exist, so rehydration
// falls back to a no-op storage and simply yields an empty favorites list
// (matching what the server rendered) until the client re-hydrates for real.
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

// Favorites are keyed by base+quote (not quote alone) — the base currency can
// change (swap button, URL `base` param), and e.g. "USD → EUR" and
// "INR → EUR" are different pairs that should be favoritable independently.
export const toFavoriteKey = (base: string, quote: string) => `${base}_${quote}`

export const fromFavoriteKey = (key: string) => {
  const [base, quote] = key.split('_')
  return { base, quote }
}

type FavoritesStore = {
  favorites: string[]
  hasHydrated: boolean
  isFavorite: (base: string, quote: string) => boolean
  toggleFavorite: (base: string, quote: string) => void
  setHasHydrated: (hasHydrated: boolean) => void
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      hasHydrated: false,

      isFavorite: (base, quote) =>
        get().favorites.includes(toFavoriteKey(base, quote)),
      toggleFavorite: (base, quote) => {
        const key = toFavoriteKey(base, quote)
        set((state) => ({
          favorites: state.favorites.includes(key)
            ? state.favorites.filter((existing) => existing !== key)
            : [...state.favorites, key],
        }))
      },
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'fx-favorites',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : noopStorage,
      ),
      partialize: (state) => ({ favorites: state.favorites }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)
