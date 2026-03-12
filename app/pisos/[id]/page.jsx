// // // // // // app/pisos/[nombre]/page.jsx
// // // // // 'use client'
// // // // // import { useState, useEffect } from 'react'
// // // // // import { useParams, useRouter } from 'next/navigation'
// // // // // import Header from '@/components/Header'
// // // // // import BottomNav from '@/components/BottomNav'
// // // // // import { 
// // // // //   ShoppingCart, 
// // // // //   X, ChevronLeft, ChevronRight,
// // // // //   Calculator, MessageCircle, Package, AlertTriangle, Home,
// // // // //   Bath, ShowerHead, Bed, Sofa, UtensilsCrossed, Warehouse, Trees
// // // // // } from 'lucide-react'
// // // // // import toast from 'react-hot-toast'
// // // // // import Cookies from 'js-cookie'
// // // // // import { useAuth } from '@/context/authContext'

// // // // // export default function PisoDetailPage() {
// // // // //   //* para la ruta dinámica y navegación
// // // // //   const params = useParams()

// // // // //   const router = useRouter()
// // // // //   const { user, updateCartCount } = useAuth()
  
// // // // //   const [piso, setPiso] = useState(null)
// // // // //   const [loading, setLoading] = useState(true)
// // // // //   const [currentImg, setCurrentImg] = useState(0)
// // // // //   const [showImageModal, setShowImageModal] = useState(false)

// // // // //   //* Estados calculadora
// // // // //   const [ancho, setAncho] = useState('')
// // // // //   const [largo, setLargo] = useState('')
// // // // //   const [incluirExtra, setIncluirExtra] = useState(true)
// // // // //   const [cajasNecesarias, setCajasNecesarias] = useState(null)
// // // // //   const [areaTotal, setAreaTotal] = useState(null)
// // // // //   const [addingToCart, setAddingToCart] = useState(false)

// // // // //   useEffect(() => {
// // // // //     if (params.nombre) {
// // // // //       fetchPiso() //* Llama a la función para obtener el piso cada vez que cambia el nombre en la URL
// // // // //     }
// // // // //   }, [params.nombre]) //* Solo se vuelve a ejecutar si cambia el nombre en la URL

// // // // //   const fetchPiso = async () => {
// // // // //     try {
// // // // //       setLoading(true)
// // // // //       const res = await fetch(`/api/pisos/${params.nombre}`) //* Llama a tu API interna para obtener el piso por nombre
      
// // // // //       if (!res.ok) throw new Error('No encontrado')

// // // // //       const data = await res.json()
// // // // //       setPiso(data)
// // // // //     } catch (error) {
// // // // //       console.error(error)
// // // // //       toast.error('Piso no encontrado')
// // // // //       router.push('/pisos')
// // // // //     } finally {
// // // // //       setLoading(false)
// // // // //     }
// // // // //   }

// // // // //   const calcularCajas = () => {
// // // // //     const anchoNum = parseFloat(ancho)
// // // // //     const largoNum = parseFloat(largo)

// // // // //     if (!anchoNum || !largoNum || anchoNum <= 0 || largoNum <= 0) {
// // // // //       toast.error('Ingresa medidas válidas mayores a 0')
// // // // //       return
// // // // //     }

// // // // //     if (!piso.m2_por_caja || piso.m2_por_caja <= 0) {
// // // // //       toast.error('Este producto no tiene información de m² por caja')
// // // // //       return
// // // // //     }

// // // // //     //* Calcula el área total a cubrir
// // // // //     let area = anchoNum * largoNum
// // // // //     //* Si el usuario quiere incluir un extra para cortes, aumenta el área en un 10%
// // // // //     if (incluirExtra) {
// // // // //       area = area * 1.1
// // // // //     }

// // // // //     setAreaTotal(area)
// // // // //     //* Redondea hacia arriba para asegurar que siempre tengas suficientes cajas
// // // // //     const cajas = Math.ceil(area / piso.m2_por_caja) 
// // // // //     setCajasNecesarias(cajas)

// // // // //     toast.success(`📦 Necesitas ${cajas} caja${cajas !== 1 ? 's' : ''}`)
// // // // //   }

// // // // //   const handleAddToCart = async () => {
// // // // //     if (!user) {
// // // // //       toast.error('Inicia sesión para comprar')
// // // // //       router.push('/login')
// // // // //       return
// // // // //     }

// // // // //     if (!cajasNecesarias || cajasNecesarias <= 0) {
// // // // //       toast.error('Primero calcula las cajas necesarias')
// // // // //       return
// // // // //     }

// // // // //     if (cajasNecesarias > piso.stock) {
// // // // //       toast.error('Stock insuficiente')
// // // // //       return
// // // // //     }

// // // // //     setAddingToCart(true)
// // // // //     try {
// // // // //       const token = Cookies.get('token')
      
// // // // //       const res = await fetch('/api/carrito/agregar', {
// // // // //         method: 'POST',
// // // // //         headers: {
// // // // //           'Content-Type': 'application/json',
// // // // //           'Authorization': `Bearer ${token}`
// // // // //         },
// // // // //         body: JSON.stringify({ 
// // // // //           pisoId: piso.id,
// // // // //           cantidad: cajasNecesarias
// // // // //         })
// // // // //       })

// // // // //       const data = await res.json()

// // // // //       if (res.ok) {
// // // // //         toast.success(`${cajasNecesarias} caja${cajasNecesarias !== 1 ? 's' : ''} agregada${cajasNecesarias !== 1 ? 's' : ''}`)
// // // // //         await updateCartCount()
        
// // // // //         setAncho('')
// // // // //         setLargo('')
// // // // //         setCajasNecesarias(null)
// // // // //         setAreaTotal(null)
// // // // //       } else {
// // // // //         toast.error(data.error || 'Error al agregar')
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error(error)
// // // // //       toast.error('Error de conexión')
// // // // //     } finally {
// // // // //       setAddingToCart(false)
// // // // //     }
// // // // //   }

// // // // //   const handleWhatsApp = () => {
// // // // //     const mensaje = encodeURIComponent(
// // // // //       `Hola! Necesito ${cajasNecesarias} cajas de *${piso.nombre_completo || piso.nombre}* (SKU: ${piso.sku}).\n\n` +
// // // // //       `Stock disponible: ${piso.stock} cajas\n` +
// // // // //       `Área a cubrir: ${areaTotal?.toFixed(2)} m²\n\n` +
// // // // //       `¿Pueden conseguir las cajas faltantes?`
// // // // //     )
// // // // //     const numeroWhatsApp = '5215512345678'
// // // // //     window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank')
// // // // //   }

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <div className='min-h-screen flex items-center justify-center bg-gray-50'>
// // // // //         <div className='text-center'>
// // // // //           <div className='w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
// // // // //           <p className='text-gray-600 font-medium'>Cargando...</p>
// // // // //         </div>
// // // // //       </div>
// // // // //     )
// // // // //   }

// // // // //   if (!piso) return null

// // // // //   const imagenes = piso.imagen_url 
// // // // //     ? piso.imagen_url.split(',').map(img => img.trim()).filter(Boolean)
// // // // //     : ['/placeholder.jpg']

// // // // //   const stockInsuficiente = cajasNecesarias && cajasNecesarias > piso.stock

// // // // //   return (
// // // // //     <div className='min-h-screen bg-gray-50 pb-20 md:pb-8' style={{ backgroundColor: '#f8fafc' }}>
// // // // //       <Header />

// // // // //       <main className='container mx-auto px-3 md:px-6 py-4 md:py-6'>
// // // // //         {/* Breadcrumb */}
// // // // //         <nav className='flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6'>
// // // // //           <button onClick={() => router.push('/pisos')} className='hover:text-yellow-400 transition'>
// // // // //             Pisos
// // // // //           </button>
// // // // //           <span>/</span>
// // // // //           <span className='font-semibold truncate' style={{ color: '#00162f' }}>
// // // // //             {piso.nombre_completo || piso.nombre}
// // // // //           </span>
// // // // //         </nav>

// // // // //         <div className='grid lg:grid-cols-[1fr_400px] gap-6 md:gap-8 lg:gap-6 mb-8'>
          
          
// // // // //           {/* COLUMNA IZQUIERDA: Áreas de uso + Galería */}
// // // // //           <div className="space-y-3 lg:space-y-4">
          

// // // // //             {/* Galería */}
// // // // //             <div className='relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100'>
// // // // //               <img
// // // // //                 src={imagenes[currentImg]}
// // // // //                 alt={piso.nombre_completo || piso.nombre}
// // // // //                 className='w-full h-64 md:h-[500px] lg:h-[550px] object-cover cursor-zoom-in'
// // // // //                 onClick={() => setShowImageModal(true)}
// // // // //               />
              
// // // // //               {imagenes.length > 1 && (
// // // // //                 <>
// // // // //                   <button
// // // // //                     onClick={() => setCurrentImg((prev) => (prev - 1 + imagenes.length) % imagenes.length)}
// // // // //                     className='absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition'
// // // // //                   >
// // // // //                     <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
// // // // //                   </button>
// // // // //                   <button
// // // // //                     onClick={() => setCurrentImg((prev) => (prev + 1) % imagenes.length)}
// // // // //                     className='absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition'
// // // // //                   >
// // // // //                     <ChevronRight className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
// // // // //                   </button>
// // // // //                 </>
// // // // //               )}
// // // // //             </div>
            

// // // // //             {/* Miniaturas */}
// // // // //             {imagenes.length > 1 && (
// // // // //               <div className='flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide'>
// // // // //                 {imagenes.map((img, idx) => (
// // // // //                   <button
// // // // //                     key={idx}
// // // // //                     onClick={() => setCurrentImg(idx)}
// // // // //                     className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-16 lg:h-16 rounded-lg overflow-hidden border-2 transition ${
// // // // //                       idx === currentImg ? 'border-yellow-400' : 'border-transparent opacity-60 hover:opacity-100'
// // // // //                     }`}
// // // // //                   >
// // // // //                     <img src={img} alt="" className='w-full h-full object-cover' />
// // // // //                   </button>
// // // // //                 ))}
// // // // //               </div>
              
// // // // //             )}
        
// // // // //             {/* //! ESPECIFICACIONES */}
// // // // //             <div className='bg-gray-200 rounded-2xl p-4 shadow-sm border border-gray-100 mx-auto'>
// // // // //               <h2 className='text-lg lg:text-xl font-black mb-2' style={{ color: '#00162f' }}>
// // // // //                 Especificaciones Técnicas
// // // // //               </h2>
// // // // //               <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8'>
// // // // //                 {[
// // // // //                   { label: 'Cuerpo', value: piso.cuerpo },
// // // // //                   { label: 'Absorción', value: piso.absorcion },
// // // // //                   { label: 'Resistencia flexión', value: piso.resistencia_flexion },
// // // // //                   { label: 'Rectificado', value: piso.rectificado ? 'Sí' : 'No' },
// // // // //                   { label: 'Piezas x Caja', value: piso.piezas_por_caja },
// // // // //                   { label: 'm² x Caja', value: piso.m2_por_caja },
// // // // //                   { label: 'KG x Caja', value: piso.kg_por_caja ? `${piso.kg_por_caja} kg` : 'N/A' },
// // // // //                   { label: 'Tecnología', value: piso.tecnologia || 'N/A' },
// // // // //                   // { label: 'Stock', value: `${piso.stock} cajas` }
// // // // //                 ].map((item, i) => (
// // // // //                   <div key={i} className='flex justify-between items-center py-2 lg:py-2.5 border-b border-gray-50'>
// // // // //                     <span className='text-xs text-gray-500 font-medium'>{item.label}</span>
// // // // //                     <span className='text-xs font-bold' style={{ color: '#00162f' }}>
// // // // //                       {item.value || 'N/A'}
// // // // //                     </span>
// // // // //                   </div>
// // // // //                 ))}
// // // // //               </div>
// // // // //             </div>

// // // // //           </div>

// // // // //           {/* COLUMNA DERECHA: Info compacta + Calculadora */}
// // // // //           {/* <div className="lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 space-y-3 lg:space-y-3"> */}
// // // // //           <div className="lg:pr-2 space-y-3 lg:space-y-3">
// // // // //             {/* Colección */}
// // // // //             {piso.coleccion && (
// // // // //               <span className='inline-block bg-yellow-400 text-[9px] lg:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full' style={{ color: '#00162f' }}>
// // // // //                 {piso.coleccion}
// // // // //               </span>
// // // // //             )}

// // // // //             {/* Título */}
// // // // //             <h1 className='text-xl md:text-3xl lg:text-2xl font-black leading-tight' style={{ color: '#00162f' }}>
// // // // //               {piso.nombre_completo || piso.nombre}
// // // // //             </h1>

// // // // //             {/* Descripción */}
// // // // //             {piso.descripcion && (
// // // // //               <p className='text-sm lg:text-base text-justify text-gray-600 leading-snug'>
// // // // //                 {piso.descripcion}
// // // // //               </p>
// // // // //             )}

            
// // // // //             {/* //& Áreas de uso */}
// // // // //             {piso.uso && piso.uso.length > 0 && (
// // // // //               <div className='block bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
// // // // //                     {/*//& Iconos de áreas de uso */}
                
// // // // //                 <div className='flex items-center gap-3 p-2 border-b border-gray-100'>
// // // // //                   <h2 className='text-lg font-black text-gray-500'>Áreas de Uso </h2>
// // // // //                   {/* Mapeo de área a icono */}
// // // // //                   {(() => {
// // // // //                     const iconMap = {
// // // // //                       'Interior': <Home className="w-5 h-5" />,
// // // // //                       'Baño': <Bath className="w-5 h-5" />,
// // // // //                       'Cocina': <UtensilsCrossed className="w-5 h-5" />,
// // // // //                       'Recámara': <Bed className="w-5 h-5" />,
// // // // //                       'Sala': <Sofa className="w-5 h-5" />,
// // // // //                       'Exterior': <Trees className="w-5 h-5" />,
// // // // //                       'Comercial': <Warehouse className="w-5 h-5" />
// // // // //                     }

// // // // //                     // Si no encuentra coincidencia exacta, muestra iconos genéricos
// // // // //                     const usedAreas = piso.uso || []
// // // // //                     const icons = usedAreas.map(area => iconMap[area] || null).filter(Boolean)

                    
// // // // //                     // Si no hay iconos específicos, mostrar set básico
// // // // //                     if (icons.length === 0) {
// // // // //                       return [
// // // // //                         <Bath key="bath" className="w-5 h-5" />,
// // // // //                         <ShowerHead key="shower" className="w-5 h-5" />,
// // // // //                         <Bed key="bed" className="w-5 h-5" />,
// // // // //                         <Sofa key="sofa" className="w-5 h-5" />,
// // // // //                         <UtensilsCrossed key="kitchen" className="w-5 h-5" />,
// // // // //                         <Home key="home" className="w-5 h-5" />
// // // // //                       ].map((icon, idx) => (
// // // // //                         <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors'>
// // // // //                           {icon}
// // // // //                         </div>
// // // // //                       ))
// // // // //                     }

// // // // //                     return icons.map((icon, idx) => (
// // // // //                       <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors'>
// // // // //                         {icon}
// // // // //                       </div>
// // // // //                     ))
// // // // //                   })()}
// // // // //                 </div>
                
// // // // //                 {/* Header con nombre */}
// // // // //                 <div className='mb-3'>
              
// // // // //                   <div className='space-y-0.5 text-xs text-gray-600'>
// // // // //                     <p>{piso.estilo}</p>
// // // // //                     <p>{piso.aplicacion}</p>
// // // // //                     <p>{piso.cuerpo}</p>
// // // // //                   </div>
                
// // // // //                 </div>

// // // // //               </div>
// // // // //             )}


// // // // //             {/* Precio */}
// // // // //             <div className='bg-white rounded-xl p-3 lg:p-4 border border-gray-100 shadow-sm'>
// // // // //               <div className='flex items-baseline gap-2 mb-1'>
// // // // //                 <span className='text-2xl lg:text-3xl font-black' style={{ color: '#00162f' }}>
// // // // //                   ${Number(piso.precio).toFixed(2)}
// // // // //                 </span>
// // // // //                 <span className='text-xs text-gray-400 font-medium'>m²</span>
// // // // //               </div>
// // // // //               <p className='text-[10px] lg:text-xs text-gray-500'>
// // // // //                 {piso.m2_por_caja} m²/caja • {piso.piezas_por_caja} pzs
// // // // //               </p>
// // // // //             </div>

// // // // //             {/* Atributos */}
// // // // //             <div className='grid grid-cols-3 gap-2'>
// // // // //               {[
// // // // //                 { label: 'Formato', value: piso.formato },
// // // // //                 { label: 'Acabado', value: piso.acabado },
// // // // //                 { label: 'PEI', value: piso.pei || 'N/A' }
// // // // //               ].map((attr, i) => (
// // // // //                 <div key={i} className='bg-gray-50 rounded-lg p-2 border border-gray-100'>
// // // // //                   <p className='text-[8px] lg:text-[9px] uppercase font-bold text-gray-400 mb-0.5'>
// // // // //                     {attr.label}
// // // // //                   </p>
// // // // //                   <p className='text-[10px] lg:text-xs font-bold' style={{ color: '#00162f' }}>
// // // // //                     {attr.value}
// // // // //                   </p>
// // // // //                 </div>
// // // // //               ))}
// // // // //             </div>

// // // // //             {/* //*  ******************************CALCULADORA COMPACTA */}
// // // // //             <div className='rounded-xl p-3 lg:p-4 border-2' style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
// // // // //               <div className='flex items-center gap-2 mb-3'>
// // // // //                 <div className='bg-yellow-400 p-1.5 rounded-lg'>
// // // // //                   <Calculator className='w-4 h-4 lg:w-4 lg:h-4' style={{ color: '#00162f' }} />
// // // // //                 </div>
// // // // //                 <h3 className='text-sm lg:text-base font-black text-white'>
// // // // //                   Calcula Cajas
// // // // //                 </h3>
// // // // //               </div>

// // // // //               <div className='space-y-2.5'>
// // // // //                 {/* Inputs */}
// // // // //                 <div className='grid grid-cols-2 gap-2'>
// // // // //                   <div>
// // // // //                     <label className='block text-[9px] font-bold text-yellow-400 mb-1 uppercase'>
// // // // //                       Ancho (m)
// // // // //                     </label>
// // // // //                     <input
// // // // //                       type="number"
// // // // //                       step="0.01"
// // // // //                       min="0"
// // // // //                       value={ancho}
// // // // //                       onChange={(e) => setAncho(e.target.value)}
// // // // //                       placeholder="10"
// // // // //                       className='w-full px-2 py-1.5 border-2 border-gray-600 rounded-lg font-bold text-xs bg-gray-800 text-white focus:border-yellow-400 focus:outline-none transition-colors'
// // // // //                     />
// // // // //                   </div>
// // // // //                   <div>
// // // // //                     <label className='block text-[9px] font-bold text-yellow-400 mb-1 uppercase'>
// // // // //                       Largo (m)
// // // // //                     </label>
// // // // //                     <input
// // // // //                       type="number"
// // // // //                       step="0.01"
// // // // //                       min="0"
// // // // //                       value={largo}
// // // // //                       onChange={(e) => setLargo(e.target.value)}
// // // // //                       placeholder="10"
// // // // //                       className='w-full px-2 py-1.5 border-2 border-gray-600 rounded-lg font-bold text-xs bg-gray-800 text-white focus:border-yellow-400 focus:outline-none transition-colors'
// // // // //                     />
// // // // //                   </div>
// // // // //                 </div>

// // // // //                 {/* Área */}
// // // // //                 {ancho && largo && parseFloat(ancho) > 0 && parseFloat(largo) > 0 && (
// // // // //                   <div className='bg-gray-800 rounded-lg p-2 border border-gray-700'>
// // // // //                     <p className='text-[9px] text-gray-400 mb-0.5'>Área a cubrir</p>
// // // // //                     <p className='text-base lg:text-lg font-black text-white'>
// // // // //                       {(parseFloat(ancho) * parseFloat(largo)).toFixed(2)} m²
// // // // //                       {incluirExtra && (
// // // // //                         <span className='text-xs text-yellow-400 ml-1.5'>
// // // // //                           +10%
// // // // //                         </span>
// // // // //                       )}
// // // // //                     </p>
// // // // //                   </div>
// // // // //                 )}

// // // // //                 {/* Checkbox */}
// // // // //                 <label className='flex items-start gap-2 cursor-pointer bg-gray-800 rounded-lg p-2 border border-gray-700 hover:border-yellow-400 transition-colors'>
// // // // //                   <input
// // // // //                     type="checkbox"
// // // // //                     checked={incluirExtra}
// // // // //                     onChange={(e) => setIncluirExtra(e.target.checked)}
// // // // //                     className='w-3.5 h-3.5 accent-yellow-400 mt-0.5 flex-shrink-0'
// // // // //                   />
// // // // //                   <span className='text-[10px] lg:text-xs font-semibold text-white leading-tight'>
// // // // //                     +10% extra para cortes
// // // // //                   </span>
// // // // //                 </label>

// // // // //                 {/* Botón Calcular */}
// // // // //                 <button
// // // // //                   onClick={calcularCajas}
// // // // //                   disabled={!ancho || !largo}
// // // // //                   className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2'
// // // // //                   style={{ color: '#00162f' }}
// // // // //                 >
// // // // //                   <Calculator className="w-4 h-4" />
// // // // //                   Calcular
// // // // //                 </button>

