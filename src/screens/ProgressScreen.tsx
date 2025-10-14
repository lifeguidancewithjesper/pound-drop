import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStorage } from '../context/StorageContext';

const { width } = Dimensions.get('window');

export default function ProgressScreen({ navigation }: { navigation: any }) {
  const { logs, getTodayLog, weightUnit, getStartingWeight, getWeightLoss, getMilestone, getHighestMilestone } = useStorage();
  
  const [milestones, setMilestones] = useState<Array<{weight: number; achieved: boolean; color: string; icon: string}>>([]);
  const [stats, setStats] = useState({
    currentWeight: '0',
    totalLoss: 0,
    streak: 0,
    logsCount: 0,
  });

  useEffect(() => {
    calculateProgress();
  }, [logs]);

  const calculateProgress = () => {
    const todayLog = getTodayLog();
    const currentWeight = todayLog?.weight ? parseFloat(todayLog.weight) : 0;
    const totalLoss = currentWeight > 0 ? getWeightLoss(currentWeight) : 0;
    const currentMilestone = getMilestone(totalLoss);

    // Calculate streak
    const streak = calculateStreak();

    setStats({
      currentWeight: currentWeight > 0 ? `${currentWeight.toFixed(1)} ${weightUnit}` : 'Not logged',
      totalLoss,
      streak,
      logsCount: logs.length,
    });

    // Set milestones with achievement status
    setMilestones([
      { weight: 2, achieved: totalLoss >= 2, color: '#FACC15', icon: 'trophy' },
      { weight: 5, achieved: totalLoss >= 5, color: '#16A34A', icon: 'trophy' },
      { weight: 10, achieved: totalLoss >= 10, color: '#9333EA', icon: 'trophy' },
      { weight: 15, achieved: totalLoss >= 15, color: '#DB2777', icon: 'trophy' },
      { weight: 20, achieved: totalLoss >= 20, color: '#DC2626', icon: 'trophy' },
    ]);
  };

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

  const getRecentLogs = () => {
    return [...logs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Clean Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Progress Journey</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Stats Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>🏆</Text>
          <Text style={styles.heroTitle}>Amazing Progress!</Text>
          <Text style={styles.heroSubtitle}>Day {stats.logsCount} of your journey</Text>
          
          <View style={styles.heroStatsContainer}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{stats.currentWeight}</Text>
              <Text style={styles.heroStatLabel}>Current Weight</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>-{stats.totalLoss.toFixed(1)} {weightUnit}</Text>
              <Text style={styles.heroStatLabel}>Total Loss</Text>
            </View>
          </View>
        </View>

        {/* Milestone Trophies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Weight Loss Milestones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.milestonesScroll}>
            {milestones.map((milestone, index) => (
              <View 
                key={index} 
                style={[
                  styles.milestoneCard,
                  { backgroundColor: milestone.achieved ? milestone.color : '#E5E7EB' }
                ]}
              >
                <Ionicons 
                  name={milestone.icon as any} 
                  size={32} 
                  color={milestone.achieved ? '#FFFFFF' : '#9CA3AF'} 
                />
                <Text style={[
                  styles.milestoneWeight,
                  { color: milestone.achieved ? '#FFFFFF' : '#9CA3AF' }
                ]}>
                  {milestone.weight} {weightUnit}
                </Text>
                {milestone.achieved && (
                  <View style={styles.checkmarkBadge}>
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Weight Progress Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Weight Progress Chart</Text>
          <View style={styles.chartCard}>
            {(() => {
              const weightLogs = [...logs]
                .filter(log => log.weight)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(-14); // Last 14 days
              
              if (weightLogs.length < 2) {
                return (
                  <View style={styles.chartEmpty}>
                    <Ionicons name="analytics-outline" size={48} color="#9CA3AF" />
                    <Text style={styles.chartEmptyText}>Log weight for at least 2 days to see your progress chart</Text>
                  </View>
                );
              }

              const weights = weightLogs.map(log => parseFloat(log.weight!));
              const maxWeight = Math.max(...weights);
              const minWeight = Math.min(...weights);
              const range = maxWeight - minWeight || 1;
              const chartHeight = 150;
              const chartWidth = width - 96; // Increased padding to prevent overflow
              const pointSpacing = weightLogs.length > 1 ? chartWidth / (weightLogs.length - 1) : 0;

              return (
                <View>
                  <View style={[styles.chartArea, { height: chartHeight }]}>
                    {/* Y-axis labels */}
                    <View style={styles.yAxisLabels}>
                      <Text style={styles.yAxisLabel}>{maxWeight.toFixed(1)}</Text>
                      <Text style={styles.yAxisLabel}>{((maxWeight + minWeight) / 2).toFixed(1)}</Text>
                      <Text style={styles.yAxisLabel}>{minWeight.toFixed(1)}</Text>
                    </View>
                    
                    {/* Chart line and points */}
                    <View style={styles.chartContent}>
                      {/* Grid lines */}
                      <View style={[styles.gridLine, { top: 0 }]} />
                      <View style={[styles.gridLine, { top: chartHeight / 2 }]} />
                      <View style={[styles.gridLine, { bottom: 0 }]} />
                      
                      {/* Line segments */}
                      {weightLogs.map((log, index) => {
                        if (index === 0) return null;
                        const prevWeight = parseFloat(weightLogs[index - 1].weight!);
                        const currWeight = parseFloat(log.weight!);
                        const prevY = chartHeight - ((prevWeight - minWeight) / range) * chartHeight;
                        const currY = chartHeight - ((currWeight - minWeight) / range) * chartHeight;
                        const x1 = (index - 1) * pointSpacing;
                        const x2 = index * pointSpacing;
                        
                        const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(currY - prevY, 2));
                        const angle = Math.atan2(currY - prevY, x2 - x1) * (180 / Math.PI);
                        
                        return (
                          <View
                            key={`line-${index}`}
                            style={[
                              styles.chartLine,
                              {
                                left: x1,
                                top: prevY,
                                width: lineLength,
                                transform: [{ rotate: `${angle}deg` }],
                              },
                            ]}
                          />
                        );
                      })}
                      
                      {/* Data points */}
                      {weightLogs.map((log, index) => {
                        const weight = parseFloat(log.weight!);
                        const y = chartHeight - ((weight - minWeight) / range) * chartHeight;
                        const x = index * pointSpacing;
                        const isLowest = weight === minWeight;
                        
                        return (
                          <View
                            key={`point-${index}`}
                            style={[
                              styles.chartPoint,
                              {
                                left: x - 6,
                                top: y - 6,
                                backgroundColor: isLowest ? '#16A34A' : '#9333EA',
                              },
                            ]}
                          >
                            {isLowest && (
                              <Ionicons name="trophy" size={8} color="#fff" />
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                  
                  {/* X-axis labels */}
                  <View style={styles.xAxisLabels}>
                    {weightLogs.map((log, index) => {
                      if (index % Math.ceil(weightLogs.length / 4) !== 0 && index !== weightLogs.length - 1) return null;
                      return (
                        <Text key={`x-${index}`} style={styles.xAxisLabel}>
                          {formatDate(log.date)}
                        </Text>
                      );
                    })}
                  </View>
                  
                  {/* Chart legend */}
                  <View style={styles.chartLegend}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#9333EA' }]} />
                      <Text style={styles.legendText}>Weight</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#16A34A' }]} />
                      <Text style={styles.legendText}>Lowest</Text>
                    </View>
                  </View>
                </View>
              );
            })()}
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Quick Stats</Text>
          <View style={styles.quickStatsGrid}>
            <View style={[styles.quickStatCard, { backgroundColor: '#9333EA' }]}>
              <Ionicons name="flame" size={28} color="#FFFFFF" />
              <Text style={styles.quickStatValue}>{stats.streak}</Text>
              <Text style={styles.quickStatLabel}>Day Streak</Text>
            </View>

            <View style={[styles.quickStatCard, { backgroundColor: '#16A34A' }]}>
              <Ionicons name="calendar" size={28} color="#FFFFFF" />
              <Text style={styles.quickStatValue}>{stats.logsCount}</Text>
              <Text style={styles.quickStatLabel}>Days Tracked</Text>
            </View>

            <View style={[styles.quickStatCard, { backgroundColor: '#DB2777' }]}>
              <Ionicons name="trending-down" size={28} color="#FFFFFF" />
              <Text style={styles.quickStatValue}>{stats.totalLoss > 0 ? Math.round((stats.totalLoss / 20) * 100) : 0}%</Text>
              <Text style={styles.quickStatLabel}>Goal Progress</Text>
            </View>
          </View>
        </View>

        {/* Progress Visualization */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Your Progress Timeline</Text>
          <View style={styles.timelineCard}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#9333EA' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Starting Weight</Text>
                <Text style={styles.timelineValue}>{getStartingWeight() ? `${parseFloat(getStartingWeight()!.toString()).toFixed(1)} ${weightUnit}` : 'Not set'}</Text>
              </View>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#DB2777' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Current Weight</Text>
                <Text style={styles.timelineValue}>{stats.currentWeight}</Text>
              </View>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#16A34A' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Total Progress</Text>
                <Text style={styles.timelineValue}>-{stats.totalLoss.toFixed(1)} {weightUnit}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        {getRecentLogs().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Recent Activity</Text>
            {getRecentLogs().map((log, index) => (
              <View key={index} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityDate}>{formatDate(log.date)}</Text>
                  {log.weight ? (
                    <View style={styles.weightBadge}>
                      <Ionicons name="scale" size={14} color="#9333EA" />
                      <Text style={styles.weightBadgeText}>{parseFloat(log.weight).toFixed(1)} {weightUnit}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.activityMetrics}>
                  {log.steps ? (
                    <View style={styles.metricChip}>
                      <Ionicons name="footsteps" size={12} color="#16A34A" />
                      <Text style={styles.metricText}>{log.steps} steps</Text>
                    </View>
                  ) : null}
                  {log.water ? (
                    <View style={styles.metricChip}>
                      <Ionicons name="water" size={12} color="#3B82F6" />
                      <Text style={styles.metricText}>{log.water} glasses</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Motivation Card */}
        <View style={styles.section}>
          <View style={styles.motivationCard}>
            <Text style={styles.motivationEmoji}>⭐</Text>
            <Text style={styles.motivationTitle}>Keep Going!</Text>
            <Text style={styles.motivationText}>
              {stats.totalLoss > 0
                ? `You've lost ${stats.totalLoss.toFixed(1)} ${weightUnit}! That's incredible progress! 🎉`
                : "Every journey starts with a single step. Log your weight today!"
              }
            </Text>
            {stats.streak > 0 && (
              <Text style={styles.motivationStreak}>
                🔥 {stats.streak}-day streak!
              </Text>
            )}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  heroCard: {
    margin: 16,
    padding: 24,
    backgroundColor: '#9333EA',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 24,
  },
  heroStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroStatLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  heroStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  milestonesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  milestoneCard: {
    width: 100,
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  milestoneWeight: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  checkmarkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  timelineValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginLeft: 7,
    marginVertical: 4,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  weightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  weightBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9333EA',
  },
  activityMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  motivationCard: {
    backgroundColor: '#FACC15',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  motivationEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  motivationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  motivationStreak: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 12,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartEmpty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  chartEmptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  chartArea: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  yAxisLabels: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'right',
  },
  chartContent: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  chartLine: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#9333EA',
    transformOrigin: 'left center',
  },
  chartPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginTop: 8,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomPadding: {
    height: 40,
  },
});
