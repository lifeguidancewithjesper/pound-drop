import { Router, type Express } from 'express';
import { z } from 'zod';
import { storage } from './storage';
import { 
  insertMealSchema, 
  insertWeightEntrySchema, 
  insertUserSchema, 
  insertStepEntrySchema,
  insertWaterEntrySchema,
  insertDailyMoodSchema
} from '../shared/schema';

const router = Router();

export function registerRoutes(app: Express) {
  app.use('/api', router);
  return app;
}

// Simple Demo User for Development
const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@pounddrop.com',
  name: 'Demo User',
  created_at: new Date().toISOString(),
};

// Auth routes - Simple demo authentication
router.post('/auth/login', async (req, res) => {
  try {
    console.log('🔐 Demo login');
    res.json({ 
      user: DEMO_USER, 
      token: 'demo-token' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/auth/me', async (req, res) => {
  try {
    res.json(DEMO_USER);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Weight Tracking Routes
router.get('/weight-entries', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || DEMO_USER.id;
    console.log('⚖️ Getting weight entries for user:', userId);
    
    const entries = await storage.getWeightEntries(userId);
    res.json(entries);
  } catch (error) {
    console.error('Get weight entries error:', error);
    res.status(500).json({ error: 'Failed to get weight entries' });
  }
});

router.post('/weight-entries', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || DEMO_USER.id;
    console.log('⚖️ Creating weight entry for user:', userId, req.body);
    
    const weightData = insertWeightEntrySchema.parse({ ...req.body, userId });
    const entry = await storage.createWeightEntry(weightData);
    
    res.status(201).json(entry);
  } catch (error) {
    console.error('Create weight entry error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create weight entry' });
  }
});

// Steps Tracking Routes
router.get('/steps', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || DEMO_USER.id;
    const date = req.query.date as string;
    console.log('👣 Getting steps for user:', userId, 'date:', date);
    
    if (date) {
      const entry = await storage.getStepsByDate(userId, date);
      return res.json(entry ? [entry] : []);
    }
    
    const entries = await storage.getAllSteps(userId);
    res.json(entries);
  } catch (error) {
    console.error('Get steps error:', error);
    res.status(500).json({ error: 'Failed to get steps data' });
  }
});

router.post('/steps', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || DEMO_USER.id;
    console.log('👣 Creating/updating steps for user:', userId, req.body);
    
    const stepsData = insertStepEntrySchema.parse({ ...req.body, userId });
    const entry = await storage.createOrUpdateSteps(stepsData);
    
    res.status(201).json(entry);
  } catch (error) {
    console.error('Create/update steps error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to save steps data' });
  }
});

// Water Tracking Routes
router.get('/water-entries', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || DEMO_USER.id;
    console.log('💧 Getting water entries for user:', userId);
    
    const entries = await storage.getWaterEntries(userId);
    res.json(entries);
  } catch (error) {
    console.error('Get water entries error:', error);
    res.status(500).json({ error: 'Failed to get water entries' });
  }
});

router.post('/water-entries', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || DEMO_USER.id;
    console.log('💧 Creating water entry for user:', userId, req.body);
    
    const waterData = insertWaterEntrySchema.parse({ ...req.body, userId });
    const entry = await storage.createWaterEntry(waterData);
    
    res.status(201).json(entry);
  } catch (error) {
    console.error('Create water entry error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create water entry' });
  }
});

// Meals Tracking Routes (Breakfast, Lunch, Dinner)
router.get('/meals', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || DEMO_USER.id;
    const date = req.query.date as string;
    console.log('🍽️ Getting meals for user:', userId, 'date:', date);
    
    if (date) {
      const meals = await storage.getMealsByDate(userId, date);
      return res.json(meals);
    }
    
    const meals = await storage.getAllUserMeals(userId);
    res.json(meals);
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({ error: 'Failed to get meals' });
  }
});

router.post('/meals', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || DEMO_USER.id;
    console.log('🍽️ Creating meal for user:', userId, req.body);
    
    const mealData = insertMealSchema.parse({ ...req.body, userId });
    const meal = await storage.createMeal(mealData);
    
    res.status(201).json(meal);
  } catch (error) {
    console.error('Create meal error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create meal' });
  }
});

router.patch('/meals/:id', async (req, res) => {
  try {
    const mealId = req.params.id;
    const updates = req.body;
    console.log('🍽️ Updating meal:', mealId, updates);
    
    const meal = await storage.updateMeal(mealId, updates);
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    res.json(meal);
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({ error: 'Failed to update meal' });
  }
});

router.delete('/meals/:id', async (req, res) => {
  try {
    const mealId = req.params.id;
    console.log('🗑️ Deleting meal:', mealId);
    
    await storage.deleteMeal(mealId);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

// Mood Tracking Routes
router.get('/daily-moods', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || DEMO_USER.id;
    console.log('😊 Getting moods for user:', userId);
    
    const moods = await storage.getDailyMoods(userId);
    res.json(moods);
  } catch (error) {
    console.error('Get daily moods error:', error);
    res.status(500).json({ error: 'Failed to get daily moods' });
  }
});

router.post('/daily-moods', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || DEMO_USER.id;
    console.log('😊 Creating daily mood for user:', userId, req.body);
    
    const moodData = insertDailyMoodSchema.parse({ ...req.body, userId });
    const mood = await storage.createDailyMood(moodData);
    
    res.status(201).json(mood);
  } catch (error) {
    console.error('Create daily mood error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create daily mood' });
  }
});

// Historical Data Route - Get all logs for a user
router.get('/history', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || DEMO_USER.id;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    console.log('📊 Getting history for user:', userId, 'from:', startDate, 'to:', endDate);
    
    // Get all historical data
    const [weights, steps, water, meals, moods] = await Promise.all([
      storage.getWeightEntries(userId),
      storage.getAllSteps(userId),
      storage.getWaterEntries(userId),
      storage.getAllUserMeals(userId),
      storage.getDailyMoods(userId)
    ]);
    
    res.json({
      weights,
      steps,
      water,
      meals,
      moods
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get history data' });
  }
});

// Nutrition Estimation Route - Estimate nutrition for custom foods
router.post('/estimate-nutrition', async (req, res) => {
  try {
    const { foodName } = req.body;
    
    if (!foodName) {
      return res.status(400).json({ error: 'Food name is required' });
    }

    console.log('🍎 Estimating nutrition for:', foodName);

    // Import OpenAI here to avoid issues in React Native
    const OpenAI = (await import('openai')).default;
    
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a nutrition expert. Estimate the nutritional values for a standard serving of the given food. Respond with JSON in this format: { \"calories\": number, \"protein\": number, \"carbs\": number, \"fat\": number }"
        },
        {
          role: "user",
          content: `Estimate the nutritional values for a standard serving of: ${foodName}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const nutritionData = JSON.parse(response.choices[0].message.content || '{}');
    
    // Round values and ensure they're numbers
    const result = {
      calories: Math.round(nutritionData.calories || 0),
      protein: Math.round(nutritionData.protein || 0),
      carbs: Math.round(nutritionData.carbs || 0),
      fat: Math.round(nutritionData.fat || 0),
    };

    console.log('✅ Nutrition estimated:', result);
    res.json(result);
  } catch (error) {
    console.error('Nutrition estimation error:', error);
    res.status(500).json({ error: 'Failed to estimate nutrition' });
  }
});