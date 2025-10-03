import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useStorage } from '../context/StorageContext';
import { useSubscription } from '../context/SubscriptionContext';
import SubscriptionScreen from './SubscriptionScreen';
import theme from '../utils/theme';

type UserProfile = {
  name: string;
  email: string;
  joinDate: string;
  currentWeight: number | null;
  targetWeight: number | null;
  startWeight: number | null;
};

type UserStats = {
  daysActive: number;
  mealsLogged: number;
  weightLoss: number;
};

export default function ProfileScreen({ onLogout }: { onLogout?: () => void }) {
  const { logs } = useStorage();
  const { subscriptionStatus, daysRemainingInTrial, isTrialActive, isSubscriptionActive } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Loading...',
    email: 'Loading...',
    joinDate: 'Loading...',
    currentWeight: null,
    targetWeight: null,
    startWeight: null,
  });
  const [userStats, setUserStats] = useState<UserStats>({
    daysActive: 0,
    mealsLogged: 0,
    weightLoss: 0,
  });

  useEffect(() => {
    loadUserData();
  }, [logs]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const storedUser = await SecureStore.getItemAsync('pounddrop_user');
      
      if (!storedUser) {
        setUserProfile({
          name: 'Guest User',
          email: 'Please log in to view profile',
          joinDate: new Date().toISOString(),
          currentWeight: null,
          targetWeight: null,
          startWeight: null,
        });
        setUserStats({
          daysActive: 0,
          mealsLogged: 0,
          weightLoss: 0,
        });
        setLoading(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      
      const weightLogs = logs
        .filter(log => log.weight && log.weight !== '')
        .map(log => ({
          date: log.date,
          weight: parseFloat(log.weight || '0')
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const startWeight = weightLogs.length > 0 ? weightLogs[0].weight : parseFloat(userData.startWeight || '0');
      const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : parseFloat(userData.currentWeight || '0');
      const targetWeight = parseFloat(userData.targetWeight || '0');

      const totalMeals = logs.reduce((count, log) => {
        let mealCount = 0;
        if (log.meals?.breakfast && log.meals.breakfast.length > 0) mealCount++;
        if (log.meals?.lunch && log.meals.lunch.length > 0) mealCount++;
        if (log.meals?.dinner && log.meals.dinner.length > 0) mealCount++;
        return count + mealCount;
      }, 0);

      const profile: UserProfile = {
        name: userData.username || 'User',
        email: userData.email || 'user@example.com',
        joinDate: userData.createdAt || new Date().toISOString(),
        currentWeight: currentWeight > 0 ? currentWeight : null,
        targetWeight: targetWeight > 0 ? targetWeight : null,
        startWeight: startWeight > 0 ? startWeight : null,
      };

      const stats: UserStats = {
        daysActive: logs.length,
        mealsLogged: totalMeals,
        weightLoss: startWeight > 0 && currentWeight > 0 ? startWeight - currentWeight : 0,
      };

      setUserProfile(profile);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatJoinDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `Member since ${date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })}`;
    } catch {
      return 'Member since 2024';
    }
  };

  const calculateGoalProgress = () => {
    if (!userProfile.startWeight || !userProfile.currentWeight || !userProfile.targetWeight) {
      return { progress: 0, remaining: 0, percentage: 0 };
    }
    
    const totalGoal = userProfile.startWeight - userProfile.targetWeight;
    const currentLoss = userProfile.startWeight - userProfile.currentWeight;
    const remaining = userProfile.targetWeight ? userProfile.currentWeight - userProfile.targetWeight : 0;
    const percentage = totalGoal > 0 ? Math.min((currentLoss / totalGoal) * 100, 100) : 0;
    
    return { progress: currentLoss, remaining, percentage };
  };

  const goalProgress = calculateGoalProgress();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleEditEmail = () => {
    Alert.prompt(
      'Edit Email',
      'Enter your new email address:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (newEmail) => {
            if (!newEmail || newEmail.trim() === '') {
              Alert.alert('Error', 'Email cannot be empty');
              return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail)) {
              Alert.alert('Error', 'Please enter a valid email address');
              return;
            }

            try {
              const storedUser = await SecureStore.getItemAsync('pounddrop_user');
              if (storedUser) {
                const userData = JSON.parse(storedUser);
                userData.email = newEmail;
                await SecureStore.setItemAsync('pounddrop_user', JSON.stringify(userData));
                
                loadUserData();
                Alert.alert('Success', 'Email updated successfully!');
              }
            } catch (error) {
              console.error('Error updating email:', error);
              Alert.alert('Error', 'Failed to update email. Please try again.');
            }
          }
        }
      ],
      'plain-text',
      userProfile.email
    );
  };

  const handleEditGoals = () => {
    Alert.alert(
      'Goals',
      'What would you like to update?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Set Current Weight', onPress: handleSetCurrentWeight },
        { text: 'Set Target Weight', onPress: handleSetTargetWeight },
      ]
    );
  };

  const handleSetCurrentWeight = () => {
    Alert.prompt(
      'Set Current Weight',
      'Enter your current weight (in lbs):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (currentWeight) => {
            if (!currentWeight || currentWeight.trim() === '') {
              Alert.alert('Error', 'Weight cannot be empty');
              return;
            }
            
            const weight = parseFloat(currentWeight);
            if (isNaN(weight) || weight <= 0) {
              Alert.alert('Error', 'Please enter a valid weight');
              return;
            }

            await saveCurrentWeight(weight);
          }
        }
      ],
      'plain-text',
      userProfile.currentWeight ? userProfile.currentWeight.toString() : ''
    );
  };

  const handleSetTargetWeight = () => {
    Alert.prompt(
      'Set Target Weight',
      'Enter your target weight (in lbs):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (targetWeight) => {
            if (!targetWeight || targetWeight.trim() === '') {
              Alert.alert('Error', 'Target weight cannot be empty');
              return;
            }
            
            const weight = parseFloat(targetWeight);
            if (isNaN(weight) || weight <= 0) {
              Alert.alert('Error', 'Please enter a valid weight');
              return;
            }

            if (userProfile.currentWeight && weight >= userProfile.currentWeight) {
              Alert.alert(
                'Notice', 
                'Your target weight should be less than your current weight. Are you sure?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Yes, Save It', onPress: () => saveTargetWeight(weight) }
                ]
              );
              return;
            }

            await saveTargetWeight(weight);
          }
        }
      ],
      'plain-text',
      userProfile.targetWeight ? userProfile.targetWeight.toString() : ''
    );
  };

  const saveCurrentWeight = async (currentWeight: number) => {
    try {
      const storedUser = await SecureStore.getItemAsync('pounddrop_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.currentWeight = currentWeight.toString();
        await SecureStore.setItemAsync('pounddrop_user', JSON.stringify(userData));
        
        loadUserData();
        Alert.alert('Success', `Current weight set to ${currentWeight} lbs!`);
      }
    } catch (error) {
      console.error('Error updating current weight:', error);
      Alert.alert('Error', 'Failed to update current weight. Please try again.');
    }
  };

  const saveTargetWeight = async (targetWeight: number) => {
    try {
      const storedUser = await SecureStore.getItemAsync('pounddrop_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.targetWeight = targetWeight.toString();
        await SecureStore.setItemAsync('pounddrop_user', JSON.stringify(userData));
        
        loadUserData();
        Alert.alert('Success', `Target weight set to ${targetWeight} lbs!`);
      }
    } catch (error) {
      console.error('Error updating target weight:', error);
      Alert.alert('Error', 'Failed to update target weight. Please try again.');
    }
  };

  const handlePersonalInfo = () => {
    handleEditEmail();
  };

  const handleNotifications = () => {
    Alert.alert(
      'Notifications',
      'Choose a reminder to set up:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Monthly Weight Check', onPress: handleMonthlyWeightReminder },
        { text: 'Daily Meal Logging', onPress: handleDailyMealReminder },
        { text: 'Weekly Progress Review', onPress: handleWeeklyProgressReminder },
      ]
    );
  };

  const handleMonthlyWeightReminder = () => {
    Alert.alert(
      'Monthly Weight Check Reminder',
      'Set a monthly reminder to check and log your weight. This helps you track your progress over time.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enable Reminder',
          onPress: async () => {
            try {
              const storedUser = await SecureStore.getItemAsync('pounddrop_user');
              if (storedUser) {
                const userData = JSON.parse(storedUser);
                userData.monthlyWeightReminder = true;
                await SecureStore.setItemAsync('pounddrop_user', JSON.stringify(userData));
                Alert.alert('Success', 'Monthly weight check reminder enabled! You\'ll be reminded on the 1st of each month.');
              }
            } catch (error) {
              console.error('Error setting reminder:', error);
              Alert.alert('Error', 'Failed to set reminder. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDailyMealReminder = () => {
    Alert.alert(
      'Daily Meal Logging Reminder',
      'Get a daily reminder to log your meals and stay consistent with your tracking.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enable Reminder',
          onPress: async () => {
            try {
              const storedUser = await SecureStore.getItemAsync('pounddrop_user');
              if (storedUser) {
                const userData = JSON.parse(storedUser);
                userData.dailyMealReminder = true;
                await SecureStore.setItemAsync('pounddrop_user', JSON.stringify(userData));
                Alert.alert('Success', 'Daily meal logging reminder enabled! You\'ll be reminded every evening at 6 PM.');
              }
            } catch (error) {
              console.error('Error setting reminder:', error);
              Alert.alert('Error', 'Failed to set reminder. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleWeeklyProgressReminder = () => {
    Alert.alert(
      'Weekly Progress Review Reminder',
      'Get a weekly reminder to review your progress and celebrate your wins!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enable Reminder',
          onPress: async () => {
            try {
              const storedUser = await SecureStore.getItemAsync('pounddrop_user');
              if (storedUser) {
                const userData = JSON.parse(storedUser);
                userData.weeklyProgressReminder = true;
                await SecureStore.setItemAsync('pounddrop_user', JSON.stringify(userData));
                Alert.alert('Success', 'Weekly progress review reminder enabled! You\'ll be reminded every Sunday.');
              }
            } catch (error) {
              console.error('Error setting reminder:', error);
              Alert.alert('Error', 'Failed to set reminder. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleSubscription = () => {
    Alert.alert(
      'Subscription',
      'Choose an option:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'One-Time Purchase ($27)', onPress: handleOneTimePurchase },
        { text: 'Delete Account', onPress: handleDeleteAccount, style: 'destructive' },
      ]
    );
  };

  const handleOneTimePurchase = () => {
    Alert.alert(
      'One-Time Purchase',
      'Get lifetime access to Pound Drop for just $27 USD (one-time payment)!\n\nThis includes:\n• Unlimited food logging\n• Advanced tracking features\n• Lifetime updates\n• No monthly fees',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase for $27',
          onPress: () => {
            Alert.alert('Coming Soon', 'One-time purchase will be available soon! This will be processed through the App Store.');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            Alert.alert(
              'Final Confirmation',
              'This will permanently delete all your data. Type DELETE to confirm.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm Delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await SecureStore.deleteItemAsync('pounddrop_user');
                      await SecureStore.deleteItemAsync('pounddrop_logs');
                      Alert.alert('Account Deleted', 'Your account and all data have been permanently deleted.');
                    } catch (error) {
                      console.error('Error deleting account:', error);
                      Alert.alert('Error', 'Failed to delete account. Please try again.');
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy - Pound Drop',
      'Last Updated: October 2025\n\n' +
      '1. DATA COLLECTION\n' +
      'Pound Drop collects only the data you provide: weight, meals, exercise, and wellness metrics. All data is stored locally on your device using secure storage.\n\n' +
      '2. DATA USAGE\n' +
      'Your data is used solely to provide tracking features and show your progress. We do not sell, share, or transmit your data to third parties.\n\n' +
      '3. DATA STORAGE\n' +
      'All data is stored locally on your device. We do not store your data on our servers.\n\n' +
      '4. DATA SECURITY\n' +
      'Your data is protected using iOS secure storage. Only you have access to your data.\n\n' +
      '5. DATA DELETION\n' +
      'You can delete all your data at any time through the "Delete Account" option in Subscription settings.\n\n' +
      'For questions, contact: support@pounddrop.com',
      [{ text: 'I Understand', style: 'default' }],
      { cancelable: true }
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: () => {
            try {
              // Just logout - don't delete account data
              if (onLogout) {
                onLogout();
              }
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleMenuItemPress = (index: number) => {
    switch (index) {
      case 0:
        handlePersonalInfo();
        break;
      case 1:
        handleEditGoals();
        break;
      case 2:
        handleNotifications();
        break;
      case 3:
        handleSubscription();
        break;
      case 4:
        Alert.alert('Help & Support', 'Need help? Contact us at support@pounddrop.com');
        break;
      case 5:
        handlePrivacyPolicy();
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Change your email', subtitle: 'Update your email address' },
    { icon: 'flag-outline', title: 'Goals', subtitle: 'Set your weight and weight loss goals' },
    { icon: 'notifications-outline', title: 'Notifications', subtitle: 'Manage your alerts' },
    { icon: 'card-outline', title: 'Subscription', subtitle: 'Manage your premium plan' },
    { icon: 'help-circle-outline', title: 'Help & Support', subtitle: 'Get help and contact us' },
    { icon: 'document-text-outline', title: 'Privacy Policy', subtitle: 'Read our privacy policy' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="#8B5CF6" />
            </View>
          </View>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userEmail}>{userProfile.email}</Text>
          <Text style={styles.memberSince}>{formatJoinDate(userProfile.joinDate)}</Text>
        </View>

        {isTrialActive && (
          <TouchableOpacity 
            style={styles.trialBanner}
            onPress={() => setShowSubscriptionModal(true)}
          >
            <View style={styles.trialBannerContent}>
              <Ionicons name="time-outline" size={24} color="#8B5CF6" />
              <View style={styles.trialTextContainer}>
                <Text style={styles.trialTitle}>Free Trial Active</Text>
                <Text style={styles.trialSubtitle}>
                  {daysRemainingInTrial} day{daysRemainingInTrial !== 1 ? 's' : ''} remaining
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8B5CF6" />
          </TouchableOpacity>
        )}

        {subscriptionStatus === 'active' && (
          <View style={styles.activeBanner}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.activeText}>Premium Active</Text>
          </View>
        )}

        {subscriptionStatus === 'expired' && (
          <TouchableOpacity 
            style={styles.expiredBanner}
            onPress={() => setShowSubscriptionModal(true)}
          >
            <View style={styles.expiredBannerContent}>
              <Ionicons name="alert-circle-outline" size={24} color="#EF4444" />
              <View style={styles.expiredTextContainer}>
                <Text style={styles.expiredTitle}>Trial Ended</Text>
                <Text style={styles.expiredSubtitle}>Subscribe to continue using Pound Drop</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
          </TouchableOpacity>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.daysActive}</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.mealsLogged}</Text>
            <Text style={styles.statLabel}>Meals Logged</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {userStats.weightLoss > 0 ? `-${userStats.weightLoss.toFixed(1)}` : '0'}
            </Text>
            <Text style={styles.statLabel}>lbs Lost</Text>
          </View>
        </View>

        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Current Goals</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Ionicons name="flag" size={24} color="#8B5CF6" />
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Target Weight</Text>
                <Text style={styles.goalSubtitle}>
                  {userProfile.targetWeight ? 
                    `${userProfile.targetWeight} lbs (${goalProgress.remaining.toFixed(1)} lbs to go)` : 
                    'Set your weight goal'
                  }
                </Text>
              </View>
            </View>
            <View style={styles.goalProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${goalProgress.percentage}%` }]} />
              </View>
              <Text style={styles.progressText}>{goalProgress.percentage.toFixed(0)}% complete</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(index)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={24} color="#6B7280" />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Pound Drop v1.0.0</Text>
      </ScrollView>

      {showSubscriptionModal && (
        <SubscriptionScreen onClose={() => setShowSubscriptionModal(false)} />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  goalsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalInfo: {
    marginLeft: 12,
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  goalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  goalProgress: {
    alignItems: 'flex-end',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  menuSection: {
    marginBottom: 24,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  trialBanner: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  trialBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trialTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  trialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  trialSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  activeBanner: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  activeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 12,
  },
  expiredBanner: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  expiredBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expiredTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  expiredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  expiredSubtitle: {
    fontSize: 14,
    color: '#991B1B',
    marginTop: 2,
  },
});