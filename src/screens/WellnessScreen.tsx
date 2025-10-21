import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStorage } from '../context/StorageContext';
import { searchFoods, foodDatabase as fullFoodDatabase } from '../data/foodDatabase';
import CelebrationModal from '../components/CelebrationModal';

type Tab = 'weight' | 'steps' | 'water' | 'meals' | 'snacks' | 'mood' | 'measurements' | 'workout' | 'fasting';

export default function WellnessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { getTodayLog, updateTodayLog, getChallengeStartDate, getCurrentChallengeDay, calculateMacros, getCustomFoods, addCustomFood } = useStorage();
  const todayLog = getTodayLog();
  const scrollViewRef = useRef<ScrollView>(null);
  const tabContentRef = useRef<View>(null);
  
  const params = route.params as { tab?: Tab } | undefined;
  const [activeTab, setActiveTab] = useState<Tab>(params?.tab || 'weight');
  const [methodExpanded, setMethodExpanded] = useState(false);
  
  useEffect(() => {
    if (params?.tab) {
      setActiveTab(params.tab);
      // Scroll to tab content when navigating with a tab parameter
      setTimeout(() => {
        if (scrollViewRef.current && tabContentRef.current) {
          tabContentRef.current.measureLayout(
            scrollViewRef.current as any,
            (x, y) => {
              scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
            },
            () => {}
          );
        }
      }, 100);
    }
  }, [params?.tab]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Challenge status
  const challengeDay = getCurrentChallengeDay();
  const isChallengeActive = challengeDay !== null && challengeDay > 0;
  
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
  
  // Challenge-specific checks
  const hasMeals = hasBreakfast || hasLunch || hasDinner;
  const mealCount = [hasBreakfast, hasLunch, hasDinner].filter(Boolean).length;
  const hasExercise = hasWorkout || hasSteps;
  
  const completedCount = [hasBreakfast, hasLunch, hasDinner, hasWater, hasSteps, hasMood, hasFasting].filter(Boolean).length;

  // Calculate daily macros
  const dailyMacros = calculateMacros(todayLog?.meals || {}, todayLog?.snacks);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView ref={scrollViewRef} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wellness Tracker</Text>
          <Text style={styles.headerSubtitle}>Track your daily health journey</Text>
        </View>

        {/* Collapsible Pound Drop Method */}
        <TouchableOpacity 
          style={styles.methodToggle} 
          onPress={() => setMethodExpanded(!methodExpanded)}
          data-testid="button-toggle-method"
        >
          <Text style={styles.methodToggleText}>🎯 Pound Drop Method</Text>
          <Ionicons name={methodExpanded ? "chevron-up" : "chevron-down"} size={24} color="#9333EA" />
        </TouchableOpacity>

        {methodExpanded && (
          <View style={styles.methodCard}>
            <Text style={styles.methodHeadline}>Eat Less, Move Less</Text>
            <Text style={[styles.methodBullet, { fontStyle: 'italic' }]}>• Consume 1-3 meals daily, and walk min 30 mins daily.</Text>
            <Text style={styles.methodSubtitle}>Get sufficient proteins and wholefoods, eating in a way that doesn't spike blood sugar and insulin. Managing insulin supports weight loss. NO calorie or carb counting - use hand-based portion guidelines instead!</Text>
            
            <View style={styles.medicalDisclaimer}>
              <Ionicons name="medical" size={16} color="#DC2626" />
              <Text style={styles.disclaimerText}>Important: Start slowly with any exercise routine. Consult with your physician before beginning any new exercise program, especially if you have pre-existing health conditions.</Text>
            </View>
            
            <View style={styles.methodSteps}>
              <MethodStep number="1" title="Diet" desc="Use hand-based portions (NOT calorie counting) Veggies = 2 cupped hands. Protein = palm size. Starches = fist size. Fats = thumb size. Breakfast: Get sufficient protein (palm size) with fiber-rich wholefoods. Eat greens first, then proteins, fats, and carbs last to keep blood sugar low. Lunch: Natural wholefoods, non-starchy vegetables (2 cupped hands), with sufficient protein (palm size). Dinner: Lighter version of lunch - can add small portions of starchy vegetables (fist size)." />
              <MethodStep number="2" title="Fasting" desc="Fast between meals and practice 16-hour intermittent fasting daily to improve insulin sensitivity and support fat metabolism." />
              <MethodStep number="3" title="Exercise" desc="Minimum 30 min walk daily. Don't overdo it - too much exercise increases hunger and cravings. Eat less, move less." />
              <MethodStep number="4" title="Track + Celebrate Wins" desc="Log daily: weight, water, steps, meals • Check off Daily Actions • Celebrate non-scale victories • Consistency over perfection!" />
            </View>

            {/* Medical Citations */}
            <View style={styles.citationsContainer}>
              <Text style={styles.citationsTitle}>📚 Medical References</Text>
              <Text style={styles.citationText}>• Insulin & Weight Management: Cell Metabolism, "Intermittent Fasting and Metabolic Health" (2017) - Fasting periods improve insulin sensitivity and support weight management</Text>
              <Text style={styles.citationText}>• Intermittent Fasting: New England Journal of Medicine, "Effects of Intermittent Fasting on Health, Aging, and Disease" (2019)</Text>
              <Text style={styles.citationText}>• Food Sequencing: Journal of Clinical Biochemistry and Nutrition, "Meal sequence and glucose excursion, gastric emptying" (2014)</Text>
              <Text style={styles.citationText}>• Exercise & Appetite: American Journal of Clinical Nutrition, "Exercise intensity and energy expenditure" (2012)</Text>
              <Text style={styles.citationText}>• Portion Control: Academy of Nutrition and Dietetics, "Hand-Based Portion Size Estimation" (2020)</Text>
            </View>
          </View>
        )}

        {/* Challenge Checklist (when active) or Daily Actions */}
        {isChallengeActive ? (
          <View style={styles.challengeChecklistCard}>
            <View style={styles.challengeChecklistHeader}>
              <View style={styles.challengeHeaderLeft}>
                <Ionicons name="trophy" size={24} color="#F59E0B" />
                <View>
                  <Text style={styles.challengeChecklistTitle}>28-Day Challenge</Text>
                  <Text style={styles.challengeDayText}>Day {challengeDay} • Follow the Pound Drop Method</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.challengeStepsContainer}>
              <ChallengeStep 
                icon="restaurant" 
                title="Diet: Eat 1-3 Meals Daily" 
                completed={hasMeals}
                subtitle={mealCount > 0 ? `${mealCount} meal${mealCount > 1 ? 's' : ''} logged today` : 'Log your meals below'}
              />
              <ChallengeStep 
                icon="time" 
                title="Fasting: 16 Hours Daily + No Snacking" 
                completed={hasFasting}
                subtitle={hasFasting ? 'Fasting window set' : 'Set your fasting window'}
              />
              <ChallengeStep 
                icon="barbell" 
                title="Exercise: 30 Min Daily" 
                completed={hasExercise}
                subtitle={hasExercise ? 'Activity logged' : 'Log steps or workout'}
              />
              <ChallengeStep 
                icon="walk" 
                title="Low-Intensity Walking (Recommended)" 
                completed={hasSteps}
                subtitle={hasSteps ? `${todayLog?.steps || 0} steps` : 'Track your steps'}
              />
              <ChallengeStep 
                icon="water" 
                title="Hydration: 8+ Glasses" 
                completed={hasWater}
                subtitle={`${todayLog?.water || 0}/8 glasses`}
              />
            </View>
          </View>
        ) : (
          <View style={styles.checklistCard}>
            <View style={styles.checklistHeader}>
              <Ionicons name="checkbox" size={24} color="#9333EA" />
              <Text style={styles.checklistTitle}>Daily Actions</Text>
              <View style={styles.progressBadge}>
                <Text style={styles.progressText}>{completedCount}/7</Text>
              </View>
            </View>
            <View style={styles.checklistGrid}>
              <CheckItem label="Breakfast" completed={hasBreakfast} />
              <CheckItem label="Lunch" completed={hasLunch} />
              <CheckItem label="Dinner" completed={hasDinner} />
              <CheckItem label="Hydration" completed={hasWater} />
              <CheckItem label="Steps" completed={hasSteps} />
              <CheckItem label="Mood" completed={hasMood} />
              <CheckItem label="Fasting" completed={hasFasting} />
            </View>
          </View>
        )}

        {/* Show Food Log Button */}
        <View style={styles.foodLogButtonContainer}>
          <TouchableOpacity style={styles.foodLogButton} onPress={() => navigation.navigate('DailyLog' as never)} data-testid="button-show-food-log">
            <Ionicons name="book" size={24} color="#fff" />
            <Text style={styles.foodLogButtonText}>Show Food Log</Text>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Daily Macro Totals */}
        {(dailyMacros.total.protein > 0 || dailyMacros.total.carbs > 0 || dailyMacros.total.fat > 0) && (
          <View style={styles.macroTotalsCard}>
            <View style={styles.macroTotalsHeader}>
              <Ionicons name="nutrition" size={20} color="#9333EA" />
              <Text style={styles.macroTotalsTitle}>Daily Nutrition Totals</Text>
            </View>
            <View style={styles.macroTotalsGrid}>
              <View style={styles.macroTotalItem}>
                <Text style={styles.macroTotalValue}>{Math.round(dailyMacros.total.protein)}g</Text>
                <Text style={styles.macroTotalLabel}>Protein</Text>
              </View>
              <View style={styles.macroTotalItem}>
                <Text style={styles.macroTotalValue}>{Math.round(dailyMacros.total.carbs)}g</Text>
                <Text style={styles.macroTotalLabel}>Carbs</Text>
              </View>
              <View style={styles.macroTotalItem}>
                <Text style={styles.macroTotalValue}>{Math.round(dailyMacros.total.fat)}g</Text>
                <Text style={styles.macroTotalLabel}>Fat</Text>
              </View>
              <View style={styles.macroTotalItem}>
                <Text style={styles.macroTotalValue}>{Math.round(dailyMacros.total.fiber)}g</Text>
                <Text style={styles.macroTotalLabel}>Fiber</Text>
              </View>
            </View>
          </View>
        )}

        {/* Tab Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
          <TabButton label="Weight" icon="scale" active={activeTab === 'weight'} onPress={() => setActiveTab('weight')} />
          <TabButton label="Steps" icon="walk" active={activeTab === 'steps'} onPress={() => setActiveTab('steps')} />
          <TabButton label="Hydration" icon="water" active={activeTab === 'water'} onPress={() => setActiveTab('water')} />
          <TabButton label="Meals" icon="restaurant" active={activeTab === 'meals'} onPress={() => setActiveTab('meals')} />
          <TabButton label="Snacks" icon="fast-food" active={activeTab === 'snacks'} onPress={() => setActiveTab('snacks')} />
          <TabButton label="Mood" icon="happy" active={activeTab === 'mood'} onPress={() => setActiveTab('mood')} />
          <TabButton label="Measure" icon="resize" active={activeTab === 'measurements'} onPress={() => setActiveTab('measurements')} />
          <TabButton label="Workout" icon="barbell" active={activeTab === 'workout'} onPress={() => setActiveTab('workout')} />
          <TabButton label="Fasting" icon="time" active={activeTab === 'fasting'} onPress={() => setActiveTab('fasting')} />
        </ScrollView>

        {/* Tab Content */}
        <View ref={tabContentRef} style={styles.tabContent}>
          {activeTab === 'weight' && <WeightTab />}
          {activeTab === 'steps' && <StepsTab />}
          {activeTab === 'water' && <WaterTab />}
          {activeTab === 'meals' && <MealsTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
          {activeTab === 'snacks' && <SnacksTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
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

function ChallengeStep({ icon, title, completed, subtitle }: { icon: string; title: string; completed: boolean; subtitle: string }) {
  return (
    <View style={styles.challengeStepItem}>
      <View style={styles.challengeStepLeft}>
        <View style={[styles.challengeStepIcon, completed && styles.challengeStepIconCompleted]}>
          <Ionicons name={icon as any} size={20} color={completed ? "#fff" : "#9333EA"} />
        </View>
        <View style={styles.challengeStepText}>
          <Text style={[styles.challengeStepTitle, completed && styles.challengeStepTitleCompleted]}>{title}</Text>
          <Text style={styles.challengeStepSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {completed && (
        <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
      )}
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
    
    // Convert weight value when toggling units
    if (weight && !isNaN(parseFloat(weight))) {
      const currentValue = parseFloat(weight);
      let convertedValue;
      
      if (newUnit === 'kg') {
        // Converting lbs to kg
        convertedValue = currentValue / 2.20462;
      } else {
        // Converting kg to lbs
        convertedValue = currentValue * 2.20462;
      }
      
      setWeight(convertedValue.toFixed(1));
    }
    
    setWeightUnit(newUnit);
  };

  const handleSave = () => {
    if (!weight || isNaN(parseFloat(weight))) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    const currentWeight = parseFloat(weight);
    const displayWeight = currentWeight.toFixed(1);
    const startingWeight = getStartingWeight();

    // If no starting weight, set this as the starting weight
    if (!startingWeight) {
      setStartingWeight(currentWeight);
      updateTodayLog({ weight });
      Alert.alert('Success', `Weight logged as ${displayWeight} ${weightUnit}! This is your starting weight.`);
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
      Alert.alert('Success', `Weight logged as ${displayWeight} ${weightUnit}!`);
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
      <Text style={styles.tabTitle}>Hydration</Text>
      <View style={styles.hydrationTip}>
        <Ionicons name="information-circle-outline" size={20} color="#9333EA" />
        <Text style={styles.hydrationTipText}>💡 Add a pinch of salt to your water for better hydration</Text>
      </View>
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
  const { getTodayLog, updateTodayLog, customFoods, addCustomFood } = useStorage();
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  
  // Merge custom foods with regular foods in search
  const regularFoods = searchFoods(searchQuery);
  const filteredCustomFoods = searchQuery.trim() 
    ? customFoods.filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : customFoods;
  const foods = [...filteredCustomFoods, ...regularFoods];

  const addFood = (foodItem: string | { name: string; calories?: number; protein?: number; carbs?: number; fat?: number; fiber?: number; isEstimated?: boolean }) => {
    const foodName = typeof foodItem === 'string' ? foodItem : foodItem.name;
    
    updateTodayLog((prev) => {
      const currentMeals = prev.meals || {};
      const currentMealItems = currentMeals[selectedMeal] || [];
      const currentMealTimes = prev.mealTimes || {};
      
      // Capture time only if this is the first food for this meal
      const shouldCaptureTime = currentMealItems.length === 0;
      const currentTime = shouldCaptureTime ? new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }) : currentMealTimes[selectedMeal];
      
      return {
        meals: {
          ...currentMeals,
          [selectedMeal]: [...currentMealItems, foodItem]
        },
        mealTimes: {
          ...currentMealTimes,
          [selectedMeal]: currentTime
        }
      };
    });
    setSearchQuery('');
    
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

  // Add food from database with optional modifier
  const addFoodWithModifier = (foodOrName: string | { id: string; name: string; calories?: number; protein?: number; carbs?: number; fat?: number; fiber?: number }) => {
    let foundFood: any;
    let baseFoodName: string;
    
    // If a food object was passed directly (clicked from list), use it
    if (typeof foodOrName === 'object') {
      foundFood = foodOrName;
      baseFoodName = foodOrName.name;
    } else {
      // Otherwise search for it by name
      baseFoodName = foodOrName;
      foundFood = fullFoodDatabase.find(f => f.name.toLowerCase() === baseFoodName.toLowerCase());
      
      // If not in main database, check custom foods (use the LAST match for duplicates)
      if (!foundFood) {
        const matches = customFoods.filter(f => f.name.toLowerCase() === baseFoodName.toLowerCase());
        foundFood = matches.length > 0 ? matches[matches.length - 1] : undefined;
      }
    }
    
    if (!foundFood) {
      // If not found in either database, just add as string (fallback)
      addFood(baseFoodName);
      return;
    }

    // Helper to prompt for portion and add food
    const promptForPortionAndAdd = (finalName: string) => {
      Alert.prompt(
        'Portion Size',
        'Enter amount (e.g., 150 for grams)',
        (amount) => {
          const portionAmount = parseFloat(amount || '100');
          if (isNaN(portionAmount)) {
            Alert.alert('Invalid amount', 'Please enter a valid number');
            return;
          }

          Alert.alert(
            'Select Unit',
            'What unit did you use?',
            [
              { text: 'Grams (g)', onPress: () => addFoodWithPortion(finalName, portionAmount, 'g') },
              { text: 'Cups', onPress: () => addFoodWithPortion(finalName, portionAmount, 'cups') },
              { text: 'Pieces', onPress: () => addFoodWithPortion(finalName, portionAmount, 'pieces') },
              { text: 'Slices', onPress: () => addFoodWithPortion(finalName, portionAmount, 'slice') },
              { text: 'Ounces (oz)', onPress: () => addFoodWithPortion(finalName, portionAmount, 'oz') },
            ]
          );
        }
      );
    };

    // Helper to convert portions to grams and scale nutrition
    const addFoodWithPortion = (finalName: string, amount: number, unit: string) => {
      const conversions: Record<string, number> = {
        'g': 1,
        'cups': 150,
        'pieces': 50,
        'slice': 100,
        'oz': 28.35,
      };
      const grams = amount * (conversions[unit] || 100);
      const multiplier = grams / 100;

      addFood({
        name: finalName,
        calories: (foundFood.calories || 0) * multiplier,
        protein: (foundFood.protein || 0) * multiplier,
        carbs: (foundFood.carbs || 0) * multiplier,
        fat: (foundFood.fat || 0) * multiplier,
        fiber: (foundFood.fiber || 0) * multiplier,
        portion: { amount, unit }
      });
    };

    Alert.alert(
      'Add a note? (Optional)',
      'You can add details like "with cinnamon" or "with vegetables"',
      [
        {
          text: 'Add Note',
          onPress: () => {
            Alert.prompt(
              'Add Note',
              `Add to "${baseFoodName}"`,
              (note) => {
                const displayName = note && note.trim() ? `${baseFoodName} ${note.trim()}` : baseFoodName;
                promptForPortionAndAdd(displayName);
              }
            );
          }
        },
        {
          text: 'Skip',
          onPress: () => {
            promptForPortionAndAdd(baseFoodName);
          }
        }
      ]
    );
  };

  const removeFoodFromMeal = (index: number) => {
    updateTodayLog((prev) => {
      const currentMeals = prev.meals || {};
      const currentMealItems = currentMeals[selectedMeal] || [];
      return {
        meals: {
          ...currentMeals,
          [selectedMeal]: currentMealItems.filter((_, i) => i !== index)
        }
      };
    });
  };

  const createCustomFood = () => {
    Alert.prompt(
      'Add Custom Food',
      'Enter food name',
      (name) => {
        if (!name || !name.trim()) {
          Alert.alert('Error', 'Food name is required');
          return;
        }
        
        Alert.prompt(
          'Calories (per 100g)',
          'Enter calories per 100g (whole number)',
          (caloriesStr) => {
            const calories = Math.round(parseFloat(caloriesStr || '0'));
            if (isNaN(calories) || calories < 0) {
              Alert.alert('Error', 'Please enter a valid calorie amount');
              return;
            }
            
            Alert.prompt(
              'Protein (per 100g)',
              'Enter protein in grams per 100g (whole number)',
              (proteinStr) => {
                const protein = Math.round(parseFloat(proteinStr || '0'));
                if (isNaN(protein) || protein < 0) {
                  Alert.alert('Error', 'Please enter a valid protein amount');
                  return;
                }
                
                Alert.prompt(
                  'Carbs (per 100g)',
                  'Enter carbs in grams per 100g (whole number)',
                  (carbsStr) => {
                    const carbs = Math.round(parseFloat(carbsStr || '0'));
                    if (isNaN(carbs) || carbs < 0) {
                      Alert.alert('Error', 'Please enter a valid carbs amount');
                      return;
                    }
                    
                    Alert.prompt(
                      'Fat (per 100g)',
                      'Enter fat in grams per 100g (whole number)',
                      (fatStr) => {
                        const fat = Math.round(parseFloat(fatStr || '0'));
                        if (isNaN(fat) || fat < 0) {
                          Alert.alert('Error', 'Please enter a valid fat amount');
                          return;
                        }
                        
                        Alert.prompt(
                          'Fiber (per 100g)',
                          'Enter fiber in grams per 100g (whole number)',
                          (fiberStr) => {
                            const fiber = Math.round(parseFloat(fiberStr || '0'));
                            if (isNaN(fiber) || fiber < 0) {
                              Alert.alert('Error', 'Please enter a valid fiber amount');
                              return;
                            }
                            
                            // Save custom food
                            addCustomFood({
                              name: name.trim(),
                              category: 'Custom',
                              calories,
                              protein,
                              carbs,
                              fat,
                              fiber
                            });
                            
                            Alert.alert('Success!', `${name} has been added to your custom foods database. You can now search for it when logging meals!`);
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  };

  const todayLog = getTodayLog();
  const currentMealItems = todayLog?.meals?.[selectedMeal] || [];

  return (
    <View style={styles.tabCard}>
      <Text style={styles.tabTitle}>Log Meals</Text>
      <View style={styles.mealSelector}>
        <TouchableOpacity 
          style={[styles.mealButton, selectedMeal === 'breakfast' && styles.mealButtonActive]} 
          onPress={() => setSelectedMeal('breakfast')}
          data-testid={`button-select-breakfast`}
        >
          <Text style={[styles.mealButtonText, selectedMeal === 'breakfast' && styles.mealButtonTextActive]}>Breakfast</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.mealButton, selectedMeal === 'lunch' && styles.mealButtonActive]} 
          onPress={() => setSelectedMeal('lunch')}
          data-testid={`button-select-lunch`}
        >
          <Text style={[styles.mealButtonText, selectedMeal === 'lunch' && styles.mealButtonTextActive]}>Lunch</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.mealButton, selectedMeal === 'dinner' && styles.mealButtonActive]} 
          onPress={() => setSelectedMeal('dinner')}
          data-testid={`button-select-dinner`}
        >
          <Text style={[styles.mealButtonText, selectedMeal === 'dinner' && styles.mealButtonTextActive]}>Dinner</Text>
        </TouchableOpacity>
      </View>

      {currentMealItems.length > 0 && (
        <View style={styles.snacksList}>
          <Text style={styles.sectionLabel}>Logged in {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}:</Text>
          {currentMealItems.map((food, index) => {
            const displayText = typeof food === 'string' 
              ? food 
              : (food.portion 
                ? `${food.portion.amount}${food.portion.unit} ${food.name}` 
                : food.name);
            return (
              <View key={index} style={styles.snackItemRow}>
                <Text style={styles.snackItemText}>{displayText}</Text>
                <TouchableOpacity onPress={() => removeFoodFromMeal(index)} data-testid={`button-remove-${selectedMeal}-${index}`}>
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
      
      <Text style={styles.sectionLabel}>Search Food Database:</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search foods..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        data-testid="input-search-food"
      />
      
      <TouchableOpacity 
        style={styles.customFoodButton}
        onPress={createCustomFood}
        data-testid="button-add-custom-food"
      >
        <Ionicons name="add-circle" size={20} color="#9333EA" />
        <Text style={styles.customFoodButtonText}>Can't find your food? Add custom food</Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.foodList}>
        {foods.slice(0, 20).map((food) => (
          <TouchableOpacity key={food.id} style={styles.foodItem} onPress={() => addFoodWithModifier(food)}>
            <View style={styles.foodItemHeader}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodCategory}>{food.category}</Text>
            </View>
            <View style={styles.foodMacros}>
              <Text style={styles.foodMacroText}>🔥 {Math.round(food.calories || 0)} cal</Text>
              <Text style={styles.foodMacroText}>P: {Math.round(food.protein || 0)}g</Text>
              <Text style={styles.foodMacroText}>C: {Math.round(food.carbs || 0)}g</Text>
              <Text style={styles.foodMacroText}>F: {Math.round(food.fat || 0)}g</Text>
              <Text style={styles.foodMacroText}>Fiber: {Math.round(food.fiber || 0)}g</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function SnacksTab({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (q: string) => void }) {
  const { getTodayLog, updateTodayLog, customFoods, addCustomFood } = useStorage();
  const todayLog = getTodayLog();
  
  // Merge custom foods with regular foods in search
  const regularFoods = searchFoods(searchQuery);
  const filteredCustomFoods = searchQuery.trim() 
    ? customFoods.filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : customFoods;
  const foods = [...filteredCustomFoods, ...regularFoods];

  const addSnack = (foodItem: string | { name: string; calories?: number; protein?: number; carbs?: number; fat?: number; fiber?: number; isEstimated?: boolean }) => {
    const foodName = typeof foodItem === 'string' ? foodItem : foodItem.name;
    
    updateTodayLog((prev) => {
      const currentSnacks = prev.snacks || [];
      const currentSnackTimes = prev.snackTimes || [];
      
      // Capture current time
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      return {
        snacks: [...currentSnacks, foodItem],
        snackTimes: [...currentSnackTimes, currentTime]
      };
    });
    setSearchQuery('');
    Alert.alert('Added!', `${foodName} added to snacks`);
  };

  // Add food from database with optional modifier
  const addSnackWithModifier = (foodOrName: string | { id: string; name: string; calories?: number; protein?: number; carbs?: number; fat?: number; fiber?: number }) => {
    let foundFood: any;
    let baseFoodName: string;
    
    // If a food object was passed directly (clicked from list), use it
    if (typeof foodOrName === 'object') {
      foundFood = foodOrName;
      baseFoodName = foodOrName.name;
    } else {
      // Otherwise search for it by name
      baseFoodName = foodOrName;
      foundFood = fullFoodDatabase.find(f => f.name.toLowerCase() === baseFoodName.toLowerCase());
      
      // If not in main database, check custom foods (use the LAST match for duplicates)
      if (!foundFood) {
        const matches = customFoods.filter(f => f.name.toLowerCase() === baseFoodName.toLowerCase());
        foundFood = matches.length > 0 ? matches[matches.length - 1] : undefined;
      }
    }
    
    if (!foundFood) {
      // If not found in either database, just add as string (fallback)
      addSnack(baseFoodName);
      return;
    }

    // Helper to prompt for portion and add snack
    const promptForPortionAndAdd = (finalName: string) => {
      // Determine suggested unit based on food category
      const category = foundFood.category?.toLowerCase() || '';
      let suggestedUnit = 'g';
      if (category.includes('vegetable') || category.includes('fruit') || category.includes('grain')) {
        suggestedUnit = 'cups';
      } else if (category.includes('dessert') || category.includes('snack')) {
        suggestedUnit = 'pieces';
      } else if (category.includes('protein')) {
        suggestedUnit = 'g';
      }

      Alert.prompt(
        'Portion Size',
        `Enter amount (e.g., 2 for cookies, 150 for grams)`,
        (amount) => {
          const portionAmount = parseFloat(amount || '100');
          if (isNaN(portionAmount)) {
            Alert.alert('Invalid amount', 'Please enter a valid number');
            return;
          }

          Alert.alert(
            'Select Unit',
            'What unit did you use?',
            [
              { text: 'Grams (g)', onPress: () => addSnackWithPortion(finalName, portionAmount, 'g') },
              { text: 'Cups', onPress: () => addSnackWithPortion(finalName, portionAmount, 'cups') },
              { text: 'Pieces', onPress: () => addSnackWithPortion(finalName, portionAmount, 'pieces') },
              { text: 'Slices', onPress: () => addSnackWithPortion(finalName, portionAmount, 'slice') },
              { text: 'Ounces (oz)', onPress: () => addSnackWithPortion(finalName, portionAmount, 'oz') },
            ]
          );
        }
      );
    };

    // Helper to convert portions to grams and scale nutrition
    const addSnackWithPortion = (finalName: string, amount: number, unit: string) => {
      const conversions: Record<string, number> = {
        'g': 1,
        'cups': 150,
        'pieces': 50,
        'slice': 100,
        'oz': 28.35,
      };
      const grams = amount * (conversions[unit] || 100);
      const multiplier = grams / 100;

      addSnack({
        name: finalName,
        calories: (foundFood.calories || 0) * multiplier,
        protein: (foundFood.protein || 0) * multiplier,
        carbs: (foundFood.carbs || 0) * multiplier,
        fat: (foundFood.fat || 0) * multiplier,
        fiber: (foundFood.fiber || 0) * multiplier,
        portion: { amount, unit }
      });
    };

    Alert.alert(
      'Add a note? (Optional)',
      'You can add details like "small portion" or "with tea"',
      [
        {
          text: 'Add Note',
          onPress: () => {
            Alert.prompt(
              'Add Note',
              `Add to "${baseFoodName}"`,
              (note) => {
                const displayName = note && note.trim() ? `${baseFoodName} ${note.trim()}` : baseFoodName;
                promptForPortionAndAdd(displayName);
              }
            );
          }
        },
        {
          text: 'Skip',
          onPress: () => {
            promptForPortionAndAdd(baseFoodName);
          }
        }
      ]
    );
  };

  const removeSnack = (index: number) => {
    updateTodayLog((prev) => {
      const currentSnacks = prev.snacks || [];
      const currentSnackTimes = prev.snackTimes || [];
      return {
        snacks: currentSnacks.filter((_, i) => i !== index),
        snackTimes: currentSnackTimes.filter((_, i) => i !== index)
      };
    });
  };

  const createCustomFood = () => {
    Alert.prompt(
      'Add Custom Food',
      'Enter food name',
      (name) => {
        if (!name || !name.trim()) {
          Alert.alert('Error', 'Food name is required');
          return;
        }
        
        Alert.prompt(
          'Calories',
          'Enter calories (whole number)',
          (caloriesStr) => {
            const calories = Math.round(parseFloat(caloriesStr || '0'));
            if (isNaN(calories) || calories < 0) {
              Alert.alert('Error', 'Please enter a valid calorie amount');
              return;
            }
            
            Alert.prompt(
              'Protein (g)',
              'Enter protein in grams (whole number)',
              (proteinStr) => {
                const protein = Math.round(parseFloat(proteinStr || '0'));
                if (isNaN(protein) || protein < 0) {
                  Alert.alert('Error', 'Please enter a valid protein amount');
                  return;
                }
                
                Alert.prompt(
                  'Carbs (g)',
                  'Enter carbs in grams (whole number)',
                  (carbsStr) => {
                    const carbs = Math.round(parseFloat(carbsStr || '0'));
                    if (isNaN(carbs) || carbs < 0) {
                      Alert.alert('Error', 'Please enter a valid carbs amount');
                      return;
                    }
                    
                    Alert.prompt(
                      'Fat (g)',
                      'Enter fat in grams (whole number)',
                      (fatStr) => {
                        const fat = Math.round(parseFloat(fatStr || '0'));
                        if (isNaN(fat) || fat < 0) {
                          Alert.alert('Error', 'Please enter a valid fat amount');
                          return;
                        }
                        
                        Alert.prompt(
                          'Fiber (g)',
                          'Enter fiber in grams (whole number)',
                          (fiberStr) => {
                            const fiber = Math.round(parseFloat(fiberStr || '0'));
                            if (isNaN(fiber) || fiber < 0) {
                              Alert.alert('Error', 'Please enter a valid fiber amount');
                              return;
                            }
                            
                            // Save custom food
                            addCustomFood({
                              name: name.trim(),
                              category: 'Custom',
                              calories,
                              protein,
                              carbs,
                              fat,
                              fiber
                            });
                            
                            Alert.alert('Success!', `${name} has been added to your custom foods database. You can now search for it when logging snacks!`);
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  };

  return (
    <View style={styles.tabCard}>
      <View style={styles.snackHeader}>
        <Ionicons name="warning" size={24} color="#F59E0B" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.tabTitle}>Track Snacks Between Meals</Text>
          <Text style={styles.snackWarning}>⚠️ Challenge rule: No snacking between meals. Track if you do anyway.</Text>
        </View>
      </View>

      {todayLog?.snacks && todayLog.snacks.length > 0 && (
        <View style={styles.snacksList}>
          <Text style={styles.sectionLabel}>Today's Snacks:</Text>
          {todayLog.snacks.map((snack, index) => {
            const displayText = typeof snack === 'string' 
              ? snack 
              : (snack.portion 
                ? `${snack.portion.amount}${snack.portion.unit} ${snack.name}` 
                : snack.name);
            return (
              <View key={index} style={styles.snackItemRow}>
                <Text style={styles.snackItemText}>{displayText}</Text>
                <TouchableOpacity onPress={() => removeSnack(index)} data-testid={`button-remove-snack-${index}`}>
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
      
      <Text style={styles.sectionLabel}>Search Food Database:</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search foods..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        data-testid="input-search-snack"
      />
      
      <TouchableOpacity 
        style={styles.customFoodButton}
        onPress={createCustomFood}
        data-testid="button-add-custom-food-snack"
      >
        <Ionicons name="add-circle" size={20} color="#9333EA" />
        <Text style={styles.customFoodButtonText}>Can't find your food? Add custom food</Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.foodList}>
        {foods.slice(0, 20).map((food) => (
          <TouchableOpacity key={food.id} style={styles.foodItem} onPress={() => addSnackWithModifier(food)}>
            <View style={styles.foodItemHeader}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodCategory}>{food.category}</Text>
            </View>
            <View style={styles.foodMacros}>
              <Text style={styles.foodMacroText}>🔥 {Math.round(food.calories || 0)} cal</Text>
              <Text style={styles.foodMacroText}>P: {Math.round(food.protein || 0)}g</Text>
              <Text style={styles.foodMacroText}>C: {Math.round(food.carbs || 0)}g</Text>
              <Text style={styles.foodMacroText}>F: {Math.round(food.fat || 0)}g</Text>
              <Text style={styles.foodMacroText}>Fiber: {Math.round(food.fiber || 0)}g</Text>
            </View>
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
  
  // Craving states
  const [sugarCraving, setSugarCraving] = useState(todayLog?.cravings?.sugarCraving || 0);
  const [emotionalEating, setEmotionalEating] = useState(todayLog?.cravings?.emotionalEating || 0);
  const [cravingTriggers, setCravingTriggers] = useState<string[]>(todayLog?.cravings?.cravingTriggers || []);
  
  // Daily Reflection states
  const [todaysWin, setTodaysWin] = useState(todayLog?.dailyReflection?.todaysWin || '');
  const [mindsetGratitude, setMindsetGratitude] = useState(todayLog?.dailyReflection?.mindsetGratitude || '');
  const [obstaclePlan, setObstaclePlan] = useState(todayLog?.dailyReflection?.obstaclePlan || '');
  const [emotionalAwareness, setEmotionalAwareness] = useState(todayLog?.dailyReflection?.emotionalAwareness || '');
  
  const moods = ['😢', '😕', '😐', '🙂', '😄'];
  const moodLabels = ['Very Sad', 'Down', 'Neutral', 'Good', 'Great'];
  
  const availableSymptoms = ['Bloated', 'Headache', 'Tired', 'Energized', 'Anxious', 'Calm', 'Nauseous', 'Cramps', 'Brain Fog', 'Alert'];
  const availableTriggers = ['Stress', 'Boredom', 'Tired', 'Emotional', 'Social', 'Habitual', 'Hungry'];

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const toggleTrigger = (trigger: string) => {
    setCravingTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
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
      cravings: {
        sugarCraving,
        emotionalEating,
        cravingTriggers
      },
      dailyReflection: {
        todaysWin,
        mindsetGratitude,
        obstaclePlan,
        emotionalAwareness
      }
    });
    
    Alert.alert('Success', 'Mood, wellness, cravings, and reflections logged!');
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

      {/* Craving Tracker Section */}
      <View style={styles.cravingSection}>
        <View style={styles.cravingSectionHeader}>
          <Text style={styles.cravingTitle}>🍬 Craving & Emotional Eating Tracker</Text>
          <Text style={styles.cravingSubtitle}>Track daily to reduce cravings over time</Text>
        </View>

        {/* Sugar Cravings */}
        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Sugar/Sweet Cravings (0-10)</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderMinMax}>😌 None</Text>
            <Text style={styles.sliderValue}>{sugarCraving}/10</Text>
            <Text style={styles.sliderMinMax}>😩 Intense</Text>
          </View>
          <View style={styles.numberButtons}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
              <TouchableOpacity 
                key={num}
                style={[styles.numberButton, sugarCraving === num && styles.numberButtonActive]}
                onPress={() => setSugarCraving(num)}
                data-testid={`button-sugar-craving-${num}`}
              >
                <Text style={[styles.numberButtonText, sugarCraving === num && styles.numberButtonTextActive]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emotional Eating */}
        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Emotional Eating Urges (0-10)</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderMinMax}>😌 None</Text>
            <Text style={styles.sliderValue}>{emotionalEating}/10</Text>
            <Text style={styles.sliderMinMax}>😩 Strong</Text>
          </View>
          <View style={styles.numberButtons}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
              <TouchableOpacity 
                key={num}
                style={[styles.numberButton, emotionalEating === num && styles.numberButtonActive]}
                onPress={() => setEmotionalEating(num)}
                data-testid={`button-emotional-eating-${num}`}
              >
                <Text style={[styles.numberButtonText, emotionalEating === num && styles.numberButtonTextActive]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Craving Triggers */}
        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>What triggered cravings today?</Text>
        <View style={styles.symptomsContainer}>
          {availableTriggers.map((trigger, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.symptomButton, cravingTriggers.includes(trigger) && styles.symptomButtonActive]}
              onPress={() => toggleTrigger(trigger)}
              data-testid={`button-trigger-${trigger.toLowerCase()}`}
            >
              <Text style={[styles.symptomText, cravingTriggers.includes(trigger) && styles.symptomTextActive]}>{trigger}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Craving Citations */}
        <View style={styles.cravingCitationBox}>
          <Text style={styles.cravingCitationText}>
            📚 Research: Appetite journal, "Dietary self-monitoring and cravings" (2018) - Self-monitoring significantly reduces food cravings over time. Journal of Behavioral Medicine (2016) - Tracking emotional eating patterns improves awareness and control.
          </Text>
        </View>
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
          <Text style={styles.reflectionSubtitle}>Track and celebrate wins</Text>
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

        <Text style={[styles.sectionLabel, { marginTop: 12 }]}>🧠 Emotional Eating Awareness</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Noticed I eat when stressed, not hungry. Instead I'll take a walk, drink water, or call a friend..."
          value={emotionalAwareness}
          onChangeText={setEmotionalAwareness}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          data-testid="input-emotional-awareness"
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
  checklistCard: { margin: 16, marginBottom: 8, padding: 12, backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  checklistHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checklistTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginLeft: 10, flex: 1 },
  progressBadge: { backgroundColor: '#9333EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  progressText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  checklistGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  challengeChecklistCard: { margin: 16, marginBottom: 8, padding: 14, backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: '#9333EA', shadowColor: '#9333EA', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 },
  challengeChecklistHeader: { marginBottom: 12 },
  challengeHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  challengeChecklistTitle: { fontSize: 18, fontWeight: 'bold', color: '#9333EA' },
  challengeDayText: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  challengeStepsContainer: { gap: 10 },
  challengeStepItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#F9FAFB', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  challengeStepLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  challengeStepIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center' },
  challengeStepIconCompleted: { backgroundColor: '#9333EA' },
  challengeStepText: { flex: 1 },
  challengeStepTitle: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  challengeStepTitleCompleted: { color: '#16A34A' },
  challengeStepSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  checkItem: { flexDirection: 'row', alignItems: 'center', width: '48%', marginBottom: 6 },
  checkLabel: { fontSize: 13, color: '#6B7280', marginLeft: 8 },
  checkLabelDone: { color: '#16A34A', fontWeight: '600' },
  methodToggle: { 
    marginHorizontal: 16, 
    marginTop: 12, 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9333EA',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 3, 
    elevation: 2
  },
  methodToggleText: { fontSize: 16, fontWeight: 'bold', color: '#9333EA' },
  methodCard: { marginHorizontal: 16, marginTop: 12, padding: 20, backgroundColor: '#EEF2FF', borderRadius: 16 },
  methodHeadline: { fontSize: 18, fontWeight: 'bold', color: '#9333EA', marginBottom: 8, textAlign: 'center' },
  methodBullet: { fontSize: 14, color: '#4B5563', marginBottom: 8, textAlign: 'center' },
  methodSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 16, textAlign: 'center', fontStyle: 'italic' },
  medicalDisclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    marginBottom: 16,
    gap: 10,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  methodSteps: { gap: 12 },
  methodStep: { flexDirection: 'row', alignItems: 'flex-start' },
  methodNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#9333EA', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  methodNumberText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  methodContent: { flex: 1 },
  methodStepTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  methodStepDesc: { fontSize: 14, color: '#6B7280' },
  citationsContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#C7D2FE',
  },
  citationsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 8,
  },
  citationText: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 4,
  },
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
  hydrationTip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3E8FF', padding: 12, borderRadius: 8, marginBottom: 16, gap: 8 },
  hydrationTipText: { flex: 1, fontSize: 13, color: '#7C3AED', lineHeight: 18 },
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
  estimatingText: { fontSize: 12, color: '#9333EA', marginTop: 8, fontStyle: 'italic' },
  customFoodRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  customFoodInput: { flex: 1, backgroundColor: '#F3F4F6', padding: 16, borderRadius: 12, fontSize: 16 },
  addButton: { padding: 4 },
  searchInput: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 16 },
  foodList: { maxHeight: 300 },
  foodItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  foodItemHeader: { marginBottom: 8 },
  foodName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  foodCategory: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  foodMacros: { flexDirection: 'row', gap: 12, marginTop: 4 },
  foodMacroText: { fontSize: 12, color: '#9333EA', fontWeight: '500' },
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
  foodLogButtonContainer: { marginHorizontal: 16, marginTop: 12 },
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
  macroTotalsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  macroTotalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  macroTotalsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  macroTotalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroTotalItem: {
    alignItems: 'center',
  },
  macroTotalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9333EA',
  },
  macroTotalLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  cravingSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: '#DB2777',
    backgroundColor: '#FFF7ED',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cravingSectionHeader: {
    marginBottom: 16,
  },
  cravingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DB2777',
  },
  cravingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  cravingCitationBox: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  cravingCitationText: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 16,
  },
  snackHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  snackWarning: {
    fontSize: 13,
    color: '#92400E',
    marginTop: 4,
    fontStyle: 'italic',
  },
  snacksList: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
  },
  snackItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 8,
  },
  snackItemText: {
    fontSize: 15,
    color: '#1F2937',
    flex: 1,
  },
  customFoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#9333EA',
    borderStyle: 'dashed',
  },
  customFoodButtonText: {
    fontSize: 14,
    color: '#9333EA',
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomPadding: { height: 40 },
});
