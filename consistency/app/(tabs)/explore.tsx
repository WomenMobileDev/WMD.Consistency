import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ExploreScreen() {
	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
			headerImage={
				<IconSymbol
					size={310}
					color="#808080"
					name="chevron.left.forwardslash.chevron.right"
					style={styles.headerImage}
				/>
			}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">Explore</ThemedText>
			</ThemedView>
			<ThemedText>
				Discover tools and strategies to build consistent habits.
			</ThemedText>

			<Collapsible title="The Science of Habit Formation">
				<ThemedText>
					Building habits requires understanding the habit loop: cue, craving,
					response, and reward.
				</ThemedText>
				<ThemedText>
					The key to forming lasting habits is to make them obvious, attractive,
					easy, and satisfying.
				</ThemedText>
				<ExternalLink href="https://jamesclear.com/habits">
					<ThemedText type="link">Learn more</ThemedText>
				</ExternalLink>
			</Collapsible>

			<Collapsible title="Tracking Your Progress">
				<ThemedText>
					Consistency tracking helps you visualize your progress and maintain
					motivation.
				</ThemedText>
				<ThemedText>
					Use this app to track your daily activities and build consistency over
					time.
				</ThemedText>
			</Collapsible>

			<Collapsible title="Setting Realistic Goals">
				<ThemedText>
					Start with small, achievable goals to build momentum and confidence.
				</ThemedText>
				<ThemedText>
					Remember that consistency matters more than intensity when forming
					habits.
				</ThemedText>
				<ExternalLink href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3505409/">
					<ThemedText type="link">Research on habit formation</ThemedText>
				</ExternalLink>
			</Collapsible>

			<Collapsible title="Overcoming Obstacles">
				<ThemedText>
					Identify potential obstacles in advance and create strategies to
					overcome them.
				</ThemedText>
				<ThemedText>
					Use implementation intentions (If X happens, then I will do Y) to stay
					on track.
				</ThemedText>
			</Collapsible>

			<Collapsible title="Building a Support System">
				<ThemedText>
					Share your goals with others who can provide encouragement and
					accountability.
				</ThemedText>
				<ThemedText>
					Consider joining groups or communities focused on similar goals for
					additional support.
				</ThemedText>
			</Collapsible>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
	titleContainer: {
		flexDirection: 'row',
		gap: 8,
	},
});
