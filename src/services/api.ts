// Get the correct API URL for tunnel mode
const getApiBaseUrl = () => {
  // In Expo tunnel mode, we need to use the tunnel URL instead of localhost
  const expoUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
  return expoUrl;
};

const API_BASE_URL = getApiBaseUrl();

// Demo user ID for testing - in real app this would come from authentication
const DEMO_USER_ID = 'demo-user-id';

export class ApiService {
  private static async makeRequest(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User data
  static async getCurrentUser() {
    return this.makeRequest('/user');
  }

  // Daily logs for mood and wellness data
  static async getDailyLogs(userId: string = DEMO_USER_ID, limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    return this.makeRequest(`/users/${userId}/daily-logs${params}`);
  }

  // Steps tracking
  static async getStepsTracking(userId: string = DEMO_USER_ID, limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    return this.makeRequest(`/users/${userId}/steps${params}`);
  }

  // Habits
  static async getUserHabits(userId: string = DEMO_USER_ID) {
    return this.makeRequest(`/users/${userId}/habits`);
  }

  static async createHabit(userId: string = DEMO_USER_ID, habit: any) {
    return this.makeRequest(`/users/${userId}/habits`, {
      method: 'POST',
      body: JSON.stringify(habit),
    });
  }

  static async updateHabit(habitId: string, updates: any) {
    return this.makeRequest(`/habits/${habitId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  static async deleteHabit(habitId: string) {
    return this.makeRequest(`/habits/${habitId}`, {
      method: 'DELETE',
    });
  }

  // Body measurements
  static async getBodyMeasurements(userId: string = DEMO_USER_ID, measurementType?: string) {
    const params = measurementType ? `?measurementType=${measurementType}` : '';
    return this.makeRequest(`/users/${userId}/body-measurements${params}`);
  }

  static async createBodyMeasurement(userId: string = DEMO_USER_ID, measurement: any) {
    return this.makeRequest(`/users/${userId}/body-measurements`, {
      method: 'POST',
      body: JSON.stringify(measurement),
    });
  }

  // Exercises
  static async getExercises(userId: string = DEMO_USER_ID) {
    return this.makeRequest(`/exercises?userId=${userId}`);
  }

  // Meals
  static async getAllUserMeals(userId: string = DEMO_USER_ID) {
    return this.makeRequest(`/users/${userId}/meals/all`);
  }

  // Fasting windows
  static async getFastingWindows(userId: string = DEMO_USER_ID) {
    return this.makeRequest(`/fasting-windows?userId=${userId}`);
  }

  // Calorie entries
  static async getCalorieEntries(userId: string = DEMO_USER_ID, limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    return this.makeRequest(`/users/${userId}/calorie-entries${params}`);
  }

  // Achievements
  static async getUserAchievements(userId: string = DEMO_USER_ID) {
    return this.makeRequest(`/users/${userId}/achievements`);
  }
}