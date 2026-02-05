'use client'

import React, { useMemo, useState } from 'react'
import { toDisplayDate } from '@/lib/dateUtils'

const TaskDetails = ({
  task,
  isLoading,
  onOpenEdit,
  onOpenDelete,
  onChangeStatus,
  onToggleSticky,
}) => {
  const statusOf = t => {
    const raw = t?.status ?? (t?.completed ? 'done' : 'todo')
    if (raw == null) return 'todo'
    const normalized = String(raw).toLowerCase().trim()
    if (normalized === 'done' || normalized === 'completed') return 'done'
    if (
      normalized === 'in-progress' ||
      normalized === 'in progress' ||
      normalized === 'in_progress'
    ) {
      return 'in-progress'
    }
    if (
      normalized === 'todo' ||
      normalized === 'to-do' ||
      normalized === 'pending'
    ) {
      return 'todo'
    }
    return normalized
  }

  const status = statusOf(task)
  const [detailsOpen, setDetailsOpen] = useState(true)

  const metaRows = useMemo(() => {
    if (!task) return []
    return [
      { label: 'Due date', value: task?.dueDate ? toDisplayDate(task.dueDate) : '—' },
      {
        label: 'Priority',
        value:
          task?.priority === 'high'
            ? 'High'
            : task?.priority === 'low'
              ? 'Low'
              : 'Medium',
      },
      {
        label: 'Created',
        value: task?.createdAt ? toDisplayDate(task.createdAt) : '—',
      },
      {
        label: 'Updated',
        value: task?.updatedAt ? toDisplayDate(task.updatedAt) : '—',
      },
    ]
  }, [task])

  const statusOptions = useMemo(
    () => [
      {
        value: 'todo',
        label: 'Todo',
        container: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      },
      {
        value: 'in-progress',
        label: 'In progress',
        container: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
      },
      {
        value: 'done',
        label: 'Done',
        container: 'bg-green-50 text-green-700 hover:bg-green-100',
      },
    ],
    []
  )

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
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700">Status</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {statusOptions.map(opt => {
                  const active = status === opt.value
                  return (
                    <label
                      key={opt.value}
                      className={[
                        'flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer select-none',
                        opt.container,
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="task-status"
                        value={opt.value}
                        checked={active}
                        onChange={() => onChangeStatus?.(task, opt.value)}
                        className={[
                          'h-4 w-4',
                          opt.value === 'in-progress'
                            ? 'accent-blue-600'
                            : opt.value === 'done'
                              ? 'accent-green-600'
                              : 'accent-gray-600',
                        ].join(' ')}
                      />
                      <span className="text-sm font-medium whitespace-nowrap">
                        {opt.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center gap-3 text-sm text-gray-800 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={Boolean(task.stickyWall)}
                  onChange={() => onToggleSticky?.(task)}
                />
                Add to Sticky Wall
              </label>
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
