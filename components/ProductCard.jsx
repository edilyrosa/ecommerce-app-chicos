// components/ProductCard.jsx
'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext'; 
import toast from 'react-hot-toast';    
import Cookies from 'js-cookie';
import { Plus, Truck, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProductCard({ producto, onClick, isZoomed, onClose }) {
    const router = useRouter()
    const { user, updateCartCount } = useAuth()
    const [isFavorite, setIsFavorite] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [descripcionExpandida, setDescripcionExpandida] = useState(false)

    //* Separar las imágenes
    const imagenes = producto.imagen_url 
        ? producto.imagen_url.split(',').map(img => img.trim()).filter(img => img.length > 0)
        : []

    //* Carrusel automático
    useEffect(() => {
        if (imagenes.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % imagenes.length)
        }, 4000)

        return () => clearInterval(timer)
    }, [imagenes.length])

    //&por si en un futuro agregamos descuento
    const descuento = producto.precio_anterior 
        ? Math.round(((producto.precio_anterior - producto.precio) / producto.precio_anterior) * 100)
        : null

    const handleCompra = async (e) => {
        e.stopPropagation();
        if(!user){
            toast.error('Debes iniciar sesión')
            router.push('/login')
            return
        }
        if(producto.stock <= 0){
            toast.error('Producto sin stock')
            return
        }
        setIsAdding(true)
        try {
            const token = Cookies.get('token')
            const res = await fetch('api/carrito/agregar', {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({productoId: producto.id, cantidad: 1})
            })
            if(res.ok){
                toast.success('Producto añadido al carrito')
                await updateCartCount()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Error al agregar producto')
            }
        } catch(error) {
            toast.error('Error en la conexión')
        } finally {
            setIsAdding(false)
        }
    }

    const handleFavorite = (e) => {
        e.stopPropagation()
        setIsFavorite(!isFavorite)
        toast.success(isFavorite ? 'Eliminado de favoritos' : 'Añadido a favoritos')
    }

    const nextImage = (e) => {
        e.stopPropagation()
        if(imagenes.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % imagenes.length)
        }
    }

    const prevImage = (e) => {
        e.stopPropagation()
        if(imagenes.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length)
        }
    }

    const goToImage = (index, e) => {
        e.stopPropagation()
        setCurrentImageIndex(index)
    }

    const handleCardClick = (e) => {
        if (e.target.closest('button')) return;
        if (onClick) onClick();
    }

    const toggleDescripcion = (e) => {
        e.stopPropagation();
        setDescripcionExpandida(!descripcionExpandida);
    };

    // Función para truncar la descripción a 2 líneas y agregar "... ver más"
    const renderDescripcion = () => {
        if (!producto.descripcion) return null;

        if (descripcionExpandida) {
            return (
                <div className="relative text-justify">
                    {/* Descripción expandida con scroll */}
                    <div 
                        className="text-[9px] md:text-xs text-gray-500 pr-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                        style={{
                            maxHeight: '80px',
                            scrollbarWidth: 'thin',
                            msOverflowStyle: 'auto'
                        }}
                    >
                        {producto.descripcion}
                    </div>
                    {/* Botón "ver menos" */}
                    <button
                        onClick={toggleDescripcion}
                        className="text-[9px] md:text-xs text-blue-600 hover:text-blue-800 font-medium mt-1 focus:outline-none"
                    >
                        ver menos
                    </button>
                </div>
            );
        } else {
            // Versión colapsada: mostrar solo las primeras 2 líneas con "ver más"
            const palabras = producto.descripcion.split(' ');
            let lineas = [];
            let lineaActual = '';
            
            // Simular 2 líneas de texto (aproximadamente 70 caracteres por línea)
            for (let palabra of palabras) {
                if ((lineaActual + palabra).length < 70) {
                    lineaActual += (lineaActual ? ' ' : '') + palabra;
                } else {
                    lineas.push(lineaActual);
                    lineaActual = palabra;
                    if (lineas.length >= 2) break;
                }
            }
            if (lineas.length < 2 && lineaActual) {
                lineas.push(lineaActual);
            }

            const textoTruncado = lineas.join(' ');
            
            return (
                <div className="relative text-justify">
                    <p className="text-[9px] md:text-xs text-gray-500">
                        {textoTruncado}
                        {producto.descripcion.length > 140 && (
                            <>
                                <span>... </span>
                                <button
                                    onClick={toggleDescripcion}
                                    className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
                                >
                                    ver más
                                </button>
                            </>
                        )}
                    </p>
                </div>
            );
        }
    };

    return (
        <div 
            onClick={handleCardClick}
            className={`product-card-zoom ${isZoomed ? 'zoomed' : ''} relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group`}
        >
            {/* Botón cerrar - Solo visible cuando está en zoom */}
            {isZoomed && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-0 left-0 z-30 bg-red-500 hover:bg-red-600 text-white w-6 h-6 md:w-8 md:h-8 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
                    aria-label="Cerrar"
                >
                    <X />
                </button>
            )}

            {/* Badge de descuento */}
            {descuento && (
                <div className='absolute top-0 right-0 z-20 bg-yellow-400 text-gray-900 font-black text-[11px] md:text-sm px-2 py-0.5 md:py-1 rounded-full shadow-md'>
                    {descuento}%
                </div>
            )}

            {/* Botón de agregar al carrito */}
            <button 
                onClick={handleCompra}
                disabled={isAdding || producto.stock <= 0}
                className='absolute bottom-3 right-3 z-20 bg-[#003066] hover:bg-[#0055b7] text-white w-10 h-10 md:w-11 md:h-11 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
                {isAdding ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Plus size={20} strokeWidth={3} />
                )}
            </button>

            {/* Contenedor Carrusel de imágenes */}
            <div className='relative bg-white p-2 md:p-3 h-32 md:h-44 overflow-hidden'>
                {imagenes.length > 0 ? (
                    <>
                        <div className='relative w-full h-full'>
                            {imagenes.map((img, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    <img 
                                        src={img}
                                        alt={`${producto.nombre} - ${index + 1}`}
                                        className='w-full h-full object-contain mx-auto'
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                        
                        {imagenes.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className='absolute left-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-yellow-500 md:p-1 rounded-full shadow-lg transition'
                                >
                                    <ChevronLeft className="text-[#00162f]" />
                                </button>
                                
                                <button
                                    onClick={nextImage}
                                    className='absolute right-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-yellow-500 md:p-1 rounded-full shadow-lg transition'
                                >
                                    <ChevronRight className="text-[#00162f]" />
                                </button>

                                <div className='absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 z-10'>
                                    {imagenes.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => goToImage(idx, e)}
                                            className={`transition-all duration-300 rounded-full ${
                                                idx === currentImageIndex 
                                                    ? 'bg-blue-600 w-3 h-1' 
                                                    : 'bg-gray-300 w-1 h-1'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <span className="text-gray-400 text-xs italic">Sin imagen</span>
                    </div>
                )}
            </div>

            {/* Información del producto */}
            <div className='p-2.5 md:p-3 space-y-1.5'>
                {producto.categoria && (
                    <p className='text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                        {producto.categoria}
                    </p>
                )}

                <h3 className='text-[11px] md:text-sm font-bold text-gray-800 line-clamp-2 leading-tight'>
                    {producto.nombre}
                </h3>

                {/* Descripción con funcionalidad expandible */}
                <div className="min-h-[40px] md:min-h-[48px]">
                    {renderDescripcion()}
                </div>

                {/* Stock con colores de urgencia */}
                <div className='flex items-center gap-1.5'>
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

                {/* Precios y Envío */}
                <div className='flex flex-col pt-1'>
                    <div className='flex items-baseline gap-2'>
                        <span className='text-base md:text-lg font-black text-gray-900'>
                            ${Number(producto.precio).toLocaleString()}
                        </span>
                        {producto.precio_anterior && (
                            <span className='text-[10px] md:text-xs text-gray-400 line-through'>
                                ${Number(producto.precio_anterior).toLocaleString()}
                            </span>
                        )}
                    </div>
                    
                    <div className='flex items-center gap-1 text-[10px] text-green-600 font-bold mt-0.5'>
                        <Truck size={12} />
                        <span>Envío Express</span>
                    </div>
                </div>
            </div>

            {/* Botón favoritos (comentado) */}
            <button 
                onClick={handleFavorite}
                className='absolute bottom-3 left-3 transition-transform active:scale-125 z-10'
            >
            </button>

            {/* Estilos para el scroll personalizado */}
            <style jsx>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 20px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </div>
    )
}