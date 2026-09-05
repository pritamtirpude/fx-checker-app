import {
  fetchLiveRatesOptions,
  fetchYesterdayRatesOptions,
} from '@/api/liverates'
import { calculateRateChanges } from '@/hooks/useRateChanges'
import {
  fromFavoriteKey,
  toFavoriteKey,
  useFavoritesStore,
} from '@/store/favoritesStore'
import { cn } from '@/utils'
import { useQueries } from '@tanstack/react-query'

function FavoritesContent() {
  const hasHydrated = useFavoritesStore((s) => s.hasHydrated)
  const favorites = useFavoritesStore((s) => s.favorites)
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)

  // Favorites can be pinned under different bases (e.g. "USD → EUR" and
  // "INR → PKR" pinned at different times) — fetch each distinct base's
  // rates independently rather than assuming the currently selected base.
  const favoritePairs = favorites.map(fromFavoriteKey)
  const distinctBases = Array.from(
    new Set(favoritePairs.map((pair) => pair.base)),
  )

  const liveQueries = useQueries({
    queries: distinctBases.map((base) => fetchLiveRatesOptions(base)),
  })
  const yesterdayQueries = useQueries({
    queries: distinctBases.map((base) => fetchYesterdayRatesOptions(base)),
  })

  const ratesByBase = new Map(
    distinctBases.map((base, index) => [
      base,
      calculateRateChanges(
        liveQueries[index]?.data || [],
        yesterdayQueries[index]?.data || [],
      ),
    ]),
  )

  const favoriteRates = hasHydrated
    ? favoritePairs
        .map(({ base, quote }) =>
          ratesByBase
            .get(base)
            ?.find((rateChange) => rateChange.quote === quote),
        )
        .filter((rateChange) => rateChange !== undefined)
    : []

  if (favoriteRates.length === 0) {
    return (
      <div className="bg-fx-neutral-700 mt-5 flex h-162 flex-col items-center justify-center gap-2 rounded-2xl px-5 text-center">
        <p className="text-preset-3 text-fx-neutral-50">No pinned pairs yet</p>
        <p className="text-preset-5 text-fx-neutral-200 max-w-90">
          Pin a pair to track its rate here. Tap the star icon on any conversion
          or comparison row.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-fx-neutral-700 mt-5 h-162 overflow-hidden rounded-2xl">
      <div className="scrollbar-thumb-fx-neutral-500 hover:scrollbar-thumb-fx-neutral-400 h-full scrollbar-thin scrollbar-track-transparent overflow-y-auto p-4 md:p-5">
        <div className="flex flex-col items-start gap-2.5 md:flex-row md:items-center md:justify-between md:gap-0">
          <p className="text-preset-5 text-fx-neutral-200 uppercase">
            Pinned pairs
          </p>
          <span className="text-preset-5 text-fx-neutral-200 uppercase">
            {favoriteRates.length} favorites
          </span>
        </div>

        <ul className="mt-5 flex flex-col gap-3">
          {favoriteRates.map((rateChange) => (
            <li
              key={toFavoriteKey(rateChange.base, rateChange.quote)}
              className="outline-fx-neutral-500 bg-fx-neutral-600 flex cursor-pointer items-center justify-between rounded-[10px] p-3 outline md:px-4 md:py-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-preset-4 text-fx-neutral-50 uppercase">
                  {rateChange.base}
                </span>
                <img
                  src="/assets/images/icon-arrow-right.svg"
                  alt="to"
                  className="size-4"
                />
                <span className="text-preset-4 text-fx-neutral-50 uppercase">
                  {rateChange.quote}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-preset-6 text-fx-neutral-50">
                    {rateChange.displayRate}
                  </span>
                  <span
                    className={cn(
                      'text-preset-6 flex items-center gap-1',
                      rateChange.color === 'green'
                        ? 'text-fx-green-500'
                        : rateChange.color === 'red'
                          ? 'text-fx-red-500'
                          : 'text-fx-neutral-200',
                    )}
                  >
                    {rateChange.arrow} {rateChange.displayPercentage}
                  </span>
                </div>

                <button
                  type="button"
                  aria-pressed
                  onClick={() =>
                    toggleFavorite(rateChange.base, rateChange.quote)
                  }
                  className="outline-fx-lime-500 bg-fx-lime-800 focus:ring-fx-lime-500 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg outline focus:ring-2 focus:outline-none"
                >
                  <img
                    src="/assets/images/icon-star-filled.svg"
                    alt="remove from favorites"
                    className="size-4"
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FavoritesContent
