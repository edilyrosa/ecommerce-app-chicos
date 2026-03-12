// // app/checkout/page.jsx
// 'use client';
// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../../context/authContext';
// import Header from '../../components/Header';
// import TablaItems from '../../components/TablaItems';
// import BottomNav from '../../components/BottomNav';
// import toast from 'react-hot-toast';
// import Cookies from 'js-cookie';
// import { CheckCircle } from 'lucide-react';

// // Mapeo de códigos de régimen fiscal a descripciones (SAT México)
// const getRegimenDescripcion = (codigo) => {
//   const regimenes = {
//     '601': 'General de Ley Personas Morales',
//     '603': 'Personas Morales con Fines no Lucrativos',
//     '605': 'Sueldos y Salarios e Ingresos Asimilados a Salarios',
//     '606': 'Arrendamiento',
//     '607': 'Régimen de Enajenación o Adquisición de Bienes',
//     '608': 'Demás ingresos',
//     '609': 'Consolidación',
//     '610': 'Residentes en el Extranjero sin Establecimiento Permanente en México',
//     '611': 'Ingresos por Dividendos (socios y accionistas)',
//     '612': 'Personas Físicas con Actividades Empresariales y Profesionales',
//     '614': 'Ingresos por intereses',
//     '615': 'Régimen de los ingresos por obtención de premios',
//     '616': 'Sin obligaciones fiscales',
//     '620': 'Sociedades Cooperativas de Producción',
//     '621': 'Incorporación Fiscal',
//     '622': 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras',
//     '623': 'Opcional para Grupos de Sociedades',
//     '624': 'Coordinados',
//     '625': 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
//     '626': 'Régimen Simplificado de Confianza',
//   };
//   return regimenes[codigo] || 'Régimen no especificado';
// };

// // Expresión regular para RFC persona física (4 letras + 6 números + 3 alfanuméricos)
// const validarRFC = (rfc) => {
//   const re = /^[A-Z&Ñ]{4}\d{6}[A-Z0-9]{3}$/;
//   return re.test(rfc);
// };

// // Validar teléfono mexicano (10 dígitos, opcional con guiones)
// const validarTelefono = (tel) => {
//   const re = /^\d{10}$|^\d{3}-\d{3}-\d{4}$/;
//   return re.test(tel);
// };

// // Lista de todos los estados de México
// const estadosMexico = [
//   'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
//   'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
//   'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México',
//   'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
//   'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora',
//   'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
// ];

// export default function Checkout() {
//   const [items, setItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [procesando, setProcesando] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [category, setCategory] = useState('todas');
//   const [tipoFactura, setTipoFactura] = useState(null); // 'con_factura' o 'sin_factura'

//   // --- CAMPOS DE ENTREGA ---
//   const [codigoPostalEntrega, setCodigoPostalEntrega] = useState('');
//   const [telefonoContacto, setTelefonoContacto] = useState('');
//   const [direccionEntrega, setDireccionEntrega] = useState('');
//   const [direccionGoogle, setDireccionGoogle] = useState(''); // opcional

//   // --- CAMPOS FISCALES (solo si se requiere factura) ---
//   const [rfc, setRfc] = useState('');
//   const [domicilioFiscal, setDomicilioFiscal] = useState('');
//   const [razonSocial, setRazonSocial] = useState('');
//   const [ciudad, setCiudad] = useState('');
//   const [estado, setEstado] = useState('');
//   const [codigoPostal, setCodigoPostal] = useState('');
//   const [regimenFiscal, setRegimenFiscal] = useState('616');

//   const { user, updateCartCount } = useAuth();
//   const router = useRouter();

//   // Obtener carrito
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
//         setFilteredItems(data);
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

//   // Filtro por búsqueda
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredItems(items);
//       return;
//     }
//     const filtered = items.filter(item => 
//       item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredItems(filtered);
//   }, [searchTerm, items]);

//   // Eliminar item del carrito
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

//   // Ajustar cantidad
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

//   // Cálculos financieros
//   const subtotal = useMemo(() => 
//     items.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0), 
//     [items]
//   );
//   const gastosManiobra = useMemo(() => subtotal * 0.04, [subtotal]);
//   const totalConGastos = useMemo(() => subtotal + gastosManiobra, [subtotal, gastosManiobra]);

//   const itemsConError = useMemo(() => 
//     filteredItems.filter(item => item.cantidad > (item.stock || 0)), 
//     [filteredItems]
//   );
//   const tieneErrores = itemsConError.length > 0;

//   // Validaciones
//   const telefonoValido = validarTelefono(telefonoContacto);
//   const rfcValido = validarRFC(rfc);
//   const codigoPostalEntregaValido = /^\d{4}$/.test(codigoPostalEntrega) && 
//     parseInt(codigoPostalEntrega) >= 2000 && parseInt(codigoPostalEntrega) <= 3000;

//   // Los campos de entrega se muestran solo si el código postal es válido
//   const mostrarCamposEntrega = codigoPostalEntregaValido;

//   const datosEntregaValidos = mostrarCamposEntrega && telefonoValido && direccionEntrega.trim() !== '';

