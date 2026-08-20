import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#2C2C2C',
    primary: '#8A84FF',
  },
};

const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F8F9FE',
    card: '#FFFFFF',
    text: '#1A1A2E',
    border: '#EDE9FE',
    primary: '#6C63FF',
  },
};

// CORREGIDO: Se cambia 'anchor' por 'initialRouteName'
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Pinta el fondo nativo del sistema operativo para eliminar el flash
  // blanco al deslizar hacia atrás (el OS window background estaba en blanco)
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? '#121212' : '#F8F9FE');
  }, [isDark]);

  return (
    <ThemeProvider value={isDark ? CustomDarkTheme : CustomDefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          // cardStyle pinta el fondo de la pantalla entrante/saliente durante la animación
          // Esto evita el flash blanco o el efecto "captura de pantalla" en modo oscuro
          cardStyle: { backgroundColor: isDark ? '#121212' : '#F8F9FE' },
          contentStyle: {
            flex: 1,
            backgroundColor: isDark ? '#121212' : '#F8F9FE',
          },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(vistas_secundarias)"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
            cardStyle: { backgroundColor: isDark ? '#121212' : '#F8F9FE' },
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}