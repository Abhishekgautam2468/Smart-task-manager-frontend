'use client'

import React from 'react'
import ModalShell from './ModalShell'

const ConfirmModal = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading,
  onConfirm,
  onClose,
}) => {
  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="space-y-5">
        <p className="text-sm text-gray-700">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-60"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-400 active:bg-red-300 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting…' : confirmText}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

export default ConfirmModal

