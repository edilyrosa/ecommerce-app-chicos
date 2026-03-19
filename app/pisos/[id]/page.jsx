// app/pisos/[id]/page.jsx

'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { 
  ShoppingCart, X, ChevronLeft, ChevronRight,
  Calculator, MessageCircle, Package, AlertTriangle, Home,
  Bath, ShowerHead, Bed, Sofa, UtensilsCrossed, Warehouse, Trees, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { useAuth } from '@/context/authContext'

// ========== COMPONENTE CARRUSEL ==========
const Carrusel = ({ items, size = 'small', onItemClick }) => {
  const carouselRef = useRef(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const scroll = (direction) => {
    if (!carouselRef.current || items.length === 0) return
    const container = carouselRef.current
    const itemWidth = container.children[0]?.offsetWidth + 16
    if (direction === 'left') {
      container.scrollBy({ left: -itemWidth, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: itemWidth, behavior: 'smooth' })
    }
  }

  const checkScroll = () => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setShowLeft(scrollLeft > 5)
    setShowRight(scrollLeft < scrollWidth - clientWidth - 5)
  }

  useEffect(() => {
    const container = carouselRef.current
    if (!container) return
    container.addEventListener('scroll', checkScroll)
    checkScroll()
    return () => container.removeEventListener('scroll', checkScroll)
  }, [items])

  useEffect(() => {
    if (!carouselRef.current || items.length === 0) return
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
        const itemWidth = carouselRef.current.children[0]?.offsetWidth + 16
        const maxScroll = scrollWidth - clientWidth
        if (scrollLeft >= maxScroll - 5) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          carouselRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' })
        }
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [items])

  if (items.length === 0) return null

  const buttonSize = size === 'small' ? 'p-1' : 'p-1.5'

  return (
    <div className='relative w-full'>
      {showLeft && (
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-yellow-400 hover:bg-yellow-500 ${buttonSize} rounded-full shadow-lg transition`}
          style={{ color: '#00162f' }}
        >
          <ChevronLeft className='w-4 h-4 md:w-5 md:h-5' />
        </button>
      )}
      <div 
        ref={carouselRef} 
        className='overflow-x-auto scrollbar-hide snap-x'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className='flex gap-4'>
          {items.map((item) => (
            <div
              key={item.id}
              className='flex-shrink-0 snap-start cursor-pointer group'
              style={{ width: size === 'small' ? '96px' : '120px' }}
              onClick={() => onItemClick(item)}
            >
              <div className={`mx-auto mb-2 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-yellow-400 transition ${
                size === 'small' ? 'w-10 h-10' : 'w-24 h-24'
              }`}>
                <img
                  src={item.imagen_url?.split(',')[0] || '/bodega-img.jpg'}
                  alt={item.nombre}
                  className='w-full h-full object-cover'
                />
              </div>
              <p className='text-xs font-bold text-gray-700 text-center line-clamp-2'>
                {item.nombre}
              </p>
            </div>
          ))}
        </div>
      </div>
      {showRight && (
        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-yellow-400 hover:bg-yellow-500 ${buttonSize} rounded-full shadow-lg transition`}
          style={{ color: '#00162f' }}
        >
          <ChevronRight className='w-4 h-4 md:w-5 md:h-5' />
        </button>
      )}
    </div>
  )
}

const LINEAS_CERAMICAS = ['Pisos', 'Azulejos', 'Decorados']

