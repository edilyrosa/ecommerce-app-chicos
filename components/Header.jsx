// 'use client'
// import { ShoppingCart, User, ShoppingBag, ChevronDown, LayoutGrid, Search, LogOut, Tag, MessageCircle } from 'lucide-react'
// import Link from 'next/link'
// import { useAuth } from '@/context/authContext';
// import { useState } from 'react';
// import { usePathname } from 'next/navigation';  //& pathname

// export default function Header({ searchTerm, setSearchTerm, setCategory, currentCategory }) { //& setCategory y currentCategory para el nuevo menú de categorías
//     const { user, cartCount, logout } = useAuth(); //& cartCount
//     const pathname = usePathname();                //& pathname → Rula activa → isActive = (path) => pathname === path;
//     const [showMenu, setShowMenu] = useState(false);

//     const categorias = [ //& Mapeada en el nuevo menú de categorías
//         { id: 'todas',      label: 'Todas' },
//         { id: 'hogar',      label: 'Hogar' },
//         { id: 'ferreteria', label: 'Ferretería' },
//         { id: 'jardineria', label: 'Jardinería' },
//         { id: 'baños',      label: 'Baños' }
//     ];

//     //& Maneja la selección de categoría desde el menú desplegable
//     const handleCategorySelect = (id) => { 
//         setCategory?.(id);
//         setShowMenu(false);
//     };

//     //& Función para determinar el estilo de los botones según si están activos o no
//     const getBtnStyle = (path) => { 
//     // Determina si una ruta está activa
//     const isActive = pathname === path;   
    
//     // Base común para todos los botones
//     const baseClasses = "flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border transition-all duration-200 min-w-[50px] md:min-w-fit";

//     if (isActive) {
//         // ACTIVO: Fondo blanco, texto negro, sin transparencia
//         return `${baseClasses} bg-white border-white text-black  shadow-lg`;
//     }

//     // INACTIVO: Fondo transparente, borde gris sutil, texto gris/blanco
//     return `${baseClasses} bg-transparent border-gray-500/30 text-gray-300  hover:border-gray-400`;
//     };

//     return (
//         <header className='sticky top-0 z-50 shadow-2xl'>
            
//             <div 
//                 className='text-white bg-purple-500'
//                 >
//                 {/* //& Toda esta div debe convervirse pantallas en moviles a lo siguiente: al link → '/login' y a un icon de perfil → '/perfil'
//                 //& el cual no es sticky que qda arriba al hacer scroll down, quedanse pegado solo el Buscador y Categorías que viene a continuacion */}
//                 <div className='container mx-auto px-4 py-2.5 flex items-center justify-between'>
                    
//                     {/* //& Logo */}
//                     <Link href={'/'} className="shrink-0">
//                         <h1 className='text-base md:text-xl font-black tracking-widest uppercase hover:opacity-80 transition-opacity'
//                             style={{ letterSpacing: '0.15em' }}>
//                             <span className='text-gray-900'>Mi</span>
//                             <span className='text-gray-100'>Store</span>
//                         </h1>
//                     </Link>

//                     {/* //* Acciones */}
//                     <div className='flex items-center gap-1.5 md:gap-2 mr-[10%]'>
//                         {user ? (
//                             <>
//                                 {/* //* Saludo desktop */}
//                                 <span className="hidden xl:inline text-xs text-gray-500 font-medium mr-2">
//                                     Hola, <span className='text-white'>{user.nombre}</span>
//                                 </span>

//                                 {/* //* TIENDA */}
//                                 <Link href='/' className={getBtnStyle('/')}>
//                                     <ShoppingBag size={18} />
//                                     <span className="text-[10px] md:text-xs font-bold">Tienda</span>
//                                 </Link>
//                                 {/* //* Pisos */}
//                                 <Link href='/pisos' className={getBtnStyle('/pisos')}>
//                                     <ShoppingBag size={18} />
//                                     <span className="text-[10px] md:text-xs font-bold">Pisos</span>
//                                 </Link>