//   const datosFiscalesValidos = tipoFactura !== 'con_factura' || (
//     rfc.trim() !== '' && rfcValido &&
//     razonSocial.trim() !== '' &&
//     domicilioFiscal.trim() !== '' &&
//     ciudad.trim() !== '' &&
//     estado.trim() !== '' &&
//     codigoPostal.trim() !== '' &&
//     regimenFiscal.trim() !== ''
//   );

//   const formularioCompleto = 
//     filteredItems.length > 0 &&
//     !tieneErrores &&
//     tipoFactura !== null &&
//     datosEntregaValidos &&
//     datosFiscalesValidos;

//   // Función principal de confirmación de pago
//   const confirmarPago = async () => {
//     setProcesando(true);
    
//     try {
//       const token = Cookies.get('token');
      
//       //* Generar número de factura si aplica
//       const numeroFactura = tipoFactura === 'con_factura' 
//         ? `FAC-${Date.now().toString().slice(-8)}` 
//         : null;

//       // Construir objeto de datos para el pedido
//       const pedidoData = {
//         items: items.map(item => ({
//           id: item.id,
//           nombre: item.nombre,
//           descripcion: item.descripcion || '',
//           cantidad: item.cantidad,
//           precio: Number(item.precio),
//           categoria: item.categoria || ''
//         })),
//         subtotal,
//         gastoManiobra: gastosManiobra,
//         total: totalConGastos,
//         conFactura: tipoFactura === 'con_factura',
//         codigo_postal_entrega: codigoPostalEntrega,
//         telefono_contacto: telefonoContacto,
//         direccion_entrega: direccionEntrega,
//         direccion_google: direccionGoogle || null,
//         rfc: tipoFactura === 'con_factura' ? rfc : null,
//         razon_social: tipoFactura === 'con_factura' ? razonSocial : null, //TODO
//         domicilio_fiscal: tipoFactura === 'con_factura' ? domicilioFiscal : null,
//         ciudad: tipoFactura === 'con_factura' ? ciudad : null,
//         estado: tipoFactura === 'con_factura' ? estado : null,
//         codigo_postal: tipoFactura === 'con_factura' ? codigoPostal : null,
//         regimen_fiscal: tipoFactura === 'con_factura' ? regimenFiscal : null,
//         numeroFactura: numeroFactura
//       };

//       // 1. Guardar pedido en la base de datos
//       const pedidoRes = await fetch('/api/pedidos', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(pedidoData)
//       });

//       const pedidoGuardado = await pedidoRes.json();

//       // 2. Enviar email al administrador (opcional, no bloqueante)
//       try {
//         await fetch('/api/send-admin-email', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             pedido: {
//               id: pedidoGuardado.pedido.id,
//               items: pedidoData.items,
//               subtotal,
//               gasto_maniobra: gastosManiobra,
//               total: totalConGastos,
//               conFactura: tipoFactura === 'con_factura',
//               codigo_postal_entrega: codigoPostalEntrega,
//               telefono_contacto: telefonoContacto,
//               direccion_entrega: direccionEntrega,
//               rfc: tipoFactura === 'con_factura' ? rfc : null,
//               razon_social: tipoFactura === 'con_factura' ? razonSocial : null,
//               domicilio_fiscal: tipoFactura === 'con_factura' ? domicilioFiscal : null,
//               ciudad: tipoFactura === 'con_factura' ? ciudad : null,
//               estado: tipoFactura === 'con_factura' ? estado : null,
//               codigo_postal: tipoFactura === 'con_factura' ? codigoPostal : null,
//               regimen_fiscal: tipoFactura === 'con_factura' ? regimenFiscal : null,
//               numero_factura: numeroFactura
//             },
//             usuario: {
//               nombre: user?.nombre,
//               email: user?.email
//             }
//           })
//         });
//       } catch (emailError) {
//         console.error('Error enviando email:', emailError);
//       }

//       if (!pedidoRes.ok) {
//         const errorData = await pedidoRes.json().catch(() => ({}));
//         throw new Error(errorData.error || 'Error al registrar el pedido');
//       }

//       // Guardar datos de factura en localStorage
//       const facturaData = {
//         numeroFactura,
//         fecha: new Date().toLocaleDateString('es-MX', { 
//           year: 'numeric', 
//           month: 'long', 
//           day: 'numeric' 
//         }),
//         hora: new Date().toLocaleTimeString('es-MX', { 
//           hour: '2-digit', 
//           minute: '2-digit' 
//         }),
//         usuario: {
//           nombre: user?.nombre || 'N/A',
//           email: user?.email || 'N/A'
//         },
//         codigo_postal_entrega: codigoPostalEntrega,
//         telefono_contacto: telefonoContacto,
//         direccion_entrega: direccionEntrega,
//         direccion_google: direccionGoogle || null,
//         conFactura: tipoFactura === 'con_factura',
//         datos_fiscales: tipoFactura === 'con_factura' ? {
//           rfc,
//           razon_social: razonSocial,
//           domicilio_fiscal: domicilioFiscal,
//           ciudad,
//           estado,
//           codigo_postal: codigoPostal,
//           regimen_fiscal: regimenFiscal
//         } : null,
//         items: pedidoData.items,
//         subtotal,
//         gastos_maniobra: gastosManiobra,
//         total: totalConGastos
//       };

