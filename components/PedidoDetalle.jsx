// // components/PedidoDetalle.jsx
// 'use client';

// import { Phone, MapPin } from 'lucide-react';

// export default function PedidoDetalle({ pedido }) {
//   const {
//     con_factura,
//     items,
//     subtotal,
//     gasto_maniobra,
//     total,
//     telefono_contacto,
//     direccion_entrega,
//     rfc,
//     domicilio_fiscal,
//     ciudad,
//     estado,
//     codigo_postal,
//     regimen_fiscal,
//     numero_factura,
//     usuario
//   } = pedido;

//   const productos = items || [];

//   // Calcular importe de cada item (si no viene calculado)
//   const itemsConImporte = productos.map(item => ({
//     ...item,
//     importe: (item.precio_unitario || item.precio) * item.cantidad
//   }));

//   return (
//     <div className="space-y-6">
//       {/* Datos del cliente */}
//       <div className="border-b border-gray-200 pb-4">
//         <h4 className="font-bold text-sm mb-3" style={{ color: '#00162f' }}>Cliente</h4>
//         <p className="font-medium">{usuario?.nombre || 'Nombre no disponible'}</p>
//         <p className="text-sm text-gray-600">{usuario?.email}</p>
//         {con_factura ? (
//           <div className="mt-2 text-sm text-gray-600 space-y-1">
//             {rfc && <p>RFC: {rfc}</p>}
//             {domicilio_fiscal && <p>{domicilio_fiscal}</p>}
//             {(ciudad || estado) && (
//               <p>{[ciudad, estado].filter(Boolean).join(', ')} {codigo_postal && `CP: ${codigo_postal}`}</p>
//             )}
//             {regimen_fiscal && <p>Régimen fiscal: {regimen_fiscal}</p>}
//           </div>
//         ) : (
//           <p className="text-sm text-gray-600 mt-1">Cliente sin factura fiscal</p>
//         )}
//       </div>

//       {/* Tabla de productos */}
//       <div>
//         <h4 className="font-bold text-sm mb-3" style={{ color: '#00162f' }}>Productos</h4>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="p-2 text-left">Artículo</th>
//                 <th className="p-2 text-left">Nombre</th>
//                 <th className="p-2 text-center">Cant.</th>
//                 <th className="p-2 text-right">Precio</th>
//                 <th className="p-2 text-right">Importe</th>
//               </tr>
//             </thead>
//             <tbody>
//               {itemsConImporte.map((item, idx) => (
//                 <tr key={idx} className="border-b border-gray-100">
//                   <td className="p-2 font-mono text-xs">
//                     {item.id ? item.id.substring(0, 8) : `SKU${idx + 1}`}
//                   </td>
//                   <td className="p-2">{item.nombre}</td>
//                   <td className="p-2 text-center">{item.cantidad}</td>
//                   <td className="p-2 text-right">
//                     ${(item.precio_unitario || item.precio).toFixed(2)}
//                   </td>
//                   <td className="p-2 text-right font-medium">
//                     ${item.importe.toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Totales */}
//       <div className="flex flex-col items-end space-y-1 text-sm border-t border-gray-200 pt-4">
//         <div className="flex justify-between w-64">
//           <span>Subtotal:</span>
//           <span className="font-medium">${Number(subtotal).toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between w-64">
//           <span>Gastos maniobra (4%):</span>
//           <span className="font-medium">${Number(gasto_maniobra).toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between w-64 text-base font-bold border-t border-gray-300 pt-2 mt-1">
//           <span>Total:</span>
//           <span>${Number(total).toFixed(2)}</span>
//         </div>
//         {numero_factura && (
//           <p className="text-xs text-gray-500 mt-2">Factura: {numero_factura}</p>
//         )}
//       </div>

//       {/* Datos de entrega */}
//       {(telefono_contacto || direccion_entrega) && (
//         <div className="border-t border-gray-200 pt-4 text-sm">
//           <h4 className="font-bold text-sm mb-2" style={{ color: '#00162f' }}>Datos de entrega</h4>
//           {telefono_contacto && (
//             <p className="flex items-center gap-1 text-gray-600">
//               <Phone size={14} /> {telefono_contacto}
//             </p>
//           )}
//           {direccion_entrega && (
//             <p className="flex items-start gap-1 text-gray-600 mt-1">
//               <MapPin size={14} className="mt-0.5" /> {direccion_entrega}
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }




// components/PedidoDetalle.jsx
'use client';

import { Phone, MapPin } from 'lucide-react';

