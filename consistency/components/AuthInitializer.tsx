import { setCredentials } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userJSON = await AsyncStorage.getItem('@user_info');
        const token = await AsyncStorage.getItem('@auth_token');

        if (userJSON && token) {
          const user = JSON.parse(userJSON);
          console.log('🔄 Initializing Redux auth state from AsyncStorage');
          dispatch(setCredentials({ user, token }));
        } else {
          console.log('📝 No stored auth data found');
        }
      } catch (error) {
        console.error('❌ Error initializing auth state:', error);
      }
    };

    initializeAuth();
  }, [dispatch]);

  return null; // This component doesn't render anything
}
