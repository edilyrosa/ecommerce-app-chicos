// // app/checkout/page.jsx
// 'use client';
// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../../context/authContext';
// import Header from '../../components/Header';
// import TablaItems from '../../components/TablaItems';
// import toast from 'react-hot-toast';
// import Cookies from 'js-cookie';
// import { CheckCircle } from 'lucide-react';

// export default function Checkout() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [procesando, setProcesando] = useState(false);
//   const { user, updateCartCount } = useAuth();
//   const router = useRouter();

//   const fetchCarrito = useCallback(async () => {
//     try {
//       const token = Cookies.get('token');
//       const res = await fetch('/api/carrito', {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         if (data.length === 0) {
//           toast.error('Tu carrito está vacío');
//           router.push('/carrito');
//           return;
//         }
//         setItems(data);
//       }
//     } catch {
//       toast.error('Error de conexión');
//     } finally {
//       setLoading(false);
//     }
//   }, [router]);

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

//   const eliminarItem = useCallback(async (carritoId) => {
//     setItems(prev => prev.filter(i => i.carrito_id !== carritoId));
    
//     try {
//       const token = Cookies.get('token');
//       await fetch('/api/carrito/eliminar', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify({ carritoId })
//       });
//       updateCartCount();
//       toast.success('Producto removido');
//     } catch {
//       fetchCarrito();
//     }
//   }, [fetchCarrito, updateCartCount]);

//   const ajustarCantidad = useCallback(async (carritoId, delta) => {
//     setItems(prev => 
//       prev.map(i => 
//         i.carrito_id === carritoId 
//           ? { ...i, cantidad: Math.max(1, i.cantidad + delta) } 
//           : i
//       )
//     );

//     try {
//       const token = Cookies.get('token');
//       await fetch('/api/carrito/ajustar', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify({ carritoId, delta })
//       });
//       updateCartCount();
//     } catch {
//       fetchCarrito();
//     }
//   }, [fetchCarrito, updateCartCount]);

//   const confirmarPago = async () => {
//     setProcesando(true);
    
//     setTimeout(async () => {
//       try {
//         const token = Cookies.get('token');
//         const res = await fetch('/api/carrito/vaciar', {
//           method: 'DELETE',
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//         const data = await res.json();

//         if (!res.ok) {
//           toast.error(data.error || 'Error al procesar el pago');
//           fetchCarrito();
//           return;
//         }

//         toast.success('¡Compra exitosa!', { icon: '🎉', duration: 4000 });
//         setItems([]);
//         updateCartCount();
//         setTimeout(() => router.push('/'), 2000);
//       } catch {
//         toast.error('Error de conexión');
//       } finally {
//         setProcesando(false);
//       }
//     }, 2000);
//   };

//   const subtotal = useMemo(() => 
//     items.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0), 
//     [items]
//   );
  
//   const itemsConError = useMemo(() => 
//     items.filter(item => item.cantidad > (item.stock || 0)), 
//     [items]
//   );
//   const tieneErrores = itemsConError.length > 0;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <Header />
//         <main className="flex-1 container mx-auto px-4 py-8">
//           <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-8" />
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2 space-y-4">
//               {[...Array(3)].map((_, i) => (
//                 <div key={i} className="p-5 rounded-2xl bg-white flex gap-5 animate-pulse">
//                   <div className="w-24 h-24 bg-gray-200 rounded-xl" />
//                   <div className="flex-1 space-y-3">
//                     <div className="h-6 bg-gray-200 rounded w-1/2" />
//                     <div className="h-4 bg-gray-100 rounded w-1/4" />
//                     <div className="h-8 bg-gray-200 rounded w-full" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="lg:col-span-1">
//               <div className="bg-white p-8 rounded-3xl space-y-6 animate-pulse">
//                 <div className="h-7 bg-gray-200 rounded w-1/2" />
//                 <div className="h-10 bg-gray-100 rounded" />
//                 <div className="h-16 bg-green-100 rounded-2xl" />
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Header />
//       <main className="flex-1 container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-8 text-gray-800">Finalizar Compra</h1>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Items */}
//           <div className="lg:col-span-2">
//             <TablaItems 
//               items={items}
//               onAjustarCantidad={ajustarCantidad}
//               onEliminarItem={eliminarItem}
//               mostrarControles={true}
//             />
//           </div>

