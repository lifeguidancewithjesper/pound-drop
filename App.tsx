import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Pound Drop</Text>
        <Text style={styles.subtitle}>Weight Loss Tracker</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Dashboard</Text>
          <Text style={styles.sectionText}>Track your daily progress</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍎 Meal Logging</Text>
          <Text style={styles.sectionText}>Log your meals and calories</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚖️ Weight Progress</Text>
          <Text style={styles.sectionText}>Monitor your weight loss journey</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏃 Exercise Tracking</Text>
          <Text style={styles.sectionText}>Track workouts and activities</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  section: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
  },
});