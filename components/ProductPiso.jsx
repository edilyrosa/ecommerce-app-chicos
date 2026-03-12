// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { Eye, Heart, Truck } from 'lucide-react'

// export default function ProductPiso({ piso }) {
//   const router = useRouter()
//   const [currentImg, setCurrentImg] = useState(0)
//   const [isFavorite, setIsFavorite] = useState(false)
//   const [isHovered, setIsHovered] = useState(false)

//   // Procesar imágenes desde el string de la base de datos
//   const imagenes = piso.imagen_url 
//     ? (Array.isArray(piso.imagen_url) ? piso.imagen_url : piso.imagen_url.split(',').map(img => img.trim()))
//     : ['/placeholder.jpg']
    
//   const slug = piso.nombre.toLowerCase().replace(/\s+/g, '-')

//   // --- Lógica del Carrusel Automático (Cada 5 segundos) ---
//   useEffect(() => {
//     if (imagenes.length <= 1) return

//     const interval = setInterval(() => {
//       setCurrentImg((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))
//     }, 5000)

//     return () => clearInterval(interval)
//   }, [imagenes.length])

//   return (
//     <div 
//       className='group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer flex flex-col h-full'
//       onClick={() => router.push(`/pisos/${slug}`)}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Contenedor de Imagen con Carrusel */}
//       <div className='relative h-72 md:h-80 overflow-hidden bg-gray-50'>
//         {imagenes.map((img, idx) => (
//           <img
//             key={idx}
//             src={img}
//             alt={`${piso.nombre_completo} - vista ${idx + 1}`}
//             className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
//               idx === currentImg ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
//             } ${isHovered ? 'group-hover:scale-110' : ''} transition-transform duration-700`}
//           />
//         ))}

//         {/* Gradiente inferior para legibilidad de dots */}
//         <div className='absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/40 to-transparent' />
        
//         {/* Indicadores (Dots) Estilo Premium */}
//         {imagenes.length > 1 && (
//           <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
//             {imagenes.map((_, idx) => (
//               <div
//                 key={idx}
//                 className={`h-1.5 rounded-full transition-all duration-500 ${
//                   idx === currentImg 
//                     ? 'bg-white w-8 shadow-sm' 
//                     : 'bg-white/40 w-1.5'
//                 }`}
//               />
//             ))}
//           </div>
//         )}

//         {/* Badge de Descuento (Calculado dinámicamente) */}
//         {piso.precio_anterior && (
//           <div className='absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-xl z-30 animate-pulse'>
//             -{Math.round(((piso.precio_anterior - piso.precio) / piso.precio_anterior) * 100)}%
//           </div>
//         )}

//         {/* Botón Favorito */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation()
//             setIsFavorite(!isFavorite)
//           }}
//           className='absolute top-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all z-30 active:scale-90'
//         >
//           <Heart 
//             size={20} 
//             fill={isFavorite ? '#dc2626' : 'none'} 
//             className={isFavorite ? 'text-red-600' : 'text-gray-400'}
//           />
//         </button>

//         {/* Overlay de Ver Detalles al hacer Hover */}
//         <div className='absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10'>
//           <div className='bg-white/95 text-blue-900 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-2xl translate-y-8 group-hover:translate-y-0 transition-transform duration-500'>
//             <Eye size={18} />
//             Ver producto
//           </div>
//         </div>
//       </div>

//       {/* Información del Producto */}
//       <div className='p-5 flex flex-col grow'>
//         <div className='flex justify-between items-start mb-2'>
//           <div>
//             {piso.coleccion && (
//               <span className='text-[10px] text-blue-600 font-black uppercase tracking-widest block mb-1'>
//                 {piso.coleccion}
//               </span>
//             )}
//             <h3 className='text-lg font-extrabold text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors'>
//               {piso.nombre_completo}
//             </h3>
//           </div>
//         </div>

