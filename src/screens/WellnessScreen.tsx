import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStorage } from '../context/StorageContext';
import { searchFoods } from '../data/foodDatabase';
import CelebrationModal from '../components/CelebrationModal';

type Tab = 'weight' | 'steps' | 'water' | 'meals' | 'mood' | 'measurements' | 'workout' | 'fasting';

export default function WellnessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { getTodayLog, updateTodayLog } = useStorage();
  const todayLog = getTodayLog();
  
  const params = route.params as { tab?: Tab } | undefined;
  const [activeTab, setActiveTab] = useState<Tab>(params?.tab || 'weight');
  
  useEffect(() => {
    if (params?.tab) {
      setActiveTab(params.tab);
    }
  }, [params?.tab]);
  const [searchQuery, setSearchQuery] = useState('');
  
  //  Check what's completed today
  const hasSteps = !!todayLog?.steps && parseInt(todayLog.steps) > 0;
  const hasWater = (todayLog?.water || 0) >= 8;
  const hasBreakfast = !!(todayLog?.meals?.breakfast?.length);
  const hasLunch = !!(todayLog?.meals?.lunch?.length);
  const hasDinner = !!(todayLog?.meals?.dinner?.length);
  const hasMood = todayLog?.mood !== undefined;
  const hasMeasurements = !!todayLog?.measurements;
  const hasWorkout = !!(todayLog?.workouts?.length);
  const hasFasting = !!todayLog?.fasting;
  
  const completedCount = [hasBreakfast, hasLunch, hasDinner, hasWater, hasSteps, hasWorkout, hasMood, hasMeasurements, hasFasting].filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wellness Tracker</Text>
          <Text style={styles.headerSubtitle}>Track your daily health journey</Text>
        </View>

        {/* Daily Actions Checklist */}
        <View style={styles.checklistCard}>
          <View style={styles.checklistHeader}>
            <Ionicons name="checkbox" size={24} color="#9333EA" />
            <Text style={styles.checklistTitle}>Daily Actions</Text>
            <View style={styles.progressBadge}>
              <Text style={styles.progressText}>{completedCount}/9</Text>
            </View>
          </View>
          <View style={styles.checklistGrid}>
            <CheckItem label="Breakfast" completed={hasBreakfast} />
            <CheckItem label="Lunch" completed={hasLunch} />
            <CheckItem label="Dinner" completed={hasDinner} />
            <CheckItem label="Water" completed={hasWater} />
            <CheckItem label="Steps" completed={hasSteps} />
            <CheckItem label="Exercise" completed={hasWorkout} />
            <CheckItem label="Mood" completed={hasMood} />
            <CheckItem label="Measurements" completed={hasMeasurements} />
            <CheckItem label="Fasting" completed={hasFasting} />
          </View>
        </View>

        {/* Pound Drop Method */}
        <View style={styles.methodCard}>
          <Text style={styles.methodTitle}>🎯 Pound Drop Method</Text>
          <Text style={styles.methodSubtitle}>Get sufficient proteins and wholefoods, eating in a way that doesn't spike blood sugar. Low insulin = weight loss.</Text>
          <View style={styles.methodSteps}>
            <MethodStep number="1" title="Diet" desc="Breakfast: 20g protein + wholefoods (vegetables, fruits, berries, wholegrains). Lunch: 80% wholefoods (non-starchy vegetables) + 20g protein. Dinner: A lighter version of your lunch meal, here it's ok to add little starchy vegetables. Always eat carbs last to avoid blood sugar spikes." />
            <MethodStep number="2" title="Fasting" desc="Fast between meals and practice 16-hour intermittent fasting daily to lower insulin levels and trigger fat burning." />
            <MethodStep number="3" title="Exercise" desc="Minimum 30 min walk daily. Don't overdo it - too much exercise increases hunger and cravings. Eat less, move less." />
            <MethodStep number="4" title="Track + Celebrate Wins" desc="Log daily: weight, water, steps, meals • Check off Daily Actions • Celebrate non-scale victories • Consistency over perfection!" />
          </View>
        </View>

        {/* Show Food Log Button */}
        <View style={styles.foodLogButtonContainer}>
          <TouchableOpacity style={styles.foodLogButton} onPress={() => navigation.navigate('DailyLog' as never)} data-testid="button-show-food-log">
            <Ionicons name="book" size={24} color="#fff" />
            <Text style={styles.foodLogButtonText}>Show Food Log</Text>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
          <TabButton label="Weight" icon="scale" active={activeTab === 'weight'} onPress={() => setActiveTab('weight')} />
          <TabButton label="Steps" icon="walk" active={activeTab === 'steps'} onPress={() => setActiveTab('steps')} />
          <TabButton label="Water" icon="water" active={activeTab === 'water'} onPress={() => setActiveTab('water')} />
          <TabButton label="Meals" icon="restaurant" active={activeTab === 'meals'} onPress={() => setActiveTab('meals')} />
          <TabButton label="Mood" icon="happy" active={activeTab === 'mood'} onPress={() => setActiveTab('mood')} />
          <TabButton label="Measure" icon="resize" active={activeTab === 'measurements'} onPress={() => setActiveTab('measurements')} />
          <TabButton label="Workout" icon="barbell" active={activeTab === 'workout'} onPress={() => setActiveTab('workout')} />
          <TabButton label="Fasting" icon="time" active={activeTab === 'fasting'} onPress={() => setActiveTab('fasting')} />
        </ScrollView>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'weight' && <WeightTab />}
          {activeTab === 'steps' && <StepsTab />}
          {activeTab === 'water' && <WaterTab />}
          {activeTab === 'meals' && <MealsTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
          {activeTab === 'mood' && <MoodTab />}
          {activeTab === 'measurements' && <MeasurementsTab />}
          {activeTab === 'workout' && <WorkoutTab />}
          {activeTab === 'fasting' && <FastingTab />}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Components
function CheckItem({ label, completed }: { label: string; completed: boolean }) {
  return (
    <View style={styles.checkItem}>
      <Ionicons 
        name={completed ? "checkmark-circle" : "ellipse-outline"} 
        size={20} 
        color={completed ? "#16A34A" : "#D1D5DB"} 
      />
      <Text style={[styles.checkLabel, completed && styles.checkLabelDone]}>{label}</Text>
    </View>
  );
}

function MethodStep({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <View style={styles.methodStep}>
      <View style={styles.methodNumber}>
        <Text style={styles.methodNumberText}>{number}</Text>
      </View>
      <View style={styles.methodContent}>
        <Text style={styles.methodStepTitle}>{title}</Text>
        <Text style={styles.methodStepDesc}>{desc}</Text>
      </View>
    </View>
  );
}

function TabButton({ label, icon, active, onPress }: { label: string; icon: any; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity 
      style={[styles.tabButton, active && styles.tabButtonActive]} 
      onPress={onPress}
      data-testid={`button-tab-${label.toLowerCase()}`}
    >
      <Ionicons name={icon} size={20} color={active ? "#9333EA" : "#6B7280"} />
      <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// Tab Components
function WeightTab() {
  const { getTodayLog, updateTodayLog, weightUnit, setWeightUnit, getStartingWeight, setStartingWeight, getWeightLoss, getMilestone, getHighestMilestone, updateHighestMilestone } = useStorage();
  const [weight, setWeight] = useState(getTodayLog()?.weight || '');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMilestone, setCelebrationMilestone] = useState(0);

  const toggleUnit = () => {
    const newUnit = weightUnit === 'lbs' ? 'kg' : 'lbs';
    setWeightUnit(newUnit);
  };

  const handleSave = () => {
    if (!weight || isNaN(parseFloat(weight))) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    const currentWeight = parseFloat(weight);
    const startingWeight = getStartingWeight();

    // If no starting weight, set this as the starting weight
    if (!startingWeight) {
      setStartingWeight(currentWeight);
      updateTodayLog({ weight });
      Alert.alert('Success', `Weight logged as ${weight} ${weightUnit}! This is your starting weight.`);
      return;
    }

    // Calculate weight loss and check for milestones
    const weightLoss = getWeightLoss(currentWeight);
    const newMilestone = getMilestone(weightLoss);
    const highestMilestone = getHighestMilestone();

    updateTodayLog({ weight });

    // Trigger celebration only if this is a NEW higher milestone
    if (newMilestone > 0 && newMilestone > highestMilestone) {
      updateHighestMilestone(newMilestone);
      setCelebrationMilestone(newMilestone);
      setShowCelebration(true);
    } else {
      Alert.alert('Success', `Weight logged as ${weight} ${weightUnit}!`);
    }
  };

  return (
    <View style={styles.tabCard}>
      <View style={styles.weightHeaderRow}>
        <Text style={styles.tabTitle}>Log Your Weight</Text>
        <TouchableOpacity style={styles.unitToggle} onPress={toggleUnit} data-testid="button-toggle-unit">
          <Text style={styles.unitToggleText}>{weightUnit === 'lbs' ? 'lbs' : 'kg'}</Text>
          <Ionicons name="swap-horizontal" size={20} color="#9333EA" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder={`Enter weight (${weightUnit})`}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        data-testid="input-weight"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} data-testid="button-save-weight">
        <Text style={styles.saveButtonText}>Save Weight</Text>
      </TouchableOpacity>

      <CelebrationModal
        visible={showCelebration}
        milestone={celebrationMilestone}
        unit={weightUnit}
        onClose={() => setShowCelebration(false)}
      />
    </View>
  );
}

function StepsTab() {
  const { getTodayLog, updateTodayLog } = useStorage();
  const [steps, setSteps] = useState(getTodayLog()?.steps || '');

  const handleSave = () => {
    if (!steps || isNaN(parseInt(steps))) {
      Alert.alert('Error', 'Please enter valid steps');
      return;
    }
    updateTodayLog({ steps });
    Alert.alert('Success', 'Steps logged!');
  };

  return (
    <View style={styles.tabCard}>
      <Text style={styles.tabTitle}>Log Your Steps</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter step count"
        value={steps}
        onChangeText={setSteps}
        keyboardType="numeric"
        data-testid="input-steps"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} data-testid="button-save-steps">
        <Text style={styles.saveButtonText}>Save Steps</Text>
      </TouchableOpacity>
    </View>
  );
}