//           {/* Resumen */}
//           <div className="lg:col-span-1">
//             <div className="bg-white p-8 rounded-3xl shadow-xl sticky top-24 border border-gray-100">
//               <h2 className="text-xl font-bold mb-6 text-gray-800">Resumen de Pago</h2>
//               <div className="space-y-4 border-b border-dashed pb-6 mb-6">
//                 <div className="flex justify-between text-gray-500">
//                   <span>Subtotal:</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-500">
//                   <span>IVA (16%):</span>
//                   <span>${(subtotal * 0.16).toFixed(2)}</span>
//                 </div>
//               </div>
//               <div className="flex justify-between text-3xl font-black text-gray-900 mb-8">
//                 <span>Total:</span>
//                 <span className="text-green-600">${(subtotal * 1.16).toFixed(2)}</span>
//               </div>

//               <button
//                 onClick={confirmarPago}
//                 disabled={procesando || items.length === 0 || tieneErrores}
//                 className="w-full bg-green-600 text-white py-4 rounded-2xl hover:bg-green-700 font-black text-lg transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
//               >
//                 {procesando ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Procesando...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle size={22} />
//                     Confirmar Pago
//                   </>
//                 )}
//               </button>
              
//               {tieneErrores && (
//                 <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
//                   <p className="text-red-500 text-[10px] text-center font-black uppercase tracking-widest leading-tight">
//                     ⚠️ CORRIGE EL STOCK MARCADO EN ROJO
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }






