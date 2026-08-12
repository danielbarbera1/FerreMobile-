import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
  Modal,
  Dimensions,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "https://creaci-n-de-ap-is-rest.vercel.app";

const API = {
  productos: `${BASE_URL}/api/productos`,
  productoById: (id) => `${BASE_URL}/api/productos/${id}`,
  categorias: `${BASE_URL}/api/categorias`,
  productosByCategory: (slug) => `${BASE_URL}/api/productos/categories/${slug}`,
  searchProductos: (q) => `${BASE_URL}/api/productos/search?q=${encodeURIComponent(q)}`,
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const PROMOS = [
  { id: "1", title: "20% DE DESCUENTO", subtitle: "En herramientas eléctricas", code: "PROMO20", color: "#6C63FF", icon: "flash-outline" },
  { id: "2", title: "ENVÍO GRATIS", subtitle: "En compras mayores a $150", code: "ENVIOGRATIS", color: "#FF6B6B", icon: "car-outline" },
  { id: "3", title: "NUEVOS PRODUCTOS", subtitle: "Equipos de seguridad 2025", code: "NUEVO25", color: "#00B894", icon: "star-outline" },
];

const CATEGORY_ICONS = {
  "herramientas-manuales": "hammer-outline",
  "herramientas-electricas": "flash-outline",
  "fijaciones-y-tornilleria": "git-branch-outline",
  electricidad: "bulb-outline",
  "plomeria-y-griferia": "water-outline",
  "pinturas-y-acabados": "color-palette-outline",
  "construccion-y-seguridad": "shield-outline",
};

const DEFAULT_CATEGORY = { id: "all", name: "Todos", slug: "all", icon: "grid-outline" };

const STOCK_STATUS = {
  "In Stock": { color: "#00B894", label: "En Stock" },
  "Out of Stock": { color: "#FF6B6B", label: "Sin Stock" },
  "Low Stock": { color: "#FDCB6E", label: "Stock Bajo" },
};

const normalize = (val, fallback = "") => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "object") return val.nombre || val.name || fallback;
  return String(val);
};

const toFloat = (val) => {
  if (!val && val !== 0) return 0;
  return typeof val === "number" ? val : parseFloat(val) || 0;
};

const InfoCard = ({ icon, label, value }) => (
  <View style={modalStyles.infoCard}>
    <Ionicons name={icon} size={18} color="#6C63FF" />
    <Text style={modalStyles.infoLabel}>{label}</Text>
    <Text style={modalStyles.infoValue}>{value}</Text>
  </View>
);

