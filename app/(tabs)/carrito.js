import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const CarritoScreen = () => {
  // Estado inicial de ejemplo con productos de ferretería
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      nombre: 'Taladro Percutor 650W',
      precio: 189.90,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      nombre: 'Juego de Destornilladores 6 Piezas',
      precio: 45.50,
      cantidad: 2,
      imagen: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      nombre: 'Cinta Métrica 5m',
      precio: 18.00,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/150',
    },
  ]);

  // Manejar incremento de cantidad
  const handleIncrease = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  // Manejar decremento de cantidad
  const handleDecrease = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  // Eliminar producto
  const handleRemove = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Vaciar carrito completo
  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    Alert.alert(
      'Vaciar Carrito',
      '¿Estás seguro de que deseas eliminar todos los productos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Vaciar', style: 'destructive', onPress: () => setCartItems([]) },
      ]
    );
  };

  // Cálculos de montos
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );
  const envio = cartItems.length > 0 ? 15.00 : 0.00;
  const total = subtotal + envio;

  // Realizar pedido
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    Alert.alert('¡Éxito!', 'Tu pedido ha sido procesado correctamente.');
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartCard}>
      <Image
        source={{ uri: item.imagen }}
        style={styles.productImage}
      />
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.nombre}
          </Text>
          <TouchableOpacity onPress={() => handleRemove(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <Text style={styles.productPrice}>S/ {item.precio.toFixed(2)}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => handleDecrease(item.id)}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.cantidad}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => handleIncrease(item.id)}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mi Carrito</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearText}>Vaciar</Text>
          </TouchableOpacity>
        )}
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#999" />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>
            Explora nuestros productos y encuentra lo que necesitas para tus proyectos.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Resumen y Botón de Pago */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>S/ {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Envío</Text>
              <Text style={styles.summaryValue}>S/ {envio.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>S/ {total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Procesar Compra</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  clearText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    padding: 12,
    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#E8EAF6',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    flex: 1,
    marginRight: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyButton: {
    backgroundColor: '#F0F2FA',
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.05)',
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#999',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F2FA',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  checkoutButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    boxShadow: '0px 4px 10px rgba(108, 99, 255, 0.3)',
    elevation: 5,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CarritoScreen;
