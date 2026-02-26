// // // app/factura/FacturaContent.jsx
// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import { CheckCircle, Download } from 'lucide-react';

// // export default function FacturaContent() {
// //   const router = useRouter();
// //   const [facturaData, setFacturaData] = useState(null);
// //   const [generandoPDF, setGenerandoPDF] = useState(false);
// //   const [html2pdf, setHtml2pdf] = useState(null);

// //   // Cargar html2pdf.js solo en el cliente
// //   useEffect(() => {
// //     // Importar la librería dinámicamente
// //     import('html2pdf.js').then((module) => {
// //       setHtml2pdf(() => module.default);
// //     }).catch(error => {
// //       console.error('Error al cargar html2pdf.js:', error);
// //     });

// //     // Obtener datos de localStorage
// //     try {
// //       const data = localStorage.getItem('facturaData');
// //       if (data) {
// //         setFacturaData(JSON.parse(data));
// //       } else {
// //         router.push('/');
// //       }
// //     } catch (error) {
// //       console.error('Error al leer localStorage:', error);
// //       router.push('/');
// //     }
// //   }, [router]);

// //   const generarPDF = async () => {
// //     if (!html2pdf || !facturaData) {
// //       alert('La librería de PDF aún no está lista. Intenta de nuevo.');
// //       return;
// //     }

// //     setGenerandoPDF(true);
    
// //     const elemento = document.getElementById('factura-contenido');
// //     if (!elemento) {
// //       console.error('No se encontró el elemento de factura');
// //       setGenerandoPDF(false);
// //       return;
// //     }

// //     const opciones = {
// //       margin: [10, 10, 10, 10], // [top, right, bottom, left]
// //       filename: `Factura_${facturaData.numeroFactura}.pdf`,
// //       image: { type: 'jpeg', quality: 0.98 },
// //       html2canvas: { 
// //         scale: 2, 
// //         useCORS: true,
// //         logging: false,
// //         allowTaint: false,
// //         backgroundColor: '#ffffff'
// //       },
// //       jsPDF: { 
// //         unit: 'mm', 
// //         format: 'a4', 
// //         orientation: 'portrait',
// //         compress: true
// //       }
// //     };

// //     try {
// //       await html2pdf().set(opciones).from(elemento).save();
// //       console.log('PDF generado exitosamente');
// //     } catch (error) {
// //       console.error('Error al generar PDF:', error);
// //       alert('Hubo un error al generar el PDF. Por favor intenta de nuevo.');
// //     } finally {
// //       setGenerandoPDF(false);
// //     }
// //   };

// //   if (!facturaData) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400" />
// //       </div>
// //     );
// //   }

// //   const { fecha, hora, usuario, items, subtotal, iva, total, numeroFactura } = facturaData;

// //   return (
// //     <>
// //       {/* Botones de acción */}
// //       <div className="no-print fixed top-4 right-4 z-50 flex gap-3">
// //         <button
// //           onClick={() => router.push('/tracking')}
// //           className="px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all hover:opacity-90"
// //           style={{ backgroundColor: '#00162f', color: 'white' }}
// //         >
// //           Tracking del Pedido
// //         </button>
// //         <button
// //           onClick={() => router.push('/')}
// //           className="px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all hover:opacity-90"
// //           style={{ backgroundColor: '#00162f', color: 'white' }}
// //         >
// //           Ir al Inicio
// //         </button>
// //         <button
// //           onClick={generarPDF}
// //           disabled={generandoPDF}
// //           className="px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
// //           style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
// //         >
// //           {generandoPDF ? (
// //             <>
// //               <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00162f' }} />
// //               Generando...
// //             </>
// //           ) : (
// //             <>
// //               <Download size={18} />
// //               Descargar PDF
// //             </>
// //           )}
// //         </button>
// //       </div>

// //       {/* Contenido de la factura */}
// //       <div className="min-h-screen bg-gray-50 p-4 md:p-8">
// //         <div id="factura-contenido" className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
// //           {/* Header con éxito */}
// //           <div className="no-print relative overflow-hidden" style={{ backgroundColor: '#00162f' }}>
// //             <div className="absolute inset-0 opacity-10">
// //               <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-yellow-400 blur-3xl" />
// //               <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-yellow-400 blur-3xl" />
// //             </div>
// //             <div className="relative text-center py-8">
// //               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4">
// //                 <CheckCircle size={32} className="text-white" />
// //               </div>
// //               <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
// //                 ¡Compra Exitosa!
// //               </h1>
// //               <p className="text-yellow-400 font-medium">
// //                 Tu pedido ha sido procesado correctamente
// //               </p>
// //             </div>
// //           </div>

// //           {/* Información de la empresa */}
// //           <div className="border-b-4 p-6 md:p-8" style={{ borderColor: '#fbbf24' }}>
// //             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
// //               <div className="flex items-center gap-4">
// //                 <img src="/bodega-img.jpg" alt="Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
// //                 <div>
// //                   <h2 className="text-xl md:text-2xl font-black tracking-wider" style={{ color: '#00162f' }}>
// //                     BODEGA DE AZULEJOS
// //                   </h2>
// //                   <p className="text-xs md:text-sm text-gray-600 font-medium">
// //                     RFC: BDA123456ABC
// //                   </p>
// //                   <p className="text-xs md:text-sm text-gray-600">
// //                     Av. Principal #123, Ciudad
// //                   </p>
// //                 </div>
// //               </div>

// //               <div className="text-left md:text-right">
// //                 <div className="inline-block px-4 py-2 rounded-lg mb-2" style={{ backgroundColor: '#fbbf2420' }}>
// //                   <p className="text-xs text-gray-600 font-bold uppercase">Factura</p>
// //                   <p className="text-lg md:text-xl font-black" style={{ color: '#00162f' }}>
// //                     #{numeroFactura}
// //                   </p>
// //                 </div>
// //                 <p className="text-xs md:text-sm text-gray-600 font-medium">
// //                   <span className="font-bold">Fecha:</span> {fecha}
// //                 </p>
// //                 <p className="text-xs md:text-sm text-gray-600 font-medium">
// //                   <span className="font-bold">Hora:</span> {hora}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Cliente */}
// //           <div className="p-6 md:p-8 bg-gray-50">
// //             <h3 className="text-sm md:text-base font-black uppercase tracking-wider mb-4" style={{ color: '#00162f' }}>
// //               Datos del Cliente
// //             </h3>
// //             <div className="grid md:grid-cols-2 gap-4">
// //               <div>
// //                 <p className="text-xs text-gray-500 font-bold mb-1">Nombre</p>
// //                 <p className="text-sm md:text-base font-bold text-gray-800">{usuario.nombre}</p>
// //               </div>
// //               <div>
// //                 <p className="text-xs text-gray-500 font-bold mb-1">Correo Electrónico</p>
// //                 <p className="text-sm md:text-base font-bold text-gray-800">{usuario.email}</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Productos */}
// //           <div className="p-6 md:p-8">
// //             <h3 className="text-sm md:text-base font-black uppercase tracking-wider mb-4" style={{ color: '#00162f' }}>
// //               Detalle de Productos
// //             </h3>

// //             <div className="hidden md:grid md:grid-cols-12 gap-4 pb-3 mb-3 border-b-2 text-xs font-black uppercase" style={{ borderColor: '#fbbf24', color: '#00162f' }}>
// //               <div className="col-span-5">Producto</div>
// //               <div className="col-span-2 text-center">Cantidad</div>
// //               <div className="col-span-2 text-right">Precio Unit.</div>
// //               <div className="col-span-3 text-right">Subtotal</div>
// //             </div>