//       localStorage.setItem('facturaData', JSON.stringify(facturaData));

//       // 3. Vaciar carrito
//       const vaciarRes = await fetch('/api/carrito/vaciar', {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (!vaciarRes.ok) {
//         const errorData = await vaciarRes.json().catch(() => ({}));
//         throw new Error(errorData.error || 'Error al vaciar el carrito');
//       }

//       toast.success('¡Compra exitosa!', { icon: '🎉', duration: 3000 });
//       setItems([]);
//       updateCartCount();
      
//       setTimeout(() => router.push('/factura'), 1500);
      
//     } catch (error) {
//       console.error('Error en confirmarPago:', error);
//       toast.error(error.message || 'Error al procesar la compra');
//     } finally {
//       setProcesando(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
//         <Header 
//           searchTerm={searchTerm} 
//           setSearchTerm={setSearchTerm}
//           setCategory={setCategory} 
//           currentCategory={category}
//         />
//         <main className="flex-1 container mx-auto px-3 md:px-6 py-4 md:py-8">
//           <div className="h-8 md:h-10 w-48 md:w-64 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-lg animate-pulse mb-6 md:mb-8" />
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
//             <div className="lg:col-span-2 space-y-4">
//               {[...Array(3)].map((_, i) => (
//                 <div key={i} className="p-4 md:p-5 rounded-2xl bg-white border border-blue-50 flex gap-4 md:gap-5 animate-pulse">
//                   <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-yellow-50 rounded-xl flex-shrink-0" />
//                   <div className="flex-1 space-y-3">
//                     <div className="h-5 md:h-6 bg-blue-100 rounded w-2/3" />
//                     <div className="h-3 md:h-4 bg-yellow-50 rounded w-1/3" />
//                     <div className="flex justify-between items-center mt-4">
//                       <div className="h-3 bg-blue-50 rounded w-20" />
//                       <div className="h-7 md:h-8 bg-gradient-to-r from-blue-100 to-yellow-100 rounded w-28" />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="lg:col-span-1">
//               <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-blue-50 space-y-6 animate-pulse">
//                 <div className="h-6 md:h-7 bg-gradient-to-r from-blue-100 to-yellow-100 rounded w-2/3" />
//                 <div className="space-y-4 border-b border-dashed border-blue-100 pb-6">
//                   <div className="flex justify-between">
//                     <div className="h-4 bg-blue-50 rounded w-20" />
//                     <div className="h-4 bg-blue-50 rounded w-16" />
//                   </div>
//                   <div className="flex justify-between">
//                     <div className="h-4 bg-yellow-50 rounded w-24" />
//                     <div className="h-4 bg-yellow-50 rounded w-16" />
//                   </div>
//                 </div>
//                 <div className="flex justify-between">
//                   <div className="h-8 md:h-10 bg-blue-100 rounded w-24" />
//                   <div className="h-8 md:h-10 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded w-32" />
//                 </div>
//                 <div className="h-14 md:h-16 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-xl md:rounded-2xl" />
//               </div>
//             </div>
//           </div>
//         </main>
//         <BottomNav setCategory={setCategory} currentCategory={category} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
//       <Header 
//         searchTerm={searchTerm} 
//         setSearchTerm={setSearchTerm}
//         setCategory={setCategory} 
//         currentCategory={category}
//       />
      
//       <main className="flex-1 container mx-auto px-3 md:px-6 py-4 md:py-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
//           <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 md:mb-0" style={{ color: '#00162f' }}>
//             Finalizar Compra
//           </h1>
//           {searchTerm && (
//             <p className="text-xs md:text-sm text-gray-600 font-medium">
//               {filteredItems.length} de {items.length} producto{items.length !== 1 ? 's' : ''}
//             </p>
//           )}
//         </div>
        
//         {filteredItems.length === 0 && searchTerm ? (
//           <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-md border border-blue-50">
//             <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
//               <span className="text-2xl md:text-3xl">🔍</span>
//             </div>
//             <p className="text-base md:text-lg text-gray-600 mb-4 font-semibold">
//               No se encontraron productos con: {searchTerm}
//             </p>
//             <button 
//               onClick={() => setSearchTerm('')} 
//               className="px-6 py-2.5 rounded-xl font-bold text-sm md:text-base transition-all shadow-lg"
//               style={{ backgroundColor: '#00162f', color: 'white' }}
//             >
//               Limpiar búsqueda
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
//             <div className="lg:col-span-2">
//               <TablaItems 
//                 items={filteredItems}
//                 onAjustarCantidad={ajustarCantidad}
//                 onEliminarItem={eliminarItem}
//                 mostrarControles={true}
//               />
//             </div>

//             <div className="lg:col-span-1">
//               <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl sticky top-24 border" style={{ borderColor: '#00162f20' }}>
//                 <h2 className="text-lg md:text-xl font-black mb-4 md:mb-6" style={{ color: '#00162f' }}>
//                   {searchTerm ? 'Total Filtrado' : 'Detalles de Pago'}
//                 </h2>

