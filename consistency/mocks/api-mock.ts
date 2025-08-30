// Direct API mocking - force override the api instance
import { mockConfig } from './config';

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

// Mock responses
const mockResponses = {
  '/habits': {
    success: true,
    message: "Resource fetched successfully",
    data: mockHabits
  },
  '/auth/login': {
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

// Function to handle check-in API for direct mocking
const handleCheckInDirect = (habitId: number, checkInData: any) => {
  console.log('🔧 Direct Mock: Handling check-in for habit', habitId, 'with data:', checkInData);
  
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

  console.log('✅ Direct Mock: Check-in added. Habit now has', habit.check_ins.length, 'check-ins');

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

// Apply mocking to any axios instance
export const applyDirectMocking = (axiosInstance: any) => {
  if (!mockConfig.ENABLE_MOCKING) {
    console.log('🔧 Direct Mock: Mocking disabled');
    return;
  }

  console.log('🔧 Direct Mock: Applying direct mocking to axios instance');
  
  // Override the request method
  const originalRequest = axiosInstance.request;
  axiosInstance.request = async (config: any) => {
    const method = config.method?.toUpperCase() || 'GET';
    const url = config.url || '';
    
    console.log('🔧 Direct Mock: Intercepting', method, url);
    
    // Special handling for check-in POST requests
    if (method === 'POST' && url.includes('check-in')) {
      console.log('🔧 Direct Mock: CHECK-IN REQUEST DETECTED!');
      const habitIdMatch = url.match(/habits\/(\d+)\/check-in/);
      if (habitIdMatch) {
        const habitId = parseInt(habitIdMatch[1]);
        const checkInData = config.data || {};
        const response = handleCheckInDirect(habitId, checkInData);
        
        console.log('✅ Direct Mock: Check-in response:', response);
        return Promise.resolve({
          data: response,
          status: response.success ? 200 : 400,
          statusText: response.success ? 'OK' : 'Bad Request',
          headers: {},
          config
        });
      }
    }
    
    // Check for mock responses
    if (mockResponses[url as keyof typeof mockResponses]) {
      console.log('✅ Direct Mock: Returning mock for', url);
      const mockData = mockResponses[url as keyof typeof mockResponses];
      return Promise.resolve({
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      });
    }
    
    console.log('→ Direct Mock: No mock found, using real API');
    return originalRequest.call(axiosInstance, config);
  };

  // Also override common methods
  const originalGet = axiosInstance.get;
  axiosInstance.get = async (url: string, config?: any) => {
    console.log('🔧 Direct Mock: GET', url);
    
    if (mockResponses[url as keyof typeof mockResponses]) {
      console.log('✅ Direct Mock: Returning mock for GET', url);
      const mockData = mockResponses[url as keyof typeof mockResponses];
      return Promise.resolve({
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { ...config, url, method: 'get' }
      });
    }
    
    console.log('→ Direct Mock: No mock found for GET', url);
    return originalGet.call(axiosInstance, url, config);
  };

  // Override POST method
  const originalPost = axiosInstance.post;
  axiosInstance.post = async (url: string, data?: any, config?: any) => {
    console.log('🔧 Direct Mock: POST', url, 'with data:', data);
    
    // Special handling for check-in POST requests
    if (url.includes('check-in')) {
      console.log('🔧 Direct Mock: CHECK-IN POST REQUEST DETECTED!');
      const habitIdMatch = url.match(/habits\/(\d+)\/check-in/);
      if (habitIdMatch) {
        const habitId = parseInt(habitIdMatch[1]);
        const checkInData = data || {};
        const response = handleCheckInDirect(habitId, checkInData);
        
        console.log('✅ Direct Mock: Check-in POST response:', response);
        return Promise.resolve({
          data: response,
          status: response.success ? 200 : 400,
          statusText: response.success ? 'OK' : 'Bad Request',
          headers: {},
          config: { ...config, url, method: 'post', data }
        });
      }
    }
    
    console.log('→ Direct Mock: No mock found for POST', url);
    return originalPost.call(axiosInstance, url, data, config);
  };
  
  console.log('✅ Direct Mock: Applied to axios instance');
};