// //             <div className="space-y-3 md:space-y-2">
// //               {items.map((item, index) => (
// //                 <div key={index} className="md:grid md:grid-cols-12 md:gap-4 md:items-center py-3 border-b border-gray-200 last:border-0">
// //                   <div className="md:hidden space-y-2">
// //                     <p className="font-bold text-sm text-gray-800">{item.nombre}</p>
// //                     <div className="flex justify-between text-xs">
// //                       <span className="text-gray-600">Cantidad: <span className="font-bold">{item.cantidad}</span></span>
// //                       <span className="text-gray-600">Precio: <span className="font-bold">${Number(item.precio).toFixed(2)}</span></span>
// //                     </div>
// //                     <div className="flex justify-between items-center pt-2 border-t border-gray-100">
// //                       <span className="text-xs text-gray-600 font-bold">Subtotal:</span>
// //                       <span className="text-base font-black" style={{ color: '#00162f' }}>
// //                         ${(Number(item.precio) * item.cantidad).toFixed(2)}
// //                       </span>
// //                     </div>
// //                   </div>

// //                   <div className="hidden md:contents">
// //                     <div className="col-span-5">
// //                       <p className="font-bold text-sm text-gray-800">{item.nombre}</p>
// //                       {item.descripcion && (
// //                         <p className="text-xs text-gray-500 mt-1">{item.descripcion}</p>
// //                       )}
// //                     </div>
// //                     <div className="col-span-2 text-center">
// //                       <span className="inline-block px-3 py-1 rounded-lg font-bold text-sm" style={{ backgroundColor: '#fbbf2420', color: '#00162f' }}>
// //                         {item.cantidad}
// //                       </span>
// //                     </div>
// //                     <div className="col-span-2 text-right font-bold text-sm text-gray-800">
// //                       ${Number(item.precio).toFixed(2)}
// //                     </div>
// //                     <div className="col-span-3 text-right font-black text-base" style={{ color: '#00162f' }}>
// //                       ${(Number(item.precio) * item.cantidad).toFixed(2)}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Totales */}
// //           <div className="p-6 md:p-8 border-t-2" style={{ borderColor: '#00162f' }}>
// //             <div className="max-w-md ml-auto space-y-3">
// //               <div className="flex justify-between items-center text-sm md:text-base">
// //                 <span className="font-bold text-gray-600">Subtotal:</span>
// //                 <span className="font-black text-gray-800">${subtotal.toFixed(2)}</span>
// //               </div>
// //               <div className="flex justify-between items-center text-sm md:text-base">
// //                 <span className="font-bold text-gray-600">IVA (16%):</span>
// //                 <span className="font-black text-gray-800">${iva.toFixed(2)}</span>
// //               </div>
// //               <div className="flex justify-between items-center pt-3 border-t-2" style={{ borderColor: '#fbbf24' }}>
// //                 <span className="text-lg md:text-xl font-black" style={{ color: '#00162f' }}>
// //                   TOTAL:
// //                 </span>
// //                 <span className="text-2xl md:text-3xl font-black" style={{ color: '#fbbf24' }}>
// //                   ${total.toFixed(2)}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Footer */}
// //           <div className="p-6 md:p-8 text-center border-t" style={{ backgroundColor: '#00162f' }}>
// //             <p className="text-xs md:text-sm text-white font-medium mb-2">
// //               ¡Gracias por tu compra!
// //             </p>
// //             <p className="text-xs text-yellow-400">
// //               www.bodegadeazulejos.com | contacto@bodegadeazulejos.com | Tel: (55) 1234-5678
// //             </p>
// //           </div>
// //         </div>
// //       </div>

// //       <style jsx global>{`
// //         @media print {
// //           body { margin: 0; padding: 0; background: white; }
// //           .no-print { display: none !important; }
// //           @page { 
// //             margin: 1cm;
// //             size: A4;
// //           }
// //           #factura-contenido {
// //             box-shadow: none;
// //           }
// //         }
// //       `}</style>
// //     </>
// //   );
// // }











// // components/FacturaContent.jsx
// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { CheckCircle, Download, FileDown, AlertCircle } from 'lucide-react';

// export default function FacturaContent() {
//   const router = useRouter();
//   const facturaRef = useRef(null);
//   const [facturaData, setFacturaData] = useState(null);
//   const [generandoPDF, setGenerandoPDF] = useState(false);
//   const [error, setError] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);

//   // Detectar si es móvil
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     // Obtener datos de localStorage
//     try {
//       const data = localStorage.getItem('facturaData');
//       if (data) {
//         setFacturaData(JSON.parse(data));
//       } else {
//         router.push('/');
//       }
//     } catch (error) {
//       console.error('Error al leer localStorage:', error);
//       setError('No se pudieron cargar los datos de la factura');
//     }
//   }, [router]);

//   const generarPDF = async () => {
//     if (!facturaData) return;

//     setGenerandoPDF(true);
//     setError(null);

//     try {
//       // Importar dinámicamente las librerías necesarias
//       const [html2pdfModule] = await Promise.all([
//         import('html2pdf.js'),
//         new Promise(resolve => setTimeout(resolve, 100)) // Pequeño delay para móviles
//       ]);

//       const html2pdf = html2pdfModule.default;
      
//       const elemento = document.getElementById('factura-contenido');
//       if (!elemento) throw new Error('No se encontró el elemento de factura');

//       // Crear un contenedor temporal para el PDF
//       const container = document.createElement('div');
//       container.style.position = 'absolute';
//       container.style.left = '-9999px';
//       container.style.top = '-9999px';
//       container.style.width = isMobile ? '100%' : '800px';
//       container.style.backgroundColor = '#ffffff';
      
//       // Clonar el contenido con todos los estilos
//       const clone = elemento.cloneNode(true);
      
//       // Asegurar que los estilos se mantengan
//       clone.style.width = isMobile ? '100%' : '800px';
//       clone.style.maxWidth = '800px';
//       clone.style.margin = '0 auto';
//       clone.style.padding = '20px';
//       clone.style.backgroundColor = '#ffffff';
//       clone.style.boxShadow = 'none';
      
//       // Eliminar botones de acción del clon
//       const buttonsToRemove = clone.querySelectorAll('.no-print');
//       buttonsToRemove.forEach(btn => btn.remove());
      
//       container.appendChild(clone);
//       document.body.appendChild(container);

//       // Opciones optimizadas para móvil y desktop
//       const opciones = {
//         margin: isMobile ? [10, 5, 10, 5] : [15, 15, 15, 15],
//         filename: `Factura_${facturaData.numeroFactura}.pdf`,
//         image: { type: 'jpeg', quality: 0.95 },
//         html2canvas: { 
//           scale: isMobile ? 2 : 3,
//           useCORS: true,
//           logging: false,
//           allowTaint: false,
//           backgroundColor: '#ffffff',
//           letterRendering: true,
//           foreignObjectRendering: false,
//           windowWidth: isMobile ? 375 : 800,
//           windowHeight: isMobile ? 667 : 1200
//         },
//         jsPDF: { 
//           unit: 'mm', 
//           format: 'a4', 
//           orientation: 'portrait',
//           compress: true,
//           precision: 16
//         }
//       };

//       // Generar PDF
//       await html2pdf()
//         .from(container)
//         .set(opciones)
//         .save();

//       // Limpiar elemento temporal
//       document.body.removeChild(container);
      
//       console.log('PDF generado exitosamente');
//     } catch (error) {
//       console.error('Error al generar PDF:', error);
//       setError('Error al generar el PDF. Por favor intenta de nuevo.');
      
//       // Fallback: intentar con configuración más simple
//       try {
//         await generarPDFSimple();
//       } catch (fallbackError) {
//         console.error('Fallback también falló:', fallbackError);
//         alert('No se pudo generar el PDF. Intenta usar la opción de imprimir.');
//       }
//     } finally {
//       setGenerandoPDF(false);
//     }
//   };

//   // Función de fallback más simple
//   const generarPDFSimple = async () => {
//     const elemento = document.getElementById('factura-contenido');
//     const html2pdf = (await import('html2pdf.js')).default;
    