function WaterTab() {
  const { getTodayLog, updateTodayLog } = useStorage();
  const waterGlasses = getTodayLog()?.water || 0;
  const waterMl = waterGlasses * 250;

  const addWater = () => {
    updateTodayLog((prev) => ({ water: Math.min((prev.water || 0) + 1, 12) }));
  };

  const removeWater = () => {
    updateTodayLog((prev) => ({ water: Math.max((prev.water || 0) - 1, 0) }));
  };

  return (
    <View style={styles.tabCard}>
      <Text style={styles.tabTitle}>Water Intake</Text>
      <View style={styles.waterDisplay}>
        <View style={styles.waterStat}>
          <Text style={styles.waterValue}>{waterGlasses}</Text>
          <Text style={styles.waterLabel}>Glasses</Text>
        </View>
        <Text style={styles.waterEquals}>=</Text>
        <View style={styles.waterStat}>
          <Text style={styles.waterValue}>{waterMl}</Text>
          <Text style={styles.waterLabel}>ml</Text>
        </View>
      </View>
      <Text style={styles.waterGoal}>Goal: 8 glasses (2000 ml)</Text>
      <View style={styles.waterProgress}>
        <View style={[styles.waterProgressFill, { width: `${Math.min((waterGlasses / 8) * 100, 100)}%` }]} />
      </View>
      <View style={styles.waterButtons}>
        <TouchableOpacity style={styles.waterButton} onPress={removeWater} data-testid="button-remove-water">
          <Ionicons name="remove-circle" size={40} color="#EF4444" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.waterButton} onPress={addWater} data-testid="button-add-water">
          <Ionicons name="add-circle" size={40} color="#16A34A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MealsTab({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (q: string) => void }) {
  const { getTodayLog, updateTodayLog } = useStorage();
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [customFood, setCustomFood] = useState('');
  const foods = searchFoods(searchQuery);

  const addFood = (foodName: string) => {
    updateTodayLog((prev) => {
      const currentMeals = prev.meals || {};
      const currentMealItems = currentMeals[selectedMeal] || [];
      return {
        meals: {
          ...currentMeals,
          [selectedMeal]: [...currentMealItems, foodName]
        }
      };
    });
    setSearchQuery('');
    setCustomFood('');
    
    // Ask for meal feeling
    Alert.alert(
      'How did you feel after eating?',
      'Rate how you felt (1-10 scale)',
      [
        ...Array.from({length: 10}, (_, i) => ({
          text: `${i + 1}${i === 9 ? ' (Best)' : i === 0 ? ' (Worst)' : ''}`,
          onPress: () => {
            updateTodayLog((prev) => {
              const currentFeelings = prev.mealFeelings || {};
              return {
                mealFeelings: {
                  ...currentFeelings,
                  [selectedMeal]: i + 1
                }
              };
            });
            Alert.alert('Success', `${foodName} added to ${selectedMeal} with feeling: ${i + 1}/10`);
          }
        })),
        { text: 'Skip', style: 'cancel', onPress: () => {
          Alert.alert('Added!', `${foodName} added to ${selectedMeal}`);
        }}
      ]
    );
  };

  const addCustomFood = () => {
    if (!customFood.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return;
    }
    addFood(customFood.trim());
  };

  return (
    <View style={styles.tabCard}>
      <Text style={styles.tabTitle}>Log Meals</Text>
      <View style={styles.mealSelector}>
        <TouchableOpacity 
          style={[styles.mealButton, selectedMeal === 'breakfast' && styles.mealButtonActive]} 
          onPress={() => setSelectedMeal('breakfast')}
        >
          <Text style={[styles.mealButtonText, selectedMeal === 'breakfast' && styles.mealButtonTextActive]}>Breakfast</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.mealButton, selectedMeal === 'lunch' && styles.mealButtonActive]} 
          onPress={() => setSelectedMeal('lunch')}
        >
          <Text style={[styles.mealButtonText, selectedMeal === 'lunch' && styles.mealButtonTextActive]}>Lunch</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.mealButton, selectedMeal === 'dinner' && styles.mealButtonActive]} 
          onPress={() => setSelectedMeal('dinner')}
        >
          <Text style={[styles.mealButtonText, selectedMeal === 'dinner' && styles.mealButtonTextActive]}>Dinner</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.customFoodSection}>
        <Text style={styles.sectionLabel}>Add Custom Food:</Text>
        <View style={styles.customFoodRow}>
          <TextInput
            style={styles.customFoodInput}
            placeholder="Enter food name..."
            value={customFood}
            onChangeText={setCustomFood}
            data-testid="input-custom-food"
          />
          <TouchableOpacity style={styles.addButton} onPress={addCustomFood} data-testid="button-add-custom-food">
            <Ionicons name="add-circle" size={32} color="#16A34A" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Or Search Database:</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search foods..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        data-testid="input-search-food"
      />
      <ScrollView style={styles.foodList}>
        {foods.slice(0, 20).map((food) => (
          <TouchableOpacity key={food.id} style={styles.foodItem} onPress={() => addFood(food.name)}>
            <Text style={styles.foodName}>{food.name}</Text>
            <Text style={styles.foodCategory}>{food.category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function MoodTab() {
  const { getTodayLog, updateTodayLog } = useStorage();
  const todayLog = getTodayLog();
  const [selectedMood, setSelectedMood] = useState(todayLog?.moodDetails?.feeling ?? todayLog?.mood);
  const [stressLevel, setStressLevel] = useState(todayLog?.moodDetails?.stressLevel || 5);
  const [energyLevel, setEnergyLevel] = useState(todayLog?.moodDetails?.energyLevel || 5);
  const [sleepQuality, setSleepQuality] = useState(todayLog?.moodDetails?.sleepQuality || 5);
  const [symptoms, setSymptoms] = useState<string[]>(todayLog?.moodDetails?.symptoms || []);
  const [notes, setNotes] = useState(todayLog?.moodDetails?.notes || '');
  
  // Daily Reflection states
  const [todaysWin, setTodaysWin] = useState(todayLog?.dailyReflection?.todaysWin || '');
  const [mindsetGratitude, setMindsetGratitude] = useState(todayLog?.dailyReflection?.mindsetGratitude || '');
  const [obstaclePlan, setObstaclePlan] = useState(todayLog?.dailyReflection?.obstaclePlan || '');
  
  const moods = ['😢', '😕', '😐', '🙂', '😄'];
  const moodLabels = ['Very Sad', 'Down', 'Neutral', 'Good', 'Great'];
  
  const availableSymptoms = ['Bloated', 'Headache', 'Tired', 'Energized', 'Anxious', 'Calm', 'Nauseous', 'Cramps', 'Brain Fog', 'Alert'];

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    if (selectedMood === undefined) {
      Alert.alert('Required', 'Please select how you feel today');
      return;
    }
    
    updateTodayLog({ 
      mood: selectedMood,
      moodDetails: {
        feeling: selectedMood,
        stressLevel,
        energyLevel,
        sleepQuality,
        symptoms,
        notes
      },
      dailyReflection: {
        todaysWin,
        mindsetGratitude,
        obstaclePlan
      }
    });
    
    Alert.alert('Success', 'Mood, wellness, and reflections logged!');
  };

  return (
    <ScrollView style={styles.tabCard} showsVerticalScrollIndicator={false}>
      <Text style={styles.tabTitle}>How are you feeling today?</Text>
      
      {/* Mood Selection */}
      <Text style={styles.sectionLabel}>Your Feeling</Text>
      <View style={styles.moodContainer}>
        {moods.map((emoji, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.moodButton, selectedMood === index && styles.moodButtonActive]}
            onPress={() => setSelectedMood(index)}
            data-testid={`button-mood-${index}`}
          >
            <Text style={styles.moodEmoji}>{emoji}</Text>
            <Text style={styles.moodLabel}>{moodLabels[index]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stress Level */}
      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Stress Level (1-10)</Text>
      <View style={styles.sliderContainer}>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderMinMax}>😌 Low</Text>
          <Text style={styles.sliderValue}>{stressLevel}/10</Text>
          <Text style={styles.sliderMinMax}>😰 High</Text>
        </View>
        <View style={styles.numberButtons}>
          {[1,2,3,4,5,6,7,8,9,10].map(num => (
            <TouchableOpacity 
              key={num}
              style={[styles.numberButton, stressLevel === num && styles.numberButtonActive]}
              onPress={() => setStressLevel(num)}
              data-testid={`button-stress-${num}`}
            >
              <Text style={[styles.numberButtonText, stressLevel === num && styles.numberButtonTextActive]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Energy Level */}
      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Energy Level (1-10)</Text>
      <View style={styles.sliderContainer}>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderMinMax}>🪫 Drained</Text>
          <Text style={styles.sliderValue}>{energyLevel}/10</Text>
          <Text style={styles.sliderMinMax}>⚡ Energized</Text>
        </View>
        <View style={styles.numberButtons}>
          {[1,2,3,4,5,6,7,8,9,10].map(num => (
            <TouchableOpacity 
              key={num}
              style={[styles.numberButton, energyLevel === num && styles.numberButtonActive]}
              onPress={() => setEnergyLevel(num)}
              data-testid={`button-energy-${num}`}
            >
              <Text style={[styles.numberButtonText, energyLevel === num && styles.numberButtonTextActive]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sleep Quality */}
      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Sleep Quality (1-10)</Text>
      <View style={styles.sliderContainer}>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderMinMax}>😴 Poor</Text>
          <Text style={styles.sliderValue}>{sleepQuality}/10</Text>
          <Text style={styles.sliderMinMax}>🛌 Great</Text>
        </View>
        <View style={styles.numberButtons}>
          {[1,2,3,4,5,6,7,8,9,10].map(num => (
            <TouchableOpacity 
              key={num}
              style={[styles.numberButton, sleepQuality === num && styles.numberButtonActive]}
              onPress={() => setSleepQuality(num)}
              data-testid={`button-sleep-${num}`}
            >
              <Text style={[styles.numberButtonText, sleepQuality === num && styles.numberButtonTextActive]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Physical Symptoms */}
      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>How's your body feeling?</Text>
      <View style={styles.symptomsContainer}>
        {availableSymptoms.map((symptom, index) => (
          <TouchableOpacity 
            key={index}
            style={[styles.symptomButton, symptoms.includes(symptom) && styles.symptomButtonActive]}
            onPress={() => toggleSymptom(symptom)}
            data-testid={`button-symptom-${symptom.toLowerCase()}`}
          >
            <Text style={[styles.symptomText, symptoms.includes(symptom) && styles.symptomTextActive]}>{symptom}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes Section */}
      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Additional Notes</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Write any additional notes about how you're feeling..."
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        data-testid="input-mood-notes"
      />

      {/* Daily Reflection Section */}
      <View style={styles.reflectionSection}>
        <View style={styles.reflectionHeader}>
          <Text style={styles.reflectionTitle}>🎯 Daily Reflection</Text>
          <Text style={styles.reflectionSubtitle}>Step 4: Track + Celebrate Wins</Text>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>🏆 Today's Win (NSV - Non-Scale Victory)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="I chose water over soda, walked 30 min, said no to dessert..."
          value={todaysWin}
          onChangeText={setTodaysWin}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          data-testid="input-todays-win"
        />

        <Text style={[styles.sectionLabel, { marginTop: 12 }]}>💭 Mindset/Gratitude</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Grateful my body can move, realized I don't need dessert to feel satisfied..."
          value={mindsetGratitude}
          onChangeText={setMindsetGratitude}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          data-testid="input-mindset-gratitude"
        />

        <Text style={[styles.sectionLabel, { marginTop: 12 }]}>🚧 Obstacle + Plan</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Craved sugar at 3pm → will prep fruit snacks, skipped workout → will set alarm for tomorrow..."
          value={obstaclePlan}
          onChangeText={setObstaclePlan}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          data-testid="input-obstacle-plan"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} data-testid="button-save-mood">
        <Text style={styles.saveButtonText}>Save Mood, Wellness & Reflections</Text>
      </TouchableOpacity>
      
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

function MeasurementsTab() {
  const { getTodayLog, updateTodayLog } = useStorage();
  const [waist, setWaist] = useState(getTodayLog()?.measurements?.waist || '');
  const [hips, setHips] = useState(getTodayLog()?.measurements?.hips || '');
  const [chest, setChest] = useState(getTodayLog()?.measurements?.chest || '');
  const [arms, setArms] = useState(getTodayLog()?.measurements?.arms || '');
  const [thighs, setThighs] = useState(getTodayLog()?.measurements?.thighs || '');

  const handleSave = () => {
    if (!waist && !hips && !chest && !arms && !thighs) {
      Alert.alert('Error', 'Please enter at least one measurement');
      return;
    }
    updateTodayLog({ measurements: { waist, hips, chest, arms, thighs } });
    Alert.alert('Success', 'Measurements logged!');
  };

  return (
    <View style={styles.tabCard}>
      <Text style={styles.tabTitle}>Body Measurements</Text>
      <TextInput style={styles.input} placeholder="Waist (inches)" value={waist} onChangeText={setWaist} keyboardType="numeric" data-testid="input-waist" />
      <TextInput style={styles.input} placeholder="Hips (inches)" value={hips} onChangeText={setHips} keyboardType="numeric" data-testid="input-hips" />
      <TextInput style={styles.input} placeholder="Chest (inches)" value={chest} onChangeText={setChest} keyboardType="numeric" data-testid="input-chest" />
      <TextInput style={styles.input} placeholder="Arms (inches)" value={arms} onChangeText={setArms} keyboardType="numeric" data-testid="input-arms" />
      <TextInput style={styles.input} placeholder="Thighs (inches)" value={thighs} onChangeText=

{setThighs} keyboardType="numeric" data-testid="input-thighs" />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} data-testid="button-save-measurements">
        <Text style={styles.saveButtonText}>Save Measurements</Text>
      </TouchableOpacity>
    </View>
  );
}

function WorkoutTab() {
  const { getTodayLog, updateTodayLog } = useStorage();
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  const handleSave = () => {
    if (!type || !duration) {
      Alert.alert('Error', 'Please enter workout type and duration');
      return;
    }
    updateTodayLog((prev) => {
      const currentWorkouts = prev.workouts || [];
      return {
        workouts: [...currentWorkouts, { type, duration, calories }]
      };
    });
    setType('');
    setDuration('');
    setCalories('');
    Alert.alert('Success', 'Workout logged!');
  };

  return (
    <View style={styles.tabCard}>
      <Text style={styles.tabTitle}>Log Workout</Text>
      <TextInput style={styles.input} placeholder="Workout type (e.g., Running)" value={type} onChangeText={setType} data-testid="input-workout-type" />
      <TextInput style={styles.input} placeholder="Duration (minutes)" value={duration} onChangeText={setDuration} keyboardType="numeric" data-testid="input-workout-duration" />
      <TextInput style={styles.input} placeholder="Calories (optional)" value={calories} onChangeText={setCalories} keyboardType="numeric" data-testid="input-workout-calories" />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} data-testid="button-save-workout">
        <Text style={styles.saveButtonText}>Save Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

function FastingTab() {
  const { getTodayLog, updateTodayLog } = useStorage();
  const todayLog = getTodayLog();
  const [selectedDuration, setSelectedDuration] = useState(todayLog?.fasting?.duration || 16);
  const [startHour, setStartHour] = useState(todayLog?.fasting?.startTime?.split(':')[0] || '20');
  const [startMinute, setStartMinute] = useState(todayLog?.fasting?.startTime?.split(':')[1] || '00');
  const durations = [12, 14, 16, 18, 20];

  const calculateEndTime = (startH: string, startM: string, hours: number) => {
    const start = parseInt(startH);
    const mins = parseInt(startM);
    const endTotalMinutes = (start * 60 + mins + hours * 60) % (24 * 60);
    const endHour = Math.floor(endTotalMinutes / 60);
    const endMinute = endTotalMinutes % 60;
    return {
      startTime: `${startH.padStart(2, '0')}:${startM.padStart(2, '0')}`,
      endTime: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
    };
  };

  const handleSaveFasting = () => {
    const hourNum = parseInt(startHour);
    const minNum = parseInt(startMinute);
    
    if (isNaN(hourNum) || hourNum < 0 || hourNum > 23) {
      Alert.alert('Invalid Hour', 'Please enter a valid hour (0-23)');
      return;
    }
    if (isNaN(minNum) || minNum < 0 || minNum > 59) {
      Alert.alert('Invalid Minute', 'Please enter a valid minute (0-59)');
      return;
    }

    const times = calculateEndTime(startHour, startMinute, selectedDuration);
    updateTodayLog({
      fasting: {
        duration: selectedDuration,
        startTime: times.startTime,
        endTime: times.endTime
      }
    });
    Alert.alert('Fasting Set', `${selectedDuration}-hour fast from ${times.startTime} to ${times.endTime}`);
  };

  const currentTimes = calculateEndTime(startHour, startMinute, selectedDuration);

  return (
    <View style={styles.tabCard}>
      <Text style={styles.tabTitle}>Intermittent Fasting</Text>
      
      <Text style={styles.fastingSubtitle}>Select your fasting duration:</Text>
      <View style={styles.fastingButtons}>
        {durations.map((hours) => (
          <TouchableOpacity 
            key={hours}
            style={[styles.fastingButton, selectedDuration === hours && styles.fastingButtonActive]}
            onPress={() => setSelectedDuration(hours)}
            data-testid={`button-fasting-${hours}h`}
          >
            <Text style={[styles.fastingButtonText, selectedDuration === hours && styles.fastingButtonTextActive]}>{hours}h</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.fastingSubtitle, { marginTop: 20 }]}>Set your start time:</Text>
      <View style={styles.timeInputContainer}>
        <View style={styles.timeInputGroup}>
          <Text style={styles.timeInputLabel}>Hour (0-23)</Text>
          <TextInput
            style={styles.timeInput}
            value={startHour}
            onChangeText={setStartHour}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="20"
            data-testid="input-fasting-start-hour"
          />
        </View>
        <Text style={styles.timeColon}>:</Text>
        <View style={styles.timeInputGroup}>
          <Text style={styles.timeInputLabel}>Min (0-59)</Text>
          <TextInput
            style={styles.timeInput}
            value={startMinute}
            onChangeText={setStartMinute}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="00"
            data-testid="input-fasting-start-minute"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveFasting} data-testid="button-save-fasting">
        <Text style={styles.saveButtonText}>Save Fasting Schedule</Text>
      </TouchableOpacity>

      {todayLog?.fasting && (
        <View style={styles.fastingInfo}>
          <Ionicons name="time" size={24} color="#FACC15" />
          <Text style={styles.fastingInfoText}>
            Fasting from {todayLog.fasting.startTime} to {todayLog.fasting.endTime} ({todayLog.fasting.duration}h)
          </Text>
        </View>
      )}

      <View style={styles.fastingPreview}>
        <Text style={styles.fastingPreviewLabel}>Preview:</Text>
        <Text style={styles.fastingPreviewText}>
          {selectedDuration}h fast from {currentTimes.startTime} to {currentTimes.endTime}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#fff', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  checklistCard: { margin: 16, padding: 20, backgroundColor: '#fff', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  checklistHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checklistTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginLeft: 12, flex: 1 },
  progressBadge: { backgroundColor: '#9333EA', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  progressText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  checklistGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  checkItem: { flexDirection: 'row', alignItems: 'center', width: '48%', marginBottom: 8 },
  checkLabel: { fontSize: 14, color: '#6B7280', marginLeft: 8 },
  checkLabelDone: { color: '#16A34A', fontWeight: '600' },
  methodCard: { margin: 16, marginTop: 0, padding: 20, backgroundColor: '#EEF2FF', borderRadius: 16 },
  methodTitle: { fontSize: 20, fontWeight: 'bold', color: '#4338CA', marginBottom: 8, textAlign: 'center' },
  methodSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 16, textAlign: 'center', fontStyle: 'italic' },
  methodSteps: { gap: 12 },
  methodStep: { flexDirection: 'row', alignItems: 'flex-start' },
  methodNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#9333EA', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  methodNumberText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  methodContent: { flex: 1 },
  methodStepTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  methodStepDesc: { fontSize: 14, color: '#6B7280' },
  tabBar: { paddingHorizontal: 16, marginVertical: 16 },
  tabButton: { paddingHorizontal: 16, paddingVertical: 10, marginRight: 8, borderRadius: 12, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 6 },
  tabButtonActive: { backgroundColor: '#EEF2FF', borderWidth: 2, borderColor: '#9333EA' },
  tabButtonText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  tabButtonTextActive: { color: '#9333EA', fontWeight: '600' },
  tabContent: { marginHorizontal: 16 },
  tabCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  tabTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  weightHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  unitToggle: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 8 },
  unitToggleText: { fontSize: 16, fontWeight: '600', color: '#9333EA' },
  input: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 12 },
  notesInput: { minHeight: 100, paddingTop: 16 },
  reflectionSection: { marginTop: 24, paddingTop: 24, borderTopWidth: 2, borderTopColor: '#9333EA' },
  reflectionHeader: { marginBottom: 8 },
  reflectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#9333EA' },
  reflectionSubtitle: { fontSize: 14, color: '#DB2777', fontWeight: '600', marginTop: 4 },
  saveButton: { backgroundColor: '#9333EA', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  waterDisplay: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  waterStat: { alignItems: 'center' },
  waterValue: { fontSize: 36, fontWeight: 'bold', color: '#3B82F6' },
  waterLabel: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  waterEquals: { fontSize: 24, color: '#6B7280', marginHorizontal: 20 },
  waterGoal: { textAlign: 'center', fontSize: 14, color: '#6B7280', marginBottom: 12 },
  waterProgress: { height: 10, backgroundColor: '#E5E7EB', borderRadius: 5, overflow: 'hidden', marginBottom: 20 },
  waterProgressFill: { height: '100%', backgroundColor: '#3B82F6' },
  waterButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  waterButton: { padding: 8 },
  mealSelector: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  mealButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center' },
  mealButtonActive: { backgroundColor: '#06B6D4' },
  mealButtonText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  mealButtonTextActive: { color: '#fff' },
  customFoodSection: { marginBottom: 20, paddingBottom: 20, borderBottomWidth: 2, borderBottomColor: '#E5E7EB' },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
  customFoodRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  customFoodInput: { flex: 1, backgroundColor: '#F3F4F6', padding: 16, borderRadius: 12, fontSize: 16 },
  addButton: { padding: 4 },
  searchInput: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 16 },
  foodList: { maxHeight: 300 },
  foodItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  foodName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  foodCategory: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  moodButton: { padding: 12, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center' },
  moodButtonActive: { backgroundColor: '#FEE2E2', borderWidth: 2, borderColor: '#EF4444' },
  moodEmoji: { fontSize: 40 },
  moodLabel: { fontSize: 11, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  sliderContainer: { marginBottom: 16 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sliderMinMax: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  sliderValue: { fontSize: 18, color: '#9333EA', fontWeight: 'bold' },
  numberButtons: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  numberButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  numberButtonActive: { backgroundColor: '#9333EA' },
  numberButtonText: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
  numberButtonTextActive: { color: '#fff' },
  symptomsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  symptomButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  symptomButtonActive: { backgroundColor: '#16A34A', borderColor: '#16A34A' },
  symptomText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  symptomTextActive: { color: '#fff', fontWeight: '600' },
  fastingSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  fastingButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  fastingButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, backgroundColor: '#F3F4F6' },
  fastingButtonActive: { backgroundColor: '#FACC15' },
  fastingButtonText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  fastingButtonTextActive: { color: '#fff' },
  fastingInfo: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FEF3C7', borderRadius: 12, gap: 12 },
  fastingInfoText: { fontSize: 16, color: '#92400E', fontWeight: '500' },
  timeInputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  timeInputGroup: { alignItems: 'center' },
  timeInputLabel: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  timeInput: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 12, fontSize: 24, fontWeight: 'bold', textAlign: 'center', width: 70, color: '#1F2937' },
  timeColon: { fontSize: 32, fontWeight: 'bold', color: '#1F2937', marginHorizontal: 8 },
  fastingPreview: { marginTop: 20, padding: 16, backgroundColor: '#EEF2FF', borderRadius: 12 },
  fastingPreviewLabel: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  fastingPreviewText: { fontSize: 16, fontWeight: '600', color: '#4338CA' },
  foodLogButtonContainer: { marginHorizontal: 16, marginTop: 16 },
  foodLogButton: { 
    backgroundColor: '#9333EA', 
    paddingVertical: 18, 
    paddingHorizontal: 24, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  foodLogButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginHorizontal: 12,
  },
  bottomPadding: { height: 40 },
});
