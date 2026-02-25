// // components/ProductPiso.jsx
// 'use client'
// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Eye, Heart } from 'lucide-react'

// export default function ProductPiso({ piso }) {
//   const router = useRouter()
//   const [currentImg, setCurrentImg] = useState(0)
//   const [isFavorite, setIsFavorite] = useState(false)

//   const imagenes = piso.imagen_url?.split(',').map(img => img.trim()) || []
//   const slug = piso.nombre.toLowerCase().replace(/\s+/g, '-')

//   return (
//     <div 
//       className='group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer'
//       onClick={() => router.push(`/pisos/${slug}`)}
//     >
//       {/* Imagen */}
//       <div className='relative h-64 md:h-72 overflow-hidden bg-gray-100'>
//         {imagenes.length > 0 ? (
//           <>
//             <img
//               src={imagenes[currentImg]}
//               alt={piso.nombre}
//               className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
//             />
            
//             {/* Indicadores de imágenes */}
//             {imagenes.length > 1 && (
//               <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10'>
//                 {imagenes.map((_, idx) => (
//                   <button
//                     key={idx}
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       setCurrentImg(idx)
//                     }}
//                     className={`w-2 h-2 rounded-full transition-all ${
//                       idx === currentImg ? 'bg-white w-6' : 'bg-white/60'
//                     }`}
//                   />
//                 ))}
//               </div>
//             )}

//             {/* Badge descuento */}
//             {piso.precio_anterior && (
//               <div className='absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg'>
//                 {Math.round(((piso.precio_anterior - piso.precio) / piso.precio_anterior) * 100)}% OFF
//               </div>
//             )}

//             {/* Botón favorito */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation()
//                 setIsFavorite(!isFavorite)
//               }}
//               className='absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all'
//             >
//               <Heart 
//                 size={18} 
//                 fill={isFavorite ? '#ef4444' : 'none'} 
//                 className={isFavorite ? 'text-red-500' : 'text-gray-600'}
//               />
//             </button>

//             {/* Overlay con botón Ver */}
//             <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
//               <button className='bg-white text-blue-900 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-50 transition-all'>
//                 <Eye size={20} />
//                 Ver Detalles
//               </button>
//             </div>
//           </>
//         ) : (
//           <div className='flex items-center justify-center h-full text-gray-400'>
//             Sin imagen
//           </div>
//         )}
//       </div>

//       {/* Información */}
//       <div className='p-4'>
//         {/* Colección */}
//         {piso.coleccion && (
//           <p className='text-xs text-gray-500 font-semibold uppercase mb-1'>
//             {piso.coleccion}
//           </p>
//         )}

//         {/* Nombre */}
//         <h3 className='text-lg font-bold text-gray-800 mb-2 line-clamp-1'>
//           {piso.nombre}
//         </h3>

//         {/* Specs */}
//         <div className='flex flex-wrap gap-2 mb-3'>
//           <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold'>
//             {piso.formato}
//           </span>
//           <span className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-semibold'>
//             {piso.acabado}
//           </span>
//           <span className='text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold'>
//             PEI {piso.pei}
//           </span>
//         </div>

//         {/* Precio */}
//         <div className='flex items-baseline gap-2'>
//           <span className='text-2xl font-black text-blue-900'>
//             ${Number(piso.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
//           </span>
//           {piso.precio_anterior && (
//             <span className='text-sm text-gray-400 line-through'>
//               ${Number(piso.precio_anterior).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
//             </span>
//           )}
//         </div>
//         <p className='text-xs text-gray-500 mt-1'>MXN / m²</p>
//       </div>
//     </div>
//   )
// }














'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Heart, Truck } from 'lucide-react'

