import TextInput from '@/components/ui/TextInput';
import { useAuth } from '@/context/AuthContext';
import { authAPI, LoginRequest } from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
	const router = useRouter();
	const { signIn } = useAuth();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<LoginRequest>({
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState<Partial<LoginRequest>>({});

	const validateForm = (): boolean => {
		const newErrors: Partial<LoginRequest> = {};

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email is invalid';
		}

		if (!formData.password.trim()) {
			newErrors.password = 'Password is required';
		} else if (formData.password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleLogin = async () => {
		if (!validateForm()) return;

		try {
			setLoading(true);
			const response = await authAPI.login(formData);
			console.log('🔧 Manual login API response:', response);
			// Sign in with the response data (API service now handles nested structure)
			await signIn(response.user, response.token);

			// Router will automatically navigate to the main app based on AuthContext
		} catch (error: any) {
			console.error('Login Error:', error);

			let errorMessage = 'An error occurred during login. Please try again.';

			if (error.response?.status === 401) {
				errorMessage = 'Invalid email or password. Please try again.';
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			}

			Alert.alert('Login Failed', errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const navigateToRegister = () => {
		router.push('/register');
	};

	const navigateBack = () => {
		router.back();
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardAvoid}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.header}>
						<Image
							source={require('../assets/images/SplashOptimized.png')}
							style={styles.logo}
							resizeMode="contain"
						/>
						<Text style={styles.title}>Welcome Back</Text>
						<Text style={styles.subtitle}>Sign in to your account</Text>
					</View>

					<View style={styles.formContainer}>
						<TextInput
							label="Email"
							value={formData.email}
							onChangeText={(text) => setFormData({ ...formData, email: text })}
							error={errors.email}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							placeholder="Enter your email"
						/>

						<TextInput
							label="Password"
							value={formData.password}
							onChangeText={(text) =>
								setFormData({ ...formData, password: text })
							}
							error={errors.password}
							isPassword
							placeholder="Enter your password"
						/>

						<TouchableOpacity
							style={[styles.loginButton, loading && styles.buttonDisabled]}
							onPress={handleLogin}
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Text style={styles.buttonText}>Sign In</Text>
							)}
						</TouchableOpacity>

						<View style={styles.footer}>
							<Text style={styles.footerText}>Don&apos;t have an account?</Text>
							<TouchableOpacity onPress={navigateToRegister}>
								<Text style={styles.linkText}>Sign Up</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity style={styles.backButton} onPress={navigateBack}>
							<Text style={styles.backButtonText}>Back</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	keyboardAvoid: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		padding: 20,
	},
	header: {
		alignItems: 'center',
		marginBottom: 40,
	},
	logo: {
		width: 120,
		height: 120,
		marginBottom: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 8,
		color: '#333',
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
	},
	formContainer: {
		width: '100%',
	},
	loginButton: {
		backgroundColor: '#58C096',
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 20,
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
	},
	footerText: {
		fontSize: 16,
		color: '#666',
	},
	linkText: {
		fontSize: 16,
		color: '#58C096',
		fontWeight: '600',
	},
	backButton: {
		alignItems: 'center',
		padding: 10,
	},
	backButtonText: {
		fontSize: 16,
		color: '#666',
	},
});
