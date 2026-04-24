


// components/PromoBanner.jsx
'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function PromoBanner() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const banners = [
        {
            id: 1,
            image: 'https://media.istockphoto.com/id/636013786/photo/tile-samples-in-store.jpg?s=2048x2048&w=is&k=20&c=-u7j3lEY4vNwR585Al7XlItN4EcHy0HFgfi_bkRBVP0=', // Reemplaza con tus URLs

            alt: 'Ofertas Tecnológicas',
            title: '¡OFERTAS ESPECIALES!',
            desc: 'Hasta 50% de descuento en electrónica'
        },
        {
            id: 2,
            image: 'https://adventech-ferreteria.com/wp-content/uploads/2016/10/ferreteria.jpg',
            alt: 'Nueva Temporada',
            title: 'NUEVA COLECCIÓN',
            desc: 'Renueva tu hogar con estilo'
        },
        {
            id: 3,
            image: 'https://www.fierros.com.co/uploads/news-pictures/pphoto-1315.png',
            alt: 'Envío Gratis',
            title: 'ENVÍO GRATUITO',
            desc: 'En todas tus compras mayores a $50'
        }
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [banners.length])

    return (
        <div className='relative w-full h-40 sm:h-52 md:h-64 overflow-hidden rounded-2xl shadow-xl bg-gray-900'>
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {/* Imagen con Máscara de Transparencia Lateral */}
                    <div 
                        className="relative w-full h-full"
                        style={{
                            /* Máscara: Sólido al centro, transparente a los lados */
                            maskImage: 'linear-gradient(to right, transparent, black 50%, black 50%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 50%, black 50%, transparent)'
                        }}
                    >
                        <img
                            src={banner.image}
                            alt={banner.alt}
                            className="object-cover mx-auto"
                        />
                    </div>

                    {/* Overlay de texto (opcional: con sombra para legibilidad) */}
                    <div className='absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 bg-black/20'>
                        <h2 className='text-2xl md:text-4xl font-black drop-shadow-2xl mb-1 italic tracking-tighter'>
                            {banner.title}
                        </h2>
                        <p className='text-sm md:text-xl font-medium drop-shadow-md opacity-90'>
                            {banner.desc}
                        </p>
                    </div>
                </div>
            ))}

            {/* Indicadores Modernos */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20'>
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentSlide 
                            ? 'bg-white w-8 shadow-lg' 
                            : 'bg-white/40 w-2 hover:bg-white/60'
                        }`}
                        aria-label={`Ir al slide ${index + 1}`}
                        suppressHydrationWarning
                    />
                ))}
            </div>
        </div>
    )
}



