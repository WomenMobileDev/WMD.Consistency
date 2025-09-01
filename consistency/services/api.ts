import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'https://11b204d31f58.ngrok-free.app/api/v1'; // Replace with your actual API URL

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add interceptor directly to this instance for debugging
api.interceptors.request.use((config) => {
	console.log('🔧 API Instance: Intercepting', config.method?.toUpperCase(), config.url);
	console.log('🔧 API Instance: BaseURL:', config.baseURL);
	return config;
}, (error) => {
	console.error('🔧 API Instance: Request error:', error);
	return Promise.reject(error);
});

// Real API - no mocking

// Types for authentication
export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	confirm_password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	token: string;
	user: {
		id: number;
		name: string;
		email: string;
		created_at: string;
		updated_at: string;
	};
}

export interface GoalRequest {
	name: string;
	description: string;
	color: string;
	icon: string;
	goal_duration: number;
	goal_unit: string;
}

export interface GoalResponse {
	id: number;
	user_id: number;
	name: string;
	description: string;
	color: string;
	icon: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	current_streak: {
		id: number;
		habit_id: number;
		target_days: number;
		current_streak: number;
		max_streak_achieved: number;
		start_date: string;
		last_check_in_date: string;
		completed_at: string | null;
		failed_at: string | null;
		status: string;
		created_at: string;
		updated_at: string;
		check_ins: Array<{
			id: number;
			streak_id: number;
			check_in_date: string;
			notes: string;
			created_at: string;
			updated_at: string;
		}>;
	};
}

export interface Habit {
	id: number;
	user_id: number;
	name: string;
	description: string;
	color: string;
	icon: string;
	is_active: boolean;
	status: string;
	created_at: string;
	updated_at: string;
	current_streak?: {
		id: number;
		habit_id: number;
		target_days: number;
		current_streak: number;
		max_streak_achieved: number;
		start_date: string;
		last_check_in_date: string;
		completed_at: string | null;
		failed_at: string | null;
		status: string;
		created_at: string;
		updated_at: string;
	};
	check_ins?: Array<{
		id: number;
		streak_id: number;
		check_in_date: string;
		notes: string;
		created_at: string;
		updated_at: string;
	}>;
}

// Authentication API functions
export const authAPI = {
	register: async (data: RegisterRequest): Promise<AuthResponse> => {
		const response = await api.post(`${API_BASE_URL}/auth/register`, data);
		return response.data;
	},

	login: async (data: LoginRequest): Promise<AuthResponse> => {
		const response = await api.post(`${API_BASE_URL}/auth/login`, data);
		return response.data;
	},

	createGoal: async (data: GoalRequest): Promise<GoalResponse> => {
		const response = await api.post(`${API_BASE_URL}/habits`, {...data,target_days:data.goal_duration});
		return response.data;
	},

	getHabits: async (): Promise<{ data: Habit[] }> => {
		console.log('🔧 API: Making habits request to:', `${API_BASE_URL}/habits`);
		console.log('🔧 API: Axios baseURL:', api.defaults.baseURL);
		console.log('🔧 API: Final URL will be:', api.defaults.baseURL + '/habits');
		const response = await api.get('/habits'); // Use relative path since baseURL is set
		console.log('🔧 API: Raw response structure:', {
			hasSuccess: !!response.data.success,
			hasData: !!response.data.data,
			dataType: Array.isArray(response.data.data) ? 'array' : typeof response.data.data,
			dataLength: response.data.data?.length,
			fullResponse: response.data
		});
		
		// Handle both mock response format and real API format
		if (response.data.success && response.data.data) {
			// Mock response format: { success: true, data: [...] }
			console.log('🔧 API: Using mock format, returning:', response.data.data.length, 'habits');
			return { data: response.data.data };
		}
		// Real API format: { data: [...] }
		console.log('🔧 API: Using real API format');
		return response.data;
	},

	createCheckIn: async (habitId: number, notes: string) => {
		console.log('🌐 Creating check-in for habit', habitId);
		const response = await api.post(
			`/habits/${habitId}/check-ins`,
			{
				notes: notes,
			}
		);
		console.log('✅ Check-in created successfully');
		return response.data;
	},
};

// Add token to requests after login
export const setAuthToken = (token: string) => {
	api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Remove token from requests
export const removeAuthToken = () => {
	delete api.defaults.headers.common['Authorization'];
};

export default api;
