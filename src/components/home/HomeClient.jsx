'use client'

import React, { useEffect, useMemo, useState } from 'react'
import HomeMainColumn from './components/HomeMainColumn'
import HomeModals from './components/HomeModals'
import RightSidebar from './components/RightSidebar'
import { useHomeClientState } from './components/useHomeClientState'

const HomeClient = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  const {
    error,
    tasks,
    visibleTasks,
    selectedView,
    selectedPriority,
    selectedTask,
    selectedTaskId,
    detailsTask,
    fetchStatus,
    aiPlan,
    aiError,
    isCreating,
    isUpdating,
    isDeleting,
    isAnalyzing,
    isApplyingAiPlan,
    createOpen,
    editOpen,
    deleteOpen,
    detailsOpen,
    createError,
    editError,
    onSelectTask,
    onAnalyzeTasks,
    onApplyAiPlan,
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

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const onChange = () => setIsLargeScreen(query.matches)
    onChange()
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!isLargeScreen) return
    if (!detailsOpen) return
    onCloseDetails()
  }, [detailsOpen, isLargeScreen, onCloseDetails])

  const openDetails = useMemo(
    () => (isLargeScreen ? undefined : onOpenDetails),
    [isLargeScreen, onOpenDetails]
  )

  return (
    <>
      <div className="flex-1 flex min-w-0">
        <HomeMainColumn
          error={error}
          tasks={visibleTasks}
          allTasks={tasks}
          allTasksCount={tasks.length}
          selectedView={selectedView}
          selectedPriority={selectedPriority}
          selectedTaskId={selectedTaskId}
          aiPlan={aiPlan}
          aiError={aiError}
          isLoading={fetchStatus === 'loading'}
          isAnalyzing={isAnalyzing}
          isApplyingAiPlan={isApplyingAiPlan}
          onSelectTask={onSelectTask}
          onAnalyzeTasks={onAnalyzeTasks}
          onApplyAiPlan={onApplyAiPlan}
          onOpenDetails={openDetails}
          onChangeStatus={onChangeStatus}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onOpenCreate={onOpenCreate}
        />

        {selectedView !== 'smart' && (
          <RightSidebar
            selectedTask={selectedTask}
            isLoading={fetchStatus === 'loading'}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onChangeStatus={onChangeStatus}
            onToggleSticky={onToggleSticky}
          />
        )}
      </div>

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
