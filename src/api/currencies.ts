import type { Currency } from '@/types'
import { createServerFn } from '@tanstack/react-start'

const getCurrenciesServerFunc = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Currency[]> => {
    const res = await fetch(`${process.env.BASE_URL}/currencies `)
    return res.json()
  },
)

export const fetchCurrenciesOptions = () => {
  return {
    queryKey: ['currencies'],
    queryFn: () => {
      return getCurrenciesServerFunc()
    },
  }
}
