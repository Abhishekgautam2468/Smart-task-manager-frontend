'use client'

import { useEffect, useMemo } from 'react'
import { computeVisibleTasks } from './homeClientState/taskVisibility'
import { useTaskActions } from './homeClientState/useTaskActions'
import { useTaskModalsState } from './homeClientState/useTaskModalsState'
import { useTasksReduxBridge } from './homeClientState/useTasksReduxBridge'

export const useHomeClientState = () => {
  const bridge = useTasksReduxBridge()
  const {
    tasks,
    selectedTaskId,
    selectedPriority,
    selectedView,
    fetchStatus,
    createStatus,
    updateStatus,
    deleteStatus,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    selectTask,
  } = bridge
  const modals = useTaskModalsState()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const visibleTasks = useMemo(() => {
    return computeVisibleTasks({
      tasks,
      selectedView,
      selectedPriority,
    })
  }, [selectedPriority, selectedView, tasks])

  useEffect(() => {
    if (!visibleTasks.length) return
    const stillVisible = visibleTasks.some(t => t._id === selectedTaskId)
    if (!stillVisible) {
      selectTask(visibleTasks[0]._id)
    }
  }, [selectTask, selectedTaskId, visibleTasks])

  const selectedTask = useMemo(() => {
    const current =
      visibleTasks.find(t => t._id === selectedTaskId) || visibleTasks[0] || null
    return current
  }, [selectedTaskId, visibleTasks])

  const detailsTask = useMemo(() => {
    if (!modals.detailsTaskId) return selectedTask
    return tasks.find(t => t._id === modals.detailsTaskId) || selectedTask
  }, [modals.detailsTaskId, selectedTask, tasks])

  const isCreating = createStatus === 'loading'
  const isUpdating = updateStatus === 'loading'
  const isDeleting = deleteStatus === 'loading'

  const actions = useTaskActions({
    bridge: {
      createTask,
      updateTask,
      deleteTask,
      selectTask,
    },
    selectedTask,
    modals,
  })

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

    createOpen: modals.createOpen,
    editOpen: modals.editOpen,
    deleteOpen: modals.deleteOpen,
    detailsOpen: modals.detailsOpen,

    createError: modals.createError,
    editError: modals.editError,

    ...actions,
}
}
