import React from 'react'
import TaskDetails from '@/components/taskDetails/TaskDetails'

const RightSidebar = ({
  selectedTask,
  isLoading,
  onEditTask,
  onDeleteTask,
  onChangeStatus,
  onToggleSticky,
}) => {
  return (
    <div className="hidden lg:block w-[380px] shrink-0">
      <TaskDetails
        task={selectedTask}
        isLoading={isLoading}
        onOpenEdit={() => selectedTask && onEditTask(selectedTask._id)}
        onOpenDelete={() => selectedTask && onDeleteTask(selectedTask._id)}
        onChangeStatus={onChangeStatus}
        onToggleSticky={onToggleSticky}
      />
    </div>
  )
}

export default RightSidebar
