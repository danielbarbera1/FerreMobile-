import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;

// Datos de ejemplo de los productos de cada pedido
const ORDER_PRODUCTS = {
  'ORD-00123': [
    { id: '1', nombre: 'Taladro Percutor 750W', cantidad: 1, precio: 149.90, categoria: 'Herramientas' },
    { id: '2', nombre: 'Broca HSS Set x10', cantidad: 2, precio: 34.90, categoria: 'Accesorios' },
    { id: '3', nombre: 'Guantes de Trabajo L', cantidad: 1, precio: 25.80, categoria: 'EPP' },
  ],
  'ORD-00101': [
    { id: '4', nombre: 'Cemento Pacasmayo 42.5kg', cantidad: 10, precio: 42.00, categoria: 'Construcción' },
    { id: '5', nombre: 'Varilla Corrugada 3/8"', cantidad: 2, precio: 35.00, categoria: 'Fierros' },
  ],
  'ORD-00085': [
    { id: '6', nombre: 'Llave Inglesa 12"', cantidad: 1, precio: 85.00, categoria: 'Herramientas' },
  ],
  'ORD-00042': [
    { id: '7', nombre: 'Pintura Látex Blanco 4L', cantidad: 2, precio: 68.00, categoria: 'Pinturas' },
    { id: '8', nombre: 'Rodillo de Pintura', cantidad: 1, precio: 22.00, categoria: 'Pinturas' },
    { id: '9', nombre: 'Bandeja para Pintura', cantidad: 1, precio: 12.00, categoria: 'Pinturas' },
    { id: '10', nombre: 'Cinta de Embalaje 50m', cantidad: 2, precio: 9.00, categoria: 'Accesorios' },
  ],
};

const TIMELINE_STEPS = {
  active: [
    { label: 'Pedido recibido', done: true, icon: 'checkmark-circle' },
    { label: 'Preparando pedido', done: true, icon: 'cube' },
    { label: 'En camino', done: true, icon: 'bicycle', current: true },
    { label: 'Entregado', done: false, icon: 'home' },
  ],
  completed: [
    { label: 'Pedido recibido', done: true, icon: 'checkmark-circle' },
    { label: 'Preparando pedido', done: true, icon: 'cube' },
    { label: 'En camino', done: true, icon: 'bicycle' },
    { label: 'Entregado', done: true, icon: 'home' },
  ],
  cancelled: [
    { label: 'Pedido recibido', done: true, icon: 'checkmark-circle' },
    { label: 'Cancelado', done: false, icon: 'close-circle', cancelled: true },
  ],
};

