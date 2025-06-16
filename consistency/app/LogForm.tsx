import React, { useState, useEffect } from 'react';
import {
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ScrollView,
	Platform,
	BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface LogFormProps {
	visible: boolean;
	onClose: () => void;
	onSave: (data: LogData) => Promise<void>;
	habitId: number | null;
}

export type LogData = {
	date: Date;
	mood: string;
	description: string;
	habitCompleted: boolean;
};

const MOODS = [
	'Great',
	'Good',
	'Neutral',
	'Tired',
	'Stressed',
	'Motivated',
	'Relaxed',
];

export default function LogForm({
	visible,
	onClose,
	onSave,
	habitId,
}: LogFormProps) {
	const [selectedMood, setSelectedMood] = useState<string>('');
	const [description, setDescription] = useState('');
	const [habitCompleted, setHabitCompleted] = useState<boolean | null>(null);

	// Handle back button press on Android
	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				if (visible) {
					handleClose();
					return true;
				}
				return false;
			}
		);

		return () => backHandler.remove();
	}, [visible]);

	const resetForm = () => {
		setSelectedMood('');
		setDescription('');
		setHabitCompleted(null);
	};

	const handleClose = () => {
		resetForm();
		if (onClose) {
			onClose();
		}
	};

	const handleSave = () => {
		if (!selectedMood || habitCompleted === null) {
			return; // Don't save if required fields are missing
		}

		const logData: LogData = {
			date: new Date(),
			mood: selectedMood,
			description,
			habitCompleted: habitCompleted || false,
		};

		onSave(logData);
		resetForm();
		if (onClose) {
			onClose();
		}
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={false}
			onRequestClose={handleClose}
		>
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity
						onPress={handleClose}
						style={styles.closeButton}
						testID="close-button"
					>
						<Ionicons name="close" size={24} color="#333" />
					</TouchableOpacity>
					<Text style={styles.title}>Daily Log</Text>
					<TouchableOpacity
						onPress={handleSave}
						style={[
							styles.saveButton,
							(!selectedMood || habitCompleted === null) &&
								styles.disabledButton,
						]}
						disabled={!selectedMood || habitCompleted === null}
					>
						<Text style={styles.saveButtonText}>Save</Text>
					</TouchableOpacity>
				</View>

				<ScrollView style={styles.formContainer}>
					<Text style={styles.sectionTitle}>How are you feeling today?</Text>
					<View style={styles.moodContainer}>
						{MOODS.map((mood) => (
							<TouchableOpacity
								key={mood}
								style={[
									styles.moodButton,
									selectedMood === mood && styles.selectedMoodButton,
								]}
								onPress={() => setSelectedMood(mood)}
							>
								<Text
									style={[
										styles.moodText,
										selectedMood === mood && styles.selectedMoodText,
									]}
								>
									{mood}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					<Text style={styles.sectionTitle}>
						Did you complete today&rsquo;s habit?
					</Text>
					<View style={styles.optionContainer}>
						<TouchableOpacity
							style={[
								styles.optionButton,
								habitCompleted === true && styles.selectedOptionButton,
							]}
							onPress={() => setHabitCompleted(true)}
						>
							<Text
								style={[
									styles.optionText,
									habitCompleted === true && styles.selectedOptionText,
								]}
							>
								Yes
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.optionButton,
								habitCompleted === false && styles.selectedOptionButton,
							]}
							onPress={() => setHabitCompleted(false)}
						>
							<Text
								style={[
									styles.optionText,
									habitCompleted === false && styles.selectedOptionText,
								]}
							>
								No
							</Text>
						</TouchableOpacity>
					</View>

					<Text style={styles.sectionTitle}>Describe your day:</Text>
					<TextInput
						style={styles.descriptionInput}
						placeholder="What went well? What challenges did you face? How are you feeling about your progress?"
						multiline
						value={description}
						onChangeText={setDescription}
					/>
				</ScrollView>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F5F7',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		paddingHorizontal: 16,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
		...Platform.select({
			ios: {
				paddingTop: 50,
			},
		}),
	},
	closeButton: {
		padding: 8,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	saveButton: {
		padding: 8,
	},
	disabledButton: {
		opacity: 0.5,
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#E74C3C',
	},
	formContainer: {
		flex: 1,
		padding: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginTop: 16,
		marginBottom: 8,
		color: '#333',
	},
	optionContainer: {
		flexDirection: 'row',
		marginBottom: 16,
	},
	optionButton: {
		flex: 1,
		backgroundColor: '#F0F0F0',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		marginHorizontal: 4,
		alignItems: 'center',
	},
	selectedOptionButton: {
		backgroundColor: '#E74C3C',
	},
	optionText: {
		fontWeight: '500',
		color: '#666',
	},
	selectedOptionText: {
		color: 'white',
	},
	moodContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 16,
	},
	moodButton: {
		backgroundColor: '#F0F0F0',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 16,
		margin: 4,
	},
	selectedMoodButton: {
		backgroundColor: '#6366F1',
	},
	moodText: {
		fontSize: 14,
		color: '#666',
	},
	selectedMoodText: {
		color: 'white',
	},
	descriptionInput: {
		backgroundColor: 'white',
		borderRadius: 8,
		padding: 12,
		height: 150,
		textAlignVertical: 'top',
		marginBottom: 20,
	},
});
