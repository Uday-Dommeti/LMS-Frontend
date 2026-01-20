import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { technologyApi } from '../services/technology'
import { userApi } from '../services/user'
import { quizApi } from '../services/quiz'


export const store = configureStore({
  reducer: {
    [technologyApi.reducerPath] : technologyApi.reducer,
    [userApi.reducerPath] : userApi.reducer,
    [quizApi.reducerPath] : quizApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(technologyApi.middleware),
})

setupListeners(store.dispatch)