//                                 {/* OFERTAS //TODO: LO DEJAMOS? */}
//                                 <Link href='/ofertas' className={getBtnStyle('/ofertas')}>
//                                     <Tag size={18} />
//                                     <span className="text-[10px] md:text-xs font-bold">Ofertas</span>
//                                 </Link>

//                                 {/* //* CARRITO */}
//                                 <Link href='/carrito' className={getBtnStyle('/carrito')}>
//                                     <div className="relative">
//                                         <ShoppingCart size={18} />
//                                         {cartCount > 0 && ( //& Muestra el contador si hay items en el carrito
//                                             <span className="absolute -top-2 -right-2 bg-green-400 text-black text-[9px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center border border-black shadow-sm">
//                                                 {cartCount > 99 ? '99+' : cartCount}
//                                             </span>
//                                         )}
//                                     </div>
//                                     <span className="text-[10px] md:text-xs font-bold">Carrito</span>
//                                 </Link>

//                                 {/* CHAT  //TODO: LO DEJAMOS? */}
//                                 <Link href='/chat' className={getBtnStyle('/chat')}>
//                                     <MessageCircle size={18} />
//                                     <span className="text-[10px] md:text-xs font-bold">Chat</span>
//                                 </Link>

//                                 {/* //* SALIR */}
//                                 <button 
//                                     onClick={logout} 
//                                     className="flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white hover:opacity-100 transition-all"
//                                 >
//                                     <LogOut size={18} />
//                                     <span className="text-[10px] md:text-xs font-bold">Salir</span>
//                                 </button>
//                             </>
//                         ) : (
//                             /* //* INGRESAR */
//                             <Link href='/login' className={getBtnStyle('/login')}>
//                                 <User size={18} />
//                                 <span className="text-[10px] md:text-xs font-bold">Ingresar</span>
//                             </Link>
//                         )}
//                     </div>


//                 </div>
//             </div>

//             {/* Buscador y Categorías */}
//             {pathname === '/' && setSearchTerm && (
//                 <div 
//                     className='border-t border-white/10 bg-black text-white'
//                     // style={{
//                     //     background: 'linear-gradient(to right, transparent 0%, #1a1a1a 8%, #1c1c1c 50%, #1a1a1a 92%, transparent 100%)',
//                     // }}
//                 >
//                     <div className='container mx-auto px-4 py-2.5'>
//                         <div className='flex gap-2 items-center relative'>
                            
//                             {/* //& Botón de Categorías, usamos la PRO: currentCategory */}
//                             <div className='relative'>
//                                 <button 
//                                     onClick={() => setShowMenu(!showMenu)}
//                                     className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-bold shadow-sm ${
//                                         showMenu || currentCategory !== 'todas' 
//                                         ? 'bg-black-600 border-white-500 text-white' 
//                                         : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/15'
//                                     }`}
//                                     suppressHydrationWarning
//                                 >
//                                     <LayoutGrid size={16} />
//                                     <span className='hidden sm:inline text-xs'>Categorías</span>
//                                     <ChevronDown size={14} className={`transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
//                                 </button>

//                                 {showMenu && (
//                                     <div className='absolute top-full left-0 mt-2 w-52 shadow-2xl border border-white/10 rounded-2xl p-2 z-[60] animate-in fade-in zoom-in duration-200'
//                                         style={{ background: '#1a1a1a' }}
//                                     >
//                                         <div className='flex flex-col gap-1'>
//                                             {categorias.map((cat) => (
//                                                 <button
//                                                     key={cat.id}
//                                                     onClick={() => handleCategorySelect(cat.id)}
//                                                     className={`w-full text-left py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
//                                                         currentCategory === cat.id 
//                                                         ? 'bg-white text-black' 
//                                                         : 'text-gray-400 hover:bg-white/10 hover:text-white'
//                                                     }`}
//                                                 >
//                                                     {cat.label}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* //* Input de búsqueda */}
//                             <div className='relative flex-1 group'>
//                                 <input
//                                     type='text'
//                                     placeholder='Buscar productos...'
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className='w-full pl-10 pr-4 py-2 text-sm text-gray-200 rounded-lg outline-none border transition-all placeholder:text-gray-500'
//                                     style={{ 
//                                         background: 'rgba(255,255,255,0.07)',
//                                         borderColor: 'rgba(255,255,255,0.12)'
//                                     }}
//                                     onFocus={e => {
//                                         e.target.style.background = 'rgba(255,255,255,0.12)';
//                                         e.target.style.borderColor = 'rgba(255,255,255,0.9)';
//                                     }}
//                                     onBlur={e => {
//                                         e.target.style.background = 'rgba(255,255,255,0.07)';
//                                         e.target.style.borderColor = 'rgba(255,255,255,0.12)';
//                                     }}
//                                 />
//                                 <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gray-200 transition-colors' />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </header>
//     )
// }














