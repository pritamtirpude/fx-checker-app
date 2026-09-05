import { useFavoritesStore } from '@/store/favoritesStore'
import { useLogStore } from '@/store/logStore'
import { cn } from '@/utils'
import { useState } from 'react'
import CompareContent from './CompareContent'
import FavoritesContent from './FavoritesContent'
import HistoryContent from './HistoryContent'
import LogContent from './LogContent'

const TABS = ['history', 'compare', 'favorites', 'log']
function MobileTabs() {
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const favorites = useFavoritesStore((s) => s.favorites)
  const logs = useLogStore((s) => s.logs)

  const historyTabContent = activeTab === 'history'
  const compareTabContent = activeTab === 'compare'
  const favoritesTabContent = activeTab === 'favorites'
  const logTabContent = activeTab === 'log'

  return (
    <div className="relative md:hidden">
      <button
        className="bg-fx-neutral-700 outline-fx-neutral-400 flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 outline"
        onClick={() => setIsMenuOpen((prevState) => !prevState)}
      >
        <span className="text-preset-3 text-fx-neutral-50 uppercase">
          {activeTab}
        </span>
        <img
          className={cn('transition-transform', isMenuOpen && 'rotate-180')}
          src="/assets/images/icon-chevron-down.svg"
          alt="chevron down"
        />
      </button>
      {isMenuOpen && (
        <ul className="bg-fx-neutral-700 outline-fx-neutral-600 absolute left-0 mt-2 w-full overflow-hidden rounded-lg outline">
          {TABS.map((tab) => (
            <li
              key={tab}
              className="text-fx-neutral-50 hover:bg-fx-neutral-600 flex cursor-pointer items-center justify-between px-3 py-2.5 uppercase"
              onClick={() => {
                setActiveTab(tab)
                setIsMenuOpen(false)
              }}
            >
              {tab}

              {tab === 'favorites' && (
                <span className="bg-fx-lime-500 text-fx-neutral-900 ml-2 rounded-full px-2 py-1 text-xs font-bold">
                  {favorites.length}
                </span>
              )}

              {tab === 'log' && (
                <span className="bg-fx-lime-500 text-fx-neutral-900 ml-2 rounded-full px-2 py-1 text-xs font-bold">
                  {logs.length}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {historyTabContent && <HistoryContent />}
      {compareTabContent && <CompareContent />}
      {favoritesTabContent && <FavoritesContent />}
      {logTabContent && <LogContent />}
    </div>
  )
}

export default MobileTabs
