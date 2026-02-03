import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createTask,
  deleteTask,
  fetchTasks,
  selectTask,
  updateTask,
} from '@/redux/slices/tasksSlices'

export const useTasksReduxBridge = () => {
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

  const runFetchTasks = useCallback(() => dispatch(fetchTasks()), [dispatch])

  const runCreateTask = useCallback(
    payload => dispatch(createTask(payload)).unwrap(),
    [dispatch]
  )

  const runUpdateTask = useCallback(
    ({ id, updates }) => dispatch(updateTask({ id, updates })).unwrap(),
    [dispatch]
  )

  const runDeleteTask = useCallback(
    id => dispatch(deleteTask(id)).unwrap(),
    [dispatch]
  )

  const runSelectTask = useCallback(id => dispatch(selectTask(id)), [dispatch])

  return {
    tasks,
    selectedTaskId,
    selectedPriority,
    selectedView,

    fetchStatus,
    createStatus,
    updateStatus,
    deleteStatus,
    error,

    fetchTasks: runFetchTasks,
    createTask: runCreateTask,
    updateTask: runUpdateTask,
    deleteTask: runDeleteTask,
    selectTask: runSelectTask,
  }
}
