import {
  fetchLiveRatesOptions,
  fetchYesterdayRatesOptions,
} from '@/api/liverates'
import { useRateChanges } from '@/hooks/useRateChanges'
import { cn } from '@/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Ticker } from 'motion-plus/react'

function LiveTicker() {
  const { data: liveRates } = useSuspenseQuery(fetchLiveRatesOptions())
  const { data: yesterdayRates } = useSuspenseQuery(
    fetchYesterdayRatesOptions(),
  )

  const rateChanges = useRateChanges(liveRates, yesterdayRates)

  const itemRenderer = rateChanges.map((rate, index) => (
    <ul className="flex items-stretch" key={rate.displayRate + index}>
      <li className="flex items-center justify-center gap-2.5 select-none">
        <span className="text-fx-neutral-200 text-preset-5">{rate.pair}</span>
        <span className="text-fx-neutral-50 text-preset-5">
          {rate.displayRate}
        </span>
        <span
          className={cn(
            'text-preset-5',
            rate.color === 'green' ? 'text-fx-green-500' : 'text-fx-red-500',
          )}
        >
          {rate.arrow}
        </span>
        <span
          className={cn(
            'text-preset-5',
            rate.color === 'green' ? 'text-fx-green-500' : 'text-fx-red-500',
          )}
        >
          {rate.displayPercentage}
        </span>
      </li>
    </ul>
  ))

  return (
    <div className="flex overflow-hidden">
      <div className="bg-fx-lime-500">
        <div className="text-fx-neutral-900 text-preset-5-medium flex w-40 justify-center gap-2 px-4 py-3 uppercase">
          <span>&#9679;</span>
          <span>live markets</span>
        </div>
      </div>
      <div className="bg-fx-neutral-700 flex w-full items-center">
        <Ticker
          items={itemRenderer}
          overflow
          fade={100}
          hoverFactor={0}
          gap={20}
        />
      </div>
    </div>
  )
}

export default LiveTicker
