import { useTheme } from '@/context/ThemeProvider'
import useClickOutside from '@/hooks/useClickOutside'
import { cn } from '@/utils'
import { Monitor, Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

type Theme = 'system' | 'light' | 'dark'

const THEME_OPTIONS: Array<{ value: Theme; label: string }> = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const THEME_ICONS: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

function ThemeIcon({ theme, className }: { theme: Theme; className?: string }) {
  const Icon = THEME_ICONS[theme]
  return <Icon className={className} />
}

function ThemeDropdown() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const dropdownRef = useClickOutside(() =>
    setIsOpen(false),
  ) as React.RefObject<HTMLDivElement>

  const handleSelect = (value: Theme) => {
    setTheme(value)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prevState) => !prevState)}
        aria-label="Change theme"
        className="bg-fx-neutral-500 outline-fx-neutral-400 focus:ring-fx-lime-500 flex shrink-0 cursor-pointer items-center gap-2 rounded-lg p-2.5 outline focus:ring-2"
      >
        <ThemeIcon theme={theme} className="text-fx-neutral-50 size-5" />
        <img src="/assets/images/icon-chevron-down.svg" alt="chevron icon" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            className="bg-fx-neutral-600 outline-fx-neutral-400 absolute top-[calc(100%+10px)] right-0 z-9999999 w-44 rounded-md p-2 shadow-2xl outline"
          >
            <ul>
              {THEME_OPTIONS.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="hover:outline-fx-neutral-200 focus:ring-fx-lime-500 flex w-full cursor-pointer items-center justify-between gap-3 rounded-sm px-2 py-2.5 text-left hover:outline focus:ring-1 focus:outline-none"
                  >
                    <span className="flex items-center gap-2.5">
                      <ThemeIcon
                        theme={option.value}
                        className={cn(
                          'size-4',
                          theme === option.value
                            ? 'text-fx-lime-500'
                            : 'text-fx-neutral-200',
                        )}
                      />
                      <span className="text-preset-5 text-fx-neutral-50">
                        {option.label}
                      </span>
                    </span>

                    {theme === option.value && (
                      <img
                        src="/assets/images/icon-check.svg"
                        alt="check icon"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ThemeDropdown
