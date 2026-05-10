'use client'

import React from 'react'
import Navbar from '@/components/navbar/Navbar'
import SmartPanel from '@/components/smartPanel/SmartPanel'
import TaskList from '@/components/tasksList/TaskList'

const HomeMainColumn = ({
  error,
  tasks,
  allTasks,
  allTasksCount,
  selectedView,
  selectedPriority,
  selectedTaskId,
  aiPlan,
  aiError,
  isLoading,
  isAnalyzing,
  isApplyingAiPlan,
  onSelectTask,
  onAnalyzeTasks,
  onApplyAiPlan,
  onOpenDetails,
  onChangeStatus,
  onEditTask,
  onDeleteTask,
  onOpenCreate,
}) => {
  const isSmartView = selectedView === 'smart'

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

      {isSmartView ? (
        <SmartPanel
          tasks={allTasks}
          aiPlan={aiPlan}
          aiError={aiError}
          isAnalyzing={isAnalyzing}
          isApplying={isApplyingAiPlan}
          onAnalyze={onAnalyzeTasks}
          onApply={onApplyAiPlan}
        />
      ) : (
        <TaskList
          tasks={tasks}
          allTasksCount={allTasksCount}
          selectedView={selectedView}
          selectedPriority={selectedPriority}
          selectedTaskId={selectedTaskId}
          isLoading={isLoading}
          onSelectTask={onSelectTask}
          onOpenDetails={onOpenDetails}
          onChangeStatus={onChangeStatus}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onOpenCreate={onOpenCreate}
        />
      )}
    </div>
  )
}

export default HomeMainColumn
