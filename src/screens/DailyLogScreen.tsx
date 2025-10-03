import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStorage } from '../context/StorageContext';

export default function DailyLogScreen({ navigation }: any) {
  const { logs } = useStorage();

  // Sort logs by date descending (newest first)
  const sortedLogs = [...logs].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    if (isToday) {
      return `Today - ${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    } else if (isYesterday) {
      return `Yesterday - ${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    } else {
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
  };

  const getMoodEmoji = (mood?: number) => {
    const moods = ['😢', '😕', '😐', '🙂', '😄'];
    return mood !== undefined ? moods[mood] : '—';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} data-testid="button-back">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Food Log History</Text>
          <Text style={styles.headerSubtitle}>{logs.length} {logs.length === 1 ? 'day' : 'days'} logged</Text>
        </View>
      </View>

      <ScrollView style={styles.container}>
        {sortedLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No logs yet</Text>
            <Text style={styles.emptySubtitle}>Start tracking in the Wellness tab</Text>
          </View>
        ) : (
          sortedLogs.map((dayLog) => {
            const breakfastFoods = dayLog.meals?.breakfast || [];
            const lunchFoods = dayLog.meals?.lunch || [];
            const dinnerFoods = dayLog.meals?.dinner || [];
            const workouts = dayLog.workouts || [];
            const waterGlasses = dayLog.water || 0;
            const steps = dayLog.steps || '0';

            return (
              <View key={dayLog.date} style={styles.daySection}>
                {/* Date Header */}
                <View style={styles.dateHeader}>
                  <Ionicons name="calendar" size={20} color="#8B5CF6" />
                  <Text style={styles.dateHeaderText}>{formatDateHeader(dayLog.date)}</Text>
                </View>

                {/* Meals */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="restaurant" size={20} color="#8B5CF6" />
                    <Text style={styles.sectionTitle}>Meals</Text>
                  </View>

                  {/* Breakfast */}
                  <View style={styles.mealCard}>
                    <View style={styles.mealHeader}>
                      <Ionicons name="sunny" size={18} color="#F59E0B" />
                      <Text style={styles.mealTitle}>Breakfast</Text>
                    </View>
                    {breakfastFoods.length > 0 ? (
                      <>
                        {breakfastFoods.map((food, index) => (
                          <View key={index} style={styles.foodItem}>
                            <View style={styles.foodBullet} />
                            <Text style={styles.foodText}>{food}</Text>
                          </View>
                        ))}
                        {dayLog.mealFeelings?.breakfast && (
                          <View style={styles.feelingRow}>
                            <Ionicons name="heart" size={16} color="#EF4444" />
                            <Text style={styles.feelingText}>Feeling: {dayLog.mealFeelings.breakfast}/10</Text>
                          </View>
                        )}
                      </>
                    ) : (
                      <Text style={styles.emptyText}>Not logged</Text>
                    )}
                  </View>

                  {/* Lunch */}
                  <View style={styles.mealCard}>
                    <View style={styles.mealHeader}>
                      <Ionicons name="partly-sunny" size={18} color="#06B6D4" />
                      <Text style={styles.mealTitle}>Lunch</Text>
                    </View>
                    {lunchFoods.length > 0 ? (
                      <>
                        {lunchFoods.map((food, index) => (
                          <View key={index} style={styles.foodItem}>
                            <View style={styles.foodBullet} />
                            <Text style={styles.foodText}>{food}</Text>
                          </View>
                        ))}
                        {dayLog.mealFeelings?.lunch && (
                          <View style={styles.feelingRow}>
                            <Ionicons name="heart" size={16} color="#EF4444" />
                            <Text style={styles.feelingText}>Feeling: {dayLog.mealFeelings.lunch}/10</Text>
                          </View>
                        )}
                      </>
                    ) : (
                      <Text style={styles.emptyText}>Not logged</Text>
                    )}
                  </View>

                  {/* Dinner */}
                  <View style={styles.mealCard}>
                    <View style={styles.mealHeader}>
                      <Ionicons name="moon" size={18} color="#8B5CF6" />
                      <Text style={styles.mealTitle}>Dinner</Text>
                    </View>
                    {dinnerFoods.length > 0 ? (
                      <>
                        {dinnerFoods.map((food, index) => (
                          <View key={index} style={styles.foodItem}>
                            <View style={styles.foodBullet} />
                            <Text style={styles.foodText}>{food}</Text>
                          </View>
                        ))}
                        {dayLog.mealFeelings?.dinner && (
                          <View style={styles.feelingRow}>
                            <Ionicons name="heart" size={16} color="#EF4444" />
                            <Text style={styles.feelingText}>Feeling: {dayLog.mealFeelings.dinner}/10</Text>
                          </View>
                        )}
                      </>
                    ) : (
                      <Text style={styles.emptyText}>Not logged</Text>
                    )}
                  </View>
                </View>

                {/* Activity Summary */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="fitness" size={20} color="#10B981" />
                    <Text style={styles.sectionTitle}>Activity</Text>
                  </View>

                  <View style={styles.summaryGrid}>
                    <View style={styles.summaryCard}>
                      <Ionicons name="water" size={28} color="#3B82F6" />
                      <Text style={styles.summaryValue}>{waterGlasses}</Text>
                      <Text style={styles.summaryLabel}>Glasses</Text>
                    </View>

                    <View style={styles.summaryCard}>
                      <Ionicons name="walk" size={28} color="#10B981" />
                      <Text style={styles.summaryValue}>{parseInt(steps).toLocaleString()}</Text>
                      <Text style={styles.summaryLabel}>Steps</Text>
                    </View>

                    <View style={styles.summaryCard}>
                      <Text style={styles.moodEmoji}>{getMoodEmoji(dayLog.mood)}</Text>
                      <Text style={styles.summaryLabel}>Mood</Text>
                    </View>
                  </View>
                </View>

                {/* Mood & Wellness Details */}
                {dayLog.moodDetails && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="heart" size={20} color="#EF4444" />
                      <Text style={styles.sectionTitle}>Mood & Wellness</Text>
                    </View>
                    <View style={styles.moodDetailsCard}>
                      <View style={styles.moodDetailsGrid}>
                        <View style={styles.moodDetailItem}>
                          <Text style={styles.moodDetailLabel}>😊 Feeling</Text>
                          <Text style={styles.moodDetailValue}>{getMoodEmoji(dayLog.moodDetails.feeling)}</Text>
                        </View>
                        {dayLog.moodDetails.stressLevel !== undefined && (
                          <View style={styles.moodDetailItem}>
                            <Text style={styles.moodDetailLabel}>😰 Stress</Text>
                            <Text style={styles.moodDetailValue}>{dayLog.moodDetails.stressLevel}/10</Text>
                          </View>
                        )}
                        {dayLog.moodDetails.energyLevel !== undefined && (
                          <View style={styles.moodDetailItem}>
                            <Text style={styles.moodDetailLabel}>⚡ Energy</Text>
                            <Text style={styles.moodDetailValue}>{dayLog.moodDetails.energyLevel}/10</Text>
                          </View>
                        )}
                        {dayLog.moodDetails.sleepQuality !== undefined && (
                          <View style={styles.moodDetailItem}>
                            <Text style={styles.moodDetailLabel}>🛌 Sleep</Text>
                            <Text style={styles.moodDetailValue}>{dayLog.moodDetails.sleepQuality}/10</Text>
                          </View>
                        )}
                      </View>
                      {dayLog.moodDetails.symptoms && dayLog.moodDetails.symptoms.length > 0 && (
                        <View style={styles.symptomsSection}>
                          <Text style={styles.symptomsLabel}>Physical Symptoms:</Text>
                          <View style={styles.symptomsChips}>
                            {dayLog.moodDetails.symptoms.map((symptom, index) => (
                              <View key={index} style={styles.symptomChip}>
                                <Text style={styles.symptomChipText}>{symptom}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Fasting */}
                {dayLog.fasting && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="time" size={20} color="#F59E0B" />
                      <Text style={styles.sectionTitle}>Fasting</Text>
                    </View>
                    <View style={styles.fastingCard}>
                      <View style={styles.fastingRow}>
                        <Text style={styles.fastingLabel}>Duration:</Text>
                        <Text style={styles.fastingValue}>{dayLog.fasting.duration} hours</Text>
                      </View>
                      <View style={styles.fastingRow}>
                        <Text style={styles.fastingLabel}>Window:</Text>
                        <Text style={styles.fastingValue}>
                          {dayLog.fasting.startTime} - {dayLog.fasting.endTime}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Workouts */}
                {workouts.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="barbell" size={20} color="#EF4444" />
                      <Text style={styles.sectionTitle}>Workouts</Text>
                    </View>
                    {workouts.map((workout, index) => (
                      <View key={index} style={styles.workoutCard}>
                        <View style={styles.workoutRow}>
                          <Ionicons name="fitness" size={18} color="#EF4444" />
                          <Text style={styles.workoutType}>{workout.type}</Text>
                        </View>
                        <View style={styles.workoutDetails}>
                          <View style={styles.workoutDetail}>
                            <Ionicons name="time-outline" size={14} color="#6B7280" />
                            <Text style={styles.workoutDetailText}>{workout.duration} min</Text>
                          </View>
                          {workout.calories && (
                            <View style={styles.workoutDetail}>
                              <Ionicons name="flame-outline" size={14} color="#6B7280" />
                              <Text style={styles.workoutDetailText}>{workout.calories} cal</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.daySeparator} />
              </View>
            );
          })
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { marginRight: 12 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  daySection: {
    marginBottom: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    padding: 16,
    marginTop: 16,
  },
  dateHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  section: { marginHorizontal: 16, marginTop: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  foodBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#8B5CF6',
    marginRight: 10,
  },
  foodText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 6,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  moodEmoji: {
    fontSize: 28,
    marginVertical: 4,
  },
  fastingCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
  },
  fastingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  fastingLabel: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
  },
  fastingValue: {
    fontSize: 14,
    color: '#78350F',
    fontWeight: 'bold',
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  workoutDetails: {
    flexDirection: 'row',
    gap: 14,
  },
  workoutDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  workoutDetailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  daySeparator: {
    height: 2,
    backgroundColor: '#E5E7EB',
    marginTop: 16,
  },
  feelingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 6,
  },
  feelingText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  moodDetailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  moodDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodDetailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  moodDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
  },
  moodDetailValue: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  symptomsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  symptomsLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 10,
  },
  symptomsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  symptomChipText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  bottomPadding: { height: 40 },
});