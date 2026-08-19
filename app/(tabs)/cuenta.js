import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Appearance,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const CuentaScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark);

  useEffect(() => {
    setDarkModeEnabled(isDark);
  }, [isDark]);

  const handleDarkModeToggle = (value) => {
    setDarkModeEnabled(value);
    Appearance.setColorScheme(value ? 'dark' : 'light');
  };

  const styles = getStyles(isDark);

  // Datos de usuario de ejemplo
  const user = {
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+51 987 654 321',
    avatar: 'https://via.placeholder.com/150',
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const menuSections = [
    {
      title: 'Mi Cuenta',
      items: [
        {
          id: 'profile',
          icon: 'person-outline',
          title: 'Editar Perfil',
          subtitle: 'Actualiza tus datos personales',
          onPress: () => router.push('/(vistas_secundarias)/editar-perfil'),
        },
        {
          id: 'orders',
          icon: 'receipt-outline',
          title: 'Mis Pedidos',
          subtitle: 'Historial de compras y seguimiento',
          onPress: () => router.push('/(vistas_secundarias)/mis-pedidos'),
        },
        {
          id: 'addresses',
          icon: 'location-outline',
          title: 'Direcciones de Envío',
          subtitle: 'Gestiona tus lugares de entrega',
          onPress: () => router.push('/(vistas_secundarias)/direccion-de-envio'),
        },
        {
          id: 'payments',
          icon: 'card-outline',
          title: 'Métodos de Pago',
          subtitle: 'Tarjetas y cuentas guardadas',
          onPress: () => router.push('/(vistas_secundarias)/metodos-de-pago'),
        },
      ],
    },
    {
      title: 'Ajustes',
      items: [
        {
          id: 'notifications',
          icon: 'notifications-outline',
          title: 'Notificaciones',
          subtitle: 'Alertas de ofertas y pedidos',
          isSwitch: true,
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          id: 'darkmode',
          icon: 'moon-outline',
          title: 'Modo Oscuro',
          subtitle: 'Apariencia de la aplicación',
          isSwitch: true,
          value: darkModeEnabled,
          onValueChange: handleDarkModeToggle,
        },
      ],
    },
    {
      title: 'Soporte & Legal',
      items: [
        {
          id: 'help',
          icon: 'help-circle-outline',
          title: 'Centro de Ayuda',
          subtitle: 'Preguntas frecuentes y contacto',
          onPress: () => router.push('/(vistas_secundarias)/centro-de-ayuda'),
        },
        {
          id: 'terms',
          icon: 'document-text-outline',
          title: 'Términos y Condiciones',
          subtitle: 'Políticas de privacidad y servicios',
          onPress: () => router.push('/(vistas_secundarias)/terminos-y-condiciones'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header de Cuenta */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
        </View>

        {/* Card de Perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarBadge}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.nombre}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userPhone}>{user.telefono}</Text>
          </View>
        </View>

        {/* Secciones de Menú */}
        {menuSections.map((section, idx) => (
          <View key={idx} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.optionsGroup}>
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.optionItem,
                    itemIdx === section.items.length - 1 && styles.lastOptionItem,
                  ]}
                  onPress={item.onPress}
                  disabled={item.isSwitch}
                >
                  <View style={styles.optionIconContainer}>
                    <Ionicons name={item.icon} size={22} color="#6C63FF" />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>{item.title}</Text>
                    {item.subtitle && (
                      <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>

                  {item.isSwitch ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: '#E8EAF6', true: '#6C63FF' }}
                      thumbColor="#FFFFFF"
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color="#C4C4C4" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF6B6B" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>FerreBarPE v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#F8F9FE',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#2D3436',
  },
  profileCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: isDark ? 'none' : '0px 4px 10px rgba(0, 0, 0, 0.06)',
    elevation: isDark ? 0 : 3,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: isDark ? '#2C2C2C' : '#E8EAF6',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6C63FF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: isDark ? '#1E1E1E' : '#FFFFFF',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#2D3436',
  },
  userEmail: {
    fontSize: 14,
    color: isDark ? '#8A84FF' : '#6C63FF',
    marginTop: 2,
  },
  userPhone: {
    fontSize: 12,
    color: isDark ? '#BBBBBB' : '#999',
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: isDark ? '#BBBBBB' : '#999',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionsGroup: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 18,
    boxShadow: isDark ? 'none' : '0px 2px 8px rgba(0, 0, 0, 0.04)',
    elevation: isDark ? 0 : 2,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#2C2C2C' : '#F0F2FA',
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: isDark ? '#2C2C2C' : '#F0F2FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#2D3436',
  },
  optionSubtitle: {
    fontSize: 12,
    color: isDark ? '#BBBBBB' : '#999',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#4A1C24' : '#FFEBF0',
    borderRadius: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logoutText: {
    color: isDark ? '#FF8C8C' : '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    color: '#C4C4C4',
    fontSize: 12,
  },
});

export default CuentaScreen;
