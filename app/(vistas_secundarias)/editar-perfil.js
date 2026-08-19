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

const EditarPerfilScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const [form, setForm] = useState({
    nombre: 'Daniel Barbera',
    email: 'daniel@example.com',
    telefono: '987 654 321',
  });

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios de perfil
    console.log('Perfil guardado:', form);
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
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {form.nombre.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{form.nombre || 'Tu Nombre'}</Text>
            <Text style={styles.profileEmail}>{form.email || 'correo@ejemplo.com'}</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Tu nombre completo"
                  placeholderTextColor="#C4C4C4"
                  value={form.nombre}
                  onChangeText={(text) => updateForm('nombre', text)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Tu correo electrónico"
                  placeholderTextColor="#C4C4C4"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(text) => updateForm('email', text)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Tu número de teléfono"
                  placeholderTextColor="#C4C4C4"
                  keyboardType="phone-pad"
                  value={form.telefono}
                  onChangeText={(text) => updateForm('telefono', text)}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.changePasswordButton}>
              <Ionicons name="lock-closed-outline" size={20} color="#6C63FF" style={styles.inputIcon} />
              <Text style={styles.changePasswordText}>Cambiar contraseña</Text>
              <View style={{ flex: 1 }} />
              <Ionicons name="chevron-forward" size={20} color={isDark ? "#888" : "#C4C4C4"} />
            </TouchableOpacity>

          </View>

        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
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
  profileSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: isDark ? 'none' : '0px 4px 10px rgba(108, 99, 255, 0.3)',
    elevation: isDark ? 0 : 4,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: isDark ? '#444' : '#2D3436',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: isDark ? '#121212' : '#F8F9FE',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A2E',
  },
  profileEmail: {
    fontSize: 14,
    color: isDark ? '#BBBBBB' : '#636E72',
    marginTop: 4,
  },
  formContainer: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
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
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 55,
    marginTop: 10,
    boxShadow: isDark ? 'none' : '0px 2px 6px rgba(0, 0, 0, 0.04)',
    elevation: isDark ? 0 : 2,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? '#2C2C2C' : 'transparent',
  },
  changePasswordText: {
    fontSize: 15,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#2D3436',
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

export default EditarPerfilScreen;
