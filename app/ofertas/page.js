// // // app/page.jsx
// // "use client"
// // import { useState, useEffect } from "react";
// // import Header from "@/components/Header"
// // import PromoBanner from "@/components/PromoBanner"
// // import BottomNav from "@/components/BottomNav"
// // import ProductCard from "@/components/ProductCard";
// // import toast from "react-hot-toast";
// // import { ShoppingBag, Home, Hammer, Leaf, Bath, Search } from 'lucide-react';

// // export default function Home1() {
// //   const [productos, setProductos] = useState([])
// //   const [filteredProductos, setFilteredProductos] = useState([]) 
// //   const [loading, setLoading] = useState(true) 
// //   const [searchTerm, setSearchTerm] = useState('') 
// //   const [category, setCategory] = useState('todas')
// //   const [zoomedProductId, setZoomedProductId] = useState(null) // Estado para el producto en zoom

// //   const fetchProductos = async () => {
// //     try {
// //       const res = await fetch("api/productos")
// //       if(res.ok){
// //         const data = await res.json()
// //         setProductos(data)
// //         setFilteredProductos(data)
// //       } else {
// //         toast.error('Error al cargar los productos')
// //       }
// //     } catch (error) {
// //       toast.error('Error de conexión 4')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     fetchProductos()
// //   }, [])

// //   // Filtrado combinado: Búsqueda + Categoría
// //   useEffect(() => {
// //     const filtered = productos.filter(p => {
// //       const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
// //       const matchesCategory = category === 'todas' || (p.categoria && p.categoria.toLowerCase() === category.toLowerCase());
// //       return matchesSearch && matchesCategory;
// //     })
// //     setFilteredProductos(filtered)
// //   }, [searchTerm, productos, category])

// //   // Función para obtener el icono dinámico
// //   const getCategoryIcon = () => {
// //     if (searchTerm) return <Search className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />;
    
// //     switch (category) {
// //       case 'hogar': return <Home className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />;
// //       case 'ferreteria': return <Hammer className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />;
// //       case 'jardineria': return <Leaf className="w-6 h-6 md:w-8 md:h-8 text-green-500" />;
// //       case 'baños': return <Bath className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />;
// //       default: return <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />;
// //     }
// //   };

// //   // Manejar click en producto (solo en desktop)
// //   const handleProductClick = (productId) => {
// //     if (window.innerWidth >= 768) { // Solo en MD+
// //       setZoomedProductId(productId)
// //     }
// //   }

// //   // Cerrar zoom
// //   const handleCloseZoom = () => {
// //     setZoomedProductId(null)
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
// //       {/* Header con props de búsqueda y categoría */}
// //       <Header 
// //         searchTerm={searchTerm} 
// //         setSearchTerm={setSearchTerm}
// //         setCategory={setCategory} 
// //         currentCategory={category}
// //       />
      
// //       {/* Banner promocional */}
// //       <div className="container mx-auto px-3 md:px-6">
// //         <div className="mt-3 md:mt-4 mb-4 md:mb-6">
// //           <PromoBanner />
// //         </div>
// //       </div>

// //       <main className="container mx-auto px-3 md:px-6">
// //         {/* SECCIÓN DEL TÍTULO ESTILIZADO */}
// //         <div className="flex flex-col items-center justify-center mb-6">
// //           <div className="flex items-center justify-center gap-3">
// //             <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 tracking-tight">
// //               {category !== 'todas' ? (
// //                 `Categoría: ${category.charAt(0).toUpperCase() + category.slice(1)}`
// //               ) : searchTerm ? (
// //                 <span>Resultados para <span className="text-blue-600">{searchTerm}</span></span>
// //               ) : (
// //                 'Nuestros Productos'
// //               )}
// //             </h1>
// //             <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 animate-bounce-short">
// //               {getCategoryIcon()}
// //             </div>
// //           </div>

// //           <div className="mt-3 w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />

// //           {!loading && filteredProductos.length > 0 && (
// //             <p className="text-sm md:text-base text-gray-500 mt-2 font-medium">
// //               {filteredProductos.length} {filteredProductos.length === 1 ? 'producto encontrado' : 'productos encontrados'}
// //             </p>
// //           )}
// //         </div>

