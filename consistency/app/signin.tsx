import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ActivityIndicator,
	Alert,
	Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleIcon } from '@/components/GoogleIcon';
import { useAuth } from '@/context/AuthContext';

export default function SignInScreen() {
	const { signIn: authSignIn } = useAuth();
	const [loading, setLoading] = useState(false);

	// For development and testing purposes
	const handleDemoSignIn = async () => {
		try {
			setLoading(true);

			// Create a demo user
			const demoUser = {
				id: 'demo123',
				name: 'Demo User',
				email: 'demo@example.com',
				picture: '',
			};

			// Use our auth context to sign in
			authSignIn(demoUser);

			// Router will automatically navigate to the main app based on our AuthContext
		} catch (error) {
			console.error('Demo Sign-In Error:', error);
			Alert.alert(
				'Error',
				'An error occurred during sign in. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	// This function is a placeholder to show the error message about Google Sign-In configuration
	const showGoogleSignInInfo = () => {
		Alert.alert(
			'Google Sign-In Unavailable',
			'Google Sign-In is currently unavailable due to authentication configuration issues. Please use the Demo Sign In option for now.',
			[{ text: 'OK', style: 'default' }]
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.contentContainer}>
				<View style={styles.header}>
					<Image
						source={require('../assets/images/SplashOptimized.png')}
						style={styles.logo}
						resizeMode="contain"
					/>
					<Text style={styles.title}>Welcome to Consistency</Text>
					<Text style={styles.subtitle}>Sign in to track your journey</Text>
				</View>

				<View style={styles.buttonContainer}>
					{/* Primary sign-in option for now */}
					<TouchableOpacity
						style={[styles.signInButton, styles.demoButton]}
						onPress={handleDemoSignIn}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={styles.buttonText}>Demo Sign In</Text>
						)}
					</TouchableOpacity>

					{/* Google sign-in button (temporarily disabled) */}
					<TouchableOpacity
						style={[styles.signInButton, styles.googleButton]}
						onPress={showGoogleSignInInfo}
					>
						<View style={styles.googleIconContainer}>
							<GoogleIcon size={24} />
						</View>
						<Text style={styles.buttonText}>Sign in with Google</Text>
					</TouchableOpacity>

					<Text style={styles.noteText}>
						Note: Google Sign-In is temporarily unavailable due to
						authentication configuration issues.
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	contentContainer: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
	},
	header: {
		alignItems: 'center',
		marginTop: 60,
	},
	logo: {
		width: 150,
		height: 150,
		marginBottom: 30,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#333',
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		marginBottom: 30,
		textAlign: 'center',
	},
	buttonContainer: {
		width: '100%',
		marginBottom: 40,
		alignItems: 'center',
	},
	signInButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 30,
		padding: 15,
		marginVertical: 10,
		width: '100%',
	},
	googleButton: {
		backgroundColor: '#636DEC',
		marginTop: 20,
	},
	demoButton: {
		backgroundColor: '#58C096',
	},
	googleIconContainer: {
		marginRight: 10,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 4,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	noteText: {
		fontSize: 14,
		color: '#888',
		textAlign: 'center',
		marginTop: 20,
		paddingHorizontal: 20,
	},
});
