import type { Rates } from '@/types'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

const getLiveRatesServerFunc = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Rates> => {
    const res = await fetch(
      `${process.env.BASE_URL}/rates?base=INR&quotes=USD,EUR,GBP,JPY,CHF,CNY,AUD,NZD,SGD,HKD,KRW,THB,MYR,PHP,IDR,AED,ARS,BDT,BGN,BHD,BRL,CAD,CLP,COP,CZK,DKK,EGP,HNL,HRK,HTG,HUF,ISK,JOD,KES,KWD,LBP,LKR,MAD,MXN,NGN,NOK,NPR,OMR,PEN,PKR,PLN,QAR,RON,RUB,SAR,SEK,TRY,TWD,UAH,VND,ZAR`,
    )
    return res.json()
  },
)

const getYesterdayRatesServerFunc = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Rates> => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const res = await fetch(
      `${process.env.BASE_URL}/rates?base=INR&date=${yesterdayStr}&quotes=USD,EUR,GBP,JPY,CHF,CNY,AUD,NZD,SGD,HKD,KRW,THB,MYR,PHP,IDR,AED,ARS,BDT,BGN,BHD,BRL,CAD,CLP,COP,CZK,DKK,EGP,HNL,HRK,HTG,HUF,ISK,JOD,KES,KWD,LBP,LKR,MAD,MXN,NGN,NOK,NPR,OMR,PEN,PKR,PLN,QAR,RON,RUB,SAR,SEK,TRY,TWD,UAH,VND,ZAR`,
    )
    return res.json()
  },
)

export const fetchLiveRatesOptions = () => {
  return queryOptions({
    queryKey: ['liveRates'],
    queryFn: () => {
      return getLiveRatesServerFunc()
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // 1 minute
  })
}

export const fetchYesterdayRatesOptions = () => {
  return queryOptions({
    queryKey: ['yesterdayRates'],
    queryFn: () => {
      return getYesterdayRatesServerFunc()
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}
