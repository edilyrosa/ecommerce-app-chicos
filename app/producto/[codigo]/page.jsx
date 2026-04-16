// 'use client'
// import { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import Header from '@/components/Header'
// import BottomNav from '@/components/BottomNav'
// import toast from 'react-hot-toast'

// export default function ProductoPorCodigo() {
//   const params = useParams()
//   const router = useRouter()
//   const [producto, setProducto] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [errorMsg, setErrorMsg] = useState(null)

//   const codigo = params.codigo   // En el cliente useParams no devuelve Promise

//   useEffect(() => {
//     if (!codigo) return
//     const fetchProducto = async () => {
//       try {
//         const res = await fetch(`/api/productos/codigo/${codigo}`)
//         if (res.ok) {
//           const data = await res.json()
//           setProducto(data)
//         } else {
//           const errorData = await res.json()
//           setErrorMsg(errorData.error || 'Producto no encontrado')
//           toast.error(`Código: ${codigo} - ${errorData.error || 'No encontrado'}`)
//         }
//       } catch {
//         setErrorMsg('Error de conexión')
//         toast.error('Error de conexión')
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchProducto()
//   }, [codigo, router])

//   if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400" /></div>
//   if (errorMsg) return <div className="p-8 text-center text-red-600">Error: {errorMsg}</div>
//   if (!producto) return <div className="p-8 text-center">Producto no encontrado</div>

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
//       <Header />
//       <main className="container mx-auto px-3 md:px-6 py-4 md:py-6 max-w-7xl">
//         {/* Aquí puedes usar tu componente de detalle de producto, por ejemplo: */}
//         {/* <ProductDetail producto={producto} /> */}
//         <div className="bg-white rounded-2xl p-6 shadow">
//           <h1 className="text-2xl font-black">{producto.nombre}</h1>
//           <img src={producto.imagen_url?.split(',')[0]} alt={producto.nombre} className="w-full h-auto max-h-96 object-contain my-4" />
//           <p className="text-gray-600">{producto.descripcion}</p>
//           <p className="text-xl font-bold mt-2">${Number(producto.precio).toFixed(2)}</p>
//         </div>
//       </main>
//       <BottomNav />
//     </div>
//   )
// }



// app/producto/[codigo]/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { ShoppingCart, X, ChevronLeft, ChevronRight, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { useAuth } from '@/context/authContext'

// ========== COMPONENTE CARRUSEL DE IMÁGENES ==========
const ImageCarousel = ({ imagenes, currentImg, setCurrentImg, onZoom }) => {
  if (imagenes.length === 0) return null

  const nextImage = () => setCurrentImg((prev) => (prev + 1) % imagenes.length)
  const prevImage = () => setCurrentImg((prev) => (prev - 1 + imagenes.length) % imagenes.length)

  return (
    <div className="relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100">
      <div className="w-full aspect-square">
        <img
          src={imagenes[currentImg]}
          alt="Producto"
          className="w-full h-full object-contain cursor-zoom-in"
          onClick={onZoom}
        />
      </div>
      {imagenes.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full shadow-lg transition"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#00162f' }} />
          </button>
        </>
      )}
    </div>
  )
}

// ========== SKELETON CON COLORES CORPORATIVOS ==========
function ProductoSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <Header />
      <main className="container mx-auto px-3 md:px-6 py-4 md:py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 md:gap-8">
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-100 to-yellow-50 h-64 md:h-96 rounded-2xl animate-pulse border-2 border-gray-200" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-gradient-to-br from-blue-100 to-yellow-50 rounded-lg animate-pulse border border-gray-200" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 w-48 bg-gradient-to-r from-blue-100 to-yellow-100 rounded animate-pulse" />
            <div className="h-4 w-full bg-gradient-to-r from-blue-50 to-yellow-50 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gradient-to-r from-blue-50 to-yellow-50 rounded animate-pulse" />
            <div className="bg-gradient-to-br from-blue-100 to-yellow-50 h-32 rounded-xl animate-pulse border-2 border-gray-200" />
            <div className="bg-gradient-to-br from-blue-100 to-yellow-50 h-64 rounded-xl animate-pulse border-2 border-gray-200" />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

