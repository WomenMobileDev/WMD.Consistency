// Simple Axios-based mock interceptor for React Native
import axios, { InternalAxiosRequestConfig } from 'axios';

// Polyfill BroadcastChannel for React Native/Hermes
if (typeof global.BroadcastChannel === 'undefined') {
  class BroadcastChannelPolyfill {
    name: string;
    onmessage: ((event: any) => void) | null = null;
    
    constructor(name: string) {
      this.name = name;
    }
    
    postMessage(message: any) {
      // No-op for React Native
    }
    
    addEventListener(type: string, listener: any, options?: any) {
      if (type === 'message') {
        this.onmessage = listener;
      }
    }
    
    removeEventListener(type: string, listener: any) {
      if (type === 'message') {
        this.onmessage = null;
      }
    }
    
    close() {
      // No-op for React Native
    }
  }
  
  (global as any).BroadcastChannel = BroadcastChannelPolyfill;
  console.log('🔧 BroadcastChannel polyfill added for React Native');
}

// Mock data
const mockHabits = [
  {
    id: 1,
    user_id: 2,
    name: "New goal",
    description: "dsfds",
    color: "#6366F1",
    icon: "flag",
    is_active: false,
    status: "inactive",
    created_at: "2025-08-30T13:34:19.328841+05:30",
    updated_at: "2025-08-30T13:34:19.328841+05:30",
    check_ins: []
  },
  {
    id: 2,
    user_id: 2,
    name: "Daily Reading",
    description: "Read for at least 20 minutes every day",
    color: "#6366F1",
    icon: "flag",
    is_active: true,
    status: "active",
    created_at: "2025-08-30T13:34:19.328841+05:30",
    updated_at: "2025-08-30T13:34:19.328841+05:30",
    check_ins: [
      {
        id: 1,
        streak_id: 1,
        check_in_date: "2025-08-29T15:56:03.304Z",
        notes: "Great reading session today",
        created_at: "2025-08-29T15:56:03.304Z",
        updated_at: "2025-08-29T15:56:03.304Z"
      },
      {
        id: 2,
        streak_id: 1,
        check_in_date: "2025-08-28T15:56:03.304Z",
        notes: "Finished a chapter",
        created_at: "2025-08-28T15:56:03.304Z",
        updated_at: "2025-08-28T15:56:03.304Z"
      }
    ]
  },
  {
    id: 3,
    user_id: 2,
    name: "Morning Workout",
    description: "Exercise for 30 minutes each morning",
    color: "#6366F1",
    icon: "flag",
    is_active: false,
    status: "inactive",
    created_at: "2025-08-30T13:34:19.328841+05:30",
    updated_at: "2025-08-30T13:34:19.328841+05:30",
    check_ins: []
  },
  {
    id: 4,
    user_id: 2,
    name: "Drink Water",
    description: "Drink 8 glasses of water daily",
    color: "#3B82F6",
    icon: "water",
    is_active: true,
    status: "active",
    created_at: "2025-08-30T14:00:00.000000+05:30",
    updated_at: "2025-08-30T14:00:00.000000+05:30",
    check_ins: [
      {
        id: 3,
        streak_id: 2,
        check_in_date: "2025-08-28T15:56:03.304Z",
        notes: "8 glasses completed",
        created_at: "2025-08-28T15:56:03.304Z",
        updated_at: "2025-08-28T15:56:03.304Z"
      },
      {
        id: 4,
        streak_id: 2,
        check_in_date: "2025-08-29T15:56:03.304Z",
        notes: "Staying hydrated",
        created_at: "2025-08-29T15:56:03.304Z",
        updated_at: "2025-08-29T15:56:03.304Z"
      },
      {
        id: 5,
        streak_id: 2,
        check_in_date: "2025-08-27T15:56:03.304Z",
        notes: "Good water intake today",
        created_at: "2025-08-27T15:56:03.304Z",
        updated_at: "2025-08-27T15:56:03.304Z"
      }
    ]
  },
  {
    id: 5,
    user_id: 2,
    name: "Meditation",
    description: "Practice mindfulness for 10 minutes daily",
    color: "#8B5CF6",
    icon: "flower",
    is_active: true,
    status: "active",
    created_at: "2025-08-30T14:15:00.000000+05:30",
    updated_at: "2025-08-30T14:15:00.000000+05:30",
    check_ins: [
      {
        id: 6,
        streak_id: 3,
        check_in_date: "2025-08-29T15:56:03.304Z",
        notes: "Peaceful meditation",
        created_at: "2025-08-29T15:56:03.304Z",
        updated_at: "2025-08-29T15:56:03.304Z"
      }
    ]
  }
];