//                 {/* CLIENTE */}
//                 <div className="mb-6 pb-6 border-b border-dashed" style={{ borderColor: '#00162f20' }}>
//                   <h3 className="text-sm md:text-base font-bold mb-3" style={{ color: '#00162f' }}>Cliente</h3>
//                   <div className="space-y-1 text-xs md:text-sm">
//                     <p className="font-bold text-base md:text-lg" style={{ color: '#00162f' }}>
//                       {user?.nombre || 'Nombre no disponible'}
//                     </p>
//                     <p>
//                       <span className="font-semibold">Email:</span> {user?.email || 'Email no disponible'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* DATOS DE ENTREGA */}
//                 <div className="mb-6 pb-6 border-b border-dashed" style={{ borderColor: '#00162f20' }}>
//                   <h3 className="text-sm md:text-base font-bold mb-3" style={{ color: '#00162f' }}>Datos de entrega</h3>
                  
//                   {/* Código postal (siempre visible) */}
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium mb-1">Código postal de entrega *</label>
//                     <input
//                       type="text"
//                       value={codigoPostalEntrega}
//                       onChange={(e) => setCodigoPostalEntrega(e.target.value.replace(/\D/, ''))}
//                       maxLength={4}
//                       placeholder="2000-3000"
//                       className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 ${
//                         codigoPostalEntrega && !codigoPostalEntregaValido ? 'border-red-400' : 'border-gray-200'
//                       }`}
//                       style={{ '--tw-ring-color': '#fbbf24' }}
//                       required
//                     />
//                     {codigoPostalEntrega && !codigoPostalEntregaValido && (
//                       <span className="text-xs text-red-500 mt-1 block">
//                         Código postal inválido. Debe ser un número entre 2000 y 3000.
//                       </span>
//                     )}
//                     {!codigoPostalEntrega && (
//                       <span className="text-xs text-gray-500 mt-1 block">
//                         Códigos postales de entrega de 2000 a 3000.
//                       </span>
//                     )}
//                   </div>

//                   {/* Campos restantes (solo si el código postal es válido) */}
//                   {mostrarCamposEntrega && (
//                     <>
//                       <div className="mb-4">
//                         <label className="block text-sm font-medium mb-1">Teléfono de contacto *</label>
//                         <input
//                           type="tel"
//                           value={telefonoContacto}
//                           onChange={(e) => setTelefonoContacto(e.target.value)}
//                           placeholder="3121234567 o 312-123-4567"
//                           className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 ${
//                             telefonoContacto && !telefonoValido ? 'border-red-400' : 'border-gray-200'
//                           }`}
//                           style={{ '--tw-ring-color': '#fbbf24' }}
//                           required
//                         />
//                         {telefonoContacto && !telefonoValido && (
//                           <span className="text-xs text-red-500 mt-1 block">
//                             Teléfono inválido (10 dígitos, opcional guiones)
//                           </span>
//                         )}
//                       </div>

//                       <div className="mb-4">
//                         <label className="block text-sm font-medium mb-1">Dirección de entrega *</label>
//                         <input
//                           type="text"
//                           value={direccionEntrega}
//                           onChange={(e) => setDireccionEntrega(e.target.value)}
//                           placeholder="Calle, número, colonia, ciudad, estado"
//                           className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500"
//                           style={{ '--tw-ring-color': '#fbbf24' }}
//                           required
//                         />
//                       </div>

//                       <div className="mb-4">
//                         <label className="block text-sm font-medium mb-1">Referencia Google Maps (opcional)</label>
//                         <input
//                           type="text"
//                           value={direccionGoogle}
//                           onChange={(e) => setDireccionGoogle(e.target.value)}
//                           placeholder="Pega aquí la dirección de Google Maps o coordenadas"
//                           className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500"
//                           style={{ '--tw-ring-color': '#fbbf24' }}
//                         />
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {/* SUBTOTAL Y GASTOS */}
//                 <div className="space-y-3 md:space-y-4 border-b border-dashed pb-4 md:pb-6 mb-4 md:mb-6" style={{ borderColor: '#00162f20' }}>
//                   <div className="flex justify-between text-sm md:text-base text-gray-600 font-medium">
//                     <span>Subtotal:</span>
//                     <span className="font-bold">${subtotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm md:text-base text-gray-600 font-medium">
//                     <span>Gastos de Maniobra (4%):</span>
//                     <span className="font-bold">${gastosManiobra.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 <div className="flex justify-between text-2xl md:text-3xl font-black mb-6 md:mb-8" style={{ color: '#00162f' }}>
//                   <span>Total:</span>
//                   <span style={{ color: '#fbbf24' }}>
//                     ${totalConGastos.toFixed(2)}
//                   </span>
//                 </div>

