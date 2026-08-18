import { fetchHistoryRatesOptions } from '@/api/historyrates'
import { useCurrencyStore } from '@/store/store'
import { useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function HistoryChart() {
  const { base, quote } = useSearch({ from: '/' })
  const period = useCurrencyStore((state) => state.period)

  const { data: rates } = useQuery(
    fetchHistoryRatesOptions(base, quote, period),
  )

  const data = rates ?? []
  const latest = data.at(-1)

  const values = data.map((r) => r.rate)
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 0
  const mid = (min + max) / 2

  const formatTick = (date: string) => format(new Date(date), 'MMM d')

  return (
    <div className="outline-fx-neutral-600 bg-fx-neutral-700 mt-5 rounded-[20px] p-5">
      <div className="flex items-center justify-between">
        <span className="text-preset-3 text-fx-neutral-50 uppercase">
          {base}/{quote}
        </span>
        {latest && (
          <span className="text-preset-5 text-fx-neutral-200">
            {latest.rate.toFixed(4)} ·{' '}
            {format(new Date(latest.date), 'MMM d')}
          </span>
        )}
      </div>

      <div className="mt-6 h-75 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="historyRateFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-fx-lime-500)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-fx-lime-500)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--color-fx-neutral-500)"
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatTick}
              interval="preserveStartEnd"
              minTickGap={40}
              tick={{ fill: 'var(--color-fx-neutral-200)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[min, max]}
              ticks={[min, mid, max]}
              tickFormatter={(v: number) => v.toFixed(4)}
              tick={{ fill: 'var(--color-fx-neutral-200)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              formatter={(value) => Number(value).toFixed(4)}
              labelFormatter={(label) =>
                format(new Date(label as string), 'MMM d, yyyy')
              }
              contentStyle={{
                background: 'var(--color-fx-neutral-600)',
                border: '1px solid var(--color-fx-neutral-500)',
                borderRadius: 8,
              }}
              labelStyle={{ color: 'var(--color-fx-neutral-50)' }}
              itemStyle={{ color: 'var(--color-fx-lime-500)' }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="var(--color-fx-lime-500)"
              strokeWidth={2}
              fill="url(#historyRateFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default HistoryChart
