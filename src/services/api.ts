// Simple, Clean API Service for Pound Drop Weight Loss Tracker
// IMPORTANT FOR MOBILE: localhost won't work on your phone!
// Mac IP Address: 192.168.0.58
// You can also set EXPO_PUBLIC_API_URL environment variable to override this
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.58:5000';

export class ApiService {
  // Make API requests with proper error handling
  static async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const url = `${API_BASE_URL}/api${endpoint}`;
      
      const config: RequestInit = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      };

      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Success: ${url}`);
      return data;

    } catch (error) {
      console.error('🚨 API Error:', error);
      throw error;
    }
  }

  // Authentication
  static async login(email: string, password: string) {
    return await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(
    username: string,
    email: string,
    password: string,
    currentWeight: string,
    targetWeight: string,
    startWeight: string
  ) {
    return await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password,
        currentWeight,
        targetWeight,
        startWeight,
      }),
    });
  }

  static async getCurrentUser() {
    return await this.makeRequest('/auth/me');
  }

  // Weight Tracking
  static async getWeightEntries() {
    return await this.makeRequest('/weight-entries');
  }

  static async createWeightEntry(weightData: any) {
    return await this.makeRequest('/weight-entries', {
      method: 'POST',
      body: JSON.stringify(weightData),
    });
  }

  // Steps Tracking
  static async getSteps(date?: string) {
    const query = date ? `?date=${date}` : '';
    return await this.makeRequest(`/steps${query}`);
  }

  static async createSteps(stepsData: any) {
    return await this.makeRequest('/steps', {
      method: 'POST',
      body: JSON.stringify(stepsData),
    });
  }

  // Water Tracking
  static async getWaterEntries() {
    return await this.makeRequest('/water-entries');
  }

  static async createWaterEntry(waterData: any) {
    return await this.makeRequest('/water-entries', {
      method: 'POST',
      body: JSON.stringify(waterData),
    });
  }

  // Meals Tracking (Breakfast, Lunch, Dinner)
  static async getMealsByDate(date: string) {
    return await this.makeRequest(`/meals?date=${date}`);
  }

  static async getAllUserMeals() {
    return await this.makeRequest('/meals');
  }

  static async createMeal(mealData: any) {
    return await this.makeRequest('/meals', {
      method: 'POST',
      body: JSON.stringify(mealData),
    });
  }

  static async updateMeal(mealId: string, updates: any) {
    return await this.makeRequest(`/meals/${mealId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  static async deleteMeal(mealId: string) {
    return await this.makeRequest(`/meals/${mealId}`, {
      method: 'DELETE',
    });
  }

  // Mood Tracking
  static async getDailyMoods() {
    return await this.makeRequest('/daily-moods');
  }

  static async createDailyMood(moodData: any) {
    return await this.makeRequest('/daily-moods', {
      method: 'POST',
      body: JSON.stringify(moodData),
    });
  }

  // Historical Data - Get all logs for viewing past entries
  static async getHistoricalData(startDate?: string, endDate?: string) {
    let query = '';
    if (startDate && endDate) {
      query = `?startDate=${startDate}&endDate=${endDate}`;
    }
    return await this.makeRequest(`/history${query}`);
  }

  // Nutrition Estimation - Estimate nutrition for custom foods using AI
  static async estimateNutrition(foodName: string) {
    return await this.makeRequest('/estimate-nutrition', {
      method: 'POST',
      body: JSON.stringify({ foodName }),
    });
  }
}