export default function ProductPiso({ piso }) {
  const router = useRouter()
  const [currentImg, setCurrentImg] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Procesar imágenes desde el string de la base de datos
  const imagenes = piso.imagen_url 
    ? (Array.isArray(piso.imagen_url) ? piso.imagen_url : piso.imagen_url.split(',').map(img => img.trim()))
    : ['/placeholder.jpg']
    
  const slug = piso.nombre.toLowerCase().replace(/\s+/g, '-')

  // --- Lógica del Carrusel Automático (Cada 5 segundos) ---
  useEffect(() => {
    if (imagenes.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [imagenes.length])

  return (
    <div 
      className='group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer flex flex-col h-full'
      onClick={() => router.push(`/pisos/${slug}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor de Imagen con Carrusel */}
      <div className='relative h-72 md:h-80 overflow-hidden bg-gray-50'>
        {imagenes.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${piso.nombre_completo} - vista ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              idx === currentImg ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            } ${isHovered ? 'group-hover:scale-110' : ''} transition-transform duration-700`}
          />
        ))}

        {/* Gradiente inferior para legibilidad de dots */}
        <div className='absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/40 to-transparent' />
        
        {/* Indicadores (Dots) Estilo Premium */}
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

        {/* Badge de Descuento (Calculado dinámicamente) */}
        {piso.precio_anterior && (
          <div className='absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-xl z-30 animate-pulse'>
            -{Math.round(((piso.precio_anterior - piso.precio) / piso.precio_anterior) * 100)}%
          </div>
        )}

        {/* Botón Favorito */}
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

        {/* Overlay de Ver Detalles al hacer Hover */}
        <div className='absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10'>
          <div className='bg-white/95 text-blue-900 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-2xl translate-y-8 group-hover:translate-y-0 transition-transform duration-500'>
            <Eye size={18} />
            Ver producto
          </div>
        </div>
      </div>

      {/* Información del Producto */}
      <div className='p-5 flex flex-col flex-grow'>
        <div className='flex justify-between items-start mb-2'>
          <div>
            {piso.coleccion && (
              <span className='text-[10px] text-blue-600 font-black uppercase tracking-widest block mb-1'>
                {piso.coleccion}
              </span>
            )}
            <h3 className='text-lg font-extrabold text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors'>
              {piso.nombre_completo}
            </h3>
          </div>
        </div>

        {/* Atributos Rápidos */}
        <div className='flex gap-2 mb-4'>
          <span className='text-[9px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold uppercase'>
            {piso.formato}
          </span>
          <span className='text-[9px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold uppercase'>
            {piso.acabado}
          </span>
          {piso.pei && (
            <span className='text-[9px] bg-amber-50 text-amber-700 px-2 py-1 rounded-md font-bold uppercase'>
              PEI {piso.pei}
            </span>
          )}
        </div>

        {/* //& Stock con colores de urgencia */}
        <div className='flex items-center gap-1.5 mb-4'>
          <div className={`w-2 h-2 rounded-full ${
            piso.stock <= 3 
              ? 'bg-red-500' 
              : piso.stock <= 10 
                ? 'bg-yellow-600' 
                : 'bg-green-500'
          }`} />
          <span className={`text-[10px] md:text-xs font-medium ${
            piso.stock <= 3 
              ? 'text-red-500' 
              : piso.stock <= 10 
                ? 'text-yellow-600' 
                : 'text-green-500'
          }`}>
            {piso.stock > 0 ? `${piso.stock} en stock` : 'Agotado'}
          </span>
        </div>

        {/* Precio Final */}
        <div className='mt-auto pt-4 border-t border-gray-50'>
          <div className='flex items-baseline gap-2'>
            <span className='text-2xl font-black text-gray-900'>
              ${Number(piso.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
            {piso.precio_anterior && (
              <span className='text-sm text-gray-400 line-through'>
                ${Number(piso.precio_anterior).toLocaleString('es-MX')}
              </span>
            )}
          </div>
          <p className='text-[10px] text-gray-400 font-bold mt-1 tracking-tight'>
            PRECIO POR M² • INCLUYE IVA
          </p>
          <div className='flex items-center gap-1 text-[10px] text-yellow-500 font-bold mt-0.5'>
            <Truck size={12} />
            <span>Envío Express</span>
          </div>
        </div>
      </div>
    </div>
  )
}






// // app/pisos/[nombre]/page.jsx
// 'use client'
// import { useState, useEffect, useCallback } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import Header from '@/components/Header'
// import BottomNav from '@/components/BottomNav'
// import { 
//   Heart, Download, Share2, ShoppingCart, 
//   Home, X, ZoomIn, ChevronLeft, ChevronRight,
//   Calculator, MessageCircle, Package
// } from 'lucide-react'
// import toast from 'react-hot-toast'
// import Cookies from 'js-cookie'
// import { useAuth } from '@/context/authContext'

// export default function PisoDetailPage() {
//   const params = useParams()
//   const router = useRouter()
//   const { user, updateCartCount } = useAuth()
  
//   const [piso, setPiso] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [currentImg, setCurrentImg] = useState(0)
//   const [isFavorite, setIsFavorite] = useState(false)
//   const [showImageModal, setShowImageModal] = useState(false)

//   // Estados para calculadora
//   const [ancho, setAncho] = useState('')
//   const [largo, setLargo] = useState('')
//   const [incluirExtra, setIncluirExtra] = useState(true)
//   const [cajasNecesarias, setCajasNecesarias] = useState(null)
//   const [addingToCart, setAddingToCart] = useState(false)

//   const fetchPiso = useCallback(async () => {
//     if (!params.nombre) return

//     try {
//       setLoading(true)
//       const nombreDecodificado = decodeURIComponent(params.nombre)
//       const res = await fetch(`/api/pisos/${nombreDecodificado}`)
      
//       if (!res.ok) throw new Error('Producto no encontrado')

//       const data = await res.json()
//       setPiso(data)
//     } catch (error) {
//       console.error("Error fetching piso:", error)
//       toast.error('Piso no encontrado')
//       router.push('/pisos')
//     } finally {
//       setLoading(false)
//     }
//   }, [params.nombre, router])

//   useEffect(() => {
//     fetchPiso()
//   }, [fetchPiso])

//   // Calcular cajas necesarias
//   const calcularCajas = () => {
//     const anchoNum = parseFloat(ancho)
//     const largoNum = parseFloat(largo)

//     if (!anchoNum || !largoNum || anchoNum <= 0 || largoNum <= 0) {
//       toast.error('Ingresa medidas válidas')
//       return
//     }

//     if (!piso.m2_por_caja || piso.m2_por_caja <= 0) {
//       toast.error('Producto sin información de m² por caja')
//       return
//     }

//     // Área total en m²
//     let areaTotal = anchoNum * largoNum

//     // Agregar 10% extra si está marcado
//     if (incluirExtra) {
//       areaTotal = areaTotal * 1.1
//     }

//     // Calcular cajas (redondear hacia arriba)
//     const cajas = Math.ceil(areaTotal / piso.m2_por_caja)
//     setCajasNecesarias(cajas)

//     toast.success(`Necesitas ${cajas} caja${cajas !== 1 ? 's' : ''}`, {
//       icon: '📦',
//       duration: 3000
//     })
//   }

//   // Agregar cajas calculadas al carrito
//   const handleAddCajasToCart = async () => {
//     if (!user) {
//       toast.error('Debes iniciar sesión para comprar')
//       router.push('/login')
//       return
//     }

//     if (!cajasNecesarias || cajasNecesarias <= 0) {
//       toast.error('Primero calcula las cajas necesarias')
//       return
//     }

//     if (cajasNecesarias > piso.stock) {
//       toast.error('No hay suficiente stock disponible')
//       return
//     }

//     setAddingToCart(true)
//     try {
//       const token = Cookies.get('token')
      
//       const res = await fetch('/api/carrito/agregar', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ 
//           pisoId: piso.id,
//           cantidad: cajasNecesarias
//         })
//       })

//       const data = await res.json()

//       if (res.ok) {
//         toast.success(`${cajasNecesarias} caja${cajasNecesarias !== 1 ? 's' : ''} añadida${cajasNecesarias !== 1 ? 's' : ''} al carrito`)
//         if (updateCartCount) await updateCartCount()
        
//         // Limpiar calculadora
//         setAncho('')
//         setLargo('')
//         setCajasNecesarias(null)
//       } else {
//         toast.error(data.error || 'Error al agregar')
//       }
//     } catch (error) {
//       console.error("Error:", error)
//       toast.error('Error de conexión')
//     } finally {
//       setAddingToCart(false)
//     }
//   }

//   // Contactar por WhatsApp
//   const handleWhatsApp = () => {
//     const mensaje = encodeURIComponent(
//       `Hola! Necesito ${cajasNecesarias} cajas de ${piso.nombre_completo} (SKU: ${piso.sku}). ` +
//       `Actualmente tienen ${piso.stock} en stock. ¿Pueden conseguir las cajas faltantes?`
//     )
//     const numeroWhatsApp = '5215512345678' // Reemplaza con tu número real
//     window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank')
//   }

//   if (loading) {
//     return (
//       <div className='min-h-screen flex items-center justify-center bg-gray-50'>
//         <div className='text-center'>
//           <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
//           <p className='text-gray-600 font-medium'>Cargando detalles del piso...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!piso) return null

//   const imagenes = piso.imagen_url 
//     ? (Array.isArray(piso.imagen_url) ? piso.imagen_url : piso.imagen_url.split(',').map(img => img.trim()))
//     : ['/placeholder.jpg']

//   const stockInsuficiente = cajasNecesarias && cajasNecesarias > piso.stock

//   return (
//     <div className='min-h-screen bg-gray-50 pb-20 md:pb-8'>
//       <Header />

//       <main className='container mx-auto px-4 md:px-6 py-6'>
//         {/* Breadcrumb */}
//         <nav className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
//           <button onClick={() => router.push('/pisos')} className='hover:text-blue-600'>Pisos</button>
//           <span>/</span>
//           <span className='text-gray-900 font-medium truncate'>{piso.nombre_completo}</span>
//         </nav>

//         <div className='grid lg:grid-cols-2 gap-10 mb-12'>
//           {/* GALERÍA */}
//           <div className="space-y-4">
//             <div className='relative bg-white rounded-3xl overflow-hidden shadow-sm group border border-gray-100'>
//               <img
//                 src={imagenes[currentImg]}
//                 alt={piso.nombre_completo}
//                 className='w-full h-[400px] md:h-[600px] object-cover cursor-zoom-in transition-transform duration-700 hover:scale-110'
//                 onClick={() => setShowImageModal(true)}
//               />
              
//               {imagenes.length > 1 && (
//                 <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
//                   <button
//                     onClick={(e) => { e.stopPropagation(); setCurrentImg((prev) => (prev - 1 + imagenes.length) % imagenes.length) }}
//                     className='pointer-events-auto bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all'
//                   >
//                     <ChevronLeft size={24} />
//                   </button>
//                   <button
//                     onClick={(e) => { e.stopPropagation(); setCurrentImg((prev) => (prev + 1) % imagenes.length) }}
//                     className='pointer-events-auto bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all'
//                   >
//                     <ChevronRight size={24} />
//                   </button>
//                 </div>
//               )}
//             </div>

//             {imagenes.length > 1 && (
//               <div className='flex gap-3 overflow-x-auto pb-2'>
//                 {imagenes.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setCurrentImg(idx)}
//                     className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
//                       idx === currentImg ? 'border-blue-600 scale-95' : 'border-transparent opacity-70'
//                     }`}
//                   >
//                     <img src={img} alt="Thumbnail" className='w-full h-full object-cover' />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* INFORMACIÓN */}
//           <div className="flex flex-col justify-center">
//             {piso.coleccion && (
//               <span className='inline-block bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full w-fit mb-4'>
//                 Colección {piso.coleccion}
//               </span>
//             )}

//             <h1 className='text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight'>
//               {piso.nombre_completo}
//             </h1>

//             <p className='text-xl text-gray-600 mb-8 leading-relaxed'>{piso.descripcion}</p>

//             {/* Precio por m² */}
//             <div className='bg-white rounded-3xl p-8 mb-8 border border-gray-100 shadow-sm'>
//               <div className='flex items-baseline gap-4 mb-2'>
//                 <span className='text-6xl font-black text-blue-700'>
//                   ${Number(piso.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
//                 </span>
//                 <span className='text-gray-400 font-medium'>m²</span>
//               </div>
//               <p className='text-sm text-gray-500'>* IVA incluido • {piso.m2_por_caja} m² por caja • {piso.piezas_por_caja} piezas</p>
//             </div>

//             {/* Atributos */}
//             <div className='grid grid-cols-3 gap-4 mb-8'>
//               {[
//                 { label: 'Formato', value: piso.formato },
//                 { label: 'Acabado', value: piso.acabado },
//                 { label: 'PEI', value: piso.pei || 'N/A' }
//               ].map((attr, i) => (
//                 <div key={i} className='bg-gray-100/50 rounded-2xl p-4 border border-gray-100'>
//                   <p className='text-[10px] uppercase font-bold text-gray-400 mb-1'>{attr.label}</p>
//                   <p className='font-bold text-gray-800'>{attr.value}</p>
//                 </div>
//               ))}
//             </div>

//             {/* CALCULADORA DE CAJAS */}
//             <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 mb-8 border-2 border-blue-100'>
//               <div className='flex items-center gap-3 mb-5'>
//                 <div className='bg-blue-600 p-2.5 rounded-xl'>
//                   <Calculator className='text-white' size={24} />
//                 </div>
//                 <h3 className='text-xl font-black text-gray-900'>Calcula tus Cajas Necesarias</h3>
//               </div>

//               <p className='text-sm text-gray-600 mb-5'>
//                 Introduce las medidas de tu espacio y te diremos cuántas cajas necesitas
//               </p>

//               <div className='space-y-4'>
//                 {/* Inputs de medidas */}
//                 <div className='grid grid-cols-2 gap-3'>
//                   <div>
//                     <label className='block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider'>
//                       Ancho (m)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       value={ancho}
//                       onChange={(e) => setAncho(e.target.value)}
//                       placeholder="10"
//                       className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-900 focus:border-blue-600 focus:outline-none transition-colors'
//                     />
//                   </div>
//                   <div>
//                     <label className='block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider'>
//                       Largo (m)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       value={largo}
//                       onChange={(e) => setLargo(e.target.value)}
//                       placeholder="10"
//                       className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-900 focus:border-blue-600 focus:outline-none transition-colors'
//                     />
//                   </div>
//                 </div>

//                 {/* Área total */}
//                 {ancho && largo && (
//                   <div className='bg-white rounded-xl p-4 border border-blue-200'>
//                     <p className='text-xs text-gray-500 mb-1'>Área a cubrir</p>
//                     <p className='text-2xl font-black text-gray-900'>
//                       {(parseFloat(ancho) * parseFloat(largo)).toFixed(2)} m²
//                     </p>
//                   </div>
//                 )}

//                 {/* Checkbox 10% extra */}
//                 <label className='flex items-center gap-3 cursor-pointer bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors'>
//                   <input
//                     type="checkbox"
//                     checked={incluirExtra}
//                     onChange={(e) => setIncluirExtra(e.target.checked)}
//                     className='w-5 h-5 accent-blue-600'
//                   />
//                   <span className='text-sm font-semibold text-gray-700'>
//                     Incluir 10% extra para cortes y reemplazos
//                   </span>
//                 </label>

//                 {/* Botón calcular */}
//                 <button
//                   onClick={calcularCajas}
//                   disabled={!ancho || !largo}
//                   className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3'
//                 >
//                   <Calculator size={22} />
//                   Calcular Cajas
//                 </button>

//                 {/* Resultado */}
//                 {cajasNecesarias !== null && (
//                   <div className='bg-white rounded-2xl p-6 border-2 border-blue-600 animate-in fade-in zoom-in duration-300'>
//                     <div className='flex items-center justify-between mb-4'>
//                       <div>
//                         <p className='text-xs text-gray-500 mb-1'>Cajas necesarias</p>
//                         <p className='text-4xl font-black text-blue-600 flex items-center gap-2'>
//                           <Package size={32} />
//                           {cajasNecesarias}
//                         </p>
//                       </div>
//                       <div className='text-right'>
//                         <p className='text-xs text-gray-500 mb-1'>Stock disponible</p>
//                         <p className={`text-2xl font-black ${piso.stock >= cajasNecesarias ? 'text-green-600' : 'text-red-600'}`}>
//                           {piso.stock}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Botón condicional */}
//                     {stockInsuficiente ? (
//                       <button
//                         onClick={handleWhatsApp}
//                         className='w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all'
//                       >
//                         <MessageCircle size={22} />
//                         Contactar por WhatsApp
//                       </button>
//                     ) : (
//                       <button
//                         onClick={handleAddCajasToCart}
//                         disabled={addingToCart}
//                         className='w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:bg-gray-400'
//                       >
//                         <ShoppingCart size={22} />
//                         {addingToCart ? 'Agregando...' : `Agregar ${cajasNecesarias} Caja${cajasNecesarias !== 1 ? 's' : ''} al Carrito`}
//                       </button>
//                     )}

//                     {stockInsuficiente && (
//                       <p className='text-xs text-red-600 mt-3 text-center font-medium'>
//                         ⚠️ Stock insuficiente. Contacta con nosotros para hacer el pedido completo.
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Botones secundarios */}
//             <div className="grid grid-cols-2 gap-4">
//               <button className="flex items-center justify-center gap-2 py-4 px-6 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:shadow-md transition-all">
//                 <Download size={20} /> Ficha Técnica
//               </button>
//               <button className="flex items-center justify-center gap-2 py-4 px-6 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:shadow-md transition-all">
//                 <Share2 size={20} /> Compartir
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ESPECIFICACIONES TÉCNICAS */}
//         <div className='bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 mb-16'>
//           <h2 className='text-3xl font-black text-gray-900 mb-10'>Especificaciones Técnicas</h2>
//           <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6'>
//             {[
//               { label: 'Cuerpo', value: piso.cuerpo },
//               { label: 'Absorción', value: piso.absorcion },
//               { label: 'Rectificado', value: piso.rectificado ? 'Sí' : 'No' },
//               { label: 'Piezas x Caja', value: piso.piezas_por_caja },
//               { label: 'm² x Caja', value: piso.m2_por_caja },
//               { label: 'KG x Caja', value: `${piso.kg_por_caja} kg` }
//             ].map((item, i) => (
//               <div key={i} className='flex justify-between items-center py-4 border-b border-gray-50'>
//                 <span className='text-gray-500 font-medium'>{item.label}</span>
//                 <span className='font-bold text-gray-900'>{item.value || 'Consultar'}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>

//       {/* MODAL DE IMAGEN */}
//       {showImageModal && (
//         <div 
//           className='fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300'
//           onClick={() => setShowImageModal(false)}
//         >
//           <button className='absolute top-8 right-8 text-white p-2 hover:bg-white/10 rounded-full'>
//             <X size={40} />
//           </button>
//           <img
//             src={imagenes[currentImg]}
//             alt="Piso Zoom"
//             className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl'
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//       )}

//       <BottomNav />
//     </div>
//   )
// }