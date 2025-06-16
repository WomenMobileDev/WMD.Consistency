import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API configuration
const API_BASE_URL = 'https://c273-122-172-83-60.ngrok-free.app/api/v1'; // Replace with your actual API URL

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

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
		const response = await api.post(`${API_BASE_URL}/habits`, data);
		return response.data;
	},

	getHabits: async (): Promise<{ data: Habit[] }> => {
		const response = await api.get(`${API_BASE_URL}/habits`);
		return response.data;
	},

	createCheckIn: async (habitId: number, notes: string) => {
		const response = await api.post(
			`${API_BASE_URL}/habits/${habitId}/check-ins`,
			{
				notes: notes,
			}
		);
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