const DetallePedidoModal = ({ visible, order, onClose }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  if (!order) return null;

  const products = ORDER_PRODUCTS[order.id] || [];
  const timeline = TIMELINE_STEPS[order.statusType] || TIMELINE_STEPS.completed;
  const subtotal = products.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const envio = order.statusType !== 'cancelled' ? 15.0 : 0;
  const total = subtotal + envio;

  const statusConfig = {
    active:    { bg: '#FFF3E0', text: '#FF9800', label: 'En camino' },
    completed: { bg: '#E8F5E9', text: '#4CAF50', label: 'Entregado' },
    cancelled: { bg: '#FFEBEE', text: '#F44336', label: 'Cancelado' },
  }[order.statusType] || { bg: '#F5F5F5', text: '#9E9E9E', label: order.status };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop semitransparente */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        {/* Sheet */}
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header del Modal */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Pedido {order.id}</Text>
              <Text style={styles.modalDate}>{order.date}</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                <Text style={[styles.statusText, { color: statusConfig.text }]}>
                  {statusConfig.label}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={20} color={isDark ? '#FFFFFF' : '#2D3436'} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            {/* Timeline de seguimiento */}
            {order.statusType !== 'cancelled' ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Seguimiento</Text>
                <View style={styles.timelineContainer}>
                  {timeline.map((step, index) => (
                    <View key={index} style={styles.timelineStep}>
                      {/* Línea vertical */}
                      {index < timeline.length - 1 && (
                        <View style={[
                          styles.timelineLine,
                          { backgroundColor: step.done ? '#6C63FF' : (isDark ? '#2C2C2C' : '#EEEEEE') }
                        ]} />
                      )}
                      {/* Ícono */}
                      <View style={[
                        styles.timelineIcon,
                        step.done
                          ? { backgroundColor: '#6C63FF' }
                          : { backgroundColor: isDark ? '#2C2C2C' : '#EEEEEE' },
                        step.current && styles.timelineIconCurrent,
                      ]}>
                        <Ionicons
                          name={step.icon}
                          size={14}
                          color={step.done ? '#FFFFFF' : (isDark ? '#555' : '#BBBBBB')}
                        />
                      </View>
                      {/* Label */}
                      <View style={styles.timelineLabelContainer}>
                        <Text style={[
                          styles.timelineLabel,
                          step.done && { color: isDark ? '#FFFFFF' : '#2D3436', fontWeight: '700' },
                          step.current && { color: '#6C63FF' },
                        ]}>
                          {step.label}
                        </Text>
                        {step.current && (
                          <Text style={styles.timelineCurrent}>En progreso</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={[styles.cancelledBanner]}>
                <Ionicons name="close-circle" size={22} color="#F44336" />
                <Text style={styles.cancelledText}>Este pedido fue cancelado</Text>
              </View>
            )}

            {/* Productos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Productos ({products.length})</Text>
              {products.map((product, index) => (
                <View
                  key={product.id}
                  style={[
                    styles.productRow,
                    index < products.length - 1 && styles.productRowBorder,
                  ]}
                >
                  <View style={styles.productIconContainer}>
                    <Ionicons name="cube-outline" size={22} color="#6C63FF" />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{product.nombre}</Text>
                    <Text style={styles.productCategory}>{product.categoria}</Text>
                  </View>
                  <View style={styles.productPriceCol}>
                    <Text style={styles.productQty}>x{product.cantidad}</Text>
                    <Text style={styles.productPrice}>S/ {(product.precio * product.cantidad).toFixed(2)}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Resumen de Pago */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumen de pago</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>S/ {subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Envío</Text>
                  <Text style={styles.summaryValue}>
                    {envio === 0 ? 'Gratis' : `S/ ${envio.toFixed(2)}`}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>S/ {total.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            {/* Dirección de entrega */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dirección de entrega</Text>
              <View style={styles.addressCard}>
                <Ionicons name="location" size={20} color="#6C63FF" style={{ marginRight: 12 }} />
                <View>
                  <Text style={styles.addressName}>Daniel Barbera</Text>
                  <Text style={styles.addressText}>Av. Siempreviva 742, Miraflores</Text>
                  <Text style={styles.addressText}>Lima, Perú</Text>
                </View>
              </View>
            </View>

          </ScrollView>

          {/* Footer */}
          {order.statusType === 'active' && (
            <View style={styles.footer}>
              <TouchableOpacity style={styles.trackBtn}>
                <Ionicons name="navigate-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.trackBtnText}>Rastrear en mapa</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
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
    maxHeight: SCREEN_HEIGHT * 0.88,
    paddingBottom: 30,
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
    alignItems: 'flex-start',
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
  modalDate: {
    fontSize: 13,
    color: isDark ? '#888' : '#999',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
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
    paddingTop: 10,
    paddingBottom: 10,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: isDark ? '#888' : '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  // Timeline
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 28,
    width: 2,
    height: 28,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    zIndex: 1,
  },
  timelineIconCurrent: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 6,
  },
  timelineLabel: {
    fontSize: 14,
    color: isDark ? '#888' : '#aaa',
    fontWeight: '500',
  },
  timelineCurrent: {
    fontSize: 12,
    color: '#6C63FF',
    marginTop: 2,
    fontWeight: '600',
  },
  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#2C1010' : '#FFEBEE',
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
    gap: 10,
  },
  cancelledText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600',
  },
  // Productos
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  productRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#2C2C2C' : '#F1F2F6',
  },
  productIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: isDark ? '#2A244D' : '#F4F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#2D3436',
    lineHeight: 20,
  },
  productCategory: {
    fontSize: 12,
    color: isDark ? '#888' : '#aaa',
    marginTop: 2,
  },
  productPriceCol: {
    alignItems: 'flex-end',
  },
  productQty: {
    fontSize: 12,
    color: isDark ? '#888' : '#aaa',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: isDark ? '#8A84FF' : '#6C63FF',
  },
  // Resumen
  summaryCard: {
    backgroundColor: isDark ? '#121212' : '#F8F9FE',
    borderRadius: 16,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: isDark ? '#888' : '#999',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#E0E0E0' : '#2D3436',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: isDark ? '#2C2C2C' : '#EEEEEE',
    paddingTop: 10,
    marginBottom: 0,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: isDark ? '#FFFFFF' : '#1A1A2E',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: isDark ? '#8A84FF' : '#6C63FF',
  },
  // Dirección
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: isDark ? '#121212' : '#F8F9FE',
    borderRadius: 16,
    padding: 16,
  },
  addressName: {
    fontSize: 14,
    fontWeight: '700',
    color: isDark ? '#FFFFFF' : '#2D3436',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: isDark ? '#888' : '#636E72',
    lineHeight: 20,
  },
  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#2C2C2C' : '#F1F2F6',
  },
  trackBtn: {
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 16,
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default DetallePedidoModal;
