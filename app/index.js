import { Redirect } from 'expo-router';

export default function Index() {
  // Redirección explícita al grupo de pestañas
  return <Redirect href="/(tabs)/inicio" />;
}