export default function PedidoDetalle({ pedido }) {
  const {
    con_factura,
    items,
    subtotal,
    gasto_maniobra,
    total,
    telefono_contacto,
    direccion_entrega,
    rfc,
    domicilio_fiscal,
    ciudad,
    estado,
    codigo_postal,
    regimen_fiscal,
    numero_factura,
    usuario,
    fecha // Añadimos fecha para la leyenda
  } = pedido;

  const productos = items || [];

  // Calcular importe de cada item (si no viene calculado)
  const itemsConImporte = productos.map(item => ({
    ...item,
    importe: (item.precio_unitario || item.precio) * item.cantidad
  }));

  // Función para formatear fecha si es necesario (opcional)
  const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Datos del cliente */}
      <div className="border-b border-gray-200 pb-3 sm:pb-4">
        <h4 className="font-bold text-xs sm:text-sm mb-2 sm:mb-3" style={{ color: '#00162f' }}>Cliente</h4>
        <p className="font-medium text-sm sm:text-base">{usuario?.nombre || 'Nombre no disponible'}</p>
        <p className="text-xs sm:text-sm text-gray-600">{usuario?.email}</p>
        {con_factura ? (
          <div className="mt-2 text-xs sm:text-sm text-gray-600 space-y-1">
            {rfc && <p>RFC: {rfc}</p>}
            {domicilio_fiscal && <p>{domicilio_fiscal}</p>}
            {(ciudad || estado) && (
              <p>{[ciudad, estado].filter(Boolean).join(', ')} {codigo_postal && `CP: ${codigo_postal}`}</p>
            )}
            {regimen_fiscal && <p>Régimen fiscal: {regimen_fiscal}</p>}
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Cliente sin factura fiscal</p>
        )}
      </div>

      {/* Tabla de productos - responsiva con scroll horizontal si es necesario */}
      <div className="overflow-x-auto">
        <h4 className="font-bold text-xs sm:text-sm mb-2 sm:mb-3" style={{ color: '#00162f' }}>Productos</h4>
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-1 sm:p-2 text-left">Artículo</th>
              <th className="p-1 sm:p-2 text-left">Nombre</th>
              <th className="p-1 sm:p-2 text-center">Cant.</th>
              <th className="p-1 sm:p-2 text-right">Precio</th>
              <th className="p-1 sm:p-2 text-right">Importe</th>
            </tr>
          </thead>
          <tbody>
            {itemsConImporte.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100">
                <td className="p-1 sm:p-2 font-mono text-xs">
                  {item.id ? item.id.substring(0, 8) : `SKU${idx + 1}`}
                </td>
                <td className="p-1 sm:p-2">{item.nombre}</td>
                <td className="p-1 sm:p-2 text-center">{item.cantidad}</td>
                <td className="p-1 sm:p-2 text-right">
                  ${(item.precio_unitario || item.precio).toFixed(2)}
                </td>
                <td className="p-1 sm:p-2 text-right font-medium">
                  ${item.importe.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="flex flex-col items-end space-y-1 text-xs sm:text-sm border-t border-gray-200 pt-3 sm:pt-4">
        <div className="flex justify-between w-48 sm:w-64">
          <span>Subtotal:</span>
          <span className="font-medium">${Number(subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-48 sm:w-64">
          <span>Gastos maniobra (4%):</span>
          <span className="font-medium">${Number(gasto_maniobra).toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-48 sm:w-64 text-sm sm:text-base font-bold border-t border-gray-300 pt-2 mt-1">
          <span>Total:</span>
          <span>${Number(total).toFixed(2)}</span>
        </div>
        {numero_factura && (
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">Factura: {numero_factura}</p>
        )}
      </div>

      {/* Datos de entrega */}
      {(telefono_contacto || direccion_entrega) && (
        <div className="border-t border-gray-200 pt-3 sm:pt-4 text-xs sm:text-sm">
          <h4 className="font-bold text-xs sm:text-sm mb-2" style={{ color: '#00162f' }}>Datos de entrega</h4>
          {telefono_contacto && (
            <p className="flex items-center gap-1 text-gray-600">
              <Phone size={14} className="flex-shrink-0" /> {telefono_contacto}
            </p>
          )}
          {direccion_entrega && (
            <p className="flex items-start gap-1 text-gray-600 mt-1">
              <MapPin size={14} className="flex-shrink-0 mt-0.5" /> {direccion_entrega}
            </p>
          )}
        </div>
      )}

      {/* Leyenda de entrega */}
      {fecha && (
        <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500 italic border-t border-gray-200 pt-2">
          <p>📦 Tu pedido fue realizado el {fechaFormateada}. La entrega se efectuará en un plazo de 3 a 5 días hábiles.</p>
        </div>
      )}
    </div>
  );
}