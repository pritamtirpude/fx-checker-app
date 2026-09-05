import useClickOutside from '@/hooks/useClickOutside'
import { motion } from 'motion/react'
import { useEffect } from 'react'

type ClearLogModalProps = {
  count: number
  onClose: () => void
  onConfirm: () => void
}

function ClearLogModal({ count, onClose, onConfirm }: ClearLogModalProps) {
  const ref = useClickOutside<HTMLDialogElement>(onClose)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    dialog.showModal()
    return () => dialog.close()
  }, [ref])

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <>
      {/*
        The panel fades out first, then the backdrop clears — fading both
        at once let the page's bright content show through the panel's
        low-contrast dark background while its (higher-contrast) text
        stayed visible far longer, reading as "text floating with no
        panel" instead of a clean fade.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs"
      />
      {/*
        The <dialog> itself is left unanimated: it's a native top-layer
        element, and animating opacity/scale directly on it composites
        inconsistently mid-transition (the background can drop out while
        text/buttons stay opaque). Instead it's a full-viewport, invisible
        shell that just hosts and centers the actual animated panel below.
      */}
      <motion.dialog
        onCancel={(event) => {
          event.preventDefault()
          onClose()
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        ref={ref}
        className="bg-fx-neutral-700 fixed top-1/2 left-1/2 z-50 flex w-[90%] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg p-5 text-center outline-none md:max-w-85"
      >
        <h2 className="text-preset-3 text-fx-neutral-50">
          Clear the conversion log?
        </h2>
        <p className="text-preset-5 text-fx-neutral-200">
          This will permanently remove all {count} logged{' '}
          {count === 1 ? 'conversion' : 'conversions'}. This action cannot be
          undone.
        </p>

        <div className="mt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-preset-6 outline-fx-neutral-500 hover:outline-fx-neutral-400 text-fx-neutral-200 cursor-pointer rounded-lg px-4 py-2.5 uppercase outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="text-preset-6 bg-fx-red-500 text-fx-neutral-900 cursor-pointer rounded-lg px-4 py-2.5 uppercase"
          >
            Clear log
          </button>
        </div>
      </motion.dialog>
    </>
  )
}

export default ClearLogModal
