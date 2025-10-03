import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStorage } from '../context/StorageContext';

export default function ProgressScreen() {
  const { logs } = useStorage();

  // Calculate stats
  const daysLogged = logs.length;
  
  const totalSteps = logs.reduce((sum, log) => {
    return sum + (parseInt(log.steps || '0') || 0);
  }, 0);
  const avgSteps = daysLogged > 0 ? Math.round(totalSteps / daysLogged) : 0;

  const waterGoalDays = logs.filter(log => (log.water || 0) >= 8).length;
  const waterGoalPercent = daysLogged > 0 ? Math.round((waterGoalDays / daysLogged) * 100) : 0;

  const totalMeals = logs.reduce((sum, log) => {
    const meals = log.meals || {};
    return sum + 
      (meals.breakfast?.length ? 1 : 0) + 
      (meals.lunch?.length ? 1 : 0) + 
      (meals.dinner?.length ? 1 : 0);
  }, 0);

  // Get sorted logs (most recent first)
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const moodEmojis = ['😢', '😕', '😐', '🙂', '😄'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your journey</Text>
      </View>

      {/* Weight Chart Placeholder */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="trending-down" size={24} color="#8B5CF6" />
          <Text style={styles.cardTitle}>Weight Trend</Text>
        </View>
        {logs.filter(log => log.weight).length > 0 ? (
          <View style={styles.weightList}>
            {sortedLogs.filter(log => log.weight).slice(0, 7).map((log, idx) => (
              <View key={idx} style={styles.weightItem}>
                <Text style={styles.weightDate}>{formatDate(log.date)}</Text>
                <Text style={styles.weightValue}>{log.weight} lbs</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.chartPlaceholder}>
            <Ionicons name="stats-chart" size={48} color="#D1D5DB" />
            <Text style={styles.placeholderText}>
              Start logging your weight to see your progress chart
            </Text>
          </View>
        )}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.purpleCard]}>
          <Text style={styles.statValue} data-testid="text-days-logged">{daysLogged}</Text>
          <Text style={styles.statLabel}>Days Logged</Text>
          <Ionicons name="calendar" size={24} color="#8B5CF6" />
        </View>
        <View style={[styles.statCard, styles.greenCard]}>
          <Text style={styles.statValue} data-testid="text-avg-steps">{avgSteps.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Avg Steps</Text>
          <Ionicons name="walk" size={24} color="#10B981" />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.blueCard]}>
          <Text style={styles.statValue} data-testid="text-water-goal">{waterGoalPercent}%</Text>
          <Text style={styles.statLabel}>Water Goal</Text>
          <Ionicons name="water" size={24} color="#3B82F6" />
        </View>
        <View style={[styles.statCard, styles.cyanCard]}>
          <Text style={styles.statValue} data-testid="text-total-meals">{totalMeals}</Text>
          <Text style={styles.statLabel}>Total Meals</Text>
          <Ionicons name="restaurant" size={24} color="#06B6D4" />
        </View>
      </View>

      {/* Recent History */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="time" size={24} color="#6B7280" />
          <Text style={styles.cardTitle}>Recent History</Text>
        </View>
        {sortedLogs.length > 0 ? (
          <View>
            {sortedLogs.map((log, idx) => (
              <View key={idx} style={styles.historyItem} data-testid={`history-item-${idx}`}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>{formatDate(log.date)}</Text>
                  {log.mood !== undefined && (
                    <Text style={styles.historyMood}>{moodEmojis[log.mood]}</Text>
                  )}
                </View>
                <View style={styles.historyDetails}>
                  {log.weight && (
                    <View style={styles.historyTag}>
                      <Ionicons name="scale" size={14} color="#8B5CF6" />
                      <Text style={styles.historyTagText}>{log.weight} lbs</Text>
                    </View>
                  )}
                  {log.steps && (
                    <View style={styles.historyTag}>
                      <Ionicons name="walk" size={14} color="#10B981" />
                      <Text style={styles.historyTagText}>{parseInt(log.steps).toLocaleString()} steps</Text>
                    </View>
                  )}
                  {log.water > 0 && (
                    <View style={styles.historyTag}>
                      <Ionicons name="water" size={14} color="#3B82F6" />
                      <Text style={styles.historyTagText}>{log.water} glasses</Text>
                    </View>
                  )}
                  {log.workouts && log.workouts.length > 0 && (
                    <View style={styles.historyTag}>
                      <Ionicons name="barbell" size={14} color="#EC4899" />
                      <Text style={styles.historyTagText}>{log.workouts.length} workout{log.workouts.length > 1 ? 's' : ''}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No history yet</Text>
            <Text style={styles.emptySubtext}>
              Start logging to see your daily entries here
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  weightList: {
    gap: 8,
  },
  weightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  weightDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  weightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  purpleCard: {
    backgroundColor: '#F3E8FF',
  },
  greenCard: {
    backgroundColor: '#D1FAE5',
  },
  blueCard: {
    backgroundColor: '#DBEAFE',
  },
  cyanCard: {
    backgroundColor: '#CFFAFE',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  historyMood: {
    fontSize: 24,
  },
  historyDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  historyTagText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
});