// // // // //                 {/* Resultado */}
// // // // //                 {cajasNecesarias !== null && (
// // // // //                   <div className='bg-white rounded-lg p-3 animate-in fade-in zoom-in duration-300'>
// // // // //                     <div className='flex items-center justify-between mb-2.5'>
// // // // //                       <div>
// // // // //                         <p className='text-[9px] text-gray-500 mb-0.5'>Cajas necesarias</p>
// // // // //                         <p className='text-2xl font-black flex items-center gap-1.5' style={{ color: '#00162f' }}>
// // // // //                           <Package className="w-5 h-5" />
// // // // //                           {cajasNecesarias}
// // // // //                         </p>
// // // // //                       </div>
// // // // //                       <div className='text-right'>
// // // // //                         <p className='text-[9px] text-gray-500 mb-0.5'>Stock</p>
// // // // //                         <p className={`text-lg font-black ${
// // // // //                           piso.stock >= cajasNecesarias ? 'text-green-600' : 'text-red-600'
// // // // //                         }`}>
// // // // //                           {piso.stock}
// // // // //                         </p>
// // // // //                       </div>
// // // // //                     </div>

// // // // //                     {/*//!  Botón */}
// // // // //                     {stockInsuficiente ? (
// // // // //                       <>
// // // // //                         <button
// // // // //                           onClick={handleWhatsApp}
// // // // //                           className='w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95'
// // // // //                         >
// // // // //                           <MessageCircle className="w-4 h-4" />
// // // // //                           WhatsApp
// // // // //                         </button>
// // // // //                         <div className='flex items-start gap-1.5 mt-2 bg-red-50 border border-red-200 rounded p-2'>
// // // // //                           <AlertTriangle className='text-red-600 shrink-0 w-3.5 h-3.5 mt-0.5' />
// // // // //                           <p className='text-xs text-red-700 font-medium leading-tight'>
// // // // //                             Stock insuficiente. Contacta con nosotros para hacer el pedido completo.
// // // // //                           </p>
// // // // //                         </div>
// // // // //                       </>
// // // // //                     ) : (
// // // // //                       <button
// // // // //                         onClick={handleAddToCart}
// // // // //                         disabled={addingToCart}
// // // // //                         className='w-full bg-yellow-400 hover:bg-yellow-500 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-gray-400'
// // // // //                         style={{ color: '#00162f' }}
// // // // //                       >
// // // // //                         <ShoppingCart className="w-4 h-4" />
// // // // //                         {addingToCart ? 'Agregando...' : `Agregar ${cajasNecesarias}`}
// // // // //                       </button>
// // // // //                     )}
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* //! Botones secundarios */}
// // // // //             {/* <div className="grid grid-cols-2 gap-2">
// // // // //               <button className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-gray-200 rounded-lg font-bold text-[10px] lg:text-xs hover:shadow-md transition-all" style={{ color: '#00162f' }}>
// // // // //                 <Download className="w-3.5 h-3.5" /> 
// // // // //                 Ficha
// // // // //               </button>
// // // // //               <button className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-gray-200 rounded-lg font-bold text-[10px] lg:text-xs hover:shadow-md transition-all" style={{ color: '#00162f' }}>
// // // // //                 <Share2 className="w-3.5 h-3.5" /> 
// // // // //                 Compartir
// // // // //               </button>
// // // // //             </div> */}


// // // // //           </div>

// // // // //         </div>


// // // // //       </main>

// // // // //       {/* Modal */}
// // // // //       {showImageModal && (
// // // // //         <div 
// // // // //           className='fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300'
// // // // //           style={{ backgroundColor: 'rgba(0, 22, 47, 0.95)' }}
// // // // //           onClick={() => setShowImageModal(false)}
// // // // //         >
// // // // //           <button
// // // // //             onClick={() => setShowImageModal(false)}
// // // // //             className='absolute top-4 md:top-8 right-4 md:right-8 text-white p-2 hover:bg-white/10 rounded-full transition'
// // // // //           >
// // // // //             <X className="w-8 h-8 md:w-10 md:h-10" />
// // // // //           </button>
// // // // //           <img
// // // // //             src={imagenes[currentImg]}
// // // // //             alt="Zoom"
// // // // //             className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl'
// // // // //             onClick={(e) => e.stopPropagation()}
// // // // //           />
// // // // //         </div>
// // // // //       )}


// // // // //       <BottomNav />
// // // // //     </div>
// // // // //   )
// // // // // }








// // // // 'use client'
// // // // import { useState, useEffect } from 'react'
// // // // import { useParams, useRouter } from 'next/navigation'
// // // // import Header from '@/components/Header'
// // // // import BottomNav from '@/components/BottomNav'
// // // // import { 
// // // //   ShoppingCart, X, ChevronLeft, ChevronRight,
// // // //   Calculator, MessageCircle, Package, AlertTriangle, Home,
// // // //   Bath, ShowerHead, Bed, Sofa, UtensilsCrossed, Warehouse, Trees
// // // // } from 'lucide-react'
// // // // import toast from 'react-hot-toast'
// // // // import Cookies from 'js-cookie'
// // // // import { useAuth } from '@/context/authContext'

// // // // export default function PisoDetailPage() {
// // // //   const params = useParams()
// // // //   const router = useRouter()
// // // //   const { user, updateCartCount } = useAuth()
  
// // // //   const [producto, setProducto] = useState(null)
// // // //   const [loading, setLoading] = useState(true)
// // // //   const [currentImg, setCurrentImg] = useState(0)
// // // //   const [showImageModal, setShowImageModal] = useState(false)

// // // //   // Estados calculadora
// // // //   const [ancho, setAncho] = useState('')
// // // //   const [largo, setLargo] = useState('')
// // // //   const [incluirExtra, setIncluirExtra] = useState(true)
// // // //   const [cajasNecesarias, setCajasNecesarias] = useState(null)
// // // //   const [areaTotal, setAreaTotal] = useState(null)
// // // //   const [addingToCart, setAddingToCart] = useState(false)

// // // //   useEffect(() => {
// // // //     if (params.id) {
// // // //       fetchProducto()
// // // //     }
// // // //   }, [params.id])

// // // //   const fetchProducto = async () => {
// // // //     try {
// // // //       setLoading(true)
// // // //       const res = await fetch(`/api/pisos/${params.id}`)  // Endpoint por ID
      
// // // //       if (!res.ok) throw new Error('No encontrado')

// // // //       const data = await res.json()
// // // //       setProducto(data)
// // // //     } catch (error) {
// // // //       console.error(error)
// // // //       toast.error('Producto no encontrado')
// // // //       router.push('/pisos')
// // // //     } finally {
// // // //       setLoading(false)
// // // //     }
// // // //   }

// // // //   const calcularCajas = () => {
// // // //     const anchoNum = parseFloat(ancho)
// // // //     const largoNum = parseFloat(largo)

// // // //     if (!anchoNum || !largoNum || anchoNum <= 0 || largoNum <= 0) {
// // // //       toast.error('Ingresa medidas válidas mayores a 0')
// // // //       return
// // // //     }

// // // //     if (!producto.m2_por_caja || producto.m2_por_caja <= 0) {
// // // //       toast.error('Este producto no tiene información de m² por caja')
// // // //       return
// // // //     }

// // // //     let area = anchoNum * largoNum
// // // //     if (incluirExtra) area *= 1.1

// // // //     setAreaTotal(area)
// // // //     const cajas = Math.ceil(area / producto.m2_por_caja) 
// // // //     setCajasNecesarias(cajas)

// // // //     toast.success(`📦 Necesitas ${cajas} caja${cajas !== 1 ? 's' : ''}`)
// // // //   }

// // // //   const handleAddToCart = async () => {
// // // //     if (!user) {
// // // //       toast.error('Inicia sesión para comprar')
// // // //       router.push('/login')
// // // //       return
// // // //     }

// // // //     if (!cajasNecesarias || cajasNecesarias <= 0) {
// // // //       toast.error('Primero calcula las cajas necesarias')
// // // //       return
// // // //     }

// // // //     if (cajasNecesarias > producto.stock) {
// // // //       toast.error('Stock insuficiente')
// // // //       return
// // // //     }

// // // //     setAddingToCart(true)
// // // //     try {
// // // //       const token = Cookies.get('token')
      
// // // //       const res = await fetch('/api/carrito/agregar', {
// // // //         method: 'POST',
// // // //         headers: {
// // // //           'Content-Type': 'application/json',
// // // //           'Authorization': `Bearer ${token}`
// // // //         },
// // // //         body: JSON.stringify({ 
// // // //           pisoId: producto.id,  // Asegúrate de que el endpoint espere pisoId o productoId
// // // //           cantidad: cajasNecesarias
// // // //         })
// // // //       })

// // // //       const data = await res.json()

// // // //       if (res.ok) {
// // // //         toast.success(`${cajasNecesarias} caja${cajasNecesarias !== 1 ? 's' : ''} agregada${cajasNecesarias !== 1 ? 's' : ''}`)
// // // //         await updateCartCount()
        
// // // //         setAncho('')
// // // //         setLargo('')
// // // //         setCajasNecesarias(null)
// // // //         setAreaTotal(null)
// // // //       } else {
// // // //         toast.error(data.error || 'Error al agregar')
// // // //       }
// // // //     } catch (error) {
// // // //       console.error(error)
// // // //       toast.error('Error de conexión')
// // // //     } finally {
// // // //       setAddingToCart(false)
// // // //     }
// // // //   }

// // // //   const handleWhatsApp = () => {
// // // //     const mensaje = encodeURIComponent(
// // // //       `Hola! Necesito ${cajasNecesarias} cajas de *${producto.nombre_completo || producto.nombre}* (ID: ${producto.id}).\n\n` +
// // // //       `Stock disponible: ${producto.stock} cajas\n` +
// // // //       `Área a cubrir: ${areaTotal?.toFixed(2)} m²\n\n` +
// // // //       `¿Pueden conseguir las cajas faltantes?`
// // // //     )
// // // //     const numeroWhatsApp = '5215512345678'
// // // //     window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank')
// // // //   }

// // // //   if (loading) {
// // // //     return (
// // // //       <div className='min-h-screen flex items-center justify-center bg-gray-50'>
// // // //         <div className='text-center'>
// // // //           <div className='w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
// // // //           <p className='text-gray-600 font-medium'>Cargando...</p>
// // // //         </div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   if (!producto) return null

// // // //   const imagenes = producto.imagen_url 
// // // //     ? (Array.isArray(producto.imagen_url) ? producto.imagen_url : producto.imagen_url.split(',').map(img => img.trim()).filter(Boolean))
// // // //     : ['/placeholder.jpg']

// // // //   const stockInsuficiente = cajasNecesarias && cajasNecesarias > producto.stock

// // // //   return (
// // // //     <div className='min-h-screen bg-gray-50 pb-20 md:pb-8' style={{ backgroundColor: '#f8fafc' }}>
// // // //       <Header />

// // // //       <main className='container mx-auto px-3 md:px-6 py-4 md:py-6'>
// // // //         {/* Breadcrumb */}
// // // //         <nav className='flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6'>
// // // //           <button onClick={() => router.push('/pisos')} className='hover:text-yellow-400 transition'>
// // // //             Pisos
// // // //           </button>
// // // //           <span>/</span>
// // // //           <span className='font-semibold truncate' style={{ color: '#00162f' }}>
// // // //             {producto.nombre_completo || producto.nombre}
// // // //           </span>
// // // //         </nav>

// // // //         <div className='grid lg:grid-cols-[1fr_400px] gap-6 md:gap-8 lg:gap-6 mb-8'>
// // // //           {/* COLUMNA IZQUIERDA */}
// // // //           <div className="space-y-3 lg:space-y-4">
// // // //             {/* Galería */}
// // // //             <div className='relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100'>
// // // //               <img
// // // //                 src={imagenes[currentImg]}
// // // //                 alt={producto.nombre_completo || producto.nombre}
// // // //                 className='w-full h-64 md:h-[500px] lg:h-[550px] object-cover cursor-zoom-in'
// // // //                 onClick={() => setShowImageModal(true)}
// // // //               />
              
// // // //               {imagenes.length > 1 && (
// // // //                 <>
// // // //                   <button
// // // //                     onClick={() => setCurrentImg((prev) => (prev - 1 + imagenes.length) % imagenes.length)}
// // // //                     className='absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition'
// // // //                   >
// // // //                     <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={() => setCurrentImg((prev) => (prev + 1) % imagenes.length)}
// // // //                     className='absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition'
// // // //                   >
// // // //                     <ChevronRight className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
// // // //                   </button>
// // // //                 </>
// // // //               )}
// // // //             </div>

// // // //             {/* Miniaturas */}
// // // //             {imagenes.length > 1 && (
// // // //               <div className='flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide'>
// // // //                 {imagenes.map((img, idx) => (
// // // //                   <button
// // // //                     key={idx}
// // // //                     onClick={() => setCurrentImg(idx)}
// // // //                     className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-16 lg:h-16 rounded-lg overflow-hidden border-2 transition ${
// // // //                       idx === currentImg ? 'border-yellow-400' : 'border-transparent opacity-60 hover:opacity-100'
// // // //                     }`}
// // // //                   >
// // // //                     <img src={img} alt="" className='w-full h-full object-cover' />
// // // //                   </button>
// // // //                 ))}
// // // //               </div>
// // // //             )}

// // // //             {/* Especificaciones Técnicas */}
// // // //             <div className='bg-gray-200 rounded-2xl p-4 shadow-sm border border-gray-100 mx-auto'>
// // // //               <h2 className='text-lg lg:text-xl font-black mb-2' style={{ color: '#00162f' }}>
// // // //                 Especificaciones Técnicas
// // // //               </h2>
// // // //               <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8'>
// // // //                 {[
// // // //                   { label: 'Cuerpo', value: producto.cuerpo },
// // // //                   { label: 'Absorción', value: producto.absorcion },
// // // //                   { label: 'Resistencia flexión', value: producto.resistencia_flexion },
// // // //                   { label: 'Rectificado', value: producto.rectificado ? 'Sí' : 'No' },
// // // //                   { label: 'Piezas x Caja', value: producto.piezas_por_caja },
// // // //                   { label: 'm² x Caja', value: producto.m2_por_caja },
// // // //                   { label: 'KG x Caja', value: producto.kg_por_caja ? `${producto.kg_por_caja} kg` : 'N/A' },
// // // //                   { label: 'Tecnología', value: producto.tecnologia || 'N/A' },
// // // //                 ].map((item, i) => (
// // // //                   <div key={i} className='flex justify-between items-center py-2 lg:py-2.5 border-b border-gray-50'>
// // // //                     <span className='text-xs text-gray-500 font-medium'>{item.label}</span>
// // // //                     <span className='text-xs font-bold' style={{ color: '#00162f' }}>
// // // //                       {item.value || 'N/A'}
// // // //                     </span>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* COLUMNA DERECHA */}
// // // //           <div className="lg:pr-2 space-y-3 lg:space-y-3">
// // // //             {producto.coleccion && (
// // // //               <span className='inline-block bg-yellow-400 text-[9px] lg:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full' style={{ color: '#00162f' }}>
// // // //                 {producto.coleccion}
// // // //               </span>
// // // //             )}

// // // //             <h1 className='text-xl md:text-3xl lg:text-2xl font-black leading-tight' style={{ color: '#00162f' }}>
// // // //               {producto.nombre_completo || producto.nombre}
// // // //             </h1>

// // // //             {producto.descripcion && (
// // // //               <p className='text-sm lg:text-base text-justify text-gray-600 leading-snug'>
// // // //                 {producto.descripcion}
// // // //               </p>
// // // //             )}

// // // //             {/* Áreas de uso */}
// // // //             {producto.uso && producto.uso.length > 0 && (
// // // //               <div className='block bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
// // // //                 <div className='flex items-center gap-3 p-2 border-b border-gray-100'>
// // // //                   <h2 className='text-lg font-black text-gray-500'>Áreas de Uso</h2>
// // // //                   {(() => {
// // // //                     const iconMap = {
// // // //                       'Interior': <Home className="w-5 h-5" />,
// // // //                       'Baño': <Bath className="w-5 h-5" />,
// // // //                       'Cocina': <UtensilsCrossed className="w-5 h-5" />,
// // // //                       'Recámara': <Bed className="w-5 h-5" />,
// // // //                       'Sala': <Sofa className="w-5 h-5" />,
// // // //                       'Exterior': <Trees className="w-5 h-5" />,
// // // //                       'Comercial': <Warehouse className="w-5 h-5" />
// // // //                     }
// // // //                     const usedAreas = producto.uso || []
// // // //                     const icons = usedAreas.map(area => iconMap[area]).filter(Boolean)
// // // //                     if (icons.length === 0) {
// // // //                       return [
// // // //                         <Bath key="bath" className="w-5 h-5" />,
// // // //                         <ShowerHead key="shower" className="w-5 h-5" />,
// // // //                         <Bed key="bed" className="w-5 h-5" />,
// // // //                         <Sofa key="sofa" className="w-5 h-5" />,
// // // //                         <UtensilsCrossed key="kitchen" className="w-5 h-5" />,
// // // //                         <Home key="home" className="w-5 h-5" />
// // // //                       ].map((icon, idx) => (
// // // //                         <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors'>
// // // //                           {icon}
// // // //                         </div>
// // // //                       ))
// // // //                     }
// // // //                     return icons.map((icon, idx) => (
// // // //                       <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors'>
// // // //                         {icon}
// // // //                       </div>
// // // //                     ))
// // // //                   })()}
// // // //                 </div>
// // // //               </div>
// // // //             )}

// // // //             {/* Precio */}
// // // //             <div className='bg-white rounded-xl p-3 lg:p-4 border border-gray-100 shadow-sm'>
// // // //               <div className='flex items-baseline gap-2 mb-1'>
// // // //                 <span className='text-2xl lg:text-3xl font-black' style={{ color: '#00162f' }}>
// // // //                   ${Number(producto.precio).toFixed(2)}
// // // //                 </span>
// // // //                 <span className='text-xs text-gray-400 font-medium'>m²</span>
// // // //               </div>
// // // //               <p className='text-[10px] lg:text-xs text-gray-500'>
// // // //                 {producto.m2_por_caja} m²/caja • {producto.piezas_por_caja} pzs
// // // //               </p>
// // // //             </div>

// // // //             {/* Atributos */}
// // // //             <div className='grid grid-cols-3 gap-2'>
// // // //               {[
// // // //                 { label: 'Formato', value: producto.formato },
// // // //                 { label: 'Acabado', value: producto.acabado },
// // // //                 { label: 'PEI', value: producto.pei || 'N/A' }
// // // //               ].map((attr, i) => (
// // // //                 <div key={i} className='bg-gray-50 rounded-lg p-2 border border-gray-100'>
// // // //                   <p className='text-[8px] lg:text-[9px] uppercase font-bold text-gray-400 mb-0.5'>
// // // //                     {attr.label}
// // // //                   </p>
// // // //                   <p className='text-[10px] lg:text-xs font-bold' style={{ color: '#00162f' }}>
// // // //                     {attr.value}
// // // //                   </p>
// // // //                 </div>
// // // //               ))}
// // // //             </div>

// // // //             {/* Calculadora */}
// // // //             <div className='rounded-xl p-3 lg:p-4 border-2' style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
// // // //               <div className='flex items-center gap-2 mb-3'>
// // // //                 <div className='bg-yellow-400 p-1.5 rounded-lg'>
// // // //                   <Calculator className='w-4 h-4 lg:w-4 lg:h-4' style={{ color: '#00162f' }} />
// // // //                 </div>
// // // //                 <h3 className='text-sm lg:text-base font-black text-white'>
// // // //                   Calcula Cajas
// // // //                 </h3>
// // // //               </div>

// // // //               <div className='space-y-2.5'>
// // // //                 <div className='grid grid-cols-2 gap-2'>
// // // //                   <div>
// // // //                     <label className='block text-[9px] font-bold text-yellow-400 mb-1 uppercase'>
// // // //                       Ancho (m)
// // // //                     </label>
// // // //                     <input
// // // //                       type="number"
// // // //                       step="0.01"
// // // //                       min="0"
// // // //                       value={ancho}
// // // //                       onChange={(e) => setAncho(e.target.value)}
// // // //                       placeholder="10"
// // // //                       className='w-full px-2 py-1.5 border-2 border-gray-600 rounded-lg font-bold text-xs bg-gray-800 text-white focus:border-yellow-400 focus:outline-none transition-colors'
// // // //                     />
// // // //                   </div>
// // // //                   <div>
// // // //                     <label className='block text-[9px] font-bold text-yellow-400 mb-1 uppercase'>
// // // //                       Largo (m)
// // // //                     </label>
// // // //                     <input
// // // //                       type="number"
// // // //                       step="0.01"
// // // //                       min="0"
// // // //                       value={largo}
// // // //                       onChange={(e) => setLargo(e.target.value)}
// // // //                       placeholder="10"
// // // //                       className='w-full px-2 py-1.5 border-2 border-gray-600 rounded-lg font-bold text-xs bg-gray-800 text-white focus:border-yellow-400 focus:outline-none transition-colors'
// // // //                     />
// // // //                   </div>
// // // //                 </div>

