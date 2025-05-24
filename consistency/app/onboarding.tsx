import { useRouter } from 'expo-router';
import React from 'react';
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	useColorScheme,
	Image,
	ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
	const colorScheme = useColorScheme();
	const router = useRouter();

	const handleGetStarted = () => {
		router.replace('/(tabs)');
	};

	return (
		<ImageBackground
			source={require('../assets/images/SplashOptimized.png')}
			style={styles.backgroundImage}
			resizeMode="cover"
		>
			<SafeAreaView style={styles.container}>
				<View style={styles.contentContainer}>
					<View style={styles.spacer} />

					{/* <ThemedText style={styles.tagline}>
						Break free, build healthy habits, build consistency.
					</ThemedText> */}

					<TouchableOpacity
						style={[styles.button, { backgroundColor: '#636DEC' }]}
						onPress={handleGetStarted}
					>
						<Text style={styles.buttonText}>
							Get Started
							<Text style={styles.arrowIcon}> →</Text>
						</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	backgroundImage: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	container: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	contentContainer: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 50,
	},
	spacer: {
		flex: 1,
	},
	tagline: {
		fontSize: 28,
		fontWeight: '500',
		textAlign: 'center',
		marginBottom: 50,
		color: '#666',
		width: '80%',
	},
	button: {
		paddingVertical: 15,
		paddingHorizontal: 25,
		borderRadius: 30,
		width: '80%',
		alignItems: 'center',
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	arrowIcon: {
		fontSize: 18,
		fontWeight: 'normal',
	},
});
