import { useFavoritesStore } from '@/store/favoritesStore'
import { useLogStore } from '@/store/logStore'
import { LayoutGroup, motion } from 'motion/react'
import type { PropsWithChildren, ReactElement, RefObject } from 'react'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'

type TabProps = PropsWithChildren<{
  title: string
  isActive?: boolean
}>

type TabsProps = {
  target?: RefObject<HTMLElement>
  defaultTab?: string
  children: ReactElement<TabProps, typeof Tab>[]
}

export function Tab({ title, isActive }: TabProps) {
  const favorites = useFavoritesStore((s) => s.favorites)
  const logs = useLogStore((s) => s.logs)

  return (
    <li
      role="presentation"
      className="has-focus-visible:outline-fx-lime-500 relative flex items-center justify-center rounded-md px-4 py-2.5 has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
    >
      <button
        role="tab"
        id={`tab-${title}`}
        data-tab-title={title}
        aria-selected={isActive}
        aria-controls="tab-panel"
        className="text-preset-3 text-fx-neutral-50 flex cursor-pointer items-center gap-2 uppercase outline-none"
      >
        {title}

        {title === 'favorites' && (
          <span className="bg-fx-lime-800 text-preset-6 text-fx-lime-500 flex size-5 items-center justify-center rounded-full leading-none">
            {favorites.length}
          </span>
        )}

        {title === 'log' && (
          <span className="bg-fx-lime-800 text-preset-6 text-fx-lime-500 flex size-5 items-center justify-center rounded-full leading-none">
            {logs.length}
          </span>
        )}
      </button>

      {isActive && (
        <motion.div
          layout
          layoutId="active-tab-indicator"
          key={title}
          className="bg-fx-lime-500 absolute top-full left-0 h-0.5 w-full"
        />
      )}
    </li>
  )
}

function Tabs({ defaultTab, children, target }: TabsProps) {
  const [isActiveTab, setIsActiveTab] = useState(
    defaultTab || children[0].props.title,
  )

  const handleTabClick = ({
    target: targetInstance,
  }: React.MouseEvent<HTMLUListElement>) => {
    if (targetInstance instanceof HTMLButtonElement) {
      const tabTitle = targetInstance.dataset.tabTitle
      if (tabTitle) setIsActiveTab(tabTitle)
    }
  }

  const content = children.find((child) => child.props.title === isActiveTab)
    ?.props.children
  return (
    <div className="hidden md:block">
      <LayoutGroup>
        <ul
          className="border-fx-neutral-600 flex w-full items-center gap-2 border-b"
          role="tablist"
          onClickCapture={handleTabClick}
        >
          {children.map((child) =>
            React.cloneElement(child, {
              key: child.props.title,
              isActive: child.props.title === isActiveTab,
            }),
          )}
        </ul>
      </LayoutGroup>

      {content && target?.current != null ? (
        createPortal(
          <div
            role="tabpanel"
            id="tab-panel"
            aria-labelledby={`tab-${isActiveTab}`}
          >
            {content}
          </div>,
          target.current,
        )
      ) : (
        <section
          role="tabpanel"
          id="tab-panel"
          aria-labelledby={`tab-${isActiveTab}`}
        >
          {content}
        </section>
      )}
    </div>
  )
}

export default Tabs