//     await html2pdf()
//       .from(elemento)
//       .set({
//         margin: 10,
//         filename: `Factura_${facturaData.numeroFactura}.pdf`,
//         image: { type: 'jpeg', quality: 0.9 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//       })
//       .save();
//   };

//   // Función para imprimir (alternativa para móviles)
//   const imprimirFactura = () => {
//     window.print();
//   };

//   if (!facturaData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <div className="bg-red-50 p-6 rounded-lg text-center">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <p className="text-red-600 font-medium mb-4">{error}</p>
//           <button
//             onClick={() => router.push('/')}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             Volver al Inicio
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { fecha, hora, usuario, items, subtotal, iva, total, numeroFactura } = facturaData;

//   return (
//     <>
//       {/* Botones de acción - siempre visibles pero adaptados */}
//       <div className="no-print fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b p-3 flex flex-wrap gap-2 justify-end">
//         <button
//           onClick={() => router.push('/')}
//           className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition-all hover:opacity-90"
//           style={{ backgroundColor: '#00162f', color: 'white' }}
//         >
//           Inicio
//         </button>
//         <button
//           onClick={() => router.push('/tracking')}
//           className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition-all hover:opacity-90"
//           style={{ backgroundColor: '#00162f', color: 'white' }}
//         >
//           Tracking
//         </button>
//         <button
//           onClick={generarPDF}
//           disabled={generandoPDF}
//           className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition-all hover:opacity-90 flex items-center gap-1 md:gap-2 disabled:opacity-50"
//           style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
//         >
//           {generandoPDF ? (
//             <>
//               <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00162f' }} />
//               <span className="hidden sm:inline">Generando...</span>
//             </>
//           ) : (
//             <>
//               <Download size={isMobile ? 14 : 18} />
//               <span className="hidden sm:inline">PDF</span>
//               <span className="sm:hidden">PDF</span>
//             </>
//           )}
//         </button>
//         {isMobile && (
//           <button
//             onClick={imprimirFactura}
//             className="px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg transition-all hover:opacity-90 bg-gray-600 text-white flex items-center gap-1"
//           >
//             <FileDown size={14} />
//             Imprimir
//           </button>
//         )}
//       </div>

//       {/* Contenido de la factura - con padding superior para los botones */}
//       <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 p-3 md:p-8">
//         <div 
//           id="factura-contenido" 
//           ref={facturaRef}
//           className="max-w-4xl mx-auto bg-white shadow-xl md:shadow-2xl rounded-xl md:rounded-2xl overflow-hidden"
//         >
//           {/* Header con éxito */}
//           <div className="relative overflow-hidden" style={{ backgroundColor: '#00162f' }}>
//             <div className="absolute inset-0 opacity-10">
//               <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 rounded-full bg-yellow-400 blur-2xl md:blur-3xl" />
//               <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 rounded-full bg-yellow-400 blur-2xl md:blur-3xl" />
//             </div>
//             <div className="relative text-center py-4 md:py-8 px-3">
//               <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-500 mb-2 md:mb-4">
//                 <CheckCircle size={isMobile ? 20 : 32} className="text-white" />
//               </div>
//               <h1 className="text-xl md:text-3xl font-black text-white mb-1 md:mb-2">
//                 ¡Compra Exitosa!
//               </h1>
//               <p className="text-xs md:text-base text-yellow-400 font-medium px-2">
//                 Tu pedido ha sido procesado correctamente
//               </p>
//             </div>
//           </div>

//           {/* Información de la empresa */}
//           <div className="border-b-4 p-4 md:p-8" style={{ borderColor: '#fbbf24' }}>
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
//               <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
//                 <img src="/bodega-img.jpg" alt="Logo" className="w-10 h-10 md:w-20 md:h-20 object-contain" />
//                 <div className="flex-1">
//                   <h2 className="text-base md:text-2xl font-black tracking-wider" style={{ color: '#00162f' }}>
//                     BODEGA DE AZULEJOS
//                   </h2>
//                   <p className="text-xs md:text-sm text-gray-600 font-medium">
//                     RFC: BDA123456ABC
//                   </p>
//                   <p className="text-xs md:text-sm text-gray-600">
//                     Av. Principal #123, Ciudad
//                   </p>
//                 </div>
//               </div>

//               <div className="w-full md:w-auto text-left md:text-right">
//                 <div className="inline-block px-3 py-1 md:px-4 md:py-2 rounded-lg mb-1 md:mb-2" style={{ backgroundColor: '#fbbf2420' }}>
//                   <p className="text-xs text-gray-600 font-bold uppercase">Factura</p>
//                   <p className="text-base md:text-xl font-black" style={{ color: '#00162f' }}>
//                     #{numeroFactura}
//                   </p>
//                 </div>
//                 <p className="text-xs md:text-sm text-gray-600 font-medium">
//                   <span className="font-bold">Fecha:</span> {fecha}
//                 </p>
//                 <p className="text-xs md:text-sm text-gray-600 font-medium">
//                   <span className="font-bold">Hora:</span> {hora}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Cliente */}
//           <div className="p-4 md:p-8 bg-gray-50">
//             <h3 className="text-sm md:text-base font-black uppercase tracking-wider mb-3 md:mb-4" style={{ color: '#00162f' }}>
//               Datos del Cliente
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
//               <div>
//                 <p className="text-xs text-gray-500 font-bold mb-1">Nombre</p>
//                 <p className="text-sm md:text-base font-bold text-gray-800 break-words">{usuario.nombre}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-bold mb-1">Correo Electrónico</p>
//                 <p className="text-sm md:text-base font-bold text-gray-800 break-words">{usuario.email}</p>
//               </div>
//             </div>
//           </div>

//           {/* Productos */}
//           <div className="p-4 md:p-8">
//             <h3 className="text-sm md:text-base font-black uppercase tracking-wider mb-3 md:mb-4" style={{ color: '#00162f' }}>
//               Detalle de Productos
//             </h3>

//             {/* Desktop Header */}
//             <div className="hidden md:grid md:grid-cols-12 gap-4 pb-3 mb-3 border-b-2 text-xs font-black uppercase" style={{ borderColor: '#fbbf24', color: '#00162f' }}>
//               <div className="col-span-5">Producto</div>
//               <div className="col-span-2 text-center">Cantidad</div>
//               <div className="col-span-2 text-right">Precio Unit.</div>
//               <div className="col-span-3 text-right">Subtotal</div>
//             </div>

