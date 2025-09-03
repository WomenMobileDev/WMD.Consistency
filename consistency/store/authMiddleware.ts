import AsyncStorage from '@react-native-async-storage/async-storage';
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { logout, setCredentials } from './authSlice';

// Create a listener middleware to sync auth state with AsyncStorage
export const authMiddleware = createListenerMiddleware();

// Listen for login actions and sync to AsyncStorage
authMiddleware.startListening({
  actionCreator: setCredentials,
  effect: async (action, listenerApi) => {
    try {
      const { user, token } = action.payload;
      await AsyncStorage.setItem('@user_info', JSON.stringify(user));
      await AsyncStorage.setItem('@auth_token', token);
      console.log('✅ Auth data synced to AsyncStorage');
    } catch (error) {
      console.error('❌ Error syncing auth data to AsyncStorage:', error);
    }
  },
});

// Listen for logout actions and clear AsyncStorage
authMiddleware.startListening({
  actionCreator: logout,
  effect: async (action, listenerApi) => {
    try {
      await AsyncStorage.removeItem('@user_info');
      await AsyncStorage.removeItem('@auth_token');
      console.log('✅ Auth data cleared from AsyncStorage');
    } catch (error) {
      console.error('❌ Error clearing auth data from AsyncStorage:', error);
    }
  },
});