// ========== COMPONENTE PRINCIPAL ==========
export default function ProductoPorCodigo() {
  const params = useParams()
  const router = useRouter()
  const { user, updateCartCount } = useAuth()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImg, setCurrentImg] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [cantidad, setCantidad] = useState('1')
  const [addingToCart, setAddingToCart] = useState(false)

  const codigo = params.codigo

  useEffect(() => {
    if (!codigo) return
    const fetchProducto = async () => {
      try {
        const res = await fetch(`/api/productos/codigo/${codigo}`)
        if (res.ok) {
          const data = await res.json()
          setProducto(data)
        } else {
          toast.error('Producto no encontrado')
          router.push('/')
        }
      } catch {
        toast.error('Error de conexión')
        router.push('/')
      } finally {
        setLoading(false)
      }
    }
    fetchProducto()
  }, [codigo, router])

  if (loading) return <ProductoSkeleton />
  if (!producto) return null

  const imagenes = producto.imagen_url
    ? producto.imagen_url.split(',').map(img => img.trim()).filter(Boolean)
    : ['/bodega-img.jpg']

  const tieneDescuento = producto.precio_anterior && Number(producto.precio_anterior) > Number(producto.precio)
  const descuentoPorcentaje = tieneDescuento
    ? Math.round(((producto.precio_anterior - producto.precio) / producto.precio_anterior) * 100)
    : null

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Inicia sesión para comprar')
      router.push('/login')
      return
    }
    const cant = parseInt(cantidad, 10) || 1
    if (cant > producto.stock) {
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
        body: JSON.stringify({ productoId: producto.id, cantidad: cant })
      })
      if (res.ok) {
        toast.success(`${cant} producto${cant !== 1 ? 's' : ''} agregado${cant !== 1 ? 's' : ''}`)
        await updateCartCount()
        setCantidad('1')
      } else {
        const error = await res.json()
        toast.error(error.error || 'Error al agregar')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWhatsApp = () => {
    const mensaje = encodeURIComponent(
      `Hola! Necesito ${cantidad} unidad(es) de *${producto.nombre}* (Código: ${producto.codigo}).\n\n` +
      `Stock disponible: ${producto.stock} unidades.\n\n` +
      `¿Pueden conseguir las unidades faltantes?`
    )
    const numeroWhatsApp = '5215512345678' // Cambia por el número real
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank')
  }

  const stockInsuficiente = cantidad !== '' && parseInt(cantidad) > producto.stock

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8 overflow-x-hidden">
      <Header />

      <main className="w-full mx-auto px-3 md:px-6 py-4 md:py-6 max-w-[1400px]">
        {/* Navegación */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6 overflow-hidden">
          <button onClick={() => router.push('/tienda')} className="hover:text-yellow-400 transition flex-shrink-0">
            Productos
          </button>
          <span className="flex-shrink-0">/</span>
          <span className="font-semibold truncate" style={{ color: '#00162f' }}>
            {producto.nombre}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 md:gap-8 lg:gap-6 mb-8">
          {/* COLUMNA IZQUIERDA - IMÁGENES */}
          <div className="space-y-3 lg:space-y-4">
            <ImageCarousel
              imagenes={imagenes}
              currentImg={currentImg}
              setCurrentImg={setCurrentImg}
              onZoom={() => setShowImageModal(true)}
            />

            {imagenes.length > 1 && (
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {imagenes.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImg(idx)}
                    className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition ${
                      idx === currentImg ? 'border-yellow-400' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Especificaciones técnicas (si existen) */}
            {producto.linea && (
              <div className="bg-gray-200 rounded-2xl p-4 shadow-sm border border-gray-100">
                <h2 className="text-center text-lg lg:text-xl font-black mb-2" style={{ color: '#00162f' }}>
                  Especificaciones Técnicas
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {producto.linea && (
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-2 border-b border-gray-50">
                      <span className="text-xs text-gray-500 font-medium">Línea</span>
                      <span className="text-xs font-bold" style={{ color: '#00162f' }}>{producto.linea}</span>
                    </div>
                  )}
                  {producto.formato && (
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-2 border-b border-gray-50">
                      <span className="text-xs text-gray-500 font-medium">Formato</span>
                      <span className="text-xs font-bold" style={{ color: '#00162f' }}>{producto.formato}</span>
                    </div>
                  )}
                  {producto.acabado && (
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-2 border-b border-gray-50">
                      <span className="text-xs text-gray-500 font-medium">Acabado</span>
                      <span className="text-xs font-bold" style={{ color: '#00162f' }}>{producto.acabado}</span>
                    </div>
                  )}
                  {producto.cuerpo && (
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-2 border-b border-gray-50">
                      <span className="text-xs text-gray-500 font-medium">Cuerpo</span>
                      <span className="text-xs font-bold" style={{ color: '#00162f' }}>{producto.cuerpo}</span>
                    </div>
                  )}
                  {producto.pei && (
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-2 border-b border-gray-50">
                      <span className="text-xs text-gray-500 font-medium">PEI</span>
                      <span className="text-xs font-bold" style={{ color: '#00162f' }}>{producto.pei}</span>
                    </div>
                  )}
                  {producto.coleccion && (
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-2 border-b border-gray-50">
                      <span className="text-xs text-gray-500 font-medium">Colección</span>
                      <span className="text-xs font-bold" style={{ color: '#00162f' }}>{producto.coleccion}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA - INFORMACIÓN Y COMPRA */}
          <div className="space-y-3 lg:space-y-4">
            {producto.coleccion && (
              <span className="inline-block bg-yellow-400 text-[9px] lg:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ color: '#00162f' }}>
                {producto.coleccion}
              </span>
            )}

            <h1 className="text-xl md:text-3xl lg:text-2xl font-black leading-tight break-words" style={{ color: '#00162f' }}>
              {producto.nombre}
            </h1>

            {producto.descripcion && (
              <p className="text-sm lg:text-base text-justify text-gray-600 leading-snug break-words">
                {producto.descripcion}
              </p>
            )}

            {/* Precio */}
            <div className="bg-white rounded-xl p-3 lg:p-4 border border-gray-100 shadow-sm">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl lg:text-3xl font-black" style={{ color: '#00162f' }}>
                  ${Number(producto.precio).toFixed(2)}
                </span>
                {tieneDescuento && (
                  <span className="text-sm text-gray-400 line-through">
                    ${Number(producto.precio_anterior).toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[10px] lg:text-xs text-gray-500">
                Precio unitario • IVA incluido
              </p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                producto.stock <= 3 ? 'bg-red-500' : producto.stock <= 10 ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              <span className={`text-xs font-bold ${
                producto.stock <= 3 ? 'text-red-500' : producto.stock <= 10 ? 'text-yellow-600' : 'text-green-500'
              }`}>
                {producto.stock > 0 ? `${producto.stock} en stock` : 'Agotado'}
              </span>
            </div>

            {/* Bloque de cantidad y compra */}
            <div className="rounded-xl p-3 lg:p-4 border-2" style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-yellow-400 p-1.5 rounded-lg">
                  <ShoppingCart className="w-4 h-4 lg:w-4 lg:h-4" style={{ color: '#00162f' }} />
                </div>
                <h3 className="text-sm lg:text-base font-black text-white">Cantidad</h3>
              </div>
              <div className="space-y-2.5">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={cantidad}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '')
                    setCantidad(val)
                  }}
                  onBlur={() => {
                    let num = parseInt(cantidad, 10)
                    if (isNaN(num) || num < 1) num = 1
                    if (num > producto.stock) num = producto.stock
                    setCantidad(String(num))
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-600 rounded-lg font-bold text-sm bg-gray-800 text-white focus:border-yellow-400 focus:outline-none"
                />
                {stockInsuficiente ? (
                  <>
                    <button
                      onClick={handleWhatsApp}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-black text-xs lg:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <span>Consultar por WhatsApp</span>
                    </button>
                    <p className="text-xs text-red-400 text-center">Stock insuficiente. Contáctanos.</p>
                  </>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                    style={{ color: '#00162f' }}
                  >
                    {addingToCart ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00162f' }} />
                        <span>Agregando...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Agregar al carrito</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Envío */}
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1 text-sm text-green-600 font-bold">
                <Truck size={16} />
                <span>Envío gratis</span>
              </div>
              <p className="text-[10px] text-green-700 font-bold mt-1">📦 Entrega de 3 a 5 días hábiles.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de imagen */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
          style={{ backgroundColor: 'rgba(0, 22, 47, 0.95)' }}
          onClick={() => setShowImageModal(false)}
        >
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 md:top-8 right-4 md:right-8 text-white p-2 hover:bg-white/10 rounded-full transition"
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <img
            src={imagenes[currentImg]}
            alt="Zoom"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <BottomNav />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}