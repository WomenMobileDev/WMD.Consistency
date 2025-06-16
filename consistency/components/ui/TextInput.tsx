import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	TextInput as RNTextInput,
	StyleSheet,
	Text,
	TextInputProps,
	TouchableOpacity,
	View,
} from 'react-native';

interface CustomTextInputProps extends TextInputProps {
	label: string;
	error?: string;
	isPassword?: boolean;
}

export default function TextInput({
	label,
	error,
	isPassword = false,
	style,
	...props
}: CustomTextInputProps) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const togglePasswordVisibility = () => {
		setIsPasswordVisible(!isPasswordVisible);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<View style={[styles.inputContainer, error && styles.inputError]}>
				<RNTextInput
					style={[styles.input, style]}
					secureTextEntry={isPassword && !isPasswordVisible}
					{...props}
				/>
				{isPassword && (
					<TouchableOpacity
						style={styles.eyeIcon}
						onPress={togglePasswordVisibility}
					>
						<Ionicons
							name={isPasswordVisible ? 'eye-off' : 'eye'}
							size={24}
							color="#666"
						/>
					</TouchableOpacity>
				)}
			</View>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 8,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 12,
		backgroundColor: '#f9f9f9',
	},
	inputError: {
		borderColor: '#ff6b6b',
	},
	input: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		color: '#333',
	},
	eyeIcon: {
		paddingHorizontal: 16,
	},
	errorText: {
		fontSize: 14,
		color: '#ff6b6b',
		marginTop: 4,
	},
});
