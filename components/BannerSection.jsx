// components/BannerSection.jsx
'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Timings
// ─────────────────────────────────────────────────────────────
const IMG_MS     = 3000   // ms por imagen en móvil
const IMGS_COUNT = 3      // imágenes por banner
const BANNER_MS  = IMG_MS * IMGS_COUNT  // 9 000 ms = 1 banner completo
const TICK_MS    = 50

// ─────────────────────────────────────────────────────────────
// Hook: detectar si es mobile (< 768 px)
// ─────────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// ─────────────────────────────────────────────────────────────
// Categorías que deben usar la vista detallada de /pisos/[id]
// ─────────────────────────────────────────────────────────────
const CATEGORIAS_VISTA_PISOS = [
  'pisos',
  'adhesivos y sus complementos',
  'fachaletas',
  'decorados'
]

// ─────────────────────────────────────────────────────────────
// Caché para banners de tipo categorías (no requieren batch)
// ─────────────────────────────────────────────────────────────
const CACHE_KEY = 'banners_categorias_cache'
const CACHE_EXPIRY = 10 * 60 * 1000 // 10 minutos

function getCachedCategorias() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_EXPIRY) return null
    return data
  } catch {
    return null
  }
}

function setCachedCategorias(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch (e) {
    console.warn('No se pudo guardar caché de banners', e)
  }
}

