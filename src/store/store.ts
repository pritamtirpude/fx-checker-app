import type { CurrencyOption } from '@/utils/currency'
import { create } from 'zustand'

type CurrencyStore = {
  send: CurrencyOption | null
  receive: CurrencyOption | null
  setSend: (currency: CurrencyOption) => void
  setReceive: (currency: CurrencyOption) => void
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  send: null,
  receive: null,

  setSend: (currency) => set({ send: currency }),
  setReceive: (currency) => set({ receive: currency }),
}))
