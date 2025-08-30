# MSW (Mock Service Worker) Integration

This project now includes MSW for API mocking during development and testing.

## 🚀 Quick Start

MSW is automatically enabled in development mode. When you run the app, you'll see:

```
🔧 MSW: Mocking enabled
🔧 MSW: API mocking is ENABLED
🔧 MSW: All API calls will be intercepted by mock handlers
```

## 📁 File Structure

```
mocks/
├── handlers.ts     # API endpoint handlers
├── server.ts       # MSW server setup
├── index.ts        # Main exports
└── dev-utils.ts    # Development utilities
```

## 🎯 Features

### ✅ Mocked Endpoints

- **Authentication**
  - `POST /auth/register` - User registration
  - `POST /auth/login` - User login
  
- **Habits Management**
  - `GET /habits` - Fetch user habits
  - `POST /habits` - Create new habit
  - `POST /habits/:id/check-ins` - Log habit check-in
  
- **External APIs**
  - Quote API (`api.quotable.io`) - Motivational quotes

### 🔧 Development Controls

Access development utilities from the console:

```javascript
// Available in React Native debugger console
global.mswDevUtils.normal()        // Reset to normal behavior
global.mswDevUtils.slowNetwork()   // Simulate 3s delay
global.mswDevUtils.authErrors()    // Simulate auth failures
global.mswDevUtils.serverErrors()  // Simulate 500 errors
global.mswDevUtils.networkTimeout() // Simulate network timeout
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Enable/disable mocking
EXPO_PUBLIC_ENABLE_MOCKING=true

# Real API URL (when mocking disabled)
EXPO_PUBLIC_API_BASE_URL=https://your-api.com/api/v1
```

### Programmatic Control

```typescript
import { startMocking, stopMocking, mockingUtils } from '@/mocks';

// Check if mocking should be enabled
if (mockingUtils.shouldEnableMocking()) {
  startMocking();
}

// Stop mocking (use real APIs)
stopMocking();
```

## 📝 Mock Data

The mock handlers include realistic data:

- **Users**: Default test user with profile info
- **Habits**: 3 pre-loaded habits with streaks and check-ins
- **Streaks**: Automatic streak calculation and updates
- **Check-ins**: Persistent mock database simulation

## 🧪 Testing Scenarios

### Valid Login
```json
{
  "email": "any@example.com",
  "password": "any_password"
}
```

### Invalid Login (401)
```json
{
  "email": "invalid@example.com", 
  "password": "any_password"
}
```

### Error Simulation
Use dev utilities to test error handling:
- Network delays
- Authentication errors  
- Server errors (500)
- Network timeouts

## 🔄 How It Works

1. **Automatic Setup**: MSW starts automatically in `_layout.tsx`
2. **Request Interception**: All HTTP requests are intercepted
3. **Handler Matching**: Requests are matched against defined handlers
4. **Mock Responses**: Appropriate mock responses are returned
5. **Real API Fallback**: Unhandled requests can optionally pass through

## 📊 Benefits

- **Offline Development**: Work without internet/backend
- **Consistent Data**: Predictable responses for UI development
- **Error Testing**: Easy simulation of edge cases
- **Performance**: Fast responses, no network latency
- **Debugging**: Full control over API behavior

## 🚦 Production Notes

- MSW is automatically disabled in production builds
- No impact on production bundle size
- Real API calls work normally when mocking is disabled

## 🛠️ Customization

### Adding New Endpoints

Edit `mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Add new handler
  http.get('/api/v1/new-endpoint', () => {
    return HttpResponse.json({ data: 'mock response' });
  }),
  
  // ... existing handlers
];
```

### Custom Mock Data

Modify the mock data factories in `handlers.ts` to match your needs:

```typescript
const createMockHabit = (id: number, name: string) => ({
  id,
  name,
  // ... customize fields
});
```

## 🐛 Troubleshooting

### Mocking Not Working
1. Check console for MSW startup messages
2. Verify `EXPO_PUBLIC_ENABLE_MOCKING=true`
3. Ensure you're in development mode (`__DEV__ === true`)

### Real API Calls Needed
```typescript
// Temporarily disable mocking
import { stopMocking } from '@/mocks';
stopMocking();
```

### Handler Not Matching
- Check endpoint URLs match exactly
- Verify HTTP method (GET, POST, etc.)
- Check request body format

## 📚 Resources

- [MSW Documentation](https://mswjs.io/)
- [React Native Integration](https://mswjs.io/docs/getting-started/integrate/react-native)
- [API Mocking Best Practices](https://mswjs.io/docs/best-practices)