// ─────────────────────────────────────────────────────────────
// Carrusel de productos (con lógica de redirección según categoría)
// ─────────────────────────────────────────────────────────────
const Carrusel = ({ items, onItemClick }) => {
  const carouselRef            = useRef(null)
  const [showLeft, setShowLeft]   = useState(false)
  const [showRight, setShowRight] = useState(true)

  const scroll = (dir) => {
    if (!carouselRef.current || items.length === 0) return
    const w = (carouselRef.current.children[0]?.offsetWidth || 96) + 12
    carouselRef.current.scrollBy({ left: dir === 'left' ? -w : w, behavior: 'smooth' })
  }

  const checkScroll = () => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setShowLeft(scrollLeft > 5)
    setShowRight(scrollLeft < scrollWidth - clientWidth - 5)
  }

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [items])

  // Auto-advance cada 3.5 s
  useEffect(() => {
    if (!carouselRef.current || items.length === 0) return
    const interval = setInterval(() => {
      const el = carouselRef.current
      if (!el) return
      const { scrollLeft, scrollWidth, clientWidth } = el
      const w = (el.children[0]?.offsetWidth || 96) + 12
      if (scrollLeft >= scrollWidth - clientWidth - 5) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: w, behavior: 'smooth' })
      }
    }, 3500)
    return () => clearInterval(interval)
  }, [items])

  if (items.length === 0) return null

  return (
    <div className="relative w-full px-5">
      {showLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 md:w-8 md:h-8 bg-yellow-400 hover:bg-yellow-300 rounded-full shadow-lg flex items-center justify-center transition active:scale-90"
          style={{ color: '#00162f' }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      <div
        ref={carouselRef}
        className="flex gap-5 md:gap-7 overflow-x-auto snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => {
          const img      = item.imagen_url?.split(',')[0]?.trim() || '/bodega-img.jpg'
          const discount = item.precio_anterior && Number(item.precio_anterior) > Number(item.precio)
            ? Math.round((1 - Number(item.precio) / Number(item.precio_anterior)) * 100)
            : null
          // Decidir destino según categoría
          const destino = CATEGORIAS_VISTA_PISOS.includes(item.categoria?.toLowerCase())
            ? `/pisos/${item.id}`
            : `/producto/${item.codigo}`
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(destino)}
              className="flex-shrink-0 snap-start group flex flex-col items-center gap-1.5 w-[88px] md:w-[108px]"
            >
              <div className="relative w-[68px] h-[68px] md:w-[88px] md:h-[88px] rounded-full overflow-hidden border-[2.5px] border-gray-200 group-hover:border-yellow-400 transition-all duration-200 bg-white shadow-sm flex-shrink-0">
                <img
                  src={img}
                  alt={item.nombre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={e => { e.target.src = '/bodega-img.jpg' }}
                />
                {discount && (
                  <div className="absolute bottom-0 right-0 bg-yellow-400 text-[#00162f] text-[7px] font-black px-0.5 py-px rounded-tl-md leading-none">
                    -{discount}%
                  </div>
                )}
              </div>
              <p className="text-[9px] md:text-[10px] font-bold text-gray-700 text-center line-clamp-2 leading-tight w-full">
                {item.nombre}
              </p>
                 { item.peso_kg &&
                <p className='text-[9px] md:text-[10px] text-gray-700 line-clamp-2 leading-tight'>
                    Peso: {item.peso_kg} kg.
                </p>
                }
              <p className="text-[9px] md:text-[10px] font-black leading-none" style={{ color: '#00162f' }}>
                ${Number(item.precio).toFixed(2)}
              </p>
            </button>
          )
        })}
      </div>
      {showRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 md:w-8 md:h-8 bg-yellow-400 hover:bg-yellow-300 rounded-full shadow-lg flex items-center justify-center transition active:scale-90"
          style={{ color: '#00162f' }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
      <style jsx global>{`.snap-x::-webkit-scrollbar{display:none}`}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MOBILE: slider de imagen única
// ─────────────────────────────────────────────────────────────
function BannerMobileSlider({ banner, imgIndex, transitioning, onImageClick }) {
  const imgs        = banner.imagenesUrls || []
  const img         = imgs[imgIndex] || null
  const titulo      = banner.titulo      || ''
  const descripcion = banner.descripcion || ''
  const lineas      = descripcion.split('\n').filter(l => l.trim())
  const links       = banner.imagenesLinks || []
  const link        = links[imgIndex] || '#'

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gray-100">
      {img ? (
        <button
          onClick={() => onImageClick(link)}
          className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer"
        >
          <img
            src={img}
            alt={banner.categoria || 'banner'}
            className={`w-full h-full object-contain transition-opacity duration-500 ${
              transitioning ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </button>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#00162f] to-[#002a5c] flex items-center justify-center">
          <span className="text-white/30 text-xs">Sin imagen</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

      {(titulo || lineas.length > 0) && (
        <div
          className={`absolute inset-0 flex flex-col justify-end p-4 transition-all duration-500 pointer-events-none ${
            transitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          {titulo && (
            <p className="text-xl font-black text-white drop-shadow-xl leading-tight mb-1">
              {titulo}
            </p>
          )}
          {lineas.map((l, i) => (
            <p key={i} className="text-xs font-semibold text-white/90 drop-shadow leading-snug">
              {l}
            </p>
          ))}
        </div>
      )}

      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-400"
            style={{
              width:           i === imgIndex ? 24 : 8,
              backgroundColor: i === imgIndex ? '#fbbf24' : 'rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// DESKTOP: tríptico (con imágenes adaptadas y overlay degradado)
// ─────────────────────────────────────────────────────────────
function BannerTriptych({ banner, transitioning, onImageClick }) {
  const imgs   = banner.imagenesUrls || []
  const left   = imgs[0] || null
  const rtop   = imgs[1] || null
  const rbot   = imgs[2] || null
  const links  = banner.imagenesLinks || []
  const titulo = banner.titulo      || ''
  const descripcion = banner.descripcion || ''
  const lineas = descripcion.split('\n').filter(l => l.trim())

  return (
    <div
      className={`grid gap-2 rounded-2xl overflow-hidden w-full shadow-xl h-full transition-opacity duration-300 ${
        transitioning ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ gridTemplateColumns: '3fr 2fr' }}
    >
      {/* Izquierda - con overlay degradado de arriba a abajo */}
      <div className="relative overflow-hidden rounded-xl group bg-gray-100 flex items-center justify-center">
        {left ? (
          <button
            onClick={() => onImageClick(links[0] || '#')}
            className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer"
          >
            <img
              src={left}
              alt={banner.categoria || 'banner'}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </button>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#00162f] to-[#002a5c] flex items-center justify-center">
            <span className="text-white/30 text-xs">Sin imagen</span>
          </div>
        )}
        {/* Overlay: gradiente de arriba (transparente) hacia abajo (negro 65%) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-black/65 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none" />
        {(titulo || lineas.length > 0) && (
          <div className="absolute inset-0 flex flex-col justify-end p-5 transition-all duration-500 group-hover:translate-y-3 group-hover:opacity-0 pointer-events-none">
            {titulo && (
              <p className="text-xl lg:text-2xl font-black text-white drop-shadow-xl leading-tight mb-1">
                {titulo}
              </p>
            )}
            {lineas.map((l, i) => (
              <p key={i} className="text-sm font-semibold text-white/90 drop-shadow leading-snug">
                {l}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Derecha: 2 imágenes apiladas */}
      <div className="flex flex-col gap-2">
        {[rtop, rbot].map((img, i) => {
          const link = links[i + 1] || '#'
          return (
            <div key={i} className="relative flex-1 overflow-hidden rounded-xl group bg-gray-100 flex items-center justify-center">
              {img ? (
                <button
                  onClick={() => onImageClick(link)}
                  className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </button>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#00162f]/10 to-yellow-50 flex items-center justify-center">
                  <span className="text-gray-300 text-[10px]">Imagen {i + 2}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Skeleton (colores corporativos)
// ─────────────────────────────────────────────────────────────
function BannerSkeleton({ isMobile }) {
  return (
    <div className="w-full h-full flex flex-col gap-3 md:gap-4">
      <div className='bg-gradient-to-br from-blue-100 to-yellow-50 h-[50vh] md:h-96 rounded-2xl animate-pulse border-2 border-gray-200' />
      <div className="flex-1 min-h-0 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(135deg, #00162f 0%, #002a5c 65%, #00162f 100%)' }} />
        <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(to top, rgba(251,191,36,0.2) 0%, transparent 50%)', animationDelay: '120ms' }} />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {[24, 8, 8].map((w, i) => (
            <div key={i} className="h-1 rounded-full" style={{ width: w, backgroundColor: i === 0 ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.35)' }} />
          ))}
        </div>
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="h-5 rounded-lg animate-pulse w-3/4" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <div className="h-3 rounded-lg animate-pulse w-1/2" style={{ backgroundColor: 'rgba(255,255,255,0.10)' }} />
        </div>
      </div>
      <div className="h-[3px] w-full rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(0,22,47,0.08)' }}>
        <div className="h-full w-1/3 rounded-full animate-pulse" style={{ backgroundColor: 'rgba(251,191,36,0.45)' }} />
      </div>
      <div className="flex-shrink-0">
        <div className="inline-flex h-6 w-28 rounded-full animate-pulse" style={{ backgroundColor: 'rgba(0,22,47,0.15)' }} />
      </div>
      <div className="flex gap-3 md:gap-4 overflow-hidden flex-shrink-0 px-5 pb-1">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 w-[68px] md:w-[84px]">
            <div className="w-[52px] h-[52px] md:w-[68px] md:h-[68px] rounded-full animate-pulse" style={{ background: i % 2 === 0 ? 'linear-gradient(135deg, rgba(0,22,47,0.12) 0%, rgba(251,191,36,0.18) 100%)' : 'linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(0,22,47,0.10) 100%)', animationDelay: `${i * 75}ms` }} />
            <div className="h-2 rounded w-12 animate-pulse" style={{ backgroundColor: 'rgba(0,22,47,0.08)', animationDelay: `${i * 75}ms` }} />
            <div className="h-2 rounded w-8  animate-pulse" style={{ backgroundColor: 'rgba(251,191,36,0.30)', animationDelay: `${i * 75 + 40}ms` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Función para enriquecer un array de banners (solo categorías)
// (los banners de promoción/nuevos se enriquecen después con batch)
// ─────────────────────────────────────────────────────────────
function enrichCategoriasBanners(bannersRaw) {
  return bannersRaw.map(b => {
    if (b.tipo === 'categorias') {
      return {
        ...b,
        imagenesUrls: b.imagenes,
        imagenesLinks: b.imagenes.map(() => `/tienda?categoria=${encodeURIComponent(b.categoria)}`),
        productosRelacionados: null,
      }
    }
    return b
  })
}

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL BannerSection con caché local
// ─────────────────────────────────────────────────────────────
export default function BannerSection({ productos = [], tipo = null }) {
  const router = useRouter()
  const isMobile = useIsMobile()

  const [allBannersEnriched, setAllBannersEnriched] = useState([])
  const [loading, setLoading] = useState(true)
  const [bannerIndex, setBannerIndex] = useState(0)
  const [imgIndex, setImgIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const mobileImgTimer = useRef(null)
  const desktopTimer   = useRef(null)
  const progressTimer  = useRef(null)
  const hasFetched     = useRef(false)

  // ── Cargar desde caché al montar (solo banners de categorías) ──
  useEffect(() => {
    const cached = getCachedCategorias()
    if (cached && cached.length) {
      const enriched = enrichCategoriasBanners(cached)
      setAllBannersEnriched(enriched)
      setLoading(false)
    }
  }, [])

  // ── Obtener banners actualizados desde la API ──
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners')
        const bannersRaw = res.ok ? await res.json() : []
        const valid = bannersRaw.filter(b => b.imagenes?.length >= 3)

        // Separar banners de categorías (para cachear) y el resto
        const categoriasBanners = valid.filter(b => b.tipo === 'categorias')
        const otrosBanners = valid.filter(b => b.tipo !== 'categorias')

        // Guardar en caché los banners de categorías (sin enriquecer)
        if (categoriasBanners.length) {
          setCachedCategorias(categoriasBanners)
        }

        // Enriquecer banners de categorías (síncrono, sin batch)
        const enrichedCategorias = enrichCategoriasBanners(categoriasBanners)

        // Enriquecer banners de promoción/nuevos (necesitan batch)
        let enrichedOtros = []
        if (otrosBanners.length) {
          // Para cada banner de promoción/nuevos, hacer batch
          const enrichedPromises = otrosBanners.map(async (b) => {
            const codes = b.imagenes
            if (!codes.length) return { ...b, imagenesUrls: [], imagenesLinks: [], productosRelacionados: [] }
            const prodRes = await fetch('/api/productos/batch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ codes })
            })
            const { productos: prods } = await prodRes.json()
            const map = new Map(prods.map(p => [p.codigo, p]))
            const imagenesUrls = codes.map(code => map.get(code)?.imagen_url?.split(',')[0] || '/placeholder.jpg')
            const imagenesLinks = codes.map(code => {
              const prod = map.get(code)
              if (!prod) return '#'
              if (CATEGORIAS_VISTA_PISOS.includes(prod.categoria?.toLowerCase())) {
                return `/pisos/${prod.id}`
              } else {
                return `/producto/${code}`
              }
            })
            return {
              ...b,
              imagenesUrls,
              imagenesLinks,
              productosRelacionados: prods,
            }
          })
          enrichedOtros = await Promise.all(enrichedPromises)
        }

        const allEnriched = [...enrichedCategorias, ...enrichedOtros]

        setAllBannersEnriched(prev => {
          // Solo actualizar si realmente hay cambios (evita re-render innecesario)
          if (JSON.stringify(prev) !== JSON.stringify(allEnriched)) {
            return allEnriched
          }
          return prev
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  // Filtrar banners según el prop tipo (si se proporciona)
  const bannersEnriched = useMemo(() => {
    if (!tipo) return allBannersEnriched
    return allBannersEnriched.filter(b => b.tipo === tipo)
  }, [allBannersEnriched, tipo])

  // Avanzar banner
  const advanceBanner = useCallback(() => {
    if (bannersEnriched.length === 0) return
    setTransitioning(true)
    setTimeout(() => {
      setBannerIndex(i => (i + 1) % bannersEnriched.length)
      setImgIndex(0)
      setProgress(0)
      setTransitioning(false)
    }, 350)
  }, [bannersEnriched.length])

  // Limpiar timers
  const clearAll = () => {
    clearInterval(mobileImgTimer.current)
    clearInterval(desktopTimer.current)
    clearInterval(progressTimer.current)
  }

  // Iniciar timers según modo
  const startTimers = useCallback(() => {
    if (bannersEnriched.length === 0) return
    clearAll()

    if (isMobile) {
      let localImg = 0
      mobileImgTimer.current = setInterval(() => {
        localImg += 1
        if (localImg >= IMGS_COUNT) {
          localImg = 0
          advanceBanner()
        } else {
          setTransitioning(true)
          setTimeout(() => {
            setImgIndex(localImg)
            setTransitioning(false)
          }, 300)
        }
      }, IMG_MS)

      progressTimer.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) return 0
          return Math.min(p + (TICK_MS / IMG_MS) * 100, 100)
        })
      }, TICK_MS)
    } else {
      if (bannersEnriched.length > 1) {
        desktopTimer.current = setInterval(advanceBanner, BANNER_MS)
      }
      progressTimer.current = setInterval(() => {
        setProgress(p => Math.min(p + (TICK_MS / BANNER_MS) * 100, 100))
      }, TICK_MS)
    }
  }, [isMobile, bannersEnriched.length, advanceBanner])

  useEffect(() => {
    if (bannersEnriched.length === 0) return
    startTimers()
    return clearAll
  }, [isMobile, bannersEnriched.length, startTimers])

  const goToBanner = useCallback((idx) => {
    clearAll()
    setTransitioning(true)
    setTimeout(() => {
      setBannerIndex(idx)
      setImgIndex(0)
      setProgress(0)
      setTransitioning(false)
      startTimers()
    }, 300)
  }, [startTimers])

  const goPrev = () => goToBanner((bannerIndex - 1 + bannersEnriched.length) % bannersEnriched.length)
  const goNext = () => goToBanner((bannerIndex + 1) % bannersEnriched.length)

  const current = bannersEnriched[bannerIndex]
  if (!current) return null

  // Productos para el carrusel inferior
  let productosCategoria = []
  if (current.tipo === 'categorias') {
    productosCategoria = productos.filter(p =>
      p.categoria?.toLowerCase() === current.categoria?.toLowerCase() && Number(p.stock) > 0
    ).slice(0, 20)
  } else if (current.tipo === 'promocion' || current.tipo === 'productos nuevos') {
    productosCategoria = current.productosRelacionados || []
  }

  const handleImageClick = (url) => {
    if (url && url !== '#') router.push(url)
  }

  if (loading && bannersEnriched.length === 0) return <BannerSkeleton isMobile={isMobile} />

  return (
    <div className="w-full flex flex-col mb-[10%]" style={{ height: '80svh', minHeight: '480px' }}>
      <div className="flex-1 flex flex-col gap-3 md:gap-4 py-2 min-h-0">
        <div
          className="relative flex-1 min-h-0"
          style={{ minHeight: isMobile ? '40vw' : 'clamp(180px, 38vw, 420px)' }}
        >
          {isMobile ? (
            <div className="absolute inset-0">
              <BannerMobileSlider
                banner={{
                  ...current,
                  imagenesUrls: current.imagenesUrls,
                  imagenesLinks: current.imagenesLinks,
                }}
                imgIndex={imgIndex}
                transitioning={transitioning}
                onImageClick={handleImageClick}
              />
            </div>
          ) : (
            <div className="absolute inset-0">
              <BannerTriptych
                banner={{
                  ...current,
                  imagenesUrls: current.imagenesUrls,
                  imagenesLinks: current.imagenesLinks,
                }}
                transitioning={transitioning}
                onImageClick={handleImageClick}
              />
            </div>
          )}

          {bannersEnriched.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 shadow-md flex items-center justify-center transition active:scale-90 rounded-full ${
                  isMobile ? 'w-8 h-8 bg-white/70 hover:bg-white' : 'w-10 h-10 bg-white/85 hover:bg-white backdrop-blur-sm'
                }`}
                aria-label="Anterior"
              >
                <ChevronLeft size={isMobile ? 18 : 20} style={{ color: '#00162f' }} />
              </button>
              <button
                onClick={goNext}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 shadow-md flex items-center justify-center transition active:scale-90 rounded-full ${
                  isMobile ? 'w-8 h-8 bg-white/70 hover:bg-white' : 'w-10 h-10 bg-white/85 hover:bg-white backdrop-blur-sm'
                }`}
                aria-label="Siguiente"
              >
                <ChevronRight size={isMobile ? 18 : 20} style={{ color: '#00162f' }} />
              </button>

              {!isMobile && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                  {bannersEnriched.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToBanner(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === bannerIndex ? 20 : 8,
                        height: 8,
                        backgroundColor: i === bannerIndex ? '#fbbf24' : 'rgba(255,255,255,0.65)',
                      }}
                      aria-label={`Banner ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="h-[3px] w-full rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: 'rgba(0,22,47,0.08)' }}>
          <div
            className="h-full bg-yellow-400 rounded-full"
            style={{ width: `${progress}%`, transition: `width ${TICK_MS}ms linear` }}
          />
        </div>

        {isMobile && bannersEnriched.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 flex-shrink-0">
            {bannersEnriched.map((_, i) => (
              <button
                key={i}
                onClick={() => goToBanner(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === bannerIndex ? 20 : 7,
                  height: 7,
                  backgroundColor: i === bannerIndex ? '#fbbf24' : 'rgba(0,22,47,0.2)',
                }}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 flex-shrink-0 px-0.5">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white shadow-sm"
            style={{ backgroundColor: '#00162f' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
            {current.tipo === 'categorias' ? current.categoria : (current.tipo === 'promocion' ? 'Promociones' : 'Nuevos Productos')}
          </span>
          {productosCategoria.length > 0 && (
            <button
  onClick={() => {
    if (current.tipo === 'categorias') {
      router.push(`/tienda?categoria=${encodeURIComponent(current.categoria)}`)
    } else if (current.tipo === 'promocion') {
      router.push('/ofertas')
    } else {
      router.push('/tienda')
    }
  }}
  className="ml-auto text-[10px] md:text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
>
  Ver todos →
</button>
          )}
        </div>

        {productosCategoria.length > 0 && (
          <div className="flex-shrink-0 pb-2">
            <Carrusel
              items={productosCategoria}
              onItemClick={(url) => router.push(url)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
export { BannerSkeleton }