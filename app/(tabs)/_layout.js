import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CartProvider, useCart } from '@/context/CartContext';

// Icono del carrito con badge
function CarritoIcon({ color, focused }) {
  const { totalItems } = useCart();
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Ionicons size={20} name={focused ? 'cart' : 'cart-outline'} color={color} />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <CartProvider>
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
                <Ionicons size={20} name={focused ? 'home' : 'home-outline'} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="carrito"
          options={{
            title: 'Carrito',
            tabBarIcon: ({ color, focused }) => (
              <CarritoIcon color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="cuenta"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Ionicons size={20} name={focused ? 'person' : 'person-outline'} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 35 : 25,
    left: 40,
    right: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    height: 65,
    borderWidth: 1,
    borderColor: '#F3F4FB',
    // Sombras nativas compatibles con iOS y Android:
    elevation: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    paddingTop: 8,
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  iconContainer: {
    width: 44,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerActive: {
    backgroundColor: '#EDE9FE',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});