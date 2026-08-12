# 🛠️ FerreBarPE - App Móvil

FerreBarPE es una aplicación móvil desarrollada en **React Native con Expo**, diseñada para gestionar y explorar el catálogo de una ferretería. Permite a los usuarios buscar productos, filtrar por categorías, ver detalles completos (incluyendo stock, precio, ubicación en tienda) y agregar herramientas a su carrito de compras.

---

## ✨ Características Principales

*   **🏠 Inicio Interactivo:** Un dashboard moderno con promociones destacadas, acceso rápido a categorías y un catálogo completo.
*   **🔍 Búsqueda en Tiempo Real:** Barra de búsqueda optimizada que muestra resultados dinámicamente sin interrumpir la experiencia del usuario (debounce de 500ms y teclado persistente).
*   **🏷️ Categorías Dinámicas:** Los productos se pueden filtrar por categorías extraídas directamente desde la base de datos (Electricidad, Plomería, Herramientas, etc.).
*   **📦 Detalles del Producto:** Un modal (Bottom Sheet) que muestra información detallada: marca, precio, costo, stock disponible (con badges visuales), y ubicación física en la tienda.
*   **📱 Diseño Moderno (UI/UX):** 
    *   Bottom Tab Navigation personalizada (flotante, con sombras y bordes redondeados).
    *   Uso de `Ionicons` para una iconografía limpia y consistente.
    *   Feedback háptico y transiciones suaves.
*   **🔄 Paginación y Refresh:** Soporte para "Pull-to-refresh" y carga progresiva de productos (Infinite Scroll).

---

## 🚀 Tecnologías Utilizadas

*   **Framework:** [React Native](https://reactnative.dev/)
*   **Plataforma/Toolchain:** [Expo](https://expo.dev/) (Expo Router para navegación)
*   **Navegación:** `expo-router` (Tabs Navigation)
*   **Iconos:** `@expo/vector-icons` (Ionicons)
*   **Backend / API:** API REST externa alojada en Vercel (`https://creaci-n-de-ap-is-rest.vercel.app`)

---

## ⚙️ Configuración y Variables de Entorno

Para que la aplicación se comunique correctamente con el backend, necesitas un archivo `.env` en la raíz del proyecto.

Crea un archivo `.env` con el siguiente contenido:

```env
API_URL=https://creaci-n-de-ap-is-rest.vercel.app/api
EXPO_PUBLIC_API_BASE_URL=https://creaci-n-de-ap-is-rest.vercel.app
EXPO_PUBLIC_API_URL=https://creaci-n-de-ap-is-rest.vercel.app/api/productos
EXPO_PUBLIC_API_PRODUCTO_URL=https://creaci-n-de-ap-is-rest.vercel.app/api/productos/:id
EXPO_PUBLIC_API_CATEGORIAS_URL=https://creaci-n-de-ap-is-rest.vercel.app/api/productos/categories/:slug
EXPO_PUBLIC_API_LIST_CATEGORIAS_URL=https://creaci-n-de-ap-is-rest.vercel.app/api/categorias
EXPO_PUBLIC_API_MARCAS_URL=https://creaci-n-de-ap-is-rest.vercel.app/api/marcas
EXPO_PUBLIC_API_UBICACIONES_URL=https://creaci-n-de-ap-is-rest.vercel.app/api/ubicaciones
```

---

## 📦 Instalación y Ejecución

Sigue estos pasos para correr el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ferrebarpe
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npx expo start
   ```

4. **Probar la aplicación:**
   *   Descarga la app **Expo Go** en tu dispositivo iOS o Android.
   *   Escanea el código QR que aparece en la terminal (para Android) o usa la cámara de tu iPhone (para iOS).
   *   También puedes correrlo en un emulador presionando `a` (Android) o `i` (iOS) en la terminal.

---

## 📁 Estructura del Proyecto

```text
ferrebarpe/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.js      # Configuración del Bottom Tab Bar personalizado
│   │   ├── inicio.js       # Pantalla principal (Catálogo, búsqueda, categorías)
│   │   ├── carrito.js      # Pantalla del carrito de compras
│   │   └── cuenta.js       # Pantalla de perfil de usuario
│   ├── +not-found.js       # Pantalla de error 404
│   └── _layout.js          # Layout principal (Root)
├── assets/                 # Imágenes, fuentes e íconos estáticos
├── components/             # Componentes reutilizables de React
├── constants/              # Constantes globales y temas (Colores, etc.)
├── hooks/                  # Custom React Hooks
├── .env                    # Variables de entorno (API URLs)
├── app.json                # Configuración de Expo
└── package.json            # Dependencias y scripts
```

---

## 🌐 Endpoints de la API Consumidos

La aplicación interactúa con los siguientes endpoints principales:

*   `GET /api/productos` - Lista de productos (con soporte para paginación `?page=1&limit=10`).
*   `GET /api/productos/search?q={query}` - Búsqueda global de productos.
*   `GET /api/productos/categories/:slug` - Filtro de productos por categoría.
*   `GET /api/productos/:id` - Detalle completo de un producto.
*   `GET /api/categorias` - Lista de todas las categorías disponibles.

---
*Desarrollado para facilitar la gestión y venta de productos ferreteros.* 🔩🔧