// app/checkout/page.jsx
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import Header from '../../components/Header';
import TablaItems from '../../components/TablaItems';
import BottomNav from '../../components/BottomNav';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { CheckCircle } from 'lucide-react';

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('todas');
  
  const { user, updateCartCount } = useAuth();
  const router = useRouter();

  const fetchCarrito = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/carrito', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length === 0) {
          toast.error('Tu carrito está vacío');
          router.push('/carrito');
          return;
        }
        setItems(data);
        setFilteredItems(data);
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [router]);

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

  const eliminarItem = useCallback(async (carritoId) => {
    setItems(prev => prev.filter(i => i.carrito_id !== carritoId));
    
    try {
      const token = Cookies.get('token');
      await fetch('/api/carrito/eliminar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ carritoId })
      });
      updateCartCount();
      toast.success('Producto removido');
    } catch {
      fetchCarrito();
    }
  }, [fetchCarrito, updateCartCount]);

  const ajustarCantidad = useCallback(async (carritoId, delta) => {
    setItems(prev => 
      prev.map(i => 
        i.carrito_id === carritoId 
          ? { ...i, cantidad: Math.max(1, i.cantidad + delta) } 
          : i
      )
    );

    try {
      const token = Cookies.get('token');
      await fetch('/api/carrito/ajustar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ carritoId, delta })
      });
      updateCartCount();
    } catch {
      fetchCarrito();
    }
  }, [fetchCarrito, updateCartCount]);

  // ← CALCULAR SUBTOTAL ANTES DE useMemo
  const subtotal = useMemo(() => 
    items.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0), 
    [items]
  );
  
  const itemsConError = useMemo(() => 
    filteredItems.filter(item => item.cantidad > (item.stock || 0)), 
    [filteredItems]
  );
  const tieneErrores = itemsConError.length > 0;

  // ← FUNCIÓN CORREGIDA
  const confirmarPago = async () => {
    setProcesando(true);
    
    setTimeout(async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch('/api/carrito/vaciar', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || 'Error al procesar el pago');
          fetchCarrito();
          setProcesando(false);
          return;
        }

        // Guardar datos de la factura
        const facturaData = {
          numeroFactura: `FAC-${Date.now().toString().slice(-8)}`,
          fecha: new Date().toLocaleDateString('es-MX', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          hora: new Date().toLocaleTimeString('es-MX', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          usuario: {
            nombre: user.nombre,
            email: user.email
          },
          items: items.map(item => ({
            nombre: item.nombre,
            descripcion: item.descripcion || '',
            cantidad: item.cantidad,
            precio: item.precio
          })),
          subtotal: subtotal,
          iva: subtotal * 0.16,
          total: subtotal * 1.16
        };

        localStorage.setItem('facturaData', JSON.stringify(facturaData));

        toast.success('¡Compra exitosa!', { icon: '🎉', duration: 3000 });
        setItems([]);
        updateCartCount();
        
        setTimeout(() => router.push('/factura'), 1500);
      } catch {
        toast.error('Error de conexión');
      } finally {
        setProcesando(false);
      }
    }, 2000);
  };

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
          <div className="h-8 md:h-10 w-48 md:w-64 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-lg animate-pulse mb-6 md:mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 md:p-5 rounded-2xl bg-white border border-blue-50 flex gap-4 md:gap-5 animate-pulse">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-yellow-50 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 md:h-6 bg-blue-100 rounded w-2/3" />
                    <div className="h-3 md:h-4 bg-yellow-50 rounded w-1/3" />
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-3 bg-blue-50 rounded w-20" />
                      <div className="h-7 md:h-8 bg-gradient-to-r from-blue-100 to-yellow-100 rounded w-28" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-blue-50 space-y-6 animate-pulse">
                <div className="h-6 md:h-7 bg-gradient-to-r from-blue-100 to-yellow-100 rounded w-2/3" />
                <div className="space-y-4 border-b border-dashed border-blue-100 pb-6">
                  <div className="flex justify-between">
                    <div className="h-4 bg-blue-50 rounded w-20" />
                    <div className="h-4 bg-blue-50 rounded w-16" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-yellow-50 rounded w-24" />
                    <div className="h-4 bg-yellow-50 rounded w-16" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="h-8 md:h-10 bg-blue-100 rounded w-24" />
                  <div className="h-8 md:h-10 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded w-32" />
                </div>
                <div className="h-14 md:h-16 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-xl md:rounded-2xl" />
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
      
      <main className="flex-1 container mx-auto px-3 md:px-6 py-4 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 md:mb-0" style={{ color: '#00162f' }}>
            Finalizar Compra
          </h1>
          
          {searchTerm && (
            <p className="text-xs md:text-sm text-gray-600 font-medium">
              {filteredItems.length} de {items.length} producto{items.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {filteredItems.length === 0 && searchTerm ? (
          <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-md border border-blue-50">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
              <span className="text-2xl md:text-3xl">🔍</span>
            </div>
            <p className="text-base md:text-lg text-gray-600 mb-4 font-semibold">
              No se encontraron productos con: {searchTerm}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <TablaItems 
                items={filteredItems}
                onAjustarCantidad={ajustarCantidad}
                onEliminarItem={eliminarItem}
                mostrarControles={true}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl sticky top-24 border" style={{ borderColor: '#00162f20' }}>
                <h2 className="text-lg md:text-xl font-black mb-4 md:mb-6" style={{ color: '#00162f' }}>
                  {searchTerm ? 'Total Filtrado' : 'Resumen de Pago'}
                </h2>
                
                <div className="space-y-3 md:space-y-4 border-b border-dashed pb-4 md:pb-6 mb-4 md:mb-6" style={{ borderColor: '#00162f20' }}>
                  <div className="flex justify-between text-sm md:text-base text-gray-600 font-medium">
                    <span>Subtotal:</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-600 font-medium">
                    <span>IVA (16%):</span>
                    <span className="font-bold">${(subtotal * 0.16).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-2xl md:text-3xl font-black mb-6 md:mb-8" style={{ color: '#00162f' }}>
                  <span>Total:</span>
                  <span style={{ color: '#fbbf24' }}>
                    ${(subtotal * 1.16).toFixed(2)}
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
                  onClick={confirmarPago}
                  disabled={procesando || filteredItems.length === 0 || tieneErrores}
                  className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg transition-all shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2 md:gap-3"
                  style={{
                    backgroundColor: procesando || tieneErrores ? '#e5e7eb' : '#fbbf24',
                    color: procesando || tieneErrores ? '#9ca3af' : '#00162f'
                  }}
                >
                  {procesando ? (
                    <>
                      <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00162f' }} />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} className="md:w-6 md:h-6" />
                      Confirmar Pago
                    </>
                  )}
                </button>
                
                {tieneErrores && (
                  <div className="mt-4 p-3 rounded-xl border-2" style={{ backgroundColor: '#fef2f220', borderColor: '#ef444450' }}>
                    <p className="text-red-600 text-[10px] md:text-xs text-center font-black uppercase tracking-wider leading-tight">
                      ⚠️ CORRIGE EL STOCK MARCADO EN ROJO
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <BottomNav setCategory={setCategory} currentCategory={category} />
    </div>
  );
}