export default function PisoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, updateCartCount } = useAuth()
  
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImg, setCurrentImg] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)

  const [ancho, setAncho] = useState('')
  const [largo, setLargo] = useState('')
  const [incluirExtra, setIncluirExtra] = useState(true)
  const [cajasNecesarias, setCajasNecesarias] = useState(null)
  const [areaTotal, setAreaTotal] = useState(null)

  const [cantidadSimple, setCantidadSimple] = useState('1')

  const [productosJunteador, setProductosJunteador] = useState([])
  const [productosPegamento, setProductosPegamento] = useState([])
  const [mostrarOpcionesJunteador, setMostrarOpcionesJunteador] = useState(false)
  const [mostrarOpcionesPegamento, setMostrarOpcionesPegamento] = useState(false)
  const [junteadorSeleccionado, setJunteadorSeleccionado] = useState(null)
  const [pegamentoSeleccionado, setPegamentoSeleccionado] = useState(null)
  const [cantidadJunteador, setCantidadJunteador] = useState('0')
  const [cantidadPegamento, setCantidadPegamento] = useState('0')
  const [colorSeleccionado, setColorSeleccionado] = useState('')

  const [productosSugeridos, setProductosSugeridos] = useState([])

  const [anchoMuro, setAnchoMuro] = useState('')
  const [piezasDecoradoNecesarias, setPiezasDecoradoNecesarias] = useState(null)
  const [cajasDecoradoNecesarias, setCajasDecoradoNecesarias] = useState(null)

  const [addingToCart, setAddingToCart] = useState(false)

  // ===== FILTRO PARA JUNTEADOR =====
  const productosJunteadorFiltrados = useMemo(() => {
    if (!producto) return [];
    // Si es Pisos o Azulejos con cuerpo Porcelánico, mostrar solo 'Sin arena'
    if ((producto.linea === 'Pisos' || producto.linea === 'Azulejos') && producto.cuerpo === 'Porcelánico') {
      return productosJunteador.filter(j => j.acabado === 'Sin arena');
    }
    // En cualquier otro caso, mostrar todos
    return productosJunteador;
  }, [producto, productosJunteador]);

  useEffect(() => {
    if (params.id) {
      fetchProducto()
    }
  }, [params.id])

  useEffect(() => {
    if (producto) {
      fetchProductosComplementarios()
      fetchProductosSugeridos()
    }
  }, [producto])

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
      const [resJ, resP] = await Promise.all([
        fetch('/api/productos?linea=Junteador'),
        fetch('/api/productos?linea=Pegamentos')
      ])
      if (resJ.ok) {
        const data = await resJ.json()
        setProductosJunteador(data)
      }
      if (resP.ok) {
        const data = await resP.json()
        setProductosPegamento(data)
      }
    } catch (error) {
      console.error('Error al cargar productos complementarios:', error)
    }
  }

  const fetchProductosSugeridos = async () => {
    if (!producto) return
    const lineaActual = producto.linea
    let lineas = []
    if (lineaActual === 'Pisos' || lineaActual === 'Azulejos') {
      lineas = ['Decorados']
    } else if (lineaActual === 'Decorados') {
      lineas = ['Pisos', 'Azulejos', 'Pegamentos', 'Junteador', 'Decorados']
    } else if (lineaActual === 'Pegamentos' || lineaActual === 'Junteador') {
      lineas = ['Pisos', 'Azulejos', 'Decorados', 'Pegamentos', 'Junteador']
    } else {
      return
    }
    try {
      const promises = lineas.map(linea => fetch(`/api/productos?linea=${linea}`))
      const responses = await Promise.all(promises)
      const dataArrays = await Promise.all(responses.map(r => r.json()))
      const combined = dataArrays.flat()
      const unique = Array.from(new Map(combined.map(p => [p.id, p])).values())
      setProductosSugeridos(unique)
    } catch (error) {
      console.error('Error al cargar productos sugeridos:', error)
    }
  }

  const esCeramico = producto?.linea && LINEAS_CERAMICAS.includes(producto.linea)

  const esDecoradoLineal = producto?.linea === 'Decorados' && 
    (producto.acabado === 'Ceramico' || producto.acabado === 'Flecha')

  const esDecoradoMalla = producto?.linea === 'Decorados' && producto.acabado === 'Malla'

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

    //*✅ Junteador: 1 por cada 12 m²  (cambio solicitado).
    // TODO: ⁉️⚠️TODO: me falta el del pego, preguntar a Cesar)
    const cantJ = Math.ceil(area / 12)
    const cantP = Math.ceil(area / 4)
    setCantidadJunteador(String(cantJ))
    setCantidadPegamento(String(cantP))

    toast.success(`📦 Necesitas ${cajas} caja${cajas !== 1 ? 's' : ''}`)
  }

  const calcularDecorados = () => {
    const anchoMuroNum = parseFloat(anchoMuro)
    if (!anchoMuroNum || anchoMuroNum <= 0) {
      toast.error('Ingresa un ancho de muro válido mayor a 0')
      return
    }

    const formato = producto.formato || ''
    const match = formato.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/i)
    if (!match) {
      toast.error('No se pudo determinar el largo de la pieza desde el formato')
      return
    }
    const largoPiezaCm = parseFloat(match[2])
    if (isNaN(largoPiezaCm) || largoPiezaCm <= 0) {
      toast.error('Largo de pieza inválido')
      return
    }

    const anchoMuroCm = anchoMuroNum * 100
    const piezas = Math.ceil(anchoMuroCm / largoPiezaCm)
    setPiezasDecoradoNecesarias(piezas)

    if (producto.piezas_por_caja && producto.piezas_por_caja > 0) {
      const cajas = Math.ceil(piezas / producto.piezas_por_caja)
      setCajasDecoradoNecesarias(cajas)
    } else {
      setCajasDecoradoNecesarias(null)
    }

    toast.success(`📏 Necesitas ${piezas} pieza${piezas !== 1 ? 's' : ''}`)
  }

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

  const handleAddDecoradoToCart = async () => {
    if (!user) {
      toast.error('Inicia sesión para comprar')
      router.push('/login')
      return
    }

    let cantidad = cajasDecoradoNecesarias || piezasDecoradoNecesarias
    if (!cantidad || cantidad <= 0) {
      toast.error('Primero calcula la cantidad necesaria')
      return
    }

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
        toast.success(`${cantidad} pieza${cantidad !== 1 ? 's' : ''} agregada${cantidad !== 1 ? 's' : ''}`)
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

  const handleWhatsApp = (nombre, cantidad, stock, tipo = 'producto') => {
    const mensaje = encodeURIComponent(
      `Hola! Necesito ${cantidad} ${tipo} de *${nombre}* (ID: ${producto.id}).\n\n` +
      `Stock disponible: ${stock} unidades.\n\n` +
      `¿Pueden conseguir las unidades faltantes?`
    )
    const numeroWhatsApp = '5215512345678'
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank')
  }

  // Verificaciones de stock para los diferentes bloques
  const stockInsuficiente = cajasNecesarias && cajasNecesarias > producto?.stock
  const stockInsuficienteSimple = cantidadSimple !== '' && parseInt(cantidadSimple) > producto?.stock
  const stockInsuficienteJunteador = junteadorSeleccionado && cantidadJunteador && parseInt(cantidadJunteador) > junteadorSeleccionado.stock
  const stockInsuficientePegamento = pegamentoSeleccionado && cantidadPegamento && parseInt(cantidadPegamento) > pegamentoSeleccionado.stock

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 pb-20 md:pb-8'>
        <Header />
        <main className='container mx-auto px-3 md:px-6 py-4 md:py-6 max-w-7xl'>
          <div className='h-6 w-32 bg-gradient-to-r from-blue-100 to-yellow-100 rounded animate-pulse mb-4' />
          <div className='grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6'>
            <div className='space-y-4'>
              <div className='bg-gradient-to-br from-blue-100 to-yellow-50 h-64 md:h-96 rounded-2xl animate-pulse border-2 border-gray-200' />
              <div className='flex gap-2'>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className='w-16 h-16 bg-gradient-to-br from-blue-100 to-yellow-50 rounded-lg animate-pulse border border-gray-200' />
                ))}
              </div>
              <div className='bg-gradient-to-br from-blue-100 to-yellow-50 h-48 rounded-2xl animate-pulse border-2 border-gray-200' />
            </div>
            <div className='space-y-4'>
              <div className='h-8 w-48 bg-gradient-to-r from-blue-100 to-yellow-100 rounded animate-pulse' />
              <div className='h-4 w-full bg-gradient-to-r from-blue-50 to-yellow-50 rounded animate-pulse' />
              <div className='h-4 w-3/4 bg-gradient-to-r from-blue-50 to-yellow-50 rounded animate-pulse' />
              <div className='bg-gradient-to-br from-blue-100 to-yellow-50 h-32 rounded-xl animate-pulse border-2 border-gray-200' />
              <div className='bg-gradient-to-br from-blue-100 to-yellow-50 h-64 rounded-xl animate-pulse border-2 border-gray-200' />
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  if (!producto) return null

  const imagenes = producto.imagen_url 
    ? (Array.isArray(producto.imagen_url) ? producto.imagen_url : producto.imagen_url.split(',').map(img => img.trim()).filter(Boolean))
    : ['/bodega-img.jpg']

  return (
    <div className='min-h-screen bg-gray-50 pb-20 md:pb-8 overflow-x-hidden' style={{ backgroundColor: '#f8fafc' }}>
      <Header />

      <main className='w-full mx-auto px-3 md:px-6 py-4 md:py-6 max-w-7xl'>
        <nav className='flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6 overflow-hidden'>
          <button onClick={() => router.push('/pisos')} className='hover:text-yellow-400 transition flex-shrink-0'>
            {esCeramico ? 'Pisos' : 'Productos'}
          </button>
          <span className='flex-shrink-0'>/</span>
          <span className='font-semibold truncate' style={{ color: '#00162f' }}>
            {producto.nombre_completo || producto.nombre}
          </span>
        </nav>

        <div className='grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 md:gap-8 lg:gap-6 mb-8'>
          
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-3 lg:space-y-4 max-w-full overflow-hidden">
            {/* Galería */}
            <div className='relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100 w-full max-w-2xl mx-auto'>
              <div className='w-full aspect-square'>
                <img
                  src={imagenes[currentImg]}
                  alt={producto.nombre_completo || producto.nombre}
                  className='w-full h-full object-contain cursor-zoom-in'
                  onClick={() => setShowImageModal(true)}
                />
              </div>
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
              <div className='flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide w-full'>
                {imagenes.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImg(idx)}
                    className={`shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-16 lg:h-16 rounded-lg overflow-hidden border-2 transition ${
                      idx === currentImg ? 'border-yellow-400' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className='w-full h-full object-cover' />
                  </button>
                ))}
              </div>
            )}

            {/* Especificaciones Técnicas */}
            {esCeramico && (
              <div className='bg-gray-200 rounded-2xl p-4 shadow-sm border border-gray-100 w-full overflow-hidden'>
                <h2 className='text-center text-lg lg:text-xl font-black mb-2' style={{ color: '#00162f' }}>
                  Especificaciones Técnicas
                </h2>
                
                {producto.linea === 'Decorados' ? (
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4'>
                    {producto.coleccion && (
                      <div className='flex flex-col items-center p-2 bg-white rounded-lg min-w-0'>
                        <span className='text-[8px] uppercase text-gray-500 truncate w-full text-center'>Colección</span>
                        <span className='text-xs font-bold text-blue-900 text-center truncate w-full'>{producto.coleccion}</span>
                      </div>
                    )}
                    {producto.formato && (
                      <div className='flex flex-col items-center p-2 bg-white rounded-lg min-w-0'>
                        <span className='text-[8px] uppercase text-gray-500 truncate w-full text-center'>Formato</span>
                        <span className='text-xs font-bold text-blue-900 text-center truncate w-full'>{producto.formato}</span>
                      </div>
                    )}
                    {producto.acabado && (
                      <div className='flex flex-col items-center p-2 bg-white rounded-lg min-w-0'>
                        <span className='text-[8px] uppercase text-gray-500 truncate w-full text-center'>Acabado</span>
                        <span className='text-xs font-bold text-blue-900 text-center truncate w-full'>{producto.acabado}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='grid grid-cols-2 lg:grid-cols-3 gap-10'>
                    {[
                      { label: 'Cuerpo', value: producto.cuerpo },
                      { label: 'Resistencia (PEI)', value: producto.pei },
                      { label: 'Formato', value: producto.formato },
                      { label: 'Acabado', value: producto.acabado },
                      { label: 'm² x Caja', value: producto.m2_por_caja },
                    ].map((item, i) => (
                      <div key={i} className='flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-2 lg:py-2.5 border-b border-gray-50 min-w-0'>
                        <span className='text-xs text-gray-500 font-medium truncate'>{item.label}</span>
                        <span className='text-xs font-bold truncate' style={{ color: '#00162f' }}>
                          {item.value || 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Carrusel de productos sugeridos */}
            {productosSugeridos.length > 0 && (
              <div className='rounded-2xl p-4 shadow-sm border border-gray-100 bg-yellow-50 w-full overflow-hidden'>
                <h2 className='text-center text-lg lg:text-xl font-black mb-4' style={{ color: '#00162f' }}>
                  También te puede interesar
                </h2>
                <Carrusel 
                  items={productosSugeridos} 
                  size='large' 
                  onItemClick={(item) => router.push(`/pisos/${item.id}`)} 
                />
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-3 lg:space-y-3 max-w-full overflow-hidden">
            {producto.coleccion && (
              <span className='inline-block bg-yellow-400 text-[9px] lg:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full truncate max-w-full' style={{ color: '#00162f' }}>
                {producto.coleccion}
              </span>
            )}

            <h1 className='text-xl md:text-3xl lg:text-2xl font-black leading-tight break-words' style={{ color: '#00162f' }}>
              {producto.nombre_completo || producto.nombre}
            </h1>

            {producto.descripcion && (
              <p className='text-sm lg:text-base text-justify text-gray-600 leading-snug break-words'>
                {producto.descripcion}
              </p>
            )}

            {producto.uso && producto.uso.length > 0 && (
              <div className='block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 overflow-hidden'>
                <div className='flex items-center gap-3 p-2 border-b border-gray-100 flex-wrap'>
                  <h2 className='text-lg font-black text-gray-500 flex-shrink-0'>Áreas de Uso</h2>
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
                        <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0'>
                          {icon}
                        </div>
                      ))
                    }
                    return icons.map((icon, idx) => (
                      <div key={idx} className='text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0'>
                        {icon}
                      </div>
                    ))
                  })()}
                </div>
              </div>
            )}

            <div className='bg-white rounded-xl p-3 lg:p-4 border border-gray-100 shadow-sm overflow-hidden'>
              <div className='flex items-baseline gap-2 flex-wrap'>
                <span className='text-2xl lg:text-3xl font-black' style={{ color: '#00162f' }}>
                  ${Number(producto.precio).toFixed(2)}
                </span>
                {producto.precio_anterior && (
                  <span className='text-sm text-gray-400 line-through'>
                    ${Number(producto.precio_anterior).toFixed(2)}
                  </span>
                )}
              </div>
              {esCeramico && !esDecoradoLineal && !esDecoradoMalla ? (
                <p className='text-[10px] lg:text-xs text-gray-500 truncate'>
                  {producto.m2_por_caja} m²/caja • {producto.piezas_por_caja} pzs
                </p>
              ) : (
                <p className='text-[10px] lg:text-xs text-gray-500'>Precio por pieza</p>
              )}
            </div>

            {/* Atributos rápidos */}
            {esCeramico && !esDecoradoLineal && !esDecoradoMalla && (
              <div className='grid grid-cols-3 gap-2 overflow-hidden'>
                {[
                  { label: 'Formato', value: producto.formato },
                  { label: 'Acabado', value: producto.acabado },
                  { label: 'PEI', value: producto.pei || 'N/A' }
                ].map((attr, i) => (
                  <div key={i} className='bg-gray-50 rounded-lg p-2 border border-gray-100 min-w-0'>
                    <p className='text-[8px] lg:text-[9px] uppercase font-bold text-gray-400 mb-0.5 truncate'>
                      {attr.label}
                    </p>
                    <p className='text-[10px] lg:text-xs font-bold truncate' style={{ color: '#00162f' }}>
                      {attr.value || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* BLOQUE DE ACCIÓN */}
            {esDecoradoLineal ? (
              <div className='rounded-xl p-3 lg:p-4 border-2 overflow-hidden' style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='bg-yellow-400 p-1.5 rounded-lg flex-shrink-0'>
                    <Calculator className='w-4 h-4 lg:w-4 lg:h-4' style={{ color: '#00162f' }} />
                  </div>
                  <h3 className='text-sm lg:text-base font-black text-white truncate'>
                    Calcula Piezas
                  </h3>
                </div>
                <div className='space-y-2.5'>
                  <div>
                    <label className='block text-[9px] font-bold text-yellow-400 mb-1 uppercase'>
                      Ancho del muro (m)
                    </label>
                    <input
                      type='number'
                      step='0.01'
                      min='0'
                      value={anchoMuro}
                      onChange={(e) => setAnchoMuro(e.target.value)}
                      placeholder='2.5'
                      className='w-full px-2 py-1.5 border-2 border-gray-600 rounded-lg font-bold text-xs bg-gray-800 text-white focus:border-yellow-400 focus:outline-none transition-colors'
                    />
                  </div>
                  <button
                    onClick={calcularDecorados}
                    disabled={!anchoMuro}
                    className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2'
                    style={{ color: '#00162f' }}
                  >
                    <Calculator className='w-4 h-4' />
                    Calcular
                  </button>
                  {piezasDecoradoNecesarias !== null && (
                    <div className='bg-white rounded-lg p-3 animate-in fade-in zoom-in duration-300 overflow-hidden'>
                      <div className='flex items-center justify-between mb-2.5 gap-2'>
                        <div className='min-w-0'>
                          <p className='text-[9px] text-gray-500 mb-0.5'>Piezas necesarias</p>
                          <p className='text-2xl font-black flex items-center gap-1.5 truncate' style={{ color: '#00162f' }}>
                            <Package className='w-5 h-5 flex-shrink-0' />
                            {piezasDecoradoNecesarias}
                          </p>
                        </div>
                        <div className='text-right flex-shrink-0'>
                          <p className='text-[9px] text-gray-500 mb-0.5'>Stock</p>
                          <p className={`text-lg font-black ${
                            producto.stock >= piezasDecoradoNecesarias ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {producto.stock}
                          </p>
                        </div>
                      </div>
                      {cajasDecoradoNecesarias && (
                        <p className='text-xs text-gray-600 mb-2 truncate'>
                          Equivale a {cajasDecoradoNecesarias} caja{cajasDecoradoNecesarias !== 1 ? 's' : ''}
                        </p>
                      )}
                      {producto.stock >= piezasDecoradoNecesarias ? (
                        <button
                          onClick={handleAddDecoradoToCart}
                          disabled={addingToCart}
                          className='w-full bg-yellow-400 hover:bg-yellow-500 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-gray-400 truncate'
                          style={{ color: '#00162f' }}
                        >
                          <ShoppingCart className='w-4 h-4 flex-shrink-0' />
                          <span className='truncate'>{addingToCart ? 'Agregando...' : `Agregar ${cajasDecoradoNecesarias || piezasDecoradoNecesarias}`}</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleWhatsApp(producto.nombre, piezasDecoradoNecesarias, producto.stock, 'piezas')}
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
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : esCeramico && !esDecoradoMalla ? (
              // Calculadora para pisos/azulejos
              <div className='rounded-xl p-3 lg:p-4 border-2 overflow-hidden' style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
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
                            onClick={() => handleWhatsApp(producto.nombre, cajasNecesarias, producto.stock, 'cajas')}
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

                {/* //* COMPLEMENTOS */}
                {areaTotal && (
                  <div className='mt-6 space-y-6 overflow-hidden'>
                  

                    {/* //& PEGAMENTO (sin cambios) */}
                    {productosPegamento.length > 0 && (
                      <div className='bg-white rounded-xl p-4 border border-gray-200 shadow-sm overflow-hidden'>
                        <h4 className='text-sm font-bold text-gray-800 mb-2'>Complementa con Pegamento</h4>
                        <p className='text-xs text-gray-600 mb-3'>
                          Recomendado: <span className='font-bold text-blue-900'>{cantidadPegamento}</span> unidad{cantidadPegamento !== '1' ? 'es' : ''} (1 por cada 4 m²)
                        </p>
                        <Carrusel 
                          items={productosPegamento} 
                          size='small' 
                          onItemClick={(item) => router.push(`/pisos/${item.id}`)} 
                        />
                        {!mostrarOpcionesPegamento ? (
                          <button
                            onClick={() => setMostrarOpcionesPegamento(true)}
                            className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-xs transition mt-3'
                          >
                            Elegir Pegamento
                          </button>
                        ) : (
                          <div className='space-y-3 mt-3 border-t pt-3'>
                            <select
                              className={`w-full p-2 border-2 rounded-lg text-sm transition-colors ${
                                pegamentoSeleccionado ? 'border-green-500' : 'border-red-500'
                              }`}
                              value={pegamentoSeleccionado?.id?.toString() || ''}
                              onChange={(e) => {
                                const id = e.target.value;
                                if (id) {
                                  const prod = productosPegamento.find(p => p.id === Number(id));
                                  setPegamentoSeleccionado(prod);
                                } else {
                                  setPegamentoSeleccionado(null);
                                }
                              }}
                            >
                              <option value=''>Selecciona tipo</option>
                              {productosPegamento.map(p => (
                                <option key={p.id} value={p.id.toString()}>
                                  {p.acabado} {p.nombre}
                                </option>
                              ))}
                            </select>

                            {/* Bloque de stock para Pegamento */}
                            {pegamentoSeleccionado && (
                              <div className='flex items-center justify-between mb-2.5'>
                                <div>
                                  <p className='text-[9px] text-gray-500 mb-0.5'>Necesario</p>
                                  <p className='text-2xl font-black flex items-center gap-1.5' style={{ color: '#00162f' }}>
                                    <Package className="w-5 h-5" />
                                    {cantidadPegamento}
                                  </p>
                                </div>
                                <div className='text-right'>
                                  <p className='text-[9px] text-gray-500 mb-0.5'>Stock</p>
                                  <p className={`text-lg font-black ${
                                    pegamentoSeleccionado.stock >= parseInt(cantidadPegamento) ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {pegamentoSeleccionado.stock}
                                  </p>
                                </div>
                              </div>
                            )}

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
                              className='w-full p-2 border border-gray-300 rounded-lg text-sm'
                            />

                            {stockInsuficientePegamento ? (
                              <>
                                <button
                                  onClick={() => handleWhatsApp(pegamentoSeleccionado.nombre, cantidadPegamento, pegamentoSeleccionado.stock, 'unidades')}
                                  className='w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg text-sm mb-2'
                                >
                                  <MessageCircle className="w-4 h-4 inline mr-2" />
                                  Consultar por WhatsApp
                                </button>
                                <p className='text-xs text-red-600 text-center'>Stock insuficiente. Contáctanos.</p>
                              </>
                            ) : (
                              <button
                                onClick={() => handleAddComplemento(pegamentoSeleccionado, cantidadPegamento)}
                                disabled={!pegamentoSeleccionado || addingToCart}
                                className='w-full bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-500 disabled:bg-gray-300 transition'
                              >
                                Agregar al carrito
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}


                      {/* //& JUNTEADOR - usando filtro */}
                    {productosJunteadorFiltrados.length > 0 && (
                      <div className='bg-white rounded-xl p-4 border border-gray-200 shadow-sm overflow-hidden'>
                        <h4 className='text-sm font-bold text-gray-800 mb-2'>Complementa con Junteador</h4>
                        <p className='text-xs text-gray-600 mb-3'>
                          Recomendado: <span className='font-bold text-blue-900'>{cantidadJunteador}</span> unidad{cantidadJunteador !== '1' ? 'es' : ''} (1 por cada 12 m²)
                        </p>
                        <Carrusel 
                          items={productosJunteadorFiltrados} 
                          size='small' 
                          onItemClick={(item) => router.push(`/pisos/${item.id}`)} 
                        />
                        {!mostrarOpcionesJunteador ? (
                          <button
                            onClick={() => setMostrarOpcionesJunteador(true)}
                            className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-xs transition mt-3'
                          >
                            Elegir Junteador
                          </button>
                        ) : (
                          <div className='space-y-3 mt-3 border-t pt-3'>
                            <select
                              className={`w-full p-2 border-2 rounded-lg text-sm transition-colors ${
                                junteadorSeleccionado ? 'border-green-500' : 'border-red-500'
                              }`}
                              value={junteadorSeleccionado?.id?.toString() || ''}
                              onChange={(e) => {
                                const id = e.target.value;
                                if (id) {
                                  const prod = productosJunteadorFiltrados.find(p => p.id === Number(id));
                                  setJunteadorSeleccionado(prod);
                                } else {
                                  setJunteadorSeleccionado(null);
                                }
                                setColorSeleccionado('');
                              }}
                            >
                              <option value=''>Selecciona tipo</option>
                              {productosJunteadorFiltrados.map(p => (
                                <option key={p.id} value={p.id.toString()}>
                                  {p.acabado} {p.formato ? `- ${p.formato}` : ''}
                                </option>
                              ))}
                            </select>

                            {/* Bloque de stock para Junteador */}
                            {junteadorSeleccionado && (
                              <div className='flex items-center justify-between mb-2.5'>
                                <div>
                                  <p className='text-[9px] text-gray-500 mb-0.5'>Necesario</p>
                                  <p className='text-2xl font-black flex items-center gap-1.5' style={{ color: '#00162f' }}>
                                    <Package className="w-5 h-5" />
                                    {cantidadJunteador}
                                  </p>
                                </div>
                                <div className='text-right'>
                                  <p className='text-[9px] text-gray-500 mb-0.5'>Stock</p>
                                  <p className={`text-lg font-black ${
                                    junteadorSeleccionado.stock >= parseInt(cantidadJunteador) ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {junteadorSeleccionado.stock}
                                  </p>
                                </div>
                              </div>
                            )}

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
                              className='w-full p-2 border border-gray-300 rounded-lg text-sm'
                            />

                            {stockInsuficienteJunteador ? (
                              <>
                                <button
                                  onClick={() => handleWhatsApp(junteadorSeleccionado.nombre, cantidadJunteador, junteadorSeleccionado.stock, 'unidades')}
                                  className='w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg text-sm mb-2'
                                >
                                  <MessageCircle className="w-4 h-4 inline mr-2" />
                                  Consultar por WhatsApp
                                </button>
                                <p className='text-xs text-red-600 text-center'>
                                  El Stock es {junteadorSeleccionado.stock}, insuficiente. Contáctanos.
                                </p>
                              </>
                            ) : (
                              <button
                                onClick={() => handleAddComplemento(junteadorSeleccionado, cantidadJunteador, colorSeleccionado)}
                                disabled={!junteadorSeleccionado || (junteadorSeleccionado.formato && !colorSeleccionado) || addingToCart}
                                className='w-full bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-500 disabled:bg-gray-300 transition'
                              >
                                Agregar al carrito
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </div>
            ) : (
              // Bloque simple para productos generales (junteadores, pegamentos, etc.)
              <div className='rounded-xl p-3 lg:p-4 border-2 overflow-hidden' style={{ backgroundColor: '#00162f', borderColor: '#00162f' }}>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='bg-yellow-400 p-1.5 rounded-lg shrink-0'>
                    <ShoppingCart className='w-4 h-4 lg:w-4 lg:h-4' style={{ color: '#00162f' }} />
                  </div>
                  <h3 className='text-sm lg:text-base font-black text-white truncate'>
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
                  {stockInsuficienteSimple ? (
                    <>
                      <button
                        onClick={() => handleWhatsApp(producto.nombre, cantidadSimple, producto.stock, 'unidades')}
                        className='w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-black text-xs lg:text-sm flex items-center justify-center gap-2 transition-all active:scale-95'
                      >
                        <MessageCircle className="w-4 h-4" />
                        Consultar por WhatsApp
                      </button>
                      <p className='text-xs text-red-400 text-center'>Stock insuficiente. Contáctanos para más información.</p>
                    </>
                  ) : (
                    <button
                      onClick={handleAddSimpleToCart}
                      disabled={addingToCart}
                      className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2 truncate'
                      style={{ color: '#00162f' }}
                    >
                      <span className='truncate'>{addingToCart ? 'Agregando...' : 'Agregar al carrito'}</span>
                    </button>
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