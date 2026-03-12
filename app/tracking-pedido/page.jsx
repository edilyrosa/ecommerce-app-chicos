// app/tracking-pedido/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import { Package, Truck, CheckCircle, Eye } from 'lucide-react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const estadoConfig = {
  'Procesando pedido': { color: 'text-yellow-600 bg-yellow-100', icon: Package, label: 'Procesando pedido' },
  'Pedido Programado': { color: 'text-blue-600 bg-blue-100', icon: Truck, label: 'Pedido Programado' },
  'Pedido en Reparto': { color: 'text-orange-600 bg-orange-100', icon: Truck, label: 'Pedido en Reparto' },
  'Entregado': { color: 'text-green-600 bg-green-100', icon: CheckCircle, label: 'Entregado' },
};

export default function TrackingPedido() {
  const { user } = useAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchPedidos = async () => {
      try {
        const res = await fetch('/api/pedidos', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPedidos(data.pedidos);
        } else {
          toast.error('No se pudieron cargar los pedidos');
        }
      } catch {
        toast.error('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [router]);

  const handleVerFactura = (pedidoId) => {
    router.push(`/factura/${pedidoId}`);
  };

  // Skeleton con colores corporativos
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Título skeleton */}
            {/* SECCIÓN DEL TÍTULO ESTILIZADO */}
        <div className="flex items-center justify-center gap-3  m-auto text-center">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 tracking-tight">
                MIS PEDIDOS
            </h1>
            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 animate-bounce-short">
            <Package className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
            </div>
        </div>
        

          {/* Lista de skeletons (3 tarjetas) */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md border overflow-hidden p-4 md:p-6 animate-pulse"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Icono + ID + Fecha skeleton */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 w-12 h-12 flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-gradient-to-r from-blue-100 to-yellow-100 rounded" />
                      <div className="h-3 w-40 bg-gradient-to-r from-blue-50 to-yellow-50 rounded" />
                    </div>
                  </div>

                  {/* Estado + Precio + Botón skeleton */}
                  <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end w-full md:w-auto">
                    <div className="h-6 w-24 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-full" />
                    <div className="h-6 w-16 bg-gradient-to-r from-blue-100 to-yellow-100 rounded" />
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-lg w-9 h-9 ml-auto md:ml-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
        <BottomNav />
        <style jsx global>{`
          @keyframes bounce-short {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-bounce-short {
            animation: bounce-short 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
         
           {/* SECCIÓN DEL TÍTULO ESTILIZADO */}
        <div className="flex items-center justify-center gap-3  m-auto text-center">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 tracking-tight">
                MIS PEDIDOS
            </h1>
            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 animate-bounce-short">
            <Package className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
            </div>
        </div>

        {pedidos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No tienes pedidos aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => {
              const estatus = pedido.estatus_pedido || 'Procesando pedido';
              const config = estadoConfig[estatus] || estadoConfig['Procesando pedido'];
              const { color, icon: Icon, label } = config;
              const fecha = new Date(pedido.fecha).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
              const isEntregado = estatus === 'Entregado';

              return (
                <div
                  key={pedido.id}
                  className={`bg-white rounded-2xl shadow-md border overflow-hidden transition ${
                    isEntregado ? 'opacity-70' : ''
                  }`}
                >
                  {/* Cabecera responsiva */}
                  <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Icono + ID + Fecha */}
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${color} flex-shrink-0`}>
                        <Icon size={24} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-800 truncate">Pedido #{pedido.id}</p>
                        <p className="text-sm text-gray-500 truncate">{fecha}</p>
                      </div>
                    </div>

                    {/* Estado + Precio + Botón factura */}
                    <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end w-full md:w-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${color} whitespace-nowrap`}>
                        {label}
                      </span>
                      <p className="font-black text-lg whitespace-nowrap" style={{ color: '#00162f' }}>
                        ${Number(pedido.total).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleVerFactura(pedido.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition ml-auto md:ml-0 flex-shrink-0"
                        title="Ver factura"
                      >
                        <Eye size={20} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <BottomNav />
       <style jsx global>{`
      @keyframes bounce-short {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      .animate-bounce-short {
        animation: bounce-short 2s ease-in-out infinite;
      }
    `}</style>
    </div>
  );
}