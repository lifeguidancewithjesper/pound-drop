import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function RestaurantGuideScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} data-testid="button-back">
            <Ionicons name="arrow-back" size={24} color="#9333EA" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>🍽️ Restaurant Dining Guide</Text>
            <Text style={styles.headerSubtitle}>Enjoy meals out without guilt</Text>
          </View>
        </View>

        {/* Introduction Card */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Dining Out Doesn't Derail Your Progress!</Text>
          <Text style={styles.introText}>
            You can enjoy restaurant meals while staying aligned with your goals. Use these strategies to make smart choices that support your weight loss journey.
          </Text>
        </View>

        {/* General Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 General Smart Strategies</Text>
          
          <TipCard
            icon="checkmark-circle"
            iconColor="#16A34A"
            title="Before You Go"
            tips={[
              "Check the menu online ahead of time",
              "Eat greens at home before arriving at the restaurant - the fiber will help buffer carbs from the restaurant",
              "Drink water before the meal to help with portion control",
              "Set your intention: 'I'll enjoy this meal mindfully'"
            ]}
          />

          <TipCard
            icon="restaurant"
            iconColor="#9333EA"
            title="At the Restaurant"
            tips={[
              "Ask for water immediately (skip bread basket if possible)",
              "Order first to avoid peer pressure",
              "Request dressings and sauces on the side",
              "Don't be afraid to make modifications",
              "Share an entree or ask for a to-go box upfront"
            ]}
          />

          <TipCard
            icon="nutrition"
            iconColor="#DB2777"
            title="Ordering Guidelines"
            tips={[
              "Start with protein: grilled chicken, fish, steak, eggs",
              "Add non-starchy vegetables: salad, broccoli, asparagus",
              "Choose healthy fats: avocado, olive oil, nuts",
              "Limit or skip: bread, pasta, rice, potatoes, sugary drinks",
              "Ask how food is prepared (grilled vs fried)"
            ]}
          />
        </View>

        {/* Cuisine-Specific Guide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌍 Cuisine-Specific Guide</Text>

          <CuisineCard
            cuisine="American/Steakhouse"
            goodChoices={[
              "Grilled steak with vegetables",
              "Grilled chicken breast salad",
              "Bunless burger with side salad",
              "Grilled fish with steamed veggies"
            ]}
            avoid={[
              "Fried appetizers",
              "Loaded baked potatoes",
              "Creamy pasta dishes",
              "Sugary cocktails"
            ]}
          />

          <CuisineCard
            cuisine="Italian"
            goodChoices={[
              "Grilled chicken or fish with vegetables",
              "Salad with olive oil dressing",
              "Zucchini noodles (if available)",
              "Caprese salad (tomato, mozzarella, basil)"
            ]}
            avoid={[
              "Bread/breadsticks",
              "Pasta dishes",
              "Pizza",
              "Creamy sauces"
            ]}
          />

          <CuisineCard
            cuisine="Mexican"
            goodChoices={[
              "Fajitas (skip tortillas, focus on meat & veggies)",
              "Carne asada with guacamole",
              "Grilled fish tacos in lettuce wraps",
              "Burrito bowl (no rice, extra veggies)"
            ]}
            avoid={[
              "Chips and salsa (ask server not to bring)",
              "Flour tortillas",
              "Rice and beans",
              "Margaritas"
            ]}
          />

          <CuisineCard
            cuisine="Asian (Chinese/Thai/Japanese)"
            goodChoices={[
              "Steamed fish with vegetables",
              "Stir-fried vegetables with protein",
              "Sashimi (no rice)",
              "Hot pot with vegetables and meat"
            ]}
            avoid={[
              "Fried rice/noodles",
              "Sweet and sour dishes",
              "Breaded/fried items",
              "Sugary sauces"
            ]}
          />

          <CuisineCard
            cuisine="Fast Food (When Necessary)"
            goodChoices={[
              "Bunless burger with lettuce wrap",
              "Grilled chicken salad (no croutons)",
              "Egg-based breakfast items (no bread)",
              "Side salad instead of fries"
            ]}
            avoid={[
              "Buns, wraps, tortillas",
              "Fries and onion rings",
              "Milkshakes and sodas",
              "Breaded chicken"
            ]}
          />
        </View>

        {/* Mindful Eating Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧘 Mindful Eating Tips</Text>
          
          <View style={styles.mindfulCard}>
            <View style={styles.mindfulItem}>
              <Ionicons name="time-outline" size={24} color="#9333EA" />
              <View style={styles.mindfulContent}>
                <Text style={styles.mindfulTitle}>Eat Slowly</Text>
                <Text style={styles.mindfulText}>Put your fork down between bites. It takes 20 minutes for your brain to register fullness.</Text>
              </View>
            </View>

            <View style={styles.mindfulItem}>
              <Ionicons name="heart-outline" size={24} color="#DB2777" />
              <View style={styles.mindfulContent}>
                <Text style={styles.mindfulTitle}>Enjoy Every Bite</Text>
                <Text style={styles.mindfulText}>Focus on the flavors, textures, and company. Dining out is about the experience, not just the food.</Text>
              </View>
            </View>

            <View style={styles.mindfulItem}>
              <Ionicons name="hand-left-outline" size={24} color="#16A34A" />
              <View style={styles.mindfulContent}>
                <Text style={styles.mindfulTitle}>Stop When Satisfied</Text>
                <Text style={styles.mindfulText}>You don't have to finish everything. Listen to your body's fullness cues.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* No Guilt Zone */}
        <View style={styles.noGuiltCard}>
          <Ionicons name="happy-outline" size={48} color="#FACC15" />
          <Text style={styles.noGuiltTitle}>No Guilt Zone!</Text>
          <Text style={styles.noGuiltText}>
            If you indulge occasionally, that's perfectly okay. One meal doesn't ruin your progress. 
            Get back on track with your next meal. Consistency over perfection!
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Components
function TipCard({ icon, iconColor, title, tips }: { icon: any; iconColor: string; title: string; tips: string[] }) {
  return (
    <View style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <Ionicons name={icon} size={24} color={iconColor} />
        <Text style={styles.tipTitle}>{title}</Text>
      </View>
      <View style={styles.tipList}>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function CuisineCard({ cuisine, goodChoices, avoid }: { cuisine: string; goodChoices: string[]; avoid: string[] }) {
  return (
    <View style={styles.cuisineCard}>
      <Text style={styles.cuisineName}>{cuisine}</Text>
      
      <View style={styles.choicesSection}>
        <View style={styles.goodChoices}>
          <View style={styles.choicesHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            <Text style={styles.choicesHeaderText}>Good Choices</Text>
          </View>
          {goodChoices.map((choice, index) => (
            <Text key={index} style={styles.choiceText}>✓ {choice}</Text>
          ))}
        </View>

        <View style={styles.avoidChoices}>
          <View style={styles.choicesHeader}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text style={styles.choicesHeaderText}>Avoid/Limit</Text>
          </View>
          {avoid.map((item, index) => (
            <Text key={index} style={styles.avoidText}>✗ {item}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  introCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#9333EA',
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4338CA',
    marginBottom: 12,
  },
  introText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  tipList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 16,
    color: '#9333EA',
    marginRight: 8,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  cuisineCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cuisineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  choicesSection: {
    gap: 16,
  },
  goodChoices: {
    gap: 8,
  },
  avoidChoices: {
    gap: 8,
  },
  choicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  choicesHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  choiceText: {
    fontSize: 14,
    color: '#16A34A',
    marginLeft: 28,
  },
  avoidText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 28,
  },
  mindfulCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mindfulItem: {
    flexDirection: 'row',
    gap: 16,
  },
  mindfulContent: {
    flex: 1,
  },
  mindfulTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  mindfulText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  noGuiltCard: {
    margin: 16,
    padding: 24,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FACC15',
  },
  noGuiltTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#92400E',
    marginTop: 12,
    marginBottom: 12,
  },
  noGuiltText: {
    fontSize: 15,
    color: '#78350F',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 40,
  },
});
