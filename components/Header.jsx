// //app/components/Header.jsx'
// 'use client'
// import { Grid, ShoppingCart, User, ShoppingBag, ChevronDown, LayoutGrid, Search, LogOut, Tag, MessageCircle } from 'lucide-react'
// import Link from 'next/link'
// import { useAuth } from '@/context/authContext';
// import { useState } from 'react';
// import { usePathname } from 'next/navigation';

// export default function Header({ searchTerm, setSearchTerm, setCategory, currentCategory }) {
//     const { user, cartCount, logout } = useAuth();
//     const pathname = usePathname();
//     const [showMenu, setShowMenu] = useState(false);

//     const categorias = [
//         { id: 'todas',      label: 'Todas' },
//         { id: 'hogar',      label: 'Hogar' },
//         { id: 'ferreteria', label: 'Ferretería' },
//         { id: 'jardineria', label: 'Jardinería' },
//         { id: 'baños',      label: 'Baños' }
//     ];

//     const handleCategorySelect = (id) => {
//         setCategory?.(id);
//         setShowMenu(false);
//     };

//     const getBtnStyle = (path) => {
//         const isActive = pathname === path;
//         const baseClasses = "flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border transition-all duration-200 min-w-[50px] md:min-w-fit";

//         if (isActive) {
//             return `${baseClasses} bg-white border-white text-blue-900 shadow-lg font-bold`;
//         }

//         return `${baseClasses} bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50`;
//     };

//     // Componente SearchBar con acceso a todas las variables
//     const renderSearchBar = () => (
//         <div className='text-white shadow-lg '>
//             <div className='container mx-auto px-4 py-2.5  bg-[#00162f]'>
//                 <div className='flex gap-2 items-center relative'>
                    
//                     {/* Botón de Categorías */}
//                     <div className='relative'>
//                         <button 
//                             onClick={() => setShowMenu(!showMenu)}
//                             className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-bold shadow-sm ${
//                                 showMenu || currentCategory !== 'todas' 
//                                 ? 'bg-yellow-400 border-yellow-400 text-blue-900' 
//                                 : 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50'
//                             }`}
//                         >
//                             <LayoutGrid size={16} />
//                             <span className='hidden sm:inline text-xs'>Categorías</span>
//                             <ChevronDown size={14} className={`transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
//                         </button>

//                         {showMenu && (
//                             <div className='absolute top-full left-0 mt-2 w-52  bg-[#00162f] border shadow-2xl rounded-2xl p-2 z-60 animate-in fade-in zoom-in duration-200'>
//                                 <div className='flex flex-col gap-1'>
//                                     {categorias.map((cat) => (
//                                         <button
//                                             key={cat.id}
//                                             onClick={() => handleCategorySelect(cat.id)}
//                                             className={`w-full text-left py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
//                                                 currentCategory === cat.id 
//                                                 ? 'bg-yellow-400 text-blue-900' 
//                                                 : 'text-white hover:text-[#00162f] hover:bg-white'
//                                             }`}
//                                         >
//                                             {cat.label}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* //* Input de búsqueda */}
//                     <div className='relative flex-1 group'>
//                         <input
//                             type='text'
//                             placeholder='Buscar productos...'
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className='w-full pl-10 pr-4 py-2 text-sm text-white  bg-[#00162f] border border-blue-700 rounded-lg outline-none transition-all placeholder:text-blue-100 focus:bg-blue-900 focus:border-yellow-400'
//                         />
//                         <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-yellow-400 transition-colors' />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     return (
// <>
//            {/* HEADER: Logo y Navegación */}
//             <header className='md:sticky md:top-0 z-50 shadow-2xl text-white bg-[#00162f]'>
//                 <div className=' text-white shadow-lg'>
//                     <div className='container mx-auto px-4 py-2.5 flex items-center justify-between'>
                        
//                         {/* Logo */}
//                         <Link href={'/'} className="shrink-0">
//                         <div className='flex items-center gap-3'>
//                            <img src='/logo.png' alt='Logo' className='w-12 md:w-14 object-contain' />
//                            <span className=' text-[9px] md:text-xl font-black tracking-widest uppercase' style={{ letterSpacing: '0.15em' }}>
//                                 BODEGA DE AZULEJOS
//                             </span>

