import type { CurrencyOption } from '@/utils/currency'
import { create } from 'zustand'

type CurrencyStore = {
  send: CurrencyOption | null
  receive: CurrencyOption | null
  amount: number
  setSend: (currency: CurrencyOption) => void
  setReceive: (currency: CurrencyOption) => void
  setAmount: (amount: number) => void
  swapCurrencies: () => void
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  send: null,
  receive: null,
  amount: 1000,

  setSend: (currency) => set({ send: currency }),
  setReceive: (currency) => set({ receive: currency }),
  setAmount: (amount) => set({ amount }),
  swapCurrencies: () =>
    set((state) => ({ send: state.receive, receive: state.send })),
}))
