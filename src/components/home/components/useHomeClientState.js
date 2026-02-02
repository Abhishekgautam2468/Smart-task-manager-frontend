'use client'

import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useMemo, useState } from 'react'
import { getTodayISO, toISODate } from '@/lib/dateUtils'
import {
  createTask,
  deleteTask,
  fetchTasks,
  selectTask,
  updateTask,
} from '@/redux/slices/tasksSlices'

export const useHomeClientState = () => {
  const dispatch = useDispatch()
  const tasks = useSelector(state => state.tasks.tasks)
  const selectedTaskId = useSelector(state => state.tasks.selectedTaskId)
  const selectedPriority = useSelector(state => state.tasks.selectedPriority)
  const selectedView = useSelector(state => state.tasks.selectedView)
  const fetchStatus = useSelector(state => state.tasks.fetchStatus)
  const createStatus = useSelector(state => state.tasks.createStatus)
  const updateStatus = useSelector(state => state.tasks.updateStatus)
  const deleteStatus = useSelector(state => state.tasks.deleteStatus)
  const error = useSelector(state => state.tasks.error)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsTaskId, setDetailsTaskId] = useState(null)
  const [createError, setCreateError] = useState(null)
  const [editError, setEditError] = useState(null)

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

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

  const visibleTasks = useMemo(() => {
    const todayISO = getTodayISO()
    const view = (selectedView || 'today') === 'pending' ? 'overdue' : (selectedView || 'today')

    const byView = tasks.filter(t => {
      if (view === 'sticky') return Boolean(t.stickyWall)
      if (view === 'completed') return statusOf(t) === 'done'
      if (view === 'ongoing') return statusOf(t) === 'in-progress'
      const status = statusOf(t)
      if (status === 'done') return false
      if (view === 'all') return true

      const dueISO = toISODate(t.dueDate)
      if (view === 'today') return dueISO === todayISO
      if (view === 'overdue') return status !== 'in-progress' && Boolean(dueISO) && dueISO < todayISO
      if (view === 'upcoming') return status !== 'in-progress' && (!dueISO || dueISO > todayISO)
      return true
    })

    const prioritized = selectedPriority
      ? byView.filter(t => (t.priority || 'medium') === selectedPriority)
      : byView

    if (view !== 'all') return prioritized

    return [...prioritized].sort((a, b) => {
      const aDue = toISODate(a.dueDate)
      const bDue = toISODate(b.dueDate)
      if (!aDue && !bDue) {
        const aCreated = a.createdAt ? Date.parse(a.createdAt) : 0
        const bCreated = b.createdAt ? Date.parse(b.createdAt) : 0
        return bCreated - aCreated
      }
      if (!aDue) return 1
      if (!bDue) return -1
      if (aDue === bDue) {
        const aCreated = a.createdAt ? Date.parse(a.createdAt) : 0
        const bCreated = b.createdAt ? Date.parse(b.createdAt) : 0
        return bCreated - aCreated
      }
      return aDue < bDue ? -1 : 1
    })
  }, [selectedPriority, selectedView, tasks])

  useEffect(() => {
    if (!visibleTasks.length) return
    const stillVisible = visibleTasks.some(t => t._id === selectedTaskId)
    if (!stillVisible) {
      dispatch(selectTask(visibleTasks[0]._id))
    }
  }, [dispatch, selectedTaskId, visibleTasks])

  const selectedTask = useMemo(() => {
    const current =
      visibleTasks.find(t => t._id === selectedTaskId) ||
      visibleTasks[0] ||
      null
    return current
  }, [selectedTaskId, visibleTasks])

  const detailsTask = useMemo(() => {
    if (!detailsTaskId) return selectedTask
    return tasks.find(t => t._id === detailsTaskId) || selectedTask
  }, [detailsTaskId, selectedTask, tasks])

  const isCreating = createStatus === 'loading'
  const isUpdating = updateStatus === 'loading'
  const isDeleting = deleteStatus === 'loading'

  const onSelectTask = id => dispatch(selectTask(id))

  const onOpenDetails = id => {
    setDetailsTaskId(id)
    setDetailsOpen(true)
  }

  const onCloseDetails = () => {
    setDetailsOpen(false)
    setDetailsTaskId(null)
  }

  const onChangeStatus = (task, status) => {
    dispatch(
      updateTask({
        id: task._id,
        updates: { status },
      })
    )
  }

  const onToggleSticky = task => {
    dispatch(
      updateTask({
        id: task._id,
        updates: { stickyWall: !task.stickyWall },
      })
    )
  }

  const onOpenCreate = () => {
    setCreateError(null)
    setCreateOpen(true)
  }

  const onCloseCreate = () => setCreateOpen(false)

  const onSubmitCreate = async values => {
    const payload = {
      title: values.title.trim(),
      description: values.description?.trim() || '',
      dueDate: values.dueDate?.trim() || '',
      priority: values.priority || 'medium',
      stickyWall: Boolean(values.stickyWall),
    }

    try {
      await dispatch(createTask(payload)).unwrap()
      setCreateOpen(false)
    } catch (err) {
      const message =
        typeof err === 'string' ? err : err?.message || 'Failed to create task'
      setCreateError(message)
    }
  }

  const onCloseEdit = () => setEditOpen(false)

  const onSubmitEdit = async values => {
    if (!selectedTask) return
    const updates = {
      title: values.title.trim(),
      description: values.description?.trim() || '',
      dueDate: values.dueDate?.trim() || '',
      priority: values.priority || 'medium',
      stickyWall: Boolean(values.stickyWall),
    }

    try {
      await dispatch(updateTask({ id: selectedTask._id, updates })).unwrap()
      setEditOpen(false)
    } catch (err) {
      const message =
        typeof err === 'string' ? err : err?.message || 'Failed to update task'
      setEditError(message)
    }
  }

  const onEditFromDetails = () => {
    setEditError(null)
    setDetailsOpen(false)
    setEditOpen(true)
  }

  const onEditTask = id => {
    setEditError(null)
    dispatch(selectTask(id))
    setDetailsOpen(false)
    setEditOpen(true)
  }

  const onDeleteFromDetails = () => {
    setDetailsOpen(false)
    setDeleteOpen(true)
  }

  const onDeleteTask = id => {
    dispatch(selectTask(id))
    setDetailsOpen(false)
    setDeleteOpen(true)
  }

  const onCloseDelete = () => setDeleteOpen(false)

  const onConfirmDelete = async () => {
    if (!selectedTask) return
    await dispatch(deleteTask(selectedTask._id)).unwrap()
    setDeleteOpen(false)
  }

  return {
    error,
    tasks,
    visibleTasks,
    selectedTask,
    selectedTaskId,
    detailsTask,

    fetchStatus,
    isCreating,
    isUpdating,
    isDeleting,

    createOpen,
    editOpen,
    deleteOpen,
    detailsOpen,

    createError,
    editError,

    onSelectTask,
    onOpenDetails,
    onEditTask,
    onDeleteTask,

    onCloseDetails,
    onChangeStatus,
    onToggleSticky,

    onOpenCreate,
    onCloseCreate,
    onSubmitCreate,

    onCloseEdit,
    onSubmitEdit,

    onEditFromDetails,
    onDeleteFromDetails,

    onCloseDelete,
    onConfirmDelete,
  }
}
