import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GoogleIconProps {
	size?: number;
	color?: string;
}

export function GoogleIcon({ size = 24, color = '#4285F4' }: GoogleIconProps) {
	return (
		<View style={[styles.container, { width: size, height: size }]}>
			<Ionicons name="logo-google" size={size * 0.7} color={color} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 4,
		padding: 2,
	},
});
