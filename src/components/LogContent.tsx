import ClearLogModal from '@/components/ClearLogModal'
import { useLogStore } from '@/store/logStore'
import { formatAbsoluteTime, formatCompactRelativeTime } from '@/utils'
import { AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'

// The relative labels ("NOW", "6M", "2H") are derived from the current time,
// so without a ticking clock they freeze at whatever the last render computed
// and silently drift out of date while the tab just sits there.
function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])

  return now
}

function LogContent() {
  const now = useNow()
  const hasHydrated = useLogStore((s) => s.hasHydrated)
  const logs = useLogStore((s) => s.logs)
  const removeLog = useLogStore((s) => s.removeLog)
  const clearLogs = useLogStore((s) => s.clearLogs)
  const [isClearModalOpen, setIsClearModalOpen] = useState(false)

  const entries = hasHydrated ? logs : []

  // The modal is rendered here, above the empty/populated branches below,
  // so clearLogs() flipping entries to [] (and swapping in the empty-state
  // branch) can't yank it out of the tree mid-close — AnimatePresence needs
  // to stay mounted around it to play the exit animation.
  const clearLogModal = (
    <AnimatePresence>
      {isClearModalOpen && (
        <ClearLogModal
          count={entries.length}
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={clearLogs}
        />
      )}
    </AnimatePresence>
  )

  return (
    <>
      {clearLogModal}

      {entries.length === 0 ? (
        <div className="bg-fx-neutral-700 mt-5 flex h-162 flex-col items-center justify-center gap-2 rounded-2xl px-5 text-center">
          <p className="text-preset-3 text-fx-neutral-50">
            No conversions logged yet
          </p>
          <p className="text-preset-5 text-fx-neutral-200 max-w-90">
            Every conversion is recorded here automatically when you tap LOG
            CONVERSION. Your log is private to this session and this browser.
          </p>
        </div>
      ) : (
        <div className="bg-fx-neutral-700 mt-5 h-162 overflow-hidden rounded-2xl">
          <div className="scrollbar-thumb-fx-neutral-500 hover:scrollbar-thumb-fx-neutral-400 h-full scrollbar-thin scrollbar-track-transparent overflow-y-auto p-4 md:p-5">
            <div className="flex w-full flex-col items-start gap-2.5 md:flex-row md:items-center md:justify-between md:gap-0">
              <p className="text-preset-3 text-fx-neutral-50 uppercase">
                Conversion log
              </p>
              <div className="flex w-full items-center justify-between gap-3 md:w-auto">
                <span className="text-preset-5 text-fx-neutral-200 uppercase">
                  {entries.length} logged
                </span>
                <button
                  type="button"
                  onClick={() => setIsClearModalOpen(true)}
                  className="text-preset-5 outline-fx-neutral-500 hover:outline-fx-neutral-400 text-fx-neutral-200 cursor-pointer rounded-lg px-2 py-1.5 uppercase outline"
                >
                  Clear all
                </button>
              </div>
            </div>

            <ul className="mt-5 flex flex-col gap-3">
              {entries.map((log) => (
                <li
                  key={log.id}
                  className="outline-fx-neutral-500 bg-fx-neutral-600 flex items-center justify-between rounded-[10px] p-3 outline md:px-4 md:py-3"
                >
                  <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-4">
                    <span
                      title={formatAbsoluteTime(log.timestamp)}
                      className="text-preset-6 text-fx-neutral-200 w-12 shrink-0"
                    >
                      {formatCompactRelativeTime(log.timestamp, now)}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-preset-4 text-fx-neutral-50 uppercase">
                        {log.base}
                      </span>
                      <img
                        src="/assets/images/icon-arrow-right.svg"
                        alt="to"
                        className="size-4"
                      />
                      <span className="text-preset-4 text-fx-neutral-50 uppercase">
                        {log.quote}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex flex-col gap-1 md:flex-row md:gap-5">
                      <NumericFormat
                        displayType="text"
                        thousandSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        value={log.amount}
                        className="text-preset-4 text-fx-neutral-200"
                      />
                      <NumericFormat
                        displayType="text"
                        thousandSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        value={log.converted}
                        className="text-preset-4 text-fx-lime-500"
                      />
                    </div>

                    <button
                      type="button"
                      aria-label="remove log entry"
                      onClick={() => removeLog(log.id)}
                      className="outline-fx-neutral-500 hover:outline-fx-neutral-400 focus:ring-fx-lime-500 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg outline focus:ring-2 focus:outline-none"
                    >
                      <img
                        src="/assets/images/icon-delete.svg"
                        alt="remove"
                        className="size-4"
                      />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default LogContent
