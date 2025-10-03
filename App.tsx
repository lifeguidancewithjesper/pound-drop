import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { ApiService } from './src/services/api';

// Import the complete screens
import DashboardScreen from './src/screens/DashboardScreen';
import WellnessScreen from './src/screens/WellnessScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import AdminScreen from './src/screens/AdminScreen';
import DailyLogScreen from './src/screens/DailyLogScreen';
import { StorageProvider } from './src/context/StorageContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tab navigator for authenticated users
function MainTabs({ onLogout }: { onLogout: () => void }) {
  return (
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
      <Tab.Screen name="Wellness" component={WellnessScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Auth stack navigator
function AuthStack({ onLoginSuccess, onAdminLoginSuccess }: { 
  onLoginSuccess: () => void; 
  onAdminLoginSuccess: () => void; 
}) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen 
            {...props} 
            onLoginSuccess={onLoginSuccess}
            onAdminLoginSuccess={onAdminLoginSuccess}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {(props) => (
          <SignUpScreen 
            {...props} 
            onSignUpSuccess={onLoginSuccess}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // Always start with login screen - no auto-login with demo user
    console.log('ℹ️  Starting with login screen');
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  const handleLoginSuccess = () => {
    console.log('handleLoginSuccess called - setting isAuthenticated to true');
    setIsAuthenticated(true);
  };

  const handleAdminLogin = () => {
    console.log('handleAdminLogin called - setting isAdmin to true');
    setIsAdmin(true);
  };

  const handleLogout = () => {
    console.log('handleLogout called - setting isAuthenticated to false');
    setIsAuthenticated(false);
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  // Show admin panel if admin is logged in
  if (isAdmin) {
    return (
      <NavigationContainer>
        <AdminScreen onLogout={() => {
          setIsAdmin(false);
          setIsAuthenticated(false);
        }} />
      </NavigationContainer>
    );
  }
  return (
    <StorageProvider>
      <SubscriptionProvider>
        <StatusBar style="dark" />
        <NavigationContainer>
          {isAuthenticated ? (
            // User is logged in - show main app with stack navigator for modals
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="MainTabs">
                {(props) => <MainTabs {...props} onLogout={handleLogout} />}
              </Stack.Screen>
              <Stack.Screen name="DailyLog" component={DailyLogScreen} />
            </Stack.Navigator>
          ) : (
            // User is not logged in - show authentication screens
            <AuthStack 
              onLoginSuccess={handleLoginSuccess}
              onAdminLoginSuccess={handleAdminLogin}
            />
          )}
        </NavigationContainer>
      </SubscriptionProvider>
    </StorageProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});