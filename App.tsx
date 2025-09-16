import React from 'react'; 
import { NavigationContainer } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { StatusBar } from 'expo-status-bar'; 
 
import DashboardScreen from './src/screens/DashboardScreen'; 
import WellnessLogScreen from './src/screens/WellnessLogScreen'; 
import MealLoggerScreen from './src/screens/MealLoggerScreen'; 
import ProgressScreen from './src/screens/ProgressScreen'; 
import ProfileScreen from './src/screens/ProfileScreen'; 
 
const Tab = createBottomTabNavigator(); 
 
export default function App() { 
  return ( 
    <> 
      <StatusBar style="dark" /> 
      <NavigationContainer> 
        <Tab.Navigator> 
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
