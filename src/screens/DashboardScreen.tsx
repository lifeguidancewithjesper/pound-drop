import { View, Text, StyleSheet, ScrollView, Image, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStorage } from '../context/StorageContext';
import { useState, useEffect } from 'react';

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
  const { getTodayLog, username, isFirstLogin, getUserInfo } = useStorage();
  const todayLog = getTodayLog();
  const currentTime = useLiveTime();

  useEffect(() => {
    getUserInfo();
  }, []);

  const weight = todayLog?.weight || '--';
  const steps = parseInt(todayLog?.steps || '0');
  const water = todayLog?.water || 0;
  const stepsProgress = Math.min((steps / 10000) * 100, 100);
  const waterProgress = Math.min((water / 8) * 100, 100);
  
  const moodEmojis = ['😢', '😕', '😐', '🙂', '😄'];
  const moodText = todayLog?.mood !== undefined ? moodEmojis[todayLog.mood] : 'Not logged';

  const hasBreakfast = todayLog?.meals?.breakfast && todayLog.meals.breakfast.length > 0;
  const hasLunch = todayLog?.meals?.lunch && todayLog.meals.lunch.length > 0;
  const hasDinner = todayLog?.meals?.dinner && todayLog.meals.dinner.length > 0;
  const mealsLogged = (hasBreakfast ? 1 : 0) + (hasLunch ? 1 : 0) + (hasDinner ? 1 : 0);

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
      <ScrollView style={styles.container}>
        {/* Professional Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brandContainer}>
              <Image 
                source={logo} 
                style={styles.logo}
                data-testid="img-logo"
              />
              <View style={styles.brandText}>
                <Text style={styles.brandName} data-testid="text-brand">Pounddrop</Text>
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
                {isFirstLogin ? 'Welcome' : 'Welcome back'}, {username}!
              </Text>
            </View>
          )}
        </View>

        {/* 2-Column Grid Layout */}
        <View style={styles.gridContainer}>
          {/* Row 1: Steps + Water */}
          <View style={[styles.card, styles.greenCard, styles.halfWidth]}>
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
          </View>

          <View style={[styles.card, styles.blueCard, styles.halfWidth]}>
            <View style={styles.cardHeader}>
              <Ionicons name="water-outline" size={28} color="#fff" />
              <Text style={styles.cardTitle}>Water</Text>
            </View>
            <Text style={styles.cardValue} data-testid="text-water-value">{water} / 8</Text>
            <Text style={styles.cardSubtext}>glasses today</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${waterProgress}%` }]} />
            </View>
          </View>

          {/* Row 2: Weight + Meals */}
          <View style={[styles.card, styles.purpleCard, styles.halfWidth]}>
            <View style={styles.cardHeader}>
              <Ionicons name="scale-outline" size={28} color="#fff" />
              <Text style={styles.cardTitle}>Weight</Text>
            </View>
            <Text style={styles.cardValue} data-testid="text-weight-value">{weight}</Text>
            <Text style={styles.cardSubtext}>
              {weight === '--' ? 'Not logged yet' : 'lbs today'}
            </Text>
          </View>

          <View style={[styles.card, styles.cyanCard, styles.halfWidth]}>
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
          </View>

          {/* Row 3: Mood + Measurements (if logged) */}
          <View style={[styles.card, styles.redCard, styles.halfWidth]}>
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
          </View>

          {todayLog?.measurements ? (
            <View style={[styles.card, styles.orangeCard, styles.halfWidth]}>
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
            </View>
          ) : (
            <View style={[styles.card, styles.orangeCard, styles.halfWidth]}>
              <View style={styles.cardHeader}>
                <Ionicons name="resize-outline" size={28} color="#fff" />
                <Text style={styles.cardTitle}>Measurements</Text>
              </View>
              <Text style={styles.cardValue}>--</Text>
              <Text style={styles.cardSubtext}>Not logged yet</Text>
            </View>
          )}

          {/* Row 4: Workouts (full width if logged) */}
          {todayLog?.workouts && todayLog.workouts.length > 0 && (
            <View style={[styles.card, styles.pinkCard, styles.fullWidth]}>
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
            </View>
          )}
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
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginTop: 2,
  },
  welcomeContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B5CF6',
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
    backgroundColor: '#8B5CF6',
  },
  greenCard: {
    backgroundColor: '#10B981',
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
    backgroundColor: '#F59E0B',
  },
  pinkCard: {
    backgroundColor: '#EC4899',
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
  bottomPadding: {
    height: 20,
  },
});