// //         {/* ESTADOS DE CARGA Y RESULTADOS */}
// //         {loading ? (
// //           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
// //             {[...Array(6)].map((_, i) => (
// //               <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
// //                 <div className="bg-gray-200 h-40 md:h-48 rounded-lg mb-3"></div>
// //                 <div className="bg-gray-200 h-4 rounded mb-2"></div>
// //                 <div className="bg-gray-200 h-4 rounded w-3/4 mb-3"></div>
// //                 <div className="bg-gray-200 h-8 rounded"></div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : filteredProductos.length === 0 ? (
// //            <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-md border border-blue-50">
// //             <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
// //               <span className="text-2xl md:text-3xl">🔍</span>
// //             </div>
// //             <p className="text-base md:text-lg text-gray-600 mb-4 font-semibold">
// //               No se encontraron productos con  el termino: {searchTerm}
// //             </p>
// //             <button 
// //               onClick={() => setSearchTerm('')} 
// //               className="px-6 py-2.5 rounded-xl font-bold text-sm md:text-base transition-all shadow-lg"
// //               style={{ backgroundColor: '#00162f', color: 'white' }}
// //             >
// //               Limpiar búsqueda
// //             </button>
// //           </div>
// //         ) : (
// //           <>
// //             {/* GRID DE PRODUCTOS */}
// //             <div className={`products-grid-zoom grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8 mb-10 ${zoomedProductId ? 'has-zoomed' : ''}`}>
// //               {filteredProductos.map(producto => (
// //                 <ProductCard 
// //                   key={producto.id} 
// //                   producto={producto}
// //                   onClick={() => handleProductClick(producto.id)}
// //                   isZoomed={zoomedProductId === producto.id}
// //                   onClose={handleCloseZoom}
// //                 />
// //               ))}
// //             </div>

// //             {/* OVERLAY OSCURO cuando hay zoom */}
// //             {zoomedProductId && (
// //               <div 
// //                 className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-fadeIn"
// //                 onClick={handleCloseZoom}
// //               />
// //             )}
// //           </>
// //         )}
// //       </main>

// //       <BottomNav setCategory={setCategory} currentCategory={category} />

// //       {/* ESTILOS GLOBALES */}
   


// // <style jsx global>{`
// //   @keyframes bounce-short {
// //     0%, 100% { transform: translateY(0); }
// //     50% { transform: translateY(-5px); }
// //   }
  
// //   .animate-bounce-short {
// //     animation: bounce-short 2s ease-in-out infinite;
// //   }

// //   @keyframes fadeIn {
// //     from { opacity: 0; }
// //     to { opacity: 1; }
// //   }

// //   .animate-fadeIn {
// //     animation: fadeIn 0.3s ease-out;
// //   }

// //   /* ZOOM CON CLICK - Solo en pantallas >= MD (768px+) */
// //   @media (min-width: 768px) {
// //     .products-grid-zoom {
// //       padding: 1rem 0;
// //     }

// //     .products-grid-zoom .product-card-zoom {
// //       transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
// //       cursor: pointer;
// //     }

// //     /* Card en estado zoom (centrada) - AQUÍ ESTÁ EL CAMBIO */
// //     .products-grid-zoom .product-card-zoom.zoomed {
// //       position: fixed;
// //       top: 50%;
// //       left: 50%;
// //       transform: translate(-50%, -50%) scale(2); /* ← CAMBIO: scale(1) a scale(2) */
// //       z-index: 100;
// //       max-width: 90vw;
// //       max-height: 90vh;
// //       overflow-y: auto;
// //       box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.5);
// //       animation: zoomIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
// //     }

// //     @keyframes zoomIn {
// //       from {
// //         transform: translate(-50%, -50%) scale(0.5); /* ← CAMBIO: scale(0.8) a scale(0.5) */
// //         opacity: 0;
// //       }
// //       to {
// //         transform: translate(-50%, -50%) scale(2); /* ← CAMBIO: scale(1) a scale(2) */
// //         opacity: 1;
// //       }
// //     }

// //     /* Cards hermanas cuando hay una en zoom */
// //     .products-grid-zoom.has-zoomed .product-card-zoom:not(.zoomed) {
// //       transform: scale(0.85);
// //       opacity: 0.3;
// //       filter: blur(3px) grayscale(40%);
// //       pointer-events: none;
// //     }
// //   }

// //   /* En móvil (<768px) sin efecto zoom */
// //   @media (max-width: 767px) {
// //     .products-grid-zoom .product-card-zoom:active {
// //       transform: scale(0.97);
// //     }
// //   }
// // `}</style>


// //     </div>
// //   );
// // }



