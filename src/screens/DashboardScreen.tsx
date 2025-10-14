import { View, Text, StyleSheet, ScrollView, Image, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useStorage } from '../context/StorageContext';
import { useState, useEffect, useCallback, useRef } from 'react';

// Import logo
import logo from '../../assets/logo-pound-drop.png';

// Hook for live date/time
function useLiveTime() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return time;
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { getTodayLog, username, isFirstLogin, getUserInfo, weightUnit, calculateCalories, calculateMacros, logs, getChallengeStartDate, startChallenge, getCurrentChallengeDay } = useStorage();
  const todayLog = getTodayLog();
  const currentTime = useLiveTime();
  const [refreshKey, setRefreshKey] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [sectionPositions, setSectionPositions] = useState({
    meals: 0,
    mood: 0,
    challenge: 0,
    weekly: 0,
  });

  useEffect(() => {
    getUserInfo();
  }, []);

  // Force re-render when screen is focused (for challenge reset)
  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  // Calculate streak
  const calculateStreak = () => {
    if (logs.length === 0) return 0;
    
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      
      // Calculate expected date for this streak position
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - streak);
      
      const daysDiff = Math.floor((expectedDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();
  const weight = todayLog?.weight || '--';
  const steps = parseInt(todayLog?.steps || '0');
  const water = todayLog?.water || 0;
  const stepsProgress = Math.min((steps / 10000) * 100, 100);
  const waterProgress = Math.min((water / 8) * 100, 100);

  // Scroll to section function
  const scrollToSection = (section: keyof typeof sectionPositions) => {
    const yPosition = sectionPositions[section];
    if (scrollViewRef.current && yPosition) {
      scrollViewRef.current.scrollTo({ y: yPosition - 80, animated: true });
    }
  };
  
  const moodEmojis = ['😢', '😕', '😐', '🙂', '😄'];
  const moodText = todayLog?.mood !== undefined ? moodEmojis[todayLog.mood] : 'Not logged';

  const hasBreakfast = todayLog?.meals?.breakfast && todayLog.meals.breakfast.length > 0;
  const hasLunch = todayLog?.meals?.lunch && todayLog.meals.lunch.length > 0;
  const hasDinner = todayLog?.meals?.dinner && todayLog.meals.dinner.length > 0;
  const mealsLogged = (hasBreakfast ? 1 : 0) + (hasLunch ? 1 : 0) + (hasDinner ? 1 : 0);
  
  const calorieData = todayLog?.meals ? calculateCalories(todayLog.meals) : { total: 0, breakfast: 0, lunch: 0, dinner: 0 };
  const macroData = todayLog?.meals ? calculateMacros(todayLog.meals) : { total: { protein: 0, carbs: 0, fat: 0 }, breakfast: { protein: 0, carbs: 0, fat: 0 }, lunch: { protein: 0, carbs: 0, fat: 0 }, dinner: { protein: 0, carbs: 0, fat: 0 } };
  
  // Get latest meal time for display
  const latestMealTime = hasDinner ? todayLog?.mealTimes?.dinner : 
                         hasLunch ? todayLog?.mealTimes?.lunch : 
                         hasBreakfast ? todayLog?.mealTimes?.breakfast : null;

  // Format date and time
  const dateStr = currentTime.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
  const timeStr = currentTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView ref={scrollViewRef} style={styles.container}>
        {/* Header with Elegant Wave */}
        <View style={styles.headerWrapper}>
          <View style={styles.waveBackground} />
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.brandContainer}>
                <Image 
                  source={logo} 
                  style={styles.logo}
                  data-testid="img-logo"
                />
                <View style={styles.brandText}>
                  <Text style={styles.brandName} data-testid="text-brand">Pound Drop</Text>
                  <Text style={styles.brandTagline}>Your Weight Loss Journey</Text>
                </View>
              </View>
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateText} data-testid="text-date">{dateStr}</Text>
                <Text style={styles.timeText} data-testid="text-time">{timeStr}</Text>
              </View>
            </View>
            {username && (
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText} data-testid="text-welcome">
                  {isFirstLogin ? '🎉 Welcome' : '👋 Welcome back'}, {username}!
                </Text>
                {streak > 0 && (
                  <View style={styles.streakBadge} data-testid="streak-badge">
                    <Ionicons name="flame" size={16} color="#F97316" />
                    <Text style={styles.streakText}>{streak} day streak!</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* 2-Column Grid Layout */}
        <View style={styles.gridContainer}>
          {/* Row 1: Steps + Water */}
          <TouchableOpacity 
            style={[styles.card, styles.greenCard, styles.halfWidth]} 
            onPress={() => navigation.navigate('Wellness' as never, { tab: 'steps' } as never)}
            activeOpacity={0.8}
            data-testid="card-steps"
          >
            <View style={styles.cardHeader}>
              <Ionicons name="walk-outline" size={28} color="#fff" />
              <Text style={styles.cardTitle}>Steps</Text>
            </View>
            <Text style={styles.cardValue} data-testid="text-steps-value">
              {steps.toLocaleString()}
            </Text>
            <Text style={styles.cardSubtext}>Goal: 10,000</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${stepsProgress}%` }]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.blueCard, styles.halfWidth]} 
            onPress={() => navigation.navigate('Wellness' as never, { tab: 'water' } as never)}
            activeOpacity={0.8}
            data-testid="card-water"
          >
            <View style={styles.cardHeader}>
              <Ionicons name="water-outline" size={28} color="#fff" />
              <Text style={styles.cardTitle}>Water</Text>
            </View>
            <Text style={styles.cardValue} data-testid="text-water-value">{water} / 8</Text>
            <Text style={styles.cardSubtext}>glasses today</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${waterProgress}%` }]} />
            </View>
          </TouchableOpacity>

          {/* Row 2: Weight + Meals */}
          <TouchableOpacity 
            style={[styles.card, styles.purpleCard, styles.halfWidth]} 
            onPress={() => navigation.navigate('Wellness' as never, { tab: 'weight' } as never)}
            activeOpacity={0.8}
            data-testid="card-weight"
          >
            <View style={styles.cardHeader}>
              <Ionicons name="scale-outline" size={28} color="#fff" />
              <Text style={styles.cardTitle}>Weight</Text>
            </View>
            <Text style={styles.cardValue} data-testid="text-weight-value">{weight}</Text>
            <Text style={styles.cardSubtext}>
              {weight === '--' ? 'Not logged yet' : `${weightUnit} today`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.cyanCard, styles.halfWidth]} 
            onPress={() => navigation.navigate('Wellness' as never, { tab: 'meals' } as never)}
            activeOpacity={0.8}
            data-testid="card-meals"
            onLayout={(event) => {
              const { y } = event.nativeEvent.layout;
              setSectionPositions(prev => ({ ...prev, meals: y }));
            }}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="restaurant-outline" size={28} color="#fff" />
              <Text style={styles.cardTitle}>Meals</Text>
            </View>
            <Text style={styles.cardValue} data-testid="text-meals-value">{mealsLogged} / 3</Text>
            <View style={styles.mealDots}>
              <Ionicons 
                name={hasBreakfast ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color="#fff" 
              />
              <Ionicons 
                name={hasLunch ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color="#fff" 
              />
              <Ionicons 
                name={hasDinner ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color="#fff" 
              />
            </View>
            {calorieData.total > 0 && (
              <>
                <View style={styles.calorieRow}>
                  <Ionicons name="flame" size={16} color="#fff" />
                  <Text style={styles.calorieText} data-testid="text-total-calories">{calorieData.total} cal</Text>
                </View>
                <View style={styles.macroRow}>
                  <Text style={styles.macroText} data-testid="text-total-macros">
                    P: {macroData.total.protein}g | C: {macroData.total.carbs}g | F: {macroData.total.fat}g
                  </Text>
                </View>
              </>
            )}
            {(todayLog?.mealTimes?.breakfast || todayLog?.mealTimes?.lunch || todayLog?.mealTimes?.dinner) && (
              <View style={styles.mealTimesContainer}>
                {todayLog?.mealTimes?.breakfast && (
                  <View style={styles.mealTimeItem}>
                    <Text style={styles.mealTimeLabel}>B:</Text>
                    <Text style={styles.mealTimeValue}>{todayLog.mealTimes.breakfast}</Text>
                  </View>
                )}
                {todayLog?.mealTimes?.lunch && (
                  <View style={styles.mealTimeItem}>
                    <Text style={styles.mealTimeLabel}>L:</Text>
                    <Text style={styles.mealTimeValue}>{todayLog.mealTimes.lunch}</Text>
                  </View>
                )}
                {todayLog?.mealTimes?.dinner && (
                  <View style={styles.mealTimeItem}>
                    <Text style={styles.mealTimeLabel}>D:</Text>
                    <Text style={styles.mealTimeValue}>{todayLog.mealTimes.dinner}</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>

          {/* Row 3: Mood + Measurements (if logged) */}
          <TouchableOpacity 
            style={[styles.card, styles.redCard, styles.halfWidth]} 
            onPress={() => navigation.navigate('Wellness' as never, { tab: 'mood' } as never)}
            activeOpacity={0.8}
            data-testid="card-mood"
            onLayout={(event) => {
              const { y } = event.nativeEvent.layout;
              setSectionPositions(prev => ({ ...prev, mood: y }));
            }}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="happy-outline" size={28} color="#fff" />
              <Text style={styles.cardTitle}>Mood</Text>
            </View>
            <Text style={styles.cardValueLarge} data-testid="text-mood-value">
              {todayLog?.mood !== undefined ? moodEmojis[todayLog.mood] : '😐'}
            </Text>
            <Text style={styles.cardSubtext}>{moodText}</Text>
            {todayLog?.moodDetails?.energyLevel && (
              <View style={styles.energyRow}>
                <Ionicons name="flash" size={16} color="#fff" />
                <Text style={styles.energyText}>Energy: {todayLog.moodDetails.energyLevel}/10</Text>
              </View>
            )}
          </TouchableOpacity>

          {todayLog?.measurements ? (
            <TouchableOpacity 
              style={[styles.card, styles.orangeCard, styles.halfWidth]} 
              onPress={() => navigation.navigate('Wellness' as never, { tab: 'measurements' } as never)}
              activeOpacity={0.8}
              data-testid="card-measurements"
            >
              <View style={styles.cardHeader}>
                <Ionicons name="resize-outline" size={28} color="#fff" />
                <Text style={styles.cardTitle}>Measurements</Text>
              </View>
              <View style={styles.measurementsCompact}>
                {todayLog.measurements.waist && (
                  <Text style={styles.measurementSmall}>Waist: {todayLog.measurements.waist}"</Text>
                )}
                {todayLog.measurements.hips && (
                  <Text style={styles.measurementSmall}>Hips: {todayLog.measurements.hips}"</Text>
                )}
                {todayLog.measurements.chest && (
                  <Text style={styles.measurementSmall}>Chest: {todayLog.measurements.chest}"</Text>
                )}
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.card, styles.orangeCard, styles.halfWidth]} 
              onPress={() => navigation.navigate('Wellness' as never, { tab: 'measurements' } as never)}
              activeOpacity={0.8}
              data-testid="card-measurements"
            >
              <View style={styles.cardHeader}>
                <Ionicons name="resize-outline" size={28} color="#fff" />
                <Text style={styles.cardTitle}>Measurements</Text>
              </View>
              <Text style={styles.cardValue}>--</Text>
              <Text style={styles.cardSubtext}>Not logged yet</Text>
            </TouchableOpacity>
          )}

          {/* Row 4: Workouts (full width if logged) */}
          {todayLog?.workouts && todayLog.workouts.length > 0 && (
            <TouchableOpacity 
              style={[styles.card, styles.pinkCard, styles.fullWidth]} 
              onPress={() => navigation.navigate('Wellness' as never, { tab: 'workout' } as never)}
              activeOpacity={0.8}
              data-testid="card-workouts"
            >
              <View style={styles.cardHeader}>
                <Ionicons name="barbell-outline" size={28} color="#fff" />
                <Text style={styles.cardTitle}>Today's Workouts ({todayLog.workouts.length})</Text>
              </View>
              <View style={styles.workoutsGrid}>
                {todayLog.workouts.map((workout, idx) => (
                  <View key={idx} style={styles.workoutChip}>
                    <Text style={styles.workoutText}>
                      {workout.type} • {workout.duration}min
                      {workout.calories ? ` • ${workout.calories}cal` : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* 4-Week Transformation Challenge */}
        <View 
          style={styles.challengeSection}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            setSectionPositions(prev => ({ ...prev, challenge: y }));
          }}
        >
          {(() => {
            const challengeDay = getCurrentChallengeDay();
            const weekNumber = challengeDay ? Math.ceil(challengeDay / 7) : 0;
            const progressPercentage = challengeDay ? (challengeDay / 28) * 100 : 0;
            
            // Weekly messages
            const weeklyMessages = [
              "🌟 Foundation Week - Building healthy habits",
              "💪 Momentum Week - You're getting stronger!",
              "🔥 Power Week - Halfway there, keep pushing!",
              "🏆 Final Push - The finish line is near!"
            ];
            
            const weekMessage = weekNumber > 0 ? weeklyMessages[weekNumber - 1] : "";

            return (
              <View style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                  <View>
                    <Text style={styles.challengeTitle}>4-Week Transformation Challenge</Text>
                    {challengeDay ? (
                      <Text style={styles.challengeSubtitle}>{weekMessage}</Text>
                    ) : (
                      <Text style={styles.challengeSubtitle}>Start your journey today!</Text>
                    )}
                  </View>
                  <Ionicons name="fitness" size={32} color="#9333EA" />
                </View>

                {challengeDay ? (
                  <>
                    <View style={styles.challengeDayDisplay}>
                      <Text style={styles.challengeDayText}>Day {challengeDay} of 28</Text>
                      <Text style={styles.challengeWeekText}>Week {weekNumber}</Text>
                    </View>
                    <View style={styles.challengeProgressBar}>
                      <View style={[styles.challengeProgressFill, { width: `${progressPercentage}%` }]} />
                    </View>
                    {challengeDay === 28 && (
                      <View style={styles.challengeCompleteBanner}>
                        <Ionicons name="trophy" size={24} color="#F59E0B" />
                        <Text style={styles.challengeCompleteText}>🎉 Challenge Complete! You did it!</Text>
                      </View>
                    )}
                    {challengeDay === 7 || challengeDay === 14 || challengeDay === 21 ? (
                      <View style={styles.challengeWeekBanner}>
                        <Ionicons name="ribbon" size={20} color="#9333EA" />
                        <Text style={styles.challengeWeekText}>Week {Math.floor(challengeDay / 7)} Complete! 🎊</Text>
                      </View>
                    ) : null}
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.challengeStartButton}
                    onPress={startChallenge}
                    data-testid="button-start-challenge"
                  >
                    <Ionicons name="rocket" size={20} color="#fff" />
                    <Text style={styles.challengeStartButtonText}>Start Challenge</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })()}
        </View>

        {/* Weekly Summary Card */}
        <View 
          style={styles.weeklySummarySection}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            setSectionPositions(prev => ({ ...prev, weekly: y }));
          }}
        >
          <View style={styles.weeklySummaryCard}>
            <View style={styles.weeklySummaryHeader}>
              <Text style={styles.weeklySummaryTitle}>📊 This Week's Progress</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Progress' as never)}
                data-testid="button-view-progress"
              >
                <Text style={styles.viewDetailsLink}>View Details</Text>
              </TouchableOpacity>
            </View>
            {(() => {
              // Calculate week stats
              const oneWeekAgo = new Date();
              oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
              
              const weekLogs = logs.filter(log => new Date(log.date) >= oneWeekAgo);
              const daysLogged = weekLogs.length;
              
              // Get weights in chronological order (earliest to latest)
              const weekWeightsWithDate = weekLogs
                .filter(log => log.weight)
                .map(log => ({ weight: parseFloat(log.weight!), date: new Date(log.date) }))
                .sort((a, b) => a.date.getTime() - b.date.getTime());
              
              const weekChange = weekWeightsWithDate.length >= 2 
                ? (weekWeightsWithDate[weekWeightsWithDate.length - 1].weight - weekWeightsWithDate[0].weight).toFixed(1)
                : '0.0';
              
              const totalWorkouts = weekLogs.reduce((sum, log) => 
                sum + (log.workouts?.length || 0), 0
              );
              
              return (
                <View>
                  <View style={styles.weekStatsGrid}>
                    <View style={styles.weekStatItem}>
                      <Text style={styles.weekStatValue}>{daysLogged}/7</Text>
                      <Text style={styles.weekStatLabel}>Days Logged</Text>
                    </View>
                    <View style={styles.weekStatItem}>
                      <Text style={[styles.weekStatValue, { color: parseFloat(weekChange) < 0 ? '#16A34A' : '#6B7280' }]}>
                        {parseFloat(weekChange) > 0 ? '+' : ''}{weekChange} {weightUnit}
                      </Text>
                      <Text style={styles.weekStatLabel}>Weight Change</Text>
                    </View>
                    <View style={styles.weekStatItem}>
                      <Text style={styles.weekStatValue}>{totalWorkouts}</Text>
                      <Text style={styles.weekStatLabel}>Workouts</Text>
                    </View>
                  </View>
                  
                  {daysLogged >= 5 && (
                    <View style={styles.weeklyWinBanner}>
                      <Ionicons name="trophy" size={20} color="#F59E0B" />
                      <Text style={styles.weeklyWinText}>
                        Amazing! {daysLogged} days of consistent logging this week! 🎉
                      </Text>
                    </View>
                  )}
                  
                  {parseFloat(weekChange) < 0 && (
                    <View style={styles.weeklyWinBanner}>
                      <Ionicons name="trending-down" size={20} color="#16A34A" />
                      <Text style={styles.weeklyWinText}>
                        You lost {Math.abs(parseFloat(weekChange))} {weightUnit} this week! Keep it up! 💪
                      </Text>
                    </View>
                  )}
                </View>
              );
            })()}
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.quickActionsTitle}>🚀 Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('MealPlanner' as never)}
              activeOpacity={0.8}
              data-testid="button-meal-planner"
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="restaurant" size={32} color="#9333EA" />
              </View>
              <Text style={styles.quickActionTitle}>Meal Planner</Text>
              <Text style={styles.quickActionSubtitle}>Pre-built Pound Drop meals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('PersonalizedWorkout' as never)}
              activeOpacity={0.8}
              data-testid="button-personalized-workout"
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="fitness" size={32} color="#F59E0B" />
              </View>
              <Text style={styles.quickActionTitle}>Personalized Plans</Text>
              <Text style={styles.quickActionSubtitle}>30-min natural workouts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('RestaurantGuide' as never)}
              activeOpacity={0.8}
              data-testid="button-restaurant-guide"
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="restaurant-outline" size={32} color="#16A34A" />
              </View>
              <Text style={styles.quickActionTitle}>Dining Out Guide</Text>
              <Text style={styles.quickActionSubtitle}>Eat out without guilt</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Wellness' as never, { tab: 'mood' } as never)}
              activeOpacity={0.8}
              data-testid="button-track-wins"
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="trophy" size={32} color="#F59E0B" />
              </View>
              <Text style={styles.quickActionTitle}>Track Wins</Text>
              <Text style={styles.quickActionSubtitle}>Daily victories & progress</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('FoodSwap' as never)}
              activeOpacity={0.8}
              data-testid="button-food-swaps"
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="swap-horizontal" size={32} color="#8B5CF6" />
              </View>
              <Text style={styles.quickActionTitle}>Food Swaps</Text>
              <Text style={styles.quickActionSubtitle}>30+ healthy alternatives</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Wellness' as never, { tab: 'mood' } as never)}
              activeOpacity={0.8}
              data-testid="button-check-cravings"
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="candy" size={32} color="#DB2777" />
              </View>
              <Text style={styles.quickActionTitle}>Check Cravings</Text>
              <Text style={styles.quickActionSubtitle}>Track & manage urges</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerWrapper: {
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  waveBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: '#DBEAFE',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  brandText: {
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0369A1',
    marginTop: 2,
  },
  welcomeContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0369A1',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  halfWidth: {
    width: '48%',
  },
  fullWidth: {
    width: '100%',
  },
  purpleCard: {
    backgroundColor: '#9333EA',
  },
  greenCard: {
    backgroundColor: '#16A34A',
  },
  blueCard: {
    backgroundColor: '#3B82F6',
  },
  cyanCard: {
    backgroundColor: '#06B6D4',
  },
  redCard: {
    backgroundColor: '#EF4444',
  },
  orangeCard: {
    backgroundColor: '#FACC15',
  },
  pinkCard: {
    backgroundColor: '#DB2777',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardValueLarge: {
    fontSize: 48,
    color: '#fff',
    marginVertical: 8,
  },
  cardSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 5,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  mealDots: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  measurementsCompact: {
    gap: 6,
  },
  measurementSmall: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  workoutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  workoutChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  workoutText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  energyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  energyText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  calorieText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  macroRow: {
    marginTop: 6,
  },
  macroText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  mealTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  mealTimeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  mealTimesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
    flexWrap: 'wrap',
  },
  mealTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  mealTimeLabel: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
    opacity: 0.9,
  },
  mealTimeValue: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },
  weeklySummarySection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  weeklySummaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weeklySummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weeklySummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  viewDetailsLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9333EA',
  },
  weekStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  weekStatItem: {
    alignItems: 'center',
  },
  weekStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  weekStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  weeklyWinBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginTop: 8,
  },
  weeklyWinText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  quickActionsSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
  challengeSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  challengeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#9333EA',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  challengeSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  challengeDayDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeDayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9333EA',
  },
  challengeWeekText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  challengeProgressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  challengeProgressFill: {
    height: '100%',
    backgroundColor: '#9333EA',
    borderRadius: 6,
  },
  challengeStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9333EA',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  challengeStartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  challengeCompleteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  challengeCompleteText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  challengeWeekBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
});
