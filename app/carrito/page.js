// // app/carrito/page.jsx
// 'use client';
// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../../context/authContext';
// import Header from '../../components/Header';
// import TablaItems from '../../components/TablaItems';
// import toast from 'react-hot-toast';
// import Cookies from 'js-cookie';
// import PromoBanner from "@/components/PromoBanner";
// import BottomNav from "@/components/BottomNav";

// export default function Carrito() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   //&
//   const [category, setCategory] = useState('todas')
//   const [searchTerm, setSearchTerm] = useState('')


//   const { user, cartCount, setCartCount } = useAuth();
//   const router = useRouter();

//   const fetchCarrito = useCallback(async () => {
//     try {
//       const token = Cookies.get('token');
//       const res = await fetch('/api/carrito', {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setItems(data);
//       } else {
//         toast.error('Error al cargar carrito');
//       }
//     } catch {
//       toast.error('Error de conexión');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const token = Cookies.get('token');
//     if (!user && !token) {
//       router.push('/login');
//       return;
//     }
//     if (token) {
//       fetchCarrito();
//     }
//   }, [user, fetchCarrito, router]);

//   useEffect(() => {
//     if (items.length >= 0) {
//       const totalUnits = items.reduce((s, it) => s + (it.cantidad || 0), 0);
//       if (cartCount !== totalUnits) {
//         setCartCount(totalUnits);
//       }
//     }
//   }, [items, cartCount, setCartCount]);

//   const total = useMemo(
//     () => items.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0),
//     [items]
//   );

//   const eliminarItem = useCallback(async (carritoId) => {
//     // Actualización optimista
//     setItems(prev => prev.filter(i => i.carrito_id !== carritoId));
    
//     try {
//       const token = Cookies.get('token');
//       const res = await fetch('/api/carrito/eliminar', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ carritoId })
//       });
      
//       if (res.ok) {
//         toast.success('Producto eliminado');
//       } else {
//         // Si falla, refrescar
//         await fetchCarrito();
//       }
//     } catch {
//       await fetchCarrito();
//     }
//   }, [fetchCarrito]);

//   const ajustarCantidad = useCallback(async (carritoId, delta) => {
//     // Actualización optimista
//     setItems(prev => 
//       prev.map(item =>
//         item.carrito_id === carritoId
//           ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
//           : item
//       )
//     );

//     try {
//       const token = Cookies.get('token');
//       const res = await fetch('/api/carrito/ajustar', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ carritoId, delta })
//       });
      
//       if (!res.ok) {
//         // Si falla, refrescar desde servidor
//         await fetchCarrito();
//       }
//     } catch {
//       await fetchCarrito();
//     }
//   }, [fetchCarrito]);

//   const itemsConError = useMemo(() => items.filter(item => item.cantidad > (item.stock || 0)), [items]);
//   const tieneErrores = itemsConError.length > 0;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
//           <Header 
//         searchTerm={searchTerm} 
//         setSearchTerm={setSearchTerm}
//         setCategory={setCategory} 
//         currentCategory={category}
//         />



//         <main className="flex-1 container mx-auto px-3 md:px-6 py-4 md:py-8">
//           <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-8" />
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 space-y-4">
//               {[...Array(3)].map((_, i) => (
//                 <div key={i} className="p-4 rounded-2xl bg-white border flex gap-4 animate-pulse">
//                   <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-xl" />
//                   <div className="flex-1 space-y-3">
//                     <div className="h-4 bg-gray-200 rounded w-3/4" />
//                     <div className="h-3 bg-gray-100 rounded w-1/4" />
//                     <div className="h-6 bg-gray-200 rounded w-full" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="lg:col-span-1">
//               <div className="bg-white p-6 rounded-2xl space-y-4 animate-pulse">
//                 <div className="h-4 bg-gray-200 rounded w-1/2" />
//                 <div className="h-10 bg-gray-100 rounded" />
//                 <div className="h-12 bg-green-200 rounded-xl" />
//               </div>
//             </div>
//           </div>
//         </main>
        

