# Authentication System

This app now includes a complete email/password authentication system with the following features:

## Features

### 🔐 Login Screen (`/login`)

- Email and password authentication
- Form validation with error messages
- Loading states and error handling
- Navigation to register screen
- Responsive design with keyboard handling

### 📝 Register Screen (`/register`)

- User registration with name, email, password, and password confirmation
- Comprehensive form validation
- Password matching validation
- Automatic sign-in after successful registration
- Navigation to login screen

### 🛠 Updated Sign-In Screen (`/signin`)

- Central hub for authentication options
- Email/Password authentication buttons
- Demo sign-in for development
- Google Sign-In (placeholder for future implementation)

## API Integration

### Endpoints Used

**Register Account:**

```
POST /auth/register
Body: {
  "name": "string",
  "email": "user@example.com",
  "password": "string",
  "confirm_password": "string"
}
```

**Login:**

```
POST /auth/login
Body: {
  "email": "user@example.com",
  "password": "string"
}
```

**API Response:**

```json
{
	"token": "string",
	"user": {
		"id": 0,
		"name": "string",
		"email": "user@example.com",
		"created_at": "2025-06-04T17:33:25.659Z",
		"updated_at": "2025-06-04T17:33:25.659Z"
	}
}
```

## Components

### TextInput Component (`components/ui/TextInput.tsx`)

- Reusable form input with labels and error states
- Password visibility toggle
- Customizable styling
- Built-in validation display

### API Service (`services/api.ts`)

- Axios-based HTTP client
- Type-safe API calls
- Automatic token management
- Error handling utilities

## Authentication Context

The `AuthContext` has been updated to handle:

- JWT tokens for API authentication
- Updated user structure matching API response
- Automatic token persistence in AsyncStorage
- Routing based on authentication state

## Configuration

**Important:** Update the API base URL in `services/api.ts`:

```typescript
const API_BASE_URL = 'https://your-api-endpoint.com/api'; // Replace with your actual API URL
```

## Navigation Flow

1. **App Launch** → Onboarding Screen (if not authenticated)
2. **Onboarding** → Sign-In Options Screen
3. **Sign-In Options** → Login/Register/Demo/Google
4. **Login/Register** → Main App (after successful authentication)

## Form Validation

### Login Form

- Email format validation
- Password minimum length (6 characters)
- Required field validation

### Register Form

- Name minimum length (2 characters)
- Email format validation
- Password minimum length (6 characters)
- Password confirmation matching
- Required field validation

## Error Handling

- Network errors with user-friendly messages
- API error responses with specific error codes
- Form validation errors with inline display
- Loading states during API calls

## Development

For development and testing, use the "Demo Sign In" option which creates a temporary user without requiring API connectivity.
