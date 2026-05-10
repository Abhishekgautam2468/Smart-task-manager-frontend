'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import {
  LuBadgeCheck,
  LuCalendar,
  LuClock3,
  LuListTodo,
  LuPencil,
  LuPlus,
  LuTrash2,
} from 'react-icons/lu'
import { getTodayISO, toDisplayDate, toISODate } from '@/lib/dateUtils'
import emptyStateIllustration from '@/assets/EmptyState.svg'

const Tasklist = ({
  tasks,
  allTasksCount = 0,
  selectedView,
  selectedPriority,
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

  const activeView = useMemo(() => {
    const raw = selectedView || 'today'
    return raw === 'pending' ? 'overdue' : raw
  }, [selectedView])

  const todayISO = useMemo(() => getTodayISO(), [])
  const tomorrowISO = useMemo(() => {
    const [yyyy, mm, dd] = todayISO.split('-').map(v => Number(v))
    const local = new Date(yyyy, mm - 1, dd + 1)
    const tzOffsetMs = local.getTimezoneOffset() * 60_000
    return new Date(local.getTime() - tzOffsetMs).toISOString().slice(0, 10)
  }, [todayISO])

  const dueLabel = useCallback(
    value => {
      const iso = toISODate(value)
      if (!iso) return ''
      if (iso === todayISO) return 'Today'
      if (iso === tomorrowISO) return 'Tomorrow'
      return toDisplayDate(iso)
    },
    [todayISO, tomorrowISO]
  )

  const emptyState = useMemo(() => {
    if (allTasksCount === 0) {
      return {
        title: 'No tasks found',
        description: 'Create a new task to get started.',
      }
    }

    if (selectedPriority) {
      return {
        title: 'No priority matches',
        description: 'Try a different priority filter.',
      }
    }

    if (activeView === 'overdue') {
      return {
        title: 'No overdue tasks',
        description: 'You are all caught up.',
      }
    }

    if (activeView === 'sticky') {
      return {
        title: 'Sticky Wall is empty',
        description: 'Mark a task as sticky to see it here.',
      }
    }

    return {
      title: 'No tasks found',
      description: 'Try changing filters or create a new task.',
    }
  }, [activeView, allTasksCount, selectedPriority])

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

  const viewTitle = useMemo(() => {
    const labels = {
      all: 'All tasks',
      today: 'Today',
      upcoming: 'Upcoming',
      overdue: 'Overdue',
      ongoing: 'Ongoing',
      completed: 'Completed',
      sticky: 'Sticky Wall',
    }
    return labels[activeView] || 'Tasks'
  }, [activeView])

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
    'grid h-9 w-9 place-items-center rounded-xl border border-transparent text-gray-500 hover:border-gray-200 hover:bg-white hover:text-gray-900 active:bg-gray-100'

  return (
    <section className="flex h-full flex-col bg-[#fbfcfe]">
      <div className="flex flex-col gap-3 border-b border-gray-100 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between md:px-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {selectedPriority ? `${selectedPriority} priority` : 'Overview'}
          </p>
          <h2 className="mt-1 text-2xl font-black text-gray-950">{viewTitle}</h2>
        </div>
        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-bold text-white shadow-sm hover:bg-gray-800 active:bg-gray-700"
        >
          <LuPlus className="h-4 w-4" />
          New task
        </button>
      </div>

      <div className="flex-1 overflow-auto px-5 py-5 md:px-7">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[82px] animate-pulse rounded-2xl border border-gray-100 bg-white"
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
              {emptyState.title}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {emptyState.description}
            </p>
            <button
              type="button"
              onClick={onOpenCreate}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-gray-800 active:bg-gray-700"
            >
              <LuPlus className="h-4 w-4" />
              New task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
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
                    'w-full text-left flex items-start justify-between gap-4 rounded-2xl border px-4 py-4 shadow-sm transition',
                    isSelected
                      ? 'border-gray-950 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.10)]'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)]',
                  ].join(' ')}
                >
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-gray-950">
                      {task.title}
                    </p>
                    {task.description ? (
                      <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                        {task.description}
                      </p>
                    ) : null}

                    {(task.dueDate || task.priority || status) && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span
                          className={[
                            'inline-flex items-center rounded-full px-2.5 py-1 font-bold',
                            statusPillClass(status),
                          ].join(' ')}
                        >
                          {statusMeta[status]?.label || statusMeta.todo.label}
                        </span>
                        {task.dueDate && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-700">
                            <LuCalendar className="h-3.5 w-3.5 text-gray-400" />
                            {dueLabel(task.dueDate)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-700">
                          <span
                            className={[
                              'h-2 w-2 rounded-full',
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
