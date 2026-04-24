// components/TablaItems.jsx
'use client';
import { useState } from 'react';
import { Trash2, Plus, Minus, AlertCircle, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';

export default function TablaItems({ 
  items, 
  onAjustarCantidad, 
  onEliminarItem,
  mostrarControles = true 
}) {
  const [procesando, setProcesando] = useState({});

  const getPrimeraImagen = (imagen_url) => {
    if (!imagen_url) return '/bodega-img.jpg';
    const imagenes = imagen_url.split(',').map(img => img.trim()).filter(Boolean);
    return imagenes[0] || '/bodega-img.jpg';
  };

  const handleAjustar = async (carritoId, delta) => {
    const key = `${carritoId}-${delta > 0 ? 'plus' : 'minus'}`;
    if (procesando[key]) return;
    setProcesando(prev => ({ ...prev, [key]: true }));
    try {
      await onAjustarCantidad(carritoId, delta);
    } finally {
      setTimeout(() => {
        setProcesando(prev => {
          const nuevo = { ...prev };
          delete nuevo[key];
          return nuevo;
        });
      }, 500);
    }
  };

  const handleEliminar = async (carritoId) => {
    const key = `${carritoId}-delete`;
    if (procesando[key]) return;
    setProcesando(prev => ({ ...prev, [key]: true }));
    try {
      await onEliminarItem(carritoId);
    } finally {
      setTimeout(() => {
        setProcesando(prev => {
          const nuevo = { ...prev };
          delete nuevo[key];
          return nuevo;
        });
      }, 500);
    }
  };

  return (
    <div className="space-y-3">
      {items.map(item => {
        const stockReal = item.stock || 0;
        const esError = item.cantidad > stockReal;
        const keyPlus = `${item.carrito_id}-plus`;
        const keyMinus = `${item.carrito_id}-minus`;
        const keyDelete = `${item.carrito_id}-delete`;

        return (
          <div 
            key={item.carrito_id} 
            className={`p-2 md:p-3 rounded-xl shadow-sm border-2 flex flex-col gap-2 transition-all duration-300 ${
              esError ? 'bg-red-50 border-red-400' : 'bg-white border-transparent'
            }`}
          >
            {/* Nombre del producto */}
            <h3 className="font-bold text-[11px] md:text-sm text-gray-800 line-clamp-1">
              {item.nombre}
            </h3>

            {/* Fila principal */}
            <div className="flex gap-3 md:gap-4">
              {/* Imagen */}
              <img
                src={getPrimeraImagen(item.imagen_url)}
                alt={item.nombre}
                className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-lg bg-gray-50 border flex-shrink-0"
              />

              {/* Contenedor de información y controles */}
              <div className="flex-1 min-w-0">
                {/* Stock y controles */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      stockReal === 0 ? 'bg-red-600' : 
                      stockReal <= 3 ? 'bg-red-500' : 
                      stockReal <= 10 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`} />
                    <span className={`text-[9px] md:text-[10px] font-bold ${
                      stockReal <= 3 ? 'text-red-500' : 
                      stockReal <= 10 ? 'text-yellow-600' : 
                      'text-green-500'
                    }`}>
                      {stockReal > 0 ? `${stockReal} en stock` : 'Agotado'}
                    </span>
                  </div>

                  {mostrarControles && (
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="flex items-center bg-gray-100 rounded-lg">
                        <button 
                          onClick={() => handleAjustar(item.carrito_id, -1)}
                          disabled={procesando[keyMinus] || item.cantidad <= 1}
                          className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition text-gray-600 disabled:opacity-30"
                        >
                          {procesando[keyMinus] ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Minus size={12} />
                          )}
                        </button>
                        <span className="font-bold px-2 text-xs md:text-sm text-gray-800 min-w-[24px] text-center">
                          {item.cantidad}
                        </span>
                        <button 
                          onClick={() => handleAjustar(item.carrito_id, 1)}
                          disabled={procesando[keyPlus] || item.cantidad >= stockReal}
                          className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition text-gray-600 disabled:opacity-30"
                        >
                          {procesando[keyPlus] ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Plus size={12} />
                          )}
                        </button>
                      </div>
                      <button 
                        onClick={() => handleEliminar(item.carrito_id)}
                        disabled={procesando[keyDelete]}
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition disabled:opacity-50"
                      >
                        {procesando[keyDelete] ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Detalles adicionales */}
                <div className='flex flex-col gap-0.5 text-[9px] md:text-[10px] text-gray-900 font-semibold uppercase mt-1'>
                  <span>Código: {item.codigo}</span>
                  <span>Peso: {item.peso_kg} kg.</span>
                  {item.categoria && <span>Categoría: {item.categoria}</span>}
                </div>

                {/* Precios */}
                <div className="flex justify-between items-end mt-2">
                  <div className='flex flex-col md:flex-row md:gap-2'>
                    <p className="text-[10px] md:text-xs text-gray-500 font-medium">
                      Unitario: {formatPrice(item.precio)}
                    </p>
                    <span className='text-[8px] md:text-[9px] font-black text-gray-900 bg-yellow-200 px-1 rounded'>IVA incluido</span>
                  </div>
                  <p className="text-sm md:text-base font-black text-gray-900">
                    {formatPrice(Number(item.precio) * item.cantidad)}
                  </p>
                </div>

                {/* Mensaje de error de stock */}
                {esError && (
                  <div className="mt-2 py-1 px-2 bg-white/50 rounded-md flex items-center gap-2 text-red-600 text-[10px] font-black uppercase">
                    <AlertCircle size={10} className="flex-shrink-0" />
                    <span className="leading-tight">
                      {stockReal === 0 
                        ? "Producto sin stock - Elimínalo" 
                        : `Solo hay ${stockReal} disponible${stockReal !== 1 ? 's' : ''} - Reduce la cantidad`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}