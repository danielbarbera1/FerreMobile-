import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Ionicons size={22} name={focused ? "home" : "home-outline"} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="carrito"
        options={{
          title: 'Carrito',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Ionicons size={22} name={focused ? "cart" : "cart-outline"} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cuenta"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Ionicons size={22} name={focused ? "person" : "person-outline"} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 25 : 15,
    left: 20,
    right: 20,
    elevation: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    height: 70,
    shadowColor: '#6C63FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F3F4FB',
  },
  tabBarItem: {
    paddingVertical: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: -4,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 16,
  },
  iconContainerActive: {
    backgroundColor: '#EDE9FE', // Fondo suave cuando está activo
  },
});
