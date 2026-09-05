import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { format } from 'date-fns'
import { extendTailwindMerge } from 'tailwind-merge'

// Without this, tailwind-merge doesn't know our custom `text-preset-*`
// typography utilities (defined via @theme in styles.css) belong to the
// font-size group — it falls back to treating them as text-color classes,
// so combining e.g. `text-preset-6` with `text-fx-neutral-200` in the same
// cn() call silently drops the preset instead of merging the two.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'preset-1',
            'preset-1-tablet',
            'preset-2',
            'preset-3',
            'preset-4',
            'preset-5',
            'preset-5-medium',
            'preset-6',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Compact relative time for the conversion log ("20M", "1H", "13 May").
export function formatCompactRelativeTime(
  timestamp: number,
  now: number = Date.now(),
) {
  const minutes = Math.max(0, Math.floor((now - timestamp) / 60_000))

  if (minutes < 1) return 'NOW'
  if (minutes < 60) return `${minutes}M`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}H`

  return format(timestamp, 'd MMM')
}

// Exact timestamp, surfaced as a tooltip so a relative label like "6M" can
// always be checked against the real logged time.
export function formatAbsoluteTime(timestamp: number) {
  return format(timestamp, "d MMM yyyy 'at' HH:mm:ss")
}
