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
import { Platform, View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';

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
		</AuthProvider>
  );
}
