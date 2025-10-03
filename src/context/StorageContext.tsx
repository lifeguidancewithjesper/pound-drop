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
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

const STORAGE_KEY = 'pounddrop_logs';
const USER_INFO_KEY = 'pounddrop_user_info';

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

  // Load data on mount
  useEffect(() => {
    loadData();
    loadUserInfo();
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
      getUserInfo
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