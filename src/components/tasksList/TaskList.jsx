'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import {
  LuBadgeCheck,
  LuClock3,
  LuListTodo,
  LuPencil,
  LuTrash2,
} from 'react-icons/lu'
import { toDisplayDate } from '@/lib/dateUtils'
import emptyStateIllustration from '@/assets/EmptyState.svg'

const Tasklist = ({
  tasks,
  selectedTaskId,
  isLoading,
  onSelectTask,
  onOpenCreate,
  onOpenDetails,
  onChangeStatus,
  onEditTask,
  onDeleteTask,
}) => {
  const [statusPickerTaskId, setStatusPickerTaskId] = useState(null)

  useEffect(() => {
    if (!statusPickerTaskId) return
    const onMouseDown = e => {
      const target = e.target
      if (!(target instanceof HTMLElement)) return
      if (target.closest?.('[data-status-picker-root="true"]')) return
      setStatusPickerTaskId(null)
    }

    const onKeyDown = e => {
      if (e.key === 'Escape') setStatusPickerTaskId(null)
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [statusPickerTaskId])

  const statusOf = t => {
    const raw = t.status ?? (t.completed ? 'done' : 'todo')
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
    if (normalized === 'todo' || normalized === 'to-do' || normalized === 'pending') {
      return 'todo'
    }
    return normalized
  }

  const priorityDotClass = priority => {
    if (priority === 'high') return 'bg-red-400'
    if (priority === 'low') return 'bg-cyan-400'
    return 'bg-yellow-400'
  }

  const statusMeta = useMemo(
    () => ({
      todo: { label: 'Todo', Icon: LuListTodo, pill: 'bg-gray-100 text-gray-700' },
      'in-progress': {
        label: 'In progress',
        Icon: LuClock3,
        pill: 'bg-blue-100 text-blue-800',
      },
      done: { label: 'Done', Icon: LuBadgeCheck, pill: 'bg-green-100 text-green-800' },
    }),
    []
  )

  const statusPillClass = status => {
    return statusMeta[status]?.pill || statusMeta.todo.pill
  }

  const iconButtonClass =
    'h-9 w-9 grid place-items-center rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200'

  return (
    <section className="h-full flex flex-col">
      <div className="px-6 py-4">
        <button
          type="button"
          onClick={onOpenCreate}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border bg-white hover:bg-gray-50 active:bg-gray-100"
        >
          <span className="text-gray-400 text-lg leading-none">+</span>
          <span className="text-sm text-gray-400">Add New Task</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[54px] rounded-lg border bg-white animate-pulse"
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-center px-6 py-10">
            <Image
              src={emptyStateIllustration}
              alt="No tasks"
              className="w-56 h-auto"
              priority
            />
            <p className="mt-6 text-lg font-semibold text-gray-900">
              No tasks found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Create a new task to get started.
            </p>
            <button
              type="button"
              onClick={onOpenCreate}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-yellow-300 active:bg-yellow-200"
            >
              + Add New Task
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => {
              const isSelected = selectedTaskId === task._id
              const status = statusOf(task)
              const StatusIcon = statusMeta[status]?.Icon || statusMeta.todo.Icon
              return (
                <div
                  key={task._id}
                  onClick={() => {
                    onSelectTask(task._id)
                    onOpenDetails?.(task._id)
                  }}
                  onKeyDown={e => {
                    if (e.key !== 'Enter' && e.key !== ' ') return
                    e.preventDefault()
                    onSelectTask(task._id)
                    onOpenDetails?.(task._id)
                  }}
                  role="button"
                  tabIndex={0}
                  aria-current={isSelected ? 'true' : undefined}
                  className={[
                    'w-full text-left flex items-start justify-between gap-4 px-4 py-3 rounded-lg border',
                    isSelected
                      ? 'bg-[#fdead6] border-gray-200'
                      : 'bg-white border-transparent hover:border-gray-200 hover:bg-gray-50',
                  ].join(' ')}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </p>

                    {(task.dueDate || task.priority || status) && (
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span
                          className={[
                            'inline-flex items-center rounded-md px-2 py-0.5 font-medium',
                            statusPillClass(status),
                          ].join(' ')}
                        >
                          {statusMeta[status]?.label || statusMeta.todo.label}
                        </span>
                        {task.dueDate && (
                          <span className="inline-flex items-center gap-2">
                            <span className="text-gray-400">🗓</span>
                            {toDisplayDate(task.dueDate)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={[
                              'h-2 w-2 rounded',
                              priorityDotClass(task.priority || 'medium'),
                            ].join(' ')}
                          />
                          {(task.priority || 'medium').slice(0, 1).toUpperCase() +
                            (task.priority || 'medium').slice(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    className="shrink-0 flex items-center gap-1 relative lg:hidden"
                    data-status-picker-root="true"
                  >
                    <button
                      type="button"
                      className={iconButtonClass}
                      onClick={e => {
                        e.stopPropagation()
                        setStatusPickerTaskId(v => (v === task._id ? null : task._id))
                      }}
                      aria-label="Change status"
                      title="Change status"
                    >
                      <StatusIcon className="h-5 w-5" />
                    </button>
                    {statusPickerTaskId === task._id && (
                      <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border bg-white shadow-lg p-1">
                        {(['todo', 'in-progress', 'done']).map(value => {
                          const Icon = statusMeta[value].Icon
                          const isActive = value === status
                          return (
                            <button
                              key={value}
                              type="button"
                              className={[
                                'w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm',
                                isActive
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700 hover:bg-gray-50',
                              ].join(' ')}
                              onClick={e => {
                                e.stopPropagation()
                                onChangeStatus?.(task, value)
                                setStatusPickerTaskId(null)
                              }}
                            >
                              <Icon className="h-4 w-4 text-gray-500" />
                              <span className="flex-1 text-left">
                                {statusMeta[value].label}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                    <button
                      type="button"
                      className={iconButtonClass}
                      onClick={e => {
                        e.stopPropagation()
                        onEditTask?.(task._id)
                        setStatusPickerTaskId(null)
                      }}
                      aria-label="Edit task"
                      title="Edit task"
                    >
                      <LuPencil className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className={iconButtonClass}
                      onClick={e => {
                        e.stopPropagation()
                        onDeleteTask?.(task._id)
                        setStatusPickerTaskId(null)
                      }}
                      aria-label="Delete task"
                      title="Delete task"
                    >
                      <LuTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Tasklist
