// app/pisos/[nombre]/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { 
  ShoppingCart, 
  X, ChevronLeft, ChevronRight,
  Calculator, MessageCircle, Package, AlertTriangle, Home,
  Bath, ShowerHead, Bed, Sofa, UtensilsCrossed, Warehouse, Trees
} from 'lucide-react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { useAuth } from '@/context/authContext'

export default function PisoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, updateCartCount } = useAuth()
  
  const [piso, setPiso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImg, setCurrentImg] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)

  // Estados calculadora
  const [ancho, setAncho] = useState('')
  const [largo, setLargo] = useState('')
  const [incluirExtra, setIncluirExtra] = useState(true)
  const [cajasNecesarias, setCajasNecesarias] = useState(null)
  const [areaTotal, setAreaTotal] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (params.nombre) {
      fetchPiso()
    }
  }, [params.nombre])

  const fetchPiso = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/pisos/${params.nombre}`)
      
      if (!res.ok) throw new Error('No encontrado')

      const data = await res.json()
      setPiso(data)
    } catch (error) {
      console.error(error)
      toast.error('Piso no encontrado')
      router.push('/pisos')
    } finally {
      setLoading(false)
    }
  }

  const calcularCajas = () => {
    const anchoNum = parseFloat(ancho)
    const largoNum = parseFloat(largo)

    if (!anchoNum || !largoNum || anchoNum <= 0 || largoNum <= 0) {
      toast.error('Ingresa medidas válidas mayores a 0')
      return
    }

    if (!piso.m2_por_caja || piso.m2_por_caja <= 0) {
      toast.error('Este producto no tiene información de m² por caja')
      return
    }

    let area = anchoNum * largoNum
    
    if (incluirExtra) {
      area = area * 1.1
    }

    setAreaTotal(area)
    const cajas = Math.ceil(area / piso.m2_por_caja)
    setCajasNecesarias(cajas)

    toast.success(`📦 Necesitas ${cajas} caja${cajas !== 1 ? 's' : ''}`)
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

    if (cajasNecesarias > piso.stock) {
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
          pisoId: piso.id,
          cantidad: cajasNecesarias
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`${cajasNecesarias} caja${cajasNecesarias !== 1 ? 's' : ''} agregada${cajasNecesarias !== 1 ? 's' : ''}`)
        await updateCartCount()
        
        setAncho('')
        setLargo('')
        setCajasNecesarias(null)
        setAreaTotal(null)
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
      `Hola! Necesito ${cajasNecesarias} cajas de *${piso.nombre_completo || piso.nombre}* (SKU: ${piso.sku}).\n\n` +
      `Stock disponible: ${piso.stock} cajas\n` +
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

  if (!piso) return null

  const imagenes = piso.imagen_url 
    ? piso.imagen_url.split(',').map(img => img.trim()).filter(Boolean)
    : ['/placeholder.jpg']

  const stockInsuficiente = cajasNecesarias && cajasNecesarias > piso.stock

  return (
    <div className='min-h-screen bg-gray-50 pb-20 md:pb-8' style={{ backgroundColor: '#f8fafc' }}>
      <Header />

      <main className='container mx-auto px-3 md:px-6 py-4 md:py-6'>
        {/* Breadcrumb */}
        <nav className='flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6'>
          <button onClick={() => router.push('/pisos')} className='hover:text-yellow-400 transition'>
            Pisos
          </button>
          <span>/</span>
          <span className='font-semibold truncate' style={{ color: '#00162f' }}>
            {piso.nombre_completo || piso.nombre}
          </span>
        </nav>

        <div className='grid lg:grid-cols-[1fr_400px] gap-6 md:gap-8 lg:gap-6 mb-8'>
          
          
          {/* COLUMNA IZQUIERDA: Áreas de uso + Galería */}
          <div className="space-y-3 lg:space-y-4">
          

            {/* Galería */}
            <div className='relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100'>
              <img
                src={imagenes[currentImg]}
                alt={piso.nombre_completo || piso.nombre}
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
        
            {/* //! ESPECIFICACIONES */}
            <div className='bg-gray-200 rounded-2xl p-4 shadow-sm border border-gray-100 mx-auto'>
              <h2 className='text-lg lg:text-xl font-black mb-2' style={{ color: '#00162f' }}>
                Especificaciones Técnicas
              </h2>
              <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8'>
                {[
                  { label: 'Cuerpo', value: piso.cuerpo },
                  { label: 'Absorción', value: piso.absorcion },
                  { label: 'Resistencia flexión', value: piso.resistencia_flexion },
                  { label: 'Rectificado', value: piso.rectificado ? 'Sí' : 'No' },
                  { label: 'Piezas x Caja', value: piso.piezas_por_caja },
                  { label: 'm² x Caja', value: piso.m2_por_caja },
                  { label: 'KG x Caja', value: piso.kg_por_caja ? `${piso.kg_por_caja} kg` : 'N/A' },
                  { label: 'Tecnología', value: piso.tecnologia || 'N/A' },
                  // { label: 'Stock', value: `${piso.stock} cajas` }
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

          </div>

          {/* COLUMNA DERECHA: Info compacta + Calculadora */}
          {/* <div className="lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 space-y-3 lg:space-y-3"> */}
          <div className="lg:pr-2 space-y-3 lg:space-y-3">
            {/* Colección */}
            {piso.coleccion && (
              <span className='inline-block bg-yellow-400 text-[9px] lg:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full' style={{ color: '#00162f' }}>
                {piso.coleccion}
              </span>
            )}

            {/* Título */}
            <h1 className='text-xl md:text-3xl lg:text-2xl font-black leading-tight' style={{ color: '#00162f' }}>
              {piso.nombre_completo || piso.nombre}
            </h1>

            {/* Descripción */}
            {piso.descripcion && (
              <p className='text-sm lg:text-base text-justify text-gray-600 leading-snug'>
                {piso.descripcion}
              </p>
            )}

            
            {/* //& Áreas de uso */}
            {piso.uso && piso.uso.length > 0 && (
              <div className='block bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
                    {/*//& Iconos de áreas de uso */}
                
                <div className='flex items-center gap-3 p-2 border-b border-gray-100'>
                  <h2 className='text-lg font-black text-gray-500'>Áreas de Uso </h2>
                  {/* Mapeo de área a icono */}
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

                    // Si no encuentra coincidencia exacta, muestra iconos genéricos
                    const usedAreas = piso.uso || []
                    const icons = usedAreas.map(area => iconMap[area] || null).filter(Boolean)

                    
                    // Si no hay iconos específicos, mostrar set básico
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
                
                {/* Header con nombre */}
                <div className='mb-3'>
              
                  <div className='space-y-0.5 text-xs text-gray-600'>
                    <p>{piso.estilo}</p>
                    <p>{piso.aplicacion}</p>
                    <p>{piso.cuerpo}</p>
                  </div>
                
                </div>

              </div>
            )}


            {/* Precio */}
            <div className='bg-white rounded-xl p-3 lg:p-4 border border-gray-100 shadow-sm'>
              <div className='flex items-baseline gap-2 mb-1'>
                <span className='text-2xl lg:text-3xl font-black' style={{ color: '#00162f' }}>
                  ${Number(piso.precio).toFixed(2)}
                </span>
                <span className='text-xs text-gray-400 font-medium'>m²</span>
              </div>
              <p className='text-[10px] lg:text-xs text-gray-500'>
                {piso.m2_por_caja} m²/caja • {piso.piezas_por_caja} pzs
              </p>
            </div>

            {/* Atributos */}
            <div className='grid grid-cols-3 gap-2'>
              {[
                { label: 'Formato', value: piso.formato },
                { label: 'Acabado', value: piso.acabado },
                { label: 'PEI', value: piso.pei || 'N/A' }
              ].map((attr, i) => (
                <div key={i} className='bg-gray-50 rounded-lg p-2 border border-gray-100'>
                  <p className='text-[8px] lg:text-[9px] uppercase font-bold text-gray-400 mb-0.5'>
                    {attr.label}
                  </p>
                  <p className='text-[10px] lg:text-xs font-bold' style={{ color: '#00162f' }}>
                    {attr.value}
                  </p>
                </div>
              ))}
            </div>

            {/* CALCULADORA COMPACTA */}
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
                {/* Inputs */}
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

                {/* Área */}
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

                {/* Checkbox */}
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

                {/* Botón Calcular */}
                <button
                  onClick={calcularCajas}
                  disabled={!ancho || !largo}
                  className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 py-2 rounded-lg font-black text-xs lg:text-sm transition-all active:scale-95 flex items-center justify-center gap-2'
                  style={{ color: '#00162f' }}
                >
                  <Calculator className="w-4 h-4" />
                  Calcular
                </button>

                {/* Resultado */}
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
                          piso.stock >= cajasNecesarias ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {piso.stock}
                        </p>
                      </div>
                    </div>

                    {/* Botón */}
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
            </div>

            {/* //! Botones secundarios */}
            {/* <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-gray-200 rounded-lg font-bold text-[10px] lg:text-xs hover:shadow-md transition-all" style={{ color: '#00162f' }}>
                <Download className="w-3.5 h-3.5" /> 
                Ficha
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-gray-200 rounded-lg font-bold text-[10px] lg:text-xs hover:shadow-md transition-all" style={{ color: '#00162f' }}>
                <Share2 className="w-3.5 h-3.5" /> 
                Compartir
              </button>
            </div> */}


          </div>

        </div>


      </main>

      {/* Modal */}
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