// "use client"
// import { useState, useEffect } from "react";
// import Header from "@/components/Header"
// import PromoBanner from "@/components/PromoBanner"
// import BottomNav from "@/components/BottomNav"
// import ProductCard from "@/components/ProductCard";
// import toast from "react-hot-toast";
// import { ShoppingBag, Home, Hammer, Leaf, Bath, Search } from 'lucide-react';

// export default function Home1() {
//   const [productos, setProductos] = useState([])
//   const [filteredProductos, setFilteredProductos] = useState([]) 
//   const [loading, setLoading] = useState(true) 
//   const [searchTerm, setSearchTerm] = useState('') 
//   const [category, setCategory] = useState('todas')
//   const [zoomedProductId, setZoomedProductId] = useState(null) // Estado para el producto en zoom

//   const fetchProductos = async () => {
//     try {
//       const res = await fetch("api/productos")
//       if(res.ok){
//         const data = await res.json()
//         setProductos(data)
//         setFilteredProductos(data)
//       } else {
//         toast.error('Error al cargar los productos')
//       }
//     } catch (error) {
//       toast.error('Error de conexión 4')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchProductos()
//   }, [])

//   // Filtrado combinado: Búsqueda + Categoría + SOLO PRODUCTOS CON DESCUENTO
//   useEffect(() => {
//     const filtered = productos.filter(p => {
//       const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesCategory = category === 'todas' || (p.categoria && p.categoria.toLowerCase() === category.toLowerCase());
//       // Solo incluir productos que tengan descuento (precio_anterior > precio)
//       const hasDiscount = p.precio_anterior && p.precio_anterior > p.precio;
//       return matchesSearch && matchesCategory && hasDiscount;
//     })
//     setFilteredProductos(filtered)
//   }, [searchTerm, productos, category])

//   // Función para obtener el icono dinámico
//   const getCategoryIcon = () => {
//     if (searchTerm) return <Search className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />;
    
//     switch (category) {
//       case 'hogar': return <Home className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />;
//       case 'ferreteria': return <Hammer className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />;
//       case 'jardineria': return <Leaf className="w-6 h-6 md:w-8 md:h-8 text-green-500" />;
//       case 'baños': return <Bath className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />;
//       default: return <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />;
//     }
//   };

//   // Manejar click en producto (solo en desktop)
//   const handleProductClick = (productId) => {
//     if (window.innerWidth >= 768) { // Solo en MD+
//       setZoomedProductId(productId)
//     }
//   }

//   // Cerrar zoom
//   const handleCloseZoom = () => {
//     setZoomedProductId(null)
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
//       {/* Header con props de búsqueda y categoría */}
//       <Header 
//         searchTerm={searchTerm} 
//         setSearchTerm={setSearchTerm}
//         setCategory={setCategory} 
//         currentCategory={category}
//       />
      
//       {/* Banner promocional */}
//       <div className="container mx-auto px-3 md:px-6">
//         <div className="mt-3 md:mt-4 mb-4 md:mb-6">
//           <PromoBanner />
//         </div>
//       </div>

//       <main className="container mx-auto px-3 md:px-6">
//         {/* SECCIÓN DEL TÍTULO ESTILIZADO */}
//         <div className="flex flex-col items-center justify-center mb-6">
//           <div className="flex items-center justify-center gap-3">
//             <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 tracking-tight">
//               {category !== 'todas' ? (
//                 `Categoría: ${category.charAt(0).toUpperCase() + category.slice(1)}`
//               ) : searchTerm ? (
//                 <span>Resultados para <span className="text-blue-600">{searchTerm}</span></span>
//               ) : (
//                 'Ofertas y Descuentos'
//               )}
//             </h1>
//             <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 animate-bounce-short">
//               {getCategoryIcon()}
//             </div>
//           </div>

//           <div className="mt-3 w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />

//           {!loading && filteredProductos.length > 0 && (
//             <p className="text-sm md:text-base text-gray-500 mt-2 font-medium">
//               {filteredProductos.length} {filteredProductos.length === 1 ? 'producto en oferta' : 'productos en oferta'}
//             </p>
//           )}
//         </div>

