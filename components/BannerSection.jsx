// components/BannerSection.jsx
'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

/* ─────────────────────────────────────────────
   BANNER TYPE: TRIPTYCH
   Left: 1 tall image  |  Right: 2 stacked
───────────────────────────────────────────── */
function BannerTriptych({ banner }) {
  const imgs = banner.imagenes || []
  return (
    <div
      className="grid gap-2 rounded-2xl overflow-hidden w-full"
      style={{ gridTemplateColumns: '3fr 2fr', height: 'clamp(200px, 38vw, 380px)' }}
    >
      {/* Left — tall */}
      <div className="relative overflow-hidden rounded-xl group">
        {imgs[0] ? (
          <img
            src={imgs[0]}
            alt={banner.descripcion}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">Imagen principal</span>
          </div>
        )}
        {banner.descripcion && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent flex items-end p-4 md:p-6">
            <p className="text-white font-black text-sm md:text-xl leading-snug max-w-xs drop-shadow-lg">
              {banner.descripcion}
            </p>
          </div>
        )}
      </div>

      {/* Right — 2 stacked */}
      <div className="flex flex-col gap-2">
        {[imgs[1], imgs[2]].map((img, i) => (
          <div key={i} className="flex-1 relative overflow-hidden rounded-xl group">
            {img ? (
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-[10px]">Imagen {i + 2}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   BANNER TYPE: WIDE
   Full width, single image
───────────────────────────────────────────── */
function BannerWide({ banner }) {
  const img = banner.imagenes?.[0]
  return (
    <div
      className="w-full rounded-2xl overflow-hidden relative group"
      style={{ height: 'clamp(120px, 20vw, 240px)' }}
    >
      {img ? (
        <img
          src={img}
          alt={banner.descripcion}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Sin imagen</span>
        </div>
      )}
      {banner.descripcion && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent flex items-center px-6 md:px-12">
          <p className="text-white font-black text-lg md:text-3xl max-w-lg drop-shadow-xl leading-tight">
            {banner.descripcion}
          </p>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   BANNER TYPE: MOBILE
   ~80vh tall, single image
───────────────────────────────────────────── */
function BannerMobile({ banner }) {
  const img = banner.imagenes?.[0]
  return (
    <div
      className="w-full rounded-2xl overflow-hidden relative group"
      style={{ height: 'clamp(320px, 78vh, 680px)' }}
    >
      {img ? (
        <img
          src={img}
          alt={banner.descripcion}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Sin imagen</span>
        </div>
      )}
      {banner.descripcion && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent flex items-end p-6 md:p-10">
          <p className="text-white font-black text-2xl md:text-4xl max-w-sm drop-shadow-xl leading-tight">
            {banner.descripcion}
          </p>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   PRODUCT CAROUSEL
   Muestra productos de la categoría del banner
───────────────────────────────────────────── */
function ProductCarousel({ productos, categoria }) {
  const filtered = productos
    .filter(p =>
      p.categoria?.toLowerCase() === categoria?.toLowerCase() && Number(p.stock) > 0
    )
    .slice(0, 14)

  if (filtered.length === 0) return null

  const label = categoria
    ? categoria.charAt(0).toUpperCase() + categoria.slice(1)
    : 'Productos'

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-yellow-400" />
          <h2 className="text-[13px] md:text-base font-black" style={{ color: '#00162f' }}>
            {label} — Destacados
          </h2>
        </div>
        <Link
          href={`/tienda?categoria=${encodeURIComponent(categoria)}`}
          className="text-[11px] md:text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          Ver todos →
        </Link>
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filtered.map(p => {
          const img = p.imagen_url?.split(',')[0]?.trim() || '/placeholder.jpg'
          const descuento =
            p.precio_anterior && Number(p.precio_anterior) > Number(p.precio)
              ? Math.round((1 - Number(p.precio) / Number(p.precio_anterior)) * 100)
              : null

          return (
            <Link
              key={p.id}
              href={`/producto/${p.id}`}
              className="flex-shrink-0 w-32 md:w-40 group"
            >
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={img}
                    alt={p.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.src = '/placeholder.jpg' }}
                  />
                  {descuento && (
                    <div className="absolute top-1.5 left-1.5 bg-yellow-400 text-[#00162f] text-[9px] md:text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                      -{descuento}%
                    </div>
                  )}
                </div>
                <div className="p-2 md:p-2.5">
                  <p className="text-[10px] md:text-xs font-bold line-clamp-2 leading-tight mb-1" style={{ color: '#00162f' }}>
                    {p.nombre}
                  </p>
                  <p className="text-[11px] md:text-sm font-black" style={{ color: '#00162f' }}>
                    ${Number(p.precio).toFixed(2)}
                  </p>
                  {descuento && (
                    <p className="text-[9px] md:text-[10px] text-gray-400 line-through leading-none">
                      ${Number(p.precio_anterior).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* hide scrollbar cross-browser */}
      <style jsx>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN EXPORT: BannerSection
───────────────────────────────────────────── */
const INTERVAL_MS = 30_000
const TICK_MS     = 150

export default function BannerSection({ productos = [] }) {
  const [banners, setBanners]           = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading]           = useState(true)
  const [progress, setProgress]         = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const slideTimer    = useRef(null)
  const progressTimer = useRef(null)

  /* ── Fetch banners ── */
  useEffect(() => {
    fetch('/api/banners')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setBanners(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  /* ── Auto-rotation ── */
  const startTimers = useCallback((total) => {
    if (total <= 1) return
    clearInterval(slideTimer.current)
    clearInterval(progressTimer.current)

    progressTimer.current = setInterval(() => {
      setProgress(p => Math.min(p + (TICK_MS / INTERVAL_MS) * 100, 100))
    }, TICK_MS)

    slideTimer.current = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(i => (i + 1) % total)
        setProgress(0)
        setTransitioning(false)
      }, 300)
    }, INTERVAL_MS)
  }, [])

  useEffect(() => {
    if (banners.length > 1) startTimers(banners.length)
    return () => {
      clearInterval(slideTimer.current)
      clearInterval(progressTimer.current)
    }
  }, [banners.length, startTimers])

  /* ── Manual navigation ── */
  const goTo = useCallback((idx) => {
    setTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(idx)
      setProgress(0)
      setTransitioning(false)
    }, 250)
    // restart timers
    clearInterval(slideTimer.current)
    clearInterval(progressTimer.current)
    startTimers(banners.length)
  }, [banners.length, startTimers])

  const goPrev = () => goTo((currentIndex - 1 + banners.length) % banners.length)
  const goNext = () => goTo((currentIndex + 1) % banners.length)

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="space-y-4">
      <div className="w-full rounded-2xl bg-gray-200 animate-pulse" style={{ height: 'clamp(200px, 38vw, 380px)' }} />
      <div className="h-0.5 w-full bg-gray-200 rounded-full" />
      <div className="flex gap-3 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-32 md:w-40 h-48 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )

  if (banners.length === 0) return null

  const current = banners[currentIndex]

  return (
    <div className="space-y-4">
      {/* ── Banner wrapper ── */}
      <div className="relative">
        <div
          className="transition-opacity duration-300"
          style={{ opacity: transitioning ? 0 : 1 }}
        >
          {current.tipo === 'triptych' && <BannerTriptych banner={current} />}
          {current.tipo === 'wide'     && <BannerWide     banner={current} />}
          {current.tipo === 'mobile'   && <BannerMobile   banner={current} />}
        </div>

        {/* Prev / Next arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20
                         w-8 h-8 md:w-10 md:h-10 rounded-full
                         bg-white/80 hover:bg-white backdrop-blur-sm
                         shadow-md hover:shadow-lg
                         flex items-center justify-center
                         transition-all active:scale-95"
              aria-label="Anterior"
            >
              <ChevronLeft size={17} style={{ color: '#00162f' }} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20
                         w-8 h-8 md:w-10 md:h-10 rounded-full
                         bg-white/80 hover:bg-white backdrop-blur-sm
                         shadow-md hover:shadow-lg
                         flex items-center justify-center
                         transition-all active:scale-95"
              aria-label="Siguiente"
            >
              <ChevronRight size={17} style={{ color: '#00162f' }} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-5 h-2 bg-yellow-400 shadow-sm'
                    : 'w-2 h-2 bg-white/70 hover:bg-white'
                }`}
                aria-label={`Ir al banner ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {banners.length > 1 && (
        <div className="w-full h-[3px] bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 rounded-full transition-all"
            style={{ width: `${progress}%`, transitionDuration: `${TICK_MS}ms` }}
          />
        </div>
      )}

      {/* Category label chip */}
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest text-white shadow-sm"
          style={{ backgroundColor: '#00162f' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
          {current.categoria}
        </span>
      </div>

      {/* Product carousel for current banner's category */}
      <ProductCarousel productos={productos} categoria={current.categoria} />
    </div>
  )
}