//                         </div>
//                         </Link>

//                         {/* MÓVIL: Solo icono de perfil */}
//                         <div className='md:hidden'>
//                             {user ? (
//                                 <div className='flex items-center gap-2'>

//                                 {/* <Link href='/perfil' className={getBtnStyle('/perfil')}>
//                                     <User size={20} />
//                                 </Link> */}

//                                 <button 
//                                         onClick={logout} 
//                                         className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 transition-all"
//                                     >
//                                         <LogOut size={18} />
//                                         <span className="text-xs font-bold">Salir</span>
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <Link href='/login' className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-yellow-400 bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 transition-all">
//                                     <User size={18} />
//                                     <span className="text-xs">Ingresar</span>
//                                 </Link>
//                             )}
//                         </div>

//                         {/* DESKTOP: Navegación completa */}
//                         <div className='hidden md:flex items-center gap-2'>
//                             {user ? (
//                                 <>
//                                     <span className="hidden xl:inline text-xs text-blue-200 font-medium mr-2">
//                                         Hola, <span className='text-white font-semibold'>{user.nombre}</span>
//                                     </span>

//                                     {/* <Link href="/perfil" className={getBtnStyle('/perfil')}>
//                                     <User size={18} />
//                                         <span className="text-xs font-bold">Mi Perfil</span>
//                                     </Link> */}

//                                     <Link href='/' className={getBtnStyle('/')}>
//                                         <ShoppingBag size={18} />
//                                         <span className="text-xs font-bold">Tienda</span>
//                                     </Link>

//                                     <Link href='/pisos' className={getBtnStyle('/pisos')}>
//                                         <Grid size={18} />
//                                         <span className="text-xs font-bold">Pisos</span>
//                                     </Link>

//                                     <Link href='/ofertas' className={getBtnStyle('/ofertas')}>
//                                         <Tag size={18} />
//                                         <span className="text-xs font-bold">Ofertas</span>
//                                     </Link>

//                                     <Link href='/carrito' className={getBtnStyle('/carrito')}>
//                                         <div className="relative">
//                                             <ShoppingCart size={18} />
//                                             {cartCount > 0 && (
//                                                 <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-[9px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center border border-blue-900 shadow-md">
//                                                     {cartCount > 99 ? '99+' : cartCount}
//                                                 </span>
//                                             )}
//                                         </div>
//                                         <span className="text-xs font-bold">Carrito</span>
//                                     </Link>

//                                     <Link href='/tracking-pedido' className={getBtnStyle('/tracking-pedido')}>
//                                         <MessageCircle size={18} />
//                                         <span className="text-xs font-bold">Tus Pedidos</span>
//                                     </Link>

//                                     <button 
//                                         onClick={logout} 
//                                         className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 transition-all"
//                                     >
//                                         <LogOut size={18} />
//                                         <span className="text-xs font-bold">Salir</span>
//                                     </button>
//                                 </>
//                             ) : (

//                                 <>
                                
//                                     <Link href='/' className={getBtnStyle('/')}>
//                                         <ShoppingBag size={18} />
//                                         <span className="text-xs font-bold">Tienda</span>
//                                     </Link>

//                                     <Link href='/pisos' className={getBtnStyle('/pisos')}>
//                                         <Grid size={18} />
//                                         <span className="text-xs font-bold">Pisos</span>
//                                     </Link>

//                                     <Link href='/ofertas' className={getBtnStyle('/ofertas')}>
//                                         <Tag size={18} />
//                                         <span className="text-xs font-bold">Ofertas</span>
//                                     </Link>
//                                 <Link href='/login' className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-yellow-400 bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 transition-all shadow-lg">
//                                     <User size={18} />
//                                     <span className="text-sm">Ingresar</span>
//                                 </Link>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* //& DESKTOP: Buscador dentro del header sticky */}
//                 {setSearchTerm && (
//                     <div className='hidden md:block'>
//                         {renderSearchBar()}
//                     </div>
//                 )}
//             </header>