//                 {/* TIPO DE COMPROBANTE */}
//                 <div className="mb-6 space-y-3">
//                   <h3 className="text-sm md:text-base font-bold" style={{ color: '#00162f' }}>Tipo de comprobante</h3>
//                   <div className="flex flex-col gap-2">
//                     <label className="flex items-center gap-2 text-sm md:text-base cursor-pointer">
//                       <input
//                         type="radio"
//                         name="tipoFactura"
//                         value="sin_factura"
//                         checked={tipoFactura === 'sin_factura'}
//                         onChange={(e) => setTipoFactura(e.target.value)}
//                         className="w-4 h-4 accent-yellow-400"
//                       />
//                       <span>Sin Factura Fiscal</span>
//                     </label>
//                     <label className="flex items-center gap-2 text-sm md:text-base cursor-pointer">
//                       <input
//                         type="radio"
//                         name="tipoFactura"
//                         value="con_factura"
//                         checked={tipoFactura === 'con_factura'}
//                         onChange={(e) => setTipoFactura(e.target.value)}
//                         className="w-4 h-4 accent-yellow-400"
//                       />
//                       <span>Con Factura Fiscal</span>
//                     </label>
//                   </div>
//                 </div>

//                 {/* FORMULARIO DE DATOS FISCALES (solo si eligió factura) */}
//                 {tipoFactura === 'con_factura' && (
//                   <div className="mb-6 p-4 bg-gray-50 rounded-xl border-2" style={{ borderColor: '#00162f20' }}>
//                     <h3 className="text-sm md:text-base font-bold mb-4" style={{ color: '#00162f' }}>Datos para factura</h3>
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium mb-1">RFC *</label>
//                         <input
//                           type="text"
//                           value={rfc}
//                           onChange={(e) => setRfc(e.target.value.toUpperCase())}
//                           maxLength={13}
//                           placeholder="XAXX010101000"
//                           className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 ${
//                             rfc && !rfcValido ? 'border-red-400' : 'border-gray-200'
//                           }`}
//                           style={{ '--tw-ring-color': '#fbbf24' }}
//                           required
//                         />
//                         {rfc && !rfcValido && (
//                           <span className="text-xs text-red-500 mt-1 block">
//                             Formato: 4 letras + 6 números + 3 dígitos/letras
//                           </span>
//                         )}
//                       </div>
                    
//                       <div>
//                         <label className="block text-sm font-medium mb-1">Razón social o nombre del contribuyente *</label>
//                         <input
//                           type="text"
//                           value={razonSocial}
//                           onChange={(e) => setRazonSocial(e.target.value)}
//                           placeholder="Razón social"
//                           className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500"
//                           style={{ '--tw-ring-color': '#fbbf24' }}
//                           required
//                         />
                    


//                         <label className="block text-sm font-medium mb-1">Domicilio Fiscal *</label>
//                         <input
//                           type="text"
//                           value={domicilioFiscal}
//                           onChange={(e) => setDomicilioFiscal(e.target.value)}
//                           placeholder="Calle, número, colonia"
//                           className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500"
//                           style={{ '--tw-ring-color': '#fbbf24' }}
//                           required
//                         />
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium mb-1">Ciudad *</label>
//                           <input
//                             type="text"
//                             value={ciudad}
//                             onChange={(e) => setCiudad(e.target.value)}
//                             placeholder="Colima"
//                             className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500"
//                             style={{ '--tw-ring-color': '#fbbf24' }}
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium mb-1">Estado *</label>
//                           <select
//                             value={estado}
//                             onChange={(e) => setEstado(e.target.value)}
//                             className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900"
//                             style={{ '--tw-ring-color': '#fbbf24' }}
//                             required
//                           >
//                             <option value="" className="text-gray-500">Selecciona un estado</option>
//                             {estadosMexico.map((est) => (
//                               <option key={est} value={est} className="text-gray-900">
//                                 {est}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium mb-1">Código Postal *</label>
//                           <input
//                             type="text"
//                             value={codigoPostal}
//                             onChange={(e) => setCodigoPostal(e.target.value)}
//                             maxLength={5}
//                             placeholder="28050"
//                             className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500"
//                             style={{ '--tw-ring-color': '#fbbf24' }}
//                             required
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-1">Régimen Fiscal *</label>
//                         <select
//                           value={regimenFiscal}
//                           onChange={(e) => setRegimenFiscal(e.target.value)}
//                           className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900"
//                           style={{ '--tw-ring-color': '#fbbf24' }}
//                           required
//                         >
//                           <option value="616">616 - Sin obligaciones fiscales</option>
//                           <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
//                           <option value="605">605 - Sueldos y Salarios</option>
//                           <option value="606">606 - Arrendamiento</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* BOTÓN DE CONFIRMAR */}
//                 <button
//                   onClick={confirmarPago}
//                   disabled={procesando || !formularioCompleto}
//                   className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg transition-all shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2 md:gap-3"
//                   style={{
//                     backgroundColor: procesando || !formularioCompleto ? '#e5e7eb' : '#fbbf24',
//                     color: procesando || !formularioCompleto ? '#9ca3af' : '#00162f'
//                   }}
//                 >
//                   {procesando ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00162f' }} />
//                       <span>Procesando...</span>
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle size={20} className="md:w-6 md:h-6" />
//                       Confirmar Pago
//                     </>
//                   )}
//                 </button>
                
//                 {tieneErrores && (
//                   <div className="mt-4 p-3 rounded-xl border-2" style={{ backgroundColor: '#fef2f220', borderColor: '#ef444450' }}>
//                     <p className="text-red-600 text-[10px] md:text-xs text-center font-black uppercase tracking-wider leading-tight">
//                       ⚠️ CORRIGE EL STOCK MARCADO EN ROJO
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
      
