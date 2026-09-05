import type { Rate, Rates } from '@/types'
import { useMemo } from 'react'

export interface RateChange {
  base: string
  quote: string
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
  const { base, quote } = currentRate
  const pair = `${base}/${quote}`
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
    base,
    quote,
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

// Plain (non-hook) version so callers that need this per-item, inside a loop
// over a dynamic list (e.g. one call per distinct favorited base — see
// FavoritesContent), can use it without breaking the rules of hooks.
export function calculateRateChanges(
  liveRates: Rates,
  yesterdayRates: Rates,
): RateChange[] {
  return liveRates.map((liveRate) => {
    const yesterdayRate = yesterdayRates.find((r) => r.quote === liveRate.quote)
    return calculateRateChange(liveRate, yesterdayRate)
  })
}

export function useRateChanges(
  liveRates: Rates,
  yesterdayRates: Rates,
): RateChange[] {
  return useMemo(
    () => calculateRateChanges(liveRates, yesterdayRates),
    [liveRates, yesterdayRates],
  )
}