//             {/* Items */}
//             <div className="space-y-3 md:space-y-2">
//               {items.map((item, index) => (
//                 <div key={index} className="border-b border-gray-200 last:border-0 pb-3 md:pb-0">
//                   {/* Versión Mobile */}
//                   <div className="md:hidden space-y-2">
//                     <p className="font-bold text-sm text-gray-800">{item.nombre}</p>
//                     <div className="grid grid-cols-2 gap-2 text-xs">
//                       <div>
//                         <span className="text-gray-600">Cantidad: </span>
//                         <span className="font-bold">{item.cantidad}</span>
//                       </div>
//                       <div className="text-right">
//                         <span className="text-gray-600">Precio: </span>
//                         <span className="font-bold">${Number(item.precio).toFixed(2)}</span>
//                       </div>
//                     </div>
//                     <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//                       <span className="text-xs text-gray-600 font-bold">Subtotal:</span>
//                       <span className="text-base font-black" style={{ color: '#00162f' }}>
//                         ${(Number(item.precio) * item.cantidad).toFixed(2)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Versión Desktop */}
//                   <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center py-3">
//                     <div className="col-span-5">
//                       <p className="font-bold text-sm text-gray-800">{item.nombre}</p>
//                       {item.descripcion && (
//                         <p className="text-xs text-gray-500 mt-1">{item.descripcion}</p>
//                       )}
//                     </div>
//                     <div className="col-span-2 text-center">
//                       <span className="inline-block px-3 py-1 rounded-lg font-bold text-sm" style={{ backgroundColor: '#fbbf2420', color: '#00162f' }}>
//                         {item.cantidad}
//                       </span>
//                     </div>
//                     <div className="col-span-2 text-right font-bold text-sm text-gray-800">
//                       ${Number(item.precio).toFixed(2)}
//                     </div>
//                     <div className="col-span-3 text-right font-black text-base" style={{ color: '#00162f' }}>
//                       ${(Number(item.precio) * item.cantidad).toFixed(2)}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Totales */}
//           <div className="p-4 md:p-8 border-t-2" style={{ borderColor: '#00162f' }}>
//             <div className="max-w-md ml-auto space-y-2 md:space-y-3">
//               <div className="flex justify-between items-center text-sm md:text-base">
//                 <span className="font-bold text-gray-600">Subtotal:</span>
//                 <span className="font-black text-gray-800">${subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between items-center text-sm md:text-base">
//                 <span className="font-bold text-gray-600">IVA (16%):</span>
//                 <span className="font-black text-gray-800">${iva.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between items-center pt-2 md:pt-3 border-t-2" style={{ borderColor: '#fbbf24' }}>
//                 <span className="text-lg md:text-xl font-black" style={{ color: '#00162f' }}>
//                   TOTAL:
//                 </span>
//                 <span className="text-xl md:text-3xl font-black" style={{ color: '#fbbf24' }}>
//                   ${total.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="p-4 md:p-8 text-center border-t" style={{ backgroundColor: '#00162f' }}>
//             <p className="text-xs md:text-sm text-white font-medium mb-2">
//               ¡Gracias por tu compra!
//             </p>
//             <p className="text-xs text-yellow-400 break-words">
//               www.bodegadeazulejos.com | contacto@bodegadeazulejos.com
//             </p>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         @media print {
//           body { 
//             margin: 0; 
//             padding: 0; 
//             background: white;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }
//           .no-print { 
//             display: none !important; 
//           }
//           #factura-contenido {
//             box-shadow: none;
//             max-width: 100%;
//             padding: 10px;
//           }
//           @page { 
//             margin: 0.5cm;
//             size: A4;
//           }
//           img {
//             max-width: 100%;
//             height: auto;
//           }
//         }
//       `}</style>
//     </>
//   );
// }



// // components/FacturaContent.jsx
// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { CheckCircle, Download, FileDown, AlertCircle } from 'lucide-react';

// export default function FacturaContent() {
//   const router = useRouter();
//   const facturaRef = useRef(null);
//   const [facturaData, setFacturaData] = useState(null);
//   const [generandoPDF, setGenerandoPDF] = useState(false);
//   const [error, setError] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);

//   // Detectar si es móvil
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     // Obtener datos de localStorage
//     try {
//       const data = localStorage.getItem('facturaData');
//       if (data) {
//         setFacturaData(JSON.parse(data));
//       } else {
//         router.push('/');
//       }
//     } catch (error) {
//       console.error('Error al leer localStorage:', error);
//       setError('No se pudieron cargar los datos de la factura');
//     }
//   }, [router]);

//   const generarPDF = async () => {
//     if (!facturaData) return;

//     setGenerandoPDF(true);
//     setError(null);

//     try {
//       // Importar las librerías necesarias
//       const [jspdf, html2canvas] = await Promise.all([
//         import('jspdf').then(module => module.default),
//         import('html2canvas').then(module => module.default)
//       ]);

//       const elemento = document.getElementById('factura-contenido');
//       if (!elemento) throw new Error('No se encontró el elemento de factura');

//       // Crear un clon del elemento para manipularlo sin afectar la vista
//       const clone = elemento.cloneNode(true);
      
//       // Eliminar botones y elementos no deseados del clon
//       const noPrintElements = clone.querySelectorAll('.no-print');
//       noPrintElements.forEach(el => el.remove());
      
//       // Asegurar que el clon tenga estilos adecuados para PDF
//       clone.style.width = '800px';
//       clone.style.maxWidth = '800px';
//       clone.style.margin = '0 auto';
//       clone.style.padding = '30px';
//       clone.style.backgroundColor = '#ffffff';
//       clone.style.boxShadow = 'none';
//       clone.style.fontFamily = 'Arial, sans-serif';
      
//       // Ajustar tamaños de fuente para PDF
//       const style = document.createElement('style');
//       style.textContent = `
//         * { box-sizing: border-box; }
//         body { margin: 0; padding: 0; background: white; }
//         .text-xs { font-size: 10px; }
//         .text-sm { font-size: 12px; }
//         .text-base { font-size: 14px; }
//         .text-lg { font-size: 16px; }
//         .text-xl { font-size: 18px; }
//         .text-2xl { font-size: 22px; }
//         .text-3xl { font-size: 26px; }
//         .font-black { font-weight: 900; }
//         .font-bold { font-weight: 700; }
//         img { max-width: 100%; height: auto; }
//       `;
//       clone.appendChild(style);

//       // Crear un contenedor temporal
//       const container = document.createElement('div');
//       container.style.position = 'absolute';
//       container.style.left = '-9999px';
//       container.style.top = '-9999px';
//       container.style.width = '800px';
//       container.style.backgroundColor = '#ffffff';
//       container.appendChild(clone);
//       document.body.appendChild(container);

//       // Capturar el elemento como canvas
//       const canvas = await html2canvas(clone, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         allowTaint: false,
//         backgroundColor: '#ffffff',
//         windowWidth: 800,
//         windowHeight: 1200
//       });

//       // Crear PDF
//       const pdf = new jspdf({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4',
//         compress: true
//       });

//       // Calcular dimensiones para ajustar al PDF
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();
//       const canvasWidth = canvas.width;
//       const canvasHeight = canvas.height;
      
//       // Calcular escala para que quepa en el PDF
//       const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
//       const width = canvasWidth * ratio;
//       const height = canvasHeight * ratio;
      
//       // Centrar en la página
//       const x = (pdfWidth - width) / 2;
//       const y = 0;

//       // Convertir canvas a imagen
//       const imgData = canvas.toDataURL('image/jpeg', 0.95);

//       // Agregar imagen al PDF
//       pdf.addImage(imgData, 'JPEG', x, y, width, height);

//       // Guardar PDF directamente como descarga
//       const fileName = `Factura_${facturaData.numeroFactura}.pdf`;
//       pdf.save(fileName);

//       // Limpiar elemento temporal
//       document.body.removeChild(container);
      
//       console.log('PDF generado exitosamente');
//     } catch (error) {
//       console.error('Error al generar PDF:', error);
//       setError('Error al generar el PDF. Por favor intenta de nuevo o usa la opción de imprimir.');
//     } finally {
//       setGenerandoPDF(false);
//     }
//   };

//   // Función de respaldo: imprimir
//   const imprimirFactura = () => {
//     window.print();
//   };

//   // Función de respaldo: guardar como HTML (último recurso)
//   const guardarComoHTML = () => {
//     const elemento = document.getElementById('factura-contenido');
//     const htmlContent = elemento.outerHTML;
//     const blob = new Blob([htmlContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Factura_${facturaData.numeroFactura}.html`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   if (!facturaData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <div className="bg-red-50 p-6 rounded-lg text-center max-w-md">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <p className="text-red-600 font-medium mb-4">{error}</p>
//           <div className="flex gap-2 justify-center">
//             <button
//               onClick={() => setError(null)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//             >
//               Reintentar
//             </button>
//             <button
//               onClick={imprimirFactura}
//               className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm"
//             >
//               Imprimir
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const { fecha, hora, usuario, items, subtotal, iva, total, numeroFactura } = facturaData;

