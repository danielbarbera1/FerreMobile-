import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DetallePedidoModal from './detalle-pedidos';

const FILTER_TABS = [
  { id: 'todos', label: 'Todos' },
  { id: 'activos', label: 'Activos' },
  { id: 'completados', label: 'Completados' },
];

const ORDERS_DATA = [
  {
    id: 'ORD-00123',
    date: '15 Ago, 2026',
    total: 'S/ 245.50',
    status: 'En camino',
    statusType: 'active', // active, completed, cancelled
    items: 3,
  },
  {
    id: 'ORD-00101',
    date: '10 Ago, 2026',
    total: 'S/ 1,200.00',
    status: 'Entregado',
    statusType: 'completed',
    items: 12,
  },
  {
    id: 'ORD-00085',
    date: '25 Jul, 2026',
    total: 'S/ 85.00',
    status: 'Entregado',
    statusType: 'completed',
    items: 1,
  },
  {
    id: 'ORD-00042',
    date: '02 Jul, 2026',
    total: 'S/ 320.00',
    status: 'Cancelado',
    statusType: 'cancelled',
    items: 4,
  },
];

const MisPedidosScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const [activeTab, setActiveTab] = useState('todos');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = ORDERS_DATA.filter(order => {
    if (activeTab === 'todos') return true;
    if (activeTab === 'activos') return order.statusType === 'active';
    if (activeTab === 'completados') return order.statusType === 'completed';
    return true;
  });

  const getStatusColor = (type) => {
    switch (type) {
      case 'active': return { bg: '#FFF3E0', text: '#FF9800' };
      case 'completed': return { bg: '#E8F5E9', text: '#4CAF50' };
      case 'cancelled': return { bg: '#FFEBEE', text: '#F44336' };
      default: return { bg: '#F5F5F5', text: '#9E9E9E' };
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'active': return 'time-outline';
      case 'completed': return 'checkmark-circle-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'ellipse-outline';
    }
  };

  const renderOrderCard = ({ item }) => {
    const colors = getStatusColor(item.statusType);
    
    return (
      <TouchableOpacity style={styles.orderCard} activeOpacity={0.7}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Pedido {item.id}</Text>
            <Text style={styles.orderDate}>{item.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
            <Ionicons name={getStatusIcon(item.statusType)} size={14} color={colors.text} style={{ marginRight: 4 }} />
            <Text style={[styles.statusText, { color: colors.text }]}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.orderDivider} />
        
        <View style={styles.orderFooter}>
          <View>
            <Text style={styles.orderItems}>{item.items} {item.items === 1 ? 'artículo' : 'artículos'}</Text>
            <Text style={styles.orderTotal}>Total: {item.total}</Text>
          </View>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => setSelectedOrder(item)}
          >
            <Text style={styles.detailsButtonText}>Ver detalles</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "#FFFFFF" : "#2D3436"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={60} color="#DCDDE1" />
            <Text style={styles.emptyTitle}>No hay pedidos</Text>
            <Text style={styles.emptySubtitle}>Aún no tienes pedidos en esta categoría.</Text>
          </View>
        }
      />

      <DetallePedidoModal
        visible={selectedOrder !== null}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
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
  tabsContainer: {
    marginBottom: 10,
  },
  tabsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 5,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    marginRight: 10,
    borderWidth: 1,
    borderColor: isDark ? '#2C2C2C' : '#EEEEEE',
  },
  tabButtonActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#BBBBBB' : '#636E72',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    boxShadow: isDark ? 'none' : '0px 2px 6px rgba(0, 0, 0, 0.04)',
    elevation: isDark ? 0 : 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#2D3436',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: isDark ? '#888' : '#999',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDivider: {
    height: 1,
    backgroundColor: isDark ? '#2C2C2C' : '#F1F2F6',
    marginVertical: 15,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  orderItems: {
    fontSize: 13,
    color: isDark ? '#BBBBBB' : '#636E72',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A2E',
  },
  detailsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDark ? '#8A84FF' : '#6C63FF',
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: isDark ? '#8A84FF' : '#6C63FF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#2D3436',
    marginTop: 15,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: isDark ? '#888' : '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default MisPedidosScreen;
