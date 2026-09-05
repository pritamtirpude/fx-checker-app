import { fetchSingleRateOptions } from '@/api/singlecurrency'
import useDebounce from '@/hooks/useDebounce'
import { toFavoriteKey, useFavoritesStore } from '@/store/favoritesStore'
import { useLogStore } from '@/store/logStore'
import { useCurrencyStore } from '@/store/store'
import { cn } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import RateCard from './RateCard'

function CheckRate() {
  const { base, quote } = useSearch({ from: '/' })
  const { amount, setAmount, swapCurrencies } = useCurrencyStore()
  const navigate = useNavigate()

  const hasHydrated = useFavoritesStore((s) => s.hasHydrated)
  const favorites = useFavoritesStore((s) => s.favorites)
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)
  const addLog = useLogStore((s) => s.addLog)

  const handleSwap = () => {
    swapCurrencies()
    navigate({
      to: '.',
      search: (prev) => ({ base: prev.quote, quote: prev.base }),
    })
  }

  // local string state so partial typing (e.g. "10" mid-way through "1000") doesn't break
  const [inputValue, setInputValue] = useState(amount.toString())
  const debouncedInput = useDebounce(inputValue, 500)
  const parsedAmount = parseFloat(debouncedInput) || 0

  const { data: rateData, isLoading } = useQuery(
    fetchSingleRateOptions(base, quote, parsedAmount),
  )

  const handleAmountChange = (v: string) => {
    setInputValue(v)
    const num = parseFloat(v)
    setAmount(!isNaN(num) && num > 0 ? num : 0)
  }

  const converted = rateData?.converted ?? null

  const isFavorite =
    hasHydrated && favorites.includes(toFavoriteKey(base, quote))

  const handleLogConversion = () => {
    if (!rateData || converted === null) return

    addLog({
      base,
      quote,
      amount: parsedAmount,
      converted,
      rate: rateData.rate,
    })
  }

  return (
    <section>
      <h1 className="text-preset-2 text-fx-neutral-50 uppercase">
        check the rate
      </h1>
      <div className="bg-fx-neutral-700 mt-4 rounded-[20px]">
        <div className="flex flex-col items-center gap-6 p-5 md:flex-row">
          <RateCard
            title="send"
            inputType="text"
            defaultCode={base}
            value={inputValue}
            onChange={handleAmountChange}
          />
          <button
            onClick={handleSwap}
            className="outline-fx-neutral-500 bg-fx-neutral-600 focus:ring-fx-lime-500 flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-3.5 outline focus:ring-2"
          >
            <img
              src="/assets/images/icon-exchange.svg"
              alt="exchange"
              className="size-5 rotate-90 transition-transform md:rotate-0"
            />
          </button>
          <RateCard
            title="receive"
            inputType="readonly"
            defaultCode={quote}
            value={isLoading || converted === null ? '' : converted.toString()}
          />
        </div>
        <div className="h-0.5 w-full bg-[linear-gradient(to_right,var(--color-fx-neutral-500)_50%,transparent_50%)] bg-size-[10px_100%]" />

        <div className="flex flex-col items-center gap-4 p-5 md:flex-row md:justify-between md:gap-0">
          <div>
            <p className="text-preset-5 text-fx-neutral-50">
              {rateData ? (
                <>
                  1 <span>{rateData.base}</span> = {rateData.rate}{' '}
                  <span>{rateData.quote}</span>
                </>
              ) : (
                <span className="text-fx-neutral-400">
                  1 <span>{base}</span> = 0 <span>{quote}</span>
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-pressed={isFavorite}
              onClick={() => toggleFavorite(base, quote)}
              className={cn(
                'text-preset-5-medium focus:outline-fx-lime-500 flex cursor-pointer items-center gap-2 rounded-lg px-2 py-3 uppercase outline transition-colors focus:outline-2 focus:outline-offset-2',
                isFavorite
                  ? 'bg-fx-lime-500 text-fx-neutral-900 outline-fx-lime-500'
                  : 'text-fx-neutral-200 outline-fx-neutral-300',
              )}
            >
              <img
                src={
                  isFavorite
                    ? '/assets/images/icon-star-filled.svg'
                    : '/assets/images/icon-star.svg'
                }
                alt="star icon"
                className={cn(isFavorite && 'brightness-0')}
              />
              {isFavorite ? 'favorited' : 'favorite'}
            </button>
            <button
              type="button"
              disabled={!rateData || converted === null}
              onClick={handleLogConversion}
              className="text-preset-5-medium text-fx-neutral-200 outline-fx-neutral-300 hover:text-fx-neutral-50 hover:outline-fx-lime-500 hover:bg-fx-lime-800 focus:outline-fx-lime-500 focus:inset-ring-fx-lime-500 focus:text-fx-neutral-50 flex cursor-pointer items-center gap-2 rounded-lg px-2 py-3 uppercase outline transition-colors focus:inset-ring-2 focus:outline-offset-2"
            >
              log conversion
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CheckRate
