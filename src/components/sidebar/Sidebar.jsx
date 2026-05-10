'use client'
 
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  LuBadgeCheck,
  LuCalendarClock,
  LuCalendarDays,
  LuCircleDot,
  LuLayers3,
  LuLayoutList,
  LuPin,
  LuSparkles,
  LuTriangleAlert,
} from 'react-icons/lu'
import {
  closeMobileSidebar,
  selectPriority,
  selectView,
} from '@/redux/slices/tasksSlices'
import { getTodayISO, toISODate } from '@/lib/dateUtils'

const Sidebar = () => {
  const dispatch = useDispatch()
  const tasks = useSelector(state => state.tasks.tasks)
  const aiPlan = useSelector(state => state.tasks.aiPlan)
  const selectedPriority = useSelector(state => state.tasks.selectedPriority)
  const selectedView = useSelector(state => state.tasks.selectedView)
  const isMobileSidebarOpen = useSelector(state => state.tasks.isMobileSidebarOpen)

  const sheetRef = useRef(null)
  const lastActiveElementRef = useRef(null)
  const bodyOverflowRef = useRef('')

  const getFocusableElements = useCallback(root => {
    if (!root) return []
    const nodes = root.querySelectorAll(
      'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )
    return Array.from(nodes).filter(el => {
      if (!(el instanceof HTMLElement)) return false
      const style = window.getComputedStyle(el)
      return style.visibility !== 'hidden' && style.display !== 'none'
    })
  }, [])

  const onSheetKeyDown = useCallback(
    e => {
      if (e.key === 'Escape') {
        e.preventDefault()
        dispatch(closeMobileSidebar())
        return
      }

      if (e.key !== 'Tab') return

      const sheet = sheetRef.current
      if (!sheet) return

      const focusables = getFocusableElements(sheet)
      if (!focusables.length) {
        e.preventDefault()
        sheet.focus()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement

      if (e.shiftKey) {
        if (active === first || !(active instanceof Node) || !sheet.contains(active)) {
          e.preventDefault()
          last.focus()
        }
        return
      }

      if (active === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [dispatch, getFocusableElements]
  )

  useEffect(() => {
    if (!isMobileSidebarOpen) return

    lastActiveElementRef.current = document.activeElement
    bodyOverflowRef.current = document.body.style.overflow || ''
    document.body.style.overflow = 'hidden'

    const sheet = sheetRef.current
    if (sheet) {
      const focusables = getFocusableElements(sheet)
      const target = focusables[0] || sheet
      requestAnimationFrame(() => target.focus?.())
    }

    return () => {
      document.body.style.overflow = bodyOverflowRef.current || ''
      const prev = lastActiveElementRef.current
      if (prev && typeof prev.focus === 'function') prev.focus()
    }
  }, [getFocusableElements, isMobileSidebarOpen])

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
      'group w-full flex items-center justify-between rounded-xl px-3 py-2.5 transition',
      activeView === view
        ? 'bg-gray-950 text-white shadow-sm'
        : 'text-gray-600 hover:bg-white hover:text-gray-950',
    ].join(' ')

  const viewIconClass = view =>
    [
      'grid h-8 w-8 place-items-center rounded-lg transition',
      activeView === view
        ? 'bg-white/15 text-white'
        : 'bg-white text-gray-500 group-hover:text-gray-900',
    ].join(' ')

  const countClass = view =>
    [
      'text-xs font-bold',
      activeView === view ? 'text-white/80' : 'text-gray-400',
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
      className="flex min-h-full flex-col"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-950">Workspace</h2>
          <p className="mt-1 text-xs font-medium text-gray-500">
            {tasks.length} total tasks
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-3">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-950">
          <LuSparkles className="h-4 w-4 text-yellow-600" />
          Smart manager
        </div>
        <p className="mt-1 text-xs leading-5 text-gray-600">
          Let AI rank what matters and apply changes only after review.
        </p>
      </div>

      <div className="mt-6">
        <p className="px-3 text-[11px] font-bold tracking-widest text-gray-400">
          TASKS
        </p>
        <nav className="mt-3 space-y-1.5">
          <motion.button
            type="button"
            onClick={() => onSelectView('smart')}
            className={viewButtonClass('smart')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm font-semibold">
              <span className={viewIconClass('smart')}>
                <LuSparkles className="h-4 w-4" />
              </span>
              Smart Plan
            </span>
            <span className={countClass('smart')}>
              {aiPlan?.recommendations?.length || 0}
            </span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onSelectView('all')}
            className={viewButtonClass('all')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm font-semibold">
              <span className={viewIconClass('all')}>
                <LuLayoutList className="h-4 w-4" />
              </span>
              All tasks
            </span>
            <span className={countClass('all')}>{viewCounts.all}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onSelectView('today')}
            className={viewButtonClass('today')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm font-semibold">
              <span className={viewIconClass('today')}>
                <LuCalendarDays className="h-4 w-4" />
              </span>
              Today
            </span>
            <span className={countClass('today')}>{viewCounts.today}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onSelectView('upcoming')}
            className={viewButtonClass('upcoming')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm font-semibold">
              <span className={viewIconClass('upcoming')}>
                <LuCalendarClock className="h-4 w-4" />
              </span>
              Upcoming
            </span>
            <span className={countClass('upcoming')}>{viewCounts.upcoming}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onSelectView('overdue')}
            className={viewButtonClass('overdue')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm font-semibold">
              <span className={viewIconClass('overdue')}>
                <LuTriangleAlert className="h-4 w-4" />
              </span>
              Overdue
            </span>
            <span className={countClass('overdue')}>{viewCounts.overdue}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onSelectView('ongoing')}
            className={viewButtonClass('ongoing')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm font-semibold">
              <span className={viewIconClass('ongoing')}>
                <LuCircleDot className="h-4 w-4" />
              </span>
              Ongoing
            </span>
            <span className={countClass('ongoing')}>{viewCounts.ongoing}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onSelectView('completed')}
            className={viewButtonClass('completed')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm font-semibold">
              <span className={viewIconClass('completed')}>
                <LuBadgeCheck className="h-4 w-4" />
              </span>
              Completed
            </span>
            <span className={countClass('completed')}>{viewCounts.completed}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onSelectView('sticky')}
            className={viewButtonClass('sticky')}
            {...pop}
          >
            <span className="flex items-center gap-3 text-sm font-semibold">
              <span className={viewIconClass('sticky')}>
                <LuPin className="h-4 w-4" />
              </span>
              Sticky Wall
            </span>
            <span className={countClass('sticky')}>{viewCounts.sticky}</span>
          </motion.button>
        </nav>
      </div>

      <div className="mt-7">
        <p className="px-3 text-[11px] font-bold tracking-widest text-gray-400">
          PRIORITY
        </p>
        <div className="mt-3 space-y-2 text-sm text-gray-700">
          <motion.button
            type="button"
            onClick={() => onSelectPriority(null)}
            className={[
              'w-full flex items-center justify-between rounded-xl px-3 py-2.5',
              selectedPriority === null
                ? 'bg-white shadow-sm border border-gray-200'
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
              'w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left',
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
              'w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left',
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
              'w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left',
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
      <div className="hidden h-full w-[292px] shrink-0 md:block">
        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 28 }}
          className="flex h-full min-h-0 flex-col overflow-y-auto border-r border-gray-100 bg-[#f6f8fb] px-4 py-5"
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
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-black/30"
              onClick={() => dispatch(closeMobileSidebar())}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="absolute inset-x-0 bottom-0 flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-t-2xl border-t bg-[#f6f8fb] px-5 py-5 shadow-xl"
              ref={sheetRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              onKeyDown={onSheetKeyDown}
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
