'use client'

import React from 'react'

const ModalShell = ({ title, children, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 grid place-items-center rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-500"
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

export default ModalShell

