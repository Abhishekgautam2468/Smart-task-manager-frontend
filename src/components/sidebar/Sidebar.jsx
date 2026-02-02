'use client'

import React, { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  closeMobileSidebar,
  selectPriority,
  selectView,
} from '@/redux/slices/tasksSlices'
import { getTodayISO, toISODate } from '@/lib/dateUtils'

const Sidebar = () => {
  const dispatch = useDispatch()
  const tasks = useSelector(state => state.tasks.tasks)
  const selectedPriority = useSelector(state => state.tasks.selectedPriority)
  const selectedView = useSelector(state => state.tasks.selectedView)
  const isMobileSidebarOpen = useSelector(state => state.tasks.isMobileSidebarOpen)

  const viewCounts = useMemo(() => {
    const todayISO = getTodayISO()
    let all = 0
    let today = 0
    let upcoming = 0
    let overdue = 0
    let ongoing = 0
    let completed = 0
    let sticky = 0
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

    tasks.forEach(t => {
      if (t.stickyWall) sticky += 1
      const status = statusOf(t)
      if (status === 'done') {
        completed += 1
        return
      }
      all += 1
      if (status === 'in-progress') ongoing += 1
      const dueISO = toISODate(t.dueDate)
      if (status === 'in-progress') {
        if (dueISO === todayISO) today += 1
        return
      }
      if (!dueISO) {
        upcoming += 1
        return
      }
      if (dueISO === todayISO) today += 1
      else if (dueISO > todayISO) upcoming += 1
      else overdue += 1
    })

    return { all, today, upcoming, overdue, ongoing, completed, sticky }
  }, [tasks])

  const priorityCounts = useMemo(() => {
    let low = 0
    let medium = 0
    let high = 0

    tasks.forEach(t => {
      const p = t.priority || 'medium'
      if (p === 'high') high += 1
      else if (p === 'low') low += 1
      else medium += 1
    })

    return { low, medium, high }
  }, [tasks])

  const activeView =
    (selectedView || 'today') === 'pending' ? 'overdue' : selectedView || 'today'

  const viewButtonClass = view =>
    [
      'w-full flex items-center justify-between px-3 py-2 rounded-lg',
      activeView === view ? 'bg-white shadow-sm border' : 'hover:bg-white',
    ].join(' ')

  const pop = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 520, damping: 34 },
  }

  const onSelectView = view => {
    dispatch(selectView(view))
    dispatch(closeMobileSidebar())
  }

  const onSelectPriority = value => {
    dispatch(selectPriority(value))
    dispatch(closeMobileSidebar())
  }

  const sidebarBody = (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="flex flex-col"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
      </div>

      <div className="mt-4 h-px w-full bg-gray-200" />

      <div className="mt-6">
        <p className="text-[11px] tracking-widest text-gray-400 font-semibold">
          TASKS
        </p>
        <nav className="mt-3 space-y-1 text-gray-700">
          <motion.button
            type="button"
            onClick={() => onSelectView('all')}
            className={viewButtonClass('all')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm">
              <span className="text-gray-400">≡</span> All tasks
            </span>
            <span className="text-xs text-gray-500">{viewCounts.all}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onSelectView('today')}
            className={viewButtonClass('today')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm font-semibold text-gray-900">
              <span className="text-gray-400">▦</span> Today
            </span>
            <span className="text-xs text-gray-500">{viewCounts.today}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onSelectView('upcoming')}
            className={viewButtonClass('upcoming')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm">
              <span className="text-gray-400">»</span> Upcoming
            </span>
            <span className="text-xs text-gray-500">{viewCounts.upcoming}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onSelectView('overdue')}
            className={viewButtonClass('overdue')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm">
              <span className="text-gray-400">⏳</span> Overdue tasks
            </span>
            <span className="text-xs text-gray-500">{viewCounts.overdue}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onSelectView('ongoing')}
            className={viewButtonClass('ongoing')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm">
              <span className="text-gray-400">↻</span> Ongoing tasks
            </span>
            <span className="text-xs text-gray-500">{viewCounts.ongoing}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onSelectView('completed')}
            className={viewButtonClass('completed')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm">
              <span className="text-gray-400">✓</span> Completed
            </span>
            <span className="text-xs text-gray-500">{viewCounts.completed}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onSelectView('sticky')}
            className={viewButtonClass('sticky')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm">
              <span className="text-gray-400">▣</span> Sticky Wall
            </span>
            <span className="text-xs text-gray-500">{viewCounts.sticky}</span>
          </motion.button>
        </nav>
      </div>

      <div className="mt-7">
        <p className="text-[11px] tracking-widest text-gray-400 font-semibold">
          PRIORITY
        </p>
        <div className="mt-3 space-y-2 text-sm text-gray-700">
          <motion.button
            type="button"
            onClick={() => onSelectPriority(null)}
            className={[
              'w-full flex items-center justify-between px-3 py-2 rounded-lg',
              selectedPriority === null
                ? 'bg-white shadow-sm border'
                : 'hover:bg-white',
            ].join(' ')}
            {...pop}
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className="h-2.5 w-2.5 rounded bg-gray-300" />
              <span className="truncate font-semibold text-gray-900">
                All priorities
              </span>
            </span>
            <span className="text-xs text-gray-500">
              {priorityCounts.low + priorityCounts.medium + priorityCounts.high}
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => onSelectPriority('high')}
            className={[
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-left',
              selectedPriority === 'high'
                ? 'bg-white shadow-sm border'
                : 'hover:bg-white',
            ].join(' ')}
            {...pop}
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className="h-2.5 w-2.5 rounded bg-red-400" />
              <span
                className={[
                  'truncate',
                  selectedPriority === 'high'
                    ? 'font-semibold text-gray-900'
                    : '',
                ].join(' ')}
              >
                High
              </span>
            </span>
            <span className="text-xs text-gray-400">{priorityCounts.high}</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => onSelectPriority('medium')}
            className={[
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-left',
              selectedPriority === 'medium'
                ? 'bg-white shadow-sm border'
                : 'hover:bg-white',
            ].join(' ')}
            {...pop}
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className="h-2.5 w-2.5 rounded bg-yellow-400" />
              <span
                className={[
                  'truncate',
                  selectedPriority === 'medium'
                    ? 'font-semibold text-gray-900'
                    : '',
                ].join(' ')}
              >
                Medium
              </span>
            </span>
            <span className="text-xs text-gray-400">{priorityCounts.medium}</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => onSelectPriority('low')}
            className={[
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-left',
              selectedPriority === 'low'
                ? 'bg-white shadow-sm border'
                : 'hover:bg-white',
            ].join(' ')}
            {...pop}
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className="h-2.5 w-2.5 rounded bg-cyan-400" />
              <span
                className={[
                  'truncate',
                  selectedPriority === 'low'
                    ? 'font-semibold text-gray-900'
                    : '',
                ].join(' ')}
              >
                Low
              </span>
            </span>
            <span className="text-xs text-gray-400">{priorityCounts.low}</span>
          </motion.button>
        </div>
      </div>

    </motion.div>
  )

  return (
    <>
      <div className="hidden md:block w-[280px] h-full">
        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 28 }}
          className="h-full bg-gray-50 border-r px-5 py-5 flex flex-col"
        >
          {sidebarBody}
        </motion.aside>
      </div>

      <AnimatePresence>
        {isMobileSidebarOpen ? (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/40"
              onClick={() => dispatch(closeMobileSidebar())}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="absolute inset-x-0 bottom-0 w-full max-h-[85vh] overflow-auto bg-gray-50 border-t rounded-t-2xl px-5 py-5 flex flex-col shadow-xl"
              initial={{ y: 520 }}
              animate={{ y: 0 }}
              exit={{ y: 520 }}
              transition={{ type: 'spring', stiffness: 420, damping: 40 }}
            >
              {sidebarBody}
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
