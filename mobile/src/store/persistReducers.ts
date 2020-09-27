// import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-community/async-storage';
import {persistReducer} from 'redux-persist';

export default function persistReducers(reducers: any) {
  const persistedReducer = persistReducer(
    {
      key: 'rocketMessages',
      whitelist: ['refreshRoom'],
      storage: AsyncStorage,
    },
    reducers,
  );

  return persistedReducer;
}
