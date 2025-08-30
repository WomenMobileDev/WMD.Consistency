import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { disableMocking, enableMocking, mockingUtils, startMocking } from '@/mocks';
import Toast from 'react-native-toast-message';

// Keep the splash screen visible while we fetch resources
// Must be called before any other components are rendered
SplashScreen.preventAutoHideAsync().catch(() => {
	console.warn('Failed to prevent auto hide of splash screen');
});

// Simple loading component
function LoadingScreen() {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<ActivityIndicator size="large" color="#636DEC" />
		</View>
	);
}

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	// Initialize MSW mocking
	useEffect(() => {
		console.log('🔧 Initializing API mocking...');
		
		if (mockingUtils.shouldEnableMocking()) {
			try {
				startMocking();
				mockingUtils.logMockingStatus(true);
				console.log('✅ API mocking enabled successfully');
				
				// Make toggle functions available globally for debugging
				if (__DEV__) {
					(global as any).enableMocking = enableMocking;
					(global as any).disableMocking = disableMocking;
					console.log('🎛️ Global utils: enableMocking() and disableMocking()');
				}
			} catch (error) {
				console.error('❌ Failed to start API mocking:', error);
			}
		} else {
			mockingUtils.logMockingStatus(false);
		}
	}, []);

	// Handle any errors
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	const onLayoutRootView = useCallback(async () => {
		if (loaded) {
			try {
				// Hide the splash screen after a delay
				await new Promise((resolve) => setTimeout(resolve, 1500));
				await SplashScreen.hideAsync();
			} catch (e) {
				console.warn('Error hiding splash screen:', e);
			}
		}
	}, [loaded]);

	useEffect(() => {
		if (loaded) {
			onLayoutRootView();
		}
	}, [loaded, onLayoutRootView]);

	if (!loaded) {
		return <LoadingScreen />;
	}

	return (
		<AuthProvider>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<Stack>
					<Stack.Screen name="onboarding" options={{ headerShown: false }} />
					<Stack.Screen name="signin" options={{ headerShown: false }} />
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="profile" options={{ headerShown: false }} />
				</Stack>
			</ThemeProvider>
			<Toast />
		</AuthProvider>
	);
}
