import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Storage keys for notification identifiers
const DAILY_MEAL_NOTIFICATION_ID = 'daily_meal_notification_id';
const MONTHLY_WEIGHT_NOTIFICATION_ID = 'monthly_weight_notification_id';
const WEEKLY_PROGRESS_NOTIFICATION_ID = 'weekly_progress_notification_id';

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const scheduleDailyMealReminder = async (): Promise<boolean> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return false;

    // Cancel any existing daily meal reminders
    await cancelDailyMealReminder();

    // Schedule daily notification at 6 PM and store the returned identifier
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🍽️ Time to Log Your Meals!',
        body: 'Don\'t forget to track your dinner and evening snacks to stay on track.',
        sound: true,
      },
      trigger: {
        hour: 18,
        minute: 0,
        repeats: true,
      },
    });

    // Store the notification ID for later cancellation
    await SecureStore.setItemAsync(DAILY_MEAL_NOTIFICATION_ID, notificationId);

    return true;
  } catch (error) {
    console.error('Error scheduling daily meal reminder:', error);
    return false;
  }
};

export const cancelDailyMealReminder = async (): Promise<void> => {
  try {
    const storedId = await SecureStore.getItemAsync(DAILY_MEAL_NOTIFICATION_ID);
    if (storedId) {
      await Notifications.cancelScheduledNotificationAsync(storedId);
      await SecureStore.deleteItemAsync(DAILY_MEAL_NOTIFICATION_ID);
    }
  } catch (error) {
    console.error('Error canceling daily meal reminder:', error);
  }
};

export const scheduleMonthlyWeightReminder = async (): Promise<boolean> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return false;

    // Cancel any existing monthly weight reminders
    await cancelMonthlyWeightReminder();

    // Schedule monthly notification on the 1st at 9 AM and store the returned identifier
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚖️ Monthly Weight Check',
        body: 'It\'s the 1st of the month! Time to log your weight and track your progress.',
        sound: true,
      },
      trigger: {
        day: 1,
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });

    // Store the notification ID for later cancellation
    await SecureStore.setItemAsync(MONTHLY_WEIGHT_NOTIFICATION_ID, notificationId);

    return true;
  } catch (error) {
    console.error('Error scheduling monthly weight reminder:', error);
    return false;
  }
};

export const cancelMonthlyWeightReminder = async (): Promise<void> => {
  try {
    const storedId = await SecureStore.getItemAsync(MONTHLY_WEIGHT_NOTIFICATION_ID);
    if (storedId) {
      await Notifications.cancelScheduledNotificationAsync(storedId);
      await SecureStore.deleteItemAsync(MONTHLY_WEIGHT_NOTIFICATION_ID);
    }
  } catch (error) {
    console.error('Error canceling monthly weight reminder:', error);
  }
};

export const scheduleWeeklyProgressReminder = async (): Promise<boolean> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return false;

    // Cancel any existing weekly progress reminders
    await cancelWeeklyProgressReminder();

    // Schedule weekly notification every Sunday at 10 AM and store the returned identifier
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📊 Weekly Progress Review',
        body: 'Time to celebrate your wins and review your progress this week!',
        sound: true,
      },
      trigger: {
        weekday: 1, // Sunday
        hour: 10,
        minute: 0,
        repeats: true,
      },
    });

    // Store the notification ID for later cancellation
    await SecureStore.setItemAsync(WEEKLY_PROGRESS_NOTIFICATION_ID, notificationId);

    return true;
  } catch (error) {
    console.error('Error scheduling weekly progress reminder:', error);
    return false;
  }
};

export const cancelWeeklyProgressReminder = async (): Promise<void> => {
  try {
    const storedId = await SecureStore.getItemAsync(WEEKLY_PROGRESS_NOTIFICATION_ID);
    if (storedId) {
      await Notifications.cancelScheduledNotificationAsync(storedId);
      await SecureStore.deleteItemAsync(WEEKLY_PROGRESS_NOTIFICATION_ID);
    }
  } catch (error) {
    console.error('Error canceling weekly progress reminder:', error);
  }
};

export const cancelAllReminders = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all reminders:', error);
  }
};