//           <BottomNav setCategory={setCategory} currentCategory={category} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
//       <Header />
//       <div className="container mx-auto px-3 md:px-6">
//         <div className="mt-3 md:mt-4 mb-4 md:mb-6">
//           <PromoBanner />
//         </div>
//       </div>

//       <main className="flex-1 container mx-auto px-3 md:px-6 py-4 md:py-8">
//         <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-gray-800">
//           Mi Carrito
//         </h1>
        
//         {items.length === 0 ? (
//           <div className="text-center py-12 md:py-16 bg-white rounded-lg shadow-md">
//             <p className="text-gray-600 text-base md:text-lg mb-4">Tu carrito está vacío</p>
//             <button 
//               onClick={() => router.push('/')} 
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//             >
//               Ir a comprar
//             </button>
//           </div>
//         ) : (
//           <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Items */}
//             <div className="lg:col-span-2">
//               <TablaItems 
//                 items={items}
//                 onAjustarCantidad={ajustarCantidad}
//                 onEliminarItem={eliminarItem}
//                 mostrarControles={true}
//               />
//             </div>

//             {/* Resumen */}
//             <div className="lg:col-span-1">
//               <div className="bg-white p-6 rounded-2xl shadow-md sticky top-24 border border-gray-100">
//                 <h2 className="text-lg font-bold mb-4 text-gray-800">Total Carrito</h2>
//                 <div className="flex justify-between text-2xl font-black text-gray-900 mb-6">
//                   <span>Total:</span>
//                   <span className="text-blue-600">${total.toFixed(2)}</span>
//                 </div>
//                 <button
//                   onClick={() => router.push('/checkout')}
//                   disabled={tieneErrores}
//                   className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-bold transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
//                 >
//                   {tieneErrores ? 'Corrige el stock' : 'Proceder al Pago'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//        <BottomNav setCategory={setCategory} currentCategory={category} />
//     </div>
//   );
// }








// // app/carrito/page.jsx
// 'use client';
// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../../context/authContext';
// import Header from '../../components/Header';
// import TablaItems from '../../components/TablaItems';
// import toast from 'react-hot-toast';
// import Cookies from 'js-cookie';
// import PromoBanner from "@/components/PromoBanner";
// import BottomNav from "@/components/BottomNav";

// export default function Carrito() {
//   const [items, setItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]); // ← NUEVO
//   const [loading, setLoading] = useState(true);
//   const [category, setCategory] = useState('todas');
//   const [searchTerm, setSearchTerm] = useState('');

//   const { user, cartCount, setCartCount } = useAuth();
//   const router = useRouter();

//   const fetchCarrito = useCallback(async () => {
//     try {
//       const token = Cookies.get('token');
//       const res = await fetch('/api/carrito', {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setItems(data);
//         setFilteredItems(data); // ← INICIALIZAR filteredItems
//       } else {
//         toast.error('Error al cargar carrito');
//       }
//     } catch {
//       toast.error('Error de conexión');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const token = Cookies.get('token');
//     if (!user && !token) {
//       router.push('/login');
//       return;
//     }
//     if (token) {
//       fetchCarrito();
//     }
//   }, [user, fetchCarrito, router]);

//   useEffect(() => {
//     if (items.length >= 0) {
//       const totalUnits = items.reduce((s, it) => s + (it.cantidad || 0), 0);
//       if (cartCount !== totalUnits) {
//         setCartCount(totalUnits);
//       }
//     }
//   }, [items, cartCount, setCartCount]);

//   // ← NUEVO: Filtrado por búsqueda
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredItems(items);
//       return;
//     }

//     const filtered = items.filter(item => 
//       item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
    
//     setFilteredItems(filtered);
//   }, [searchTerm, items]);

//   // ← CAMBIO: Calcular total basado en filteredItems
//   const total = useMemo(
//     () => filteredItems.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0),
//     [filteredItems]
//   );

//   const eliminarItem = useCallback(async (carritoId) => {
//     setItems(prev => prev.filter(i => i.carrito_id !== carritoId));
    
