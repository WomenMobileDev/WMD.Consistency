import TextInput from '@/components/ui/TextInput';
import { useAuth } from '@/context/AuthContext';
import { authAPI, RegisterRequest } from '@/services/api';
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

export default function RegisterScreen() {
	const router = useRouter();
	const { signIn } = useAuth();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<RegisterRequest>({
		name: '',
		email: '',
		password: '',
		confirm_password: '',
	});
	const [errors, setErrors] = useState<Partial<RegisterRequest>>({});

	const validateForm = (): boolean => {
		const newErrors: Partial<RegisterRequest> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Name is required';
		} else if (formData.name.trim().length < 2) {
			newErrors.name = 'Name must be at least 2 characters';
		}

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

		if (!formData.confirm_password.trim()) {
			newErrors.confirm_password = 'Please confirm your password';
		} else if (formData.password !== formData.confirm_password) {
			newErrors.confirm_password = 'Passwords do not match';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleRegister = async () => {
		if (!validateForm()) return;

		try {
			setLoading(true);
			console.log('🔐 Starting registration...');
			const response = await authAPI.register(formData);
			console.log('📦 Registration API response:', response);

			if (response.token && response.user) {
				console.log('✅ Registration successful for:', response.user.name);
				// Sign in with the response data
				await signIn(response.user, response.token);
				console.log('🎯 Auth context sign-in completed');
			} else {
				console.error('🚫 Missing token or user in registration response:', {
					hasToken: !!response.token,
					hasUser: !!response.user,
					responseKeys: Object.keys(response)
				});
				throw new Error('Invalid response from registration API - missing token or user data');
			}

			// Router will automatically navigate to the main app based on AuthContext
		} catch (error: any) {
			console.error('Registration Error:', error);

			let errorMessage =
				'An error occurred during registration. Please try again.';

			if (error.response?.status === 400) {
				errorMessage =
					'Invalid registration data. Please check your information.';
			} else if (error.response?.status === 409) {
				errorMessage = 'An account with this email already exists.';
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			}

			Alert.alert('Registration Failed', errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const navigateToLogin = () => {
		router.push('/login');
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
						<Text style={styles.title}>Create Account</Text>
						<Text style={styles.subtitle}>Sign up to get started</Text>
					</View>

					<View style={styles.formContainer}>
						<TextInput
							label="Full Name"
							value={formData.name}
							onChangeText={(text) => setFormData({ ...formData, name: text })}
							error={errors.name}
							autoCapitalize="words"
							placeholder="Enter your full name"
						/>

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

						<TextInput
							label="Confirm Password"
							value={formData.confirm_password}
							onChangeText={(text) =>
								setFormData({ ...formData, confirm_password: text })
							}
							error={errors.confirm_password}
							isPassword
							placeholder="Confirm your password"
						/>

						<TouchableOpacity
							style={[styles.registerButton, loading && styles.buttonDisabled]}
							onPress={handleRegister}
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Text style={styles.buttonText}>Create Account</Text>
							)}
						</TouchableOpacity>

						<View style={styles.footer}>
							<Text style={styles.footerText}>Already have an account? </Text>
							<TouchableOpacity onPress={navigateToLogin}>
								<Text style={styles.linkText}>Sign In</Text>
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
	registerButton: {
		backgroundColor: '#636DEC',
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
		color: '#636DEC',
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
