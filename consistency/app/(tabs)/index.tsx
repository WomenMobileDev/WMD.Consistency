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
import { Picker } from '@react-native-picker/picker';

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

	useEffect(() => {
		fetchRandomQuote();
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

	const handleRefreshQuote = () => {
		fetchRandomQuote();
	};

	const handleLogPress = () => {
		setLogFormVisible(true);
	};

	const handleLogFormClose = () => {
		setLogFormVisible(false);
	};

	const handleLogFormSave = (data: LogData) => {
		setLogData(data);
		setIsLogged(true);
		// In a real app, you would save this data to a database or storage
		console.log('Log data saved:', data);

		// Show a success message
		Alert.alert('Success', 'Your daily log has been saved!', [{ text: 'OK' }]);
	};

	const handleAddGoal = () => {
		setGoalModalVisible(true);
	};

	const handleGoalSubmit = () => {
		// Validate form
		if (!goalName.trim()) {
			Alert.alert('Error', 'Please enter a goal name');
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

		const goalData = {
			name: goalName.trim(),
			description: goalDescription.trim(),
			color: '', // can be added later
			icon: '', // can be added later
			goal_duration: Number(goalDuration),
			goal_unit: goalUnit,
		};

		console.log('Goal submitted:', goalData);

		// Reset form
		setGoalModalVisible(false);
		setGoalName('');
		setGoalDescription('');
		setGoalDuration('');
		setGoalUnit('days');

		Alert.alert('Success', 'Your goal has been added successfully!', [
			{ text: 'OK' },
		]);
	};

	const handleModalClose = () => {
		setGoalModalVisible(false);
		// Reset form when closing
		setGoalName('');
		setGoalDescription('');
		setGoalDuration('');
		setGoalUnit('days');
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
						<View style={styles.logStatusRow}>
							<Text
								style={[styles.notLoggedText, isLogged && styles.loggedText]}
							>
								{isLogged ? 'Logged' : 'Not Logged'}
							</Text>
							<TouchableOpacity
								style={[styles.logButton, isLogged && styles.loggedButton]}
								onPress={handleLogPress}
							>
								<Text style={styles.logButtonText}>
									{isLogged ? 'Update Log' : 'Log It'}
								</Text>
							</TouchableOpacity>
						</View>

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
					<View style={styles.card}>
						<Text style={styles.progressTitle}>Days Smoke-Free</Text>
						<View style={styles.progressValueContainer}>
							<Text style={styles.progressValue}>{daysSmokeFreeMockData}</Text>
							<Text style={styles.progressUnit}>days</Text>
						</View>
						<Text style={styles.progressMessage}>Your progress matters!</Text>
					</View>
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
				date={today}
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
								<Text style={styles.inputLabel}>Goal Name *</Text>
								<TextInput
									style={styles.input}
									placeholder="e.g., Quit Smoking, Exercise Daily"
									value={goalName}
									onChangeText={setGoalName}
									maxLength={50}
								/>
							</View>

							<View style={styles.formGroup}>
								<Text style={styles.inputLabel}>Description</Text>
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
									<Text style={styles.inputLabel}>Duration *</Text>
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
									<Text style={styles.inputLabel}>Unit</Text>
									<View style={styles.pickerContainer}>
										<Picker
											selectedValue={goalUnit}
											onValueChange={(itemValue: string) =>
												setGoalUnit(itemValue)
											}
											style={styles.picker}
											mode="dropdown"
											dropdownIconColor="#666"
										>
											<Picker.Item label="Days" value="days" />
											<Picker.Item label="Weeks" value="weeks" />
											<Picker.Item label="Months" value="months" />
										</Picker>
									</View>
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
								style={styles.modalButton}
								onPress={handleGoalSubmit}
							>
								<Text style={styles.modalButtonText}>Add Goal</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
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
	pickerContainer: {
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
		backgroundColor: '#FAFAFA',
		overflow: 'hidden',
		justifyContent: 'center',
		minHeight: 50,
	},
	picker: {
		height: Platform.OS === 'ios' ? 50 : 50,
		width: '100%',
		color: '#333',
		backgroundColor: 'transparent',
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
});
