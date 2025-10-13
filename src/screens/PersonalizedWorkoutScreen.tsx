import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { naturalExercises, workoutPlans, WorkoutPlan } from '../data/naturalExercises';

type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
type FitnessGoal = 'weight-loss' | 'toning' | 'flexibility' | 'general-fitness';

export default function PersonalizedWorkoutScreen() {
  const navigation = useNavigation();
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel>('beginner');
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal>('general-fitness');

  const selectedPlan = workoutPlans.find(
    plan => plan.level === selectedLevel && plan.goal === selectedGoal
  );

  const getExerciseDetails = (exerciseId: string) => {
    return naturalExercises.find(ex => ex.id === exerciseId);
  };

  const renderLevelButton = (level: FitnessLevel, label: string, icon: any) => (
    <TouchableOpacity
      data-testid={`button-level-${level}`}
      style={[
        styles.levelButton,
        selectedLevel === level && styles.levelButtonActive
      ]}
      onPress={() => setSelectedLevel(level)}
    >
      <Ionicons 
        name={icon} 
        size={24} 
        color={selectedLevel === level ? '#fff' : '#9333EA'} 
      />
      <Text style={[
        styles.levelButtonText,
        selectedLevel === level && styles.levelButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderGoalButton = (goal: FitnessGoal, label: string, icon: any) => (
    <TouchableOpacity
      data-testid={`button-goal-${goal}`}
      style={[
        styles.goalButton,
        selectedGoal === goal && styles.goalButtonActive
      ]}
      onPress={() => setSelectedGoal(goal)}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={selectedGoal === goal ? '#fff' : '#DB2777'} 
      />
      <Text style={[
        styles.goalButtonText,
        selectedGoal === goal && styles.goalButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          data-testid="button-back"
        >
          <Ionicons name="arrow-back" size={24} color="#9333EA" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="barbell" size={32} color="#9333EA" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Personalized Workout Plans</Text>
            <Text style={styles.headerSubtitle}>Natural exercises, no equipment needed</Text>
          </View>
        </View>
      </View>

      {/* Fitness Level Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Your Fitness Level</Text>
        <View style={styles.levelContainer}>
          {renderLevelButton('beginner', 'Beginner', 'walk')}
          {renderLevelButton('intermediate', 'Intermediate', 'fitness')}
          {renderLevelButton('advanced', 'Advanced', 'flash')}
        </View>
      </View>

      {/* Goal Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Your Goal</Text>
        <View style={styles.goalContainer}>
          {renderGoalButton('weight-loss', 'Weight Loss', 'flame')}
          {renderGoalButton('toning', 'Toning', 'body')}
          {renderGoalButton('flexibility', 'Flexibility', 'leaf')}
          {renderGoalButton('general-fitness', 'General Fitness', 'shield-checkmark')}
        </View>
      </View>

      {/* Workout Plan */}
      {selectedPlan && (
        <View style={styles.section}>
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{selectedPlan.name}</Text>
              <View style={styles.durationBadge}>
                <Ionicons name="time" size={16} color="#9333EA" />
                <Text style={styles.durationText}>{selectedPlan.duration}</Text>
              </View>
            </View>
            <Text style={styles.planDescription}>{selectedPlan.description}</Text>

            {/* Exercise List */}
            <View style={styles.exercisesSection}>
              <Text style={styles.exercisesTitle}>Workout Exercises:</Text>
              {selectedPlan.exercises.map((planEx, index) => {
                const exercise = getExerciseDetails(planEx.exerciseId);
                if (!exercise) return null;

                return (
                  <View key={index} style={styles.exerciseCard} data-testid={`exercise-${index}`}>
                    <View style={styles.exerciseNumber}>
                      <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.exerciseContent}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                      <View style={styles.exerciseDetails}>
                        {exercise.reps && (
                          <View style={styles.detailBadge}>
                            <Text style={styles.detailText}>Reps: {exercise.reps}</Text>
                          </View>
                        )}
                        {exercise.duration && (
                          <View style={styles.detailBadge}>
                            <Text style={styles.detailText}>Duration: {exercise.duration}</Text>
                          </View>
                        )}
                        {planEx.sets && (
                          <View style={styles.detailBadge}>
                            <Text style={styles.detailText}>Sets: {planEx.sets}</Text>
                          </View>
                        )}
                        {planEx.rest && (
                          <View style={styles.detailBadge}>
                            <Text style={styles.detailText}>Rest: {planEx.rest}</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.musclesRow}>
                        <Ionicons name="fitness" size={14} color="#6B7280" />
                        <Text style={styles.musclesText}>
                          {exercise.muscles.join(', ')}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Equipment Badge */}
            <View style={styles.equipmentBadge}>
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
              <Text style={styles.equipmentText}>
                {selectedPlan.exercises.every(ex => {
                  const exercise = getExerciseDetails(ex.exerciseId);
                  return exercise?.equipment === 'none';
                })
                  ? 'No equipment needed!'
                  : 'Minimal equipment needed (chair)'}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color="#F59E0B" />
          <Text style={styles.tipText}>
            💪 Tip: Start with proper form, listen to your body, and stay hydrated. Consistency beats intensity!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginLeft: 50,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  levelContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  levelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelButtonActive: {
    backgroundColor: '#9333EA',
    borderColor: '#9333EA',
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9333EA',
  },
  levelButtonTextActive: {
    color: '#fff',
  },
  goalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalButtonActive: {
    backgroundColor: '#DB2777',
    borderColor: '#DB2777',
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DB2777',
  },
  goalButtonTextActive: {
    color: '#fff',
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#9333EA',
    flex: 1,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9333EA',
  },
  planDescription: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 22,
  },
  exercisesSection: {
    marginTop: 8,
  },
  exercisesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9333EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 18,
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  detailBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  musclesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  musclesText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  equipmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  equipmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
    flex: 1,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});