// // // //                 {ancho && largo && parseFloat(ancho) > 0 && parseFloat(largo) > 0 && (
// // // //                   <div className='bg-gray-800 rounded-lg p-2 border border-gray-700'>
// // // //                     <p className='text-[9px] text-gray-400 mb-0.5'>Área a cubrir</p>
// // // //                     <p className='text-base lg:text-lg font-black text-white'>
// // // //                       {(parseFloat(ancho) * parseFloat(largo)).toFixed(2)} m²
// // // //                       {incluirExtra && (
// // // //                         <span className='text-xs text-yellow-400 ml-1.5'>
// // // //                           +10%
// // // //                         </span>
// // // //                       )}
// // // //                     </p>
// // // //                   </div>
// // // //                 )}

// // // //                 <label className='flex items-start gap-2 cursor-pointer bg-gray-800 rounded-lg p-2 border border-gray-700 hover:border-yellow-400 transition-colors'>
// // // //                   <input
// // // //                     type="checkbox"
// // // //                     checked={incluirExtra}
// // // //                     onChange={(e) => setIncluirExtra(e.target.checked)}
// // // //                     className='w-3.5 h-3.5 accent-yellow-400 mt-0.5 flex-shrink-0'
// // // //                   />
// // // //                   <span className='text-[10px] lg:text-xs font-semibold text-white leading-tight'>
// // // //                     +10% extra para cortes
// // // //                   </span>
// // // //                 </label>

// // // //                 <button
// // // //                   onClick={calcularCajas}
// // // //                   disabled={!ancho || !largo}
// // // //                   className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2'
// // // //                   style={{ color: '#00162f' }}
// // // //                 >
// // // //                   <Calculator className="w-4 h-4" />
// // // //                   Calcular
// // // //                 </button>

// // // //                 {cajasNecesarias !== null && (
// // // //                   <div className='bg-white rounded-lg p-3 animate-in fade-in zoom-in duration-300'>
// // // //                     <div className='flex items-center justify-between mb-2.5'>
// // // //                       <div>
// // // //                         <p className='text-[9px] text-gray-500 mb-0.5'>Cajas necesarias</p>
// // // //                         <p className='text-2xl font-black flex items-center gap-1.5' style={{ color: '#00162f' }}>
// // // //                           <Package className="w-5 h-5" />
// // // //                           {cajasNecesarias}
// // // //                         </p>
// // // //                       </div>
// // // //                       <div className='text-right'>
// // // //                         <p className='text-[9px] text-gray-500 mb-0.5'>Stock</p>
// // // //                         <p className={`text-lg font-black ${
// // // //                           producto.stock >= cajasNecesarias ? 'text-green-600' : 'text-red-600'
// // // //                         }`}>
// // // //                           {producto.stock}
// // // //                         </p>
// // // //                       </div>
// // // //                     </div>

// // // //                     {stockInsuficiente ? (
// // // //                       <>
// // // //                         <button
// // // //                           onClick={handleWhatsApp}
// // // //                           className='w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95'
// // // //                         >
// // // //                           <MessageCircle className="w-4 h-4" />
// // // //                           WhatsApp
// // // //                         </button>
// // // //                         <div className='flex items-start gap-1.5 mt-2 bg-red-50 border border-red-200 rounded p-2'>
// // // //                           <AlertTriangle className='text-red-600 shrink-0 w-3.5 h-3.5 mt-0.5' />
// // // //                           <p className='text-xs text-red-700 font-medium leading-tight'>
// // // //                             Stock insuficiente. Contacta con nosotros para hacer el pedido completo.
// // // //                           </p>
// // // //                         </div>
// // // //                       </>
// // // //                     ) : (
// // // //                       <button
// // // //                         onClick={handleAddToCart}
// // // //                         disabled={addingToCart}
// // // //                         className='w-full bg-yellow-400 hover:bg-yellow-500 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-gray-400'
// // // //                         style={{ color: '#00162f' }}
// // // //                       >
// // // //                         <ShoppingCart className="w-4 h-4" />
// // // //                         {addingToCart ? 'Agregando...' : `Agregar ${cajasNecesarias}`}
// // // //                       </button>
// // // //                     )}
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </main>

// // // //       {/* Modal de imagen */}
// // // //       {showImageModal && (
// // // //         <div 
// // // //           className='fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300'
// // // //           style={{ backgroundColor: 'rgba(0, 22, 47, 0.95)' }}
// // // //           onClick={() => setShowImageModal(false)}
// // // //         >
// // // //           <button
// // // //             onClick={() => setShowImageModal(false)}
// // // //             className='absolute top-4 md:top-8 right-4 md:right-8 text-white p-2 hover:bg-white/10 rounded-full transition'
// // // //           >
// // // //             <X className="w-8 h-8 md:w-10 md:h-10" />
// // // //           </button>
// // // //           <img
// // // //             src={imagenes[currentImg]}
// // // //             alt="Zoom"
// // // //             className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl'
// // // //             onClick={(e) => e.stopPropagation()}
// // // //           />
// // // //         </div>
// // // //       )}

// // // //       <BottomNav />
// // // //     </div>
// // // //   )
// // // // }



// // // 'use client'
// // // import { useState, useEffect } from 'react'
// // // import { useParams, useRouter } from 'next/navigation'
// // // import Header from '@/components/Header'
// // // import BottomNav from '@/components/BottomNav'
// // // import { 
// // //   ShoppingCart, X, ChevronLeft, ChevronRight,
// // //   Calculator, MessageCircle, Package, AlertTriangle, Home,
// // //   Bath, ShowerHead, Bed, Sofa, UtensilsCrossed, Warehouse, Trees
// // // } from 'lucide-react'
// // // import toast from 'react-hot-toast'
// // // import Cookies from 'js-cookie'
// // // import { useAuth } from '@/context/authContext'

// // // //* Líneas consideradas como productos cerámicos (con calculadora y detalles técnicos)
// // // const LINEAS_CERAMICAS = ['Pisos', 'Azulejos', 'Decorados']

// // // export default function PisoDetailPage() {
// // //   const params = useParams()
// // //   const router = useRouter()
// // //   const { user, updateCartCount } = useAuth()
  
// // //   const [producto, setProducto] = useState(null)
// // //   const [loading, setLoading] = useState(true)
// // //   const [currentImg, setCurrentImg] = useState(0)
// // //   const [showImageModal, setShowImageModal] = useState(false)

// // //   // Estados para calculadora (solo cerámicos)
// // //   const [ancho, setAncho] = useState('')
// // //   const [largo, setLargo] = useState('')
// // //   const [incluirExtra, setIncluirExtra] = useState(true)
// // //   const [cajasNecesarias, setCajasNecesarias] = useState(null)
// // //   const [areaTotal, setAreaTotal] = useState(null)

// // //   // Estados para productos generales
// // //   const [cantidadSimple, setCantidadSimple] = useState('1')

// // //   // Estado común para agregar al carrito
// // //   const [addingToCart, setAddingToCart] = useState(false)

// // //   useEffect(() => {
// // //     if (params.id) {
// // //       fetchProducto()
// // //     }
// // //   }, [params.id])

// // //   const fetchProducto = async () => {
// // //     try {
// // //       setLoading(true)
// // //       const res = await fetch(`/api/pisos/${params.id}`)  // Endpoint por ID
      
// // //       if (!res.ok) throw new Error('No encontrado')

// // //       const data = await res.json()
// // //       setProducto(data)
// // //     } catch (error) {
// // //       console.error(error)
// // //       toast.error('Producto no encontrado')
// // //       router.push('/pisos')
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   // Determina si el producto es cerámico (usa calculadora)
// // //   const esCeramico = producto?.linea && LINEAS_CERAMICAS.includes(producto.linea)

// // //   // Cálculo de cajas para cerámicos
// // //   const calcularCajas = () => {
// // //     const anchoNum = parseFloat(ancho)
// // //     const largoNum = parseFloat(largo)

// // //     if (!anchoNum || !largoNum || anchoNum <= 0 || largoNum <= 0) {
// // //       toast.error('Ingresa medidas válidas mayores a 0')
// // //       return
// // //     }

// // //     if (!producto.m2_por_caja || producto.m2_por_caja <= 0) {
// // //       toast.error('Este producto no tiene información de m² por caja')
// // //       return
// // //     }

// // //     let area = anchoNum * largoNum
// // //     if (incluirExtra) area *= 1.1

// // //     setAreaTotal(area)
// // //     const cajas = Math.ceil(area / producto.m2_por_caja) 
// // //     setCajasNecesarias(cajas)

// // //     toast.success(`📦 Necesitas ${cajas} caja${cajas !== 1 ? 's' : ''}`)
// // //   }

// // //   // Agregar al carrito (para cerámicos, usa cajasNecesarias)
// // //   const handleAddToCart = async () => {
// // //     if (!user) {
// // //       toast.error('Inicia sesión para comprar')
// // //       router.push('/login')
// // //       return
// // //     }

// // //     if (!cajasNecesarias || cajasNecesarias <= 0) {
// // //       toast.error('Primero calcula las cajas necesarias')
// // //       return
// // //     }

// // //     if (cajasNecesarias > producto.stock) {
// // //       toast.error('Stock insuficiente')
// // //       return
// // //     }

// // //     setAddingToCart(true)
// // //     try {
// // //       const token = Cookies.get('token')
      
// // //       const res = await fetch('/api/carrito/agregar', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //           'Authorization': `Bearer ${token}`
// // //         },
// // //         body: JSON.stringify({ 
// // //           pisoId: producto.id,  // El endpoint espera pisoId
// // //           cantidad: cajasNecesarias
// // //         })
// // //       })

// // //       const data = await res.json()

// // //       if (res.ok) {
// // //         toast.success(`${cajasNecesarias} caja${cajasNecesarias !== 1 ? 's' : ''} agregada${cajasNecesarias !== 1 ? 's' : ''}`)
// // //         await updateCartCount()
        
// // //         setAncho('')
// // //         setLargo('')
// // //         setCajasNecesarias(null)
// // //         setAreaTotal(null)
// // //       } else {
// // //         toast.error(data.error || 'Error al agregar')
// // //       }
// // //     } catch (error) {
// // //       console.error(error)
// // //       toast.error('Error de conexión')
// // //     } finally {
// // //       setAddingToCart(false)
// // //     }
// // //   }

// // //   // Agregar al carrito para productos generales (usa cantidadSimple)
// // // const handleAddSimpleToCart = async () => {
// // //   if (!user) {
// // //     toast.error('Inicia sesión para comprar')
// // //     router.push('/login')
// // //     return
// // //   }

// // //   const cantidad = parseInt(cantidadSimple, 10) || 1
// // //   if (cantidad > producto.stock) {
// // //     toast.error('Stock insuficiente')
// // //     return
// // //   }

// // //   setAddingToCart(true)
// // //   try {
// // //     const token = Cookies.get('token')
    
// // //     const res = await fetch('/api/carrito/agregar', {
// // //       method: 'POST',
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //         'Authorization': `Bearer ${token}`
// // //       },
// // //       body: JSON.stringify({ 
// // //         productoId: producto.id,
// // //         cantidad: cantidad
// // //       })
// // //     })

// // //     const data = await res.json()

// // //     if (res.ok) {
// // //       toast.success(`${cantidad} producto${cantidad !== 1 ? 's' : ''} agregado${cantidad !== 1 ? 's' : ''}`)
// // //       await updateCartCount()
// // //       setCantidadSimple('1')
// // //     } else {
// // //       toast.error(data.error || 'Error al agregar')
// // //     }
// // //   } catch (error) {
// // //     console.error(error)
// // //     toast.error('Error de conexión')
// // //   } finally {
// // //     setAddingToCart(false)
// // //   }
// // // }

// // //   const handleWhatsApp = () => {
// // //     const mensaje = encodeURIComponent(
// // //       `Hola! Necesito ${cajasNecesarias} cajas de *${producto.nombre_completo || producto.nombre}* (ID: ${producto.id}).\n\n` +
// // //       `Stock disponible: ${producto.stock} cajas\n` +
// // //       `Área a cubrir: ${areaTotal?.toFixed(2)} m²\n\n` +
// // //       `¿Pueden conseguir las cajas faltantes?`
// // //     )
// // //     const numeroWhatsApp = '5215512345678'
// // //     window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank')
// // //   }

// // //   if (loading) {
// // //     return (
// // //       <div className='min-h-screen flex items-center justify-center bg-gray-50'>
// // //         <div className='text-center'>
// // //           <div className='w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
// // //           <p className='text-gray-600 font-medium'>Cargando...</p>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   if (!producto) return null

// // //   const imagenes = producto.imagen_url 
// // //     ? (Array.isArray(producto.imagen_url) ? producto.imagen_url : producto.imagen_url.split(',').map(img => img.trim()).filter(Boolean))
// // //     : ['/placeholder.jpg']

// // //   const stockInsuficiente = cajasNecesarias && cajasNecesarias > producto.stock

// // //   return (
// // //     <div className='min-h-screen bg-gray-50 pb-20 md:pb-8' style={{ backgroundColor: '#f8fafc' }}>
// // //       <Header />

// // //       <main className='container mx-auto px-3 md:px-6 py-4 md:py-6'>
// // //         {/* Breadcrumb */}
// // //         <nav className='flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6'>
// // //           <button onClick={() => router.push('/pisos')} className='hover:text-yellow-400 transition'>
// // //             {esCeramico ? 'Pisos' : 'Productos'}
// // //           </button>
// // //           <span>/</span>
// // //           <span className='font-semibold truncate' style={{ color: '#00162f' }}>
// // //             {producto.nombre_completo || producto.nombre}
// // //           </span>
// // //         </nav>

// // //         <div className='grid lg:grid-cols-[1fr_400px] gap-6 md:gap-8 lg:gap-6 mb-8'>
// // //           {/* COLUMNA IZQUIERDA (Imágenes y especificaciones) */}
// // //           <div className="space-y-3 lg:space-y-4">
// // //             {/* Galería (igual para todos) */}
// // //             <div className='relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100'>
// // //               <img
// // //                 src={imagenes[currentImg]}
// // //                 alt={producto.nombre_completo || producto.nombre}
// // //                 className='w-full h-64 md:h-[500px] lg:h-[550px] object-cover cursor-zoom-in'
// // //                 onClick={() => setShowImageModal(true)}
// // //               />
              
// // //               {imagenes.length > 1 && (
// // //                 <>
// // //                   <button
// // //                     onClick={() => setCurrentImg((prev) => (prev - 1 + imagenes.length) % imagenes.length)}
// // //                     className='absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition'
// // //                   >
// // //                     <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
// // //                   </button>
// // //                   <button
// // //                     onClick={() => setCurrentImg((prev) => (prev + 1) % imagenes.length)}
// // //                     className='absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition'
// // //                   >
// // //                     <ChevronRight className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
// // //                   </button>
// // //                 </>
// // //               )}
// // //             </div>

// // //             {/* Miniaturas */}
// // //             {imagenes.length > 1 && (
// // //               <div className='flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide'>
// // //                 {imagenes.map((img, idx) => (
// // //                   <button
// // //                     key={idx}
// // //                     onClick={() => setCurrentImg(idx)}
// // //                     className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-16 lg:h-16 rounded-lg overflow-hidden border-2 transition ${
// // //                       idx === currentImg ? 'border-yellow-400' : 'border-transparent opacity-60 hover:opacity-100'
// // //                     }`}
// // //                   >
// // //                     <img src={img} alt="" className='w-full h-full object-cover' />
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             )}

// // //             {/* Especificaciones Técnicas (solo para cerámicos) */}
// // //             {esCeramico && (
// // //               <div className='bg-gray-200 rounded-2xl p-4 shadow-sm border border-gray-100 mx-auto'>
// // //                 <h2 className='text-lg lg:text-xl font-black mb-2' style={{ color: '#00162f' }}>
// // //                   Especificaciones Técnicas
// // //                 </h2>
// // //                 <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8'>
// // //                   {[
// // //                     { label: 'Cuerpo', value: producto.cuerpo },
// // //                     { label: 'Absorción', value: producto.absorcion },
// // //                     { label: 'Resistencia flexión', value: producto.resistencia_flexion },
// // //                     { label: 'Rectificado', value: producto.rectificado ? 'Sí' : 'No' },
// // //                     { label: 'Piezas x Caja', value: producto.piezas_por_caja },
// // //                     { label: 'm² x Caja', value: producto.m2_por_caja },
// // //                     { label: 'KG x Caja', value: producto.kg_por_caja ? `${producto.kg_por_caja} kg` : 'N/A' },
// // //                     { label: 'Tecnología', value: producto.tecnologia || 'N/A' },
// // //                   ].map((item, i) => (
// // //                     <div key={i} className='flex justify-between items-center py-2 lg:py-2.5 border-b border-gray-50'>
// // //                       <span className='text-xs text-gray-500 font-medium'>{item.label}</span>
// // //                       <span className='text-xs font-bold' style={{ color: '#00162f' }}>
// // //                         {item.value || 'N/A'}
// // //                       </span>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* COLUMNA DERECHA (Información y acciones) */}
// // //           <div className="lg:pr-2 space-y-3 lg:space-y-3">
// // //             {/* Colección (solo si existe) */}
// // //             {producto.coleccion && (
// // //               <span className='inline-block bg-yellow-400 text-[9px] lg:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full' style={{ color: '#00162f' }}>
// // //                 {producto.coleccion}
// // //               </span>
// // //             )}

// // //             {/* Título */}
// // //             <h1 className='text-xl md:text-3xl lg:text-2xl font-black leading-tight' style={{ color: '#00162f' }}>
// // //               {producto.nombre_completo || producto.nombre}
// // //             </h1>

// // //             {/* Descripción */}
// // //             {producto.descripcion && (
// // //               <p className='text-sm lg:text-base text-justify text-gray-600 leading-snug'>
// // //                 {producto.descripcion}
// // //               </p>
// // //             )}

// // //             {/* Áreas de uso (solo si existen) */}
// // //             {producto.uso && producto.uso.length > 0 && (
// // //               <div className='block bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
// // //                 <div className='flex items-center gap-3 p-2 border-b border-gray-100'>
// // //                   <h2 className='text-lg font-black text-gray-500'>Áreas de Uso</h2>
// // //                   {(() => {
// // //                     const iconMap = {
// // //                       'Interior': <Home className="w-5 h-5" />,
// // //                       'Baño': <Bath className="w-5 h-5" />,
// // //                       'Cocina': <UtensilsCrossed className="w-5 h-5" />,
// // //                       'Recámara': <Bed className="w-5 h-5" />,
// // //                       'Sala': <Sofa className="w-5 h-5" />,
// // //                       'Exterior': <Trees className="w-5 h-5" />,
// // //                       'Comercial': <Warehouse className="w-5 h-5" />
// // //                     }
// // //                     const usedAreas = producto.uso || []
// // //                     const icons = usedAreas.map(area => iconMap[area]).filter(Boolean)
// // //                     if (icons.length === 0) {
// // //                       return [
// // //                         <Bath key="bath" className="w-5 h-5" />,
// // //                         <ShowerHead key="shower" className="w-5 h-5" />,
// // //                         <Bed key="bed" className="w-5 h-5" />,
// // //                         <Sofa key="sofa" className="w-5 h-5" />,
// // //                         <UtensilsCrossed key="kitchen" className="w-5 h-5" />,
// // //                         <Home key="home" className="w-5 h-5" />
// // //                       ].map((icon, idx) => (
// // //                         <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors'>
// // //                           {icon}
// // //                         </div>
// // //                       ))
// // //                     }
// // //                     return icons.map((icon, idx) => (
// // //                       <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors'>
// // //                         {icon}
// // //                       </div>
// // //                     ))
// // //                   })()}
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {/* Precio */}
// // //             <div className='bg-white rounded-xl p-3 lg:p-4 border border-gray-100 shadow-sm'>
// // //               <div className='flex items-baseline gap-2 mb-1'>
// // //                 <span className='text-2xl lg:text-3xl font-black' style={{ color: '#00162f' }}>
// // //                   ${Number(producto.precio).toFixed(2)}
// // //                 </span>
// // //                 {producto.precio_anterior && (
// // //                   <span className='text-sm text-gray-400 line-through'>
// // //                     ${Number(producto.precio_anterior).toFixed(2)}
// // //                   </span>
// // //                 )}
// // //               </div>
// // //               {esCeramico ? (
// // //                 <p className='text-[10px] lg:text-xs text-gray-500'>
// // //                   {producto.m2_por_caja} m²/caja • {producto.piezas_por_caja} pzs
// // //                 </p>
// // //               ) : (
// // //                 <p className='text-[10px] lg:text-xs text-gray-500'>Precio por pieza</p>
// // //               )}
// // //             </div>

// // //             {/* Atributos rápidos (solo para cerámicos) */}
// // //             {esCeramico && (
// // //               <div className='grid grid-cols-3 gap-2'>
// // //                 {[
// // //                   { label: 'Formato', value: producto.formato },
// // //                   { label: 'Acabado', value: producto.acabado },
// // //                   { label: 'PEI', value: producto.pei || 'N/A' }
// // //                 ].map((attr, i) => (
// // //                   <div key={i} className='bg-gray-50 rounded-lg p-2 border border-gray-100'>
// // //                     <p className='text-[8px] lg:text-[9px] uppercase font-bold text-gray-400 mb-0.5'>
// // //                       {attr.label}
// // //                     </p>
// // //                     <p className='text-[10px] lg:text-xs font-bold' style={{ color: '#00162f' }}>
// // //                       {attr.value || 'N/A'}
// // //                     </p>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}

