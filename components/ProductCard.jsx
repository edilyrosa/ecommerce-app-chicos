// components/ProductCard.jsx
'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext'; 
import toast from 'react-hot-toast';    
import Cookies from 'js-cookie';
import { Plus, Truck, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProductCard({ producto, onClick, isZoomed, onClose }) { //*padre me dice si tiene zoom y cuando cerrarlo
    const router = useRouter()
    const { user, updateCartCount } = useAuth()
    const [isFavorite, setIsFavorite] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    //* Separar las imágenes
    const imagenes = producto.imagen_url 
        ? producto.imagen_url.split(',').map(img => img.trim()).filter(img => img.length > 0)
        : []






    //* Carrusel automático
    useEffect(() => {
        if (imagenes.length <= 1) return; // Mas de una imagen para activar carrusel

        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % imagenes.length)
        }, 4000)

        return () => clearInterval(timer)
    }, [imagenes.length]) //si el numero de img cambia, reinicia el carrusel

    //&por si en un futuro agregamos descuento (campo BBDD) por temporada, ofertas, etc.
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

    //& Botón favoritos: por si creamos esta seccion
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
        // Si es un click en botones, no hacer nada
        if (e.target.closest('button')) return;
        // Llamar al onClick del padre
        if (onClick) onClick();
    }

    return (
        <div 
            onClick={handleCardClick}
            className={`product-card-zoom ${isZoomed ? 'zoomed' : ''} relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group`}
        >
            {/* //* Botón cerrar - Solo visible cuando está en zoom */}
            {isZoomed && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-3 left-3 z-30 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
                    aria-label="Cerrar"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>
            )}

            {/* //& Badge de descuento */}
            {descuento && (
                <div className='absolute top-2 right-2 z-20 bg-yellow-400 text-gray-900 font-black text-[11px] md:text-sm px-2 py-0.5 md:py-1 rounded-full shadow-md'>
                    {descuento}%
                </div>
            )}

            {/* //* Botón de agregar al carrito, oyente de handleCompra()*/}
            <button 
                onClick={handleCompra}
                disabled={isAdding || producto.stock <= 0}
                className='absolute bottom-3 right-3 z-20 bg-green-500 hover:bg-green-600 text-white w-10 h-10 md:w-11 md:h-11 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
                {isAdding ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Plus size={20} strokeWidth={3} />
                )}
            </button>

            {/* //* Contenedor Carrusel de imágenes */}
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
                                    className='absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 w-6 h-6 rounded-full shadow flex items-center justify-center transition-all opacity-0 group-hover:opacity-100'
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                
                                <button
                                    onClick={nextImage}
                                    className='absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 w-6 h-6 rounded-full shadow flex items-center justify-center transition-all opacity-0 group-hover:opacity-100'
                                >
                                    <ChevronRight size={14} />
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

            {/* //* Información del producto */}
            <div className='p-2.5 md:p-3 space-y-1.5'>
                {producto.categoria && (
                    <p className='text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                        {producto.categoria}
                    </p>
                )}

                <h3 className='text-[11px] md:text-sm font-bold text-gray-800 line-clamp-2 leading-tight'>
                    {producto.nombre}
                </h3>
                <p className='text-[9px] md:text-xs text-gray-500 line-clamp-2'>
                    {producto.descripcion}
                </p>

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

            {/* //& Botón favoritos: por si creamos esta seccion */}
            <button 
                onClick={handleFavorite}
                className='absolute bottom-3 left-3 transition-transform active:scale-125 z-10'
            >
            </button>
        
        </div>
    )
}