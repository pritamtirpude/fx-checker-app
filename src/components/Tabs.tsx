import { useFavoritesStore } from '@/store/favoritesStore'
import { useLogStore } from '@/store/logStore'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
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

const panelVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction * 80,
    filter: 'blur(8px)',
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -80,
    filter: 'blur(8px)',
  }),
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
  const [direction, setDirection] = useState(1)

  const handleTabClick = ({
    target: targetInstance,
  }: React.MouseEvent<HTMLUListElement>) => {
    if (targetInstance instanceof HTMLButtonElement) {
      const tabTitle = targetInstance.dataset.tabTitle
      if (tabTitle) {
        const previousIndex = children.findIndex(
          (child) => child.props.title === isActiveTab,
        )
        const nextIndex = children.findIndex(
          (child) => child.props.title === tabTitle,
        )

        if (nextIndex !== -1 && nextIndex !== previousIndex) {
          setDirection(nextIndex > previousIndex ? 1 : -1)
          setIsActiveTab(tabTitle)
        }
      }
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
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          {content && (
            <motion.section
              key={isActiveTab}
              custom={direction}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                bounce: 0,
              }}
              role="tabpanel"
              id="tab-panel"
              aria-labelledby={`tab-${isActiveTab}`}
            >
              {content}
            </motion.section>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default Tabs
