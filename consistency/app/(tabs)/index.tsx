import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Platform,
	Alert,
	Modal,
	TextInput,
	KeyboardAvoidingView,
} from 'react-native';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { authAPI, Habit } from '../../services/api';
import { router } from 'expo-router';
import { Toast } from 'react-native-toast-message';

import LogForm, { LogData } from '../LogForm';

// Define the quote type
type Quote = {
	content: string;
	author: string;
};

// Local fallback quotes
const FALLBACK_QUOTES = [
	{
		content: "Believe you can and you're halfway there.",
		author: 'Theodore Roosevelt',
	},
	{
		content: 'It does not matter how slowly you go as long as you do not stop.',
		author: 'Confucius',
	},
	{
		content: 'Small changes eventually add up to huge results.',
		author: 'Anonymous',
	},
];

export default function HomeScreen() {
	const today = new Date();
	const formattedDate = format(today, 'MMMM d, yyyy');
	const daysSmokeFreeMockData = 7;
	const [quote, setQuote] = useState<Quote | null>(null);
	const [loading, setLoading] = useState(true);
	const insets = useSafeAreaInsets();
	const [logFormVisible, setLogFormVisible] = useState(false);
	const [isLogged, setIsLogged] = useState(false);
	const [logData, setLogData] = useState<LogData | null>(null);
	const [goalModalVisible, setGoalModalVisible] = useState(false);
	const [goalName, setGoalName] = useState('');
	const [goalDescription, setGoalDescription] = useState('');
	const [goalDuration, setGoalDuration] = useState('');
	const [goalUnit, setGoalUnit] = useState('days');
	const [unitPickerVisible, setUnitPickerVisible] = useState(false);
	const unitOptions = [
		{ label: 'Days', value: 'days' },
		{ label: 'Weeks', value: 'weeks' },
		{ label: 'Months', value: 'months' },
	];
	const [habits, setHabits] = useState<Habit[]>([]);
	const [loadingHabits, setLoadingHabits] = useState(true);
	const [loggedHabits, setLoggedHabits] = useState<{ [key: number]: boolean }>(
		{}
	);
	const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);

	useEffect(() => {
		fetchRandomQuote();
		fetchHabits();
	}, []);

	const fetchRandomQuote = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				'https://api.quotable.io/random?tags=inspirational,motivational'
			);
			setQuote(response.data);
		} catch (error) {
			// On error, use a random quote from our local fallback collection
			const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
			setQuote(FALLBACK_QUOTES[randomIndex]);
		} finally {
			setLoading(false);
		}
	};

	const fetchHabits = async () => {
		try {
			const response = await authAPI.getHabits();
			setHabits(response.data);
		} catch (error) {
			console.error('Error fetching habits:', error);
		} finally {
			setLoadingHabits(false);
		}
	};

	const handleRefreshQuote = () => {
		fetchRandomQuote();
	};

	const handleLogPress = (habitId: number) => {
		setLogFormVisible(true);
		setSelectedHabitId(habitId);
	};

	const handleLogFormClose = () => {
		setLogFormVisible(false);
	};

	const handleLogFormSave = async (data: LogData) => {
		console.log('🚀 ~ handleLogFormSave ~ data:', data);
		try {
			if (selectedHabitId) {
				await authAPI.createCheckIn(selectedHabitId, data.description);
				setLoggedHabits((prev) => ({
					...prev,
					[selectedHabitId]: true,
				}));
				Toast.show({
					type: 'success',
					text1: 'Success',
					text2: 'Habit logged successfully!',
				});
				// Refresh habits to update the streak
				fetchHabits();
			}
			setLogFormVisible(false);
			setSelectedHabitId(null);
		} catch (error) {
			console.error('Error logging habit:', error);
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: 'Failed to log habit. Please try again.',
			});
		}
	};

	const handleAddGoal = () => {
		setGoalModalVisible(true);
	};

	const handleGoalSubmit = async () => {
		// Validate form
		if (!goalName.trim()) {
			Alert.alert('Error', 'Please enter a goal name');
			return;
		}
		if (!goalDescription.trim()) {
			Alert.alert('Error', 'Please enter a goal description');
			return;
		}
		if (
			!goalDuration.trim() ||
			isNaN(Number(goalDuration)) ||
			Number(goalDuration) <= 0
		) {
			Alert.alert('Error', 'Please enter a valid duration (positive number)');
			return;
		}
		if (!goalUnit) {
			Alert.alert('Error', 'Please select a unit');
			return;
		}

		const goalData = {
			name: goalName.trim(),
			description: goalDescription.trim(),
			color: '#6366F1', // Default color
			icon: 'flag', // Default icon
			goal_duration: Number(goalDuration),
			goal_unit: goalUnit,
		};

		try {
			await authAPI.createGoal(goalData);

			// Reset form
			setGoalModalVisible(false);
			setGoalName('');
			setGoalDescription('');
			setGoalDuration('');
			setGoalUnit('days');

			// Show success message
			Toast.show({
				type: 'success',
				text1: 'Success',
				text2: 'Goal successfully created',
			});
		} catch (error) {
			console.error('Error creating goal:', error);
			Alert.alert('Error', 'Failed to create goal. Please try again.');
		}
	};

	const handleModalClose = () => {
		setGoalModalVisible(false);
		// Reset form when closing
		setGoalName('');
		setGoalDescription('');
		setGoalDuration('');
		setGoalUnit('days');
	};

	const handleUnitSelect = (value: string) => {
		setGoalUnit(value);
		setUnitPickerVisible(false);
	};

	const isFormValid = () => {
		return (
			goalName.trim() !== '' &&
			goalDescription.trim() !== '' &&
			goalDuration.trim() !== '' &&
			!isNaN(Number(goalDuration)) &&
			Number(goalDuration) > 0 &&
			goalUnit !== ''
		);
	};

	return (
		<View style={styles.container}>
			<SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Today</Text>
				</View>
			</SafeAreaView>

			<ScrollView
				style={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Daily Log Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Daily Log</Text>
					<View style={styles.card}>
						<View style={styles.dateRow}>
							<View style={styles.dateContainer}>
								<Ionicons name="calendar-outline" size={20} color="#666" />
								<Text style={styles.dateText}>
									{format(today, 'MMMM d, yyyy')}
								</Text>
							</View>
						</View>
						<View style={styles.habitPreviewHeader}>
							<Ionicons name="list" size={20} color="#6366F1" />
							<Text style={styles.habitPreviewTitle}>Current Habit</Text>
						</View>
						{habits.length > 0 &&
							habits.map((habit) => (
								<View key={habit.id} style={styles.habitPreviewContainer}>
									<View style={styles.habitPreviewContent}>
										<Text style={styles.habitPreviewName}>{habit.name}</Text>
										<View style={styles.streakBadge}>
											<Text style={styles.streakBadgeText}>
												{habit.current_streak?.current_streak || 0} days streak
											</Text>
										</View>
									</View>
									<View style={styles.logStatusRow}>
										<Text
											style={[
												styles.notLoggedText,
												loggedHabits[habit.id] && styles.loggedText,
											]}
										>
											{loggedHabits[habit.id] ? 'Logged' : 'Not Logged'}
										</Text>
										<TouchableOpacity
											style={[
												styles.logButton,
												loggedHabits[habit.id] && styles.loggedButton,
											]}
											onPress={() => handleLogPress(habit.id)}
										>
											<Text
												style={[
													styles.logButtonText,
													loggedHabits[habit.id] && styles.loggedButtonText,
												]}
											>
												{loggedHabits[habit.id] ? 'Logged' : 'Log it'}
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							))}

						{isLogged && logData && (
							<View style={styles.logSummary}>
								<Text style={styles.logSummaryTitle}>
									Today&rsquo;s Log Summary:
								</Text>
								<View style={styles.logSummaryItem}>
									<Text style={styles.logSummaryLabel}>Mood:</Text>
									<Text style={styles.logSummaryValue}>{logData.mood}</Text>
								</View>
								<View style={styles.logSummaryItem}>
									<Text style={styles.logSummaryLabel}>Habit Completed:</Text>
									<Text style={styles.logSummaryValue}>
										{logData.habitCompleted ? 'Yes ✅' : 'No ❌'}
									</Text>
								</View>
								{logData.description ? (
									<View style={styles.descriptionContainer}>
										<Text style={styles.logSummaryLabel}>Notes:</Text>
										<Text style={styles.descriptionText}>
											{logData.description.length > 100
												? logData.description.substring(0, 100) + '...'
												: logData.description}
										</Text>
									</View>
								) : null}
							</View>
						)}
					</View>
				</View>

				{/* Today's Focus Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Today&rsquo;s Focus</Text>
					<View style={styles.card}>
						<View style={styles.focusHeader}>
							<View style={styles.focusIconContainer}>
								<Ionicons name="bulb-outline" size={24} color="#6366F1" />
							</View>
							<Text style={styles.focusTitle}>Mindful Breathing</Text>
						</View>
						<Text style={styles.focusDescription}>
							Practice deep breathing exercises when a craving hits. Focus on
							the sensation of air entering and leaving your lungs.
						</Text>
					</View>
				</View>

				{/* Progress Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Your Progress</Text>

					{habits.length > 0 &&
						habits.map((habit) => (
							<View key={habit.id} style={{ marginBottom: 12 }}>
								<View style={styles.card}>
									<Text style={styles.progressTitle}>
										{habit.name} Progress
									</Text>
									<View style={styles.progressValueContainer}>
										<Text style={styles.progressValue}>
											{habit.current_streak?.current_streak || 0}
										</Text>
										<Text style={styles.progressUnit}>days</Text>
									</View>
									<Text style={styles.progressMessage}>
										{habit.description}
									</Text>
								</View>
							</View>
						))}
				</View>

				{/* Motivational Boost */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Motivational Boost</Text>
						<TouchableOpacity onPress={handleRefreshQuote}>
							<Ionicons name="refresh-outline" size={20} color="#666" />
						</TouchableOpacity>
					</View>
					<View style={styles.motivationCard}>
						{loading ? (
							<ActivityIndicator color="#6366F1" size="small" />
						) : (
							<>
								<Text style={styles.quoteText}>
									&ldquo;{quote?.content}&rdquo;
								</Text>
								{quote?.author && (
									<Text style={styles.quoteAuthor}>- {quote.author}</Text>
								)}
							</>
						)}
					</View>
				</View>

				{/* Habits Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Your Habits</Text>
					{loadingHabits ? (
						<View style={styles.card}>
							<ActivityIndicator color="#6366F1" size="small" />
						</View>
					) : habits.length > 0 ? (
						habits.map((habit) => (
							<View key={habit.id} style={[styles.card, { marginBottom: 12 }]}>
								<View style={styles.habitHeader}>
									<View
										style={[
											styles.habitIconContainer,
											{ backgroundColor: habit.color },
										]}
									>
										<Ionicons
											name={habit.icon as any}
											size={24}
											color="white"
										/>
									</View>
									<View style={styles.habitInfo}>
										<Text style={styles.habitName}>{habit.name}</Text>
										<Text style={styles.habitDescription} numberOfLines={2}>
											{habit.description}
										</Text>
									</View>
								</View>
								<View style={styles.streakInfo}>
									<Text style={styles.streakText}>
										Current Streak:{' '}
										{habit.current_streak?.max_streak_achieved || 0} days
									</Text>
									<Text style={styles.streakText}>
										Max Streak: {habit.current_streak?.target_days || 0} days
									</Text>
								</View>
							</View>
						))
					) : (
						<View style={styles.card}>
							<Text style={styles.emptyText}>
								No habits yet. Add your first habit!
							</Text>
						</View>
					)}
				</View>

				<View style={styles.bottomSpacer} />
			</ScrollView>

			{/* Floating Action Button */}
			<TouchableOpacity
				style={[styles.fab, { bottom: insets.bottom + 60 }]}
				onPress={handleAddGoal}
				activeOpacity={0.8}
			>
				<Ionicons name="add" size={28} color="white" />
			</TouchableOpacity>

			<SafeAreaView edges={['bottom']} style={{ backgroundColor: '#F5F5F7' }} />

			<LogForm
				visible={logFormVisible}
				onClose={handleLogFormClose}
				onSave={handleLogFormSave}
				habitId={selectedHabitId}
			/>

			{/* Improved Goal Modal */}
			<Modal
				visible={goalModalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={handleModalClose}
			>
				<KeyboardAvoidingView
					style={styles.modalOverlay}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Add a New Goal</Text>
							<TouchableOpacity onPress={handleModalClose}>
								<Ionicons name="close" size={24} color="#666" />
							</TouchableOpacity>
						</View>

						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={styles.formGroup}>
								<Text style={styles.inputLabel}>
									Goal Name <Text style={styles.requiredMark}>*</Text>
								</Text>
								<TextInput
									style={styles.input}
									placeholder="e.g., Quit Smoking, Exercise Daily"
									value={goalName}
									onChangeText={setGoalName}
									maxLength={50}
								/>
							</View>

							<View style={styles.formGroup}>
								<Text style={styles.inputLabel}>
									Description <Text style={styles.requiredMark}>*</Text>
								</Text>
								<TextInput
									style={[styles.input, styles.textArea]}
									placeholder="Describe your goal and why it matters to you..."
									value={goalDescription}
									onChangeText={setGoalDescription}
									multiline
									numberOfLines={4}
									textAlignVertical="top"
									maxLength={200}
								/>
								<Text style={styles.characterCount}>
									{goalDescription.length}/200
								</Text>
							</View>

							<View style={styles.durationContainer}>
								<View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
									<Text style={styles.inputLabel}>
										Duration <Text style={styles.requiredMark}>*</Text>
									</Text>
									<TextInput
										style={styles.input}
										placeholder="30"
										value={goalDuration}
										onChangeText={(text) => {
											// Only allow numbers
											const numericValue = text.replace(/[^0-9]/g, '');
											setGoalDuration(numericValue);
										}}
										keyboardType="numeric"
										maxLength={4}
									/>
								</View>
								<View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
									<Text style={styles.inputLabel}>
										Unit <Text style={styles.requiredMark}>*</Text>
									</Text>
									<TouchableOpacity
										style={styles.unitPickerBox}
										onPress={() => setUnitPickerVisible(true)}
										activeOpacity={0.7}
									>
										<Text style={styles.unitPickerText}>
											{unitOptions.find((opt) => opt.value === goalUnit)
												?.label || 'Select Unit'}
										</Text>
										<Ionicons name="chevron-down" size={20} color="#666" />
									</TouchableOpacity>
								</View>
							</View>
						</ScrollView>

						<View style={styles.modalButtonRow}>
							<TouchableOpacity
								style={[styles.modalButton, styles.cancelButton]}
								onPress={handleModalClose}
							>
								<Text style={[styles.modalButtonText, styles.cancelButtonText]}>
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.modalButton,
									!isFormValid() && styles.disabledButton,
								]}
								onPress={handleGoalSubmit}
								disabled={!isFormValid()}
							>
								<Text
									style={[
										styles.modalButtonText,
										!isFormValid() && styles.disabledButtonText,
									]}
								>
									Add Goal
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>

			{/* Unit Picker Bottom Sheet */}
			<Modal
				visible={unitPickerVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setUnitPickerVisible(false)}
			>
				<View style={styles.bottomSheetOverlay}>
					<TouchableOpacity
						style={styles.bottomSheetBackdrop}
						activeOpacity={1}
						onPress={() => setUnitPickerVisible(false)}
					/>
					<View style={styles.bottomSheetContainer}>
						<View style={styles.bottomSheetHandle} />
						<View style={styles.bottomSheetHeader}>
							<Text style={styles.bottomSheetTitle}>Select Duration Unit</Text>
							<TouchableOpacity
								style={styles.bottomSheetCloseButton}
								onPress={() => setUnitPickerVisible(false)}
							>
								<Ionicons name="close" size={24} color="#666" />
							</TouchableOpacity>
						</View>

						<View style={styles.optionsList}>
							{unitOptions.map((option) => (
								<TouchableOpacity
									key={option.value}
									style={[
										styles.optionItem,
										goalUnit === option.value && styles.optionItemSelected,
									]}
									onPress={() => handleUnitSelect(option.value)}
								>
									<Text
										style={[
											styles.optionText,
											goalUnit === option.value && styles.optionTextSelected,
										]}
									>
										{option.label}
									</Text>
									{goalUnit === option.value && (
										<Ionicons name="checkmark" size={20} color="#6366F1" />
									)}
								</TouchableOpacity>
							))}
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F5F7',
	},
	scrollContainer: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 100, // Extra padding for FAB
	},
	header: {
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
		backgroundColor: 'white',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		textAlign: 'center',
	},
	section: {
		marginTop: 16,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 12,
		color: '#333',
	},
	card: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	dateRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	dateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	dateText: {
		marginLeft: 8,
		fontSize: 16,
		color: '#333',
	},
	logStatusRow: {
		marginTop: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	notLoggedText: {
		fontSize: 16,
		color: '#E74C3C',
	},
	loggedText: {
		fontSize: 16,
		color: '#27AE60',
	},
	logButton: {
		backgroundColor: '#E74C3C',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 6,
	},
	loggedButton: {
		backgroundColor: '#27AE60',
	},
	logButtonText: {
		color: '#6366F1',
		fontWeight: '600',
	},
	loggedButtonText: {
		color: 'white',
		fontWeight: '600',
	},
	logSummary: {
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
	},
	logSummaryTitle: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: 8,
		color: '#333',
	},
	logSummaryItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 4,
	},
	logSummaryLabel: {
		fontSize: 14,
		color: '#666',
	},
	logSummaryValue: {
		fontSize: 14,
		fontWeight: '500',
		color: '#333',
	},
	descriptionContainer: {
		marginTop: 8,
	},
	descriptionText: {
		fontSize: 14,
		color: '#333',
		marginTop: 4,
		fontStyle: 'italic',
	},
	focusHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	focusIconContainer: {
		marginRight: 12,
	},
	focusTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	focusDescription: {
		fontSize: 16,
		color: '#666',
		lineHeight: 22,
	},
	progressTitle: {
		fontSize: 16,
		color: '#333',
		textAlign: 'center',
		marginBottom: 12,
	},
	progressValueContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-end',
		marginBottom: 12,
	},
	progressValue: {
		fontSize: 42,
		fontWeight: 'bold',
		color: '#6366F1',
	},
	progressUnit: {
		fontSize: 16,
		color: '#666',
		marginLeft: 4,
		marginBottom: 8,
	},
	progressMessage: {
		fontSize: 14,
		color: '#666',
		textAlign: 'center',
	},
	motivationCard: {
		backgroundColor: '#E8E9FF',
		borderRadius: 12,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		minHeight: 80,
		justifyContent: 'center',
	},
	quoteText: {
		fontSize: 16,
		fontStyle: 'italic',
		color: '#333',
		textAlign: 'center',
	},
	quoteAuthor: {
		fontSize: 14,
		color: '#666',
		textAlign: 'right',
		marginTop: 8,
	},
	bottomSpacer: {
		height: 20,
	},
	// Floating Action Button
	fab: {
		position: 'absolute',
		right: 20,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: '#6366F1',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	// Modal Styles
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	modalContent: {
		backgroundColor: 'white',
		borderRadius: 16,
		width: '100%',
		maxHeight: '85%',
		paddingBottom: 20,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#333',
	},
	formGroup: {
		marginBottom: 16,
		paddingHorizontal: 20,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: '500',
		color: '#333',
		marginBottom: 6,
	},
	input: {
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		backgroundColor: '#FAFAFA',
	},
	textArea: {
		height: 80,
	},
	characterCount: {
		fontSize: 12,
		color: '#666',
		textAlign: 'right',
		marginTop: 4,
	},
	durationContainer: {
		flexDirection: 'row',
		paddingHorizontal: 20,
	},
	unitPickerBox: {
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
		backgroundColor: '#FAFAFA',
		padding: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		minHeight: 50,
	},
	unitPickerText: {
		fontSize: 16,
		color: '#333',
		flex: 1,
	},
	optionsList: {
		paddingVertical: 8,
	},
	optionItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	optionItemSelected: {
		backgroundColor: '#F5F5FF',
	},
	optionText: {
		fontSize: 16,
		color: '#333',
	},
	optionTextSelected: {
		color: '#6366F1',
		fontWeight: '600',
	},
	bottomSheetOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	bottomSheetBackdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'transparent',
	},
	bottomSheetContainer: {
		backgroundColor: 'white',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingBottom: Platform.OS === 'ios' ? 40 : 20,
		maxHeight: '60%',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	bottomSheetHandle: {
		width: 40,
		height: 4,
		backgroundColor: '#E5E5E5',
		borderRadius: 2,
		alignSelf: 'center',
		marginTop: 8,
		marginBottom: 8,
	},
	bottomSheetHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	bottomSheetTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	bottomSheetCloseButton: {
		padding: 4,
	},
	modalButtonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingTop: 20,
		gap: 12,
	},
	modalButton: {
		flex: 1,
		backgroundColor: '#6366F1',
		paddingVertical: 14,
		borderRadius: 8,
		alignItems: 'center',
	},
	modalButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
	cancelButton: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#E5E5E5',
	},
	cancelButtonText: {
		color: '#666',
	},
	requiredMark: {
		color: '#E74C3C',
		fontSize: 16,
	},
	disabledButton: {
		backgroundColor: '#E5E5E5',
		opacity: 0.7,
	},
	disabledButtonText: {
		color: '#999',
	},
	habitHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	habitIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	habitInfo: {
		flex: 1,
	},
	habitName: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
		marginBottom: 4,
	},
	habitDescription: {
		fontSize: 14,
		color: '#666',
		lineHeight: 20,
	},
	streakInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
	},
	streakText: {
		fontSize: 14,
		color: '#666',
	},
	emptyText: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		padding: 20,
	},
	habitPreviewContainer: {
		backgroundColor: '#F8F9FF',
		borderRadius: 12,
		padding: 16,
		marginTop: 12,
	},
	habitPreviewHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	habitPreviewTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: '#6366F1',
		marginLeft: 8,
	},
	habitPreviewContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	habitPreviewName: {
		fontSize: 16,
		fontWeight: '500',
		color: '#333',
		flex: 1,
	},
	streakBadge: {
		backgroundColor: '#E8E9FF',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		marginLeft: 12,
	},
	streakBadgeText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#6366F1',
	},
});
