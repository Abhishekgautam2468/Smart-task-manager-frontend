'use client'

import React from 'react'
import Navbar from '@/components/navbar/Navbar'
import TaskList from '@/components/tasksList/TaskList'

const HomeMainColumn = ({
  error,
  tasks,
  selectedTaskId,
  isLoading,
  onSelectTask,
  onOpenDetails,
  onChangeStatus,
  onEditTask,
  onDeleteTask,
  onOpenCreate,
}) => {
  return (
    <div className="flex-1 flex flex-col border-r">
      <Navbar />

      {error && (
        <div className="px-6 pt-4">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      <TaskList
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        isLoading={isLoading}
        onSelectTask={onSelectTask}
        onOpenDetails={onOpenDetails}
        onChangeStatus={onChangeStatus}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onOpenCreate={onOpenCreate}
      />
    </div>
  )
}

export default HomeMainColumn
