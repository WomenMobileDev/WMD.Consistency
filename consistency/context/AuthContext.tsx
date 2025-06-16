import { removeAuthToken, setAuthToken } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the user type to match API response
type User = {
	id: number;
	name: string;
	email: string;
	created_at: string;
	updated_at: string;
} | null;

// Define the context type
type AuthContextType = {
	user: User;
	token: string | null;
	signIn: (userData: User, authToken: string) => void;
	signOut: () => void;
	isLoading: boolean;
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
	user: null,
	token: null,
	signIn: () => {},
	signOut: () => {},
	isLoading: true,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap the app
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const segments = useSegments();
	const router = useRouter();

	// Check if the user is authenticated
	useEffect(() => {
		const checkUser = async () => {
			try {
				const userJSON = await AsyncStorage.getItem('@user_info');
				const tokenStored = await AsyncStorage.getItem('@auth_token');

				if (userJSON && tokenStored) {
					const userData = JSON.parse(userJSON);
					setUser(userData);
					setToken(tokenStored);
					setAuthToken(tokenStored);
				}
			} catch (error) {
				console.error('Error retrieving user data:', error);
			} finally {
				setIsLoading(false);
			}
		};

		checkUser();
	}, []);

	// Handle routing based on authentication
	useEffect(() => {
		if (isLoading) return;
		const inAuthGroup = segments[0] === '(auth)';
		const inOnboarding = segments[0] === 'onboarding';
		const inSignIn = segments[0] === 'signin';
		const inLogin = segments[0] === 'login';
		const inRegister = segments[0] === 'register';

		if (
			!user &&
			!inAuthGroup &&
			!inOnboarding &&
			!inSignIn &&
			!inLogin &&
			!inRegister
		) {
			// If the user is not signed in and not on an auth screen, redirect to onboarding
			router.replace('/onboarding');
		} else if (
			user &&
			(inAuthGroup || inOnboarding || inSignIn || inLogin || inRegister)
		) {
			// If the user is signed in and on an auth screen, redirect to the app
			router.replace('/(tabs)');
		}
	}, [user, segments, isLoading]);

	// Sign in function
	const signIn = async (userData: User, authToken: string) => {
		try {
			if (userData && authToken) {
				await AsyncStorage.setItem('@user_info', JSON.stringify(userData));
				await AsyncStorage.setItem('@auth_token', authToken);
				setUser(userData);
				setToken(authToken);
				setAuthToken(authToken);
			}
		} catch (error) {
			console.error('Error saving user data:', error);
		}
	};

	// Sign out function
	const signOut = async () => {
		try {
			await AsyncStorage.removeItem('@user_info');
			await AsyncStorage.removeItem('@auth_token');
			setUser(null);
			setToken(null);
			removeAuthToken();
		} catch (error) {
			console.error('Error removing user data:', error);
		}
	};

	return (
		<AuthContext.Provider value={{ user, token, signIn, signOut, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}