//       <BottomNav setCategory={setCategory} currentCategory={category} />
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

// Mapeo de códigos de régimen fiscal a descripciones (SAT México)
const getRegimenDescripcion = (codigo) => {
  const regimenes = {
    '601': 'General de Ley Personas Morales',
    '603': 'Personas Morales con Fines no Lucrativos',
    '605': 'Sueldos y Salarios e Ingresos Asimilados a Salarios',
    '606': 'Arrendamiento',
    '607': 'Régimen de Enajenación o Adquisición de Bienes',
    '608': 'Demás ingresos',
    '609': 'Consolidación',
    '610': 'Residentes en el Extranjero sin Establecimiento Permanente en México',
    '611': 'Ingresos por Dividendos (socios y accionistas)',
    '612': 'Personas Físicas con Actividades Empresariales y Profesionales',
    '614': 'Ingresos por intereses',
    '615': 'Régimen de los ingresos por obtención de premios',
    '616': 'Sin obligaciones fiscales',
    '620': 'Sociedades Cooperativas de Producción',
    '621': 'Incorporación Fiscal',
    '622': 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras',
    '623': 'Opcional para Grupos de Sociedades',
    '624': 'Coordinados',
    '625': 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
    '626': 'Régimen Simplificado de Confianza',
  };
  return regimenes[codigo] || 'Régimen no especificado';
};

// Expresión regular para RFC persona física (4 letras + 6 números + 3 alfanuméricos)
const validarRFC = (rfc) => {
  const re = /^[A-Z&Ñ]{4}\d{6}[A-Z0-9]{3}$/;
  return re.test(rfc);
};

// Validar teléfono mexicano (10 dígitos, opcional con guiones)
const validarTelefono = (tel) => {
  const re = /^\d{10}$|^\d{3}-\d{3}-\d{4}$/;
  return re.test(tel);
};

// Lista de todos los estados de México
const estadosMexico = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
  'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México',
  'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
  'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora',
  'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
];

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('todas');
  const [tipoFactura, setTipoFactura] = useState(null); // 'con_factura' o 'sin_factura'

  // --- CAMPOS DE ENTREGA ---
  const [codigoPostalEntrega, setCodigoPostalEntrega] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [direccionGoogle, setDireccionGoogle] = useState(''); // opcional

  // --- CAMPOS FISCALES (solo si se requiere factura) ---
  const [rfc, setRfc] = useState('');
  const [domicilioFiscal, setDomicilioFiscal] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [estado, setEstado] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [regimenFiscal, setRegimenFiscal] = useState('616');

  const { user, updateCartCount } = useAuth();
  const router = useRouter();

  // Obtener carrito
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

  // Filtro por búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }
    const filtered = items.filter(item => 
      item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  // Eliminar item del carrito
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

  // Ajustar cantidad
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

  // Cálculos financieros
  const subtotal = useMemo(() => 
    items.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0), 
    [items]
  );
  const gastosManiobra = useMemo(() => subtotal * 0.04, [subtotal]);
  const totalConGastos = useMemo(() => subtotal + gastosManiobra, [subtotal, gastosManiobra]);

  const itemsConError = useMemo(() => 
    filteredItems.filter(item => item.cantidad > (item.stock || 0)), 
    [filteredItems]
  );
  const tieneErrores = itemsConError.length > 0;

  // Validaciones
  const telefonoValido = validarTelefono(telefonoContacto);
  const rfcValido = validarRFC(rfc);
  const codigoPostalEntregaValido = /^\d{4}$/.test(codigoPostalEntrega) && 
    parseInt(codigoPostalEntrega) >= 2000 && parseInt(codigoPostalEntrega) <= 3000;

  // Los campos de entrega se muestran solo si el código postal es válido
  const mostrarCamposEntrega = codigoPostalEntregaValido;

  const datosEntregaValidos = mostrarCamposEntrega && telefonoValido && direccionEntrega.trim() !== '';

  const datosFiscalesValidos = tipoFactura !== 'con_factura' || (
    rfc.trim() !== '' && rfcValido &&
    razonSocial.trim() !== '' &&
    domicilioFiscal.trim() !== '' &&
    ciudad.trim() !== '' &&
    estado.trim() !== '' &&
    codigoPostal.trim() !== '' &&
    regimenFiscal.trim() !== ''
  );

  const formularioCompleto = 
    filteredItems.length > 0 &&
    !tieneErrores &&
    tipoFactura !== null &&
    datosEntregaValidos &&
    datosFiscalesValidos;

