


// app/tracking-pedido/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import PedidoDetalle from '../../components/PedidoDetalle';
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
  const [expandedPedido, setExpandedPedido] = useState(null);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-8 text-center" style={{ color: '#00162f' }}>
          Mis Pedidos
        </h1>

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
                  {/* Cabecera del pedido */}
                  <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Icono + ID + Fecha */}
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${color} flex-shrink-0`}>
                        <Icon size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 truncate">Pedido #{pedido.id}</p>
                        <p className="text-sm text-gray-500 truncate">{fecha}</p>
                      </div>
                    </div>

                    {/* Estado + Precio + Botón (responsive) */}
                    <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end w-full md:w-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${color} whitespace-nowrap`}>
                        {label}
                      </span>
                      <p className="font-black text-lg whitespace-nowrap" style={{ color: '#00162f' }}>
                        ${Number(pedido.total).toFixed(2)}
                      </p>
                      <button
                        onClick={() => setExpandedPedido(expandedPedido === pedido.id ? null : pedido.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition ml-auto md:ml-0 flex-shrink-0"
                      >
                        <Eye size={20} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Detalles expandibles con PedidoDetalle */}
                  {expandedPedido === pedido.id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <PedidoDetalle 
                        pedido={{
                          ...pedido,
                          usuario: { nombre: user?.nombre, email: user?.email }
                        }} 
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}