//             {/* //& MÓVIL: Buscador sticky independiente */}
//             {setSearchTerm && (
//                 <div className='md:hidden sticky top-0 z-40'>
//                     {renderSearchBar()}
//                 </div>
//             )}
//        </> 
//     )
// }




// app/components/Header.jsx
'use client'
import { Grid, ShoppingCart, User, ShoppingBag, ChevronDown, LayoutGrid, Search, LogOut, Tag, MessageCircle, Settings } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/authContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header({ searchTerm, setSearchTerm, setCategory, currentCategory }) {
    const { user, cartCount, logout } = useAuth();
    const pathname = usePathname();
    const [showMenu, setShowMenu] = useState(false);
    const [showAdminMenu, setShowAdminMenu] = useState(false); // Para móvil

    const categorias = [
        { id: 'todas',      label: 'Todas' },
        { id: 'hogar',      label: 'Hogar' },
        { id: 'ferreteria', label: 'Ferretería' },
        { id: 'jardineria', label: 'Jardinería' },
        { id: 'baños',      label: 'Baños' }
    ];

    const handleCategorySelect = (id) => {
        setCategory?.(id);
        setShowMenu(false);
    };

    const getBtnStyle = (path) => {
        const isActive = pathname === path;
        const baseClasses = "flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border transition-all duration-200 min-w-[50px] md:min-w-fit";

        if (isActive) {
            return `${baseClasses} bg-white border-white text-blue-900 shadow-lg font-bold`;
        }

        return `${baseClasses} bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50`;
    };

    // Verificar si el usuario es administrador (por email)
    const isAdmin = user?.email === 'admin@gmail.com';

    // Componente SearchBar con acceso a todas las variables
    const renderSearchBar = () => (
        <div className='text-white shadow-lg'>
            <div className='container mx-auto px-4 py-2.5 bg-[#00162f]'>
                <div className='flex gap-2 items-center relative'>
                    {/* Botón de Categorías */}
                    <div className='relative'>
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-bold shadow-sm ${
                                showMenu || currentCategory !== 'todas' 
                                ? 'bg-yellow-400 border-yellow-400 text-blue-900' 
                                : 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50'
                            }`}
                        >
                            <LayoutGrid size={16} />
                            <span className='hidden sm:inline text-xs'>Categorías</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showMenu && (
                            <div className='absolute top-full left-0 mt-2 w-52 bg-[#00162f] border shadow-2xl rounded-2xl p-2 z-60 animate-in fade-in zoom-in duration-200'>
                                <div className='flex flex-col gap-1'>
                                    {categorias.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategorySelect(cat.id)}
                                            className={`w-full text-left py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                                                currentCategory === cat.id 
                                                ? 'bg-yellow-400 text-blue-900' 
                                                : 'text-white hover:text-[#00162f] hover:bg-white'
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
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
                            className='w-full pl-10 pr-4 py-2 text-sm text-white bg-[#00162f] border border-blue-700 rounded-lg outline-none transition-all placeholder:text-blue-100 focus:bg-blue-900 focus:border-yellow-400'
                        />
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-yellow-400 transition-colors' />
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
                    <div className='container mx-auto px-4 py-2.5 flex items-center justify-between'>
                        
                        {/* Logo */}
                        <Link href={'/'} className="shrink-0">
                            <div className='flex items-center gap-3'>
                                <img src='/logo.png' alt='Logo' className='w-12 md:w-14 object-contain' />
                                <span className='text-[9px] md:text-xl font-black tracking-widest uppercase' style={{ letterSpacing: '0.15em' }}>
                                    BODEGA DE AZULEJOS
                                </span>
                            </div>
                        </Link>

                        {/* MÓVIL: Solo icono de perfil y menú admin (si aplica) */}
                        <div className='md:hidden flex items-center gap-2'>
                            {isAdmin && (
                                <div className='relative'>
                                    <button 
                                        onClick={() => setShowAdminMenu(!showAdminMenu)}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 transition-all"
                                    >
                                        <Settings size={18} />
                                    </button>
                                    {showAdminMenu && (
                                        <div className='absolute right-0 mt-2 w-48 bg-[#00162f] border shadow-2xl rounded-2xl p-2 z-60 animate-in fade-in'>
                                            <div className='flex flex-col gap-1'>
                                                <Link href='/productos' className="w-full text-left py-2 px-4 rounded-xl text-sm font-semibold text-white hover:bg-yellow-400 hover:text-blue-900 transition-all">
                                                    Productos
                                                </Link>
                                                <Link href='/actualizar-pedidos' className="w-full text-left py-2 px-4 rounded-xl text-sm font-semibold text-white hover:bg-yellow-400 hover:text-blue-900 transition-all">
                                                    Actualizar Pedidos
                                                </Link>
                                                <Link href='/crud-productos' className="w-full text-left py-2 px-4 rounded-xl text-sm font-semibold text-white hover:bg-yellow-400 hover:text-blue-900 transition-all">
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
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 transition-all"
                                >
                                    <LogOut size={18} />
                                    <span className="text-xs font-bold">Salir</span>
                                </button>
                            ) : (
                                <Link href='/login' className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-yellow-400 bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 transition-all">
                                    <User size={18} />
                                    <span className="text-xs">Ingresar</span>
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

                                    {/* Enlaces para cliente regular */}
                                    <Link href='/' className={getBtnStyle('/')}>
                                        <ShoppingBag size={18} />
                                        <span className="text-xs font-bold">Tienda</span>
                                    </Link>

                                    <Link href='/pisos' className={getBtnStyle('/pisos')}>
                                        <Grid size={18} />
                                        <span className="text-xs font-bold">Pisos</span>
                                    </Link>

                                    <Link href='/ofertas' className={getBtnStyle('/ofertas')}>
                                        <Tag size={18} />
                                        <span className="text-xs font-bold">Ofertas</span>
                                    </Link>

                                    <Link href='/carrito' className={getBtnStyle('/carrito')}>
                                        <div className="relative">
                                            <ShoppingCart size={18} />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-[9px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center border border-blue-900 shadow-md">
                                                    {cartCount > 99 ? '99+' : cartCount}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold">Carrito</span>
                                    </Link>

                                    <Link href='/tracking-pedido' className={getBtnStyle('/tracking-pedido')}>
                                        <MessageCircle size={18} />
                                        <span className="text-xs font-bold">Tus Pedidos</span>
                                    </Link>

                                    {/* Enlaces para administrador */}
                                    {isAdmin && (
                                        <>
                                            <Link href='/productos' className={getBtnStyle('/productos')}>
                                                <span className="text-xs font-bold">Productos</span>
                                            </Link>
                                            <Link href='/actualizar-pedidos' className={getBtnStyle('/actualizar-pedidos')}>
                                                <span className="text-xs font-bold">Actualizar Pedidos</span>
                                            </Link>
                                            <Link href='/crud-productos' className={getBtnStyle('/crud-productos')}>
                                                <span className="text-xs font-bold">CRUD Productos</span>
                                            </Link>
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
                                    <Link href='/' className={getBtnStyle('/')}>
                                        <ShoppingBag size={18} />
                                        <span className="text-xs font-bold">Tienda</span>
                                    </Link>

                                    <Link href='/pisos' className={getBtnStyle('/pisos')}>
                                        <Grid size={18} />
                                        <span className="text-xs font-bold">Pisos</span>
                                    </Link>

                                    <Link href='/ofertas' className={getBtnStyle('/ofertas')}>
                                        <Tag size={18} />
                                        <span className="text-xs font-bold">Ofertas</span>
                                    </Link>

                                    <Link href='/login' className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-yellow-400 bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 transition-all shadow-lg">
                                        <User size={18} />
                                        <span className="text-sm">Ingresar</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* DESKTOP: Buscador dentro del header sticky */}
                {setSearchTerm && (
                    <div className='hidden md:block'>
                        {renderSearchBar()}
                    </div>
                )}
            </header>

            {/* MÓVIL: Buscador sticky independiente */}
            {setSearchTerm && (
                <div className='md:hidden sticky top-0 z-40'>
                    {renderSearchBar()}
                </div>
            )}
        </> 
    )
}