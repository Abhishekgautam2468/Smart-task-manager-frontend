'use client'

import React, { useMemo, useState } from 'react'
import ModalShell from './ModalShell'
import { toDisplayDate } from '@/lib/dateUtils'

const TaskDetailsModal = ({
  task,
  onClose,
  onEdit,
  onDelete,
  onToggleSticky,
  onChangeStatus,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(true)
  const status = task?.status || (task?.completed ? 'done' : 'todo')

  const metaRows = useMemo(() => {
    const rows = [
      { label: 'Due date', value: task?.dueDate ? toDisplayDate(task.dueDate) : 'None' },
      {
        label: 'Priority',
        value:
          task?.priority === 'high'
            ? 'High'
            : task?.priority === 'low'
              ? 'Low'
              : 'Medium',
      },
      { label: 'Created', value: task?.createdAt ? toDisplayDate(task.createdAt) : 'None' },
      { label: 'Updated', value: task?.updatedAt ? toDisplayDate(task.updatedAt) : 'None' },
    ]
    return rows
  }, [task])

  if (!task) return null

  return (
    <ModalShell title="Task Details" onClose={onClose}>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-gray-700">Title</p>
          <p className="mt-2 text-base font-semibold text-gray-900 break-words">
            {task.title}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">Description</p>
          <div className="mt-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-800 min-h-[56px] whitespace-pre-wrap">
            {task.description || '—'}
          </div>
        </div>

        <div className="rounded-xl border bg-white">
          <button
            type="button"
            onClick={() => setDetailsOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100"
          >
            <span className="text-sm font-semibold text-gray-800">Details</span>
            <span className="text-gray-500">{detailsOpen ? '▾' : '▸'}</span>
          </button>

          {detailsOpen && (
            <div className="px-4 pb-4 pt-1">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {metaRows.map(row => (
                  <React.Fragment key={row.label}>
                    <div className="text-sm text-gray-600">{row.label}</div>
                    <div className="text-sm text-gray-900">{row.value}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">Status</p>
          <select
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 text-gray-900"
            value={status}
            onChange={e => onChangeStatus?.(task, e.target.value)}
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <label className="flex items-center gap-3 text-sm text-gray-800 select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={Boolean(task.stickyWall)}
            onChange={() => onToggleSticky?.(task)}
          />
          Add to Sticky Wall
        </label>

        <div className="pt-1 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onDelete}
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 border hover:bg-gray-200 active:bg-gray-300"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="px-5 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 active:bg-yellow-200"
          >
            Edit
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

export default TaskDetailsModal