//   return (
//     <>
//       {/* Botones de acción */}
//       <div className="no-print fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b p-3 flex flex-wrap gap-2 justify-end">
//         <button
//           onClick={() => router.push('/')}
//           className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition-all hover:opacity-90"
//           style={{ backgroundColor: '#00162f', color: 'white' }}
//         >
//           Inicio
//         </button>
//         <button
//           onClick={generarPDF}
//           disabled={generandoPDF}
//           className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition-all hover:opacity-90 flex items-center gap-1 md:gap-2 disabled:opacity-50"
//           style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
//         >
//           {generandoPDF ? (
//             <>
//               <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00162f' }} />
//               <span>Generando...</span>
//             </>
//           ) : (
//             <>
//               <Download size={isMobile ? 14 : 18} />
//               <span>PDF</span>
//             </>
//           )}
//         </button>
//         <button
//           onClick={imprimirFactura}
//           className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition-all hover:opacity-90 bg-gray-600 text-white flex items-center gap-1"
//         >
//           <FileDown size={isMobile ? 14 : 18} />
//           <span>Imprimir</span>
//         </button>
//       </div>

//       {/* Contenido de la factura */}
//       <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 p-3 md:p-8">
//         <div 
//           id="factura-contenido" 
//           ref={facturaRef}
//           className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden"
//         >
//           {/* Header con éxito */}
//           <div className="relative overflow-hidden" style={{ backgroundColor: '#00162f' }}>
//             <div className="absolute inset-0 opacity-10">
//               <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 rounded-full bg-yellow-400 blur-2xl md:blur-3xl" />
//               <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 rounded-full bg-yellow-400 blur-2xl md:blur-3xl" />
//             </div>
//             <div className="relative text-center py-4 md:py-8 px-3">
//               <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-500 mb-2 md:mb-4">
//                 <CheckCircle size={isMobile ? 20 : 32} className="text-white" />
//               </div>
//               <h1 className="text-xl md:text-3xl font-black text-white mb-1 md:mb-2">
//                 ¡Compra Exitosa!
//               </h1>
//               <p className="text-xs md:text-base text-yellow-400 font-medium px-2">
//                 Tu pedido ha sido procesado correctamente
//               </p>
//             </div>
//           </div>

//           {/* Información de la empresa */}
//           <div className="border-b-4 p-4 md:p-8" style={{ borderColor: '#fbbf24' }}>
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
//               <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
//                 <img src="/bodega-img.jpg" alt="Logo" className="w-10 h-10 md:w-20 md:h-20 object-contain" />
//                 <div className="flex-1">
//                   <h2 className="text-base md:text-2xl font-black tracking-wider" style={{ color: '#00162f' }}>
//                     BODEGA DE AZULEJOS
//                   </h2>
//                   <p className="text-xs md:text-sm text-gray-600 font-medium">
//                     RFC: BDA123456ABC
//                   </p>
//                   <p className="text-xs md:text-sm text-gray-600">
//                     Av. Principal #123, Ciudad
//                   </p>
//                 </div>
//               </div>

//               <div className="w-full md:w-auto text-left md:text-right">
//                 <div className="inline-block px-3 py-1 md:px-4 md:py-2 rounded-lg mb-1 md:mb-2" style={{ backgroundColor: '#fbbf2420' }}>
//                   <p className="text-xs text-gray-600 font-bold uppercase">Factura</p>
//                   <p className="text-base md:text-xl font-black" style={{ color: '#00162f' }}>
//                     #{numeroFactura}
//                   </p>
//                 </div>
//                 <p className="text-xs md:text-sm text-gray-600 font-medium">
//                   <span className="font-bold">Fecha:</span> {fecha}
//                 </p>
//                 <p className="text-xs md:text-sm text-gray-600 font-medium">
//                   <span className="font-bold">Hora:</span> {hora}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Cliente */}
//           <div className="p-4 md:p-8 bg-gray-50">
//             <h3 className="text-sm md:text-base font-black uppercase tracking-wider mb-3 md:mb-4" style={{ color: '#00162f' }}>
//               Datos del Cliente
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
//               <div>
//                 <p className="text-xs text-gray-500 font-bold mb-1">Nombre</p>
//                 <p className="text-sm md:text-base font-bold text-gray-800 break-words">{usuario.nombre}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-bold mb-1">Correo Electrónico</p>
//                 <p className="text-sm md:text-base font-bold text-gray-800 break-words">{usuario.email}</p>
//               </div>
//             </div>
//           </div>

//           {/* Productos */}
//           <div className="p-4 md:p-8">
//             <h3 className="text-sm md:text-base font-black uppercase tracking-wider mb-3 md:mb-4" style={{ color: '#00162f' }}>
//               Detalle de Productos
//             </h3>

//             {/* Desktop Header */}
//             <div className="hidden md:grid md:grid-cols-12 gap-4 pb-3 mb-3 border-b-2 text-xs font-black uppercase" style={{ borderColor: '#fbbf24', color: '#00162f' }}>
//               <div className="col-span-5">Producto</div>
//               <div className="col-span-2 text-center">Cantidad</div>
//               <div className="col-span-2 text-right">Precio Unit.</div>
//               <div className="col-span-3 text-right">Subtotal</div>
//             </div>

//             {/* Items */}
//             <div className="space-y-3 md:space-y-2">
//               {items.map((item, index) => (
//                 <div key={index} className="border-b border-gray-200 last:border-0 pb-3 md:pb-0">
//                   {/* Versión Mobile */}
//                   <div className="md:hidden space-y-2">
//                     <p className="font-bold text-sm text-gray-800">{item.nombre}</p>
//                     <div className="grid grid-cols-2 gap-2 text-xs">
//                       <div>
//                         <span className="text-gray-600">Cantidad: </span>
//                         <span className="font-bold">{item.cantidad}</span>
//                       </div>
//                       <div className="text-right">
//                         <span className="text-gray-600">Precio: </span>
//                         <span className="font-bold">${Number(item.precio).toFixed(2)}</span>
//                       </div>
//                     </div>
//                     <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//                       <span className="text-xs text-gray-600 font-bold">Subtotal:</span>
//                       <span className="text-base font-black" style={{ color: '#00162f' }}>
//                         ${(Number(item.precio) * item.cantidad).toFixed(2)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Versión Desktop */}
//                   <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center py-3">
//                     <div className="col-span-5">
//                       <p className="font-bold text-sm text-gray-800">{item.nombre}</p>
//                       {item.descripcion && (
//                         <p className="text-xs text-gray-500 mt-1">{item.descripcion}</p>
//                       )}
//                     </div>
//                     <div className="col-span-2 text-center">
//                       <span className="inline-block px-3 py-1 rounded-lg font-bold text-sm" style={{ backgroundColor: '#fbbf2420', color: '#00162f' }}>
//                         {item.cantidad}
//                       </span>
//                     </div>
//                     <div className="col-span-2 text-right font-bold text-sm text-gray-800">
//                       ${Number(item.precio).toFixed(2)}
//                     </div>
//                     <div className="col-span-3 text-right font-black text-base" style={{ color: '#00162f' }}>
//                       ${(Number(item.precio) * item.cantidad).toFixed(2)}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Totales */}
//           <div className="p-4 md:p-8 border-t-2" style={{ borderColor: '#00162f' }}>
//             <div className="max-w-md ml-auto space-y-2 md:space-y-3">
//               <div className="flex justify-between items-center text-sm md:text-base">
//                 <span className="font-bold text-gray-600">Subtotal:</span>
//                 <span className="font-black text-gray-800">${subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between items-center text-sm md:text-base">
//                 <span className="font-bold text-gray-600">IVA (16%):</span>
//                 <span className="font-black text-gray-800">${iva.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between items-center pt-2 md:pt-3 border-t-2" style={{ borderColor: '#fbbf24' }}>
//                 <span className="text-lg md:text-xl font-black" style={{ color: '#00162f' }}>
//                   TOTAL:
//                 </span>
//                 <span className="text-xl md:text-3xl font-black" style={{ color: '#fbbf24' }}>
//                   ${total.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="p-4 md:p-8 text-center border-t" style={{ backgroundColor: '#00162f' }}>
//             <p className="text-xs md:text-sm text-white font-medium mb-2">
//               ¡Gracias por tu compra!
//             </p>
//             <p className="text-xs text-yellow-400 break-words">
//               www.bodegadeazulejos.com | contacto@bodegadeazulejos.com
//             </p>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         @media print {
//           body { 
//             margin: 0; 
//             padding: 0; 
//             background: white;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }
//           .no-print { 
//             display: none !important; 
//           }
//           #factura-contenido {
//             box-shadow: none;
//             max-width: 100%;
//             padding: 15px;
//           }
//           @page { 
//             margin: 1cm;
//             size: A4;
//           }
//           img {
//             max-width: 100%;
//             height: auto;
//           }
//         }
//       `}</style>
//     </>
//   );
// }










