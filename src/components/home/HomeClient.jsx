'use client'

import React from 'react'
import HomeMainColumn from './components/HomeMainColumn'
import HomeModals from './components/HomeModals'
import { useHomeClientState } from './components/useHomeClientState'

const HomeClient = () => {
  const {
    error,
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
  } = useHomeClientState()

  return (
    <>
      <HomeMainColumn
        error={error}
        tasks={visibleTasks}
        selectedTaskId={selectedTaskId}
        isLoading={fetchStatus === 'loading'}
        onSelectTask={onSelectTask}
        onOpenDetails={onOpenDetails}
        onChangeStatus={onChangeStatus}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onOpenCreate={onOpenCreate}
      />

      <HomeModals
        detailsOpen={detailsOpen}
        detailsTask={detailsTask}
        onCloseDetails={onCloseDetails}
        onChangeStatus={onChangeStatus}
        onToggleSticky={onToggleSticky}
        onEditFromDetails={onEditFromDetails}
        onDeleteFromDetails={onDeleteFromDetails}
        createOpen={createOpen}
        createError={createError}
        isCreating={isCreating}
        onCloseCreate={onCloseCreate}
        onSubmitCreate={onSubmitCreate}
        editOpen={editOpen}
        editError={editError}
        isUpdating={isUpdating}
        selectedTask={selectedTask}
        onCloseEdit={onCloseEdit}
        onSubmitEdit={onSubmitEdit}
        deleteOpen={deleteOpen}
        isDeleting={isDeleting}
        onCloseDelete={onCloseDelete}
        onConfirmDelete={onConfirmDelete}
      />
    </>
  )
}

export default HomeClient
