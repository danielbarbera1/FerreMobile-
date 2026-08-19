import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const FAQ_DATA = [
  {
    id: '1',
    question: '¿Cuáles son los métodos de pago aceptados?',
    answer: 'Aceptamos tarjetas de crédito, débito (Visa, Mastercard), transferencias bancarias y pagos en efectivo contra entrega en algunas zonas.',
  },
  {
    id: '2',
    question: '¿Cuánto tiempo tarda en llegar mi pedido?',
    answer: 'Los envíos dentro de la ciudad tardan entre 24 a 48 horas hábiles. Para provincias, el tiempo estimado es de 3 a 5 días hábiles.',
  },
  {
    id: '3',
    question: '¿Puedo devolver un producto si está defectuoso?',
    answer: 'Sí, tienes hasta 7 días para reportar cualquier defecto de fábrica y solicitar un cambio o reembolso. El producto debe estar en su empaque original.',
  },
  {
    id: '4',
    question: '¿Cómo puedo hacer seguimiento a mi pedido?',
    answer: 'Puedes rastrear tu pedido desde la sección "Mis Pedidos" en tu perfil, donde encontrarás el estado actual y un número de seguimiento si aplica.',
  },
];

const ContactCard = ({ icon, title, subtitle, color, onPress, styles, isDark }) => (
  <TouchableOpacity style={styles.contactCard} onPress={onPress}>
    <View style={[styles.contactIconContainer, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.contactInfo}>
      <Text style={styles.contactTitle}>{title}</Text>
      <Text style={styles.contactSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={isDark ? "#888" : "#C4C4C4"} />
  </TouchableOpacity>
);

const FAQItem = ({ item, styles, isDark }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.faqContainer}>
      <TouchableOpacity 
        style={styles.faqHeader} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={[styles.faqQuestion, expanded && { color: isDark ? '#8A84FF' : '#6C63FF' }]}>
          {item.question}
        </Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={expanded ? (isDark ? '#8A84FF' : '#6C63FF') : (isDark ? '#888' : '#999')} 
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswer}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

const CentroDeAyudaScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/51987654321');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:soporte@ferrebarpe.com');
  };

  const handleCall = () => {
    Linking.openURL('tel:+51987654321');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "#FFFFFF" : "#2D3436"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Centro de Ayuda</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>¿Cómo podemos ayudarte hoy?</Text>
          <Text style={styles.introSubtitle}>
            Encuentra respuestas rápidas a tus dudas o contáctanos directamente.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Contacto Directo</Text>
        <View style={styles.contactContainer}>
          <ContactCard 
            icon="logo-whatsapp" 
            title="Chat por WhatsApp" 
            subtitle="Respuesta inmediata"
            color="#25D366"
            onPress={handleWhatsApp}
            styles={styles}
            isDark={isDark}
          />
          <ContactCard 
            icon="mail-outline" 
            title="Envíanos un correo" 
            subtitle="soporte@ferrebarpe.com"
            color="#6C63FF"
            onPress={handleEmail}
            styles={styles}
            isDark={isDark}
          />
          <ContactCard 
            icon="call-outline" 
            title="Llámanos" 
            subtitle="+51 987 654 321"
            color="#FF6B6B"
            onPress={handleCall}
            styles={styles}
            isDark={isDark}
          />
        </View>

        <Text style={styles.sectionTitle}>Preguntas Frecuentes (FAQ)</Text>
        <View style={styles.faqList}>
          {FAQ_DATA.map((item) => (
            <FAQItem key={item.id} item={item} styles={styles} isDark={isDark} />
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  introSection: {
    marginVertical: 20,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: isDark ? '#FFFFFF' : '#1A1A2E',
    marginBottom: 8,
  },
  introSubtitle: {
    fontSize: 15,
    color: isDark ? '#BBBBBB' : '#636E72',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: isDark ? '#BBBBBB' : '#999',
    marginBottom: 12,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactContainer: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    marginBottom: 25,
    boxShadow: isDark ? 'none' : '0px 2px 8px rgba(0, 0, 0, 0.04)',
    elevation: isDark ? 0 : 2,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  contactIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: isDark ? '#FFFFFF' : '#2D3436',
  },
  contactSubtitle: {
    fontSize: 13,
    color: isDark ? '#888' : '#999',
    marginTop: 2,
  },
  faqList: {
    marginTop: 5,
  },
  faqContainer: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    boxShadow: isDark ? 'none' : '0px 2px 6px rgba(0, 0, 0, 0.04)',
    elevation: isDark ? 0 : 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#2D3436',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  faqAnswer: {
    fontSize: 14,
    color: isDark ? '#BBBBBB' : '#636E72',
    lineHeight: 22,
  },
});

export default CentroDeAyudaScreen;
