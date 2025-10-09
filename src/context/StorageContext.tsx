import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface DailyLog {
  date: string;
  weight?: string;
  steps?: string;
  water: number;
  meals: {
    breakfast?: string[];
    lunch?: string[];
    dinner?: string[];
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
  dailyReflection?: {
    todaysWin?: string;
    mindsetGratitude?: string;
    obstaclePlan?: string;
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
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

const STORAGE_KEY = 'pounddrop_logs';
const USER_INFO_KEY = 'pounddrop_user_info';
const WEIGHT_UNIT_KEY = 'pounddrop_weight_unit';
const STARTING_WEIGHT_KEY = 'pounddrop_starting_weight';
const STARTING_WEIGHT_UNIT_KEY = 'pounddrop_starting_weight_unit';
const HIGHEST_MILESTONE_KEY = 'pounddrop_highest_milestone';

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

  // Load data on mount
  useEffect(() => {
    loadData();
    loadUserInfo();
    loadWeightUnit();
    loadStartingWeight();
    loadHighestMilestone();
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
    
    // Convert current weight to starting weight's unit for accurate comparison
    let adjustedCurrentWeight = currentWeight;
    if (weightUnit !== startingWeightUnit) {
      if (weightUnit === 'kg' && startingWeightUnit === 'lbs') {
        // Current is in kg, starting is in lbs - convert current to lbs
        adjustedCurrentWeight = currentWeight * 2.20462;
      } else if (weightUnit === 'lbs' && startingWeightUnit === 'kg') {
        // Current is in lbs, starting is in kg - convert current to kg
        adjustedCurrentWeight = currentWeight / 2.20462;
      }
    }
    
    return Math.max(0, startingWeight - adjustedCurrentWeight);
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
      updateHighestMilestone
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
