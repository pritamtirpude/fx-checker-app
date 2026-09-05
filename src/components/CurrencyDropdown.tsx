import { fetchCurrenciesOptions } from '@/api/currencies'
import useClickOutside from '@/hooks/useClickOutside'
import useDebounce from '@/hooks/useDebounce'
import { useCurrencyStore } from '@/store/store'
import { cn } from '@/utils'
import { getCurrencyOptions } from '@/utils/currency'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

type Props = {
  slot: 'send' | 'receive'
  defaultCode: string
}

function CurrencyDropdown({ slot, defaultCode }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { data: currenciesData } = useQuery(fetchCurrenciesOptions())
  const selected = useCurrencyStore((s) => s[slot])
  const setSend = useCurrencyStore((s) => s.setSend)
  const setReceive = useCurrencyStore((s) => s.setReceive)

  const dropdownRef = useClickOutside(() => {
    setIsDropdownOpen(false)
    setSearch('')
  }) as React.RefObject<HTMLDivElement>

  const setSelected = slot === 'send' ? setSend : setReceive
  const navigate = useNavigate()
  const searchParam = slot === 'send' ? 'base' : 'quote'

  const handleSelect = (currency: (typeof currencies)[0]) => {
    setSelected(currency)
    setIsDropdownOpen(false)
    setSearch('')
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, [searchParam]: currency.code }),
    })
  }

  const currencies = getCurrencyOptions(currenciesData || [])

  // On first load, set the default currency for this slot.
  // Skipped if user already made a selection.
  useEffect(() => {
    if (currencies.length === 0 || selected !== null) return
    const match =
      currencies.find((c) => c.code === defaultCode) ?? currencies[0]
    setSelected(match)
  }, [currencies.length])

  const popularCurrencies = currencies.filter(
    (c) =>
      ['USD', 'EUR', 'GBP'].includes(c.code) &&
      (c.code.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase())),
  )
  const otherCurrencies = currencies.filter(
    (c) =>
      !['USD', 'EUR', 'GBP'].includes(c.code) &&
      (c.code.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase())),
  )

  return (
    <div className="w-auto md:relative md:w-auto">
      <button
        onClick={() => setIsDropdownOpen((prevState) => !prevState)}
        className="bg-fx-neutral-500 outline-fx-neutral-400 focus:ring-fx-lime-500 ml-auto flex shrink-0 cursor-pointer items-center gap-2 rounded-lg p-2.5 outline focus:ring-2"
      >
        <span className="size-5 overflow-hidden rounded-full">
          <img
            src={selected?.flag}
            alt={selected?.code}
            className="size-full object-cover"
          />
        </span>
        <span className="text-preset-4 text-fx-neutral-50">
          {selected?.code}
        </span>
        <span>
          <img src="/assets/images/icon-chevron-down.svg" alt="chevron icon" />
        </span>
      </button>
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{
              duration: 0.2,
            }}
            className="bg-fx-neutral-600 outline-fx-neutral-400 scrollbar-thumb-fx-neutral-500 absolute top-[calc(100%+10px)] right-0 left-0 z-9999999 h-116 min-w-0 scrollbar-thin overflow-y-auto rounded-md p-2 shadow-2xl outline md:top-[calc(100%+16px)] md:right-0 md:left-auto md:w-max md:min-w-80"
          >
            <div className="relative">
              <input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search currencies..."
                type="search"
                className="outline-fx-neutral-200 text-preset-5 focus:outline-fx-lime-500 w-full rounded-md px-8 py-3 outline"
              />
              <img
                className="absolute top-1/2 left-3 -translate-y-1/2"
                src="/assets/images/icon-search.svg"
                alt="search icon"
              />
            </div>
            <div className="mt-2.5">
              <div
                className={cn(
                  'border-fx-neutral-500 flex items-center justify-between border-b p-2',
                  search.length > 0 && 'hidden',
                )}
              >
                <h3 className="text-preset-5 text-fx-neutral-200 uppercase">
                  Popular
                </h3>
                <span className="text-preset-5 text-fx-neutral-200">
                  {popularCurrencies.length}
                </span>
              </div>
              <div className="mt-1">
                <ul>
                  {popularCurrencies.map((currency) => (
                    <li
                      key={currency.code}
                      tabIndex={0}
                      className="hover:outline-fx-neutral-200 focus:ring-fx-lime-500 flex cursor-pointer items-center justify-between rounded-sm px-2 py-3.5 hover:outline focus:ring-1 focus:outline-none"
                      onClick={() => handleSelect(currency)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="size-5 overflow-hidden rounded-full">
                          <img
                            src={currency.flag}
                            alt={currency.code}
                            className="size-full object-cover"
                          />
                        </span>
                        <span className="text-preset-4 text-fx-neutral-50">
                          {currency.code}
                        </span>
                        <span className="text-preset-5 text-fx-neutral-200">
                          {currency.name}
                        </span>
                      </div>

                      {selected?.code === currency.code && (
                        <div>
                          <span>
                            <img
                              src="/assets/images/icon-check.svg"
                              alt="check icon"
                            />
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-2.5">
                <div
                  className={cn(
                    'border-fx-neutral-500 flex items-center justify-between border-b p-2',
                    search.length > 0 && 'hidden',
                  )}
                >
                  <h3 className="text-preset-5 text-fx-neutral-200 uppercase">
                    Other Currencies
                  </h3>
                  <span className="text-preset-5 text-fx-neutral-200">
                    {otherCurrencies.length}
                  </span>
                </div>
                <div className="mt-1">
                  <ul>
                    {otherCurrencies.map((currency) => (
                      <li
                        className="hover:outline-fx-neutral-200 focus:ring-fx-lime-500 flex cursor-pointer items-center justify-between rounded-sm px-2 py-3.5 hover:outline focus:ring-1 focus:outline-none"
                        key={currency.code}
                        tabIndex={0}
                        onClick={() => handleSelect(currency)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="size-5 overflow-hidden rounded-full">
                            <img
                              src={currency.flag}
                              alt={currency.code}
                              className="size-full object-cover"
                            />
                          </span>
                          <span className="text-preset-4 text-fx-neutral-50">
                            {currency.code}
                          </span>
                          <span className="text-preset-5 text-fx-neutral-200">
                            {currency.name}
                          </span>
                        </div>

                        {selected?.code === currency.code && (
                          <div>
                            <span>
                              <img
                                src="/assets/images/icon-check.svg"
                                alt="check icon"
                              />
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CurrencyDropdown
