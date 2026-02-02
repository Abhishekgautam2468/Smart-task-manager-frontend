'use client'

import React from 'react'
import { toDisplayDate } from '@/lib/dateUtils'

const TaskDetails = ({ task, isLoading, onOpenEdit, onOpenDelete }) => {
  return (
    <aside className="h-full bg-gray-50 border-l px-6 py-6 flex flex-col">
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-3/4 bg-gray-200 rounded" />
          <div className="h-24 w-full bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg" />
          </div>
          <div className="h-10 bg-gray-200 rounded-lg" />
        </div>
      ) : task ? (
        <>
          <div>
            <p className="text-sm font-semibold text-gray-700">Task:</p>

            <div className="mt-3">
              <p className="text-base font-medium text-gray-900">{task.title}</p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700">Description</p>
              <div className="mt-3 w-full min-h-[84px] rounded-lg border bg-white px-3 py-2 text-sm text-gray-700">
                {task.description || '—'}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs text-gray-500">Due date</p>
              <div className="mt-2 w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-700">
                {task.dueDate ? toDisplayDate(task.dueDate) : '—'}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onOpenDelete}
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 border hover:bg-gray-200 active:bg-gray-300"
            >
              Delete Task
            </button>
            <button
              type="button"
              onClick={onOpenEdit}
              className="px-5 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 active:bg-yellow-200"
            >
              Edit Task
            </button>
          </div>
        </>
      ) : (
        <div className="text-sm text-gray-500">No task selected.</div>
      )}
    </aside>
  )
}

export default TaskDetails
