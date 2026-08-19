import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const PAYMENT_TYPES = [
  { id: 'visa',       label: 'Visa',        icon: 'card',        color: '#1A1F71' },
  { id: 'mastercard', label: 'Mastercard',  icon: 'card',        color: '#EB001B' },
  { id: 'paypal',     label: 'PayPal',      icon: 'logo-paypal', color: '#003087' },
  { id: 'yape',       label: 'Yape',        icon: 'phone-portrait-outline', color: '#72009B' },
];

const AgregarMetodoPagoModal = ({ visible, onClose, onAdd }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const [selectedType, setSelectedType] = useState('visa');
  const [cardNumber, setCardNumber]   = useState('');
  const [cardHolder, setCardHolder]   = useState('');
  const [expiry, setExpiry]           = useState('');
  const [cvv, setCvv]                 = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');

  const isCard = selectedType === 'visa' || selectedType === 'mastercard';
  const isPaypal = selectedType === 'paypal';
  const isYape = selectedType === 'yape';

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned;
  };

  const handleSave = () => {
    if (isCard && (!cardNumber || !cardHolder || !expiry || !cvv)) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos de la tarjeta.');
      return;
    }
    if (isPaypal && !email) {
      Alert.alert('Campos incompletos', 'Ingresa tu correo de PayPal.');
      return;
    }
    if (isYape && !phone) {
      Alert.alert('Campos incompletos', 'Ingresa tu número de teléfono de Yape.');
      return;
    }

    const newMethod = isCard
      ? { type: selectedType, last4: cardNumber.replace(/\s/g, '').slice(-4), expiry }
      : isPaypal
      ? { type: 'paypal', email }
      : { type: 'yape', phone };

    onAdd?.(newMethod);
    handleClose();
  };

  const handleClose = () => {
    setCardNumber('');
    setCardHolder('');
    setExpiry('');
    setCvv('');
    setEmail('');
    setPhone('');
    setSelectedType('visa');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.overlay}>
          {/* Backdrop */}
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

          {/* Sheet */}
          <View style={styles.sheet}>
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar método de pago</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <Ionicons name="close" size={20} color={isDark ? '#FFFFFF' : '#2D3436'} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >

              {/* Selector de tipo */}
              <Text style={styles.sectionLabel}>Tipo de método</Text>
              <View style={styles.typeGrid}>
                {PAYMENT_TYPES.map((pt) => {
                  const active = selectedType === pt.id;
                  return (
                    <TouchableOpacity
                      key={pt.id}
                      style={[styles.typeCard, active && styles.typeCardActive]}
                      onPress={() => setSelectedType(pt.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={pt.icon}
                        size={26}
                        color={active ? '#FFFFFF' : pt.color}
                      />
                      <Text style={[styles.typeLabel, active && styles.typeLabelActive]}>
                        {pt.label}
                      </Text>
                      {active && (
                        <View style={styles.typeCheck}>
                          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Formulario según el tipo */}
              {isCard && (
                <View style={styles.formSection}>
                  <Text style={styles.sectionLabel}>Datos de la tarjeta</Text>

                  {/* Vista previa de tarjeta */}
                  <View style={[
                    styles.cardPreview,
                    { backgroundColor: selectedType === 'visa' ? '#1A1F71' : '#EB001B' }
                  ]}>
                    <View style={styles.cardPreviewTop}>
                      <Ionicons name="wifi-outline" size={22} color="rgba(255,255,255,0.6)" style={{ transform: [{ rotate: '90deg' }] }} />
                      <Ionicons name="card" size={28} color="rgba(255,255,255,0.9)" />
                    </View>
                    <Text style={styles.cardPreviewNumber}>
                      {cardNumber
                        ? cardNumber.padEnd(19, ' ').replace(/\d(?=.)/g, (d, i) => [4, 9, 14].includes(i) ? d + ' ' : d)
                        : '•••• •••• •••• ••••'}
                    </Text>
                    <View style={styles.cardPreviewBottom}>
                      <View>
                        <Text style={styles.cardPreviewLabel}>TITULAR</Text>
                        <Text style={styles.cardPreviewValue}>
                          {cardHolder || 'NOMBRE APELLIDO'}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.cardPreviewLabel}>EXPIRA</Text>
                        <Text style={styles.cardPreviewValue}>{expiry || 'MM/AA'}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Número de tarjeta */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Número de tarjeta</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons name="card-outline" size={20} color={isDark ? '#888' : '#aaa'} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="1234 5678 9012 3456"
                        placeholderTextColor={isDark ? '#555' : '#C4C4C4'}
                        value={cardNumber}
                        onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                        keyboardType="numeric"
                        maxLength={19}
                      />
                    </View>
                  </View>

                  {/* Titular */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nombre del titular</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons name="person-outline" size={20} color={isDark ? '#888' : '#aaa'} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Como aparece en la tarjeta"
                        placeholderTextColor={isDark ? '#555' : '#C4C4C4'}
                        value={cardHolder}
                        onChangeText={setCardHolder}
                        autoCapitalize="characters"
                      />
                    </View>
                  </View>

                  {/* Fila: Expiración + CVV */}
                  <View style={styles.rowInputs}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                      <Text style={styles.inputLabel}>Fecha de expiración</Text>
                      <View style={styles.inputContainer}>
                        <Ionicons name="calendar-outline" size={18} color={isDark ? '#888' : '#aaa'} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="MM/AA"
                          placeholderTextColor={isDark ? '#555' : '#C4C4C4'}
                          value={expiry}
                          onChangeText={(t) => setExpiry(formatExpiry(t))}
                          keyboardType="numeric"
                          maxLength={5}
                        />
                      </View>
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>CVV</Text>
                      <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={18} color={isDark ? '#888' : '#aaa'} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="•••"
                          placeholderTextColor={isDark ? '#555' : '#C4C4C4'}
                          value={cvv}
                          onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))}
                          keyboardType="numeric"
                          secureTextEntry
                          maxLength={4}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {isPaypal && (
                <View style={styles.formSection}>
                  <Text style={styles.sectionLabel}>Cuenta PayPal</Text>
                  <View style={styles.paypalBanner}>
                    <Ionicons name="logo-paypal" size={36} color="#003087" />
                    <Text style={styles.paypalText}>
                      Conecta tu cuenta de PayPal de forma segura.
                    </Text>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Correo de PayPal</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons name="mail-outline" size={20} color={isDark ? '#888' : '#aaa'} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="correo@ejemplo.com"
                        placeholderTextColor={isDark ? '#555' : '#C4C4C4'}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                  </View>
                </View>
              )}

              {isYape && (
                <View style={styles.formSection}>
                  <Text style={styles.sectionLabel}>Cuenta Yape</Text>
                  <View style={[styles.paypalBanner, { backgroundColor: isDark ? '#1E0A2E' : '#F8F0FF' }]}>
                    <Ionicons name="phone-portrait-outline" size={36} color="#72009B" />
                    <Text style={[styles.paypalText, { color: '#72009B' }]}>
                      Ingresa tu número de Yape para pagos rápidos.
                    </Text>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Número de teléfono</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons name="call-outline" size={20} color={isDark ? '#888' : '#aaa'} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="987 654 321"
                        placeholderTextColor={isDark ? '#555' : '#C4C4C4'}
                        value={phone}
                        onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 9))}
                        keyboardType="phone-pad"
                        maxLength={9}
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* Nota de seguridad */}
              <View style={styles.securityNote}>
                <Ionicons name="shield-checkmark-outline" size={16} color={isDark ? '#8A84FF' : '#6C63FF'} />
                <Text style={styles.securityText}>
                  Tu información está cifrada y protegida con tecnología SSL.
                </Text>
              </View>

            </ScrollView>

            {/* Botón guardar */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>Agregar método</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const getStyles = (isDark) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.92,
    paddingBottom: 10,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: isDark ? '#444' : '#E0E0E0',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#2C2C2C' : '#F1F2F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: isDark ? '#FFFFFF' : '#1A1A2E',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isDark ? '#2C2C2C' : '#F1F2F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: isDark ? '#888' : '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  // Selector de tipo
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  typeCard: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: isDark ? '#1E1E1E' : '#F8F9FE',
    borderRadius: 14,
    padding: 14,
    borderWidth: 2,
    borderColor: isDark ? '#2C2C2C' : '#EEEEEE',
    position: 'relative',
  },
  typeCardActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: isDark ? '#FFFFFF' : '#2D3436',
  },
  typeLabelActive: {
    color: '#FFFFFF',
  },
  typeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  formSection: {
    marginBottom: 10,
  },
  // Vista previa de tarjeta
  cardPreview: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    height: 180,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardPreviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPreviewNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 2,
    textAlign: 'center',
  },
  cardPreviewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardPreviewLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardPreviewValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  // Inputs
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: isDark ? '#E0E0E0' : '#2D3436',
    marginBottom: 8,
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#242424' : '#F8F9FE',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1.5,
    borderColor: isDark ? '#2C2C2C' : '#EEEEEE',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: isDark ? '#FFFFFF' : '#2D3436',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  // PayPal / Yape banner
  paypalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: isDark ? '#0A1220' : '#EEF3FB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  paypalText: {
    flex: 1,
    fontSize: 14,
    color: isDark ? '#BBBBBB' : '#003087',
    lineHeight: 20,
    fontWeight: '500',
  },
  // Nota de seguridad
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: isDark ? '#1A1740' : '#F4F3FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    marginBottom: 4,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: isDark ? '#8A84FF' : '#6C63FF',
    lineHeight: 18,
  },
  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#2C2C2C' : '#F1F2F6',
  },
  saveBtn: {
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AgregarMetodoPagoModal;
