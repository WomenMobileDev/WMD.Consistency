import axios from 'axios';

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
