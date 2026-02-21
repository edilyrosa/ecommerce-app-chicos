// app/page.jsx
"use client"
import { useState, useEffect } from "react";
import Header from "@/components/Header"
import PromoBanner from "@/components/PromoBanner"
import BottomNav from "@/components/BottomNav"
import ProductCard from "@/components/ProductCard";
import toast from "react-hot-toast";
import { ShoppingBag, Home, Hammer, Leaf, Bath, Search } from 'lucide-react';

export default function Home1() {
  const [productos, setProductos] = useState([])
  const [filteredProductos, setFilteredProductos] = useState([]) 
  const [loading, setLoading] = useState(true) 
  const [searchTerm, setSearchTerm] = useState('') 
  const [category, setCategory] = useState('todas')
  const [zoomedProductId, setZoomedProductId] = useState(null) // Estado para el producto en zoom

  const fetchProductos = async () => {
    try {
      const res = await fetch("api/productos")
      if(res.ok){
        const data = await res.json()
        setProductos(data)
        setFilteredProductos(data)
      } else {
        toast.error('Error al cargar los productos')
      }
    } catch (error) {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  // Filtrado combinado: Búsqueda + Categoría
  useEffect(() => {
    const filtered = productos.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'todas' || (p.categoria && p.categoria.toLowerCase() === category.toLowerCase());
      return matchesSearch && matchesCategory;
    })
    setFilteredProductos(filtered)
  }, [searchTerm, productos, category])

  // Función para obtener el icono dinámico
  const getCategoryIcon = () => {
    if (searchTerm) return <Search className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />;
    
    switch (category) {
      case 'hogar': return <Home className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />;
      case 'ferreteria': return <Hammer className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />;
      case 'jardineria': return <Leaf className="w-6 h-6 md:w-8 md:h-8 text-green-500" />;
      case 'baños': return <Bath className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />;
      default: return <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />;
    }
  };

  // Manejar click en producto (solo en desktop)
  const handleProductClick = (productId) => {
    if (window.innerWidth >= 768) { // Solo en MD+
      setZoomedProductId(productId)
    }
  }

  // Cerrar zoom
  const handleCloseZoom = () => {
    setZoomedProductId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header con props de búsqueda y categoría */}
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        setCategory={setCategory} 
        currentCategory={category}
      />
      
      {/* Banner promocional */}
      <div className="container mx-auto px-3 md:px-6">
        <div className="mt-3 md:mt-4 mb-4 md:mb-6">
          <PromoBanner />
        </div>
      </div>

      <main className="container mx-auto px-3 md:px-6">
        {/* SECCIÓN DEL TÍTULO ESTILIZADO */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 tracking-tight">
              {category !== 'todas' ? (
                `Categoría: ${category.charAt(0).toUpperCase() + category.slice(1)}`
              ) : searchTerm ? (
                <span>Resultados para <span className="text-blue-600">{searchTerm}</span></span>
              ) : (
                'Nuestros Productos'
              )}
            </h1>
            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 animate-bounce-short">
              {getCategoryIcon()}
            </div>
          </div>

          <div className="mt-3 w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />

          {!loading && filteredProductos.length > 0 && (
            <p className="text-sm md:text-base text-gray-500 mt-2 font-medium">
              {filteredProductos.length} {filteredProductos.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
          )}
        </div>

        {/* ESTADOS DE CARGA Y RESULTADOS */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="bg-gray-200 h-40 md:h-48 rounded-lg mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-3"></div>
                <div className="bg-gray-200 h-8 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">No se encontraron productos</h3>
            <p className="text-sm md:text-base text-gray-500 mb-6">
              Prueba con otros términos o cambia la categoría seleccionada.
            </p>
            <button
              onClick={() => {setSearchTerm(''); setCategory('todas');}}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <>
            {/* GRID DE PRODUCTOS */}
            <div className={`products-grid-zoom grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8 mb-10 ${zoomedProductId ? 'has-zoomed' : ''}`}>
              {filteredProductos.map(producto => (
                <ProductCard 
                  key={producto.id} 
                  producto={producto}
                  onClick={() => handleProductClick(producto.id)}
                  isZoomed={zoomedProductId === producto.id}
                  onClose={handleCloseZoom}
                />
              ))}
            </div>

            {/* OVERLAY OSCURO cuando hay zoom */}
            {zoomedProductId && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-fadeIn"
                onClick={handleCloseZoom}
              />
            )}
          </>
        )}
      </main>

      <BottomNav setCategory={setCategory} currentCategory={category} />

      {/* ESTILOS GLOBALES */}
   


<style jsx global>{`
  @keyframes bounce-short {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  .animate-bounce-short {
    animation: bounce-short 2s ease-in-out infinite;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  /* ZOOM CON CLICK - Solo en pantallas >= MD (768px+) */
  @media (min-width: 768px) {
    .products-grid-zoom {
      padding: 1rem 0;
    }

    .products-grid-zoom .product-card-zoom {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    /* Card en estado zoom (centrada) - AQUÍ ESTÁ EL CAMBIO */
    .products-grid-zoom .product-card-zoom.zoomed {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(2); /* ← CAMBIO: scale(1) a scale(2) */
      z-index: 100;
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.5);
      animation: zoomIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes zoomIn {
      from {
        transform: translate(-50%, -50%) scale(0.5); /* ← CAMBIO: scale(0.8) a scale(0.5) */
        opacity: 0;
      }
      to {
        transform: translate(-50%, -50%) scale(2); /* ← CAMBIO: scale(1) a scale(2) */
        opacity: 1;
      }
    }

    /* Cards hermanas cuando hay una en zoom */
    .products-grid-zoom.has-zoomed .product-card-zoom:not(.zoomed) {
      transform: scale(0.85);
      opacity: 0.3;
      filter: blur(3px) grayscale(40%);
      pointer-events: none;
    }
  }

  /* En móvil (<768px) sin efecto zoom */
  @media (max-width: 767px) {
    .products-grid-zoom .product-card-zoom:active {
      transform: scale(0.97);
    }
  }
`}</style>


    </div>
  );
}