import { useState } from 'react'

export const useTaskModalsState = () => {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsTaskId, setDetailsTaskId] = useState(null)
  const [createError, setCreateError] = useState(null)
  const [editError, setEditError] = useState(null)

  return {
    createOpen,
    editOpen,
    deleteOpen,
    detailsOpen,
    detailsTaskId,

    createError,
    editError,

    setCreateOpen,
    setEditOpen,
    setDeleteOpen,
    setDetailsOpen,
    setDetailsTaskId,

    setCreateError,
    setEditError,
  }
}
