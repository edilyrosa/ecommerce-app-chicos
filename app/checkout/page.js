'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import Header from '../../components/Header';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Trash2, Plus, Minus, AlertCircle, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const { user, updateCartCount } = useAuth();
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
        if (data.length === 0) router.push('/carrito');
        setItems(data);
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // useEffect(() => {
  //   if (!user) {
  //     router.push('/login');
  //     return;
  //   }
  //   fetchCarrito();
  // }, [user, fetchCarrito]);

  useEffect(() => {
  const token = Cookies.get('token');

  // Solo redirige si confirmamos que NO hay usuario Y NO hay token en cookies
  if (!user && !token) {
    router.push('/login');
    return;
  }

  // Si hay token, intentamos cargar los datos del carrito
  if (token) {
    fetchCarrito();
  }
}, [user, fetchCarrito, router]);

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
      prev.map(i => i.carrito_id === carritoId ? { ...i, cantidad: i.cantidad + delta } : i)
      .filter(i => i.cantidad > 0)
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

  const confirmarPago = async () => {
    setProcesando(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/carrito/vaciar', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Error al procesar el pago');
        fetchCarrito(); // Refrescamos stock real si falla
        return;
      }

      toast.success('¡Compra exitosa!', { icon: '🎉' });
      setItems([]);
      updateCartCount();
      setTimeout(() => router.push('/'), 2000);
    } catch {
      toast.error('Error de conexión');
    } finally {
      setProcesando(false);
    }
  };

  // CÁLCULOS DINÁMICOS
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0), [items]);
  
  // Esta constante identifica TODOS los productos que exceden el stock real
  const itemsConError = useMemo(() => items.filter(item => item.cantidad > (item.stock || 0)), [items]);
  const tieneErrores = itemsConError.length > 0;

  // if (loading) return <div className="min-h-screen"><Header /><p className="text-center py-10 font-medium">Validando inventario...</p></div>;
if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* //* Título Skeleton */}
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda: Productos */}
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-transparent flex gap-5 animate-pulse">
                  {/* Imagen finta */}
                  <div className="w-24 h-24 bg-gray-200 rounded-xl" />
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/2" />
                      {/* Botones de cantidad fintos */}
                      <div className="h-10 w-32 bg-gray-100 rounded-xl" />
                    </div>
                    {/* Stock finto */}
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="h-4 bg-gray-100 rounded w-20" />
                      <div className="h-8 bg-gray-200 rounded w-28" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Columna Derecha: Resumen de Pago */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6 animate-pulse">
                <div className="h-7 bg-gray-200 rounded w-1/2 mb-4" />
                
                {/* Desglose finto */}
                <div className="space-y-4 pb-6 border-b border-dashed border-gray-100">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-100 rounded w-16" />
                    <div className="h-4 bg-gray-100 rounded w-12" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-100 rounded w-20" />
                    <div className="h-4 bg-gray-100 rounded w-12" />
                  </div>
                </div>

                {/* Total finto */}
                <div className="flex justify-between py-2">
                  <div className="h-10 bg-gray-200 rounded w-24" />
                  <div className="h-10 bg-green-100 rounded w-32" />
                </div>

                {/* Botón de pago finto */}
                <div className="h-16 bg-green-100 rounded-2xl w-full mt-2" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const stockReal = item.stock || 0;
              const esError = item.cantidad > stockReal;

              return (
                <div 
                  key={item.carrito_id} 
                  className={`p-5 rounded-2xl shadow-sm border-2 flex gap-5 transition-all duration-300 ${
                    esError ? 'bg-red-50 border-red-400' : 'bg-white border-transparent'
                  }`}
                >
                  <img src={getPrimeraImagen(item.imagen_url)} alt={item.nombre} className="w-24 h-24 object-contain rounded-xl bg-gray-50 border" />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h2 className="font-bold text-gray-800 text-base md:text-lg line-clamp-1">{item.nombre}</h2>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2.5 h-2.5 rounded-full ${stockReal === 0 ? 'bg-red-600' : stockReal <= 3 ? 'bg-red-500' : stockReal <= 10 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                          <span className={`text-xs font-bold ${stockReal <= 3 ? 'text-red-500' : stockReal <= 10 ? 'text-yellow-600' : 'text-green-500'}`}>
                            {stockReal > 0 ? `${stockReal} en stock` : 'Agotado'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-gray-100 rounded-xl p-1">
                          <button onClick={() => ajustarCantidad(item.carrito_id, -1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition">
                            <Minus size={16} />
                          </button>
                          <span className="font-bold px-3 text-gray-800">{item.cantidad}</span>
                          <button 
                            onClick={() => ajustarCantidad(item.carrito_id, 1)} 
                            disabled={item.cantidad >= stockReal}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition disabled:opacity-20"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button onClick={() => eliminarItem(item.carrito_id)} className="p-2.5 text-red-500 hover:bg-red-100 rounded-xl transition">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-gray-500 font-medium">Unitario: ${Number(item.precio).toFixed(2)}</p>
                      <p className="text-xl font-black text-gray-900">${(Number(item.precio) * item.cantidad).toFixed(2)}</p>
                    </div>

                    {esError && (
                      <div className="mt-3 py-2 px-3 bg-white/50 rounded-lg flex items-center gap-2 text-red-600 text-xs font-black uppercase">
                        <AlertCircle size={14} />
                        {stockReal === 0 
                          ? "Eliminar producto del carrito (Sin stock disponible)" 
                          : `Reducir unidades: solo hay ${stockReal} disponibles`
                        }
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl sticky top-24 border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Resumen de Pago</h2>
              <div className="space-y-4 border-b border-dashed pb-6 mb-6">
                <div className="flex justify-between text-gray-500"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-500"><span>IVA (16%):</span><span>${(subtotal * 0.16).toFixed(2)}</span></div>
              </div>
              <div className="flex justify-between text-3xl font-black text-gray-900 mb-8">
                <span>Total:</span><span className="text-green-600">${(subtotal * 1.16).toFixed(2)}</span>
              </div>

              <button
                onClick={confirmarPago}
                disabled={procesando || items.length === 0 || tieneErrores}
                className="w-full bg-green-600 text-white py-4 rounded-2xl hover:bg-green-700 font-black text-lg transition-all disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-3"
              >
                {procesando ? 'Procesando...' : <><CheckCircle size={22} /> Confirmar Pago</>}
              </button>
              
              {tieneErrores && (
                <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                   <p className="text-red-500 text-[10px] text-center font-black uppercase tracking-widest leading-tight">
                    ⚠️ CORRIGE EL STOCK MARCADO EN ROJO PARA PROCEDER
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}