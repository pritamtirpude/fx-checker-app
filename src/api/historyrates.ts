import type { Rate } from '@/types'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import type { Duration } from 'date-fns'
import { format, sub } from 'date-fns'

export type Period = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'

const periodDuration: Record<Period, Duration> = {
  '1D': { days: 1 },
  '1W': { weeks: 1 },
  '1M': { months: 1 },
  '3M': { months: 3 },
  '1Y': { years: 1 },
  '5Y': { years: 5 },
}

const getHistoryRatesServerFunc = createServerFn({ method: 'GET' })
  .validator(
    (params: { base: string; quote: string; from: string; to: string }) =>
      params,
  )
  .handler(async ({ data }): Promise<Rate[]> => {
    const res = await fetch(
      `${process.env.BASE_URL}/rates?base=${data.base}&quotes=${data.quote}&from=${data.from}&to=${data.to}`,
    )
    return res.json()
  })

export const fetchHistoryRatesOptions = (
  base: string,
  quote: string,
  period: Period = '1M',
) => {
  const to = new Date()
  const from = sub(to, periodDuration[period])

  const toStr = format(to, 'yyyy-MM-dd')
  const fromStr = format(from, 'yyyy-MM-dd')

  return queryOptions({
    queryKey: ['historyRates', base, quote, period],
    queryFn: () =>
      getHistoryRatesServerFunc({
        data: { base, quote, from: fromStr, to: toStr },
      }),
    enabled: Boolean(base && quote),
  })
}
