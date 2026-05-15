'use client'

import { motion, AnimatePresence } from 'framer-motion'

type ConfirmDialogProps = {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Hapus',
  cancelText = 'Batal',
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-base-200 border border-gold/10 rounded-2xl p-6 max-w-sm w-full shadow-xl"
          >
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-gray-400">{message}</p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