// // //             {/* Bloque de acción: Calculadora para cerámicos / Input simple para generales */}
// // //             {esCeramico ? (
// // //               /* Calculadora para cerámicos */
// // //               <div className='rounded-xl p-3 lg:p-4 border-2' style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
// // //                 <div className='flex items-center gap-2 mb-3'>
// // //                   <div className='bg-yellow-400 p-1.5 rounded-lg'>
// // //                     <Calculator className='w-4 h-4 lg:w-4 lg:h-4' style={{ color: '#00162f' }} />
// // //                   </div>
// // //                   <h3 className='text-sm lg:text-base font-black text-white'>
// // //                     Calcula Cajas
// // //                   </h3>
// // //                 </div>

// // //                 <div className='space-y-2.5'>
// // //                   <div className='grid grid-cols-2 gap-2'>
// // //                     <div>
// // //                       <label className='block text-[9px] font-bold text-yellow-400 mb-1 uppercase'>
// // //                         Ancho (m)
// // //                       </label>
// // //                       <input
// // //                         type="number"
// // //                         step="0.01"
// // //                         min="0"
// // //                         value={ancho}
// // //                         onChange={(e) => setAncho(e.target.value)}
// // //                         placeholder="10"
// // //                         className='w-full px-2 py-1.5 border-2 border-gray-600 rounded-lg font-bold text-xs bg-gray-800 text-white focus:border-yellow-400 focus:outline-none transition-colors'
// // //                       />
// // //                     </div>
// // //                     <div>
// // //                       <label className='block text-[9px] font-bold text-yellow-400 mb-1 uppercase'>
// // //                         Largo (m)
// // //                       </label>
// // //                       <input
// // //                         type="number"
// // //                         step="0.01"
// // //                         min="0"
// // //                         value={largo}
// // //                         onChange={(e) => setLargo(e.target.value)}
// // //                         placeholder="10"
// // //                         className='w-full px-2 py-1.5 border-2 border-gray-600 rounded-lg font-bold text-xs bg-gray-800 text-white focus:border-yellow-400 focus:outline-none transition-colors'
// // //                       />
// // //                     </div>
// // //                   </div>

// // //                   {ancho && largo && parseFloat(ancho) > 0 && parseFloat(largo) > 0 && (
// // //                     <div className='bg-gray-800 rounded-lg p-2 border border-gray-700'>
// // //                       <p className='text-[9px] text-gray-400 mb-0.5'>Área a cubrir</p>
// // //                       <p className='text-base lg:text-lg font-black text-white'>
// // //                         {(parseFloat(ancho) * parseFloat(largo)).toFixed(2)} m²
// // //                         {incluirExtra && (
// // //                           <span className='text-xs text-yellow-400 ml-1.5'>
// // //                             +10%
// // //                           </span>
// // //                         )}
// // //                       </p>
// // //                     </div>
// // //                   )}

// // //                   <label className='flex items-start gap-2 cursor-pointer bg-gray-800 rounded-lg p-2 border border-gray-700 hover:border-yellow-400 transition-colors'>
// // //                     <input
// // //                       type="checkbox"
// // //                       checked={incluirExtra}
// // //                       onChange={(e) => setIncluirExtra(e.target.checked)}
// // //                       className='w-3.5 h-3.5 accent-yellow-400 mt-0.5 flex-shrink-0'
// // //                     />
// // //                     <span className='text-[10px] lg:text-xs font-semibold text-white leading-tight'>
// // //                       +10% extra para cortes
// // //                     </span>
// // //                   </label>

// // //                   <button
// // //                     onClick={calcularCajas}
// // //                     disabled={!ancho || !largo}
// // //                     className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2'
// // //                     style={{ color: '#00162f' }}
// // //                   >
// // //                     <Calculator className="w-4 h-4" />
// // //                     Calcular
// // //                   </button>

// // //                   {cajasNecesarias !== null && (
// // //                     <div className='bg-white rounded-lg p-3 animate-in fade-in zoom-in duration-300'>
// // //                       <div className='flex items-center justify-between mb-2.5'>
// // //                         <div>
// // //                           <p className='text-[9px] text-gray-500 mb-0.5'>Cajas necesarias</p>
// // //                           <p className='text-2xl font-black flex items-center gap-1.5' style={{ color: '#00162f' }}>
// // //                             <Package className="w-5 h-5" />
// // //                             {cajasNecesarias}
// // //                           </p>
// // //                         </div>
// // //                         <div className='text-right'>
// // //                           <p className='text-[9px] text-gray-500 mb-0.5'>Stock</p>
// // //                           <p className={`text-lg font-black ${
// // //                             producto.stock >= cajasNecesarias ? 'text-green-600' : 'text-red-600'
// // //                           }`}>
// // //                             {producto.stock}
// // //                           </p>
// // //                         </div>
// // //                       </div>

// // //                       {stockInsuficiente ? (
// // //                         <>
// // //                           <button
// // //                             onClick={handleWhatsApp}
// // //                             className='w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95'
// // //                           >
// // //                             <MessageCircle className="w-4 h-4" />
// // //                             WhatsApp
// // //                           </button>
// // //                           <div className='flex items-start gap-1.5 mt-2 bg-red-50 border border-red-200 rounded p-2'>
// // //                             <AlertTriangle className='text-red-600 shrink-0 w-3.5 h-3.5 mt-0.5' />
// // //                             <p className='text-xs text-red-700 font-medium leading-tight'>
// // //                               Stock insuficiente. Contacta con nosotros para hacer el pedido completo.
// // //                             </p>
// // //                           </div>
// // //                         </>
// // //                       ) : (
// // //                         <button
// // //                           onClick={handleAddToCart}
// // //                           disabled={addingToCart}
// // //                           className='w-full bg-yellow-400 hover:bg-yellow-500 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-gray-400'
// // //                           style={{ color: '#00162f' }}
// // //                         >
// // //                           <ShoppingCart className="w-4 h-4" />
// // //                           {addingToCart ? 'Agregando...' : `Agregar ${cajasNecesarias}`}
// // //                         </button>
// // //                       )}
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //             ) : (
// // //               /* Bloque simple para productos generales */
// // //               <div className='rounded-xl p-3 lg:p-4 border-2' style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
// // //                 <div className='flex items-center gap-2 mb-3'>
// // //                   <div className='bg-yellow-400 p-1.5 rounded-lg'>
// // //                     <ShoppingCart className='w-4 h-4 lg:w-4 lg:h-4' style={{ color: '#00162f' }} />
// // //                   </div>
// // //                   <h3 className='text-sm lg:text-base font-black text-white'>
// // //                     Cantidad
// // //                   </h3>
// // //                 </div>
           
// // //                 <div className='space-y-2.5'>
// // //                 <input
// // //   type="text"
// // //   inputMode="numeric"
// // //   pattern="[0-9]*"
// // //   value={cantidadSimple}
// // //   onChange={(e) => {
// // //     // Permitir solo dígitos
// // //     const val = e.target.value.replace(/[^0-9]/g, '')
// // //     setCantidadSimple(val)
// // //   }}
// // //   onBlur={() => {
// // //     // Al salir del campo, normalizar
// // //     let num = parseInt(cantidadSimple, 10)
// // //     if (isNaN(num) || num < 1) num = 1
// // //     if (num > producto.stock) num = producto.stock
// // //     setCantidadSimple(String(num))
// // //   }}
// // //   className='w-full px-3 py-2 border-2 border-gray-600 rounded-lg font-bold text-sm bg-gray-800 text-white focus:border-yellow-400 focus:outline-none'
// // // />
// // //                   <button
// // //                     onClick={handleAddSimpleToCart}
// // // disabled={addingToCart || (cantidadSimple !== '' && parseInt(cantidadSimple) > producto.stock)}
// // //                     className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2'
// // //                     style={{ color: '#00162f' }}
// // //                   >
// // //                     {addingToCart ? 'Agregando...' : 'Agregar al carrito'}
// // //                   </button>
// // //                   {cantidadSimple > producto.stock && (
// // //                     <p className='text-xs text-red-400'>Stock insuficiente</p>
// // //                   )}
// // //                 </div>


// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </main>

// // //       {/* Modal de imagen */}
// // //       {showImageModal && (
// // //         <div 
// // //           className='fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300'
// // //           style={{ backgroundColor: 'rgba(0, 22, 47, 0.95)' }}
// // //           onClick={() => setShowImageModal(false)}
// // //         >
// // //           <button
// // //             onClick={() => setShowImageModal(false)}
// // //             className='absolute top-4 md:top-8 right-4 md:right-8 text-white p-2 hover:bg-white/10 rounded-full transition'
// // //           >
// // //             <X className="w-8 h-8 md:w-10 md:h-10" />
// // //           </button>
// // //           <img
// // //             src={imagenes[currentImg]}
// // //             alt="Zoom"
// // //             className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl'
// // //             onClick={(e) => e.stopPropagation()}
// // //           />
// // //         </div>
// // //       )}

// // //       <BottomNav />
// // //     </div>
// // //   )
// // // }








// // 'use client'
// // import { useState, useEffect } from 'react'
// // import { useParams, useRouter } from 'next/navigation'
// // import Header from '@/components/Header'
// // import BottomNav from '@/components/BottomNav'
// // import { 
// //   ShoppingCart, X, ChevronLeft, ChevronRight,
// //   Calculator, MessageCircle, Package, AlertTriangle, Home,
// //   Bath, ShowerHead, Bed, Sofa, UtensilsCrossed, Warehouse, Trees
// // } from 'lucide-react'
// // import toast from 'react-hot-toast'
// // import Cookies from 'js-cookie'
// // import { useAuth } from '@/context/authContext'

// // const LINEAS_CERAMICAS = ['Pisos', 'Azulejos', 'Decorados']

// // export default function PisoDetailPage() {
// //   const params = useParams()
// //   const router = useRouter()
// //   const { user, updateCartCount } = useAuth()
  
// //   const [producto, setProducto] = useState(null)
// //   const [loading, setLoading] = useState(true)
// //   const [currentImg, setCurrentImg] = useState(0)
// //   const [showImageModal, setShowImageModal] = useState(false)

// //   // Estados calculadora
// //   const [ancho, setAncho] = useState('')
// //   const [largo, setLargo] = useState('')
// //   const [incluirExtra, setIncluirExtra] = useState(true)
// //   const [cajasNecesarias, setCajasNecesarias] = useState(null)
// //   const [areaTotal, setAreaTotal] = useState(null)

// //   // Estados para productos generales
// //   const [cantidadSimple, setCantidadSimple] = useState('1')

// //   // Estados para productos complementarios
// //   const [productosJunteador, setProductosJunteador] = useState([])
// //   const [productosPegamento, setProductosPegamento] = useState([])
// //   const [mostrarOpcionesJunteador, setMostrarOpcionesJunteador] = useState(false)
// //   const [mostrarOpcionesPegamento, setMostrarOpcionesPegamento] = useState(false)
// //   const [junteadorSeleccionado, setJunteadorSeleccionado] = useState(null)
// //   const [pegamentoSeleccionado, setPegamentoSeleccionado] = useState(null)
// //   const [cantidadJunteador, setCantidadJunteador] = useState(0)
// //   const [cantidadPegamento, setCantidadPegamento] = useState(0)

// //   const [addingToCart, setAddingToCart] = useState(false)

// //   useEffect(() => {
// //     if (params.id) {
// //       fetchProducto()
// //     }
// //   }, [params.id])

// //   const fetchProducto = async () => {
// //     try {
// //       setLoading(true)
// //       const res = await fetch(`/api/pisos/${params.id}`)  // Endpoint por ID
      
// //       if (!res.ok) throw new Error('No encontrado')

// //       const data = await res.json()
// //       setProducto(data)
// //     } catch (error) {
// //       console.error(error)
// //       toast.error('Producto no encontrado')
// //       router.push('/pisos')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     if (producto) {
// //       fetchProductosComplementarios()
// //     }
// //   }, [producto])

// //   const fetchProductosComplementarios = async () => {
// //     try {
// //       // Suponiendo que el endpoint acepta query param linea
// //       const [resJ, resP] = await Promise.all([
// //         fetch('/api/productos?linea=Junteador'),
// //         fetch('/api/productos?linea=Pegamentos')
// //       ])
// //       if (resJ.ok) {
// //         const data = await resJ.json()
// //         setProductosJunteador(data)
// //       }
// //       if (resP.ok) {
// //         const data = await resP.json()
// //         setProductosPegamento(data)
// //       }
// //     } catch (error) {
// //       console.error('Error al cargar productos complementarios:', error)
// //     }
// //   }

// //   // Determina si el producto es cerámico
// //   const esCeramico = producto?.linea && LINEAS_CERAMICAS.includes(producto.linea)

// //   const calcularCajas = () => {
// //     const anchoNum = parseFloat(ancho)
// //     const largoNum = parseFloat(largo)

// //     if (!anchoNum || !largoNum || anchoNum <= 0 || largoNum <= 0) {
// //       toast.error('Ingresa medidas válidas mayores a 0')
// //       return
// //     }

// //     if (!producto.m2_por_caja || producto.m2_por_caja <= 0) {
// //       toast.error('Este producto no tiene información de m² por caja')
// //       return
// //     }

// //     let area = anchoNum * largoNum
// //     if (incluirExtra) area *= 1.1

// //     setAreaTotal(area)
// //     const cajas = Math.ceil(area / producto.m2_por_caja)
// //     setCajasNecesarias(cajas)

// //     // Calcular complementos
// //     const cantJ = Math.ceil(area / 10)
// //     const cantP = Math.ceil(area / 4)
// //     setCantidadJunteador(cantJ)
// //     setCantidadPegamento(cantP)

// //     toast.success(`📦 Necesitas ${cajas} caja${cajas !== 1 ? 's' : ''}`)
// //   }

// //   const handleAddToCart = async () => {
// //     if (!user) {
// //       toast.error('Inicia sesión para comprar')
// //       router.push('/login')
// //       return
// //     }

// //     if (!cajasNecesarias || cajasNecesarias <= 0) {
// //       toast.error('Primero calcula las cajas necesarias')
// //       return
// //     }

// //     if (cajasNecesarias > producto.stock) {
// //       toast.error('Stock insuficiente')
// //       return
// //     }

// //     setAddingToCart(true)
// //     try {
// //       const token = Cookies.get('token')
      
// //       const res = await fetch('/api/carrito/agregar', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${token}`
// //         },
// //         body: JSON.stringify({ 
// //           productoId: producto.id,
// //           cantidad: cajasNecesarias
// //         })
// //       })

// //       const data = await res.json()

// //       if (res.ok) {
// //         toast.success(`${cajasNecesarias} caja${cajasNecesarias !== 1 ? 's' : ''} agregada${cajasNecesarias !== 1 ? 's' : ''}`)
// //         await updateCartCount()
        
// //         setAncho('')
// //         setLargo('')
// //         setCajasNecesarias(null)
// //         setAreaTotal(null)
// //       } else {
// //         toast.error(data.error || 'Error al agregar')
// //       }
// //     } catch (error) {
// //       console.error(error)
// //       toast.error('Error de conexión')
// //     } finally {
// //       setAddingToCart(false)
// //     }
// //   }

// //   const handleAddSimpleToCart = async () => {
// //     if (!user) {
// //       toast.error('Inicia sesión para comprar')
// //       router.push('/login')
// //       return
// //     }

// //     const cantidad = parseInt(cantidadSimple, 10) || 1
// //     if (cantidad > producto.stock) {
// //       toast.error('Stock insuficiente')
// //       return
// //     }

// //     setAddingToCart(true)
// //     try {
// //       const token = Cookies.get('token')
      
// //       const res = await fetch('/api/carrito/agregar', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${token}`
// //         },
// //         body: JSON.stringify({ 
// //           productoId: producto.id,
// //           cantidad: cantidad
// //         })
// //       })

// //       const data = await res.json()

// //       if (res.ok) {
// //         toast.success(`${cantidad} producto${cantidad !== 1 ? 's' : ''} agregado${cantidad !== 1 ? 's' : ''}`)
// //         await updateCartCount()
// //         setCantidadSimple('1')
// //       } else {
// //         toast.error(data.error || 'Error al agregar')
// //       }
// //     } catch (error) {
// //       console.error(error)
// //       toast.error('Error de conexión')
// //     } finally {
// //       setAddingToCart(false)
// //     }
// //   }

// //   const handleAddComplemento = async (producto, cantidad) => {
// //     if (!user) {
// //       toast.error('Inicia sesión para comprar')
// //       router.push('/login')
// //       return
// //     }
// //     if (cantidad > producto.stock) {
// //       toast.error('Stock insuficiente')
// //       return
// //     }
// //     setAddingToCart(true)
// //     try {
// //       const token = Cookies.get('token')
// //       const res = await fetch('/api/carrito/agregar', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${token}`
// //         },
// //         body: JSON.stringify({
// //           productoId: producto.id,
// //           cantidad
// //         })
// //       })
// //       const data = await res.json()
// //       if (res.ok) {
// //         toast.success('Agregado al carrito')
// //         await updateCartCount()
// //         setMostrarOpcionesJunteador(false)
// //         setMostrarOpcionesPegamento(false)
// //       } else {
// //         toast.error(data.error || 'Error al agregar')
// //       }
// //     } catch (error) {
// //       console.error(error)
// //       toast.error('Error de conexión')
// //     } finally {
// //       setAddingToCart(false)
// //     }
// //   }

// //   const handleWhatsApp = () => {
// //     const mensaje = encodeURIComponent(
// //       `Hola! Necesito ${cajasNecesarias} cajas de *${producto.nombre_completo || producto.nombre}* (ID: ${producto.id}).\n\n` +
// //       `Stock disponible: ${producto.stock} cajas\n` +
// //       `Área a cubrir: ${areaTotal?.toFixed(2)} m²\n\n` +
// //       `¿Pueden conseguir las cajas faltantes?`
// //     )
// //     const numeroWhatsApp = '5215512345678'
// //     window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank')
// //   }

// //   if (loading) {
// //     return (
// //       <div className='min-h-screen flex items-center justify-center bg-gray-50'>
// //         <div className='text-center'>
// //           <div className='w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
// //           <p className='text-gray-600 font-medium'>Cargando...</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   if (!producto) return null

// //   const imagenes = producto.imagen_url 
// //     ? (Array.isArray(producto.imagen_url) ? producto.imagen_url : producto.imagen_url.split(',').map(img => img.trim()).filter(Boolean))
// //     : ['/placeholder.jpg']

// //   const stockInsuficiente = cajasNecesarias && cajasNecesarias > producto.stock

// //   return (
// //     <div className='min-h-screen bg-gray-50 pb-20 md:pb-8' style={{ backgroundColor: '#f8fafc' }}>
// //       <Header />

// //       <main className='container mx-auto px-3 md:px-6 py-4 md:py-6'>
// //         {/* Breadcrumb */}
// //         <nav className='flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6'>
// //           <button onClick={() => router.push('/pisos')} className='hover:text-yellow-400 transition'>
// //             {esCeramico ? 'Pisos' : 'Productos'}
// //           </button>
// //           <span>/</span>
// //           <span className='font-semibold truncate' style={{ color: '#00162f' }}>
// //             {producto.nombre_completo || producto.nombre}
// //           </span>
// //         </nav>

// //         <div className='grid lg:grid-cols-[1fr_400px] gap-6 md:gap-8 lg:gap-6 mb-8'>
// //           {/* COLUMNA IZQUIERDA (Imágenes y especificaciones) */}
// //           <div className="space-y-3 lg:space-y-4">
// //             {/* Galería */}
// //             <div className='relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100'>
// //               <img
// //                 src={imagenes[currentImg]}
// //                 alt={producto.nombre_completo || producto.nombre}
// //                 className='w-full h-64 md:h-[500px] lg:h-[550px] object-cover cursor-zoom-in'
// //                 onClick={() => setShowImageModal(true)}
// //               />
              
// //               {imagenes.length > 1 && (
// //                 <>
// //                   <button
// //                     onClick={() => setCurrentImg((prev) => (prev - 1 + imagenes.length) % imagenes.length)}
// //                     className='absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition'
// //                   >
// //                     <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
// //                   </button>
// //                   <button
// //                     onClick={() => setCurrentImg((prev) => (prev + 1) % imagenes.length)}
// //                     className='absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition'
// //                   >
// //                     <ChevronRight className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
// //                   </button>
// //                 </>
// //               )}
// //             </div>

// //             {/* Miniaturas */}
// //             {imagenes.length > 1 && (
// //               <div className='flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide'>
// //                 {imagenes.map((img, idx) => (
// //                   <button
// //                     key={idx}
// //                     onClick={() => setCurrentImg(idx)}
// //                     className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-16 lg:h-16 rounded-lg overflow-hidden border-2 transition ${
// //                       idx === currentImg ? 'border-yellow-400' : 'border-transparent opacity-60 hover:opacity-100'
// //                     }`}
// //                   >
// //                     <img src={img} alt="" className='w-full h-full object-cover' />
// //                   </button>
// //                 ))}
// //               </div>
// //             )}

