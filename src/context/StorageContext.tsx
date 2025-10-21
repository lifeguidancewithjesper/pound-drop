import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { foodDatabase } from '../data/foodDatabase';

interface FoodWithNutrition {
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  isEstimated?: boolean; // Flag to indicate if nutrition was estimated by AI
}

interface DailyLog {
  date: string;
  weight?: string;
  steps?: string;
  water: number;
  meals: {
    breakfast?: (string | FoodWithNutrition)[];
    lunch?: (string | FoodWithNutrition)[];
    dinner?: (string | FoodWithNutrition)[];
  };
  snacks?: (string | FoodWithNutrition)[]; // Track snacks between meals
  snackTimes?: string[]; // Timestamps for each snack
  mealTimes?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  mealFeelings?: {
    breakfast?: number;
    lunch?: number;
    dinner?: number;
  };
  mood?: number;
  moodDetails?: {
    feeling?: number;
    stressLevel?: number;
    energyLevel?: number;
    sleepQuality?: number;
    symptoms?: string[];
    notes?: string;
  };
  cravings?: {
    sugarCraving?: number;
    emotionalEating?: number;
    cravingTriggers?: string[];
  };
  dailyReflection?: {
    todaysWin?: string;
    mindsetGratitude?: string;
    obstaclePlan?: string;
    emotionalAwareness?: string;
  };
  measurements?: {
    waist?: string;
    hips?: string;
    chest?: string;
    arms?: string;
    thighs?: string;
  };
  workouts?: {
    type: string;
    duration: string;
    calories?: string;
  }[];
  fasting?: {
    duration: number; // 12, 14, 16, 18, 20 hours
    startTime: string; // e.g., "20:00"
    endTime: string; // e.g., "12:00"
  };
}

export interface CustomFood {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface StorageContextType {
  logs: DailyLog[];
  addLog: (log: Partial<DailyLog>) => void;
  getTodayLog: () => DailyLog | undefined;
  updateTodayLog: (updates: Partial<DailyLog> | ((prev: DailyLog) => Partial<DailyLog>)) => void;
  isLoaded: boolean;
  username: string | null;
  isFirstLogin: boolean;
  setUserInfo: (username: string, isFirstLogin: boolean) => Promise<void>;
  getUserInfo: () => Promise<{ username: string | null; isFirstLogin: boolean }>;
  weightUnit: 'lbs' | 'kg';
  setWeightUnit: (unit: 'lbs' | 'kg') => Promise<void>;
  getStartingWeight: () => number | null;
  setStartingWeight: (weight: number) => Promise<void>;
  getWeightLoss: (currentWeight: number) => number;
  getMilestone: (weightLoss: number) => number;
  getHighestMilestone: () => number;
  updateHighestMilestone: (milestone: number) => Promise<void>;
  calculateCalories: (meals: { breakfast?: (string | FoodWithNutrition)[]; lunch?: (string | FoodWithNutrition)[]; dinner?: (string | FoodWithNutrition)[] }, snacks?: (string | FoodWithNutrition)[]) => { total: number; breakfast: number; lunch: number; dinner: number };
  calculateMacros: (meals: { breakfast?: (string | FoodWithNutrition)[]; lunch?: (string | FoodWithNutrition)[]; dinner?: (string | FoodWithNutrition)[] }, snacks?: (string | FoodWithNutrition)[]) => { 
    total: { protein: number; carbs: number; fat: number; fiber: number }; 
    breakfast: { protein: number; carbs: number; fat: number; fiber: number }; 
    lunch: { protein: number; carbs: number; fat: number; fiber: number }; 
    dinner: { protein: number; carbs: number; fat: number; fiber: number };
  };
  getChallengeStartDate: () => string | null;
  startChallenge: () => Promise<void>;
  getCurrentChallengeDay: () => number | null;
  reloadAllData: () => Promise<void>;
  customFoods: CustomFood[];
  addCustomFood: (food: Omit<CustomFood, 'id'>) => Promise<void>;
  getCustomFoods: () => CustomFood[];
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

const STORAGE_KEY = 'pounddrop_logs';
const USER_INFO_KEY = 'pounddrop_user_info';
const WEIGHT_UNIT_KEY = 'pounddrop_weight_unit';
const STARTING_WEIGHT_KEY = 'pounddrop_starting_weight';
const STARTING_WEIGHT_UNIT_KEY = 'pounddrop_starting_weight_unit';
const HIGHEST_MILESTONE_KEY = 'pounddrop_highest_milestone';
const CHALLENGE_START_DATE_KEY = 'pounddrop_challenge_start_date';
const CUSTOM_FOODS_KEY = 'pounddrop_custom_foods';

// Deep merge helper for nested objects
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  
  return output;
}

export function StorageProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [weightUnit, setWeightUnitState] = useState<'lbs' | 'kg'>('lbs');
  const [startingWeight, setStartingWeightState] = useState<number | null>(null);
  const [startingWeightUnit, setStartingWeightUnitState] = useState<'lbs' | 'kg'>('lbs');
  const [highestMilestone, setHighestMilestoneState] = useState<number>(0);
  const [challengeStartDate, setChallengeStartDateState] = useState<string | null>(null);
  const [customFoods, setCustomFoods] = useState<CustomFood[]>([]);

