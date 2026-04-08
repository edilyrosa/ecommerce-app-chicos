// app/components/Header.jsx
'use client'
import { Edit2, Home, Save, Grid, ShoppingCart, User, ShoppingBag, ChevronDown, LayoutGrid, Search, LogOut, Tag, MessageCircle, Settings } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '../context/authContext';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Header({ searchTerm, setSearchTerm, setCategory, currentCategory }) {
    const { user, cartCount, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [showAdminMenu, setShowAdminMenu] = useState(false); // Para móvil
    const [categoriesOptions, setCategoriesOptions] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Obtener categorías desde la base de datos
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = Cookies.get('token');
                const res = await fetch('/api/admin/options?type=categorias', {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                if (res.ok) {
                    const data = await res.json();
                    setCategoriesOptions(Array.isArray(data) ? data : []);
                } else {
                    console.error('Error al cargar categorías:', res.status);
                    setCategoriesOptions([]);
                }
            } catch (error) {
                console.error('Error al obtener categorías:', error);
                setCategoriesOptions([]);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Formatear para mostrar (primera letra mayúscula)
    const formatCategoryLabel = (cat) => {
        if (!cat) return '';
        return cat.charAt(0).toUpperCase() + cat.slice(1);
    };

    // Categorías a mostrar: incluye "Todas" como opción adicional
    const menuCategories = [{ id: 'todas', label: 'Todas' }, ...categoriesOptions.map(cat => ({ id: cat, label: formatCategoryLabel(cat) }))];

    const handleCategorySelect = (id) => {
        setCategory?.(id);
        setShowMenu(false);
    };

    // Estilo para los botones de navegación (icono arriba)
    const getNavBtnStyle = (path) => {
        const isActive = pathname === path;
        const baseClasses = "flex flex-col items-center justify-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-1 md:py-1.5 rounded-xl transition-all duration-200 min-w-[50px] md:min-w-[60px]";
        if (isActive) {
            return `${baseClasses} bg-white text-blue-900 shadow-lg font-bold`;
        }
        return `${baseClasses} bg-transparent text-white hover:bg-white/10`;
    };

    // Verificar si el usuario es administrador (por email)
    const isAdmin = user?.email === 'admin@gmail.com';

    // Componente SearchBar
    const renderSearchBar = () => (
        <div className='text-white shadow-lg'>
            <div className='container mx-auto px-2 md:px-4 py-2 md:py-2.5 bg-[#00162f]'>
                <div className='flex gap-1 md:gap-2 items-center relative'>
                    {/* Botón de Categorías */}
                    <div className='relative'>
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg border transition-all text-xs md:text-sm font-bold shadow-sm ${
                                showMenu || currentCategory !== 'todas' 
                                ? 'bg-yellow-400 border-yellow-400 text-blue-900' 
                                : 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50'
                            }`}
                        >
                            <LayoutGrid size={14} className="md:w-4 md:h-4" />
                            <span className='hidden sm:inline text-[10px] md:text-xs'>Categorías</span>
                            <ChevronDown size={12} className={`transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showMenu && (
                            <div className='absolute top-full left-0 mt-2 w-40 md:w-52 bg-[#00162f] border shadow-2xl rounded-2xl p-2 z-60 animate-in fade-in zoom-in duration-200'>
                                {loadingCategories ? (
                                    <div className="text-center py-2 text-xs text-gray-400">Cargando...</div>
                                ) : (
                                    <div className='flex flex-col gap-1'>
                                        {menuCategories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleCategorySelect(cat.id)}
                                                className={`w-full text-left py-1.5 md:py-2 px-3 md:px-4 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                                                    currentCategory === cat.id 
                                                    ? 'bg-yellow-400 text-blue-900' 
                                                    : 'text-white hover:text-[#00162f] hover:bg-white'
                                                }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Input de búsqueda */}
                    <div className='relative flex-1 group'>
                        <input
                            type='text'
                            placeholder='Buscar productos...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 text-xs md:text-sm text-white bg-[#00162f] border border-blue-700 rounded-lg outline-none transition-all placeholder:text-blue-100 focus:bg-blue-900 focus:border-yellow-400'
                        />
                        <Search className='absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 group-focus-within:text-yellow-400 transition-colors' />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* HEADER: Logo y Navegación */}
            <header className='md:sticky md:top-0 z-50 shadow-2xl text-white bg-[#00162f]'>
                <div className='text-white shadow-lg'>
                    <div className='container mx-auto px-2 md:px-4 py-1.5 md:py-2.5 flex items-center justify-between'>
                        
                        {/* Logo */}
                        <Link href={'/'} className="shrink-0">
                            <div className='flex items-center gap-2 md:gap-3'>
                                <img src='/logo.png' alt='Logo' className='w-10 md:w-14 object-contain' />
                                {/* Ocultar texto si es admin */}
                                {!isAdmin && (
                                    <span className='text-[8px] md:text-xl font-black tracking-widest uppercase' style={{ letterSpacing: '0.1em', lineHeight: 1.2 }}>
                                        BODEGA DE AZULEJOS
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* MÓVIL: Iconos de perfil y menú admin */}
                        <div className='md:hidden flex items-center gap-1'>
                            {isAdmin && (
                                <div className='relative'>
                                    <button 
                                        onClick={() => setShowAdminMenu(!showAdminMenu)}
                                        className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 transition-all"
                                    >
                                        <Settings size={16} />
                                    </button>
                                    {showAdminMenu && (
                                        <div className='absolute right-0 mt-2 w-40 bg-[#00162f] border shadow-2xl rounded-2xl p-2 z-60 animate-in fade-in'>
                                            <div className='flex flex-col gap-1'>
                                                <Link href='/actualizar-pedidos' className="block text-left py-1.5 px-3 rounded-xl text-xs font-semibold text-white hover:bg-yellow-400 hover:text-blue-900 transition-all">
                                                    <Save size={16} />
                                                    Actualizar Pedidos
                                                </Link>
                                                <Link href='/crud-productos' className="block text-left py-1.5 px-3 rounded-xl text-xs font-semibold text-white hover:bg-yellow-400 hover:text-blue-900 transition-all">
                                                    <Edit2 size={16} />
                                                    CRUD Productos
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {user ? (
                                <button 
                                    onClick={logout} 
                                    className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 transition-all"
                                >
                                    <LogOut size={16} />
                                    <span className="text-[10px] font-bold">Salir</span>
                                </button>
                            ) : (
                                <Link href='/login' className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-yellow-400 bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 transition-all">
                                    <User size={16} />
                                    <span className="text-[10px]">Ingresar</span>
                                </Link>
                            )}
                        </div>

                        {/* DESKTOP: Navegación completa */}
                        <div className='hidden md:flex items-center gap-2'>
                            {user ? (
                                <>
                                    <span className="hidden xl:inline text-xs text-blue-200 font-medium mr-2">
                                        Hola, <span className='text-white font-semibold'>{user.nombre}</span>
                                    </span>

                                    {/* Enlaces para cliente regular con icono arriba */}
                                    <button onClick={() => router.push('/')} className={getNavBtnStyle('/')}>
                                        <Home size={18} />
                                        <span className="text-xs font-bold">Inicio</span>
                                    </button>
                                    
                                    {/* Enlaces para cliente regular con icono arriba */}
                                    <button onClick={() => router.push('/tienda')} className={getNavBtnStyle('/tienda')}>
                                        <ShoppingBag size={18} />
                                        <span className="text-xs font-bold">Tienda</span>
                                    </button>

                                    <button onClick={() => router.push('/pisos')} className={getNavBtnStyle('/pisos')}>
                                        <Grid size={18} />
                                        <span className="text-xs font-bold">Pisos</span>
                                    </button>

                                    <button onClick={() => router.push('/ofertas')} className={getNavBtnStyle('/ofertas')}>
                                        <Tag size={18} />
                                        <span className="text-xs font-bold">Ofertas</span>
                                    </button>

                                    <button onClick={() => router.push('/carrito')} className={getNavBtnStyle('/carrito')}>
                                        <div className="relative">
                                            <ShoppingCart size={18} />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-[9px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center border border-blue-900 shadow-md">
                                                    {cartCount > 99 ? '99+' : cartCount}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold">Carrito</span>
                                    </button>

                                    <button onClick={() => router.push('/tracking-pedido')} className={getNavBtnStyle('/tracking-pedido')}>
                                        <MessageCircle size={18} />
                                        <span className="text-xs font-bold">Tus Pedidos</span>
                                    </button>

                                    {/* Enlaces para administrador */}
                                    {isAdmin && (
                                        <>
                                            <button onClick={() => router.push('/actualizar-pedidos')} className={getNavBtnStyle('/actualizar-pedidos')}>
                                                <Save size={18} />
                                                <span className="text-xs font-bold">Actualizar Pedidos</span>
                                            </button>
                                            <button onClick={() => router.push('/crud-productos')} className={getNavBtnStyle('/crud-productos')}>
                                                <Edit2 size={18} />
                                                <span className="text-xs font-bold">CRUD Productos</span>
                                            </button>
                                        </>
                                    )}

                                    <button 
                                        onClick={logout} 
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 transition-all"
                                    >
                                        <LogOut size={18} />
                                        <span className="text-xs font-bold">Salir</span>
                                    </button>
                                </>
                            ) : (
                                // Usuario no logueado
                                <>
                            
                                    <button onClick={() => router.push('/')} className={getNavBtnStyle('/')}>
                                        <Home size={18} />
                                        <span className="text-xs font-bold">Inicio</span>
                                    </button>
                                    
                                    <button onClick={() => router.push('/tienda')} className={getNavBtnStyle('/tienda')}>
                                        <ShoppingBag size={18} />
                                        <span className="text-xs font-bold">Tienda</span>
                                    </button>

                                    <button onClick={() => router.push('/pisos')} className={getNavBtnStyle('/pisos')}>
                                        <Grid size={18} />
                                        <span className="text-xs font-bold">Pisos</span>
                                    </button>

                                    <button onClick={() => router.push('/ofertas')} className={getNavBtnStyle('/ofertas')}>
                                        <Tag size={18} />
                                        <span className="text-xs font-bold">Ofertas</span>
                                    </button>

                                    <Link href='/login' className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-yellow-400 bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 transition-all shadow-lg">
                                        <User size={18} />
                                        <span className="text-sm">Ingresar</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* DESKTOP: Buscador */}
                {setSearchTerm && (
                    <div className='hidden md:block'>
                        {renderSearchBar()}
                    </div>
                )}
            </header>

            {/* MÓVIL: Buscador sticky */}
            {setSearchTerm && (
                <div className='md:hidden sticky top-0 z-40'>
                    {renderSearchBar()}
                </div>
            )}
        </> 
    )
}