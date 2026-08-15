import { fetchHistoryRatesOptions } from '@/api/historyrates'
import { useCurrencyStore } from '@/store/store'
import { cn } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import HistoryPeriodTabs from './HistoryPeriodTabs'

function HistoryHeader() {
  const { base, quote } = useSearch({ from: '/' })
  const period = useCurrencyStore((state) => state.period)

  const { data: rates } = useQuery(
    fetchHistoryRatesOptions(base, quote, period),
  )

  const open = rates?.at(0)?.rate ?? 0
  const last = rates?.at(-1)?.rate ?? 0
  const change = last - open
  const percentage = open ? (change / open) * 100 : 0
  const isPositive = change >= 0
  const sign = isPositive ? '+' : ''
  const arrow = isPositive ? '▲' : '▼'

  return (
    <div className="mt-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="outline-fx-neutral-600 bg-fx-neutral-700 flex flex-col gap-4 rounded-2xl px-5 py-3 outline">
          <span className="text-preset-4 text-fx-neutral-50/75 inline-block uppercase">
            open
          </span>
          <span className="text-preset-2 text-fx-neutral-50 inline-block">
            {open.toFixed(4)}
          </span>
        </div>

        <div className="outline-fx-neutral-600 bg-fx-neutral-700 flex flex-col gap-4 rounded-2xl px-5 py-3 outline">
          <span className="text-preset-4 text-fx-neutral-50/75 inline-block uppercase">
            last
          </span>
          <span className="text-preset-2 text-fx-neutral-50 inline-block">
            {last.toFixed(4)}
          </span>
        </div>

        <div className="outline-fx-neutral-600 bg-fx-neutral-700 flex flex-col gap-4 rounded-2xl px-5 py-3 outline">
          <span className="text-preset-4 text-fx-neutral-50/75 inline-block uppercase">
            change
          </span>
          <span
            className={cn(
              'text-preset-2 inline-block',
              isPositive ? 'text-fx-green-500' : 'text-fx-red-500',
            )}
          >
            {sign}
            {change.toFixed(4)}
          </span>
        </div>

        <div className="outline-fx-neutral-600 bg-fx-neutral-700 flex flex-col gap-4 rounded-2xl px-5 py-3 outline">
          <span className="text-preset-4 text-fx-neutral-50/75 inline-block uppercase">
            % change
          </span>
          <span
            className={cn(
              'text-preset-2 inline-flex items-center gap-1',
              isPositive ? 'text-fx-green-500' : 'text-fx-red-500',
            )}
          >
            <span>{arrow}</span>
            {sign}
            {percentage.toFixed(2)}%
          </span>
        </div>
      </div>
      <div>
        <HistoryPeriodTabs />
      </div>
    </div>
  )
}

export default HistoryHeader
