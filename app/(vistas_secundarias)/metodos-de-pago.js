import React, { useState } from 'react';
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
import AgregarMetodoPagoModal from '@/components/modals/agregar_metodo_pago';

const PAYMENT_METHODS = [
  {
    id: '1',
    type: 'visa',
    last4: '4242',
    expiry: '12/25',
  },
  {
    id: '2',
    type: 'mastercard',
    last4: '8888',
    expiry: '08/26',
  },
  {
    id: '3',
    type: 'paypal',
    email: 'daniel@example.com',
  },
];

const MetodosDePagoScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const [selectedId, setSelectedId] = useState('1');
  const [methods, setMethods] = useState(PAYMENT_METHODS);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddMethod = (newMethod) => {
    const newId = String(methods.length + 1);
    setMethods(prev => [...prev, { id: newId, ...newMethod }]);
    setSelectedId(newId);
  };

  const renderPaymentIcon = (type) => {
    switch(type) {
      case 'visa':
        return <Ionicons name="card" size={32} color="#1A1F71" />;
      case 'mastercard':
        return <Ionicons name="card" size={32} color="#EB001B" />;
      case 'paypal':
        return <Ionicons name="logo-paypal" size={32} color="#003087" />;
      case 'yape':
        return <Ionicons name="phone-portrait-outline" size={32} color="#72009B" />;
      default:
        return <Ionicons name="card-outline" size={32} color="#999" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "#FFFFFF" : "#2D3436"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Métodos de Pago</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Tus tarjetas y cuentas</Text>
          <Text style={styles.introSubtitle}>
            Administra tus métodos de pago para realizar compras de forma rápida y segura.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Guardados</Text>
        
        {methods.map((method) => {
          const isSelected = selectedId === method.id;
          
          return (
            <TouchableOpacity 
              key={method.id} 
              style={[styles.paymentCard, isSelected && styles.paymentCardSelected]}
              onPress={() => setSelectedId(method.id)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                {renderPaymentIcon(method.type)}
              </View>
              
              <View style={styles.cardInfo}>
                {method.type === 'paypal' ? (
                  <>
                    <Text style={styles.cardTitle}>PayPal</Text>
                    <Text style={styles.cardSubtitle}>{method.email}</Text>
                  </>
                ) : method.type === 'yape' ? (
                  <>
                    <Text style={styles.cardTitle}>Yape</Text>
                    <Text style={styles.cardSubtitle}>{method.phone}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.cardTitle}>
                      •••• {method.last4}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      Expira {method.expiry}
                    </Text>
                  </>
                )}
              </View>
              
              <View style={styles.radioContainer}>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <View style={styles.addIconContainer}>
            <Ionicons name="add" size={24} color={isDark ? '#8A84FF' : '#6C63FF'} />
          </View>
          <Text style={styles.addButtonText}>Agregar nuevo método</Text>
        </TouchableOpacity>

      </ScrollView>

      <AgregarMetodoPagoModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMethod}
      />
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
    marginBottom: 15,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    boxShadow: isDark ? 'none' : '0px 2px 6px rgba(0, 0, 0, 0.04)',
    elevation: isDark ? 0 : 2,
    borderWidth: 2,
    borderColor: isDark ? '#2C2C2C' : 'transparent',
  },
  paymentCardSelected: {
    borderColor: '#6C63FF',
    backgroundColor: isDark ? '#1A1740' : '#F4F3FF',
  },
  iconContainer: {
    width: 50,
    height: 40,
    backgroundColor: isDark ? '#121212' : '#F8F9FE',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#2D3436',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: isDark ? '#BBBBBB' : '#636E72',
  },
  radioContainer: {
    padding: 5,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: isDark ? '#555' : '#DCDDE1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#6C63FF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6C63FF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    borderWidth: 2,
    borderColor: isDark ? '#2C2C2C' : '#EEEEEE',
    borderStyle: 'dashed',
  },
  addIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#2A244D' : '#F4F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#8A84FF' : '#6C63FF',
  },
});

export default MetodosDePagoScreen;
