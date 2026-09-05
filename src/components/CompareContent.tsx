import { fetchCurrenciesOptions } from '@/api/currencies'
import { fetchLiveRatesOptions } from '@/api/liverates'
import { toFavoriteKey, useFavoritesStore } from '@/store/favoritesStore'
import { useCurrencyStore } from '@/store/store'
import type { Rate } from '@/types'
import { cn } from '@/utils'
import type { CurrencyOption } from '@/utils/currency'
import { getCurrencyOptions } from '@/utils/currency'
import { useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { NumericFormat } from 'react-number-format'

type CompareRow = { rate: Rate; currency: CurrencyOption }

function CompareContent() {
  const { base } = useSearch({ from: '/' })
  const amount = useCurrencyStore((s) => s.amount)
  const hasHydrated = useFavoritesStore((s) => s.hasHydrated)
  const favorites = useFavoritesStore((s) => s.favorites)
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)

  const { data: currenciesData } = useQuery(fetchCurrenciesOptions())
  const { data: rates } = useQuery(fetchLiveRatesOptions(base))

  const currencies = getCurrencyOptions(currenciesData || [])

  const rows: CompareRow[] = (rates || [])
    .map((rate) => ({
      rate,
      currency: currencies.find((c) => c.code === rate.quote),
    }))
    .filter((row): row is CompareRow => Boolean(row.currency))

  if (amount <= 0) {
    return (
      <div className="bg-fx-neutral-700 mt-5 flex h-162 flex-col items-center justify-center gap-2 rounded-2xl px-5 text-center">
        <p className="text-preset-3 text-fx-neutral-50">
          No comparison available
        </p>
        <p className="text-preset-5 text-fx-neutral-200 max-w-90">
          Enter an amount in SEND above to see what your money is worth in other
          currencies.
        </p>
      </div>
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const currencyCode = e.currentTarget.getAttribute('data-currency-code')
      if (currencyCode) {
        toggleFavorite(base, currencyCode)
      }
    }
  }

  return (
    <div className="bg-fx-neutral-700 mt-5 h-162 overflow-hidden rounded-2xl">
      <div className="scrollbar-thumb-fx-neutral-500 hover:scrollbar-thumb-fx-neutral-400 h-full scrollbar-thin scrollbar-track-transparent overflow-y-auto p-4 md:p-5">
        <div className="flex flex-col items-start gap-2.5 md:flex-row md:items-center md:justify-between md:gap-0">
          <p className="text-preset-5 text-fx-neutral-200 uppercase">
            Multi-currency{' '}
            <span className="text-preset-4 text-fx-neutral-50">
              {amount.toLocaleString()} from {base}
            </span>
          </p>
          <span className="text-preset-5 text-fx-neutral-200 uppercase">
            {rows.length} pairs
          </span>
        </div>

        <ul className="mt-5 flex flex-col gap-3">
          {rows.map(({ rate, currency }) => {
            const isFavorite =
              hasHydrated && favorites.includes(toFavoriteKey(base, rate.quote))

            return (
              <li
                tabIndex={0}
                data-currency-code={rate.quote}
                onClick={() => toggleFavorite(base, rate.quote)}
                onKeyDown={(e) => handleKeyDown(e)}
                key={rate.quote}
                className="outline-fx-neutral-500 focus:outline-fx-lime-500 bg-fx-neutral-600 flex cursor-pointer items-center justify-between rounded-[10px] p-3 outline focus:outline-2 md:px-4 md:py-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="size-8 shrink-0 overflow-hidden rounded-full">
                    <img
                      src={currency.flag}
                      alt={currency.code}
                      className="size-full object-cover"
                    />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-preset-4 text-fx-neutral-50 uppercase">
                      {currency.code}
                    </span>
                    <span className="text-preset-5 text-fx-neutral-200">
                      {currency.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col items-end gap-1.5">
                    <NumericFormat
                      displayType="text"
                      thousandSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                      value={amount * rate.rate}
                      className="text-preset-3 text-fx-neutral-50"
                    />
                    <span className="text-preset-6 text-fx-neutral-200">
                      @ {rate.rate.toFixed(4)}
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-pressed={isFavorite}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(base, rate.quote)
                    }}
                    className={cn(
                      'focus:ring-fx-lime-500 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg outline focus:ring-2 focus:outline-none',
                      isFavorite
                        ? 'outline-fx-lime-500 bg-fx-lime-800'
                        : 'outline-fx-neutral-500 hover:outline-fx-neutral-400',
                    )}
                  >
                    <img
                      src={
                        isFavorite
                          ? '/assets/images/icon-star-filled.svg'
                          : '/assets/images/icon-star.svg'
                      }
                      alt="toggle favorite"
                      className="size-4"
                    />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default CompareContent