const confirmarPago = async () => {
  setProcesando(true);
  
  try {
    const token = Cookies.get('token');
    
    const numeroFactura = tipoFactura === 'con_factura' 
      ? `FAC-${Date.now().toString().slice(-8)}` 
      : null;

    const pedidoData = {
      items: items.map(item => ({
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion || '',
        cantidad: item.cantidad,
        precio: Number(item.precio),
        categoria: item.categoria || ''
      })),
      subtotal,
      gastoManiobra: gastosManiobra,
      total: totalConGastos,
      conFactura: tipoFactura === 'con_factura',
      codigo_postal_entrega: codigoPostalEntrega,
      telefono_contacto: telefonoContacto,
      direccion_entrega: direccionEntrega,
      direccion_google: direccionGoogle || null,
      rfc: tipoFactura === 'con_factura' ? rfc : null,
      razon_social: tipoFactura === 'con_factura' ? razonSocial : null,
      domicilio_fiscal: tipoFactura === 'con_factura' ? domicilioFiscal : null,
      ciudad: tipoFactura === 'con_factura' ? ciudad : null,
      estado: tipoFactura === 'con_factura' ? estado : null,
      codigo_postal: tipoFactura === 'con_factura' ? codigoPostal : null,
      regimen_fiscal: tipoFactura === 'con_factura' ? regimenFiscal : null,
      numeroFactura: numeroFactura
    };

    const pedidoRes = await fetch('/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(pedidoData)
    });

    const pedidoGuardado = await pedidoRes.json();

    if (!pedidoRes.ok) {
      throw new Error(pedidoGuardado.error || 'Error al registrar el pedido');
    }

    // Enviar email al administrador (opcional)
    try {
      await fetch('/api/send-admin-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido: {
            id: pedidoGuardado.pedido.id,
            ...pedidoData
          },
          usuario: {
            nombre: user?.nombre,
            email: user?.email
          }
        })
      });
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
    }

    // Vaciar carrito
    const vaciarRes = await fetch('/api/carrito/vaciar', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!vaciarRes.ok) {
      const errorData = await vaciarRes.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al vaciar el carrito');
    }

    toast.success('¡Compra exitosa!', { icon: '🎉', duration: 3000 });
    setItems([]);
    updateCartCount();
    
    // Redirigir a la factura específica usando el ID del pedido
    setTimeout(() => router.push(`/factura/${pedidoGuardado.pedido.id}`), 1500);
    
  } catch (error) {
    console.error('Error en confirmarPago:', error);
    toast.error(error.message || 'Error al procesar la compra');
  } finally {
    setProcesando(false);
  }
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
                  {searchTerm ? 'Total Filtrado' : 'Detalles de Pago'}
                </h2>

                {/* CLIENTE */}
                <div className="mb-6 pb-6 border-b border-dashed" style={{ borderColor: '#00162f20' }}>
                  <h3 className="text-sm md:text-base font-bold mb-3" style={{ color: '#00162f' }}>Cliente</h3>
                  <div className="space-y-1 text-xs md:text-sm">
                    <p className="font-bold text-base md:text-lg" style={{ color: '#00162f' }}>
                      {user?.nombre || 'Nombre no disponible'}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {user?.email || 'Email no disponible'}
                    </p>
                  </div>
                </div>

                {/* DATOS DE ENTREGA */}
                <div className="mb-6 pb-6 border-b border-dashed" style={{ borderColor: '#00162f20' }}>
                  <h3 className="text-sm md:text-base font-bold mb-3" style={{ color: '#00162f' }}>Datos de entrega</h3>
                  
                  {/* Código postal (siempre visible) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Código postal de entrega *</label>
                    <input
                      type="text"
                      value={codigoPostalEntrega}
                      onChange={(e) => setCodigoPostalEntrega(e.target.value.replace(/\D/, ''))}
                      maxLength={4}
                      placeholder="2000-3000"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 ${
                        codigoPostalEntrega && !codigoPostalEntregaValido ? 'border-red-400' : 'border-gray-200'
                      }`}
                      style={{ '--tw-ring-color': '#fbbf24' }}
                      required
                    />
                    {codigoPostalEntrega && !codigoPostalEntregaValido && (
                      <span className="text-xs text-red-500 mt-1 block">
                        Código postal inválido. Debe ser un número entre 2000 y 3000.
                      </span>
                    )}
                    {!codigoPostalEntrega && (
                      <span className="text-xs text-gray-500 mt-1 block">
                        Códigos postales de entrega de 2000 a 3000.
                      </span>
                    )}
                  </div>

                  {/* Campos restantes (solo si el código postal es válido) */}
                  {mostrarCamposEntrega && (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Teléfono de contacto *</label>
                        <input
                          type="tel"
                          value={telefonoContacto}
                          onChange={(e) => setTelefonoContacto(e.target.value)}
                          placeholder="3121234567 o 312-123-4567"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 ${
                            telefonoContacto && !telefonoValido ? 'border-red-400' : 'border-gray-200'
                          }`}
                          style={{ '--tw-ring-color': '#fbbf24' }}
                          required
                        />
                        {telefonoContacto && !telefonoValido && (
                          <span className="text-xs text-red-500 mt-1 block">
                            Teléfono inválido (10 dígitos, opcional guiones)
                          </span>
                        )}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Dirección de entrega *</label>
                        <input
                          type="text"
                          value={direccionEntrega}
                          onChange={(e) => setDireccionEntrega(e.target.value)}
                          placeholder="Calle, número, colonia, ciudad, estado"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500"
                          style={{ '--tw-ring-color': '#fbbf24' }}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Referencia Google Maps (opcional)</label>
                        <input
                          type="text"
                          value={direccionGoogle}
                          onChange={(e) => setDireccionGoogle(e.target.value)}
                          placeholder="Pega aquí la dirección de Google Maps o coordenadas"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500"
                          style={{ '--tw-ring-color': '#fbbf24' }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* SUBTOTAL Y GASTOS */}
                <div className="space-y-3 md:space-y-4 border-b border-dashed pb-4 md:pb-6 mb-4 md:mb-6" style={{ borderColor: '#00162f20' }}>
                  <div className="flex justify-between text-sm md:text-base text-gray-600 font-medium">
                    <span>Subtotal:</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-600 font-medium">
                    <span>Gastos de Maniobra (4%):</span>
                    <span className="font-bold">${gastosManiobra.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-2xl md:text-3xl font-black mb-6 md:mb-8" style={{ color: '#00162f' }}>
                  <span>Total:</span>
                  <span style={{ color: '#fbbf24' }}>
                    ${totalConGastos.toFixed(2)}
                  </span>
                </div>

                {/* TIPO DE COMPROBANTE */}
                <div className="mb-6 space-y-3">
                  <h3 className="text-sm md:text-base font-bold" style={{ color: '#00162f' }}>Tipo de comprobante</h3>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm md:text-base cursor-pointer">
                      <input
                        type="radio"
                        name="tipoFactura"
                        value="sin_factura"
                        checked={tipoFactura === 'sin_factura'}
                        onChange={(e) => setTipoFactura(e.target.value)}
                        className="w-4 h-4 accent-yellow-400"
                      />
                      <span>Sin Factura Fiscal</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm md:text-base cursor-pointer">
                      <input
                        type="radio"
                        name="tipoFactura"
                        value="con_factura"
                        checked={tipoFactura === 'con_factura'}
                        onChange={(e) => setTipoFactura(e.target.value)}
                        className="w-4 h-4 accent-yellow-400"
                      />
                      <span>Con Factura Fiscal</span>
                    </label>
                  </div>
                </div>

                {/* FORMULARIO DE DATOS FISCALES (solo si eligió factura) */}
                {tipoFactura === 'con_factura' && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border-2" style={{ borderColor: '#00162f20' }}>
                    <h3 className="text-sm md:text-base font-bold mb-4" style={{ color: '#00162f' }}>Datos para factura</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">RFC *</label>
                        <input
                          type="text"
                          value={rfc}
                          onChange={(e) => setRfc(e.target.value.toUpperCase())}
                          maxLength={13}
                          placeholder="XAXX010101000"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 ${
                            rfc && !rfcValido ? 'border-red-400' : 'border-gray-200'
                          }`}
                          style={{ '--tw-ring-color': '#fbbf24' }}
                          required
                        />
                        {rfc && !rfcValido && (
                          <span className="text-xs text-red-500 mt-1 block">
                            Formato: 4 letras + 6 números + 3 dígitos/letras
                          </span>
                        )}
                      </div>
                    
                      <div>
                        <label className="block text-sm font-medium mb-1">Razón social o nombre del contribuyente *</label>
                        <input
                          type="text"
                          value={razonSocial}
                          onChange={(e) => setRazonSocial(e.target.value)}
                          placeholder="Razón social"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500"
                          style={{ '--tw-ring-color': '#fbbf24' }}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Domicilio Fiscal *</label>
                        <input
                          type="text"
                          value={domicilioFiscal}
                          onChange={(e) => setDomicilioFiscal(e.target.value)}
                          placeholder="Calle, número, colonia"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500"
                          style={{ '--tw-ring-color': '#fbbf24' }}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Ciudad *</label>
                          <input
                            type="text"
                            value={ciudad}
                            onChange={(e) => setCiudad(e.target.value)}
                            placeholder="Colima"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500"
                            style={{ '--tw-ring-color': '#fbbf24' }}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Estado *</label>
                          <select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900"
                            style={{ '--tw-ring-color': '#fbbf24' }}
                            required
                          >
                            <option value="" className="text-gray-500">Selecciona un estado</option>
                            {estadosMexico.map((est) => (
                              <option key={est} value={est} className="text-gray-900">
                                {est}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Código Postal *</label>
                          <input
                            type="text"
                            value={codigoPostal}
                            onChange={(e) => setCodigoPostal(e.target.value)}
                            maxLength={5}
                            placeholder="28050"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500"
                            style={{ '--tw-ring-color': '#fbbf24' }}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Régimen Fiscal *</label>
                        <select
                          value={regimenFiscal}
                          onChange={(e) => setRegimenFiscal(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-900"
                          style={{ '--tw-ring-color': '#fbbf24' }}
                          required
                        >
                          <option value="616">616 - Sin obligaciones fiscales</option>
                          <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                          <option value="605">605 - Sueldos y Salarios</option>
                          <option value="606">606 - Arrendamiento</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* BOTÓN DE CONFIRMAR */}
                <button
                  onClick={confirmarPago}
                  disabled={procesando || !formularioCompleto}
                  className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg transition-all shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2 md:gap-3"
                  style={{
                    backgroundColor: procesando || !formularioCompleto ? '#e5e7eb' : '#fbbf24',
                    color: procesando || !formularioCompleto ? '#9ca3af' : '#00162f'
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