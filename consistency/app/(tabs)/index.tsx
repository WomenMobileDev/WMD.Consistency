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
} from 'react-native';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

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
							<Text style={styles.notLoggedText}>Not Logged</Text>
							<TouchableOpacity style={styles.logButton}>
								<Text style={styles.logButtonText}>Log It</Text>
							</TouchableOpacity>
						</View>
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

			<SafeAreaView edges={['bottom']} style={{ backgroundColor: '#F5F5F7' }} />
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
		paddingBottom: 20,
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
	logButton: {
		backgroundColor: '#E74C3C',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 6,
	},
	logButtonText: {
		color: 'white',
		fontWeight: '600',
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
});
