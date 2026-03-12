

// components/TablaItems.jsx
'use client';
import { useState } from 'react';
import { Trash2, Plus, Minus, AlertCircle, Loader2 } from 'lucide-react';

export default function TablaItems({ 
  items, 
  onAjustarCantidad, 
  onEliminarItem,
  mostrarControles = true 
}) {
  // Estado para trackear qué botón está procesando
  const [procesando, setProcesando] = useState({});

  // Función para obtener la primera imagen
  const getPrimeraImagen = (imagen_url) => {
    if (!imagen_url) return '/placeholder.jpg';
    const imagenes = imagen_url.split(',').map(img => img.trim()).filter(Boolean);
    return imagenes[0] || '/placeholder.jpg';
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
    <div className="space-y-4">
      {items.map(item => {
        const stockReal = item.stock || 0;
        const esError = item.cantidad > stockReal;
        const keyPlus = `${item.carrito_id}-plus`;
        const keyMinus = `${item.carrito_id}-minus`;
        const keyDelete = `${item.carrito_id}-delete`;

        return (
          <div 
            key={item.carrito_id} 
            className={`p-1 md:p-2 rounded-2xl shadow-sm border-2 flex flex-col gap-3 transition-all duration-300 ${
              esError ? 'bg-red-50 border-red-400' : 'bg-white border-transparent'
            }`}
          >
            {/* NOMBRE DEL PRODUCTO - PRIMERA FILA, ANCHO COMPLETO */}
            <h3 className="font-bold text-[10px] md:text-base text-gray-800 line-clamp-1">
              {item.nombre}
            </h3>

            {/* FILA CON IMAGEN + DETALLES + CONTROLES */}
            <div className="flex gap-4 md:gap-5">
              {/* Imagen */}
              <img
                src={getPrimeraImagen(item.imagen_url)}
                alt={item.nombre}
                className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-xl bg-gray-50 border flex-shrink-0"
              />

              
               

              {/* Contenedor de información y controles */}
              <div className="flex-1 min-w-0">

               {/* stock y controles */}
              <div className="flex justify-between items-start gap-2">
                
                  {/* Info de stock y tipo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${
                        stockReal === 0 ? 'bg-red-600' : 
                        stockReal <= 3 ? 'bg-red-500' : 
                        stockReal <= 10 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`} />
                      <span className={`text-[10px] md:text-xs font-bold ${
                        stockReal <= 3 ? 'text-red-500' : 
                        stockReal <= 10 ? 'text-yellow-600' : 
                        'text-green-500'
                      }`}>
                        {stockReal > 0 ? `${stockReal} en stock` : 'Agotado'}
                      </span>
                    </div>

                  </div>

                  {/* CONTROLES DE CANTIDAD Y ELIMINAR (RESTAURADOS) */}
                  {mostrarControles && (
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="flex items-center bg-gray-100 rounded-xl">
                        {/* Botón Disminuir */}
                        <button 
                          onClick={() => handleAjustar(item.carrito_id, -1)}
                          disabled={procesando[keyMinus] || item.cantidad <= 1}
                          className="p-1.5 md:p-2 hover:bg-white hover:shadow-sm rounded-lg transition text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center min-w-[28px] md:min-w-[32px]"
                        >
                          {procesando[keyMinus] ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Minus size={14} className="md:w-4 md:h-4" />
                          )}
                        </button>
                        
                        {/* Cantidad */}
                        <span className="font-bold px-2 md:px-3 text-xs md:text-sm text-gray-800 min-w-[24px] text-center">
                          {item.cantidad}
                        </span>
                        
                        {/* Botón Aumentar */}
                        <button 
                          onClick={() => handleAjustar(item.carrito_id, 1)}
                          disabled={procesando[keyPlus] || item.cantidad >= stockReal}
                          className="p-1.5 md:p-2 hover:bg-white hover:shadow-sm rounded-lg transition text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center min-w-[28px] md:min-w-[32px]"
                        >
                          {procesando[keyPlus] ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Plus size={14} className="md:w-4 md:h-4" />
                          )}
                        </button>
                      </div>
                      
                      {/* Botón Eliminar */}
                      <button 
                        onClick={() => handleEliminar(item.carrito_id)}
                        disabled={procesando[keyDelete]}
                        className="p-2 md:p-2.5 text-red-500 hover:bg-red-100 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {procesando[keyDelete] ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} className="md:w-5 md:h-5" />
                        )}
                      </button>
                    </div>
                  )}
              </div>



              <div className='flex flex-col gap-1 text-[9px] md:text-[10px] text-gray-900 font-semibold uppercase'>
                    <span>
                        Articulo: {item.id}
                      </span>
                  
                    {item.categoria && (
                      <span >
                        Categoria: {item.categoria}
                      </span>
                    )}

              </div>




                {/* PRECIOS */}
                <div className="flex justify-between items-end mt-1 md:mt-2">
                  <div className='flex flex-col md:flex-row md:gap-2'>
                    <p className="text-[10px] md:text-sm text-gray-500 font-medium">
                      Unitario: ${Number(item.precio).toFixed(2)}
                    </p>
                    <span className='text-[8px] md:text-[10px] font-black text-gray-900 bg-yellow-200'>IVA incluido</span>
                  </div>
                  <p className="text-base md:text-xl font-black text-gray-900">
                    ${(Number(item.precio) * item.cantidad).toFixed(2)}
                  </p>
                </div>

                {/* MENSAJE DE ERROR DE STOCK */}
                {esError && (
                  <div className="mt-2 md:mt-3 py-1.5 md:py-2 px-3 bg-white/50 rounded-lg flex items-center gap-2 text-red-600 text-[10px] md:text-xs font-black uppercase">
                    <AlertCircle size={12} className="md:w-4 md:h-4 flex-shrink-0" />
                    <span className="leading-tight">
                      {stockReal === 0 
                        ? "Producto sin stock - Elimínalo del carrito" 
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