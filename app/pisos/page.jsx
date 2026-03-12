'use client'
import { useState, useEffect, useMemo } from 'react'
import Header from '@/components/Header'
import PromoBanner from '@/components/PromoBanner'
import BottomNav from '@/components/BottomNav'
import ProductPiso from '@/components/ProductPiso'
import toast from 'react-hot-toast'
import { Filter } from 'lucide-react'

// Definir las líneas que consideramos "cerámicas" (ajusta según tu negocio)
const LINEAS_CERAMICAS = ['Pisos', 'Azulejos', 'Decorados', 'Pegamentos', 'Pastas']

export default function PisosPage() {
  const [productos, setProductos] = useState([])
  const [filteredProductos, setFilteredProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAcabado, setFilterAcabado] = useState('todos')
  const [filterCuerpo, setFilterCuerpo] = useState('todos')
  const [zoomedProductoId, setZoomedProductoId] = useState(null)
  const [category, setCategory] = useState('todas')

  // Obtener productos desde /api/productos
  const fetchProductos = async () => {
    try {
      const res = await fetch("/api/productos")
      if (res.ok) {
        const data = await res.json()
        // Filtrar solo los que están en las líneas cerámicas
        const ceramicos = data.filter(p => LINEAS_CERAMICAS.includes(p.linea))
        setProductos(ceramicos)
        setFilteredProductos(ceramicos)
      } else {
        toast.error('Error al cargar productos')
      }
    } catch (error) {
      toast.error('Error de conexión')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  // Filtrado combinado: búsqueda + acabado + cuerpo
  useEffect(() => {
    let filtered = productos

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.coleccion?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterAcabado !== 'todos') {
      filtered = filtered.filter(p => p.acabado === filterAcabado)
    }

    if (filterCuerpo !== 'todos') {
      filtered = filtered.filter(p => p.cuerpo === filterCuerpo)
    }

    setFilteredProductos(filtered)
  }, [searchTerm, productos, filterAcabado, filterCuerpo])

  // Opciones para filtros (solo valores que existen)
  const acabados = useMemo(() => 
    ['todos', ...new Set(productos.map(p => p.acabado).filter(Boolean))], 
    [productos]
  )
  const cuerpos = useMemo(() => 
    ['todos', ...new Set(productos.map(p => p.cuerpo).filter(Boolean))], 
    [productos]
  )

  const handleProductoClick = (id) => setZoomedProductoId(id)
  const handleCloseZoom = () => setZoomedProductoId(null)

  return (
    <div className='min-h-screen bg-gray-50 pb-20 md:pb-8'>
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        setCategory={setCategory} 
        currentCategory={category}
      />
      
      <div className="container mx-auto px-3 md:px-6">
        <div className="mt-3 md:mt-4 mb-4 md:mb-6">
          <PromoBanner />
        </div>
      </div>

      <main className='container mx-auto px-3 md:px-6'>
        <div className='mb-6'>
          <h1 className='text-2xl md:text-4xl font-black text-gray-800 mb-4'>
            Pisos y Azulejos
          </h1>

          <div className='flex flex-wrap gap-3 mb-4'>
            <div className='flex items-center gap-2'>
              <Filter size={18} className='text-blue-600' />
              <select
                value={filterCuerpo}
                onChange={(e) => setFilterCuerpo(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
              >
                {cuerpos.map(c => (
                  <option key={c} value={c}>
                    {c === 'todos' ? 'Todos los materiales' : c}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={filterAcabado}
              onChange={(e) => setFilterAcabado(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
            >
              {acabados.map(a => (
                <option key={a} value={a}>
                  {a === 'todos' ? 'Todos los acabados' : a}
                </option>
              ))}
            </select>
          </div>

          {!loading && (
            <p className='text-sm text-gray-600'>
              {filteredProductos.length} {filteredProductos.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
          )}
        </div>

        {/* Skeleton con colores corporativos */}
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='bg-white rounded-xl p-4 animate-pulse'>
                <div className='bg-gradient-to-br from-blue-100 to-yellow-50 h-64 rounded-lg mb-4'></div>
                <div className='bg-gradient-to-r from-blue-100 to-yellow-100 h-6 rounded mb-2 w-3/4'></div>
                <div className='bg-gradient-to-r from-blue-50 to-yellow-50 h-4 rounded w-2/3'></div>
                <div className='flex gap-2 mt-4'>
                  <div className='bg-gradient-to-r from-blue-100 to-yellow-100 h-4 rounded w-16'></div>
                  <div className='bg-gradient-to-r from-blue-100 to-yellow-100 h-4 rounded w-16'></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-md border border-blue-50">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
              <span className="text-2xl md:text-3xl">🔍</span>
            </div>
            <p className="text-base md:text-lg text-gray-600 mb-4 font-semibold">
              No se encontraron productos con el término: {searchTerm}
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
          <div className={`products-grid-zoom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10 ${zoomedProductoId ? 'has-zoomed' : ''}`}>
            {filteredProductos.map(producto => (
              <ProductPiso 
                key={producto.id} 
                producto={producto} 
                onClick={() => handleProductoClick(producto.id)}
                isZoomed={zoomedProductoId === producto.id}
                onClose={handleCloseZoom}
              />
            ))}
          </div>
        )}

        {zoomedProductoId && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-90 animate-fadeIn"
            onClick={handleCloseZoom}
          />
        )}
      </main>

      <BottomNav setCategory={setCategory} currentCategory={category} />

      <style jsx global>{`
        .products-grid-zoom.has-zoomed .product-piso-card:not(.zoomed) {
          transform: scale(0.95);
          opacity: 0.4;
          filter: blur(2px);
          pointer-events: none;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}