'use client'

import React, { useMemo, useState } from 'react'
import {
  LuCalendar,
  LuCircle,
  LuCircleDot,
  LuPencil,
  LuPin,
  LuTrash2,
} from 'react-icons/lu'
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
        Icon: LuCircle,
        container: 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
      },
      {
        value: 'in-progress',
        label: 'In progress',
        Icon: LuCircleDot,
        container: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
      },
      {
        value: 'done',
        label: 'Done',
        Icon: LuCircleDot,
        container: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
      },
    ],
    []
  )

  return (
    <aside className="flex h-full flex-col border-l border-gray-100 bg-[#fbfcfe] px-5 py-5">
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
          <div className="min-h-0 overflow-auto pr-1">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Selected task
                  </p>
                  <h2 className="mt-2 break-words text-xl font-black text-gray-950">
                    {task.title}
                  </h2>
                </div>
                {task.stickyWall ? (
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-yellow-100 text-yellow-700">
                    <LuPin className="h-4 w-4" />
                  </span>
                ) : null}
              </div>

              {task.dueDate ? (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700">
                  <LuCalendar className="h-4 w-4 text-gray-500" />
                  {toDisplayDate(task.dueDate)}
                </div>
              ) : null}
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Description
              </p>
              <div className="mt-3 min-h-[112px] w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm leading-6 text-gray-700 shadow-sm">
                {task.description || '—'}
              </div>
            </div>

            <div className="mt-6">
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setDetailsOpen(v => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100"
                >
                  <span className="text-sm font-bold text-gray-900">Details</span>
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
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Status
              </p>
              <div className="mt-3 grid gap-2">
                {statusOptions.map(opt => {
                  const active = status === opt.value
                  const Icon = opt.Icon
                  return (
                    <label
                      key={opt.value}
                      className={[
                        'flex cursor-pointer select-none items-center gap-3 rounded-xl border px-3 py-2.5',
                        active ? 'ring-2 ring-gray-900/10' : '',
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
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-bold whitespace-nowrap">
                        {opt.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="mt-6">
              <label className="flex select-none items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm">
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

          <div className="mt-auto flex items-center justify-end gap-3 pt-5">
            <button
              type="button"
              onClick={onOpenDelete}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
            >
              <LuTrash2 className="h-4 w-4" />
              Delete
            </button>
            <button
              type="button"
              onClick={onOpenEdit}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-bold text-white hover:bg-gray-800 active:bg-gray-700"
            >
              <LuPencil className="h-4 w-4" />
              Edit
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