//     try {
//       const token = Cookies.get('token');
//       const res = await fetch('/api/carrito/eliminar', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ carritoId })
//       });
      
//       if (res.ok) {
//         toast.success('Producto eliminado');
//       } else {
//         await fetchCarrito();
//       }
//     } catch {
//       await fetchCarrito();
//     }
//   }, [fetchCarrito]);

//   const ajustarCantidad = useCallback(async (carritoId, delta) => {
//     setItems(prev => 
//       prev.map(item =>
//         item.carrito_id === carritoId
//           ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
//           : item
//       )
//     );

//     try {
//       const token = Cookies.get('token');
//       const res = await fetch('/api/carrito/ajustar', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ carritoId, delta })
//       });
      
//       if (!res.ok) {
//         await fetchCarrito();
//       }
//     } catch {
//       await fetchCarrito();
//     }
//   }, [fetchCarrito]);

//   // ← CAMBIO: Calcular errores basado en filteredItems
//   const itemsConError = useMemo(() => 
//     filteredItems.filter(item => item.cantidad > (item.stock || 0)), 
//     [filteredItems]
//   );
//   const tieneErrores = itemsConError.length > 0;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
//         <Header 
//           searchTerm={searchTerm} 
//           setSearchTerm={setSearchTerm}
//           setCategory={setCategory} 
//           currentCategory={category}
//         />
//         <main className="flex-1 container mx-auto px-3 md:px-6 py-4 md:py-8">
//           <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-8" />
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 space-y-4">
//               {[...Array(3)].map((_, i) => (
//                 <div key={i} className="p-4 rounded-2xl bg-white border flex gap-4 animate-pulse">
//                   <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-xl" />
//                   <div className="flex-1 space-y-3">
//                     <div className="h-4 bg-gray-200 rounded w-3/4" />
//                     <div className="h-3 bg-gray-100 rounded w-1/4" />
//                     <div className="h-6 bg-gray-200 rounded w-full" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="lg:col-span-1">
//               <div className="bg-white p-6 rounded-2xl space-y-4 animate-pulse">
//                 <div className="h-4 bg-gray-200 rounded w-1/2" />
//                 <div className="h-10 bg-gray-100 rounded" />
//                 <div className="h-12 bg-green-200 rounded-xl" />
//               </div>
//             </div>
//           </div>
//         </main>
//         <BottomNav setCategory={setCategory} currentCategory={category} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
//       <Header 
//         searchTerm={searchTerm} 
//         setSearchTerm={setSearchTerm}
//         setCategory={setCategory} 
//         currentCategory={category}
//       />
//       <div className="container mx-auto px-3 md:px-6">
//         <div className="mt-3 md:mt-4 mb-4 md:mb-6">
//           <PromoBanner />
//         </div>
//       </div>

//       <main className="flex-1 container mx-auto px-3 md:px-6 py-4 md:py-8">
//         <div className="flex items-center justify-between mb-4 md:mb-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//             Mi Carrito
//           </h1>
          
//           {/* ← NUEVO: Mostrar cantidad filtrada */}
//           {searchTerm && (
//             <p className="text-sm text-gray-600">
//               {filteredItems.length} de {items.length} producto{items.length !== 1 ? 's' : ''}
//             </p>
//           )}
//         </div>
        
//         {items.length === 0 ? (
//           <div className="text-center py-12 md:py-16 bg-white rounded-lg shadow-md">
//             <p className="text-gray-600 text-base md:text-lg mb-4">Tu carrito está vacío</p>
//             <button 
//               onClick={() => router.push('/')} 
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//             >
//               Ir a comprar
//             </button>
//           </div>
//         ) : filteredItems.length === 0 ? (
//           // ← NUEVO: Estado cuando hay items pero ninguno coincide con la búsqueda
//           <div className="text-center py-12 md:py-16 bg-white rounded-lg shadow-md">
//             <p className="text-gray-600 text-base md:text-lg mb-4">
//               No se encontraron productos con el termino: {searchTerm}
//             </p>
//             <button 
//               onClick={() => setSearchTerm('')} 
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//             >
//               Limpiar búsqueda
//             </button>
//           </div>
//         ) : (
//           <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Items - ← CAMBIO: Usar filteredItems */}
//             <div className="lg:col-span-2">
//               <TablaItems 
//                 items={filteredItems}
//                 onAjustarCantidad={ajustarCantidad}
//                 onEliminarItem={eliminarItem}
//                 mostrarControles={true}
//               />
//             </div>

