import type { Rates } from '@/types'
import { SUPPORTED_CURRENCY_CODES } from '@/utils/currency'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

const quotesFor = (base: string) =>
  SUPPORTED_CURRENCY_CODES.filter((code) => code !== base).join(',')

const getLiveRatesServerFunc = createServerFn({ method: 'GET' })
  .validator((base: string) => base)
  .handler(async ({ data: base }): Promise<Rates> => {
    const res = await fetch(
      `${process.env.BASE_URL}/rates?base=${base}&quotes=${quotesFor(base)}`,
    )
    return res.json()
  })

const getYesterdayRatesServerFunc = createServerFn({ method: 'GET' })
  .validator((base: string) => base)
  .handler(async ({ data: base }): Promise<Rates> => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const res = await fetch(
      `${process.env.BASE_URL}/rates?base=${base}&date=${yesterdayStr}&quotes=${quotesFor(base)}`,
    )
    return res.json()
  })

export const fetchLiveRatesOptions = (base: string = 'USD') => {
  return queryOptions({
    queryKey: ['liveRates', base],
    queryFn: () => {
      return getLiveRatesServerFunc({ data: base })
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // 1 minute
  })
}

export const fetchYesterdayRatesOptions = (base: string = 'USD') => {
  return queryOptions({
    queryKey: ['yesterdayRates', base],
    queryFn: () => {
      return getYesterdayRatesServerFunc({ data: base })
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}
