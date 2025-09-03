import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
	const router = useRouter();

	const handleGetStarted = () => {
		router.replace('/signin');
	};

	return (
		<View style={styles.container}>
			<LottieView
				source={require('../assets/images/Done.json')}
			autoPlay
			 loop={false}
				style={styles.backgroundImage}
			/>

			<SafeAreaView style={styles.safeArea}>
			<Text style={styles.welcomeText}>
						Welcome to Consistency
					</Text>
				<View style={styles.buttonContainer}>
			
					<TouchableOpacity style={styles.button} onPress={handleGetStarted}>
						<Text style={styles.buttonText}>
							Get Started <Text style={styles.arrow}>→</Text>
						</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black', // background behind zoomed-out image
		position: 'relative',
	},
	backgroundImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: width * 1, // 5% smaller for padding effect
		height: height * 1,
		alignSelf: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
	},
	safeArea: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: 60,
	},
	buttonContainer: {
		width: '100%',
		alignItems: 'center',
	},
	button: {
		backgroundColor: '#636DEC',
		paddingVertical: 16,
		paddingHorizontal: 28,
		borderRadius: 32,
		width: '80%',
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
	},
	arrow: {
		fontWeight: 'normal',
	},
	welcomeText: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		color: 'black',
	},
	});
