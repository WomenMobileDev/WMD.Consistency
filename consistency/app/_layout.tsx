import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Keep the splash screen visible while we fetch resources
// Must be called before any other components are rendered
SplashScreen.preventAutoHideAsync().catch(() => {
	console.warn('Failed to prevent auto hide of splash screen');
});

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

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
		return null;
	}

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
				<Stack.Screen name="onboarding" />
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="+not-found" options={{ headerShown: true }} />
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
	);
}
