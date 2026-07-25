import type { Rate, Rates } from '@/types'
import { useMemo } from 'react'

export interface RateChange {
  pair: string
  rate: number
  change: number
  percentage: number
  direction: 'up' | 'down' | 'neutral'
  arrow: string
  color: 'green' | 'red' | 'gray'
  displayRate: string
  displayPercentage: string
}

function calculateRateChange(
  currentRate: Rate,
  previousRate: Rate | undefined,
): RateChange {
  const pair = `${currentRate.base}/${currentRate.quote}`
  const rate = currentRate.rate

  const previousRateValue = previousRate?.rate ?? currentRate.rate
  const change = rate - previousRateValue
  const percentage = (change / previousRateValue) * 100

  let direction: 'up' | 'down' | 'neutral'
  let arrow: string
  let color: 'green' | 'red' | 'gray'

  if (change > 0) {
    direction = 'up'
    arrow = '▲'
    color = 'green'
  } else if (change < 0) {
    direction = 'down'
    arrow = '▼'
    color = 'red'
  } else {
    direction = 'neutral'
    arrow = '→'
    color = 'gray'
  }

  const displayRate = rate.toFixed(4)
  const displayPercentage = `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`

  return {
    pair,
    rate,
    change,
    percentage,
    direction,
    arrow,
    color,
    displayRate,
    displayPercentage,
  }
}

export function useRateChanges(
  liveRates: Rates,
  yesterdayRates: Rates,
): RateChange[] {
  return useMemo(() => {
    return liveRates.map((liveRate) => {
      const yesterdayRate = yesterdayRates.find(
        (r) => r.quote === liveRate.quote,
      )
      return calculateRateChange(liveRate, yesterdayRate)
    })
  }, [liveRates, yesterdayRates])
}
