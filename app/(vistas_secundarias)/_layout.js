import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function VistasSecundariasLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        // cardStyle cubre el fondo durante el deslizamiento nativo
        cardStyle: { backgroundColor: isDark ? '#121212' : '#F8F9FE' },
        contentStyle: {
          flex: 1,
          backgroundColor: isDark ? '#121212' : '#F8F9FE',
        },
      }}>
      <Stack.Screen name="editar-perfil" />
      <Stack.Screen name="mis-pedidos" />
      <Stack.Screen name="direccion-de-envio" />
      <Stack.Screen name="metodos-de-pago" />
      <Stack.Screen name="centro-de-ayuda" />
      <Stack.Screen name="terminos-y-condiciones" />
    </Stack>
  );
}