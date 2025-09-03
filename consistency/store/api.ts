import {
    AuthResponse,
    GoalRequest,
    GoalResponse,
    Habit,
    LoginRequest,
    RegisterRequest,
    UserProfileResponse
} from '@/services/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration
const API_BASE_URL = 'https://11b204d31f58.ngrok-free.app/api/v1';

// Create the main API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
      // Try to get token from Redux state first
      const token = (getState() as any).auth?.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        console.log('🔑 Using token from Redux state');
      } else {
        // Fallback: try to get token from AsyncStorage
        try {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          const storedToken = await AsyncStorage.getItem('@auth_token');
          if (storedToken) {
            headers.set('authorization', `Bearer ${storedToken}`);
            console.log('🔑 Using token from AsyncStorage');
          } else {
            console.warn('⚠️ No auth token found in Redux or AsyncStorage');
          }
        } catch (error) {
          console.error('❌ Error getting token from AsyncStorage:', error);
        }
      }
      
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Habit', 'Profile', 'CheckIn'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Habits endpoints
    getHabits: builder.query<{ data: Habit[] }, void>({
      query: () => '/habits',
      providesTags: ['Habit'],
      transformResponse: (response: any) => {
        // Handle both mock and real API response formats
        if (response.success && response.data) {
          return { data: response.data };
        }
        return response;
      },
    }),

    createGoal: builder.mutation<GoalResponse, GoalRequest>({
      query: (goalData) => ({
        url: '/habits',
        method: 'POST',
        body: { ...goalData, target_days: goalData.goal_duration },
      }),
      invalidatesTags: ['Habit'],
    }),

    createCheckIn: builder.mutation<any, { habitId: number; notes: string }>({
      query: ({ habitId, notes }) => ({
        url: `/habits/${habitId}/check-ins`,
        method: 'POST',
        body: { notes },
      }),
      invalidatesTags: ['Habit', 'CheckIn', 'Profile'],
    }),

    // Profile endpoints
    getUserProfile: builder.query<UserProfileResponse, void>({
      query: () => '/user/profile',
      providesTags: ['Profile'],
      transformErrorResponse: (response, meta, arg) => {
        console.error('🌐 API Error:', response.status, response.data);
        
        if (response.status === 404) {
          return { message: 'Profile endpoint not available yet' };
        } else if (response.status === 401) {
          return { message: 'Authentication required' };
        } else {
          return { message: `API Error: ${response.status}` };
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetHabitsQuery,
  useCreateGoalMutation,
  useCreateCheckInMutation,
  useGetUserProfileQuery,
} = api;
