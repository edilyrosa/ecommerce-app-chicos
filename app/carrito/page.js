'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import Header from '../../components/Header';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Trash2, Plus, Minus, AlertCircle } from 'lucide-react';
import PromoBanner from "@/components/PromoBanner"
import BottomNav from "@/components/BottomNav"

export default function Carrito() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, cartCount, setCartCount } = useAuth();
  const router = useRouter();

  const getPrimeraImagen = (imagen_url) => {
    if (!imagen_url) return '/placeholder.jpg';
    const imagenes = imagen_url.split(',').map(img => img.trim()).filter(img => img.length > 0);
    return imagenes[0] || '/placeholder.jpg';
  };

  const fetchCarrito = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/carrito', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
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

// Si hay token pero el usuario aún no carga en el contexto, 
  // no redirigimos, simplemente esperamos a que fetchCarrito haga su trabajo
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

  const total = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0),
    [items]
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
      if (!res.ok) fetchCarrito();
      else toast.success('Producto eliminado');
    } catch {
      fetchCarrito();
    }
  }, [fetchCarrito]);

  const ajustarCantidad = useCallback(async (carritoId, delta) => {
    setItems(prev => 
      prev.map(item =>
        item.carrito_id === carritoId
          ? { ...item, cantidad: item.cantidad + delta }
          : item
      ).filter(i => i.cantidad > 0)
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
      if (!res.ok) fetchCarrito();
    } catch {
      fetchCarrito();
    }
  }, [fetchCarrito]);

  const itemsConError = useMemo(() => items.filter(item => item.cantidad > (item.stock || 0)), [items]);
  const tieneErrores = itemsConError.length > 0;

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex flex-col bg-gray-50">
  //       <Header />
  //       <main className="flex-1 container mx-auto px-4 py-8 text-center">
  //         <p className="text-gray-600">Cargando carrito...</p>
  //       </main>
  //     </div>
  //   );
  // }

  if (loading) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
      <Header />
      <main className="flex-1 container mx-auto px-3 md:px-6 py-4 md:py-8">
        
        {/* //* Título Skeleton */}
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Generamos 3 tarjetas de carga */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-transparent flex gap-4 animate-pulse">
                {/* Imagen finta */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-xl" />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      {/* Nombre y stock finto */}
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                    {/* Botones fintos */}
                    <div className="h-8 w-20 bg-gray-100 rounded-xl" />
                  </div>
                  {/* Precio finto */}
                  <div className="flex justify-between items-end mt-6">
                    <div className="h-3 bg-gray-100 rounded w-16" />
                    <div className="h-6 bg-blue-200 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen lateral Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-100 rounded" />
               {/* Botón de pago finto */}
              <div className="h-12 bg-green-200 rounded-xl" />
            
            </div>
          </div>
        </div>

        
      </main>
      <BottomNav />
    </div>
  );
}

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
      <Header />
      <div className="container mx-auto px-3 md:px-6">
        <div className="mt-3 md:mt-4 mb-4 md:mb-6">
          <PromoBanner />
        </div>
      </div>

      <main className="flex-1 container mx-auto px-3 md:px-6 py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-gray-800">Mi Carrito</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-base md:text-lg mb-4">Tu carrito está vacío</p>
            <button onClick={() => router.push('/')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
              Ir a comprar
            </button>
          </div>
        ) : (
          <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => {
                const stockReal = item.stock || 0;
                const esError = item.cantidad > stockReal;

                return (
                  <div 
                    key={item.carrito_id} 
                    className={`p-4 rounded-2xl shadow-sm border-2 flex gap-4 transition-all duration-300 ${
                      esError ? 'bg-red-50 border-red-400' : 'bg-white border-transparent'
                    }`}
                  >
                    <img
                      src={getPrimeraImagen(item.imagen_url)}
                      alt={item.nombre}
                      className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-xl bg-gray-50 border"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-sm md:text-base text-gray-800 line-clamp-1">{item.nombre}</h3>
                          
                          {/* Semáforo de Stock */}
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${stockReal === 0 ? 'bg-red-600' : stockReal <= 3 ? 'bg-red-500' : stockReal <= 10 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                            <span className={`text-[10px] md:text-xs font-bold ${stockReal <= 3 ? 'text-red-500' : stockReal <= 10 ? 'text-yellow-600' : 'text-green-500'}`}>
                              {stockReal > 0 ? `${stockReal} en stock` : 'Agotado'}
                            </span>
                          </div>
                        </div>

                        {/* Controles Estilo Checkout */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-gray-100 rounded-xl p-1">
                            <button onClick={() => ajustarCantidad(item.carrito_id, -1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition text-gray-600">
                              <Minus size={14} />
                            </button>
                            <span className="font-bold px-2 text-xs md:text-sm text-gray-800">{item.cantidad}</span>
                            <button 
                              onClick={() => ajustarCantidad(item.carrito_id, 1)} 
                              disabled={item.cantidad >= stockReal}
                              className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition text-gray-600 disabled:opacity-20"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button onClick={() => eliminarItem(item.carrito_id)} className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-3">
                        <p className="text-[10px] text-gray-500">Unitario: ${(Number(item.precio)).toFixed(2)}</p>
                        <p className="text-base md:text-lg font-black text-blue-600">
                          ${(Number(item.precio) * item.cantidad).toFixed(2)}
                        </p>
                      </div>

                      {esError && (
                        <div className="mt-2 py-1.5 px-3 bg-white/50 rounded-lg flex items-center gap-2 text-red-600 text-[10px] font-black uppercase">
                          <AlertCircle size={12} />
                          {stockReal === 0 ? "Eliminar del carrito" : `Solo hay ${stockReal} disponibles`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumen lateral */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-md sticky top-24 border border-gray-100">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Total Carrito</h2>
                <div className="flex justify-between text-2xl font-black text-gray-900 mb-6">
                  <span>Total:</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => router.push('/checkout')}
                  disabled={tieneErrores}
                  className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-bold transition disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {tieneErrores ? 'Corrige el stock' : 'Proceder al Pago'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}