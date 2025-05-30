import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

// Define the user type
type User = {
	id: string;
	name: string;
	email: string;
	picture: string;
} | null;

// Define the context type
type AuthContextType = {
	user: User;
	signIn: (userData: User) => void;
	signOut: () => void;
	isLoading: boolean;
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
	user: null,
	signIn: () => {},
	signOut: () => {},
	isLoading: true,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap the app
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User>(null);
	const [isLoading, setIsLoading] = useState(true);
	const segments = useSegments();
	const router = useRouter();

	// Check if the user is authenticated
	useEffect(() => {
		const checkUser = async () => {
			try {
				const userJSON = await AsyncStorage.getItem('@user_info');
				if (userJSON) {
					setUser(JSON.parse(userJSON));
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

		if (!user && !inAuthGroup && !inOnboarding && !inSignIn) {
			// If the user is not signed in and not on an auth screen, redirect to onboarding
			router.replace('/onboarding');
		} else if (user && (inAuthGroup || inOnboarding || inSignIn)) {
			// If the user is signed in and on an auth screen, redirect to the app
			router.replace('/(tabs)');
		}
	}, [user, segments, isLoading]);

	// Sign in function
	const signIn = async (userData: User) => {
		try {
			if (userData) {
				await AsyncStorage.setItem('@user_info', JSON.stringify(userData));
				setUser(userData);
			}
		} catch (error) {
			console.error('Error saving user data:', error);
		}
	};

	// Sign out function
	const signOut = async () => {
		try {
			await AsyncStorage.removeItem('@user_info');
			setUser(null);
		} catch (error) {
			console.error('Error removing user data:', error);
		}
	};

	return (
		<AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}