'use client'
import { Grid, ShoppingCart, User, ShoppingBag, ChevronDown, LayoutGrid, Search, LogOut, Tag, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/authContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header({ searchTerm, setSearchTerm, setCategory, currentCategory }) {
    const { user, cartCount, logout } = useAuth();
    const pathname = usePathname();
    const [showMenu, setShowMenu] = useState(false);

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

    // Componente SearchBar con acceso a todas las variables
    const renderSearchBar = () => (
        <div className=' bg-linear-to-r from-[#001C3D] via-[#003066] to-[#001C3D] text-white shadow-lg'>
            <div className='container mx-auto px-4 py-2.5'>
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
                            <div className='absolute top-full left-0 mt-2 w-52 bg-blue-900 border shadow-2xl rounded-2xl p-2 z-60 animate-in fade-in zoom-in duration-200'>
                                <div className='flex flex-col gap-1'>
                                    {categorias.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategorySelect(cat.id)}
                                            className={`w-full text-left py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                                                currentCategory === cat.id 
                                                ? 'bg-yellow-400 text-blue-900' 
                                                : 'text-white hover:bg-blue-800'
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
                            className='w-full pl-10 pr-4 py-2 text-sm text-white bg-blue-800/50 border border-blue-700 rounded-lg outline-none transition-all placeholder:text-blue-100 focus:bg-blue-900 focus:border-yellow-400'
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
            <header className='md:sticky md:top-0 z-50 shadow-2xl bg-linear-to-r from-[#001C3D] via-[#003066] to-[#001C3D] text-white'>
                <div className='bg-linear-to-r from-[#001C3D] via-[#003066] to-[#001C3D] text-white shadow-lg'>
                    <div className='container mx-auto px-4 py-2.5 flex items-center justify-between'>
                        
                        {/* Logo */}
                        <Link href={'/'} className="shrink-0">
                           <img src='/logo.png' alt='Logo' className='w-12 md:w-14 object-contain' />
                        </Link>

                        {/* MÓVIL: Solo icono de perfil */}
                        <div className='md:hidden'>
                            {user ? (
                                <div className='flex items-center gap-2'>

                                <Link href='/perfil' className={getBtnStyle('/perfil')}>
                                    <User size={20} />
                                </Link>

                                <button 
                                        onClick={logout} 
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 transition-all"
                                    >
                                        <LogOut size={18} />
                                        <span className="text-xs font-bold">Salir</span>
                                    </button>
                                </div>
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

                                    <Link href='/chat' className={getBtnStyle('/chat')}>
                                        <MessageCircle size={18} />
                                        <span className="text-xs font-bold">Chat</span>
                                    </Link>

                                    <button 
                                        onClick={logout} 
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 transition-all"
                                    >
                                        <LogOut size={18} />
                                        <span className="text-xs font-bold">Salir</span>
                                    </button>
                                </>
                            ) : (
                                <Link href='/login' className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-yellow-400 bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 transition-all shadow-lg">
                                    <User size={18} />
                                    <span className="text-sm">Ingresar</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* DESKTOP: Buscador dentro del header sticky */}
                {pathname === '/' && setSearchTerm && (
                    <div className='hidden md:block'>
                        {renderSearchBar()}
                    </div>
                )}
            </header>

            {/* MÓVIL: Buscador sticky independiente */}
            {pathname === '/' && setSearchTerm && (
                <div className='md:hidden sticky top-0 z-40'>
                    {renderSearchBar()}
                </div>
            )}
       </> 
    )
}