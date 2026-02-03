import { useCallback } from 'react'

export const useTaskActions = ({ bridge, selectedTask, modals }) => {
  const onSelectTask = useCallback(
    id => {
      bridge.selectTask(id)
    },
    [bridge]
  )

  const onOpenDetails = useCallback(
    id => {
      modals.setDetailsTaskId(id)
      modals.setDetailsOpen(true)
    },
    [modals]
  )

  const onCloseDetails = useCallback(() => {
    modals.setDetailsOpen(false)
    modals.setDetailsTaskId(null)
  }, [modals])

  const onChangeStatus = useCallback(
    (task, status) => {
      bridge.updateTask({ id: task._id, updates: { status } })
    },
    [bridge]
  )

  const onToggleSticky = useCallback(
    task => {
      bridge.updateTask({
        id: task._id,
        updates: { stickyWall: !task.stickyWall },
      })
    },
    [bridge]
  )

  const onOpenCreate = useCallback(() => {
    modals.setCreateError(null)
    modals.setCreateOpen(true)
  }, [modals])

  const onCloseCreate = useCallback(() => modals.setCreateOpen(false), [modals])

  const onSubmitCreate = useCallback(
    async values => {
      const payload = {
        title: values.title.trim(),
        description: values.description?.trim() || '',
        dueDate: values.dueDate?.trim() || '',
        priority: values.priority || 'medium',
        stickyWall: Boolean(values.stickyWall),
      }

      try {
        await bridge.createTask(payload)
        modals.setCreateOpen(false)
      } catch (err) {
        const message =
          typeof err === 'string'
            ? err
            : err?.message || 'Failed to create task'
        modals.setCreateError(message)
      }
    },
    [bridge, modals]
  )

  const onCloseEdit = useCallback(() => modals.setEditOpen(false), [modals])

  const onSubmitEdit = useCallback(
    async values => {
      if (!selectedTask) return
      const updates = {
        title: values.title.trim(),
        description: values.description?.trim() || '',
        dueDate: values.dueDate?.trim() || '',
        priority: values.priority || 'medium',
        stickyWall: Boolean(values.stickyWall),
      }

      try {
        await bridge.updateTask({ id: selectedTask._id, updates })
        modals.setEditOpen(false)
      } catch (err) {
        const message =
          typeof err === 'string'
            ? err
            : err?.message || 'Failed to update task'
        modals.setEditError(message)
      }
    },
    [bridge, modals, selectedTask]
  )

  const onEditFromDetails = useCallback(() => {
    modals.setEditError(null)
    modals.setDetailsOpen(false)
    modals.setEditOpen(true)
  }, [modals])

  const onEditTask = useCallback(
    id => {
      modals.setEditError(null)
      bridge.selectTask(id)
      modals.setDetailsOpen(false)
      modals.setEditOpen(true)
    },
    [bridge, modals]
  )

  const onDeleteFromDetails = useCallback(() => {
    modals.setDetailsOpen(false)
    modals.setDeleteOpen(true)
  }, [modals])

  const onDeleteTask = useCallback(
    id => {
      bridge.selectTask(id)
      modals.setDetailsOpen(false)
      modals.setDeleteOpen(true)
    },
    [bridge, modals]
  )

  const onCloseDelete = useCallback(() => modals.setDeleteOpen(false), [modals])

  const onConfirmDelete = useCallback(async () => {
    if (!selectedTask) return
    await bridge.deleteTask(selectedTask._id)
    modals.setDeleteOpen(false)
  }, [bridge, modals, selectedTask])

  return {
    onSelectTask,
    onOpenDetails,
    onCloseDetails,

    onChangeStatus,
    onToggleSticky,

    onOpenCreate,
    onCloseCreate,
    onSubmitCreate,

    onCloseEdit,
    onSubmitEdit,

    onEditFromDetails,
    onEditTask,

    onDeleteFromDetails,
    onDeleteTask,

    onCloseDelete,
    onConfirmDelete,
  }
}