// //             {/* Especificaciones Técnicas (solo para cerámicos) */}
// //             {esCeramico && (
// //               <div className='bg-gray-200 rounded-2xl p-4 shadow-sm border border-gray-100 mx-auto'>
// //                 <h2 className='text-lg lg:text-xl font-black mb-2' style={{ color: '#00162f' }}>
// //                   Especificaciones Técnicas
// //                 </h2>
// //                 <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8'>
// //                   {[
// //                     { label: 'Cuerpo', value: producto.cuerpo },
// //                     { label: 'Absorción', value: producto.absorcion },
// //                     { label: 'Resistencia flexión', value: producto.resistencia_flexion },
// //                     { label: 'Rectificado', value: producto.rectificado ? 'Sí' : 'No' },
// //                     { label: 'Piezas x Caja', value: producto.piezas_por_caja },
// //                     { label: 'm² x Caja', value: producto.m2_por_caja },
// //                     { label: 'KG x Caja', value: producto.kg_por_caja ? `${producto.kg_por_caja} kg` : 'N/A' },
// //                     { label: 'Tecnología', value: producto.tecnologia || 'N/A' },
// //                   ].map((item, i) => (
// //                     <div key={i} className='flex justify-between items-center py-2 lg:py-2.5 border-b border-gray-50'>
// //                       <span className='text-xs text-gray-500 font-medium'>{item.label}</span>
// //                       <span className='text-xs font-bold' style={{ color: '#00162f' }}>
// //                         {item.value || 'N/A'}
// //                       </span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           {/* COLUMNA DERECHA */}
// //           <div className="lg:pr-2 space-y-3 lg:space-y-3">
// //             {producto.coleccion && (
// //               <span className='inline-block bg-yellow-400 text-[9px] lg:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full' style={{ color: '#00162f' }}>
// //                 {producto.coleccion}
// //               </span>
// //             )}

// //             <h1 className='text-xl md:text-3xl lg:text-2xl font-black leading-tight' style={{ color: '#00162f' }}>
// //               {producto.nombre_completo || producto.nombre}
// //             </h1>

// //             {producto.descripcion && (
// //               <p className='text-sm lg:text-base text-justify text-gray-600 leading-snug'>
// //                 {producto.descripcion}
// //               </p>
// //             )}

// //             {producto.uso && producto.uso.length > 0 && (
// //               <div className='block bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
// //                 <div className='flex items-center gap-3 p-2 border-b border-gray-100'>
// //                   <h2 className='text-lg font-black text-gray-500'>Áreas de Uso</h2>
// //                   {(() => {
// //                     const iconMap = {
// //                       'Interior': <Home className="w-5 h-5" />,
// //                       'Baño': <Bath className="w-5 h-5" />,
// //                       'Cocina': <UtensilsCrossed className="w-5 h-5" />,
// //                       'Recámara': <Bed className="w-5 h-5" />,
// //                       'Sala': <Sofa className="w-5 h-5" />,
// //                       'Exterior': <Trees className="w-5 h-5" />,
// //                       'Comercial': <Warehouse className="w-5 h-5" />
// //                     }
// //                     const usedAreas = producto.uso || []
// //                     const icons = usedAreas.map(area => iconMap[area]).filter(Boolean)
// //                     if (icons.length === 0) {
// //                       return [
// //                         <Bath key="bath" className="w-5 h-5" />,
// //                         <ShowerHead key="shower" className="w-5 h-5" />,
// //                         <Bed key="bed" className="w-5 h-5" />,
// //                         <Sofa key="sofa" className="w-5 h-5" />,
// //                         <UtensilsCrossed key="kitchen" className="w-5 h-5" />,
// //                         <Home key="home" className="w-5 h-5" />
// //                       ].map((icon, idx) => (
// //                         <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors'>
// //                           {icon}
// //                         </div>
// //                       ))
// //                     }
// //                     return icons.map((icon, idx) => (
// //                       <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors'>
// //                         {icon}
// //                       </div>
// //                     ))
// //                   })()}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Precio */}
// //             <div className='bg-white rounded-xl p-3 lg:p-4 border border-gray-100 shadow-sm'>
// //               <div className='flex items-baseline gap-2 mb-1'>
// //                 <span className='text-2xl lg:text-3xl font-black' style={{ color: '#00162f' }}>
// //                   ${Number(producto.precio).toFixed(2)}
// //                 </span>
// //                 {producto.precio_anterior && (
// //                   <span className='text-sm text-gray-400 line-through'>
// //                     ${Number(producto.precio_anterior).toFixed(2)}
// //                   </span>
// //                 )}
// //               </div>
// //               {esCeramico ? (
// //                 <p className='text-[10px] lg:text-xs text-gray-500'>
// //                   {producto.m2_por_caja} m²/caja • {producto.piezas_por_caja} pzs
// //                 </p>
// //               ) : (
// //                 <p className='text-[10px] lg:text-xs text-gray-500'>Precio por pieza</p>
// //               )}
// //             </div>

// //             {/* Atributos rápidos (solo para cerámicos) */}
// //             {esCeramico && (
// //               <div className='grid grid-cols-3 gap-2'>
// //                 {[
// //                   { label: 'Formato', value: producto.formato },
// //                   { label: 'Acabado', value: producto.acabado },
// //                   { label: 'PEI', value: producto.pei || 'N/A' }
// //                 ].map((attr, i) => (
// //                   <div key={i} className='bg-gray-50 rounded-lg p-2 border border-gray-100'>
// //                     <p className='text-[8px] lg:text-[9px] uppercase font-bold text-gray-400 mb-0.5'>
// //                       {attr.label}
// //                     </p>
// //                     <p className='text-[10px] lg:text-xs font-bold' style={{ color: '#00162f' }}>
// //                       {attr.value || 'N/A'}
// //                     </p>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             {/* Bloque de acción: Calculadora para cerámicos / Input simple para generales */}
// //             {esCeramico ? (
// //               /* Calculadora para cerámicos */
// //               <div className='rounded-xl p-3 lg:p-4 border-2' style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
// //                 <div className='flex items-center gap-2 mb-3'>
// //                   <div className='bg-yellow-400 p-1.5 rounded-lg'>
// //                     <Calculator className='w-4 h-4 lg:w-4 lg:h-4' style={{ color: '#00162f' }} />
// //                   </div>
// //                   <h3 className='text-sm lg:text-base font-black text-white'>
// //                     Calcula Cajas
// //                   </h3>
// //                 </div>

// //                 <div className='space-y-2.5'>
// //                   <div className='grid grid-cols-2 gap-2'>
// //                     <div>
// //                       <label className='block text-[9px] font-bold text-yellow-400 mb-1 uppercase'>
// //                         Ancho (m)
// //                       </label>
// //                       <input
// //                         type="number"
// //                         step="0.01"
// //                         min="0"
// //                         value={ancho}
// //                         onChange={(e) => setAncho(e.target.value)}
// //                         placeholder="10"
// //                         className='w-full px-2 py-1.5 border-2 border-gray-600 rounded-lg font-bold text-xs bg-gray-800 text-white focus:border-yellow-400 focus:outline-none transition-colors'
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className='block text-[9px] font-bold text-yellow-400 mb-1 uppercase'>
// //                         Largo (m)
// //                       </label>
// //                       <input
// //                         type="number"
// //                         step="0.01"
// //                         min="0"
// //                         value={largo}
// //                         onChange={(e) => setLargo(e.target.value)}
// //                         placeholder="10"
// //                         className='w-full px-2 py-1.5 border-2 border-gray-600 rounded-lg font-bold text-xs bg-gray-800 text-white focus:border-yellow-400 focus:outline-none transition-colors'
// //                       />
// //                     </div>
// //                   </div>

// //                   {ancho && largo && parseFloat(ancho) > 0 && parseFloat(largo) > 0 && (
// //                     <div className='bg-gray-800 rounded-lg p-2 border border-gray-700'>
// //                       <p className='text-[9px] text-gray-400 mb-0.5'>Área a cubrir</p>
// //                       <p className='text-base lg:text-lg font-black text-white'>
// //                         {(parseFloat(ancho) * parseFloat(largo)).toFixed(2)} m²
// //                         {incluirExtra && (
// //                           <span className='text-xs text-yellow-400 ml-1.5'>
// //                             +10%
// //                           </span>
// //                         )}
// //                       </p>
// //                     </div>
// //                   )}

// //                   <label className='flex items-start gap-2 cursor-pointer bg-gray-800 rounded-lg p-2 border border-gray-700 hover:border-yellow-400 transition-colors'>
// //                     <input
// //                       type="checkbox"
// //                       checked={incluirExtra}
// //                       onChange={(e) => setIncluirExtra(e.target.checked)}
// //                       className='w-3.5 h-3.5 accent-yellow-400 mt-0.5 flex-shrink-0'
// //                     />
// //                     <span className='text-[10px] lg:text-xs font-semibold text-white leading-tight'>
// //                       +10% extra para cortes
// //                     </span>
// //                   </label>

// //                   <button
// //                     onClick={calcularCajas}
// //                     disabled={!ancho || !largo}
// //                     className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2'
// //                     style={{ color: '#00162f' }}
// //                   >
// //                     <Calculator className="w-4 h-4" />
// //                     Calcular
// //                   </button>

// //                   {cajasNecesarias !== null && (
// //                     <div className='bg-white rounded-lg p-3 animate-in fade-in zoom-in duration-300'>
// //                       <div className='flex items-center justify-between mb-2.5'>
// //                         <div>
// //                           <p className='text-[9px] text-gray-500 mb-0.5'>Cajas necesarias</p>
// //                           <p className='text-2xl font-black flex items-center gap-1.5' style={{ color: '#00162f' }}>
// //                             <Package className="w-5 h-5" />
// //                             {cajasNecesarias}
// //                           </p>
// //                         </div>
// //                         <div className='text-right'>
// //                           <p className='text-[9px] text-gray-500 mb-0.5'>Stock</p>
// //                           <p className={`text-lg font-black ${
// //                             producto.stock >= cajasNecesarias ? 'text-green-600' : 'text-red-600'
// //                           }`}>
// //                             {producto.stock}
// //                           </p>
// //                         </div>
// //                       </div>

// //                       {stockInsuficiente ? (
// //                         <>
// //                           <button
// //                             onClick={handleWhatsApp}
// //                             className='w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95'
// //                           >
// //                             <MessageCircle className="w-4 h-4" />
// //                             WhatsApp
// //                           </button>
// //                           <div className='flex items-start gap-1.5 mt-2 bg-red-50 border border-red-200 rounded p-2'>
// //                             <AlertTriangle className='text-red-600 shrink-0 w-3.5 h-3.5 mt-0.5' />
// //                             <p className='text-xs text-red-700 font-medium leading-tight'>
// //                               Stock insuficiente. Contacta con nosotros para hacer el pedido completo.
// //                             </p>
// //                           </div>
// //                         </>
// //                       ) : (
// //                         <button
// //                           onClick={handleAddToCart}
// //                           disabled={addingToCart}
// //                           className='w-full bg-yellow-400 hover:bg-yellow-500 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-gray-400'
// //                           style={{ color: '#00162f' }}
// //                         >
// //                           <ShoppingCart className="w-4 h-4" />
// //                           {addingToCart ? 'Agregando...' : `Agregar ${cajasNecesarias}`}
// //                         </button>
// //                       )}
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* ========== SUGERENCIAS DE COMPRA COMPLEMENTARIA ========== */}
// //                 {areaTotal && (
// //                   <div className='mt-6 space-y-6'>
// //                     {/* ---------- JUNTEADOR ---------- */}
// //                     {productosJunteador.length > 0 && (
// //                       <div className='bg-white rounded-xl p-4 border border-gray-200 shadow-sm'>
// //                         <h4 className='text-sm font-bold text-gray-800 mb-2'>Complementa con Junteador</h4>
// //                         <p className='text-xs text-gray-600 mb-3'>
// //                           Recomendado: <span className='font-bold text-blue-900'>{cantidadJunteador}</span> unidad{cantidadJunteador !== 1 ? 'es' : ''} (1 por cada 10 m²)
// //                         </p>

// //                         {/* Carrusel de productos Junteador */}
// //                         <div className='relative mb-3'>
// //                           <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x'>
// //                             {productosJunteador.map((prod) => (
// //                               <div
// //                                 key={prod.id}
// //                                 className='flex-shrink-0 w-24 snap-start cursor-pointer group'
// //                                 onClick={() => router.push(`/pisos/${prod.id}`)}
// //                               >
// //                                 <div className='w-10 h-10 mx-auto mb-1 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-yellow-400 transition'>
// //                                   <img
// //                                     src={prod.imagen_url?.split(',')[0] || '/placeholder.jpg'}
// //                                     alt={prod.nombre}
// //                                     className='w-full h-full object-cover'
// //                                   />
// //                                 </div>
// //                                 <p className='text-[10px] font-bold text-gray-700 text-center line-clamp-2'>
// //                                   {prod.nombre}
// //                                 </p>
// //                               </div>
// //                             ))}
// //                           </div>
// //                         </div>

// //                         {!mostrarOpcionesJunteador ? (
// //                           <button
// //                             onClick={() => setMostrarOpcionesJunteador(true)}
// //                             className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-xs transition'
// //                           >
// //                             Elegir Junteador
// //                           </button>
// //                         ) : (
// //                           <div className='space-y-3 mt-3 border-t pt-3'>
// //                             {/* Selector de tipo (con arena / sin arena) basado en acabado */}
// //                             <select
// //                               className='w-full p-2 border rounded-lg text-sm'
// //                               value={junteadorSeleccionado?.id || ''}
// //                               onChange={(e) => {
// //                                 const prod = productosJunteador.find(p => p.id === e.target.value);
// //                                 setJunteadorSeleccionado(prod);
// //                               }}
// //                             >
// //                               <option value=''>Selecciona tipo</option>
// //                               {productosJunteador.map(p => (
// //                                 <option key={p.id} value={p.id}>
// //                                   {p.acabado} {p.formato ? `- ${p.formato}` : ''}
// //                                 </option>
// //                               ))}
// //                             </select>

// //                             {/* Selector de color (si hay más de un color en el campo formato) */}
// //                             {junteadorSeleccionado && junteadorSeleccionado.formato && (
// //                               <select
// //                                 className='w-full p-2 border rounded-lg text-sm'
// //                                 // Aquí puedes manejar el color seleccionado con un estado adicional
// //                               >
// //                                 <option value=''>Elige color</option>
// //                                 {junteadorSeleccionado.formato.split(',').map((color, idx) => (
// //                                   <option key={idx} value={color.trim()}>
// //                                     {color.trim()}
// //                                   </option>
// //                                 ))}
// //                               </select>
// //                             )}

// //                             <input
// //                               type='number'
// //                               min='1'
// //                               value={cantidadJunteador}
// //                               onChange={(e) => setCantidadJunteador(Math.max(1, parseInt(e.target.value) || 1))}
// //                               className='w-full p-2 border rounded-lg text-sm'
// //                             />

// //                             <button
// //                               onClick={() => handleAddComplemento(junteadorSeleccionado, cantidadJunteador)}
// //                               disabled={!junteadorSeleccionado || addingToCart}
// //                               className='w-full bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-500 disabled:bg-gray-300 transition'
// //                             >
// //                               Agregar al carrito
// //                             </button>
// //                           </div>
// //                         )}
// //                       </div>
// //                     )}

// //                     {/* ---------- PEGAMENTO ---------- */}
// //                     {productosPegamento.length > 0 && (
// //                       <div className='bg-white rounded-xl p-4 border border-gray-200 shadow-sm'>
// //                         <h4 className='text-sm font-bold text-gray-800 mb-2'>Complementa con Pegamento</h4>
// //                         <p className='text-xs text-gray-600 mb-3'>
// //                           Recomendado: <span className='font-bold text-blue-900'>{cantidadPegamento}</span> unidad{cantidadPegamento !== 1 ? 'es' : ''} (1 por cada 4 m²)
// //                         </p>

// //                         {/* Carrusel de productos Pegamento */}
// //                         <div className='relative mb-3'>
// //                           <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x'>
// //                             {productosPegamento.map((prod) => (
// //                               <div
// //                                 key={prod.id}
// //                                 className='flex-shrink-0 w-24 snap-start cursor-pointer group'
// //                                 onClick={() => router.push(`/pisos/${prod.id}`)}
// //                               >
// //                                 <div className='w-10 h-10 mx-auto mb-1 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-yellow-400 transition'>
// //                                   <img
// //                                     src={prod.imagen_url?.split(',')[0] || '/placeholder.jpg'}
// //                                     alt={prod.nombre}
// //                                     className='w-full h-full object-cover'
// //                                   />
// //                                 </div>
// //                                 <p className='text-[10px] font-bold text-gray-700 text-center line-clamp-2'>
// //                                   {prod.nombre}
// //                                 </p>
// //                               </div>
// //                             ))}
// //                           </div>
// //                         </div>

// //                         {!mostrarOpcionesPegamento ? (
// //                           <button
// //                             onClick={() => setMostrarOpcionesPegamento(true)}
// //                             className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-xs transition'
// //                           >
// //                             Elegir Pegamento
// //                           </button>
// //                         ) : (
// //                           <div className='space-y-3 mt-3 border-t pt-3'>
// //                             {/* Selector de tipo (Adecon / Pegapiso) basado en acabado */}
// //                             <select
// //                               className='w-full p-2 border rounded-lg text-sm'
// //                               value={pegamentoSeleccionado?.id || ''}
// //                               onChange={(e) => {
// //                                 const prod = productosPegamento.find(p => p.id === e.target.value);
// //                                 setPegamentoSeleccionado(prod);
// //                               }}
// //                             >
// //                               <option value=''>Selecciona tipo</option>
// //                               {productosPegamento.map(p => (
// //                                 <option key={p.id} value={p.id}>
// //                                   {p.acabado} {p.nombre}
// //                                 </option>
// //                               ))}
// //                             </select>

// //                             <input
// //                               type='number'
// //                               min='1'
// //                               value={cantidadPegamento}
// //                               onChange={(e) => setCantidadPegamento(Math.max(1, parseInt(e.target.value) || 1))}
// //                               className='w-full p-2 border rounded-lg text-sm'
// //                             />

// //                             <button
// //                               onClick={() => handleAddComplemento(pegamentoSeleccionado, cantidadPegamento)}
// //                               disabled={!pegamentoSeleccionado || addingToCart}
// //                               className='w-full bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-500 disabled:bg-gray-300 transition'
// //                             >
// //                               Agregar al carrito
// //                             </button>
// //                           </div>
// //                         )}
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //             ) : (
// //               /* Bloque simple para productos generales */
// //               <div className='rounded-xl p-3 lg:p-4 border-2' style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
// //                 <div className='flex items-center gap-2 mb-3'>
// //                   <div className='bg-yellow-400 p-1.5 rounded-lg'>
// //                     <ShoppingCart className='w-4 h-4 lg:w-4 lg:h-4' style={{ color: '#00162f' }} />
// //                   </div>
// //                   <h3 className='text-sm lg:text-base font-black text-white'>
// //                     Cantidad
// //                   </h3>
// //                 </div>

// //                 <div className='space-y-2.5'>
// //                   <input
// //                     type="text"
// //                     inputMode="numeric"
// //                     pattern="[0-9]*"
// //                     value={cantidadSimple}
// //                     onChange={(e) => {
// //                       const val = e.target.value.replace(/[^0-9]/g, '')
// //                       setCantidadSimple(val)
// //                     }}
// //                     onBlur={() => {
// //                       let num = parseInt(cantidadSimple, 10)
// //                       if (isNaN(num) || num < 1) num = 1
// //                       if (num > producto.stock) num = producto.stock
// //                       setCantidadSimple(String(num))
// //                     }}
// //                     className='w-full px-3 py-2 border-2 border-gray-600 rounded-lg font-bold text-sm bg-gray-800 text-white focus:border-yellow-400 focus:outline-none'
// //                   />
// //                   <button
// //                     onClick={handleAddSimpleToCart}
// //                     disabled={addingToCart || (cantidadSimple !== '' && parseInt(cantidadSimple) > producto.stock)}
// //                     className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2'
// //                     style={{ color: '#00162f' }}
// //                   >
// //                     {addingToCart ? 'Agregando...' : 'Agregar al carrito'}
// //                   </button>
// //                   {cantidadSimple !== '' && parseInt(cantidadSimple) > producto.stock && (
// //                     <p className='text-xs text-red-400'>Stock insuficiente</p>
// //                   )}
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </main>

// //       {/* Modal de imagen */}
// //       {showImageModal && (
// //         <div 
// //           className='fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300'
// //           style={{ backgroundColor: 'rgba(0, 22, 47, 0.95)' }}
// //           onClick={() => setShowImageModal(false)}
// //         >
// //           <button
// //             onClick={() => setShowImageModal(false)}
// //             className='absolute top-4 md:top-8 right-4 md:right-8 text-white p-2 hover:bg-white/10 rounded-full transition'
// //           >
// //             <X className="w-8 h-8 md:w-10 md:h-10" />
// //           </button>
// //           <img
// //             src={imagenes[currentImg]}
// //             alt="Zoom"
// //             className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl'
// //             onClick={(e) => e.stopPropagation()}
// //           />
// //         </div>
// //       )}

// //       <BottomNav />
// //     </div>
// //   )
// // }



// 'use client'
// import { useState, useEffect, useRef } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import Header from '@/components/Header'
// import BottomNav from '@/components/BottomNav'
// import { 
//   ShoppingCart, X, ChevronLeft, ChevronRight,
//   Calculator, MessageCircle, Package, AlertTriangle, Home,
//   Bath, ShowerHead, Bed, Sofa, UtensilsCrossed, Warehouse, Trees
// } from 'lucide-react'
// import toast from 'react-hot-toast'
// import Cookies from 'js-cookie'
// import { useAuth } from '@/context/authContext'

// // Líneas consideradas como productos cerámicos (con calculadora)
// const LINEAS_CERAMICAS = ['Pisos', 'Azulejos', 'Decorados']

// export default function PisoDetailPage() {
//   const params = useParams()
//   const router = useRouter()
//   const { user, updateCartCount } = useAuth()
  
//   const [producto, setProducto] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [currentImg, setCurrentImg] = useState(0)
//   const [showImageModal, setShowImageModal] = useState(false)