//             {/* Resumen */}
//             <div className="lg:col-span-1">
//               <div className="bg-white p-6 rounded-2xl shadow-md sticky top-24 border border-gray-100">
//                 <h2 className="text-lg font-bold mb-4 text-gray-800">
//                   {searchTerm ? 'Total Filtrado' : 'Total Carrito'}
//                 </h2>
//                 <div className="flex justify-between text-2xl font-black text-gray-900 mb-6">
//                   <span>Total:</span>
//                   <span className="text-blue-600">${total.toFixed(2)}</span>
//                 </div>
                
//                 {/* ← NUEVO: Mostrar advertencia si está filtrando */}
//                 {searchTerm && items.length !== filteredItems.length && (
//                   <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                     <p className="text-xs text-yellow-800 font-medium">
//                       ⚠️ Mostrando solo productos filtrados. 
//                       <button 
//                         onClick={() => setSearchTerm('')}
//                         className="underline ml-1 font-bold hover:text-yellow-900"
//                       >
//                         Ver todos
//                       </button>
//                     </p>
//                   </div>
//                 )}

//                 <button
//                   onClick={() => router.push('/checkout')}
//                   disabled={tieneErrores}
//                   className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-bold transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
//                 >
//                   {tieneErrores ? 'Corrige el stock' : 'Proceder al Pago'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//       <BottomNav setCategory={setCategory} currentCategory={category} />
//     </div>
//   );
// }




// app/carrito/page.jsx
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import Header from '../../components/Header';
import TablaItems from '../../components/TablaItems';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import PromoBanner from "@/components/PromoBanner";
import BottomNav from "@/components/BottomNav";

