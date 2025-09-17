import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Simple standalone screens that work without API
const DashboardScreen = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView style={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning! 👋</Text>
        <Text style={styles.subtitle}>Welcome to Pound Drop Mobile</Text>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🚶</Text>
          <Text style={styles.statValue}>8,432</Text>
          <Text style={styles.statLabel}>Steps Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>1,250</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💧</Text>
          <Text style={styles.statValue}>6/8</Text>
          <Text style={styles.statLabel}>Water</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>✅</Text>
          <Text style={styles.statValue}>7</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      <View style={styles.actionGrid}>
        <TouchableOpacity style={[styles.actionCard, styles.greenCard]}>
          <Text style={styles.actionIcon}>🍽️</Text>
          <Text style={styles.actionTitle}>Log a Meal</Text>
          <Text style={styles.actionSubtitle}>Track your nutrition</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionCard, styles.purpleCard]}>
          <Text style={styles.actionIcon}>⚖️</Text>
          <Text style={styles.actionTitle}>Track Weight</Text>
          <Text style={styles.actionSubtitle}>Lost 3.2 lbs</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const WellnessLogScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.centerContent}>
      <Text style={styles.screenTitle}>🌟 Wellness Log</Text>
      <Text style={styles.screenDescription}>Track your daily mood and wellness habits</Text>
    </View>
  </SafeAreaView>
);

const MealLoggerScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.centerContent}>
      <Text style={styles.screenTitle}>🍽️ Meal Logger</Text>
      <Text style={styles.screenDescription}>Log your meals and track nutrition</Text>
    </View>
  </SafeAreaView>
);

const ProgressScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.centerContent}>
      <Text style={styles.screenTitle}>📊 Progress</Text>
      <Text style={styles.screenDescription}>View your weight loss journey</Text>
    </View>
  </SafeAreaView>
);

const ProfileScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.centerContent}>
      <Text style={styles.screenTitle}>👤 Profile</Text>
      <Text style={styles.screenDescription}>Manage your account and preferences</Text>
    </View>
  </SafeAreaView>
);

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: any;

              if (route.name === 'Dashboard') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Wellness') {
                iconName = focused ? 'heart' : 'heart-outline';
              } else if (route.name === 'Meals') {
                iconName = focused ? 'restaurant' : 'restaurant-outline';
              } else if (route.name === 'Progress') {
                iconName = focused ? 'trending-up' : 'trending-up-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              } else {
                iconName = 'ellipse-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#8B5CF6',
            tabBarInactiveTintColor: '#6B7280',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB',
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Wellness" component={WellnessLogScreen} />
          <Tab.Screen name="Meals" component={MealLoggerScreen} />
          <Tab.Screen name="Progress" component={ProgressScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  greenCard: {
    backgroundColor: '#10B981',
  },
  purpleCard: {
    backgroundColor: '#8B5CF6',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  screenDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