// // components/FacturaContent.jsx
// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { CheckCircle, Download, FileDown, AlertCircle } from 'lucide-react';

// export default function FacturaContent() {
//   const router = useRouter();
//   const facturaRef = useRef(null);
//   const [facturaData, setFacturaData] = useState(null);
//   const [generandoPDF, setGenerandoPDF] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     try {
//       const data = localStorage.getItem('facturaData');
//       if (data) {
//         setFacturaData(JSON.parse(data));
//       } else {
//         router.push('/');
//       }
//     } catch (error) {
//       console.error('Error al leer localStorage:', error);
//       setError('No se pudieron cargar los datos de la factura');
//     }
//   }, [router]);

//   const generarPDF = async () => {
//     if (!facturaData) return;

//     setGenerandoPDF(true);
//     setError(null);

//     try {
//       // Importar librerías
//       const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
//         import('jspdf'),
//         import('html2canvas')
//       ]);

//       const elemento = document.getElementById('factura-contenido');
//       if (!elemento) throw new Error('No se encontró el elemento');

//       // Configuración optimizada para capturar el HTML
//       const canvas = await html2canvas(elemento, {
//         scale: 2,
//         backgroundColor: '#ffffff',
//         logging: false,
//         allowTaint: true,
//         useCORS: true,
//         windowWidth: 800,
//         windowHeight: 1200
//       });

//       // Crear PDF
//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4',
//         compress: true
//       });

//       const imgData = canvas.toDataURL('image/jpeg', 0.95);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//       pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`Factura_${facturaData.numeroFactura}.pdf`);

//     } catch (error) {
//       console.error('Error:', error);
//       setError('Error al generar el PDF. Intenta con "Imprimir"');
//     } finally {
//       setGenerandoPDF(false);
//     }
//   };

//   const imprimirFactura = () => {
//     window.print();
//   };

//   if (!facturaData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <div className="bg-red-50 p-6 rounded-lg text-center max-w-md">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <p className="text-red-600 font-medium mb-4">{error}</p>
//           <div className="flex gap-2 justify-center">
//             <button
//               onClick={imprimirFactura}
//               className="px-4 py-2 bg-gray-600 text-white rounded-lg"
//             >
//               Imprimir
//             </button>
//             <button
//               onClick={() => router.push('/')}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//             >
//               Inicio
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const { fecha, hora, usuario, items, subtotal, iva, total, numeroFactura } = facturaData;

//   return (
//     <>
//       {/* Botones de acción - siempre visibles */}
//       <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
//         <button
//           onClick={() => router.push('/')}
//           className="px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:opacity-90"
//           style={{ backgroundColor: '#00162f', color: 'white' }}
//         >
//           Inicio
//         </button>
//         <button
//           onClick={generarPDF}
//           disabled={generandoPDF}
//           className="px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
//           style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
//         >
//           {generandoPDF ? (
//             <>
//               <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00162f' }} />
//               Generando...
//             </>
//           ) : (
//             <>
//               <Download size={18} />
//               PDF
//             </>
//           )}
//         </button>
//         <button
//           onClick={imprimirFactura}
//           className="px-4 py-2 rounded-lg font-bold text-sm shadow-lg bg-gray-600 text-white flex items-center gap-2"
//         >
//           <FileDown size={18} />
//           Imprimir
//         </button>
//       </div>

//       {/* Contenido de la factura - EXACTAMENTE como en tu imagen */}
//       <div className="min-h-screen bg-gray-50 p-8">
//         <div 
//           id="factura-contenido" 
//           ref={facturaRef}
//           className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden"
//         >
//           {/* Header con éxito - Azul oscuro #00162f */}
//           <div className="relative overflow-hidden" style={{ backgroundColor: '#00162f' }}>
//             <div className="absolute inset-0 opacity-10">
//               <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-yellow-400 blur-3xl" />
//               <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-yellow-400 blur-3xl" />
//             </div>
//             <div className="relative text-center py-8">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4">
//                 <CheckCircle size={32} className="text-white" />
//               </div>
//               <h1 className="text-3xl font-black text-white mb-2">
//                 ¡Compra Exitosa!
//               </h1>
//               <p className="text-yellow-400 font-medium">
//                 Tu pedido ha sido procesado correctamente
//               </p>
//             </div>
//           </div>

//           {/* Información de la empresa */}
//           <div className="border-b-4 p-8" style={{ borderColor: '#fbbf24' }}>
//             <div className="flex justify-between items-start">
//               <div className="flex items-center gap-4">
//                 <img src="/bodega-img.jpg" alt="Logo" className="w-20 h-20 object-contain" />
//                 <div>
//                   <h2 className="text-2xl font-black tracking-wider" style={{ color: '#00162f' }}>
//                     BODEGA DE AZULEJOS
//                   </h2>
//                   <p className="text-sm text-gray-600 font-medium">
//                     RFC: BDA123456ABC
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Av. Principal #123, Ciudad
//                   </p>
//                 </div>
//               </div>

//               <div className="text-right">
//                 <div className="inline-block px-4 py-2 rounded-lg mb-2" style={{ backgroundColor: '#fbbf2420' }}>
//                   <p className="text-xs text-gray-600 font-bold uppercase">Factura</p>
//                   <p className="text-xl font-black" style={{ color: '#00162f' }}>
//                     #{numeroFactura}
//                   </p>
//                 </div>
//                 <p className="text-sm text-gray-600 font-medium">
//                   <span className="font-bold">Fecha:</span> {fecha}
//                 </p>
//                 <p className="text-sm text-gray-600 font-medium">
//                   <span className="font-bold">Hora:</span> {hora}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Cliente */}
//           <div className="p-8 bg-gray-50">
//             <h3 className="text-base font-black uppercase tracking-wider mb-4" style={{ color: '#00162f' }}>
//               DATOS DEL CLIENTE
//             </h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-xs text-gray-500 font-bold mb-1">Nombre</p>
//                 <p className="text-base font-bold text-gray-800">{usuario.nombre}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-bold mb-1">Correo Electrónico</p>
//                 <p className="text-base font-bold text-gray-800">{usuario.email}</p>
//               </div>
//             </div>
//           </div>

//           {/* Productos */}
//           <div className="p-8">
//             <h3 className="text-base font-black uppercase tracking-wider mb-4" style={{ color: '#00162f' }}>
//               DETALLE DE PRODUCTOS
//             </h3>

//             {/* Header de productos */}
//             <div className="grid grid-cols-12 gap-4 pb-3 mb-3 border-b-2 text-xs font-black uppercase" style={{ borderColor: '#fbbf24', color: '#00162f' }}>
//               <div className="col-span-5">PRODUCTO</div>
//               <div className="col-span-2 text-center">CANTIDAD</div>
//               <div className="col-span-2 text-right">PRECIO UNIT.</div>
//               <div className="col-span-3 text-right">SUBTOTAL</div>
//             </div>

