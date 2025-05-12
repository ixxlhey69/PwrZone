import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { WorkoutTrackerScreen } from '../screens/WorkoutTrackerScreen';
import { WorkoutLibraryScreen } from '../screens/WorkoutLibraryScreen';
import WarmDownTimerScreen from '../screens/WarmDownTimerScreen';
import CalorieCountScreen from '../screens/CalorieCountScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Tracker" 
          component={WorkoutTrackerScreen} 
          options={{
            title: 'Workout Tracker',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Library" 
          component={WorkoutLibraryScreen} 
          options={{
            title: 'Workout Library',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="book-open-variant" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="WarmDown" 
          component={WarmDownTimerScreen} 
          options={{
            title: 'Warm Down Timer',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="timer-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="CalorieCount" 
          component={CalorieCountScreen} 
          options={{
            title: 'Calorie Count',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="food-apple" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};