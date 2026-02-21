'use client'
import { useState } from 'react'
import { Home, Grid, Tag, ShoppingCart, MessageCircle, X } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/authContext'

export default function BottomNav({ setCategory, currentCategory }) {
    const router = useRouter()
    const pathname = usePathname()
    const { cartCount } = useAuth()
    
    // --- ESTADO LOCAL PARA EL DESPLEGABLE ---
    const [showCategories, setShowCategories] = useState(false)

    const categorias = [
        { id: 'todas', label: 'Todas' },
        { id: 'hogar', label: 'Hogar' },
        { id: 'ferreteria', label: 'Ferretería' },
        { id: 'jardineria', label: 'Jardinería' },
        { id: 'baños', label: 'Baños' }
    ]

    const handleCategorySelect = (catId) => {
        setCategory(catId)
        setShowCategories(false)
        if (pathname !== '/') router.push('/') // Volver a inicio si está en otra página
    }

    return (
        <nav className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl'>
            
            {/* --- DESPLEGABLE FLOTANTE --- */}
            {showCategories && (
                <div className='absolute bottom-full left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] p-4 animate-in slide-in-from-bottom duration-300 rounded-t-2xl'>
                   
                    <div className='flex justify-between items-center mb-4 px-2'>
                        <span className='font-bold text-gray-800'>Filtrar por Categoría</span>
                        <button onClick={() => setShowCategories(false)} className='p-1 bg-gray-100 rounded-full'>
                            <X size={28} />
                        </button>
                    </div>

                    <div className='flex flex-col justify-between items-center mb-4 px-2 ga-4'>
                        {categorias.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategorySelect(cat.id)}
                                className={`w-full hover:text-blue-900 opacity-[0.8] hover:opacity-[1.0] py-3 px-4 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                                    currentCategory === cat.id 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-gray-50 text-gray-600 border border-gray-100'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className='grid grid-cols-5 h-16 relative bg-white'>
                {/* INICIO */}
                <button 
                    onClick={() => router.push('/')} 
                    className={`flex flex-col items-center justify-center gap-1 ${pathname === '/' && !showCategories ? 'text-blue-600' : 'text-gray-500'}`}
                    suppressHydrationWarning // 👈 Agrega esto a los botones problemáticos
                    >
                    
                    <Home size={22} />
                    <span className='text-[10px] font-medium'>Inicio</span>
                </button>

                {/* --- BOTÓN CATEGORÍAS (CONTROLADOR) --- */}
                <button
                    onClick={() => setShowCategories(!showCategories)}
                    className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
                        showCategories || currentCategory !== 'todas' ? 'text-blue-600' : 'text-gray-500'
                    }`}
                >
                    <Grid size={22} strokeWidth={showCategories ? 2.5 : 2} />
                    <span className='text-[10px] font-medium text-center'>Categorías</span>
                    {currentCategory !== 'todas' && (
                        <div className='absolute top-2 right-4 w-2 h-2 bg-blue-600 rounded-full border border-white' />
                    )}
                </button>

                {/* OFERTAS */}
                <button onClick={() => router.push('/ofertas')} className={`flex flex-col items-center justify-center gap-1 ${pathname === '/ofertas' ? 'text-blue-600' : 'text-gray-500'}`}>
                    <Tag size={22} />
                    <span className='text-[10px] font-medium'>Ofertas</span>
                </button>

                {/* CARRITO */}
                <button onClick={() => router.push('/carrito')} className={`relative flex flex-col items-center justify-center gap-1 ${pathname === '/carrito' ? 'text-blue-600' : 'text-gray-500'}`}>
                    <div className='relative'>
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </div>
                    <span className='text-[10px] font-medium'>Carrito</span>
                </button>

                {/* CHATBOT */}
                <button onClick={() => router.push('/chat')} className={`flex flex-col items-center justify-center gap-1 ${pathname === '/chatbot' ? 'text-blue-600' : 'text-gray-500'}`}>
                    <MessageCircle size={22} />
                    <span className='text-[10px] font-medium'>Chatbot</span>
                </button>
            </div>
        </nav>
    )
}

