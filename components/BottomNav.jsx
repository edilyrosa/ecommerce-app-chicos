// components/BottomNav.jsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { ShoppingBag, Home, Grid, Tag, ShoppingCart, MessageCircle, Settings, X } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../context/authContext'

export default function BottomNav({ setCategory, currentCategory }) {
    const router = useRouter()
    const pathname = usePathname()
    const { cartCount, user } = useAuth()
    
    const [showCategories, setShowCategories] = useState(false)
    const [showAdminMenu, setShowAdminMenu] = useState(false)
    const adminMenuRef = useRef(null)
    const adminButtonRef = useRef(null)

    // Cerrar menú admin al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                adminMenuRef.current &&
                !adminMenuRef.current.contains(event.target) &&
                adminButtonRef.current &&
                !adminButtonRef.current.contains(event.target)
            ) {
                setShowAdminMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const isAdmin = user?.is_admin === true
    const isLoggedIn = !!user

    return (
        <nav className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl'>
            
            {/* --- MENÚ ADMIN (desplegable) --- */}
            {showAdminMenu && (
                <div
                    ref={adminMenuRef}
                    className='absolute bottom-full left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] p-4 animate-in slide-in-from-bottom duration-300 rounded-t-2xl'
                >
                    <div className='flex justify-between items-center mb-4 px-2'>
                        <span className='font-bold text-gray-800'>Opciones de Administrador</span>
                        <button onClick={() => setShowAdminMenu(false)} className='p-1 bg-gray-100 rounded-full'>
                            <X size={28} />
                        </button>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <button
                            onClick={() => {
                                setShowAdminMenu(false)
                                router.push('/crud-pedidos')
                            }}
                            className='w-full py-3 px-4 rounded-xl text-sm font-semibold bg-blue-50 text-blue-800 border border-blue-200 transition-all active:scale-95'
                        >
                            CRUD Pedidos
                        </button>
                        <button
                            onClick={() => {
                                setShowAdminMenu(false)
                                router.push('/crud-productos')
                            }}
                            className='w-full py-3 px-4 rounded-xl text-sm font-semibold bg-blue-50 text-blue-800 border border-blue-200 transition-all active:scale-95'
                        >
                            CRUD Productos
                        </button>
                        <button
                            onClick={() => {
                                setShowAdminMenu(false)
                                router.push('/crud-banners')
                            }}
                            className='w-full py-3 px-4 rounded-xl text-sm font-semibold bg-blue-50 text-blue-800 border border-blue-200 transition-all active:scale-95'
                        >
                            CRUD Banners
                        </button>
                    </div>
                </div>
            )}

            {/* --- BOTONES PRINCIPALES - DISTRIBUCIÓN UNIFORME --- */}
            <div className='flex w-full h-16 bg-white'>
                {/* Inicio */}
                <button
                    onClick={() => router.push('/')}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 ${pathname === '/' && !showCategories ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Home size={22} />
                    <span className='text-[10px] font-medium'>Inicio</span>
                </button>

                {/* Tienda */}
                <button
                    onClick={() => router.push('/tienda')}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 ${pathname === '/tienda' && !showCategories ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <ShoppingBag size={22} />
                    <span className='text-[10px] font-medium'>Tienda</span>
                </button>

                {/* Ofertas */}
                <button
                    onClick={() => router.push('/ofertas')}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 ${pathname === '/ofertas' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Tag size={22} />
                    <span className='text-[10px] font-medium'>Ofertas</span>
                </button>

                {/* Pisos */}
                <button
                    onClick={() => router.push('/pisos')}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 ${pathname === '/pisos' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Grid size={22} />
                    <span className='text-[10px] font-medium'>Pisos</span>
                </button>

                {/* Carrito (solo si usuario logueado) */}
                {isLoggedIn && (
                    <button
                        onClick={() => router.push('/carrito')}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 ${pathname === '/carrito' ? 'text-blue-600' : 'text-gray-500'}`}
                    >
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
                )}

                {/* Pedidos (solo si usuario logueado) */}
                {isLoggedIn && (
                    <button
                        onClick={() => router.push('/tracking-pedido')}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 ${pathname === '/tracking-pedido' ? 'text-blue-600' : 'text-gray-500'}`}
                    >
                        <MessageCircle size={22} />
                        <span className='text-[10px] font-medium'>Pedidos</span>
                    </button>
                )}

                {/* Botón de Administrador (solo si is_admin) */}
                {isAdmin && (
                    <button
                        ref={adminButtonRef}
                        onClick={() => setShowAdminMenu(!showAdminMenu)}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 ${showAdminMenu ? 'text-blue-600' : 'text-gray-500'}`}
                    >
                        <Settings size={22} />
                        <span className='text-[10px] font-medium'>Admin</span>
                    </button>
                )}

                {/* NOTA: No se añade un div vacío, el flex reparte el espacio automáticamente entre los botones visibles */}
            </div>
        </nav>
    )
}