//   // Estados calculadora (cerámicos)
//   const [ancho, setAncho] = useState('')
//   const [largo, setLargo] = useState('')
//   const [incluirExtra, setIncluirExtra] = useState(true)
//   const [cajasNecesarias, setCajasNecesarias] = useState(null)
//   const [areaTotal, setAreaTotal] = useState(null)

//   // Estados para productos generales
//   const [cantidadSimple, setCantidadSimple] = useState('1')

//   // Estados para productos complementarios
//   const [productosJunteador, setProductosJunteador] = useState([])
//   const [productosPegamento, setProductosPegamento] = useState([])
//   const [mostrarOpcionesJunteador, setMostrarOpcionesJunteador] = useState(false)
//   const [mostrarOpcionesPegamento, setMostrarOpcionesPegamento] = useState(false)
//   const [junteadorSeleccionado, setJunteadorSeleccionado] = useState(null)
//   const [pegamentoSeleccionado, setPegamentoSeleccionado] = useState(null)
//   const [cantidadJunteador, setCantidadJunteador] = useState('0')
//   const [cantidadPegamento, setCantidadPegamento] = useState('0')
//   const [colorSeleccionado, setColorSeleccionado] = useState('')

//   // Estado común para agregar al carrito
//   const [addingToCart, setAddingToCart] = useState(false)

//   // Refs para carruseles automáticos
//   const junteadorCarouselRef = useRef(null)
//   const pegamentoCarouselRef = useRef(null)

//   //*
//   const [productosDecorados, setProductosDecorados] = useState([]);
//   const decoradosCarouselRef = useRef(null);

//   useEffect(() => {
//     if (params.id) {
//       fetchProducto()
//     }
//   }, [params.id])

//   useEffect(() => {
//     if (producto) {
//       fetchProductosComplementarios()
//     }
//   }, [producto])

//   // Carrusel automático para junteador
//   useEffect(() => {
//     if (!junteadorCarouselRef.current || productosJunteador.length === 0) return
//     const interval = setInterval(() => {
//       if (junteadorCarouselRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = junteadorCarouselRef.current
//         const maxScroll = scrollWidth - clientWidth
//         if (scrollLeft >= maxScroll) {
//           junteadorCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
//         } else {
//           junteadorCarouselRef.current.scrollBy({ left: 100, behavior: 'smooth' })
//         }
//       }
//     }, 5000)
//     return () => clearInterval(interval)
//   }, [productosJunteador])

//   // Carrusel automático para pegamento
//   useEffect(() => {
//     if (!pegamentoCarouselRef.current || productosPegamento.length === 0) return
//     const interval = setInterval(() => {
//       if (pegamentoCarouselRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = pegamentoCarouselRef.current
//         const maxScroll = scrollWidth - clientWidth
//         if (scrollLeft >= maxScroll) {
//           pegamentoCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
//         } else {
//           pegamentoCarouselRef.current.scrollBy({ left: 100, behavior: 'smooth' })
//         }
//       }
//     }, 5000)
//     return () => clearInterval(interval)
//   }, [productosPegamento])

//   const fetchProducto = async () => {
//     try {
//       setLoading(true)
//       const res = await fetch(`/api/pisos/${params.id}`)
//       if (!res.ok) throw new Error('No encontrado')
//       const data = await res.json()
//       setProducto(data)
//     } catch (error) {
//       console.error(error)
//       toast.error('Producto no encontrado')
//       router.push('/pisos')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Carrusel automático para decorados
// useEffect(() => {
//   if (!decoradosCarouselRef.current || productosDecorados.length === 0) return;
//   const interval = setInterval(() => {
//     if (decoradosCarouselRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = decoradosCarouselRef.current;
//       const maxScroll = scrollWidth - clientWidth;
//       if (scrollLeft >= maxScroll) {
//         decoradosCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         decoradosCarouselRef.current.scrollBy({ left: 100, behavior: 'smooth' });
//       }
//     }
//   }, 5000);
//   return () => clearInterval(interval);
// }, [productosDecorados]);

//   const fetchProductosComplementarios = async () => {
//     try {
//       const [resJ, resP] = await Promise.all([
//         fetch('/api/productos?linea=Junteador'),
//         fetch('/api/productos?linea=Pegamentos'),
//         fetch('/api/productos?linea=Decorados')   // <-- nueva línea
//       ])
//       if (resJ.ok) {
//         const data = await resJ.json()
//         setProductosJunteador(data)
//       }
//       if (resP.ok) {
//         const data = await resP.json()
//         setProductosPegamento(data)
//       }
//     } catch (error) {
//       console.error('Error al cargar productos complementarios:', error)
//     }
//   }

//   // Determina si el producto es cerámico
//   const esCeramico = producto?.linea && LINEAS_CERAMICAS.includes(producto.linea)

//   // Cálculo de cajas para cerámicos
//   const calcularCajas = () => {
//     const anchoNum = parseFloat(ancho)
//     const largoNum = parseFloat(largo)

//     if (!anchoNum || !largoNum || anchoNum <= 0 || largoNum <= 0) {
//       toast.error('Ingresa medidas válidas mayores a 0')
//       return
//     }

//     if (!producto.m2_por_caja || producto.m2_por_caja <= 0) {
//       toast.error('Este producto no tiene información de m² por caja')
//       return
//     }

//     let area = anchoNum * largoNum
//     if (incluirExtra) area *= 1.1

//     setAreaTotal(area)
//     const cajas = Math.ceil(area / producto.m2_por_caja)
//     setCajasNecesarias(cajas)

//     // Calcular complementos
//     const cantJ = Math.ceil(area / 10)
//     const cantP = Math.ceil(area / 4)
//     setCantidadJunteador(String(cantJ))
//     setCantidadPegamento(String(cantP))

//     toast.success(`📦 Necesitas ${cajas} caja${cajas !== 1 ? 's' : ''}`)
//   }

//   // Agregar cerámico al carrito
//   const handleAddToCart = async () => {
//     if (!user) {
//       toast.error('Inicia sesión para comprar')
//       router.push('/login')
//       return
//     }

//     if (!cajasNecesarias || cajasNecesarias <= 0) {
//       toast.error('Primero calcula las cajas necesarias')
//       return
//     }

//     if (cajasNecesarias > producto.stock) {
//       toast.error('Stock insuficiente')
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
//           productoId: producto.id,
//           cantidad: cajasNecesarias
//         })
//       })

//       const data = await res.json()

//       if (res.ok) {
//         toast.success(`${cajasNecesarias} caja${cajasNecesarias !== 1 ? 's' : ''} agregada${cajasNecesarias !== 1 ? 's' : ''}`)
//         await updateCartCount()
//         // No reseteamos la calculadora ni los complementos
//       } else {
//         toast.error(data.error || 'Error al agregar')
//       }
//     } catch (error) {
//       console.error(error)
//       toast.error('Error de conexión')
//     } finally {
//       setAddingToCart(false)
//     }
//   }

//   // Agregar complemento al carrito
//   const handleAddComplemento = async (producto, cantidad, color = '') => {
//     if (!user) {
//       toast.error('Inicia sesión para comprar')
//       router.push('/login')
//       return
//     }

//     const cantNum = parseInt(cantidad, 10) || 1
//     if (cantNum > producto.stock) {
//       toast.error('Stock insuficiente')
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
//           productoId: producto.id,
//           cantidad: cantNum
//         })
//       })
//       const data = await res.json()
//       if (res.ok) {
//         toast.success('Agregado al carrito')
//         await updateCartCount()
//       } else {
//         toast.error(data.error || 'Error al agregar')
//       }
//     } catch (error) {
//       console.error(error)
//       toast.error('Error de conexión')
//     } finally {
//       setAddingToCart(false)
//     }
//   }

//   // Agregar producto general al carrito
//   const handleAddSimpleToCart = async () => {
//     if (!user) {
//       toast.error('Inicia sesión para comprar')
//       router.push('/login')
//       return
//     }

//     const cantidad = parseInt(cantidadSimple, 10) || 1
//     if (cantidad > producto.stock) {
//       toast.error('Stock insuficiente')
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
//           productoId: producto.id,
//           cantidad
//         })
//       })

//       const data = await res.json()

//       if (res.ok) {
//         toast.success(`${cantidad} producto${cantidad !== 1 ? 's' : ''} agregado${cantidad !== 1 ? 's' : ''}`)
//         await updateCartCount()
//         setCantidadSimple('1')
//       } else {
//         toast.error(data.error || 'Error al agregar')
//       }
//     } catch (error) {
//       console.error(error)
//       toast.error('Error de conexión')
//     } finally {
//       setAddingToCart(false)
//     }
//   }

//   const handleWhatsApp = () => {
//     const mensaje = encodeURIComponent(
//       `Hola! Necesito ${cajasNecesarias} cajas de *${producto.nombre_completo || producto.nombre}* (ID: ${producto.id}).\n\n` +
//       `Stock disponible: ${producto.stock} cajas\n` +
//       `Área a cubrir: ${areaTotal?.toFixed(2)} m²\n\n` +
//       `¿Pueden conseguir las cajas faltantes?`
//     )
//     const numeroWhatsApp = '5215512345678'
//     window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank')
//   }

//   if (loading) {
//     return (
//       <div className='min-h-screen flex items-center justify-center bg-gray-50'>
//         <div className='text-center'>
//           <div className='w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
//           <p className='text-gray-600 font-medium'>Cargando...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!producto) return null

//   const imagenes = producto.imagen_url 
//     ? (Array.isArray(producto.imagen_url) ? producto.imagen_url : producto.imagen_url.split(',').map(img => img.trim()).filter(Boolean))
//     : ['/placeholder.jpg']

//   const stockInsuficiente = cajasNecesarias && cajasNecesarias > producto.stock

//   return (
//     <div className='min-h-screen bg-gray-50 pb-20 md:pb-8' style={{ backgroundColor: '#f8fafc' }}>
//       <Header />

//       <main className='container mx-auto px-3 md:px-6 py-4 md:py-6'>
//         {/* Breadcrumb */}
//         <nav className='flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6'>
//           <button onClick={() => router.push('/pisos')} className='hover:text-yellow-400 transition'>
//             {esCeramico ? 'Pisos' : 'Productos'}
//           </button>
//           <span>/</span>
//           <span className='font-semibold truncate' style={{ color: '#00162f' }}>
//             {producto.nombre_completo || producto.nombre}
//           </span>
//         </nav>

//         {/* Grid con ancho dinámico según cálculo */}
//         <div className={`grid lg:grid-cols-[1fr_minmax(400px,550px)] gap-6 md:gap-8 lg:gap-6 mb-8 ${
//           cajasNecesarias ? 'lg:grid-cols-[1fr_minmax(450px,600px)]' : ''
//         }`}>
          
//           {/* COLUMNA IZQUIERDA */}
//           <div className="space-y-3 lg:space-y-4">
//             {/* Galería */}
//             <div className='relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100'>
//               <img
//                 src={imagenes[currentImg]}
//                 alt={producto.nombre_completo || producto.nombre}
//                 className='w-full h-64 md:h-[500px] lg:h-[550px] object-cover cursor-zoom-in'
//                 onClick={() => setShowImageModal(true)}
//               />
              
//               {imagenes.length > 1 && (
//                 <>
//                   <button
//                     onClick={() => setCurrentImg((prev) => (prev - 1 + imagenes.length) % imagenes.length)}
//                     className='absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition'
//                   >
//                     <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
//                   </button>
//                   <button
//                     onClick={() => setCurrentImg((prev) => (prev + 1) % imagenes.length)}
//                     className='absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition'
//                   >
//                     <ChevronRight className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Miniaturas */}
//             {imagenes.length > 1 && (
//               <div className='flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide'>
//                 {imagenes.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setCurrentImg(idx)}
//                     className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-16 lg:h-16 rounded-lg overflow-hidden border-2 transition ${
//                       idx === currentImg ? 'border-yellow-400' : 'border-transparent opacity-60 hover:opacity-100'
//                     }`}
//                   >
//                     <img src={img} alt="" className='w-full h-full object-cover' />
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* Especificaciones Técnicas (solo para cerámicos) */}
//             {esCeramico && (
//               <div className='bg-gray-200 rounded-2xl p-4 shadow-sm border border-gray-100 mx-auto'>
//                 <h2 className='text-lg lg:text-xl font-black mb-2' style={{ color: '#00162f' }}>
//                   Especificaciones Técnicas
//                 </h2>
//                 <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8'>
//                   {[
//                     { label: 'Cuerpo', value: producto.cuerpo },
//                     { label: 'Absorción', value: producto.absorcion },
//                     { label: 'Resistencia flexión', value: producto.resistencia_flexion },
//                     { label: 'Rectificado', value: producto.rectificado ? 'Sí' : 'No' },
//                     { label: 'Piezas x Caja', value: producto.piezas_por_caja },
//                     { label: 'm² x Caja', value: producto.m2_por_caja },
//                     { label: 'KG x Caja', value: producto.kg_por_caja ? `${producto.kg_por_caja} kg` : 'N/A' },
//                     { label: 'Tecnología', value: producto.tecnologia || 'N/A' },
//                   ].map((item, i) => (
//                     <div key={i} className='flex justify-between items-center py-2 lg:py-2.5 border-b border-gray-50'>
//                       <span className='text-xs text-gray-500 font-medium'>{item.label}</span>
//                       <span className='text-xs font-bold' style={{ color: '#00162f' }}>
//                         {item.value || 'N/A'}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}


//             {/* Carrusel de productos Decorados */}
// {productosDecorados.length > 0 && (
//   <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
//     <h2 className='text-lg lg:text-xl font-black mb-4' style={{ color: '#00162f' }}>
//       También te puede interesar
//     </h2>
//     <div ref={decoradosCarouselRef} className='relative overflow-x-auto scrollbar-hide snap-x'>
//       <div className='flex gap-4'>
//         {productosDecorados.map((prod) => (
//           <div
//             key={prod.id}
//             className='flex-shrink-0 w-24 snap-start cursor-pointer group'
//             onClick={() => router.push(`/pisos/${prod.id}`)}
//           >
//             <div className='w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-yellow-400 transition'>
//               <img
//                 src={prod.imagen_url?.split(',')[0] || '/placeholder.jpg'}
//                 alt={prod.nombre}
//                 className='w-full h-full object-cover'
//               />
//             </div>
//             <p className='text-xs font-bold text-gray-700 text-center line-clamp-2'>
//               {prod.nombre}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// )}
//           </div>

//           {/* COLUMNA DERECHA */}
//           <div className="lg:pr-2 space-y-3 lg:space-y-3">
//             {producto.coleccion && (
//               <span className='inline-block bg-yellow-400 text-[9px] lg:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full' style={{ color: '#00162f' }}>
//                 {producto.coleccion}
//               </span>
//             )}

//             <h1 className='text-xl md:text-3xl lg:text-2xl font-black leading-tight' style={{ color: '#00162f' }}>
//               {producto.nombre_completo || producto.nombre}
//             </h1>

//             {producto.descripcion && (
//               <p className='text-sm lg:text-base text-justify text-gray-600 leading-snug'>
//                 {producto.descripcion}
//               </p>
//             )}

//             {/* Áreas de uso */}
//             {producto.uso && producto.uso.length > 0 && (
//               <div className='block bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
//                 <div className='flex items-center gap-3 p-2 border-b border-gray-100'>
//                   <h2 className='text-lg font-black text-gray-500'>Áreas de Uso</h2>
//                   {(() => {
//                     const iconMap = {
//                       'Interior': <Home className="w-5 h-5" />,
//                       'Baño': <Bath className="w-5 h-5" />,
//                       'Cocina': <UtensilsCrossed className="w-5 h-5" />,
//                       'Recámara': <Bed className="w-5 h-5" />,
//                       'Sala': <Sofa className="w-5 h-5" />,
//                       'Exterior': <Trees className="w-5 h-5" />,
//                       'Comercial': <Warehouse className="w-5 h-5" />
//                     }
//                     const usedAreas = producto.uso || []
//                     const icons = usedAreas.map(area => iconMap[area]).filter(Boolean)
//                     if (icons.length === 0) {
//                       return [
//                         <Bath key="bath" className="w-5 h-5" />,
//                         <ShowerHead key="shower" className="w-5 h-5" />,
//                         <Bed key="bed" className="w-5 h-5" />,
//                         <Sofa key="sofa" className="w-5 h-5" />,
//                         <UtensilsCrossed key="kitchen" className="w-5 h-5" />,
//                         <Home key="home" className="w-5 h-5" />
//                       ].map((icon, idx) => (
//                         <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors'>
//                           {icon}
//                         </div>
//                       ))
//                     }
//                     return icons.map((icon, idx) => (
//                       <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors'>
//                         {icon}
//                       </div>
//                     ))
//                   })()}
//                 </div>
//               </div>
//             )}

//             {/* Precio */}
//             <div className='bg-white rounded-xl p-3 lg:p-4 border border-gray-100 shadow-sm'>
//               <div className='flex items-baseline gap-2 mb-1'>
//                 <span className='text-2xl lg:text-3xl font-black' style={{ color: '#00162f' }}>
//                   ${Number(producto.precio).toFixed(2)}
//                 </span>
//                 {producto.precio_anterior && (
//                   <span className='text-sm text-gray-400 line-through'>
//                     ${Number(producto.precio_anterior).toFixed(2)}
//                   </span>
//                 )}
//               </div>
//               {esCeramico ? (
//                 <p className='text-[10px] lg:text-xs text-gray-500'>
//                   {producto.m2_por_caja} m²/caja • {producto.piezas_por_caja} pzs
//                 </p>
//               ) : (
//                 <p className='text-[10px] lg:text-xs text-gray-500'>Precio por pieza</p>
//               )}
//             </div>

//             {/* Atributos rápidos (solo para cerámicos) */}
//             {esCeramico && (
//               <div className='grid grid-cols-3 gap-2'>
//                 {[
//                   { label: 'Formato', value: producto.formato },
//                   { label: 'Acabado', value: producto.acabado },
//                   { label: 'PEI', value: producto.pei || 'N/A' }
//                 ].map((attr, i) => (
//                   <div key={i} className='bg-gray-50 rounded-lg p-2 border border-gray-100'>
//                     <p className='text-[8px] lg:text-[9px] uppercase font-bold text-gray-400 mb-0.5'>
//                       {attr.label}
//                     </p>
//                     <p className='text-[10px] lg:text-xs font-bold' style={{ color: '#00162f' }}>
//                       {attr.value || 'N/A'}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* BLOQUE DE ACCIÓN: Calculadora para cerámicos / Input simple para generales */}
//             {esCeramico ? (
//               /* Calculadora para cerámicos */
//               <div className='rounded-xl p-3 lg:p-4 border-2' style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
//                 <div className='flex items-center gap-2 mb-3'>
//                   <div className='bg-yellow-400 p-1.5 rounded-lg'>
//                     <Calculator className='w-4 h-4 lg:w-4 lg:h-4' style={{ color: '#00162f' }} />
//                   </div>
//                   <h3 className='text-sm lg:text-base font-black text-white'>
//                     Calcula Cajas
//                   </h3>
//                 </div>

//                 <div className='space-y-2.5'>
//                   <div className='grid grid-cols-2 gap-2'>
//                     <div>
//                       <label className='block text-[9px] font-bold text-yellow-400 mb-1 uppercase'>
//                         Ancho (m)
//                       </label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         value={ancho}
//                         onChange={(e) => setAncho(e.target.value)}
//                         placeholder="10"
//                         className='w-full px-2 py-1.5 border-2 border-gray-600 rounded-lg font-bold text-xs bg-gray-800 text-white focus:border-yellow-400 focus:outline-none transition-colors'
//                       />
//                     </div>
//                     <div>
//                       <label className='block text-[9px] font-bold text-yellow-400 mb-1 uppercase'>
//                         Largo (m)
//                       </label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         value={largo}
//                         onChange={(e) => setLargo(e.target.value)}
//                         placeholder="10"
//                         className='w-full px-2 py-1.5 border-2 border-gray-600 rounded-lg font-bold text-xs bg-gray-800 text-white focus:border-yellow-400 focus:outline-none transition-colors'
//                       />
//                     </div>
//                   </div>

//                   {ancho && largo && parseFloat(ancho) > 0 && parseFloat(largo) > 0 && (
//                     <div className='bg-gray-800 rounded-lg p-2 border border-gray-700'>
//                       <p className='text-[9px] text-gray-400 mb-0.5'>Área a cubrir</p>
//                       <p className='text-base lg:text-lg font-black text-white'>
//                         {(parseFloat(ancho) * parseFloat(largo)).toFixed(2)} m²
//                         {incluirExtra && (
//                           <span className='text-xs text-yellow-400 ml-1.5'>
//                             +10%
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                   )}

//                   <label className='flex items-start gap-2 cursor-pointer bg-gray-800 rounded-lg p-2 border border-gray-700 hover:border-yellow-400 transition-colors'>
//                     <input
//                       type="checkbox"
//                       checked={incluirExtra}
//                       onChange={(e) => setIncluirExtra(e.target.checked)}
//                       className='w-3.5 h-3.5 accent-yellow-400 mt-0.5 flex-shrink-0'
//                     />
//                     <span className='text-[10px] lg:text-xs font-semibold text-white leading-tight'>
//                       +10% extra para cortes
//                     </span>
//                   </label>

//                   <button
//                     onClick={calcularCajas}
//                     disabled={!ancho || !largo}
//                     className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2'
//                     style={{ color: '#00162f' }}
//                   >
//                     <Calculator className="w-4 h-4" />
//                     Calcular
//                   </button>

