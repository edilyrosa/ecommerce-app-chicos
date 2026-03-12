// app/factura/[id]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FacturaContent from '@/components/FacturaContent';
import { AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';

export default function FacturaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch(`/api/pedidos/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al cargar la factura');
        }

        const data = await res.json();
        setPedido(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPedido();
  }, [id, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 p-6 rounded-lg text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm"
          >
            Regresar
          </button>
        </div>
      </div>
    );
  }

  // Si no hay error, renderizamos FacturaContent con pedido (que puede ser null)
  return <FacturaContent pedido={pedido} />;
}