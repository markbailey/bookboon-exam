import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { api } from '../services/api';
import examProgressReducer from './examProgress';

const persistConfig = {
  key: 'examProgress',
  storage,
};

const persistedExamProgressReducer = persistReducer(persistConfig, examProgressReducer);

export const store = configureStore({
  reducer: {
    examProgress: persistedExamProgressReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
  devTools: import.meta.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