//                   {cajasNecesarias !== null && (
//                     <div className='bg-white rounded-lg p-3 animate-in fade-in zoom-in duration-300'>
//                       <div className='flex items-center justify-between mb-2.5'>
//                         <div>
//                           <p className='text-[9px] text-gray-500 mb-0.5'>Cajas necesarias</p>
//                           <p className='text-2xl font-black flex items-center gap-1.5' style={{ color: '#00162f' }}>
//                             <Package className="w-5 h-5" />
//                             {cajasNecesarias}
//                           </p>
//                         </div>
//                         <div className='text-right'>
//                           <p className='text-[9px] text-gray-500 mb-0.5'>Stock</p>
//                           <p className={`text-lg font-black ${
//                             producto.stock >= cajasNecesarias ? 'text-green-600' : 'text-red-600'
//                           }`}>
//                             {producto.stock}
//                           </p>
//                         </div>
//                       </div>

//                       {stockInsuficiente ? (
//                         <>
//                           <button
//                             onClick={handleWhatsApp}
//                             className='w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95'
//                           >
//                             <MessageCircle className="w-4 h-4" />
//                             WhatsApp
//                           </button>
//                           <div className='flex items-start gap-1.5 mt-2 bg-red-50 border border-red-200 rounded p-2'>
//                             <AlertTriangle className='text-red-600 shrink-0 w-3.5 h-3.5 mt-0.5' />
//                             <p className='text-xs text-red-700 font-medium leading-tight'>
//                               Stock insuficiente. Contacta con nosotros para hacer el pedido completo.
//                             </p>
//                           </div>
//                         </>
//                       ) : (
//                         <button
//                           onClick={handleAddToCart}
//                           disabled={addingToCart}
//                           className='w-full bg-yellow-400 hover:bg-yellow-500 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-gray-400'
//                           style={{ color: '#00162f' }}
//                         >
//                           <ShoppingCart className="w-4 h-4" />
//                           {addingToCart ? 'Agregando...' : `Agregar ${cajasNecesarias}`}
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* SUGERENCIAS DE COMPRA COMPLEMENTARIA */}
//                 {areaTotal && (
//                   <div className='mt-6 space-y-6'>
//                     {/* ---------- JUNTEADOR ---------- */}
//                     {productosJunteador.length > 0 && (
//                       <div className='bg-white rounded-xl p-4 border border-gray-200 shadow-sm'>
//                         <h4 className='text-sm font-bold text-gray-800 mb-2'>Complementa con Junteador</h4>
//                         <p className='text-xs text-gray-600 mb-3'>
//                           Recomendado: <span className='font-bold text-blue-900'>{cantidadJunteador}</span> unidad{cantidadJunteador !== '1' ? 'es' : ''} (1 por cada 10 m²)
//                         </p>

//                         {/* Carrusel de productos Junteador */}
//                         <div ref={junteadorCarouselRef} className='relative mb-3 overflow-x-auto scrollbar-hide snap-x'>
//                           <div className='flex gap-2'>
//                             {productosJunteador.map((prod) => (
//                               <div
//                                 key={prod.id}
//                                 className='flex-shrink-0 w-24 snap-start cursor-pointer group'
//                                 onClick={() => router.push(`/pisos/${prod.id}`)}
//                               >
//                                 <div className='w-10 h-10 mx-auto mb-1 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-yellow-400 transition'>
//                                   <img
//                                     src={prod.imagen_url?.split(',')[0] || '/placeholder.jpg'}
//                                     alt={prod.nombre}
//                                     className='w-full h-full object-cover'
//                                   />
//                                 </div>
//                                 <p className='text-[10px] font-bold text-gray-700 text-center line-clamp-2'>
//                                   {prod.nombre}
//                                 </p>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {!mostrarOpcionesJunteador ? (
//                           <button
//                             onClick={() => setMostrarOpcionesJunteador(true)}
//                             className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-xs transition'
//                           >
//                             Elegir Junteador
//                           </button>
//                         ) : (
//                           <div className='space-y-3 mt-3 border-t pt-3'>
//                             {/* Selector de tipo (con arena / sin arena) basado en acabado */}
//                           {/* Selector de tipo (con arena / sin arena) basado en acabado */}
// <select
//   className='w-full p-2 border rounded-lg text-sm'
//   value={junteadorSeleccionado?.id || ''}
//   onChange={(e) => {
//     const prod = productosJunteador.find(p => p.id === e.target.value);
//     setJunteadorSeleccionado(prod);
//     setColorSeleccionado(''); // reset color al cambiar producto
//   }}
// >
//   <option value=''>Selecciona tipo</option>
//   {productosJunteador.map(p => (
//     <option key={p.id} value={p.id}>
//       {p.acabado} {p.formato ? `- ${p.formato}` : ''}
//     </option>
//   ))}
// </select>

// {/* Selector de color (si el producto seleccionado tiene formato con colores) */}
// {junteadorSeleccionado && junteadorSeleccionado.formato && (
//   <select
//     className='w-full p-2 border rounded-lg text-sm'
//     value={colorSeleccionado}
//     onChange={(e) => setColorSeleccionado(e.target.value)}
//   >
//     <option value=''>Elige color</option>
//     {junteadorSeleccionado.formato.split(',').map((color, idx) => (
//       <option key={idx} value={color.trim()}>
//         {color.trim()}
//       </option>
//     ))}
//   </select>
// )}

// {/* Input de cantidad como texto para poder borrar */}
// <input
//   type='text'
//   inputMode='numeric'
//   pattern='[0-9]*'
//   value={cantidadJunteador}
//   onChange={(e) => {
//     const val = e.target.value.replace(/[^0-9]/g, '');
//     setCantidadJunteador(val);
//   }}
//   onBlur={() => {
//     let num = parseInt(cantidadJunteador, 10);
//     if (isNaN(num) || num < 1) num = 1;
//     setCantidadJunteador(String(num));
//   }}
//   className='w-full p-2 border rounded-lg text-sm'
// />

// <button
//   onClick={() => handleAddComplemento(junteadorSeleccionado, cantidadJunteador, colorSeleccionado)}
//   disabled={!junteadorSeleccionado || 
//     (junteadorSeleccionado.formato && !colorSeleccionado) || 
//     addingToCart}
//   className='w-full bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-500 disabled:bg-gray-300 transition'
// >
//   Agregar al carrito
// </button>

                           
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* ---------- PEGAMENTO ---------- */}
//                     {productosPegamento.length > 0 && (
//                       <div className='bg-white rounded-xl p-4 border border-gray-200 shadow-sm'>
//                         <h4 className='text-sm font-bold text-gray-800 mb-2'>Complementa con Pegamento</h4>
//                         <p className='text-xs text-gray-600 mb-3'>
//                           Recomendado: <span className='font-bold text-blue-900'>{cantidadPegamento}</span> unidad{cantidadPegamento !== '1' ? 'es' : ''} (1 por cada 4 m²)
//                         </p>

//                         {/* Carrusel de productos Pegamento */}
//                         <div ref={pegamentoCarouselRef} className='relative mb-3 overflow-x-auto scrollbar-hide snap-x'>
//                           <div className='flex gap-2'>
//                             {productosPegamento.map((prod) => (
//                               <div
//                                 key={prod.id}
//                                 className='flex-shrink-0 w-24 snap-start cursor-pointer group'
//                                 onClick={() => router.push(`/pisos/${prod.id}`)}
//                               >
//                                 <div className='w-10 h-10 mx-auto mb-1 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-yellow-400 transition'>
//                                   <img
//                                     src={prod.imagen_url?.split(',')[0] || '/placeholder.jpg'}
//                                     alt={prod.nombre}
//                                     className='w-full h-full object-cover'
//                                   />
//                                 </div>
//                                 <p className='text-[10px] font-bold text-gray-700 text-center line-clamp-2'>
//                                   {prod.nombre}
//                                 </p>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {!mostrarOpcionesPegamento ? (
//                           <button
//                             onClick={() => setMostrarOpcionesPegamento(true)}
//                             className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-xs transition'
//                           >
//                             Elegir Pegamento
//                           </button>
//                         ) : (
//                           <div className='space-y-3 mt-3 border-t pt-3'>
//                             {/* Selector de tipo (Adecon / Pegapiso) basado en acabado */}
//                             <select
//                               className='w-full p-2 border rounded-lg text-sm'
//                               value={pegamentoSeleccionado?.id || ''}
//                               onChange={(e) => {
//                                 const prod = productosPegamento.find(p => p.id === e.target.value);
//                                 setPegamentoSeleccionado(prod);
//                               }}
//                             >
//                               <option value=''>Selecciona tipo</option>
//                               {productosPegamento.map(p => (
//                                 <option key={p.id} value={p.id}>
//                                   {p.acabado} {p.nombre}
//                                 </option>
//                               ))}
//                             </select>

//                             {/* Input de cantidad como texto */}
//                             <input
//                               type='text'
//                               inputMode='numeric'
//                               pattern='[0-9]*'
//                               value={cantidadPegamento}
//                               onChange={(e) => {
//                                 const val = e.target.value.replace(/[^0-9]/g, '');
//                                 setCantidadPegamento(val);
//                               }}
//                               onBlur={() => {
//                                 let num = parseInt(cantidadPegamento, 10);
//                                 if (isNaN(num) || num < 1) num = 1;
//                                 setCantidadPegamento(String(num));
//                               }}
//                               className='w-full p-2 border rounded-lg text-sm'
//                             />

//                             <button
//                               onClick={() => handleAddComplemento(pegamentoSeleccionado, cantidadPegamento)}
//                               disabled={!pegamentoSeleccionado || addingToCart}
//                               className='w-full bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-500 disabled:bg-gray-300 transition'
//                             >
//                               Agregar al carrito
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               /* Bloque simple para productos generales */
//               <div className='rounded-xl p-3 lg:p-4 border-2' style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
//                 <div className='flex items-center gap-2 mb-3'>
//                   <div className='bg-yellow-400 p-1.5 rounded-lg'>
//                     <ShoppingCart className='w-4 h-4 lg:w-4 lg:h-4' style={{ color: '#00162f' }} />
//                   </div>
//                   <h3 className='text-sm lg:text-base font-black text-white'>
//                     Cantidad
//                   </h3>
//                 </div>

//                 <div className='space-y-2.5'>
//                   <input
//                     type='text'
//                     inputMode='numeric'
//                     pattern='[0-9]*'
//                     value={cantidadSimple}
//                     onChange={(e) => {
//                       const val = e.target.value.replace(/[^0-9]/g, '');
//                       setCantidadSimple(val);
//                     }}
//                     onBlur={() => {
//                       let num = parseInt(cantidadSimple, 10);
//                       if (isNaN(num) || num < 1) num = 1;
//                       if (num > producto.stock) num = producto.stock;
//                       setCantidadSimple(String(num));
//                     }}
//                     className='w-full px-3 py-2 border-2 border-gray-600 rounded-lg font-bold text-sm bg-gray-800 text-white focus:border-yellow-400 focus:outline-none'
//                   />
//                   <button
//                     onClick={handleAddSimpleToCart}
//                     disabled={addingToCart || (cantidadSimple !== '' && parseInt(cantidadSimple) > producto.stock)}
//                     className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2'
//                     style={{ color: '#00162f' }}
//                   >
//                     {addingToCart ? 'Agregando...' : 'Agregar al carrito'}
//                   </button>
//                   {cantidadSimple !== '' && parseInt(cantidadSimple) > producto.stock && (
//                     <p className='text-xs text-red-400'>Stock insuficiente</p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Modal de imagen */}
//       {showImageModal && (
//         <div 
//           className='fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300'
//           style={{ backgroundColor: 'rgba(0, 22, 47, 0.95)' }}
//           onClick={() => setShowImageModal(false)}
//         >
//           <button
//             onClick={() => setShowImageModal(false)}
//             className='absolute top-4 md:top-8 right-4 md:right-8 text-white p-2 hover:bg-white/10 rounded-full transition'
//           >
//             <X className="w-8 h-8 md:w-10 md:h-10" />
//           </button>
//           <img
//             src={imagenes[currentImg]}
//             alt="Zoom"
//             className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl'
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//       )}

//       <BottomNav />
//     </div>
//   )
// }


'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { 
  ShoppingCart, X, ChevronLeft, ChevronRight,
  Calculator, MessageCircle, Package, AlertTriangle, Home,
  Bath, ShowerHead, Bed, Sofa, UtensilsCrossed, Warehouse, Trees
} from 'lucide-react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { useAuth } from '@/context/authContext'

// Líneas consideradas como productos cerámicos (con calculadora)
const LINEAS_CERAMICAS = ['Pisos', 'Azulejos', 'Decorados']

