import { motion } from 'motion/react'
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
  return (
    <li
      role="presentation"
      className="relative flex items-center justify-center px-4 py-2.5"
    >
      <button
        role="tab"
        id={`tab-${title}`}
        data-tab-title={title}
        aria-selected={isActive}
        aria-controls="tab-panel"
        className="text-preset-3 text-fx-neutral-50 cursor-pointer uppercase"
      >
        {title}
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
    <div>
      <ul
        className="border-fx-neutral-600 flex w-full items-center gap-2 border-b"
        role="tablist"
        onClickCapture={handleTabClick}
      >
        {children.map((child) =>
          React.cloneElement(child, {
            isActive: child.props.title === isActiveTab,
          }),
        )}
      </ul>

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
