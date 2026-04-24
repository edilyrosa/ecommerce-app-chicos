// app/crud-pedidos/page.jsx
'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import BottomNav from "../../components/BottomNav";

const estados = ['Procesando pedido', 'Pedido Programado', 'Pedido en Reparto', 'Entregado'];

export default function ActualizarPedidos() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [category, setCategory] = useState('todas');

  // 🔒 Protección: si el usuario no es administrador, redirigir al inicio
  useEffect(() => {
    if (!authLoading) {
      if (!user || !user.is_admin) {
        toast.error('Acceso denegado. Solo administradores.');
        router.push('/');
      }
    }
  }, [user, authLoading, router]);

  // No mostrar nada mientras se verifica autenticación o si no es admin
  if (authLoading || !user || !user.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const buscarPedidos = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Ingresa un correo');
      return;
    }
    setLoading(true);
    setBuscado(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/pedidos?email=${encodeURIComponent(email)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPedidos(data.pedidos || []);
        if (data.pedidos.length === 0) {
          toast('No hay pedidos para este usuario');
        }
      } else {
        toast.error(data.error || 'Error al buscar pedidos');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (pedidoId, nuevoEstado) => {
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/admin/pedidos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pedidoId, nuevoEstado })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Estado actualizado');
        setPedidos(prev =>
          prev.map(p => p.id === pedidoId ? { ...p, estatus_pedido: nuevoEstado } : p)
        );
      } else {
        toast.error(data.error || 'Error al actualizar');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-8 text-center" style={{ color: '#00162f' }}>
          Actualizar Pedidos
        </h1>

        <form onSubmit={buscarPedidos} className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Correo del cliente"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-yellow-400 text-blue-900 font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>

        {buscado && !loading && (
          <div className="space-y-4">
            {pedidos.length === 0 ? (
              <p className="text-center text-gray-600">No se encontraron pedidos</p>
            ) : (
              pedidos.map((pedido) => {
                const isEntregado = pedido.estatus_pedido === 'Entregado';
                return (
                  <div
                    key={pedido.id}
                    className={`bg-white rounded-lg shadow-md p-4 border ${
                      isEntregado ? 'opacity-60 bg-gray-100' : ''
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="font-bold">Pedido #{pedido.id}</p>
                        <p className="text-sm text-gray-600">
                          Fecha: {new Date(pedido.fecha).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: ${Number(pedido.total).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Items: {pedido.items?.length || 0}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={pedido.estatus_pedido || 'Procesando pedido'}
                          onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          disabled={isEntregado}
                        >
                          {estados.map(est => (
                            <option key={est} value={est}>{est}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
      <BottomNav setCategory={setCategory} currentCategory={category} />
    </div>
  );
}


