import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './slices/tasksSlices'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
})
