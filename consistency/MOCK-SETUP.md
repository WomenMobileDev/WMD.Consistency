# 🎭 Mock Data Setup Guide

## 🚀 Quick Start

By default, **mock data is ENABLED** in development mode. Your app will use fake data instead of real API calls.

## 🔧 How to Switch Between Mock and Real API

### Option 1: Config File (Recommended)
Edit `mocks/config.ts`:
```typescript
export const mockConfig = {
  ENABLE_MOCKING: true,  // ← Change this to false for real API
  DEBUG_LOGS: true,
  REAL_API_URL: 'https://11b204d31f58.ngrok-free.app/api/v1',
};
```

### Option 2: Runtime Toggle
In your React Native debugger console:
```javascript
// Enable mock data
import { enableMocking } from '@/mocks';
enableMocking();

// Use real API
import { disableMocking } from '@/mocks';
disableMocking();
```

## 📱 Current Mock Data

### 🏆 Habits (3 items)
1. **"New goal"** - dsfds
2. **"Daily Reading"** - Read for at least 20 minutes every day  
3. **"Morning Workout"** - Exercise for 30 minutes each morning

All habits have:
- `user_id: 2`
- `color: "#6366F1"`
- `icon: "flag"`
- `status: "inactive"`

## 🎯 What's Mocked

- ✅ `GET /api/v1/habits` - Returns 3 mock habits
- ✅ `POST /api/v1/auth/login` - Always succeeds with mock user
- ✅ Test endpoint for verification

## 🔍 Console Messages

When mocking is **ENABLED**:
```
🔧 API mocking is ENABLED
🔧 All API calls will use mock data
✅ Habits loaded: 3 habits
📋 Habit names: ["New goal", "Daily Reading", "Morning Workout"]
```

When mocking is **DISABLED**:
```
🔧 API mocking is DISABLED  
🔧 API calls will go to real endpoints
```

## 🛠️ Adding More Mock Data

Edit `mocks/server.ts` and add to `mockResponses`:
```typescript
const mockResponses: Record<string, any> = {
  'GET:https://11b204d31f58.ngrok-free.app/api/v1/habits': {
    success: true,
    message: "Resource fetched successfully",
    data: mockHabits  // ← Add more items to mockHabits array
  },
  // Add more endpoints here
};
```

## 🔄 Development Workflow

1. **Start with mocks** - Develop UI with consistent fake data
2. **Test edge cases** - Modify mock data to test different scenarios
3. **Switch to real API** - Test with actual backend
4. **Toggle as needed** - Easy switching during development

## 📊 Benefits

- 🚀 **Fast development** - No network delays
- 🔄 **Consistent data** - Same results every time
- 🧪 **Easy testing** - Modify mock data for edge cases
- 📱 **Offline development** - Work without internet
- 🎛️ **Quick switching** - Toggle between mock/real API
