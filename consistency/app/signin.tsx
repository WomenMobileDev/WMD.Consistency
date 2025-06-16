import { GoogleIcon } from '@/components/GoogleIcon';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
	const { signIn: authSignIn } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	// For development and testing purposes
	const handleDemoSignIn = async () => {
		try {
			setLoading(true);

			// Create a demo user with updated structure
			const demoUser = {
				id: 123,
				name: 'Demo User',
				email: 'demo@example.com',
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			// Use our auth context to sign in with a demo token
			authSignIn(demoUser, 'demo-token-123');

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
			'Google Sign-In is currently unavailable due to authentication configuration issues. Please use the Email/Password option for now.',
			[{ text: 'OK', style: 'default' }]
		);
	};

	const navigateToLogin = () => {
		router.push('/login');
	};

	const navigateToRegister = () => {
		router.push('/register');
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
					<Text style={styles.subtitle}>
						Choose how you&apos;d like to sign in
					</Text>
				</View>

				<View style={styles.buttonContainer}>
					{/* Email/Password Authentication */}
					<TouchableOpacity
						style={[styles.signInButton, styles.emailButton]}
						onPress={navigateToLogin}
					>
						<Text style={styles.buttonText}>Sign In with Email</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.signInButton, styles.registerButton]}
						onPress={navigateToRegister}
					>
						<Text style={styles.buttonText}>Create Account</Text>
					</TouchableOpacity>

					{/* Divider */}
					<View style={styles.divider}>
						<View style={styles.dividerLine} />
						<Text style={styles.dividerText}>OR</Text>
						<View style={styles.dividerLine} />
					</View>

					{/* Demo sign-in option for development */}
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
	emailButton: {
		backgroundColor: '#58C096',
	},
	registerButton: {
		backgroundColor: '#636DEC',
	},
	googleButton: {
		backgroundColor: '#636DEC',
	},
	demoButton: {
		backgroundColor: '#ff9f43',
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
	divider: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 20,
		width: '100%',
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: '#ddd',
	},
	dividerText: {
		marginHorizontal: 15,
		fontSize: 14,
		color: '#666',
		fontWeight: '500',
	},
	noteText: {
		fontSize: 14,
		color: '#888',
		textAlign: 'center',
		marginTop: 20,
		paddingHorizontal: 20,
	},
});