//             {/* Items */}
//             {items.map((item, index) => (
//               <div key={index} className="grid grid-cols-12 gap-4 py-3 border-b border-gray-200">
//                 <div className="col-span-5">
//                   <p className="font-bold text-sm text-gray-800">{item.nombre}</p>
//                   <p className="text-xs text-gray-500 mt-1">Producto de buena calidad</p>
//                 </div>
//                 <div className="col-span-2 text-center">
//                   <span className="inline-block px-3 py-1 rounded-lg font-bold text-sm" style={{ backgroundColor: '#fbbf2420', color: '#00162f' }}>
//                     {item.cantidad}
//                   </span>
//                 </div>
//                 <div className="col-span-2 text-right font-bold text-sm text-gray-800">
//                   ${Number(item.precio).toFixed(2)}
//                 </div>
//                 <div className="col-span-3 text-right font-black text-base" style={{ color: '#00162f' }}>
//                   ${(Number(item.precio) * item.cantidad).toFixed(2)}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Totales - EXACTAMENTE como en tu imagen */}
//           <div className="p-8 border-t-2" style={{ borderColor: '#00162f' }}>
//             <div className="max-w-md ml-auto space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="font-bold text-gray-600">Subtotal:</span>
//                 <span className="font-black text-gray-800">${subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="font-bold text-gray-600">IVA (16%):</span>
//                 <span className="font-black text-gray-800">${iva.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between items-center pt-3 border-t-2" style={{ borderColor: '#fbbf24' }}>
//                 <span className="text-xl font-black" style={{ color: '#00162f' }}>
//                   TOTAL:
//                 </span>
//                 <span className="text-3xl font-black" style={{ color: '#fbbf24' }}>
//                   ${total.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="p-8 text-center border-t" style={{ backgroundColor: '#00162f' }}>
//             <p className="text-sm text-white font-medium mb-2">
//               ¡Gracias por tu compra!
//             </p>
//             <p className="text-xs text-yellow-400">
//               www.bodegadeazulejos.com | contacto@bodegadeazulejos.com
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Estilos para impresión */}
//       <style jsx global>{`
//         @media print {
//           body { 
//             margin: 0; 
//             padding: 0; 
//             background: white;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }
//           .no-print { 
//             display: none !important; 
//           }
//           #factura-contenido {
//             box-shadow: none;
//             max-width: 100%;
//           }
//           @page { 
//             margin: 1cm;
//             size: A4;
//           }
//         }
//       `}</style>
//     </>
//   );
// }





// components/FacturaContent.jsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Download, FileDown, AlertCircle, Smartphone } from 'lucide-react';