let mockingEnabled = false;
let interceptorId: number | null = null;

const mockResponses: Record<string, any> = {
  // Full URL patterns (when axios makes absolute requests)
  'GET:https://11b204d31f58.ngrok-free.app/api/v1/habits': {
    success: true,
    message: "Resource fetched successfully",
    data: mockHabits
  },
  // Relative path patterns (when axios uses baseURL + relative path)
  'GET:/habits': (() => {
    console.log('🔧 MSW: Creating mock response with', mockHabits.length, 'habits');
    return {
      success: true,
      message: "Resource fetched successfully", 
      data: mockHabits
    };
  })(),
  'GET:/api/v1/habits': {
    success: true,
    message: "Resource fetched successfully",
    data: mockHabits
  },
  // Test endpoint
  'GET:https://test-msw.com/ping': {
    message: 'MSW is working!',
    timestamp: new Date().toISOString()
  },
  // Auth endpoints
  'POST:https://11b204d31f58.ngrok-free.app/api/v1/auth/login': {
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },
  'POST:/auth/login': {
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  }
};

// Function to handle check-in API
const handleCheckIn = (habitId: number, checkInData: any) => {
  console.log('🔧 MSW: Handling check-in for habit', habitId, 'with data:', checkInData);
  
  const habit = mockHabits.find(h => h.id === habitId);
  if (!habit) {
    return {
      success: false,
      message: "Habit not found"
    };
  }

  // Create new check-in entry
  const newCheckIn = {
    id: Math.max(0, ...mockHabits.flatMap(h => h.check_ins.map(c => c.id))) + 1,
    streak_id: habit.check_ins.length > 0 ? habit.check_ins[0].streak_id : Math.floor(Math.random() * 1000),
    check_in_date: new Date().toISOString(),
    notes: checkInData.notes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Add check-in to habit
  habit.check_ins.push(newCheckIn);
  habit.updated_at = new Date().toISOString();

  console.log('✅ MSW: Check-in added. Habit now has', habit.check_ins.length, 'check-ins');

  return {
    success: true,
    message: "Check-in recorded successfully",
    data: {
      check_in: newCheckIn,
      streak_count: habit.check_ins.length,
      habit: habit
    }
  };
};

export const server = {
  listen: (options?: any) => {
    if (mockingEnabled && interceptorId !== null) {
      console.log('🔧 MSW DEBUG: Already initialized, skipping setup');
      return;
    }
    
    console.log('🔧 MSW DEBUG: Setting up axios interceptor');
    
    if (interceptorId !== null) {
      axios.interceptors.request.eject(interceptorId);
    }

    interceptorId = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (!mockingEnabled) return config;

        const method = config.method?.toUpperCase() || 'GET';
        const url = config.url || '';
        const fullUrl = config.baseURL ? config.baseURL + url : url;
        
        console.log('🔧 MSW: Intercepting', method, url);
        console.log('🔧 MSW: BaseURL:', config.baseURL);
        console.log('🔧 MSW: Full URL:', fullUrl);
        
        // Special handling for check-in POST requests
        if (method === 'POST' && url.includes('check-in')) {
          console.log('🔧 MSW: CHECK-IN REQUEST DETECTED!');
          const habitIdMatch = url.match(/habits\/(\d+)\/check-in/);
          if (habitIdMatch) {
            const habitId = parseInt(habitIdMatch[1]);
            const checkInData = config.data ? JSON.parse(config.data) : {};
            const response = handleCheckIn(habitId, checkInData);
            
            console.log('✅ MSW: Check-in response:', response);
            return Promise.reject({
              config,
              isAxiosError: true,
              response: {
                data: response,
                status: response.success ? 200 : 400,
                statusText: response.success ? 'OK' : 'Bad Request',
                headers: {},
                config
              }
            });
          }
        }
        
        // Special debug for habits request
        if (url.includes('habits')) {
          console.log('🔧 MSW: HABITS REQUEST DETECTED!');
          console.log('🔧 MSW: Full URL:', url);
          console.log('🔧 MSW: Method:', method);
          console.log('🔧 MSW: Exact key would be:', `${method}:${url}`);
          console.log('🔧 MSW: Available keys:', Object.keys(mockResponses));
          console.log('🔧 MSW: Mock habits count:', mockHabits.length);
        }

        // Check for exact matches first (relative path)
        const exactKey = `${method}:${url}`;
        if (mockResponses[exactKey]) {
          console.log('✅ MSW: Mock response for', exactKey);
          return Promise.reject({
            config,
            isAxiosError: true,
            response: {
              data: mockResponses[exactKey],
              status: 200,
              statusText: 'OK',
              headers: {},
              config
            }
          });
        }

        // Check for full URL matches
        const fullUrlKey = `${method}:${fullUrl}`;
        if (mockResponses[fullUrlKey]) {
          console.log('✅ MSW: Mock response for', fullUrlKey);
          return Promise.reject({
            config,
            isAxiosError: true,
            response: {
              data: mockResponses[fullUrlKey],
              status: 200,
              statusText: 'OK',
              headers: {},
              config
            }
          });
        }

        // Pattern matching for partial URLs
        for (const key in mockResponses) {
          const [mockMethod, mockPath] = key.split(':');
          if (mockMethod === method) {
            // Check relative path match
            if (url.includes(mockPath) && !url.includes('quotable.io')) {
              console.log('✅ MSW: Mock response for', key, '(pattern match)');
              return Promise.reject({
                config,
                isAxiosError: true,
                response: {
                  data: mockResponses[key],
                  status: 200,
                  statusText: 'OK',
                  headers: {},
                  config
                }
              });
            }
            
            // Check full URL match
            if (fullUrl.includes(mockPath) && !fullUrl.includes('quotable.io')) {
              console.log('✅ MSW: Mock response for', key, '(full URL match)');
              return Promise.reject({
                config,
                isAxiosError: true,
                response: {
                  data: mockResponses[key],
                  status: 200,
                  statusText: 'OK',
                  headers: {},
                  config
                }
              });
            }
          }
        }

        console.log('→ MSW: No mock found, using real API for', method, url);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Set up response interceptor to handle our mock responses
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.config) {
          // This is our mock response, return it as successful
          console.log('🔧 MSW DEBUG: Returning mock response:', error.response.data);
          return Promise.resolve(error.response);
        }
        return Promise.reject(error);
      }
    );

    mockingEnabled = true;
    console.log('🔧 MSW DEBUG: Mock interceptor enabled');
  },

  close: () => {
    if (interceptorId !== null) {
      axios.interceptors.request.eject(interceptorId);
      interceptorId = null;
    }
    mockingEnabled = false;
    console.log('🔧 MSW DEBUG: Mock interceptor disabled');
  },

  resetHandlers: () => {
    console.log('🔧 MSW DEBUG: Handlers reset');
  },

  use: (...handlers: any[]) => {
    console.log('🔧 MSW DEBUG: Adding handlers', handlers.length);
  }
};

// Server management functions
export const startMocking = () => {
  console.log('🔧 MSW DEBUG: About to start server.listen()');
  try {
    server.listen({
      onUnhandledRequest: 'warn', // Warn about unhandled requests
    });
    console.log('🔧 MSW: Mocking enabled');
    console.log('🔧 MSW DEBUG: Server listen() completed successfully');
  } catch (error) {
    console.error('🔧 MSW DEBUG: Error in server.listen():', error);
    throw error;
  }
};

export const stopMocking = () => {
  server.close();
  console.log('🔧 MSW: Mocking disabled');
};

export const resetMocks = () => {
  server.resetHandlers();
  console.log('🔧 MSW: Handlers reset');
};

// Add runtime handler management
export const addHandlers = (...newHandlers: any[]) => {
  server.use(...newHandlers);
};

export const overrideHandlers = (...newHandlers: any[]) => {
  server.resetHandlers();
};