const ProductDetailModal = ({ visible, product, onClose, onAddToCart }) => {
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (visible && product) {
      fetchDetail(product.id_producto || product.id);
    } else {
      setDetail(null);
    }
  }, [visible, product]);

  const fetchDetail = async (id) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(API.productoById(id));
      if (res.ok) {
        const data = await res.json();
        setDetail(data);
      }
    } catch (e) {
      console.error("Error al obtener detalle:", e);
    } finally {
      setLoadingDetail(false);
    }
  };

  if (!product) return null;

  const nombre = normalize(detail?.nombre || product?.nombre_producto, "Producto");
  const descripcion = normalize(detail?.descripcion || product?.descripcion_detallada, "Sin descripción disponible.");
  const marca = normalize(detail?.marca || product?.marca, "Sin marca");
  const categoria = normalize(detail?.categoria || product?.categoria, "General");
  const precio = toFloat(detail?.inventario?.precio ?? product?.precio_publico);
  const costo = toFloat(detail?.inventario?.costo ?? product?.costo_proveedor);
  const stock = detail?.inventario?.stock ?? product?.stock_actual ?? 0;
  const estadoRaw = detail?.inventario?.estado || "In Stock";
  const stockInfo = STOCK_STATUS[estadoRaw] || STOCK_STATUS["In Stock"];
  const unidad = normalize(detail?.unidad, "Unidad");
  const fullLocation = detail?.ubicacion?.fullLocation || null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <TouchableOpacity style={modalStyles.backdrop} onPress={onClose} />
        <View style={modalStyles.sheet}>
          <View style={modalStyles.handle} />
          <View style={modalStyles.imageWrapper}>
            <Image
              source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=E8EAF6&color=6C63FF&size=200&bold=true` }}
              style={modalStyles.productImage}
              resizeMode="contain"
            />
            <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color="#2D3436" />
            </TouchableOpacity>
          </View>

          <ScrollView style={modalStyles.infoScroll} showsVerticalScrollIndicator={false}>
            {loadingDetail ? (
              <View style={modalStyles.loadingRow}>
                <ActivityIndicator size="small" color="#6C63FF" />
                <Text style={modalStyles.loadingText}>Cargando detalles...</Text>
              </View>
            ) : (
              <>
                <View style={modalStyles.topRow}>
                  <View style={modalStyles.categoryPill}>
                    <Text style={modalStyles.categoryPillText}>{categoria}</Text>
                  </View>
                  <View style={[modalStyles.stockPill, { backgroundColor: stockInfo.color + "20" }]}>
                    <View style={[modalStyles.stockDot, { backgroundColor: stockInfo.color }]} />
                    <Text style={[modalStyles.stockText, { color: stockInfo.color }]}>{stockInfo.label}</Text>
                  </View>
                </View>

                <Text style={modalStyles.productName}>{nombre}</Text>

                <View style={modalStyles.priceRow}>
                  <Text style={modalStyles.price}>${precio.toFixed(2)}</Text>
                  <Text style={modalStyles.priceLabel}>/ {unidad}</Text>
                </View>

                <Text style={modalStyles.sectionTitle}>Descripción</Text>
                <Text style={modalStyles.description}>{descripcion}</Text>

                <Text style={modalStyles.sectionTitle}>Información</Text>
                <View style={modalStyles.infoGrid}>
                  <InfoCard icon="tag-outline" label="Marca" value={marca} />
                  <InfoCard icon="layers-outline" label="Stock" value={`${stock} ${unidad}`} />
                  {fullLocation && <InfoCard icon="location-outline" label="Ubicación" value={fullLocation} />}
                  <InfoCard icon="pricetag-outline" label="Costo" value={`$${costo.toFixed(2)}`} />
                </View>
              </>
            )}
          </ScrollView>

          <View style={modalStyles.footer}>
            <TouchableOpacity
              style={[modalStyles.addBtn, stock <= 0 && { backgroundColor: "#ccc" }]}
              onPress={() => {
                if (stock > 0) {
                  onAddToCart({ nombre, precio, stock });
                  onClose();
                }
              }}
              disabled={stock <= 0}
            >
              <Ionicons name="cart-outline" size={20} color="#FFF" />
              <Text style={modalStyles.addBtnText}>{stock > 0 ? "Agregar al carrito" : "Sin disponibilidad"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const InicioScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([DEFAULT_CATEGORY]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchMode, setSearchMode] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch(API.categorias);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        const mapped = list.map((c) => ({
          id: String(c.id_categoria || c.id),
          name: c.nombre_categoria || c.nombre || "Categoría",
          slug: c.slug || (c.nombre_categoria || "").toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
          icon: CATEGORY_ICONS[c.slug] || "build-outline",
        }));
        setCategories([DEFAULT_CATEGORY, ...mapped]);
      }
    } catch (e) {
      console.log("Error al cargar categorías:", e);
    }
  };

  const fetchProducts = async (categorySlug = "all", pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      let url;
      if (categorySlug === "all") {
        url = `${API.productos}?page=${pageNum}&limit=10`;
      } else {
        url = `${API.productosByCategory(categorySlug)}?page=${pageNum}&limit=10`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.products || data.data || [];
        const tp = data.totalPages || 1;
        setTotalPages(tp);
        setProducts((prev) => (append ? [...prev, ...list] : list));
      } else {
        if (!append) setProducts([]);
      }
    } catch (e) {
      console.error("Error al cargar productos:", e);
      if (!append) setProducts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const fetchSearch = async (q) => {
    if (!q.trim()) {
      setSearchMode(false);
      setSearchLoading(false);
      fetchProducts(selectedCategory === "all" ? "all" : selectedCategory);
      return;
    }
    setSearchMode(true);
    setSearchLoading(true);
    try {
      const res = await fetch(API.searchProductos(q));
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.products || data.data || [];
        setProducts(list);
      }
    } catch (e) {
      console.error("Error en búsqueda:", e);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleSelectCategory = (cat) => {
    if (searchMode) return;
    setSelectedCategory(cat.id);
    setPage(1);
    fetchProducts(cat.id === "all" ? "all" : cat.slug, 1, false);
  };

  const handleLoadMore = () => {
    if (loadingMore || searchMode || page >= totalPages) return;
    const next = page + 1;
    setPage(next);
    const cat = categories.find((c) => c.id === selectedCategory);
    fetchProducts(selectedCategory === "all" ? "all" : cat?.slug || "all", next, true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    const cat = categories.find((c) => c.id === selectedCategory);
    fetchProducts(selectedCategory === "all" ? "all" : cat?.slug || "all", 1);
  };

  const handleOpenDetail = (item) => {
    setSelectedProduct(item);
    setModalVisible(true);
  };

  const handleAddToCart = (product) => {
    Alert.alert("Añadido al carrito", `${product.nombre} — $${product.precio.toFixed(2)}`, [{ text: "OK" }]);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appName}>FerreBarPE</Text>
          <Text style={styles.appTagline}>Tu ferretería de confianza</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="#2D3436" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {!searchMode && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Promociones</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promosScroll} keyboardShouldPersistTaps="handled">
            {PROMOS.map((promo) => (
              <TouchableOpacity key={promo.id} activeOpacity={0.9} style={[styles.promoCard, { backgroundColor: promo.color }]}>
                <View style={styles.promoIconCircle}>
                  <Ionicons name={promo.icon} size={22} color={promo.color} />
                </View>
                <View style={styles.promoContent}>
                  <Text style={styles.promoBadge}>Especial</Text>
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoSubtitle}>{promo.subtitle}</Text>
                </View>
                <View style={styles.promoCodeRow}>
                  <Text style={[styles.promoCode, { color: promo.color }]}>{promo.code}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {!searchMode && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorías</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} keyboardShouldPersistTaps="handled">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                  onPress={() => handleSelectCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={cat.icon} size={16} color={isSelected ? "#FFFFFF" : "#6C63FF"} style={{ marginRight: 6 }} />
                  <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{searchMode ? `"${searchQuery}"` : "Catálogo"}</Text>
        <Text style={styles.productsCount}>{products.length} productos</Text>
      </View>
    </View>
  );

  const renderProductItem = ({ item }) => {
    const nombre = normalize(item.nombre_producto || item.nombre, "Producto sin nombre");
    const categoria = normalize(item.categoria, "Ferretería");
    const precio = toFloat(
      item.precio_publico ??
      item.inventario?.precio_publico ??
      item.inventario?.precio
    );
    const stock =
      item.stock_actual ??
      item.inventario?.stock_actual ??
      item.inventario?.stock ??
      0;
    const marca = normalize(item.marca, "");
    const estadoRaw = item.inventario?.estado || (stock > 0 ? "In Stock" : "Out of Stock");
    const stockInfo = STOCK_STATUS[estadoRaw] || STOCK_STATUS["In Stock"];
    const imageUri = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=E8EAF6&color=6C63FF&size=200&bold=true`;

    return (
      <TouchableOpacity style={styles.productCard} onPress={() => handleOpenDetail(item)} activeOpacity={0.92}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.productImage} resizeMode="contain" />
          <View style={[styles.stockBadge, { backgroundColor: stockInfo.color + "22" }]}>
            <View style={[styles.stockDot, { backgroundColor: stockInfo.color }]} />
            <Text style={[styles.stockBadgeText, { color: stockInfo.color }]}>{stockInfo.label}</Text>
          </View>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.categoryTag}>{categoria}</Text>
          <Text style={styles.productName} numberOfLines={2}>{nombre}</Text>
          {!!marca && <Text style={styles.brandText}>{marca}</Text>}
          <View style={styles.stockRow}>
            <Ionicons name="cube-outline" size={12} color="#aaa" />
            <Text style={styles.stockText}>Stock: {stock}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>${precio.toFixed(2)}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => handleOpenDetail(item)}>
              <Ionicons name="eye-outline" size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Ver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#6C63FF" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />

      {/* Buscador fijo fuera del FlatList para que nunca pierda el foco */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar herramientas, pinturas..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchLoading && <ActivityIndicator size="small" color="#6C63FF" style={{ marginRight: 6 }} />}
          {searchQuery.length > 0 && !searchLoading && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item, index) => (item.id_producto ? item.id_producto.toString() : item.id ? item.id.toString() : index.toString())}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#6C63FF"]} tintColor="#6C63FF" />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={56} color="#ccc" />
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptyText}>No se encontraron productos.</Text>
            </View>
          }
        />
      )}

      <ProductDetailModal
        visible={modalVisible}
        product={selectedProduct}
        onClose={() => { setModalVisible(false); setSelectedProduct(null); }}
        onAddToCart={handleAddToCart}
      />
    </SafeAreaView>
  );
};

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 30, borderTopRightRadius: 30, maxHeight: SCREEN_HEIGHT * 0.9, paddingBottom: 30 },
  handle: { width: 40, height: 5, borderRadius: 3, backgroundColor: "#E0E0E0", alignSelf: "center", marginTop: 12, marginBottom: 8 },
  imageWrapper: { alignItems: "center", backgroundColor: "#F3F4FB", paddingVertical: 24, position: "relative" },
  productImage: { width: SCREEN_WIDTH * 0.55, height: 180 },
  closeBtn: { position: "absolute", top: 14, right: 18, backgroundColor: "#FFFFFF", width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 4 },
  infoScroll: { paddingHorizontal: 22, paddingTop: 18 },
  loadingRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 30 },
  loadingText: { color: "#999", fontSize: 14, marginLeft: 10 },
  topRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  categoryPill: { backgroundColor: "#EDE9FE", paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20, marginRight: 8 },
  categoryPillText: { color: "#6C63FF", fontSize: 12, fontWeight: "600" },
  stockPill: { flexDirection: "row", alignItems: "center", paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20 },
  stockDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  stockText: { fontSize: 12, fontWeight: "600" },
  productName: { fontSize: 22, fontWeight: "800", color: "#1A1A2E", marginBottom: 8, lineHeight: 28 },
  priceRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 20 },
  price: { fontSize: 28, fontWeight: "900", color: "#6C63FF", marginRight: 6 },
  priceLabel: { fontSize: 14, color: "#aaa" },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#2D3436", marginBottom: 8, marginTop: 4 },
  description: { fontSize: 14, color: "#636E72", lineHeight: 22, marginBottom: 20 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 24 },
  infoCard: { backgroundColor: "#F8F9FE", borderRadius: 14, padding: 14, alignItems: "center", width: (SCREEN_WIDTH - 44 - 10) / 2, margin: 5 },
  infoLabel: { fontSize: 11, color: "#aaa", marginTop: 4, textTransform: "uppercase", fontWeight: "600" },
  infoValue: { fontSize: 13, color: "#2D3436", fontWeight: "700", textAlign: "center" },
  footer: { paddingHorizontal: 22, paddingTop: 10 },
  addBtn: { backgroundColor: "#6C63FF", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, borderRadius: 16 },
  addBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700", marginLeft: 8 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FE" },
  listContent: { paddingHorizontal: 18, paddingBottom: 40 },
  headerContainer: { paddingTop: 12, paddingBottom: 10 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  appName: { fontSize: 28, fontWeight: "900", color: "#6C63FF", letterSpacing: -0.5 },
  appTagline: { fontSize: 12, color: "#aaa", marginTop: 2 },
  iconButton: { backgroundColor: "#FFFFFF", width: 46, height: 46, borderRadius: 15, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3, position: "relative" },
  notificationDot: { position: "absolute", top: 11, right: 11, width: 8, height: 8, borderRadius: 4, backgroundColor: "#FF6B6B", borderWidth: 1.5, borderColor: "#FFF" },
  searchWrapper: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 6, backgroundColor: "#F8F9FE" },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 16, paddingHorizontal: 16, height: 52, borderWidth: 1.5, borderColor: "#EDE9FE", shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: "#2D3436" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1A1A2E" },
  productsCount: { fontSize: 13, color: "#aaa", fontWeight: "500" },
  promosScroll: { marginBottom: 18 },
  promoCard: { width: 240, borderRadius: 22, padding: 18, marginRight: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 6 },
  promoIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.9)", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  promoContent: { marginBottom: 10 },
  promoBadge: { color: "rgba(255,255,255,0.75)", fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  promoTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "900", lineHeight: 22 },
  promoSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 3 },
  promoCodeRow: { backgroundColor: "rgba(255,255,255,0.95)", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, alignSelf: "flex-start" },
  promoCode: { fontSize: 12, fontWeight: "800" },
  categoriesScroll: { marginBottom: 18 },
  categoryChip: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 22, marginRight: 10, borderWidth: 1.5, borderColor: "#EDE9FE", shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  categoryChipSelected: { backgroundColor: "#6C63FF", borderColor: "#6C63FF" },
  categoryChipText: { fontSize: 13, fontWeight: "600", color: "#2D3436" },
  categoryChipTextSelected: { color: "#FFFFFF" },
  productCard: { backgroundColor: "#FFFFFF", borderRadius: 18, marginBottom: 14, flexDirection: "row", padding: 14, shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  imageContainer: { position: "relative" },
  productImage: { width: 100, height: 100, borderRadius: 14, backgroundColor: "#F3F4FB" },
  stockBadge: { position: "absolute", bottom: 6, left: 0, right: 0, marginHorizontal: 4, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 3, paddingHorizontal: 8, borderRadius: 8 },
  stockDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  stockBadgeText: { fontSize: 9, fontWeight: "700" },
  productInfo: { flex: 1, marginLeft: 14, justifyContent: "space-between" },
  categoryTag: { fontSize: 10, color: "#aaa", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  productName: { fontSize: 14, fontWeight: "800", color: "#1A1A2E", marginTop: 3, lineHeight: 20 },
  brandText: { fontSize: 11, color: "#aaa", marginTop: 2 },
  stockRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  stockText: { fontSize: 11, color: "#aaa", marginLeft: 4 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  productPrice: { fontSize: 18, fontWeight: "900", color: "#6C63FF" },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#6C63FF", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12 },
  addButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700", marginLeft: 4 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 15, color: "#aaa" },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: "#2D3436", marginTop: 10 },
  emptyText: { fontSize: 14, color: "#aaa", textAlign: "center", paddingHorizontal: 30 },
  footerLoader: { paddingVertical: 20, alignItems: "center" },
});

export default InicioScreen;
