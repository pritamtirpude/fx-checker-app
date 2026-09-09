import { fetchHistoryRatesOptions } from '@/api/historyrates'
import { useCurrencyStore } from '@/store/store'
import { useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { useEffect, useId, useRef, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// parseDate keeps the calendar date stable across timezones (ISO-only strings default to UTC midnight)
const parseDate = (date: string) => parseISO(date + 'T12:00:00')

function HistoryChart() {
  const { base, quote } = useSearch({ from: '/' })
  const period = useCurrencyStore((state) => state.period)
  const [mounted, setMounted] = useState(false)
  const [chartSize, setChartSize] = useState<{ width: number; height: number }>()
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const gradientId = useId().replace(/:/g, '')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const container = chartContainerRef.current
    if (!container) return

    const updateSize = () => {
      const { width, height } = container.getBoundingClientRect()
      setChartSize(
        width > 0 && height > 0 ? { width, height } : undefined,
      )
    }

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(container)
    updateSize()

    return () => resizeObserver.disconnect()
  }, [])

  const { data: rates } = useQuery(
    fetchHistoryRatesOptions(base, quote, period),
  )

  const data = rates ?? []
  const latest = data.at(-1)

  const values = data.map((r) => r.rate)
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 0
  // A flat series would otherwise produce three identical Y-axis ticks.
  const padding = min === max ? Math.max(Math.abs(min) * 0.01, 0.0001) : 0
  const chartMin = min - padding
  const chartMax = max + padding
  const mid = (chartMin + chartMax) / 2

  const formatTick = (date: string) => format(parseDate(date), 'MMM d')

  return (
    <div className="outline-fx-neutral-600 bg-fx-neutral-700 mt-5 rounded-[20px] p-5">
      <div className="flex items-center justify-between">
        <span className="text-preset-3 text-fx-neutral-50 uppercase">
          {base}/{quote}
        </span>
        {latest && (
          <span className="text-preset-5 text-fx-neutral-200">
            {latest.rate.toFixed(4)} · {format(parseDate(latest.date), 'MMM d')}
          </span>
        )}
      </div>

      <div ref={chartContainerRef} className="mt-6 h-[300px] w-full">
        {mounted && chartSize && (
          <AreaChart
            width={chartSize.width}
            height={chartSize.height}
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-fx-chart-line)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-fx-chart-line)"
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
              domain={[chartMin, chartMax]}
              ticks={[chartMin, mid, chartMax]}
              tickFormatter={(v: number) => v.toFixed(4)}
              tick={{ fill: 'var(--color-fx-neutral-200)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              formatter={(value) => Number(value).toFixed(4)}
              labelFormatter={(label) =>
                format(parseDate(label as string), 'MMM d, yyyy')
              }
              contentStyle={{
                background: 'var(--color-fx-neutral-600)',
                border: '1px solid var(--color-fx-neutral-500)',
                borderRadius: 8,
              }}
              labelStyle={{ color: 'var(--color-fx-neutral-50)' }}
              itemStyle={{ color: 'var(--color-fx-chart-line)' }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="var(--color-fx-chart-line)"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        )}
      </div>
    </div>
  )
}

export default HistoryChart