  // Load data on mount
  useEffect(() => {
    loadData();
    loadUserInfo();
    loadWeightUnit();
    loadStartingWeight();
    loadHighestMilestone();
    loadChallengeStartDate();
    loadCustomFoods();
  }, []);

  // Save data whenever logs change
  useEffect(() => {
    if (isLoaded) {
      saveData();
    }
  }, [logs, isLoaded]);

  const loadData = async () => {
    try {
      const data = await SecureStore.getItemAsync(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setLogs(parsed);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveData = async () => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const loadUserInfo = async () => {
    try {
      const data = await SecureStore.getItemAsync(USER_INFO_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setUsername(parsed.username);
        setIsFirstLogin(parsed.isFirstLogin || false);
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const setUserInfo = async (newUsername: string, newIsFirstLogin: boolean) => {
    try {
      const userInfo = { username: newUsername, isFirstLogin: newIsFirstLogin };
      await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(userInfo));
      setUsername(newUsername);
      setIsFirstLogin(newIsFirstLogin);
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  };

  const getUserInfo = async () => {
    try {
      const data = await SecureStore.getItemAsync(USER_INFO_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return { username: null, isFirstLogin: false };
    } catch (error) {
      console.error('Error getting user info:', error);
      return { username: null, isFirstLogin: false };
    }
  };

  const loadWeightUnit = async () => {
    try {
      const unit = await SecureStore.getItemAsync(WEIGHT_UNIT_KEY);
      if (unit === 'lbs' || unit === 'kg') {
        setWeightUnitState(unit);
      }
    } catch (error) {
      console.error('Error loading weight unit:', error);
    }
  };

  const setWeightUnit = async (unit: 'lbs' | 'kg') => {
    try {
      await SecureStore.setItemAsync(WEIGHT_UNIT_KEY, unit);
      setWeightUnitState(unit);
    } catch (error) {
      console.error('Error saving weight unit:', error);
    }
  };

  const loadStartingWeight = async () => {
    try {
      const weight = await SecureStore.getItemAsync(STARTING_WEIGHT_KEY);
      const unit = await SecureStore.getItemAsync(STARTING_WEIGHT_UNIT_KEY);
      if (weight) {
        setStartingWeightState(parseFloat(weight));
      }
      if (unit === 'lbs' || unit === 'kg') {
        setStartingWeightUnitState(unit);
      }
    } catch (error) {
      console.error('Error loading starting weight:', error);
    }
  };

  const getStartingWeight = () => {
    return startingWeight;
  };

  const setStartingWeight = async (weight: number) => {
    try {
      await SecureStore.setItemAsync(STARTING_WEIGHT_KEY, weight.toString());
      await SecureStore.setItemAsync(STARTING_WEIGHT_UNIT_KEY, weightUnit);
      setStartingWeightState(weight);
      setStartingWeightUnitState(weightUnit);
    } catch (error) {
      console.error('Error saving starting weight:', error);
    }
  };

  const getWeightLoss = (currentWeight: number) => {
    if (!startingWeight) return 0;
    
    // Convert starting weight to current unit for comparison
    let adjustedStartingWeight = startingWeight;
    if (weightUnit !== startingWeightUnit) {
      if (weightUnit === 'kg' && startingWeightUnit === 'lbs') {
        // Current is in kg, starting is in lbs - convert starting to kg
        adjustedStartingWeight = startingWeight / 2.20462;
      } else if (weightUnit === 'lbs' && startingWeightUnit === 'kg') {
        // Current is in lbs, starting is in kg - convert starting to lbs
        adjustedStartingWeight = startingWeight * 2.20462;
      }
    }
    
    // Return weight loss in current unit
    return Math.max(0, adjustedStartingWeight - currentWeight);
  };

  const getMilestone = (weightLoss: number) => {
    const milestones = [20, 15, 10, 5, 2];
    for (const milestone of milestones) {
      if (weightLoss >= milestone) {
        return milestone;
      }
    }
    return 0;
  };

  const loadHighestMilestone = async () => {
    try {
      const milestone = await SecureStore.getItemAsync(HIGHEST_MILESTONE_KEY);
      if (milestone) {
        setHighestMilestoneState(parseInt(milestone));
      }
    } catch (error) {
      console.error('Error loading highest milestone:', error);
    }
  };

  const getHighestMilestone = () => {
    return highestMilestone;
  };

  const updateHighestMilestone = async (milestone: number) => {
    try {
      await SecureStore.setItemAsync(HIGHEST_MILESTONE_KEY, milestone.toString());
      setHighestMilestoneState(milestone);
    } catch (error) {
      console.error('Error saving highest milestone:', error);
    }
  };

  const loadChallengeStartDate = async () => {
    try {
      const startDate = await SecureStore.getItemAsync(CHALLENGE_START_DATE_KEY);
      setChallengeStartDateState(startDate);
    } catch (error) {
      console.error('Error loading challenge start date:', error);
    }
  };

  const getChallengeStartDate = () => {
    return challengeStartDate;
  };

  const startChallenge = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await SecureStore.setItemAsync(CHALLENGE_START_DATE_KEY, today);
      setChallengeStartDateState(today);
    } catch (error) {
      console.error('Error starting challenge:', error);
    }
  };

  const getCurrentChallengeDay = () => {
    if (!challengeStartDate) return null;
    
    const start = new Date(challengeStartDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because day 1 is the start date
    
    if (diffDays > 28) return 28; // Cap at 28 days
    if (diffDays < 1) return 1; // Minimum day 1
    return diffDays;
  };

  const loadCustomFoods = async () => {
    try {
      const data = await SecureStore.getItemAsync(CUSTOM_FOODS_KEY);
      if (data) {
        const parsedFoods = JSON.parse(data);
        // Normalize old custom foods to ensure all have complete nutrition data
        const normalizedFoods = parsedFoods.map((food: any) => ({
          ...food,
          calories: food.calories ?? 0,
          protein: food.protein ?? 0,
          carbs: food.carbs ?? 0,
          fat: food.fat ?? 0,
          fiber: food.fiber ?? 0
        }));
        setCustomFoods(normalizedFoods);
      }
    } catch (error) {
      console.error('Error loading custom foods:', error);
    }
  };

  const saveCustomFoods = async (foods: CustomFood[]) => {
    try {
      await SecureStore.setItemAsync(CUSTOM_FOODS_KEY, JSON.stringify(foods));
    } catch (error) {
      console.error('Error saving custom foods:', error);
    }
  };

  const addCustomFood = async (food: Omit<CustomFood, 'id'>) => {
    const newFood: CustomFood = {
      ...food,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    const updatedFoods = [...customFoods, newFood];
    setCustomFoods(updatedFoods);
    await saveCustomFoods(updatedFoods);
  };

  const getCustomFoods = () => {
    return customFoods;
  };

  const getTodayLog = () => {
    const today = new Date().toISOString().split('T')[0];
    return logs.find(log => log.date === today);
  };

  const updateTodayLog = (updates: Partial<DailyLog> | ((prev: DailyLog) => Partial<DailyLog>)) => {
    const today = new Date().toISOString().split('T')[0];
    setLogs(prev => {
      const existing = prev.find(log => log.date === today);
      const currentLog = existing || { date: today, water: 0, meals: {} };
      
      // Handle functional update
      const resolvedUpdates = typeof updates === 'function' ? updates(currentLog) : updates;
      
      if (existing) {
        return prev.map(log => 
          log.date === today 
            ? deepMerge(log, resolvedUpdates)
            : log
        );
      } else {
        return [...prev, { ...currentLog, ...resolvedUpdates }];
      }
    });
  };

  const addLog = (log: Partial<DailyLog>) => {
    const today = new Date().toISOString().split('T')[0];
    setLogs(prev => {
      const existing = prev.find(l => l.date === today);
      if (existing) {
        return prev.map(l => l.date === today ? deepMerge(l, log) : l);
      }
      return [...prev, { date: today, water: 0, meals: {}, ...log }];
    });
  };

  const calculateCalories = (meals: { breakfast?: (string | FoodWithNutrition)[]; lunch?: (string | FoodWithNutrition)[]; dinner?: (string | FoodWithNutrition)[] }, snacks?: (string | FoodWithNutrition)[]) => {
    const getCaloriesForMeal = (mealItems: (string | FoodWithNutrition)[] | undefined) => {
      if (!mealItems || mealItems.length === 0) return 0;
      return mealItems.reduce((total, foodItem) => {
        // If it's a FoodWithNutrition object, use its calories
        if (typeof foodItem === 'object' && foodItem.calories !== undefined) {
          return total + foodItem.calories;
        }
        // Otherwise it's a string, look it up in the database
        const food = foodDatabase.find(f => f.name === foodItem);
        return total + (food?.calories || 0);
      }, 0);
    };

    const breakfastCals = getCaloriesForMeal(meals.breakfast);
    const lunchCals = getCaloriesForMeal(meals.lunch);
    const dinnerCals = getCaloriesForMeal(meals.dinner);
    const snacksCals = getCaloriesForMeal(snacks);

    return {
      total: breakfastCals + lunchCals + dinnerCals + snacksCals,
      breakfast: breakfastCals,
      lunch: lunchCals,
      dinner: dinnerCals
    };
  };

  const calculateMacros = (meals: { breakfast?: (string | FoodWithNutrition)[]; lunch?: (string | FoodWithNutrition)[]; dinner?: (string | FoodWithNutrition)[] }, snacks?: (string | FoodWithNutrition)[]) => {
    const getMacrosForMeal = (mealItems: (string | FoodWithNutrition)[] | undefined) => {
      if (!mealItems || mealItems.length === 0) {
        return { protein: 0, carbs: 0, fat: 0, fiber: 0 };
      }
      return mealItems.reduce((totals, foodItem) => {
        // If it's a FoodWithNutrition object, use its macros
        if (typeof foodItem === 'object') {
          return {
            protein: totals.protein + (foodItem.protein || 0),
            carbs: totals.carbs + (foodItem.carbs || 0),
            fat: totals.fat + (foodItem.fat || 0),
            fiber: totals.fiber + (foodItem.fiber || 0)
          };
        }
        // Otherwise it's a string, look it up in the database
        const food = foodDatabase.find(f => f.name === foodItem);
        return {
          protein: totals.protein + (food?.protein || 0),
          carbs: totals.carbs + (food?.carbs || 0),
          fat: totals.fat + (food?.fat || 0),
          fiber: totals.fiber + (food?.fiber || 0)
        };
      }, { protein: 0, carbs: 0, fat: 0, fiber: 0 });
    };

    const breakfastMacros = getMacrosForMeal(meals.breakfast);
    const lunchMacros = getMacrosForMeal(meals.lunch);
    const dinnerMacros = getMacrosForMeal(meals.dinner);
    const snacksMacros = getMacrosForMeal(snacks);

    return {
      total: {
        protein: breakfastMacros.protein + lunchMacros.protein + dinnerMacros.protein + snacksMacros.protein,
        carbs: breakfastMacros.carbs + lunchMacros.carbs + dinnerMacros.carbs + snacksMacros.carbs,
        fat: breakfastMacros.fat + lunchMacros.fat + dinnerMacros.fat + snacksMacros.fat,
        fiber: breakfastMacros.fiber + lunchMacros.fiber + dinnerMacros.fiber + snacksMacros.fiber
      },
      breakfast: breakfastMacros,
      lunch: lunchMacros,
      dinner: dinnerMacros
    };
  };

  const reloadAllData = async () => {
    await loadData();
    await loadUserInfo();
    await loadWeightUnit();
    await loadStartingWeight();
    await loadHighestMilestone();
    await loadChallengeStartDate();
    await loadCustomFoods();
  };

  return (
    <StorageContext.Provider value={{ 
      logs, 
      addLog, 
      getTodayLog, 
      updateTodayLog, 
      isLoaded,
      username,
      isFirstLogin,
      setUserInfo,
      getUserInfo,
      weightUnit,
      setWeightUnit,
      getStartingWeight,
      setStartingWeight,
      getWeightLoss,
      getMilestone,
      getHighestMilestone,
      updateHighestMilestone,
      calculateCalories,
      calculateMacros,
      getChallengeStartDate,
      startChallenge,
      getCurrentChallengeDay,
      reloadAllData,
      customFoods,
      addCustomFood,
      getCustomFoods
    }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within StorageProvider');
  }
  return context;
}