//         {/* ESTADOS DE CARGA Y RESULTADOS */}
//         {loading ? (
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
//                 <div className="bg-gray-200 h-40 md:h-48 rounded-lg mb-3"></div>
//                 <div className="bg-gray-200 h-4 rounded mb-2"></div>
//                 <div className="bg-gray-200 h-4 rounded w-3/4 mb-3"></div>
//                 <div className="bg-gray-200 h-8 rounded"></div>
//               </div>
//             ))}
//           </div>
//         ) : filteredProductos.length === 0 ? (
//            <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-md border border-blue-50">
//             <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
//               <span className="text-2xl md:text-3xl">🔍</span>
//             </div>
//             <p className="text-base md:text-lg text-gray-600 mb-4 font-semibold">
//               No hay productos con descuento que coincidan con {searchTerm}
//             </p>
//             <button 
//               onClick={() => setSearchTerm('')} 
//               className="px-6 py-2.5 rounded-xl font-bold text-sm md:text-base transition-all shadow-lg"
//               style={{ backgroundColor: '#00162f', color: 'white' }}
//             >
//               Limpiar búsqueda
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* GRID DE PRODUCTOS */}
//             <div className={`products-grid-zoom grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8 mb-10 ${zoomedProductId ? 'has-zoomed' : ''}`}>
//               {filteredProductos.map(producto => (
//                 <ProductCard 
//                   key={producto.id} 
//                   producto={producto}
//                   onClick={() => handleProductClick(producto.id)}
//                   isZoomed={zoomedProductId === producto.id}
//                   onClose={handleCloseZoom}
//                 />
//               ))}
//             </div>

//             {/* OVERLAY OSCURO cuando hay zoom */}
//             {zoomedProductId && (
//               <div 
//                 className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-fadeIn"
//                 onClick={handleCloseZoom}
//               />
//             )}
//           </>
//         )}
//       </main>

//       <BottomNav setCategory={setCategory} currentCategory={category} />

//       {/* ESTILOS GLOBALES */}
//       <style jsx global>{`
//         @keyframes bounce-short {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-5px); }
//         }
        
//         .animate-bounce-short {
//           animation: bounce-short 2s ease-in-out infinite;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }

//         /* ZOOM CON CLICK - Solo en pantallas >= MD (768px+) */
//         @media (min-width: 768px) {
//           .products-grid-zoom {
//             padding: 1rem 0;
//           }

//           .products-grid-zoom .product-card-zoom {
//             transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//             cursor: pointer;
//           }

//           /* Card en estado zoom (centrada) */
//           .products-grid-zoom .product-card-zoom.zoomed {
//             position: fixed;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%) scale(2);
//             z-index: 100;
//             max-width: 90vw;
//             max-height: 90vh;
//             overflow-y: auto;
//             box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.5);
//             animation: zoomIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//           }

//           @keyframes zoomIn {
//             from {
//               transform: translate(-50%, -50%) scale(0.5);
//               opacity: 0;
//             }
//             to {
//               transform: translate(-50%, -50%) scale(2);
//               opacity: 1;
//             }
//           }

//           /* Cards hermanas cuando hay una en zoom */
//           .products-grid-zoom.has-zoomed .product-card-zoom:not(.zoomed) {
//             transform: scale(0.85);
//             opacity: 0.3;
//             filter: blur(3px) grayscale(40%);
//             pointer-events: none;
//           }
//         }

//         /* En móvil (<768px) sin efecto zoom */
//         @media (max-width: 767px) {
//           .products-grid-zoom .product-card-zoom:active {
//             transform: scale(0.97);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


// components/ProductCard.jsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Heart, Truck, X } from 'lucide-react'