//         {/* Atributos Rápidos */}
//         <div className='flex gap-2 mb-4'>
//           <span className='text-[9px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold uppercase'>
//             {piso.formato}
//           </span>
//           <span className='text-[9px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold uppercase'>
//             {piso.acabado}
//           </span>
//           {piso.pei && (
//             <span className='text-[9px] bg-amber-50 text-amber-700 px-2 py-1 rounded-md font-bold uppercase'>
//               PEI {piso.pei}
//             </span>
//           )}
//         </div>

//         {/* //& Stock con colores de urgencia */}
//         <div className='flex items-center gap-1.5 mb-4'>
//           <div className={`w-2 h-2 rounded-full ${
//             piso.stock <= 3 
//               ? 'bg-red-500' 
//               : piso.stock <= 10 
//                 ? 'bg-yellow-600' 
//                 : 'bg-green-500'
//           }`} />
//           <span className={`text-[10px] md:text-xs font-medium ${
//             piso.stock <= 3 
//               ? 'text-red-500' 
//               : piso.stock <= 10 
//                 ? 'text-yellow-600' 
//                 : 'text-green-500'
//           }`}>
//             {piso.stock > 0 ? `${piso.stock} en stock` : 'Agotado'}
//           </span>
//         </div>

//         {/* Precio Final */}
//         <div className='mt-auto pt-4 border-t border-gray-50'>
//           <div className='flex items-baseline gap-2'>
//             <span className='text-2xl font-black text-gray-900'>
//               ${Number(piso.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
//             </span>
//             {piso.precio_anterior && (
//               <span className='text-sm text-gray-400 line-through'>
//                 ${Number(piso.precio_anterior).toLocaleString('es-MX')}
//               </span>
//             )}
//           </div>
//           <p className='text-[10px] text-gray-400 font-bold mt-1 tracking-tight'>
//             PRECIO POR M² • INCLUYE IVA
//           </p>
//           <div className='flex items-center gap-1 text-[10px] text-yellow-500 font-bold mt-0.5'>
//             <Truck size={12} />
//             <span>Envío Gratis</span>
//           </div>
//           <p className='text-[10px] text-green-700 font-bold mt-0.5'>📦 Entrega de 3 a 5 días hábiles.</p>

//         </div>
//       </div>
//     </div>
//   )
// }


'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Heart, Truck } from 'lucide-react'

export default function ProductPiso({ producto }) {
  const router = useRouter()
  const [currentImg, setCurrentImg] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Procesar imágenes (puede ser string separado por comas o array)
  const imagenes = producto.imagen_url 
    ? (Array.isArray(producto.imagen_url) ? producto.imagen_url : producto.imagen_url.split(',').map(img => img.trim()))
    : ['/placeholder.jpg']
    
  const slug = (producto.nombre || 'producto').toLowerCase().replace(/\s+/g, '-')

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

  return (
    <div 
      className='group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer flex flex-col h-full'
      onClick={() => router.push(`/pisos/${producto.id}`)}
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
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              idx === currentImg ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            } ${isHovered ? 'group-hover:scale-110' : ''} transition-transform duration-700`}
          />
        ))}

        {/* Gradiente inferior */}
        <div className='absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/40 to-transparent' />
        
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

        {/* Badge de descuento */}
        {tieneDescuento && (
          <div className='absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-xl z-30 animate-pulse'>
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

        {/* Overlay "Ver producto" */}
        <div className='absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10'>
          <div className='bg-white/95 text-blue-900 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-2xl translate-y-8 group-hover:translate-y-0 transition-transform duration-500'>
            <Eye size={18} />
            Ver producto
          </div>
        </div>
      </div>

      {/* Información del Producto */}
      <div className='p-5 flex flex-col grow'>
        <div className='flex justify-between items-start mb-2'>
          <div>
            {/* Colección (opcional) */}
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

        {/* Atributos rápidos (solo si existen, con wrap para responsividad) */}
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

        {/* Stock con colores de urgencia */}
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

        {/* Precio Final */}
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
          {/* Mostrar "PRECIO POR M²" solo si es un producto de pisos */}
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
    </div>
  )
}