export default function PisoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, updateCartCount } = useAuth()
  
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImg, setCurrentImg] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)

  // Estados calculadora (cerámicos)
  const [ancho, setAncho] = useState('')
  const [largo, setLargo] = useState('')
  const [incluirExtra, setIncluirExtra] = useState(true)
  const [cajasNecesarias, setCajasNecesarias] = useState(null)
  const [areaTotal, setAreaTotal] = useState(null)

  // Estados para productos generales
  const [cantidadSimple, setCantidadSimple] = useState('1')

  // Estados para productos complementarios
  const [productosJunteador, setProductosJunteador] = useState([])
  const [productosPegamento, setProductosPegamento] = useState([])
  const [productosDecorados, setProductosDecorados] = useState([])
  const [mostrarOpcionesJunteador, setMostrarOpcionesJunteador] = useState(false)
  const [mostrarOpcionesPegamento, setMostrarOpcionesPegamento] = useState(false)
  const [junteadorSeleccionado, setJunteadorSeleccionado] = useState(null)
  const [pegamentoSeleccionado, setPegamentoSeleccionado] = useState(null)
  const [cantidadJunteador, setCantidadJunteador] = useState('0')
  const [cantidadPegamento, setCantidadPegamento] = useState('0')
  const [colorSeleccionado, setColorSeleccionado] = useState('')

  // Estado común para agregar al carrito
  const [addingToCart, setAddingToCart] = useState(false)

  // Refs para carruseles automáticos
  const junteadorCarouselRef = useRef(null)
  const pegamentoCarouselRef = useRef(null)
  const decoradosCarouselRef = useRef(null)

  useEffect(() => {
  if (!decoradosCarouselRef.current || productosDecorados.length === 0) return;
  const interval = setInterval(() => {
    if (decoradosCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = decoradosCarouselRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (scrollLeft >= maxScroll) {
        decoradosCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        decoradosCarouselRef.current.scrollBy({ left: 100, behavior: 'smooth' });
      }
    }
  }, 5000);
  return () => clearInterval(interval);
}, [productosDecorados]);

  useEffect(() => {
    if (params.id) {
      fetchProducto()
    }
  }, [params.id])

  useEffect(() => {
    if (producto) {
      fetchProductosComplementarios()
    }
  }, [producto])

  // Carrusel automático para junteador
  useEffect(() => {
    if (!junteadorCarouselRef.current || productosJunteador.length === 0) return
    const interval = setInterval(() => {
      if (junteadorCarouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = junteadorCarouselRef.current
        const maxScroll = scrollWidth - clientWidth
        if (scrollLeft >= maxScroll) {
          junteadorCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          junteadorCarouselRef.current.scrollBy({ left: 100, behavior: 'smooth' })
        }
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [productosJunteador])

  // Carrusel automático para pegamento
  useEffect(() => {
    if (!pegamentoCarouselRef.current || productosPegamento.length === 0) return
    const interval = setInterval(() => {
      if (pegamentoCarouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = pegamentoCarouselRef.current
        const maxScroll = scrollWidth - clientWidth
        if (scrollLeft >= maxScroll) {
          pegamentoCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          pegamentoCarouselRef.current.scrollBy({ left: 100, behavior: 'smooth' })
        }
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [productosPegamento])

  // Carrusel automático para decorados
  useEffect(() => {
    if (!decoradosCarouselRef.current || productosDecorados.length === 0) return
    const interval = setInterval(() => {
      if (decoradosCarouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = decoradosCarouselRef.current
        const maxScroll = scrollWidth - clientWidth
        if (scrollLeft >= maxScroll) {
          decoradosCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          decoradosCarouselRef.current.scrollBy({ left: 100, behavior: 'smooth' })
        }
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [productosDecorados])

  const fetchProducto = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/pisos/${params.id}`)
      if (!res.ok) throw new Error('No encontrado')
      const data = await res.json()
      setProducto(data)
    } catch (error) {
      console.error(error)
      toast.error('Producto no encontrado')
      router.push('/pisos')
    } finally {
      setLoading(false)
    }
  }

  const fetchProductosComplementarios = async () => {
    try {
      const [resJ, resP, resD] = await Promise.all([
        fetch('/api/productos?linea=Junteador'),
        fetch('/api/productos?linea=Pegamentos'),
        fetch('/api/productos?linea=Decorados')
      ])
      if (resJ.ok) {
        const data = await resJ.json()
        setProductosJunteador(data)
      }
      if (resP.ok) {
        const data = await resP.json()
        setProductosPegamento(data)
      }
      if (resD.ok) {
        const data = await resD.json()
        setProductosDecorados(data)
      }
    } catch (error) {
      console.error('Error al cargar productos complementarios:', error)
    }
  }

  // Determina si el producto es cerámico
  const esCeramico = producto?.linea && LINEAS_CERAMICAS.includes(producto.linea)

  // Cálculo de cajas para cerámicos
  const calcularCajas = () => {
    const anchoNum = parseFloat(ancho)
    const largoNum = parseFloat(largo)

    if (!anchoNum || !largoNum || anchoNum <= 0 || largoNum <= 0) {
      toast.error('Ingresa medidas válidas mayores a 0')
      return
    }

    if (!producto.m2_por_caja || producto.m2_por_caja <= 0) {
      toast.error('Este producto no tiene información de m² por caja')
      return
    }

    let area = anchoNum * largoNum
    if (incluirExtra) area *= 1.1

    setAreaTotal(area)
    const cajas = Math.ceil(area / producto.m2_por_caja)
    setCajasNecesarias(cajas)

    // Calcular complementos
    const cantJ = Math.ceil(area / 10)
    const cantP = Math.ceil(area / 4)
    setCantidadJunteador(String(cantJ))
    setCantidadPegamento(String(cantP))

    toast.success(`📦 Necesitas ${cajas} caja${cajas !== 1 ? 's' : ''}`)
  }

  // Agregar cerámico al carrito
  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Inicia sesión para comprar')
      router.push('/login')
      return
    }

    if (!cajasNecesarias || cajasNecesarias <= 0) {
      toast.error('Primero calcula las cajas necesarias')
      return
    }

    if (cajasNecesarias > producto.stock) {
      toast.error('Stock insuficiente')
      return
    }

    setAddingToCart(true)
    try {
      const token = Cookies.get('token')
      const res = await fetch('/api/carrito/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productoId: producto.id,
          cantidad: cajasNecesarias
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`${cajasNecesarias} caja${cajasNecesarias !== 1 ? 's' : ''} agregada${cajasNecesarias !== 1 ? 's' : ''}`)
        await updateCartCount()
        // No reseteamos la calculadora ni los complementos
      } else {
        toast.error(data.error || 'Error al agregar')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error de conexión')
    } finally {
      setAddingToCart(false)
    }
  }

  // Agregar complemento al carrito
  const handleAddComplemento = async (producto, cantidad, color = '') => {
    if (!user) {
      toast.error('Inicia sesión para comprar')
      router.push('/login')
      return
    }

    const cantNum = parseInt(cantidad, 10) || 1
    if (cantNum > producto.stock) {
      toast.error('Stock insuficiente')
      return
    }

    setAddingToCart(true)
    try {
      const token = Cookies.get('token')
      const res = await fetch('/api/carrito/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productoId: producto.id,
          cantidad: cantNum
        })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Agregado al carrito')
        await updateCartCount()
      } else {
        toast.error(data.error || 'Error al agregar')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error de conexión')
    } finally {
      setAddingToCart(false)
    }
  }

  // Agregar producto general al carrito
  const handleAddSimpleToCart = async () => {
    if (!user) {
      toast.error('Inicia sesión para comprar')
      router.push('/login')
      return
    }

    const cantidad = parseInt(cantidadSimple, 10) || 1
    if (cantidad > producto.stock) {
      toast.error('Stock insuficiente')
      return
    }

    setAddingToCart(true)
    try {
      const token = Cookies.get('token')
      const res = await fetch('/api/carrito/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productoId: producto.id,
          cantidad
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`${cantidad} producto${cantidad !== 1 ? 's' : ''} agregado${cantidad !== 1 ? 's' : ''}`)
        await updateCartCount()
        setCantidadSimple('1')
      } else {
        toast.error(data.error || 'Error al agregar')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error de conexión')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWhatsApp = () => {
    const mensaje = encodeURIComponent(
      `Hola! Necesito ${cajasNecesarias} cajas de *${producto.nombre_completo || producto.nombre}* (ID: ${producto.id}).\n\n` +
      `Stock disponible: ${producto.stock} cajas\n` +
      `Área a cubrir: ${areaTotal?.toFixed(2)} m²\n\n` +
      `¿Pueden conseguir las cajas faltantes?`
    )
    const numeroWhatsApp = '5215512345678'
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank')
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
          <p className='text-gray-600 font-medium'>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!producto) return null

  const imagenes = producto.imagen_url 
    ? (Array.isArray(producto.imagen_url) ? producto.imagen_url : producto.imagen_url.split(',').map(img => img.trim()).filter(Boolean))
    : ['/placeholder.jpg']

  const stockInsuficiente = cajasNecesarias && cajasNecesarias > producto.stock

  return (
    <div className='min-h-screen bg-gray-50 pb-20 md:pb-8' style={{ backgroundColor: '#f8fafc' }}>
      <Header />

      <main className='container mx-auto px-3 md:px-6 py-4 md:py-6'>
        {/* Breadcrumb */}
        <nav className='flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6'>
          <button onClick={() => router.push('/pisos')} className='hover:text-yellow-400 transition'>
            {esCeramico ? 'Pisos' : 'Productos'}
          </button>
          <span>/</span>
          <span className='font-semibold truncate' style={{ color: '#00162f' }}>
            {producto.nombre_completo || producto.nombre}
          </span>
        </nav>

        {/* Grid con ancho dinámico según cálculo */}
        <div className={`grid lg:grid-cols-[1fr_minmax(400px,550px)] gap-6 md:gap-8 lg:gap-6 mb-8 ${
          cajasNecesarias ? 'lg:grid-cols-[1fr_minmax(450px,600px)]' : ''
        }`}>
          
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-3 lg:space-y-4">
            {/* Galería */}
            <div className='relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100'>
              <img
                src={imagenes[currentImg]}
                alt={producto.nombre_completo || producto.nombre}
                className='w-full h-64 md:h-[500px] lg:h-[550px] object-cover cursor-zoom-in'
                onClick={() => setShowImageModal(true)}
              />
              
              {imagenes.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImg((prev) => (prev - 1 + imagenes.length) % imagenes.length)}
                    className='absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition'
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
                  </button>
                  <button
                    onClick={() => setCurrentImg((prev) => (prev + 1) % imagenes.length)}
                    className='absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition'
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
                  </button>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {imagenes.length > 1 && (
              <div className='flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide'>
                {imagenes.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImg(idx)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-16 lg:h-16 rounded-lg overflow-hidden border-2 transition ${
                      idx === currentImg ? 'border-yellow-400' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className='w-full h-full object-cover' />
                  </button>
                ))}
              </div>
            )}

            {/* Especificaciones Técnicas (solo para cerámicos) */}
            {esCeramico && (
              <div className='bg-gray-200 rounded-2xl p-4 shadow-sm border border-gray-100 mx-auto'>
                <h2 className='text-lg lg:text-xl font-black mb-2' style={{ color: '#00162f' }}>
                  Especificaciones Técnicas
                </h2>
                <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8'>
                  {[
                    { label: 'Cuerpo', value: producto.cuerpo },
                    { label: 'Absorción', value: producto.absorcion },
                    { label: 'Resistencia flexión', value: producto.resistencia_flexion },
                    { label: 'Rectificado', value: producto.rectificado ? 'Sí' : 'No' },
                    { label: 'Piezas x Caja', value: producto.piezas_por_caja },
                    { label: 'm² x Caja', value: producto.m2_por_caja },
                    { label: 'KG x Caja', value: producto.kg_por_caja ? `${producto.kg_por_caja} kg` : 'N/A' },
                    { label: 'Tecnología', value: producto.tecnologia || 'N/A' },
                  ].map((item, i) => (
                    <div key={i} className='flex justify-between items-center py-2 lg:py-2.5 border-b border-gray-50'>
                      <span className='text-xs text-gray-500 font-medium'>{item.label}</span>
                      <span className='text-xs font-bold' style={{ color: '#00162f' }}>
                        {item.value || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

           
          {/* Carrusel de productos Decorados */}
{productosDecorados.length > 0 && (
  <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
    <h2 className='text-lg lg:text-xl font-black mb-4' style={{ color: '#00162f' }}>
      También te puede interesar
    </h2>
    <div ref={decoradosCarouselRef} className='relative overflow-x-auto scrollbar-hide snap-x'>
      <div className='flex gap-4'>
        {productosDecorados.map((prod) => (
          <div
            key={prod.id}
            className='shrink-0 w-24 snap-start cursor-pointer group ml-5'
            onClick={() => router.push(`/pisos/${prod.id}`)}
          >
            <div className='w-24 h-24 mx-auto mb-2 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-yellow-400 transition'>
              <img
                src={prod.imagen_url?.split(',')[0] || '/placeholder.jpg'}
                alt={prod.nombre}
                className='w-full h-full object-cover'
              />
            </div>
            <p className='text-xs font-bold text-gray-700 text-center line-clamp-2'>
              {prod.nombre}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
          </div>

          {/* COLUMNA DERECHA */}
          <div className="lg:pr-2 space-y-3 lg:space-y-3">
            {producto.coleccion && (
              <span className='inline-block bg-yellow-400 text-[9px] lg:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full' style={{ color: '#00162f' }}>
                {producto.coleccion}
              </span>
            )}

            <h1 className='text-xl md:text-3xl lg:text-2xl font-black leading-tight' style={{ color: '#00162f' }}>
              {producto.nombre_completo || producto.nombre}
            </h1>

            {producto.descripcion && (
              <p className='text-sm lg:text-base text-justify text-gray-600 leading-snug'>
                {producto.descripcion}
              </p>
            )}

            {/* Áreas de uso */}
            {producto.uso && producto.uso.length > 0 && (
              <div className='block bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
                <div className='flex items-center gap-3 p-2 border-b border-gray-100'>
                  <h2 className='text-lg font-black text-gray-500'>Áreas de Uso</h2>
                  {(() => {
                    const iconMap = {
                      'Interior': <Home className="w-5 h-5" />,
                      'Baño': <Bath className="w-5 h-5" />,
                      'Cocina': <UtensilsCrossed className="w-5 h-5" />,
                      'Recámara': <Bed className="w-5 h-5" />,
                      'Sala': <Sofa className="w-5 h-5" />,
                      'Exterior': <Trees className="w-5 h-5" />,
                      'Comercial': <Warehouse className="w-5 h-5" />
                    }
                    const usedAreas = producto.uso || []
                    const icons = usedAreas.map(area => iconMap[area]).filter(Boolean)
                    if (icons.length === 0) {
                      return [
                        <Bath key="bath" className="w-5 h-5" />,
                        <ShowerHead key="shower" className="w-5 h-5" />,
                        <Bed key="bed" className="w-5 h-5" />,
                        <Sofa key="sofa" className="w-5 h-5" />,
                        <UtensilsCrossed key="kitchen" className="w-5 h-5" />,
                        <Home key="home" className="w-5 h-5" />
                      ].map((icon, idx) => (
                        <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors'>
                          {icon}
                        </div>
                      ))
                    }
                    return icons.map((icon, idx) => (
                      <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors'>
                        {icon}
                      </div>
                    ))
                  })()}
                </div>
              </div>
            )}

            {/* Precio */}
            <div className='bg-white rounded-xl p-3 lg:p-4 border border-gray-100 shadow-sm'>
              <div className='flex items-baseline gap-2 mb-1'>
                <span className='text-2xl lg:text-3xl font-black' style={{ color: '#00162f' }}>
                  ${Number(producto.precio).toFixed(2)}
                </span>
                {producto.precio_anterior && (
                  <span className='text-sm text-gray-400 line-through'>
                    ${Number(producto.precio_anterior).toFixed(2)}
                  </span>
                )}
              </div>
              {esCeramico ? (
                <p className='text-[10px] lg:text-xs text-gray-500'>
                  {producto.m2_por_caja} m²/caja • {producto.piezas_por_caja} pzs
                </p>
              ) : (
                <p className='text-[10px] lg:text-xs text-gray-500'>Precio por pieza</p>
              )}
            </div>

            {/* Atributos rápidos (solo para cerámicos) */}
            {esCeramico && (
              <div className='grid grid-cols-3 gap-2'>
                {[
                  { label: 'Formato', value: producto.formato },
                  { label: 'Acabado', value: producto.acabado },
                  { label: 'PEI', value: producto.pei || 'N/A' }
                ].map((attr, i) => (
                  <div key={i} className='bg-gray-50 rounded-lg p-2 border border-gray-100'>
                    <p className='text-[8px] lg:text-[9px] uppercase font-bold text-gray-400 mb-0.5'>
                      {attr.label}
                    </p>
                    <p className='text-[10px] lg:text-xs font-bold' style={{ color: '#00162f' }}>
                      {attr.value || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* BLOQUE DE ACCIÓN: Calculadora para cerámicos / Input simple para generales */}
            {esCeramico ? (
              /* Calculadora para cerámicos */
              <div className='rounded-xl p-3 lg:p-4 border-2' style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='bg-yellow-400 p-1.5 rounded-lg'>
                    <Calculator className='w-4 h-4 lg:w-4 lg:h-4' style={{ color: '#00162f' }} />
                  </div>
                  <h3 className='text-sm lg:text-base font-black text-white'>
                    Calcula Cajas
                  </h3>
                </div>

                <div className='space-y-2.5'>
                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <label className='block text-[9px] font-bold text-yellow-400 mb-1 uppercase'>
                        Ancho (m)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={ancho}
                        onChange={(e) => setAncho(e.target.value)}
                        placeholder="10"
                        className='w-full px-2 py-1.5 border-2 border-gray-600 rounded-lg font-bold text-xs bg-gray-800 text-white focus:border-yellow-400 focus:outline-none transition-colors'
                      />
                    </div>
                    <div>
                      <label className='block text-[9px] font-bold text-yellow-400 mb-1 uppercase'>
                        Largo (m)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={largo}
                        onChange={(e) => setLargo(e.target.value)}
                        placeholder="10"
                        className='w-full px-2 py-1.5 border-2 border-gray-600 rounded-lg font-bold text-xs bg-gray-800 text-white focus:border-yellow-400 focus:outline-none transition-colors'
                      />
                    </div>
                  </div>

                  {ancho && largo && parseFloat(ancho) > 0 && parseFloat(largo) > 0 && (
                    <div className='bg-gray-800 rounded-lg p-2 border border-gray-700'>
                      <p className='text-[9px] text-gray-400 mb-0.5'>Área a cubrir</p>
                      <p className='text-base lg:text-lg font-black text-white'>
                        {(parseFloat(ancho) * parseFloat(largo)).toFixed(2)} m²
                        {incluirExtra && (
                          <span className='text-xs text-yellow-400 ml-1.5'>
                            +10%
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  <label className='flex items-start gap-2 cursor-pointer bg-gray-800 rounded-lg p-2 border border-gray-700 hover:border-yellow-400 transition-colors'>
                    <input
                      type="checkbox"
                      checked={incluirExtra}
                      onChange={(e) => setIncluirExtra(e.target.checked)}
                      className='w-3.5 h-3.5 accent-yellow-400 mt-0.5 flex-shrink-0'
                    />
                    <span className='text-[10px] lg:text-xs font-semibold text-white leading-tight'>
                      +10% extra para cortes
                    </span>
                  </label>

                  <button
                    onClick={calcularCajas}
                    disabled={!ancho || !largo}
                    className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2'
                    style={{ color: '#00162f' }}
                  >
                    <Calculator className="w-4 h-4" />
                    Calcular
                  </button>

                  {cajasNecesarias !== null && (
                    <div className='bg-white rounded-lg p-3 animate-in fade-in zoom-in duration-300'>
                      <div className='flex items-center justify-between mb-2.5'>
                        <div>
                          <p className='text-[9px] text-gray-500 mb-0.5'>Cajas necesarias</p>
                          <p className='text-2xl font-black flex items-center gap-1.5' style={{ color: '#00162f' }}>
                            <Package className="w-5 h-5" />
                            {cajasNecesarias}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-[9px] text-gray-500 mb-0.5'>Stock</p>
                          <p className={`text-lg font-black ${
                            producto.stock >= cajasNecesarias ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {producto.stock}
                          </p>
                        </div>
                      </div>

                      {stockInsuficiente ? (
                        <>
                          <button
                            onClick={handleWhatsApp}
                            className='w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95'
                          >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                          </button>
                          <div className='flex items-start gap-1.5 mt-2 bg-red-50 border border-red-200 rounded p-2'>
                            <AlertTriangle className='text-red-600 shrink-0 w-3.5 h-3.5 mt-0.5' />
                            <p className='text-xs text-red-700 font-medium leading-tight'>
                              Stock insuficiente. Contacta con nosotros para hacer el pedido completo.
                            </p>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={handleAddToCart}
                          disabled={addingToCart}
                          className='w-full bg-yellow-400 hover:bg-yellow-500 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-gray-400'
                          style={{ color: '#00162f' }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {addingToCart ? 'Agregando...' : `Agregar ${cajasNecesarias}`}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* SUGERENCIAS DE COMPRA COMPLEMENTARIA */}
                {areaTotal && (
                  <div className='mt-6 space-y-6'>
                    {/* ---------- JUNTEADOR ---------- */}
                    {productosJunteador.length > 0 && (
                      <div className='bg-white rounded-xl p-4 border border-gray-200 shadow-sm'>
                        <h4 className='text-sm font-bold text-gray-800 mb-2'>Complementa con Junteador</h4>
                        <p className='text-xs text-gray-600 mb-3'>
                          Recomendado: <span className='font-bold text-blue-900'>{cantidadJunteador}</span> unidad{cantidadJunteador !== '1' ? 'es' : ''} (1 por cada 10 m²)
                        </p>

                        {/* Carrusel de productos Junteador */}
                        <div ref={junteadorCarouselRef} className='relative mb-3 overflow-x-auto scrollbar-hide snap-x'>
                          <div className='flex gap-2'>
                            {productosJunteador.map((prod) => (
                              <div
                                key={prod.id}
                                className='flex-shrink-0 w-24 snap-start cursor-pointer group'
                                onClick={() => router.push(`/pisos/${prod.id}`)}
                              >
                                <div className='w-10 h-10 mx-auto mb-1 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-yellow-400 transition'>
                                  <img
                                    src={prod.imagen_url?.split(',')[0] || '/placeholder.jpg'}
                                    alt={prod.nombre}
                                    className='w-full h-full object-cover'
                                  />
                                </div>
                                <p className='text-[10px] font-bold text-gray-700 text-center line-clamp-2'>
                                  {prod.nombre}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {!mostrarOpcionesJunteador ? (
                          <button
                            onClick={() => setMostrarOpcionesJunteador(true)}
                            className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-xs transition'
                          >
                            Elegir Junteador
                          </button>
                        ) : (
                          <div className='space-y-3 mt-3 border-t pt-3'>
                            {/* Selector de tipo (con arena / sin arena) basado en acabado */}
                            <select
                              className='w-full p-2 border rounded-lg text-sm'
                              value={junteadorSeleccionado?.id || ''}
                              onChange={(e) => {
                                const prod = productosJunteador.find(p => p.id === e.target.value);
                                setJunteadorSeleccionado(prod);
                                setColorSeleccionado(''); // reset color al cambiar producto
                              }}
                            >
                              <option value=''>Selecciona tipo</option>
                              {productosJunteador.map(p => (
                                <option key={p.id} value={p.id}>
                                  {p.acabado} {p.formato ? `- ${p.formato}` : ''}
                                </option>
                              ))}
                            </select>

                            {/* Selector de color (si el producto seleccionado tiene formato con colores) */}
                            {junteadorSeleccionado && junteadorSeleccionado.formato && (
                              <select
                                className='w-full p-2 border rounded-lg text-sm'
                                value={colorSeleccionado}
                                onChange={(e) => setColorSeleccionado(e.target.value)}
                              >
                                <option value=''>Elige color</option>
                                {junteadorSeleccionado.formato.split(',').map((color, idx) => (
                                  <option key={idx} value={color.trim()}>
                                    {color.trim()}
                                  </option>
                                ))}
                              </select>
                            )}

                            {/* Input de cantidad como texto para poder borrar */}
                            <input
                              type='text'
                              inputMode='numeric'
                              pattern='[0-9]*'
                              value={cantidadJunteador}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setCantidadJunteador(val);
                              }}
                              onBlur={() => {
                                let num = parseInt(cantidadJunteador, 10);
                                if (isNaN(num) || num < 1) num = 1;
                                setCantidadJunteador(String(num));
                              }}
                              className='w-full p-2 border rounded-lg text-sm'
                            />

                            <button
                              onClick={() => handleAddComplemento(junteadorSeleccionado, cantidadJunteador, colorSeleccionado)}
                              disabled={
                                !junteadorSeleccionado || 
                                (junteadorSeleccionado.formato && !colorSeleccionado) || 
                                addingToCart
                              }
                              className='w-full bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-500 disabled:bg-gray-300 transition'
                            >
                              Agregar al carrito
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ---------- PEGAMENTO ---------- */}
                    {productosPegamento.length > 0 && (
                      <div className='bg-white rounded-xl p-4 border border-gray-200 shadow-sm'>
                        <h4 className='text-sm font-bold text-gray-800 mb-2'>Complementa con Pegamento</h4>
                        <p className='text-xs text-gray-600 mb-3'>
                          Recomendado: <span className='font-bold text-blue-900'>{cantidadPegamento}</span> unidad{cantidadPegamento !== '1' ? 'es' : ''} (1 por cada 4 m²)
                        </p>

                        {/* Carrusel de productos Pegamento */}
                        <div ref={pegamentoCarouselRef} className='relative mb-3 overflow-x-auto scrollbar-hide snap-x'>
                          <div className='flex gap-2'>
                            {productosPegamento.map((prod) => (
                              <div
                                key={prod.id}
                                className='flex-shrink-0 w-24 snap-start cursor-pointer group'
                                onClick={() => router.push(`/pisos/${prod.id}`)}
                              >
                                <div className='w-10 h-10 mx-auto mb-1 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-yellow-400 transition'>
                                  <img
                                    src={prod.imagen_url?.split(',')[0] || '/placeholder.jpg'}
                                    alt={prod.nombre}
                                    className='w-full h-full object-cover'
                                  />
                                </div>
                                <p className='text-[10px] font-bold text-gray-700 text-center line-clamp-2'>
                                  {prod.nombre}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {!mostrarOpcionesPegamento ? (
                          <button
                            onClick={() => setMostrarOpcionesPegamento(true)}
                            className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-xs transition'
                          >
                            Elegir Pegamento
                          </button>
                        ) : (
                          <div className='space-y-3 mt-3 border-t pt-3'>
                            {/* Selector de tipo (Adecon / Pegapiso) basado en acabado */}
                            <select
                              className='w-full p-2 border rounded-lg text-sm'
                              value={pegamentoSeleccionado?.id || ''}
                              onChange={(e) => {
                                const prod = productosPegamento.find(p => p.id === e.target.value);
                                setPegamentoSeleccionado(prod);
                              }}
                            >
                              <option value=''>Selecciona tipo</option>
                              {productosPegamento.map(p => (
                                <option key={p.id} value={p.id}>
                                  {p.acabado} {p.nombre}
                                </option>
                              ))}
                            </select>

                            {/* Input de cantidad como texto */}
                            <input
                              type='text'
                              inputMode='numeric'
                              pattern='[0-9]*'
                              value={cantidadPegamento}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setCantidadPegamento(val);
                              }}
                              onBlur={() => {
                                let num = parseInt(cantidadPegamento, 10);
                                if (isNaN(num) || num < 1) num = 1;
                                setCantidadPegamento(String(num));
                              }}
                              className='w-full p-2 border rounded-lg text-sm'
                            />

                            <button
                              onClick={() => handleAddComplemento(pegamentoSeleccionado, cantidadPegamento)}
                              disabled={!pegamentoSeleccionado || addingToCart}
                              className='w-full bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-500 disabled:bg-gray-300 transition'
                            >
                              Agregar al carrito
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Bloque simple para productos generales */
              <div className='rounded-xl p-3 lg:p-4 border-2' style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='bg-yellow-400 p-1.5 rounded-lg'>
                    <ShoppingCart className='w-4 h-4 lg:w-4 lg:h-4' style={{ color: '#00162f' }} />
                  </div>
                  <h3 className='text-sm lg:text-base font-black text-white'>
                    Cantidad
                  </h3>
                </div>

                <div className='space-y-2.5'>
                  <input
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    value={cantidadSimple}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setCantidadSimple(val);
                    }}
                    onBlur={() => {
                      let num = parseInt(cantidadSimple, 10);
                      if (isNaN(num) || num < 1) num = 1;
                      if (num > producto.stock) num = producto.stock;
                      setCantidadSimple(String(num));
                    }}
                    className='w-full px-3 py-2 border-2 border-gray-600 rounded-lg font-bold text-sm bg-gray-800 text-white focus:border-yellow-400 focus:outline-none'
                  />
                  <button
                    onClick={handleAddSimpleToCart}
                    disabled={addingToCart || (cantidadSimple !== '' && parseInt(cantidadSimple) > producto.stock)}
                    className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2'
                    style={{ color: '#00162f' }}
                  >
                    {addingToCart ? 'Agregando...' : 'Agregar al carrito'}
                  </button>
                  {cantidadSimple !== '' && parseInt(cantidadSimple) > producto.stock && (
                    <p className='text-xs text-red-400'>Stock insuficiente</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de imagen */}
      {showImageModal && (
        <div 
          className='fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300'
          style={{ backgroundColor: 'rgba(0, 22, 47, 0.95)' }}
          onClick={() => setShowImageModal(false)}
        >
          <button
            onClick={() => setShowImageModal(false)}
            className='absolute top-4 md:top-8 right-4 md:right-8 text-white p-2 hover:bg-white/10 rounded-full transition'
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <img
            src={imagenes[currentImg]}
            alt="Zoom"
            className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <BottomNav />
    </div>
  )
}