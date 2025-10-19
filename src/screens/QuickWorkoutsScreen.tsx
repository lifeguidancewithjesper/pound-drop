import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { quickWorkouts, QuickWorkout } from '../data/quickWorkouts';
import { useStorage } from '../context/StorageContext';

type WorkoutFilter = 'all' | 'Walking' | 'HIIT' | 'Strength' | 'Cardio' | 'Flexibility';

export default function QuickWorkoutsScreen() {
  const navigation = useNavigation();
  const [filter, setFilter] = useState<WorkoutFilter>('all');
  const [selectedWorkout, setSelectedWorkout] = useState<QuickWorkout | null>(null);
  const { updateTodayLog, getTodayLog } = useStorage();
  const todayLog = getTodayLog();

  const filteredWorkouts = filter === 'all' 
    ? quickWorkouts 
    : quickWorkouts.filter(workout => workout.category === filter);

  const logWorkout = (workout: QuickWorkout) => {
    const currentWorkouts = todayLog?.workouts || [];
    // Extract duration number (e.g., "10-15 min" -> "10")
    const durationMatch = workout.duration.match(/\d+/);
    const durationNum = durationMatch ? durationMatch[0] : '15';
    
    const workoutLog = {
      type: workout.name,
      duration: durationNum,
      calories: undefined
    };
    
    updateTodayLog({
      workouts: [...currentWorkouts, workoutLog]
    });

    Alert.alert(
      '✅ Workout Logged!',
      `${workout.name} has been added to your daily log`,
      [
        { text: 'Do Another', onPress: () => setSelectedWorkout(null) },
        { text: 'Done', onPress: () => navigation.goBack() }
      ]
    );
  };

  const DifficultyBadge = ({ level }: { level: string }) => {
    const colors = {
      'Beginner': '#16A34A',
      'Intermediate': '#F59E0B',
      'Advanced': '#DC2626',
    };
    return (
      <View style={[styles.difficultyBadge, { backgroundColor: `${colors[level as keyof typeof colors]}20` }]}>
        <Text style={[styles.difficultyText, { color: colors[level as keyof typeof colors] }]}>
          {level}
        </Text>
      </View>
    );
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    const icons: Record<string, any> = {
      'Walking': 'walk',
      'HIIT': 'flash',
      'Strength': 'barbell',
      'Cardio': 'heart',
      'Flexibility': 'body',
    };
    return <Ionicons name={icons[category] || 'fitness'} size={20} color="#9333EA" />;
  };

  if (selectedWorkout) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        {/* Workout Detail Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setSelectedWorkout(null)}
            style={styles.backButton}
            data-testid="button-back-detail"
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{selectedWorkout.name}</Text>
            <Text style={styles.headerSubtitle}>{selectedWorkout.duration} • {selectedWorkout.category}</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Workout Info */}
          <View style={styles.detailCard}>
            <Text style={styles.detailDescription}>{selectedWorkout.description}</Text>
            
            <View style={styles.detailStats}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={24} color="#9333EA" />
                <Text style={styles.statValue}>{selectedWorkout.duration}</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="flame-outline" size={24} color="#F97316" />
                <Text style={styles.statValue}>{selectedWorkout.caloriesBurned}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={styles.statItem}>
                <CategoryIcon category={selectedWorkout.category} />
                <Text style={styles.statValue}>{selectedWorkout.category}</Text>
                <Text style={styles.statLabel}>Type</Text>
              </View>
            </View>

            <View style={styles.badgesRow}>
              <DifficultyBadge level={selectedWorkout.difficulty} />
              {selectedWorkout.noEquipment && (
                <View style={styles.equipmentBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                  <Text style={styles.equipmentText}>No Equipment</Text>
                </View>
              )}
              {selectedWorkout.recommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>PD Method - Recommended</Text>
                </View>
              )}
            </View>
          </View>

          {/* Exercise List */}
          <View style={styles.exerciseSection}>
            <Text style={styles.exerciseTitle}>Workout Routine</Text>
            {selectedWorkout.exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.exerciseMeta}>
                    <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
                    {exercise.reps && (
                      <Text style={styles.exerciseReps}> • {exercise.reps}</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Log Workout Button */}
          <TouchableOpacity
            style={styles.logButton}
            onPress={() => logWorkout(selectedWorkout)}
            data-testid="button-log-workout"
          >
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.logButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          data-testid="button-back"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Quick Workouts</Text>
          <Text style={styles.headerSubtitle}>10-15 min routines for busy schedules</Text>
        </View>
      </View>

      {/* Medical Disclaimer */}
      <View style={styles.disclaimerBox}>
        <Ionicons name="medical" size={18} color="#DC2626" />
        <Text style={styles.disclaimerText}>
          <Text style={styles.disclaimerBold}>Medical Advisory:</Text> Start slowly and listen to your body. Consult with your physician before beginning any new exercise program.
        </Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
        contentContainerStyle={styles.filterContainer}
      >
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
          data-testid="filter-all"
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'Walking' && styles.filterTabActive]}
          onPress={() => setFilter('Walking')}
          data-testid="filter-walking"
        >
          <Text style={[styles.filterText, filter === 'Walking' && styles.filterTextActive]}>Walking</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'HIIT' && styles.filterTabActive]}
          onPress={() => setFilter('HIIT')}
          data-testid="filter-hiit"
        >
          <Text style={[styles.filterText, filter === 'HIIT' && styles.filterTextActive]}>HIIT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'Strength' && styles.filterTabActive]}
          onPress={() => setFilter('Strength')}
          data-testid="filter-strength"
        >
          <Text style={[styles.filterText, filter === 'Strength' && styles.filterTextActive]}>Strength</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'Cardio' && styles.filterTabActive]}
          onPress={() => setFilter('Cardio')}
          data-testid="filter-cardio"
        >
          <Text style={[styles.filterText, filter === 'Cardio' && styles.filterTextActive]}>Cardio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'Flexibility' && styles.filterTabActive]}
          onPress={() => setFilter('Flexibility')}
          data-testid="filter-flexibility"
        >
          <Text style={[styles.filterText, filter === 'Flexibility' && styles.filterTextActive]}>Flexibility</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Workout List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {filteredWorkouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={styles.workoutCard}
            onPress={() => setSelectedWorkout(workout)}
            data-testid={`workout-card-${workout.id}`}
          >
            <View style={styles.workoutHeader}>
              <CategoryIcon category={workout.category} />
              <Text style={styles.workoutName}>{workout.name}</Text>
            </View>
            
            <Text style={styles.workoutDescription}>{workout.description}</Text>
            
            <View style={styles.workoutMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.metaText}>{workout.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="flame-outline" size={16} color="#F97316" />
                <Text style={styles.metaText}>{workout.caloriesBurned} cal</Text>
              </View>
              <DifficultyBadge level={workout.difficulty} />
              {workout.recommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>PD Method</Text>
                </View>
              )}
            </View>

            {workout.noEquipment && (
              <View style={styles.noEquipmentBanner}>
                <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                <Text style={styles.noEquipmentText}>No equipment needed</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  headerTextContainer: {
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
    marginTop: 2,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    gap: 10,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  disclaimerBold: {
    fontWeight: '700',
    color: '#DC2626',
  },
  filterScrollView: {
    flexGrow: 0,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterTabActive: {
    backgroundColor: '#9333EA',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  noEquipmentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  noEquipmentText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '500',
  },
  recommendedBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  // Detail View Styles
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailDescription: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 20,
    lineHeight: 22,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  equipmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  equipmentText: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '600',
  },
  exerciseSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9333EA',
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseDuration: {
    fontSize: 13,
    color: '#6B7280',
  },
  exerciseReps: {
    fontSize: 13,
    color: '#9333EA',
    fontWeight: '500',
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9333EA',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  logButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
});
