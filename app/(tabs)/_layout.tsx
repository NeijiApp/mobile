import React from 'react';
import { Stack } from 'expo-router'; // Utilisation de Stack pour la navigation
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* L'écran principal (Home) */}
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          gestureEnabled: false,

        }}
      />
      
      {/* L'écran Explore */}
      <Stack.Screen
        name="explore"
        options={{
          title: 'Explore',
          gestureEnabled: false,

        }}
      />
      <Stack.Screen
        name='onboarding1'
        options={{
          title: 'Onboarding 1',
          gestureEnabled: false,

        }}
      />
      <Stack.Screen
        name='onboarding2'
        options={{
          title: 'Onboarding 2',
          gestureEnabled: false,

        }}
      />
      <Stack.Screen
        name='onboarding3'
        options={{
          title: 'Onboarding 3',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name='onboarding4'
        options={{
          title: 'Onboarding 4',
        }}
        />
      <Stack.Screen
        name='audioplayer'
        options={{
          title: 'Audio Player',
          gestureEnabled: false,

        }}
      />
      <Stack.Screen
        name='chatbot'
        options={{
          title: 'Chatbot',
          gestureEnabled: false,

        }}
      />
      <Stack.Screen
        name='manga'
        options={{
          title: 'Manga',
          gestureEnabled: false,

        }}
      />
      <Stack.Screen
        name='first'
        options={{
          title: 'First',
          gestureEnabled: false,

        }}
      />
    </Stack>
  );
}
