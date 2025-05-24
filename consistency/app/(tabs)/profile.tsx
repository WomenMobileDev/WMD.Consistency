import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

// Mock data - in a real app, this would come from a database or API
const userData = {
	name: 'Alex Johnson',
	daysSmokeFree: 95,
	consistency: 'Consistent',
	avatar: null, // We'll use a default instead
	achievements: [
		{
			id: '1',
			title: 'Week One Warrior',
			description: 'Successfully completed your first smoke-free week!',
			date: '2023-10-07',
			icon: 'ribbon',
		},
		{
			id: '2',
			title: 'Month One Milestone',
			description: 'Reached one full month without smoking. Keep going!',
			date: '2023-11-06',
			icon: 'ribbon',
		},
		{
			id: '3',
			title: 'Knowledge Seeker',
			description: 'Read 5 articles on quitting strategies in the app.',
			date: '2023-10-15',
			icon: 'bulb',
		},
	],
	quote: {
		text: 'The secret of getting ahead is getting started.',
		author: 'Mark Twain',
	},
};

// Default avatar component
const Avatar = () => (
	<View style={styles.avatarContainer}>
		<Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
	</View>
);

// Mock data for the consistency graph
const mockGraphData = [
	{ day: 'Jan 01', value: 80 },
	{ day: 'Jan 07', value: 65 },
	{ day: 'Jan 12', value: 85 },
	{ day: 'Jan 17', value: 75 },
	{ day: 'Jan 22', value: 90 },
	{ day: 'Jan 30', value: 85 },
];

export default function ProfileScreen() {
	// Function to render the graph - this is a simplified version
	const renderGraph = () => {
		const maxHeight = 150;

		return (
			<View style={styles.graphContainer}>
				<View style={styles.graphLabels}>
					<Text style={styles.graphLabel}>100</Text>
					<Text style={styles.graphLabel}>75</Text>
					<Text style={styles.graphLabel}>50</Text>
					<Text style={styles.graphLabel}>25</Text>
					<Text style={styles.graphLabel}>0</Text>
				</View>
				<View style={styles.graph}>
					<View style={styles.graphBackground}>
						{Array.from({ length: 6 }).map((_, i) => (
							<View
								key={`bg-${i}`}
								style={[styles.gridLine, { top: i * (maxHeight / 5) }]}
							/>
						))}
					</View>

					<View style={styles.graphContent}>
						{mockGraphData.map((dataPoint, index) => {
							const barHeight = (dataPoint.value / 100) * maxHeight;

							// For a filled area graph effect
							const areaHeight = barHeight;

							return (
								<View key={dataPoint.day} style={styles.dataPointContainer}>
									<View style={styles.dataPointArea}>
										<View
											style={[styles.dataPointFill, { height: areaHeight }]}
										/>
									</View>
									<Text style={styles.dataPointLabel}>{dataPoint.day}</Text>
								</View>
							);
						})}
					</View>

					{/* Connect the dots for line graph effect */}
					<View style={styles.lineOverlay}>
						<View style={styles.lineGraph} />
					</View>
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Profile</Text>
				<View style={styles.headerAvatarContainer}>
					<Avatar />
				</View>
			</View>

			<ScrollView
				style={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.profileHeader}>
					<View style={styles.profileAvatarContainer}>
						<Avatar />
					</View>
					<View style={styles.profileInfo}>
						<Text style={styles.profileName}>{userData.name}</Text>
						<Text style={styles.profileDays}>
							{userData.daysSmokeFree} Days Smoke-Free
						</Text>
						<View style={styles.consistencyBadge}>
							<Text style={styles.consistencyText}>{userData.consistency}</Text>
						</View>
					</View>
				</View>

				<View style={styles.card}>
					<Text style={styles.cardTitle}>30-Day Consistency</Text>
					<View style={styles.graphWrapper}>
						<View style={styles.graphArea}>
							{mockGraphData.map((dataPoint, index) => {
								const y = 150 - (dataPoint.value / 100) * 150;
								const x = index * ((width - 80) / (mockGraphData.length - 1));

								// Create connecting lines between points
								let line = null;
								if (index < mockGraphData.length - 1) {
									const nextPoint = mockGraphData[index + 1];
									const nextY = 150 - (nextPoint.value / 100) * 150;
									const nextX =
										(index + 1) * ((width - 80) / (mockGraphData.length - 1));

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
													{ translateX: 0 },
													{ translateY: 0 },
													{ rotate: `${angle}rad` },
													{ translateX: 0 },
													{ translateY: 0 },
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
							{mockGraphData.map((dataPoint, index) => (
								<Text key={`label-${index}`} style={styles.graphXLabel}>
									{dataPoint.day}
								</Text>
							))}
						</View>
					</View>
				</View>

				<Text style={styles.sectionTitle}>Achievements</Text>

				{userData.achievements.map((achievement) => (
					<View key={achievement.id} style={styles.achievementCard}>
						<View style={styles.achievementIconContainer}>
							<Ionicons
								name={achievement.icon as any}
								size={24}
								color="#6366F1"
							/>
						</View>
						<View style={styles.achievementContent}>
							<Text style={styles.achievementTitle}>{achievement.title}</Text>
							<Text style={styles.achievementDescription}>
								{achievement.description}
							</Text>
							<Text style={styles.achievementDate}>
								Achieved: {achievement.date}
							</Text>
						</View>
					</View>
				))}

				<View style={styles.quoteCard}>
					<Text style={styles.quoteText}>
						&quot;{userData.quote.text}&quot;
					</Text>
					<Text style={styles.quoteAuthor}>- {userData.quote.author}</Text>
				</View>

				<View style={{ height: 80 }} />
			</ScrollView>

			{/* Tab navigation */}
			<View style={styles.tabBar}>
				<Link href="/(tabs)" style={styles.tabItem}>
					<Ionicons name="home-outline" size={24} color="#666" />
					<Text style={styles.tabLabel}>Today</Text>
				</Link>
				<View style={[styles.tabItem, styles.activeTab]}>
					<Ionicons name="person" size={24} color="#6366F1" />
					<Text style={[styles.tabLabel, styles.activeTabLabel]}>Profile</Text>
				</View>
			</View>
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
});