export default function ProductCard({ producto, onClick, isZoomed, onClose }) {
  const router = useRouter()
  const [currentImg, setCurrentImg] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  // Procesar imágenes (puede ser string separado por comas o array)
  const imagenes = producto.imagen_url 
    ? (Array.isArray(producto.imagen_url) ? producto.imagen_url : producto.imagen_url.split(',').map(img => img.trim()))
    : ['/bodega-img.jpg']

  // Carrusel automático cada 5s
  useEffect(() => {
    if (imagenes.length <= 1) return
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [imagenes.length])

  // Determinar si hay descuento
  const tieneDescuento = producto.precio_anterior && producto.precio_anterior > producto.precio

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('img')) return; // Evitar clic en botones e imagen
    if (onClick) onClick();
  }

  const handleImageClick = (e) => {
    e.stopPropagation(); // Evitar que se active el zoom de la tarjeta
    setShowImageModal(true);
  }

  const closeModal = () => {
    setShowImageModal(false);
  }

  return (
    <>
      <div 
        className={`product-card-zoom ${isZoomed ? 'zoomed' : ''} group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer flex flex-col h-full`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Contenedor de Imagen con Carrusel */}
        <div className='relative h-72 md:h-80 overflow-hidden bg-gray-50'>
          {imagenes.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${producto.nombre || 'Producto'} - vista ${idx + 1}`}
              className={` w-full h-full object-contain cursor-zoom-in absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                idx === currentImg ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              } ${isHovered ? 'group-hover:scale-110' : ''} transition-transform duration-700 cursor-zoom-in`}
              onClick={handleImageClick}
            />
          ))}

          {/* Gradiente inferior */}
          <div className='absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent' />
          
          {/* Indicadores (dots) */}
          {imagenes.length > 1 && (
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
              {imagenes.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentImg 
                      ? 'bg-white w-8 shadow-sm' 
                      : 'bg-white/40 w-1.5'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Badge de descuento (amarillo) */}
          {tieneDescuento && (
            <div className='absolute top-4 left-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg text-xs font-black shadow-xl z-30'>
              -{Math.round(((producto.precio_anterior - producto.precio) / producto.precio_anterior) * 100)}%
            </div>
          )}

          {/* Botón favorito */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
            className='absolute top-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all z-30 active:scale-90'
          >
            <Heart 
              size={20} 
              fill={isFavorite ? '#dc2626' : 'none'} 
              className={isFavorite ? 'text-red-600' : 'text-gray-400'}
            />
          </button>

          {/* Overlay "Ver producto" (aparece en hover) */}
          <div className='absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10'>
            <div className='bg-white/95 text-blue-900 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-2xl translate-y-8 group-hover:translate-y-0 transition-transform duration-500'>
              <Eye size={18} />
              Ver producto
            </div>
          </div>
        </div>

        {/* Información del Producto (sin cambios) */}
        <div className='p-5 flex flex-col grow'>
          <div className='flex justify-between items-start mb-2'>
            <div>
              {producto.coleccion && (
                <span className='text-[10px] text-blue-600 font-black uppercase tracking-widest block mb-1'>
                  {producto.coleccion}
                </span>
              )}
              <h3 className='text-lg font-extrabold text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors'>
                {producto.nombre || 'Producto sin nombre'}
              </h3>
            </div>
          </div>

          <div className='flex gap-2 mb-4 flex-wrap'>
            {producto.formato && (
              <span className='text-[9px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold uppercase'>
                {producto.formato}
              </span>
            )}
            {producto.acabado && (
              <span className='text-[9px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold uppercase'>
                {producto.acabado}
              </span>
            )}
            {producto.pei && (
              <span className='text-[9px] bg-amber-50 text-amber-700 px-2 py-1 rounded-md font-bold uppercase'>
                PEI {producto.pei}
              </span>
            )}
          </div>

          <div className='flex items-center gap-1.5 mb-4'>
            <div className={`w-2 h-2 rounded-full ${
              producto.stock <= 3 
                ? 'bg-red-500' 
                : producto.stock <= 10 
                  ? 'bg-yellow-600' 
                  : 'bg-green-500'
            }`} />
            <span className={`text-[10px] md:text-xs font-medium ${
              producto.stock <= 3 
                ? 'text-red-500' 
                : producto.stock <= 10 
                  ? 'text-yellow-600' 
                  : 'text-green-500'
            }`}>
              {producto.stock > 0 ? `${producto.stock} en stock` : 'Agotado'}
            </span>
          </div>

          <div className='mt-auto pt-4 border-t border-gray-50'>
            <div className='flex items-baseline gap-2'>
              <span className='text-2xl font-black text-gray-900'>
                ${Number(producto.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              {tieneDescuento && (
                <span className='text-sm text-gray-400 line-through'>
                  ${Number(producto.precio_anterior).toLocaleString('es-MX')}
                </span>
              )}
            </div>
            {producto.linea === 'Pisos' && (
              <p className='text-[10px] text-gray-400 font-bold mt-1 tracking-tight'>
                PRECIO POR M² • INCLUYE IVA
              </p>
            )}
            <div className='flex items-center gap-1 text-[10px] text-yellow-500 font-bold mt-0.5'>
              <Truck size={12} />
              <span>Envío Gratis</span>
            </div>
            <p className='text-[10px] text-green-700 font-bold mt-0.5'>📦 Entrega de 3 a 5 días hábiles.</p>
          </div>
        </div>

        {isZoomed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-2 left-2 z-50 bg-red-500 text-white rounded-full p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Modal de imagen */}
      {showImageModal && (
        <div 
          className='fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300'
          style={{ backgroundColor: 'rgba(0, 22, 47, 0.95)' }}
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className='absolute top-4 md:top-8 right-4 md:right-8 text-white p-2 hover:bg-white/10 rounded-full transition'
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <img
            src={imagenes[currentImg]}
            alt={producto.nombre || 'Producto'}
            className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}