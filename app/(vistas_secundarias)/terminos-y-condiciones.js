import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const TERMS_DATA = [
  {
    id: '1',
    title: '1. Introducción',
    content: 'Bienvenido a Ferrebarpe. Al acceder y utilizar nuestra aplicación, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestra aplicación.',
  },
  {
    id: '2',
    title: '2. Uso del Servicio',
    content: 'El contenido de las páginas de esta aplicación es para su información y uso general únicamente. Está sujeto a cambios sin previo aviso. Ni nosotros ni terceros brindamos ninguna garantía sobre la exactitud, puntualidad, rendimiento, integridad o idoneidad de la información y los materiales encontrados o ofrecidos en esta aplicación.',
  },
  {
    id: '3',
    title: '3. Privacidad y Protección de Datos',
    content: 'Su privacidad es muy importante para nosotros. El uso de la aplicación también está regido por nuestra Política de Privacidad, que detalla cómo recopilamos, usamos y protegemos su información personal.',
  },
  {
    id: '4',
    title: '4. Compras y Pagos',
    content: 'Todas las compras realizadas a través de la aplicación están sujetas a disponibilidad de los productos. Los precios pueden variar y nos reservamos el derecho de modificar o discontinuar cualquier producto en cualquier momento. Los pagos se procesan de forma segura a través de plataformas de terceros autorizadas.',
  },
  {
    id: '5',
    title: '5. Política de Envíos y Devoluciones',
    content: 'Los tiempos de envío son estimados y pueden variar según su ubicación. Se aceptarán devoluciones únicamente para productos defectuosos de fábrica dentro de los primeros 7 días posteriores a la recepción del pedido, siempre que el producto se encuentre en su empaque original.',
  },
];

const TerminosYCondicionesScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "#FFFFFF" : "#2D3436"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.introSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text" size={32} color="#6C63FF" />
          </View>
          <Text style={styles.introTitle}>Términos de Servicio</Text>
          <Text style={styles.lastUpdated}>Última actualización: 15 de Agosto de 2026</Text>
          <Text style={styles.introSubtitle}>
            Por favor, lee detenidamente estos términos antes de utilizar nuestros servicios.
          </Text>
        </View>

        <View style={styles.termsContainer}>
          {TERMS_DATA.map((section) => (
            <View key={section.id} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#F8F9FE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: isDark ? '#121212' : '#F8F9FE',
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#2C2C2C' : '#EEEEEE',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#2D3436',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  introSection: {
    padding: 24,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    boxShadow: isDark ? 'none' : '0px 4px 10px rgba(0, 0, 0, 0.03)',
    elevation: isDark ? 0 : 3,
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: isDark ? '#2A244D' : '#F4F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: isDark ? '#FFFFFF' : '#1A1A2E',
    marginBottom: 6,
  },
  lastUpdated: {
    fontSize: 13,
    fontWeight: '600',
    color: isDark ? '#8A84FF' : '#6C63FF',
    marginBottom: 12,
  },
  introSubtitle: {
    fontSize: 14,
    color: isDark ? '#BBBBBB' : '#636E72',
    textAlign: 'center',
    lineHeight: 22,
  },
  termsContainer: {
    paddingHorizontal: 20,
  },
  sectionContainer: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: isDark ? 'none' : '0px 2px 6px rgba(0, 0, 0, 0.02)',
    elevation: isDark ? 0 : 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#2D3436',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: isDark ? '#BBBBBB' : '#636E72',
    lineHeight: 24,
  },
});

export default TerminosYCondicionesScreen;
