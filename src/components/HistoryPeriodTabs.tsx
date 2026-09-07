import type { Period } from '@/api/historyrates'
import { useCurrencyStore } from '@/store/store'
import { cn } from '@/utils'

const periods: { label: string; value: Period }[] = [
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '1Y', value: '1Y' },
  { label: '5Y', value: '5Y' },
]

function HistoryPeriodTabs() {
  const period = useCurrencyStore((state) => state.period)
  const setPeriod = useCurrencyStore((state) => state.setPeriod)

  return (
    <ul className="bg-fx-neutral-700 flex items-center rounded-lg">
      {periods.map((p) => (
        <li
          className={cn(
            'text-preset-5 px-4 py-3 transition-all duration-200',
            period === p.value
              ? 'text-fx-neutral-50 bg-fx-neutral-500 rounded-lg'
              : 'text-fx-neutral-200',
          )}
          key={p.value}
        >
          <button className="cursor-pointer" onClick={() => setPeriod(p.value)}>
            {p.label}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default HistoryPeriodTabs
