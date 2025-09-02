import { useAuth } from '@/context/AuthContext';
import { dummyProfileData } from '@/dummy-profile-data';
import { UserProfileData } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Fallback data for when profile data is not available
const fallbackUserData = {
	name: 'User',
};

export default function ProfileScreen() {
	const { user, signOut } = useAuth();
	const router = useRouter();
	const [profileData, setProfileData] = useState<UserProfileData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch user profile data
	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				setLoading(true);
				setError(null);
				console.log('📊 Loading profile data...');
				
				// Simulate loading delay for better UX
				await new Promise(resolve => setTimeout(resolve, 1000));
				
				// Use dummy data with user's actual name if available
				const profileData = {
					...dummyProfileData,
					name: user?.name || dummyProfileData.name,
					email: user?.email || dummyProfileData.email,
					id: user?.id || dummyProfileData.id,
					created_at: user?.created_at || dummyProfileData.created_at,
				};
				
				setProfileData(profileData);
				console.log('✅ Profile data loaded with dummy data:', profileData.name);
				
			} catch (err: any) {
				console.error('❌ Error loading profile data:', err);
				setError(`Failed to load profile data: ${err.message}`);
				setProfileData(null);
			} finally {
				setLoading(false);
			}
		};

		fetchProfileData();
	}, [user]);

	// Function to handle logout
	const handleLogout = async () => {
		Alert.alert(
			'Logout',
			'Are you sure you want to logout?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Logout',
					onPress: async () => {
						await signOut();
						// The AuthContext will handle navigation to the onboarding screen
					},
					style: 'destructive',
				},
			],
			{ cancelable: true }
		);
	};

	// Function to render the consistency chart with real data
	const renderConsistencyChart = () => {
		if (!profileData?.consistency_chart || profileData.consistency_chart.length === 0) {
			return (
				<View style={styles.graphWrapper}>
					<Text style={styles.noDataText}>No consistency data available</Text>
				</View>
			);
		}

		const chartData = profileData.consistency_chart.slice(-7); // Last 7 days
		const maxHeight = 150;

		return (
			<View style={styles.graphWrapper}>
				<View style={styles.graphArea}>
					{chartData.map((dataPoint, index) => {
						const y = maxHeight - (dataPoint.percentage / 100) * maxHeight;
						const x = index * ((width - 80) / (chartData.length - 1));

						// Create connecting lines between points
						let line = null;
						if (index < chartData.length - 1) {
							const nextPoint = chartData[index + 1];
							const nextY = maxHeight - (nextPoint.percentage / 100) * maxHeight;
							const nextX = (index + 1) * ((width - 80) / (chartData.length - 1));

							// Calculate line angle and length
							const angle = Math.atan2(nextY - y, nextX - x);
							const length = Math.sqrt(
								Math.pow(nextX - x, 2) + Math.pow(nextY - y, 2)
							);

							line = (
								<View
									key={`line-${index}`}
									style={{
										position: 'absolute',
										width: length,
										height: 2,
										backgroundColor: '#8A8CFF',
										left: x,
										top: y,
										transform: [
											{ rotate: `${angle}rad` },
										],
										transformOrigin: 'left',
									}}
								/>
							);
						}

						return (
							<React.Fragment key={`point-${index}`}>
								{line}
								<View
									style={{
										position: 'absolute',
										width: 8,
										height: 8,
										borderRadius: 4,
										backgroundColor: '#6366F1',
										left: x - 4,
										top: y - 4,
									}}
								/>
							</React.Fragment>
						);
					})}

					{/* Fill the area under the line */}
					<View style={styles.graphFill} />
				</View>

				<View style={styles.graphXAxis}>
					{chartData.map((dataPoint, index) => {
						const date = new Date(dataPoint.date);
						const formattedDate = date.toLocaleDateString('en-US', { 
							month: 'short', 
							day: 'numeric' 
						});
						return (
							<Text key={`label-${index}`} style={styles.graphXLabel}>
								{formattedDate}
							</Text>
						);
					})}
				</View>
			</View>
		);
	};

	// Use real profile data or fallback to auth context or fallback data
	const displayName = profileData?.name || user?.name || fallbackUserData.name;
	const displayInitial = displayName.charAt(0);

	// Custom Avatar component with user data
	const UserAvatar = () => (
		<View style={styles.avatarContainer}>
			<Text style={styles.avatarText}>{displayInitial}</Text>
		</View>
	);

	// Show loading spinner while fetching data
	if (loading) {
		return (
			<SafeAreaView style={styles.container} edges={['top']}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Profile</Text>
				</View>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#6366F1" />
					<Text style={styles.loadingText}>Loading profile...</Text>
				</View>
			</SafeAreaView>
		);
	}

	// Show error state if data fetch failed
	if (error && !profileData) {
		return (
			<SafeAreaView style={styles.container} edges={['top']}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Profile</Text>
				</View>
				<View style={styles.errorContainer}>
					<Ionicons name="alert-circle" size={48} color="#F86D70" />
					<Text style={styles.errorText}>{error}</Text>
					<TouchableOpacity 
						style={styles.retryButton}
						onPress={async () => {
							try {
								setError(null);
								setLoading(true);
								console.log('🔄 Retrying profile data load...');
								
								// Simulate loading delay
								await new Promise(resolve => setTimeout(resolve, 1000));
								
								// Use dummy data with user's actual info
								const profileData = {
									...dummyProfileData,
									name: user?.name || dummyProfileData.name,
									email: user?.email || dummyProfileData.email,
									id: user?.id || dummyProfileData.id,
									created_at: user?.created_at || dummyProfileData.created_at,
								};
								
								setProfileData(profileData);
								console.log('✅ Profile data loaded on retry:', profileData.name);
							} catch (err: any) {
								console.error('❌ Retry failed:', err);
								setError(`Failed to load profile data: ${err.message}`);
							} finally {
								setLoading(false);
							}
						}}
					>
						<Text style={styles.retryButtonText}>Retry</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Profile</Text>
				<View style={styles.headerAvatarContainer}>
					<UserAvatar />
				</View>
			</View>

			<ScrollView
				style={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.profileHeader}>
					<View style={styles.profileAvatarContainer}>
						<UserAvatar />
					</View>
					<View style={styles.profileInfo}>
						<Text style={styles.profileName}>{displayName}</Text>
						<Text style={styles.profileDays}>
							{profileData?.overview.days_since_joined || 0} Days Since Joined
						</Text>
						<View style={styles.consistencyBadge}>
							<Text style={styles.consistencyText}>
								{profileData?.overview.overall_consistency?.toFixed(1) || 0}% Consistent
							</Text>
						</View>
						
						{/* Overview Stats */}
						<View style={styles.statsRow}>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{profileData?.overview.total_habits || 0}</Text>
								<Text style={styles.statLabel}>Total Habits</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{profileData?.overview.active_habits || 0}</Text>
								<Text style={styles.statLabel}>Active</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{profileData?.overview.total_check_ins || 0}</Text>
								<Text style={styles.statLabel}>Check-ins</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={styles.card}>
					<Text style={styles.cardTitle}>7-Day Consistency</Text>
					{renderConsistencyChart()}
				</View>

				{/* Streak Insights */}
				{profileData?.streak_insights && (
					<View style={styles.card}>
						<Text style={styles.cardTitle}>Streak Insights</Text>
						<View style={styles.insightsGrid}>
							<View style={styles.insightItem}>
								<Text style={styles.insightNumber}>{profileData.streak_insights.current_longest_streak}</Text>
								<Text style={styles.insightLabel}>Current Longest</Text>
							</View>
							<View style={styles.insightItem}>
								<Text style={styles.insightNumber}>{profileData.streak_insights.best_streak_ever}</Text>
								<Text style={styles.insightLabel}>Best Ever</Text>
							</View>
							<View style={styles.insightItem}>
								<Text style={styles.insightNumber}>{profileData.streak_insights.average_streak_length.toFixed(1)}</Text>
								<Text style={styles.insightLabel}>Average</Text>
							</View>
							<View style={styles.insightItem}>
								<Text style={styles.insightNumber}>{profileData.streak_insights.active_streaks_count}</Text>
								<Text style={styles.insightLabel}>Active Streaks</Text>
							</View>
						</View>
					</View>
				)}

				<Text style={styles.sectionTitle}>Recent Achievements</Text>

				{profileData?.recent_achievements && profileData.recent_achievements.length > 0 ? (
					profileData.recent_achievements.map((achievement) => (
						<View key={achievement.id} style={styles.achievementCard}>
							<View style={styles.achievementIconContainer}>
								<Ionicons
									name="trophy"
									size={24}
									color="#6366F1"
								/>
							</View>
							<View style={styles.achievementContent}>
								<Text style={styles.achievementTitle}>
									{achievement.achievement_type === 'streak_completed' 
										? `${achievement.target_days}-Day Streak`
										: 'Achievement'
									}
								</Text>
								<Text style={styles.achievementDescription}>
									{achievement.metadata.habit_name} - {achievement.target_days} days streak completed!
								</Text>
								<Text style={styles.achievementDate}>
									Achieved: {new Date(achievement.achieved_at).toLocaleDateString()}
								</Text>
							</View>
						</View>
					))
				) : (
					<View style={styles.noAchievementsCard}>
						<Ionicons name="trophy-outline" size={48} color="#CCC" />
						<Text style={styles.noAchievementsText}>No achievements yet</Text>
						<Text style={styles.noAchievementsSubtext}>Keep building those habits!</Text>
					</View>
				)}

				{/* Most Consistent Habit */}
				{profileData?.most_consistent_habit && (
					<View style={styles.quoteCard}>
						<View style={styles.topHabitHeader}>
							<Ionicons name="star" size={20} color="#6366F1" />
							<Text style={styles.topHabitTitle}>Most Consistent Habit</Text>
						</View>
						<Text style={styles.topHabitName}>{profileData.most_consistent_habit.habit_name}</Text>
						<Text style={styles.topHabitStats}>
							{profileData.most_consistent_habit.consistency_rate}% consistency • {profileData.most_consistent_habit.current_streak} day streak
						</Text>
					</View>
				)}

				<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
					<Ionicons name="log-out-outline" size={20} color="white" />
					<Text style={styles.logoutButtonText}>Logout</Text>
				</TouchableOpacity>

				<View style={{ height: 80 }} />
			</ScrollView>

		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F5F7',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	headerAvatarContainer: {
		width: 32,
		height: 32,
	},
	avatarContainer: {
		width: '100%',
		height: '100%',
		borderRadius: 100,
		backgroundColor: '#6366F1',
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	scrollContainer: {
		flex: 1,
	},
	profileHeader: {
		flexDirection: 'row',
		padding: 20,
		alignItems: 'center',
	},
	profileAvatarContainer: {
		width: 80,
		height: 80,
		marginRight: 16,
	},
	profileInfo: {
		flex: 1,
	},
	profileName: {
		fontSize: 22,
		fontWeight: '600',
		color: '#333',
		marginBottom: 4,
	},
	profileDays: {
		fontSize: 16,
		color: '#666',
		marginBottom: 8,
	},
	consistencyBadge: {
		backgroundColor: '#6366F1',
		alignSelf: 'flex-start',
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 16,
	},
	consistencyText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '500',
	},
	logoutButton: {
		backgroundColor: '#F86D70',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 30,
		marginHorizontal: 16,
		marginTop: 16,
		marginBottom: 20,
	},
	logoutButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	card: {
		backgroundColor: 'white',
		borderRadius: 12,
		marginHorizontal: 16,
		marginBottom: 20,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
		marginBottom: 16,
	},
	graphContainer: {
		flexDirection: 'row',
		height: 200,
		paddingRight: 16,
	},
	graphLabels: {
		width: 30,
		height: 150,
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		marginRight: 8,
	},
	graphLabel: {
		fontSize: 12,
		color: '#999',
	},
	graph: {
		flex: 1,
		height: 150,
		position: 'relative',
	},
	graphBackground: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	},
	graphContent: {
		flexDirection: 'row',
		height: '100%',
		position: 'relative',
		zIndex: 2,
	},
	gridLine: {
		position: 'absolute',
		left: 0,
		right: 0,
		height: 1,
		backgroundColor: '#E0E0E0',
	},
	dataPointContainer: {
		flex: 1,
		height: '100%',
		alignItems: 'center',
	},
	dataPointArea: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	dataPointFill: {
		width: '100%',
		backgroundColor: 'rgba(99, 102, 241, 0.2)',
	},
	dataPointLabel: {
		fontSize: 10,
		color: '#999',
		marginTop: 4,
	},
	lineOverlay: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	},
	lineGraph: {
		position: 'absolute',
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: '#6366F1',
	},
	// New graph styles
	graphWrapper: {
		height: 200,
	},
	graphArea: {
		height: 150,
		position: 'relative',
	},
	graphFill: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0,
		backgroundColor: 'rgba(99, 102, 241, 0.1)',
		borderRadius: 8,
	},
	graphXAxis: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 4,
		paddingHorizontal: 8,
	},
	graphXLabel: {
		fontSize: 10,
		color: '#999',
		textAlign: 'center',
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#333',
		marginHorizontal: 16,
		marginTop: 8,
		marginBottom: 16,
	},
	achievementCard: {
		flexDirection: 'row',
		backgroundColor: 'white',
		borderRadius: 12,
		marginHorizontal: 16,
		marginBottom: 12,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	achievementIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#E8E9FF',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	achievementContent: {
		flex: 1,
	},
	achievementTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 4,
	},
	achievementDescription: {
		fontSize: 14,
		color: '#666',
		marginBottom: 4,
	},
	achievementDate: {
		fontSize: 12,
		color: '#999',
	},
	quoteCard: {
		backgroundColor: '#E8E9FF',
		borderRadius: 12,
		marginHorizontal: 16,
		marginTop: 8,
		marginBottom: 20,
		padding: 16,
	},
	quoteText: {
		fontSize: 16,
		fontStyle: 'italic',
		color: '#5355B9',
		textAlign: 'left',
		marginBottom: 8,
	},
	quoteAuthor: {
		fontSize: 14,
		color: '#6366F1',
		textAlign: 'right',
	},
	tabBar: {
		flexDirection: 'row',
		backgroundColor: 'white',
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
		height: 60,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
	},
	tabItem: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	activeTab: {
		borderTopWidth: 2,
		borderTopColor: '#6366F1',
	},
	tabLabel: {
		fontSize: 12,
		color: '#666',
		marginTop: 4,
	},
	activeTabLabel: {
		color: '#6366F1',
	},
	// New styles for real data components
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 100,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: '#666',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 32,
		paddingTop: 100,
	},
	errorText: {
		marginTop: 16,
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
	},
	retryButton: {
		marginTop: 16,
		backgroundColor: '#6366F1',
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	retryButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
	statsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 12,
	},
	statItem: {
		alignItems: 'center',
		flex: 1,
	},
	statNumber: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	statLabel: {
		fontSize: 12,
		color: '#666',
		marginTop: 2,
	},
	insightsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	insightItem: {
		width: '48%',
		backgroundColor: '#F8F9FF',
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
		marginBottom: 12,
	},
	insightNumber: {
		fontSize: 24,
		fontWeight: '600',
		color: '#6366F1',
	},
	insightLabel: {
		fontSize: 14,
		color: '#666',
		marginTop: 4,
		textAlign: 'center',
	},
	noDataText: {
		textAlign: 'center',
		color: '#666',
		fontSize: 16,
		marginTop: 60,
	},
	noAchievementsCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		marginHorizontal: 16,
		marginBottom: 12,
		padding: 32,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	noAchievementsText: {
		fontSize: 16,
		color: '#666',
		marginTop: 12,
		fontWeight: '500',
	},
	noAchievementsSubtext: {
		fontSize: 14,
		color: '#999',
		marginTop: 4,
	},
	topHabitHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	topHabitTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#6366F1',
		marginLeft: 8,
	},
	topHabitName: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
		marginBottom: 4,
	},
	topHabitStats: {
		fontSize: 14,
		color: '#666',
	},
});
