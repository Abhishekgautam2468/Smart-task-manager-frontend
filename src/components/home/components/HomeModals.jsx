'use client'

import React from 'react'
import ConfirmModal from '@/components/modals/ConfirmModal'
import TaskDetailsModal from '@/components/modals/TaskDetailsModal'
import TaskFormModal from '@/components/modals/TaskFormModal'

const HomeModals = ({
  detailsOpen,
  detailsTask,
  onCloseDetails,
  onChangeStatus,
  onToggleSticky,
  onEditFromDetails,
  onDeleteFromDetails,
  
  createOpen,
  createError,
  isCreating,
  onCloseCreate,
  onSubmitCreate,

  editOpen,
  editError,
  isUpdating,
  selectedTask,
  onCloseEdit,
  onSubmitEdit,

  deleteOpen,
  isDeleting,
  onCloseDelete,
  onConfirmDelete,
}) => {
  return (
    <>
      {detailsOpen && detailsTask && (
        <TaskDetailsModal
          task={detailsTask}
          onClose={onCloseDetails}
          onChangeStatus={onChangeStatus}
          onToggleSticky={onToggleSticky}
          onEdit={onEditFromDetails}
          onDelete={onDeleteFromDetails}
        />
      )}

      {createOpen && (
        <TaskFormModal
          key="create-task"
          mode="create"
          submitError={createError}
          isSubmitting={isCreating}
          onClose={onCloseCreate}
          onSubmit={onSubmitCreate}
        />
      )}

      {editOpen && selectedTask && (
        <TaskFormModal
          key={selectedTask._id}
          mode="edit"
          submitError={editError}
          initialValues={{
            title: selectedTask.title || '',
            description: selectedTask.description || '',
            dueDate: selectedTask.dueDate || '',
            priority: selectedTask.priority || 'medium',
            stickyWall: Boolean(selectedTask.stickyWall),
          }}
          isSubmitting={isUpdating}
          onClose={onCloseEdit}
          onSubmit={onSubmitEdit}
        />
      )}

      {deleteOpen && selectedTask && (
        <ConfirmModal
          title="Delete Task"
          message={`Are you sure you want to delete "${selectedTask.title}"? This action cannot be undone.`}
          confirmText="Delete"
          isLoading={isDeleting}
          onClose={onCloseDelete}
          onConfirm={onConfirmDelete}
        />
      )}
    </>
  )
}

export default HomeModals

