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
      toast.error('Error de conexión 8')
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


  const handleProductClick = (productId) => {
  setZoomedProductId(productId) // Ahora se ejecuta siempre, sin importar el ancho
}
  // Cerrar zoom
  const handleCloseZoom = () => {
    setZoomedProductId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8 ">
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

            <div className="mt-3 w-16 h-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full" />

            {!loading && filteredProductos.length > 0 && (
              <p className="text-sm md:text-base text-gray-500 mt-2 font-medium">
                {filteredProductos.length} {filteredProductos.length === 1 ? 'producto encontrado' : 'productos encontrados'}
              </p>
            )}
          </div>

          {/* //*ESTADOS DE CARGA Y RESULTADOS: Skeleton */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="bg-gray-200 h-40 md:h-48 rounded-lg mb-3"></div>
                  <div className="bg-yellow-100 h-4 rounded mb-2"></div>
                  
                  <div className="flex justify-between items-center gap-2">
                    <div className="w-[70%] flex-1 bg-gray-200 h-10 rounded"></div>
                    <div className="bg-blue-200 h-10 w-10 rounded-full m"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProductos.length === 0 ? (
              <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-md border border-blue-50">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
                <span className="text-2xl md:text-3xl">🔍</span>
              </div>
              <p className="text-base md:text-lg text-gray-600 mb-4 font-semibold">
                No se encontraron productos con  el termino: {searchTerm}
              </p>
              <button 
                onClick={() => setSearchTerm('')} 
                className="px-6 py-2.5 rounded-xl font-bold text-sm md:text-base transition-all shadow-lg"
                style={{ backgroundColor: '#00162f', color: 'white' }}
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <>
              {/* GRID DE PRODUCTOS */}
              <div className={`products-grid-zoom grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                gap-3 md:gap-6 lg:gap-8 mb-10 ${zoomedProductId ? 'has-zoomed' : ''}`}>
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
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-90 animate-fadeIn"
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

          /* Responsive para móviles */
          @media(max-width:768px) {
            .products-grid-zoom .product-card-zoom.zoomed {
              margin: 0.5rem 1rem 1rem 0;
              max-width: 90vw;
            }
          }
          
          /* Estilos para desktop */
          @media(min-width:768px) {
            .products-grid-zoom .product-card-zoom.zoomed {
              max-width: 45vw;
            }
          }

          .products-grid-zoom .product-card-zoom {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }

          /* CARD EN ZOOM - CONTROL DE TAMAÑO */
          .products-grid-zoom .product-card-zoom.zoomed {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1.5);
            z-index: 100;
            
            /* TAMAÑO MÁXIMO CONTROLADO */
            height: 55vh;
            width: 60vw;
            max-height: 90vh;
            
            /* SCROLL INTERNO PARA CONTENIDO SOBRANTE */
            overflow-y: auto;
            overflow-x: hidden;
            
            /* ESTILOS */
            box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.5);
            animation: zoomIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            
            /* IMPORTANTE: La card NO crecerá más de 95vh */
            display: flex;
            flex-direction: column;
          }

          /* ÁREA DE CONTENIDO CON SCROLL INDEPENDIENTE */
          .products-grid-zoom .product-card-zoom.zoomed .product-content {
            flex: 1;
            overflow-y: auto;
            min-height: 0; /* IMPORTANTE: Permite que el scroll funcione correctamente */
          }

          /* IMAGEN EN ZOOM - TAMAÑO CONTROLADO */
          .products-grid-zoom .product-card-zoom.zoomed .product-image-container {
            flex-shrink: 0;
          }

          /* DESCRIPCIÓN EN ZOOM - CON ALTURA FIJA */
          .products-grid-zoom .product-card-zoom.zoomed .description-container {
            max-height: 120px; /* Altura fija para la descripción */
            overflow-y: auto;
          }

          /* BOTÓN VER MÁS - SIN AFECTAR ALTURA */
          .products-grid-zoom .product-card-zoom.zoomed .ver-mas-btn {
            margin-top: 4px;
            margin-bottom: 4px;
          }

          @keyframes zoomIn {
            from {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 0;
            }
            to {
              transform: translate(-50%, -50%) scale(1.5);
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
        `}</style>

    </div>
  );
}

