import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const DireccionDeEnvioScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const [form, setForm] = useState({
    nombre: '',
    calle: '',
    distrito: '',
    codigoPostal: '',
    referencia: '',
    telefono: '',
  });

  const handleSave = () => {
    // Aquí iría la lógica para guardar la dirección
    console.log('Dirección guardada:', form);
    router.back();
  };

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "#FFFFFF" : "#2D3436"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dirección de Envío</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.introSection}>
            <Text style={styles.introTitle}>Agrega tu dirección</Text>
            <Text style={styles.introSubtitle}>
              Ingresa los detalles para que tus pedidos lleguen sin problemas.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Juan Pérez"
                  placeholderTextColor="#C4C4C4"
                  value={form.nombre}
                  onChangeText={(text) => updateForm('nombre', text)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Calle y número</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="home-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Av. Siempreviva 742"
                  placeholderTextColor="#C4C4C4"
                  value={form.calle}
                  onChangeText={(text) => updateForm('calle', text)}
                />
              </View>
            </View>

            <View style={styles.rowGroup}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Distrito / Ciudad</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="business-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ej. Miraflores"
                    placeholderTextColor="#C4C4C4"
                    value={form.distrito}
                    onChangeText={(text) => updateForm('distrito', text)}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.label}>Código Postal</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ej. 15074"
                    placeholderTextColor="#C4C4C4"
                    keyboardType="numeric"
                    value={form.codigoPostal}
                    onChangeText={(text) => updateForm('codigoPostal', text)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Referencia (Opcional)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="map-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Frente al parque, casa azul"
                  placeholderTextColor="#C4C4C4"
                  value={form.referencia}
                  onChangeText={(text) => updateForm('referencia', text)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono de contacto</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej. 987 654 321"
                  placeholderTextColor="#C4C4C4"
                  keyboardType="phone-pad"
                  value={form.telefono}
                  onChangeText={(text) => updateForm('telefono', text)}
                />
              </View>
            </View>
          </View>

        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Dirección</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  formContainer: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  rowGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: isDark ? '#E0E0E0' : '#2D3436',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 55,
    boxShadow: isDark ? 'none' : '0px 2px 6px rgba(0, 0, 0, 0.04)',
    elevation: isDark ? 0 : 2,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? '#2C2C2C' : 'transparent',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: isDark ? '#FFFFFF' : '#2D3436',
    height: '100%',
  },
  footer: {
    padding: 20,
    backgroundColor: isDark ? '#121212' : '#F8F9FE',
    borderTopWidth: 1,
    borderTopColor: isDark ? '#2C2C2C' : '#EEEEEE',
  },
  saveButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: isDark ? 'none' : '0px 4px 12px rgba(108, 99, 255, 0.3)',
    elevation: isDark ? 0 : 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DireccionDeEnvioScreen;
