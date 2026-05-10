import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getTasks,
  createTaskService,
  updateTaskService,
  deleteTaskService,
} from '@/services/tasksService'
import {
  analyzeTasksService,
  applyAiPlanService,
} from '@/services/aiTasksService'

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  return getTasks()
})

export const createTask = createAsyncThunk('tasks/createTask', async payload => {
  return createTaskService(payload)
})

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }) => {
    return updateTaskService({ id, updates })
  }
)

export const deleteTask = createAsyncThunk('tasks/deleteTask', async id => {
  return deleteTaskService(id)
})

export const analyzeTasks = createAsyncThunk('tasks/analyzeTasks', async () => {
  return analyzeTasksService()
})

export const applyAiPlan = createAsyncThunk(
  'tasks/applyAiPlan',
  async recommendations => {
    return applyAiPlanService(recommendations)
  }
)

const initialState = {
  tasks: [],
  selectedTaskId: null,
  selectedPriority: null,
  selectedView: 'today',
  isMobileSidebarOpen: false,
  fetchStatus: 'idle',
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
  aiAnalyzeStatus: 'idle',
  aiApplyStatus: 'idle',
  aiPlan: null,
  aiError: null,
  error: null,
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    selectTask(state, action) {
      state.selectedTaskId = action.payload
    },
    selectPriority(state, action) {
      state.selectedPriority = action.payload
    },
    selectView(state, action) {
      state.selectedView = action.payload
    },
    toggleMobileSidebar(state) {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen
    },
    closeMobileSidebar(state) {
      state.isMobileSidebarOpen = false
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.fetchStatus = 'loading'
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded'
        state.tasks = action.payload
        if (!state.selectedTaskId && state.tasks[0]?._id) {
          state.selectedTaskId = state.tasks[0]._id
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.fetchStatus = 'failed'
        state.error = action.error?.message || 'Failed to load tasks'
      })
      .addCase(createTask.pending, state => {
        state.createStatus = 'loading'
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.tasks.unshift(action.payload)
        if (action.payload?._id) {
          state.selectedTaskId = action.payload._id
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.error = action.error?.message || 'Failed to create task'
      })
      .addCase(updateTask.pending, state => {
        state.updateStatus = 'loading'
        state.error = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded'
        const idx = state.tasks.findIndex(t => t._id === action.payload?._id)
        if (idx !== -1) state.tasks[idx] = action.payload
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.updateStatus = 'failed'
        state.error = action.error?.message || 'Failed to update task'
      })
      .addCase(deleteTask.pending, state => {
        state.deleteStatus = 'loading'
        state.error = null
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded'
        state.tasks = state.tasks.filter(t => t._id !== action.payload)
        if (state.selectedTaskId === action.payload) {
          state.selectedTaskId = state.tasks[0]?._id ?? null
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.deleteStatus = 'failed'
        state.error = action.error?.message || 'Failed to delete task'
      })
      .addCase(analyzeTasks.pending, state => {
        state.aiAnalyzeStatus = 'loading'
        state.aiError = null
      })
      .addCase(analyzeTasks.fulfilled, (state, action) => {
        state.aiAnalyzeStatus = 'succeeded'
        state.aiPlan = action.payload
      })
      .addCase(analyzeTasks.rejected, (state, action) => {
        state.aiAnalyzeStatus = 'failed'
        state.aiError = action.error?.message || 'Failed to analyze tasks'
      })
      .addCase(applyAiPlan.pending, state => {
        state.aiApplyStatus = 'loading'
        state.aiError = null
      })
      .addCase(applyAiPlan.fulfilled, (state, action) => {
        state.aiApplyStatus = 'succeeded'
        const updatedTasks = action.payload?.updatedTasks || []
        updatedTasks.forEach(updated => {
          const idx = state.tasks.findIndex(t => t._id === updated?._id)
          if (idx !== -1) state.tasks[idx] = updated
        })
      })
      .addCase(applyAiPlan.rejected, (state, action) => {
        state.aiApplyStatus = 'failed'
        state.aiError =
          action.error?.message || 'Failed to apply AI recommendations'
      })
  },
})

export const {
  selectTask,
  selectPriority,
  selectView,
  toggleMobileSidebar,
  closeMobileSidebar,
} = tasksSlice.actions
export default tasksSlice.reducer
