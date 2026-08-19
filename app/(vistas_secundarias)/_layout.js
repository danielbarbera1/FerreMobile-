import { Stack } from 'expo-router';

export default function VistasSecundariasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="editar-perfil" />
      <Stack.Screen name="mis-pedidos" />
      <Stack.Screen name="direccion-de-envio" />
      <Stack.Screen name="metodos-de-pago" />
      <Stack.Screen name="centro-de-ayuda" />
      <Stack.Screen name="terminos-y-condiciones" />
    </Stack>
  );
}
