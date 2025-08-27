import { configureStore } from '@reduxjs/toolkit'
import viewtimeReducer from './viewtimeSlice'

export const store = configureStore({
  reducer: {
    viewtimeData: viewtimeReducer
  },
})

