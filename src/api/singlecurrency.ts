import type { Rate } from '@/types'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

const getSingleRateServerFunc = createServerFn({ method: 'GET' })
  .validator((params: { base: string; quote: string }) => params)
  .handler(async ({ data }): Promise<Rate> => {
    const res = await fetch(
      `${process.env.BASE_URL}/rate/${data.base}/${data.quote}`,
    )
    return res.json()
  })

export const fetchSingleRateOptions = (
  base: string,
  quote: string,
  amount: number,
) =>
  queryOptions({
    queryKey: ['singleRate', base, quote, amount],
    queryFn: async () => {
      const data = await getSingleRateServerFunc({ data: { base, quote } })
      return { ...data, converted: +(data.rate * amount).toFixed(2) }
    },
    enabled: Boolean(base && quote && amount > 0),
  })