export default function Carrito() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');

  const { user, cartCount, setCartCount } = useAuth();
  const router = useRouter();

  const fetchCarrito = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/carrito', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
        setFilteredItems(data);
      } else {
        toast.error('Error al cargar carrito');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!user && !token) {
      router.push('/login');
      return;
    }
    if (token) {
      fetchCarrito();
    }
  }, [user, fetchCarrito, router]);

  useEffect(() => {
    if (items.length >= 0) {
      const totalUnits = items.reduce((s, it) => s + (it.cantidad || 0), 0);
      if (cartCount !== totalUnits) {
        setCartCount(totalUnits);
      }
    }
  }, [items, cartCount, setCartCount]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item => 
      item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const total = useMemo(
    () => filteredItems.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0),
    [filteredItems]
  );

  const eliminarItem = useCallback(async (carritoId) => {
    setItems(prev => prev.filter(i => i.carrito_id !== carritoId));
    
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/carrito/eliminar', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ carritoId })
      });
      
      if (res.ok) {
        toast.success('Producto eliminado');
      } else {
        await fetchCarrito();
      }
    } catch {
      await fetchCarrito();
    }
  }, [fetchCarrito]);

  const ajustarCantidad = useCallback(async (carritoId, delta) => {
    setItems(prev => 
      prev.map(item =>
        item.carrito_id === carritoId
          ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
          : item
      )
    );

    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/carrito/ajustar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ carritoId, delta })
      });
      
      if (!res.ok) {
        await fetchCarrito();
      }
    } catch {
      await fetchCarrito();
    }
  }, [fetchCarrito]);

  const itemsConError = useMemo(() => 
    filteredItems.filter(item => item.cantidad > (item.stock || 0)), 
    [filteredItems]
  );
  const tieneErrores = itemsConError.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
        <Header 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          setCategory={setCategory} 
          currentCategory={category}
        />
        <main className="flex-1 container mx-auto px-3 md:px-6 py-4 md:py-8">
          <div className="h-8 md:h-10 w-40 md:w-48 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-lg animate-pulse mb-6 md:mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-blue-50 flex gap-4 animate-pulse">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-yellow-50 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 md:h-5 bg-blue-100 rounded w-3/4" />
                    <div className="h-3 bg-yellow-50 rounded w-1/4" />
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-3 bg-blue-50 rounded w-16" />
                      <div className="h-6 md:h-7 bg-gradient-to-r from-blue-100 to-yellow-100 rounded w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-50 space-y-4 animate-pulse">
                <div className="h-5 bg-gradient-to-r from-blue-100 to-yellow-100 rounded w-1/2" />
                <div className="h-10 bg-yellow-100 rounded" />
                <div className="h-12 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-xl" />
              </div>
            </div>
          </div>
        </main>
        <BottomNav setCategory={setCategory} currentCategory={category} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        setCategory={setCategory} 
        currentCategory={category}
      />
      <div className="container mx-auto px-3 md:px-6">
        <div className="mt-3 md:mt-4 mb-4 md:mb-6">
          <PromoBanner />
        </div>
      </div>

      <main className="flex-1 container mx-auto px-3 md:px-6 py-4 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 md:mb-0" style={{ color: '#00162f' }}>
            Mi Carrito
          </h1>
          
          {searchTerm && (
            <p className="text-xs md:text-sm text-gray-600 font-medium">
              {filteredItems.length} de {items.length} producto{items.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-md border border-blue-50">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
              <span className="text-2xl md:text-3xl">🛒</span>
            </div>
            <p className="text-base md:text-lg text-gray-600 mb-4 font-semibold">Tu carrito está vacío</p>
            <button 
              onClick={() => router.push('/')} 
              className="px-6 py-2.5 rounded-xl font-bold text-sm md:text-base transition-all shadow-lg hover:opacity-90"
              style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
            >
              Ir a comprar
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-md border border-blue-50">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
              <span className="text-2xl md:text-3xl">🔍</span>
            </div>
            <p className="text-base md:text-lg text-gray-600 mb-4 font-semibold">
              No se encontraron productos con el termino: {searchTerm}
            </p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="px-6 py-2.5 rounded-xl font-bold text-sm md:text-base transition-all shadow-lg"
              style={{ backgroundColor: '#00162f', color: 'white' }}
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TablaItems 
                items={filteredItems}
                onAjustarCantidad={ajustarCantidad}
                onEliminarItem={eliminarItem}
                mostrarControles={true}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24 border" style={{ borderColor: '#00162f20' }}>
                <h2 className="text-lg md:text-xl font-black mb-4" style={{ color: '#00162f' }}>
                  {searchTerm ? 'Total Filtrado' : 'Total Carrito'}
                </h2>
                
                <div className="flex justify-between text-2xl md:text-3xl font-black mb-6" style={{ color: '#00162f' }}>
                  <span>Total:</span>
                  <span className="bg-linear-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
                
                {searchTerm && items.length !== filteredItems.length && (
                  <div className="mb-4 p-3 rounded-lg border-2" style={{ backgroundColor: '#fef3c720', borderColor: '#fbbf2450' }}>
                    <p className="text-[10px] md:text-xs font-bold" style={{ color: '#00162f' }}>
                      ⚠️ Mostrando solo productos filtrados.
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="underline ml-1 hover:opacity-80"
                        style={{ color: '#fbbf24' }}
                      >
                        Ver todos
                      </button>
                    </p>
                  </div>
                )}

                <button
                  onClick={() => router.push('/checkout')}
                  disabled={tieneErrores}
                  className="w-full py-3 rounded-xl font-black text-base md:text-lg transition-all shadow-xl disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: tieneErrores ? '#e5e7eb' : '#fbbf24',
                    color: tieneErrores ? '#9ca3af' : '#00162f'
                  }}
                >
                  {tieneErrores ? 'Corrige el stock' : 'Proceder al Pago'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <BottomNav setCategory={setCategory} currentCategory={category} />
    </div>
  );
}