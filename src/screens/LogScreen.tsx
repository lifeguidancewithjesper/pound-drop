import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useStorage } from '../context/StorageContext';

export default function LogScreen() {
  const { getTodayLog, updateTodayLog } = useStorage();
  const todayLog = getTodayLog();

  const [weight, setWeight] = useState('');
  const [steps, setSteps] = useState('');
  const [water, setWater] = useState(0);
  const [selectedMood, setSelectedMood] = useState<number | undefined>(undefined);
  
  // Measurements
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [chest, setChest] = useState('');
  const [arms, setArms] = useState('');
  const [thighs, setThighs] = useState('');

  // Meals
  const [breakfastInput, setBreakfastInput] = useState('');
  const [lunchInput, setLunchInput] = useState('');
  const [dinnerInput, setDinnerInput] = useState('');

  // Workout
  const [workoutType, setWorkoutType] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [workoutCalories, setWorkoutCalories] = useState('');

  useEffect(() => {
    if (todayLog) {
      setWeight(todayLog.weight || '');
      setSteps(todayLog.steps || '');
      setWater(todayLog.water || 0);
      setSelectedMood(todayLog.mood);
      if (todayLog.measurements) {
        setWaist(todayLog.measurements.waist || '');
        setHips(todayLog.measurements.hips || '');
        setChest(todayLog.measurements.chest || '');
        setArms(todayLog.measurements.arms || '');
        setThighs(todayLog.measurements.thighs || '');
      }
    }
  }, [todayLog]);

  const incrementWater = () => {
    updateTodayLog((prev) => {
      const newValue = Math.min((prev.water || 0) + 1, 12);
      setWater(newValue);
      return { water: newValue };
    });
  };

  const decrementWater = () => {
    updateTodayLog((prev) => {
      const newValue = Math.max((prev.water || 0) - 1, 0);
      setWater(newValue);
      return { water: newValue };
    });
  };

  const handleLogWeight = () => {
    if (!weight) {
      Alert.alert('Error', 'Please enter your weight');
      return;
    }
    updateTodayLog({ weight });
    Alert.alert('Success', 'Weight logged successfully!');
  };

  const handleLogSteps = () => {
    if (!steps) {
      Alert.alert('Error', 'Please enter your steps');
      return;
    }
    updateTodayLog({ steps });
    Alert.alert('Success', 'Steps logged successfully!');
  };

  const handleMoodSelect = (moodIndex: number) => {
    setSelectedMood(moodIndex);
    updateTodayLog({ mood: moodIndex });
    Alert.alert('Success', 'Mood logged successfully!');
  };

  const handleLogMeasurements = () => {
    if (!waist && !hips && !chest && !arms && !thighs) {
      Alert.alert('Error', 'Please enter at least one measurement');
      return;
    }
    updateTodayLog({ 
      measurements: { waist, hips, chest, arms, thighs }
    });
    Alert.alert('Success', 'Measurements logged successfully!');
  };

  const handleLogMeal = (mealType: 'breakfast' | 'lunch' | 'dinner', foodItem: string) => {
    if (!foodItem.trim()) {
      Alert.alert('Error', 'Please enter a food item');
      return;
    }
    // Use callback form to get latest state
    updateTodayLog((prev) => {
      const currentMeals = prev.meals || {};
      const currentMealItems = currentMeals[mealType] || [];
      return {
        meals: {
          ...currentMeals,
          [mealType]: [...currentMealItems, foodItem.trim()]
        }
      };
    });
    
    // Clear input
    if (mealType === 'breakfast') setBreakfastInput('');
    if (mealType === 'lunch') setLunchInput('');
    if (mealType === 'dinner') setDinnerInput('');
    
    Alert.alert('Success', `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} item added!`);
  };

  const handleLogWorkout = () => {
    if (!workoutType || !workoutDuration) {
      Alert.alert('Error', 'Please enter workout type and duration');
      return;
    }
    // Use callback form to get latest state
    updateTodayLog((prev) => {
      const currentWorkouts = prev.workouts || [];
      return {
        workouts: [
          ...currentWorkouts,
          { type: workoutType, duration: workoutDuration, calories: workoutCalories }
        ]
      };
    });
    setWorkoutType('');
    setWorkoutDuration('');
    setWorkoutCalories('');
    Alert.alert('Success', 'Workout logged successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Weight */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="scale" size={24} color="#8B5CF6" />
          <Text style={styles.sectionTitle}>Weight</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter weight (lbs)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            data-testid="input-weight"
          />
          <TouchableOpacity 
            style={[styles.button, styles.purpleButton]}
            onPress={handleLogWeight}
            data-testid="button-log-weight"
          >
            <Text style={styles.buttonText}>Log Weight</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Steps */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="walk" size={24} color="#10B981" />
          <Text style={styles.sectionTitle}>Steps</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter step count"
            value={steps}
            onChangeText={setSteps}
            keyboardType="numeric"
            data-testid="input-steps"
          />
          <TouchableOpacity 
            style={[styles.button, styles.greenButton]}
            onPress={handleLogSteps}
            data-testid="button-log-steps"
          >
            <Text style={styles.buttonText}>Log Steps</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Water */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="water" size={24} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Water</Text>
        </View>
        <View style={styles.waterContainer}>
          <TouchableOpacity 
            style={styles.waterButton} 
            onPress={decrementWater}
            data-testid="button-decrease-water"
          >
            <Ionicons name="remove-circle" size={40} color="#3B82F6" />
          </TouchableOpacity>
          <View style={styles.waterDisplay}>
            <Text style={styles.waterCount} data-testid="text-water-count">{water}</Text>
            <Text style={styles.waterLabel}>glasses</Text>
          </View>
          <TouchableOpacity 
            style={styles.waterButton} 
            onPress={incrementWater}
            data-testid="button-increase-water"
          >
            <Ionicons name="add-circle" size={40} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Meals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="restaurant" size={24} color="#06B6D4" />
          <Text style={styles.sectionTitle}>Meals</Text>
        </View>
        
        {/* Breakfast */}
        <View style={styles.mealSection}>
          <View style={styles.mealHeader}>
            <Ionicons name="sunny" size={20} color="#F59E0B" />
            <Text style={styles.mealTitle}>Breakfast</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add food item"
              value={breakfastInput}
              onChangeText={setBreakfastInput}
              data-testid="input-breakfast"
            />
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#F59E0B' }]}
              onPress={() => handleLogMeal('breakfast', breakfastInput)}
              data-testid="button-log-breakfast"
            >
              <Text style={styles.buttonText}>Add to Breakfast</Text>
            </TouchableOpacity>
          </View>
          {todayLog?.meals?.breakfast && todayLog.meals.breakfast.length > 0 && (
            <View style={styles.mealItems}>
              {todayLog.meals.breakfast.map((item, idx) => (
                <Text key={idx} style={styles.mealItem}>• {item}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Lunch */}
        <View style={styles.mealSection}>
          <View style={styles.mealHeader}>
            <Ionicons name="partly-sunny" size={20} color="#06B6D4" />
            <Text style={styles.mealTitle}>Lunch</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add food item"
              value={lunchInput}
              onChangeText={setLunchInput}
              data-testid="input-lunch"
            />
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#06B6D4' }]}
              onPress={() => handleLogMeal('lunch', lunchInput)}
              data-testid="button-log-lunch"
            >
              <Text style={styles.buttonText}>Add to Lunch</Text>
            </TouchableOpacity>
          </View>
          {todayLog?.meals?.lunch && todayLog.meals.lunch.length > 0 && (
            <View style={styles.mealItems}>
              {todayLog.meals.lunch.map((item, idx) => (
                <Text key={idx} style={styles.mealItem}>• {item}</Text>
              ))}
            </View>
          )}
        </View>
        {/* Dinner */}
        <View style={styles.mealSection}>
          <View style={styles.mealHeader}>
            <Ionicons name="moon" size={20} color="#6366F1" />
            <Text style={styles.mealTitle}>Dinner</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add food item"
              value={dinnerInput}
              onChangeText={setDinnerInput}
              data-testid="input-dinner"
            />
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#6366F1' }]}
              onPress={() => handleLogMeal('dinner', dinnerInput)}
              data-testid="button-log-dinner"
            >
              <Text style={styles.buttonText}>Add to Dinner</Text>
            </TouchableOpacity>
          </View>
          {todayLog?.meals?.dinner && todayLog.meals.dinner.length > 0 && (
            <View style={styles.mealItems}>
              {todayLog.meals.dinner.map((item, idx) => (
                <Text key={idx} style={styles.mealItem}>• {item}</Text>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Mood */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="happy" size={24} color="#EF4444" />
          <Text style={styles.sectionTitle}>Mood</Text>
        </View>
        <View style={styles.moodContainer}>
          {['😢', '😕', '😐', '🙂', '😄'].map((emoji, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[
                styles.moodButton,
                selectedMood === idx && styles.selectedMoodButton
              ]}
              onPress={() => handleMoodSelect(idx)}
              data-testid={`button-mood-${idx}`}
            >
              <Text style={styles.moodEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Measurements */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="resize" size={24} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Measurements</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Waist (inches)"
            value={waist}
            onChangeText={setWaist}
            keyboardType="numeric"
            data-testid="input-waist"
          />
          <TextInput
            style={styles.input}
            placeholder="Hips (inches)"
            value={hips}
            onChangeText={setHips}
            keyboardType="numeric"
            data-testid="input-hips"
          />
          <TextInput
            style={styles.input}
            placeholder="Chest (inches)"
            value={chest}
            onChangeText={setChest}
            keyboardType="numeric"
            data-testid="input-chest"
          />
          <TextInput
            style={styles.input}
            placeholder="Arms (inches)"
            value={arms}
            onChangeText={setArms}
            keyboardType="numeric"
            data-testid="input-arms"
          />
          <TextInput
            style={styles.input}
            placeholder="Thighs (inches)"
            value={thighs}
            onChangeText={setThighs}
            keyboardType="numeric"
            data-testid="input-thighs"
          />
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#F59E0B' }]}
            onPress={handleLogMeasurements}
            data-testid="button-log-measurements"
          >
            <Text style={styles.buttonText}>Log Measurements</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Workouts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="barbell" size={24} color="#EC4899" />
          <Text style={styles.sectionTitle}>Workout</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Workout type (e.g., Running, Yoga)"
            value={workoutType}
            onChangeText={setWorkoutType}
            data-testid="input-workout-type"
          />
          <TextInput
            style={styles.input}
            placeholder="Duration (minutes)"
            value={workoutDuration}
            onChangeText={setWorkoutDuration}
            keyboardType="numeric"
            data-testid="input-workout-duration"
          />
          <TextInput
            style={styles.input}
            placeholder="Calories burned (optional)"
            value={workoutCalories}
            onChangeText={setWorkoutCalories}
            keyboardType="numeric"
            data-testid="input-workout-calories"
          />
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#EC4899' }]}
            onPress={handleLogWorkout}
            data-testid="button-log-workout"
          >
            <Text style={styles.buttonText}>Log Workout</Text>
          </TouchableOpacity>
        </View>
        
        {/* Show today's workouts */}
        {todayLog?.workouts && todayLog.workouts.length > 0 && (
          <View style={styles.workoutsList}>
            <Text style={styles.workoutsTitle}>Today's Workouts:</Text>
            {todayLog.workouts.map((workout, idx) => (
              <View key={idx} style={styles.workoutItem}>
                <Text style={styles.workoutText}>
                  {workout.type} - {workout.duration} min
                  {workout.calories ? ` (${workout.calories} cal)` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  inputContainer: {
    gap: 12,
  },
  input: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  purpleButton: {
    backgroundColor: '#8B5CF6',
  },
  greenButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  waterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  waterButton: {
    padding: 8,
  },
  waterDisplay: {
    alignItems: 'center',
  },
  waterCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  waterLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  mealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  mealButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 12,
  },
  mealSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  mealItems: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  mealItem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 6,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodButton: {
    padding: 8,
    borderRadius: 12,
  },
  selectedMoodButton: {
    backgroundColor: '#FEE2E2',
  },
  moodEmoji: {
    fontSize: 40,
  },
  workoutsList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  workoutsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  workoutItem: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  workoutText: {
    fontSize: 14,
    color: '#4B5563',
  },
});