export default function FacturaContent() {
  const router = useRouter();
  const facturaRef = useRef(null);
  const [facturaData, setFacturaData] = useState(null);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar si es móvil
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    checkMobile();

    try {
      const data = localStorage.getItem('facturaData');
      if (data) {
        setFacturaData(JSON.parse(data));
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error al leer localStorage:', error);
      setError('No se pudieron cargar los datos de la factura');
    }
  }, [router]);

  const generarPDF = async () => {
    if (!facturaData) return;

    setGenerandoPDF(true);
    setError(null);

    try {
      const elemento = document.getElementById('factura-contenido');
      if (!elemento) throw new Error('No se encontró el elemento');

      // ESTRATEGIA PARA MÓVILES: Usar html2pdf.js
      if (isMobile) {
        try {
          const html2pdf = (await import('html2pdf.js')).default;
          
          const opciones = {
            margin: 10,
            filename: `Factura_${facturaData.numeroFactura}.pdf`,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { 
              scale: 1.5,
              useCORS: true,
              logging: false,
              letterRendering: true,
              windowWidth: 800
            },
            jsPDF: { 
              unit: 'mm', 
              format: 'a4', 
              orientation: 'portrait'
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          };

          await html2pdf().set(opciones).from(elemento).save();
          
        } catch (mobileError) {
          console.error('Error con html2pdf:', mobileError);
          const confirmar = confirm(
            'No se pudo generar el PDF automáticamente. ¿Deseas abrir la vista de impresión? Desde ahí puedes guardar como PDF.'
          );
          if (confirmar) {
            window.print();
          }
          throw new Error('Usa el botón Imprimir para guardar como PDF');
        }
      } 
      // ESTRATEGIA PARA DESKTOP: jspdf + html2canvas
      else {
        const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
          import('jspdf'),
          import('html2canvas')
        ]);

        const canvas = await html2canvas(elemento, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          allowTaint: true,
          useCORS: true,
          windowWidth: 1200
        });

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }

        pdf.save(`Factura_${facturaData.numeroFactura}.pdf`);
      }

    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message || 'Error al generar el PDF. Usa el botón "Imprimir"');
    } finally {
      setGenerandoPDF(false);
    }
  };

  const imprimirFactura = () => {
    window.print();
  };

  if (!facturaData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 p-4 md:p-6 rounded-lg text-center max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-4 text-sm md:text-base">{error}</p>
          <div className="flex flex-col md:flex-row gap-2 justify-center">
            <button
              onClick={imprimirFactura}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm"
            >
              Imprimir
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-white rounded-lg text-sm"
              style={{ backgroundColor: '#00162f' }}
            >
              Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { fecha, hora, usuario, items, subtotal, iva, total, numeroFactura } = facturaData;

  return (
    <>
      {/* Botones de acción - Responsivos */}
      <div className="no-print fixed top-3 md:top-4 right-3 md:right-4 z-50 flex flex-col md:flex-row gap-2">
        <button
          onClick={() => router.push('/')}
          className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg hover:opacity-90 whitespace-nowrap"
          style={{ backgroundColor: '#00162f', color: 'white' }}
        >
          Inicio
        </button>
        <button
          onClick={imprimirFactura}
          className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg bg-gray-600 text-white flex items-center justify-center gap-1.5 md:gap-2 whitespace-nowrap"
        >
          <FileDown size={16} className="md:w-[18px] md:h-[18px]" />
          Imprimir
        </button>
        <button
          onClick={generarPDF}
          disabled={generandoPDF}
          className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg hover:opacity-90 flex items-center justify-center gap-1.5 md:gap-2 disabled:opacity-50 whitespace-nowrap"
          style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
        >
          {generandoPDF ? (
            <>
              <div className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00162f' }} />
              <span className="hidden md:inline">Generando...</span>
              <span className="md:hidden">...</span>
            </>
          ) : (
            <>
              <Download size={16} className="md:w-[18px] md:h-[18px]" />
              PDF
            </>
          )}
        </button>
      </div>

      {/* Aviso para móviles */}
      {isMobile && (
        <div className="no-print bg-blue-50 border-l-4 border-blue-400 p-3 mx-3 mt-16 mb-3 rounded">
          <div className="flex items-start gap-2">
            <Smartphone size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-800 mb-1">Modo Móvil Detectado</p>
              <p className="text-xs text-blue-700">
                Si el PDF no se descarga automáticamente, usa Imprimir y selecciona Guardar como PDF
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la factura - RESPONSIVO Y MEJORADO */}
      <div className="min-h-screen bg-gray-50 p-3 md:p-6 lg:p-8">
        <div 
          id="factura-contenido" 
          ref={facturaRef}
          className="max-w-4xl mx-auto bg-white shadow-xl md:shadow-2xl rounded-xl md:rounded-2xl overflow-hidden"
        >
          {/* Header con éxito */}
          <div className="relative overflow-hidden" style={{ backgroundColor: '#00162f' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 rounded-full bg-yellow-400 blur-2xl md:blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 rounded-full bg-yellow-400 blur-2xl md:blur-3xl" />
            </div>
            <div className="relative text-center py-6 md:py-8 px-4">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-500 mb-3 md:mb-4">
                <CheckCircle size={24} className="text-white md:w-8 md:h-8" />
              </div>
              <h1 className="text-xl md:text-3xl font-black text-white mb-1 md:mb-2">
                ¡Compra Exitosa!
              </h1>
              <p className="text-xs md:text-base text-yellow-400 font-medium">
                Tu pedido ha sido procesado correctamente
              </p>
            </div>
          </div>

          {/* Información de la empresa */}
          <div className="border-b-4 p-5 md:p-6 lg:p-8" style={{ borderColor: '#fbbf24' }}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-start gap-3 md:gap-4 w-full md:w-auto">
                <div className="w-12 h-12 md:w-16 lg:w-20 md:h-16 lg:h-20 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#00162f' }}>
                  <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="w-10 h-10 md:w-14 lg:w-18 md:h-14 lg:h-18 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span class="text-white font-black text-lg md:text-xl">BA</span>';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-base md:text-xl lg:text-2xl font-black tracking-wider leading-tight" style={{ color: '#00162f' }}>
                    BODEGA DE AZULEJOS
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 font-medium mt-1">
                    RFC: BDA123456ABC
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    Av. Principal #123, Ciudad
                  </p>
                </div>
              </div>

              <div className="text-left md:text-right w-full md:w-auto">
                <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-lg mb-2" style={{ backgroundColor: '#fbbf2420' }}>
                  <p className="text-xs text-gray-600 font-bold uppercase">Factura</p>
                  <p className="text-base md:text-xl font-black" style={{ color: '#00162f' }}>
                    #{numeroFactura}
                  </p>
                </div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">
                  <span className="font-bold">Fecha:</span> {fecha}
                </p>
                <p className="text-xs md:text-sm text-gray-600 font-medium">
                  <span className="font-bold">Hora:</span> {hora}
                </p>
              </div>
            </div>
          </div>

          {/* Cliente */}
          <div className="p-5 md:p-6 lg:p-8 bg-gray-50">
            <h3 className="text-xs md:text-base font-black uppercase tracking-wider mb-3 md:mb-4" style={{ color: '#00162f' }}>
              DATOS DEL CLIENTE
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="text-[10px] md:text-xs text-gray-500 font-bold mb-1">Nombre</p>
                <p className="text-xs md:text-base font-bold text-gray-800 break-words">{usuario.nombre}</p>
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-gray-500 font-bold mb-1">Correo Electrónico</p>
                <p className="text-xs md:text-base font-bold text-gray-800 break-all">{usuario.email}</p>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="p-5 md:p-6 lg:p-8">
            <h3 className="text-xs md:text-base font-black uppercase tracking-wider mb-3 md:mb-4" style={{ color: '#00162f' }}>
              DETALLE DE PRODUCTOS
            </h3>

            {/* Header de productos - Solo desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 mb-3 border-b-2 text-xs font-black uppercase" style={{ borderColor: '#fbbf24', color: '#00162f' }}>
              <div className="col-span-5">PRODUCTO</div>
              <div className="col-span-2 text-center">CANTIDAD</div>
              <div className="col-span-2 text-right">PRECIO UNIT.</div>
              <div className="col-span-3 text-right">SUBTOTAL</div>
            </div>

            {/* Items */}
          {/* Productos */}
<div className="p-5 md:p-6 lg:p-8">
  <h3 className="text-xs md:text-base font-black uppercase tracking-wider mb-3 md:mb-4" style={{ color: '#00162f' }}>
    DETALLE DE PRODUCTOS
  </h3>

  {/* Header de productos - Solo desktop */}
  <div className="hidden md:grid grid-cols-12 gap-4 pb-3 mb-3 border-b-2 text-xs font-black uppercase" style={{ borderColor: '#fbbf24', color: '#00162f' }}>
    <div className="col-span-5">PRODUCTO</div>
    <div className="col-span-2 text-center">CANTIDAD</div>
    <div className="col-span-2 text-right">PRECIO UNIT.</div>
    <div className="col-span-3 text-right">SUBTOTAL</div>
  </div>

  {/* Items - AQUÍ EMPIEZA LO QUE DEBES REEMPLAZAR */}
  <div className="space-y-3 md:space-y-0">
    {items.map((item, index) => (
      <div key={index} className="border-b border-gray-200 py-3 last:border-0">
        {/* Versión móvil */}
        <div className="block md:hidden">
          <p className="font-black text-xs mb-1.5 leading-tight" style={{ color: '#00162f' }}>
            {item.nombre}
          </p>
          {item.descripcion && (
            <p className="text-[10px] text-gray-500 mb-2 leading-relaxed">{item.descripcion}</p>
          )}
          <div className="flex justify-between items-center text-[10px] mb-2 bg-gray-50 rounded-lg p-2">
            <div>
              <span className="text-gray-600 font-medium">Cantidad: </span>
              <span className="font-black" style={{ color: '#00162f' }}>{item.cantidad}</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Precio: </span>
              <span className="font-black" style={{ color: '#00162f' }}>${Number(item.precio).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] font-bold text-gray-600 uppercase">Subtotal:</span>
            <span className="text-sm font-black" style={{ color: '#00162f' }}>
              ${(Number(item.precio) * item.cantidad).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Versión desktop */}
        <div className="hidden md:grid grid-cols-12 gap-4 items-center">
          <div className="col-span-5">
            <p className="font-bold text-sm text-gray-800 leading-tight">{item.nombre}</p>
            {item.descripcion && (
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.descripcion}</p>
            )}
          </div>
          <div className="col-span-2 text-center">
            <span className="inline-block px-3 py-1 rounded-lg font-bold text-sm" style={{ backgroundColor: '#fbbf2420', color: '#00162f' }}>
              {item.cantidad}
            </span>
          </div>
          <div className="col-span-2 text-right font-bold text-sm text-gray-800">
            ${Number(item.precio).toFixed(2)}
          </div>
          <div className="col-span-3 text-right font-black text-base" style={{ color: '#00162f' }}>
            ${(Number(item.precio) * item.cantidad).toFixed(2)}
          </div>
        </div>
      </div>
    ))}
  </div>
  {/* AQUÍ TERMINA LO QUE REEMPLAZASTE */}
</div>
          </div>

          {/* Totales */}
          <div className="p-5 md:p-6 lg:p-8 border-t-2" style={{ borderColor: '#00162f' }}>
            <div className="max-w-md ml-auto space-y-2 md:space-y-3">
              <div className="flex justify-between items-center text-xs md:text-base">
                <span className="font-bold text-gray-600">Subtotal:</span>
                <span className="font-black text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs md:text-base pb-3 border-b border-gray-300">
                <span className="font-bold text-gray-600">IVA (16%):</span>
                <span className="font-black text-gray-800">${iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 md:pt-3">
                <span className="text-base md:text-xl font-black" style={{ color: '#00162f' }}>
                  TOTAL:
                </span>
                <span className="text-xl md:text-3xl font-black" style={{ color: '#fbbf24' }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 md:p-6 lg:p-8 text-center border-t" style={{ backgroundColor: '#00162f' }}>
            <p className="text-xs md:text-sm text-white font-medium mb-2">
              ¡Gracias por tu compra!
            </p>
            <p className="text-[10px] md:text-xs text-yellow-400 break-words">
              www.bodegadeazulejos.com | contacto@bodegadeazulejos.com
            </p>
          </div>
        </div>
      </div>

      {/* Estilos para impresión */}
      <style jsx global>{`
        @media print {
          body { 
            margin: 0; 
            padding: 0; 
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { 
            display: none !important; 
          }
          #factura-contenido {
            box-shadow: none;
            max-width: 100%;
            border-radius: 0;
          }
          @page { 
            margin: 1cm;
            size: A4;
          }
        }
      `}</style>
    </>
  );
}