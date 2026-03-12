// components/FacturaContent.jsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Download, FileDown, AlertCircle, Smartphone, Package, MapPin, Phone } from 'lucide-react';

export default function FacturaContent({ pedido }) {
  const router = useRouter();
  const facturaRef = useRef(null);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    checkMobile();
  }, []);

  // Si no hay pedido, mostrar skeleton
  if (!pedido) {
    return (
      <div className="min-h-screen bg-gray-50 mt-6 p-3 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-xl border-2 border-gray-300 p-4 md:p-6 animate-pulse">
          {/* Header skeleton */}
          <div className="border-b-4 border-blue-900 pb-6 mb-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-gray-300 rounded"></div>
                    <div className="h-3 w-32 bg-gray-300 rounded"></div>
                    <div className="h-3 w-32 bg-gray-300 rounded"></div>
                    <div className="h-3 w-40 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="h-3 w-24 bg-gray-300 rounded mt-2"></div>
                <div className="h-3 w-40 bg-gray-300 rounded mt-1"></div>
              </div>
              <div className="text-right">
                <div className="h-8 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-4 w-12 bg-gray-300 rounded"></div>
                  <div className="h-4 w-12 bg-gray-300 rounded"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Cliente skeleton */}
          <div className="border-b-2 border-gray-300 pb-4 mb-4">
            <div className="h-5 w-16 bg-gray-300 rounded mb-3"></div>
            <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 w-64 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 w-56 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 w-40 bg-gray-300 rounded"></div>
          </div>

          {/* Tabla skeleton */}
          <div className="mb-4">
            <div className="grid grid-cols-12 gap-2 bg-gray-300 h-8 rounded mb-2"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 py-2 border-b border-gray-200">
                <div className="col-span-2 h-4 bg-gray-300 rounded"></div>
                <div className="col-span-4 h-4 bg-gray-300 rounded"></div>
                <div className="col-span-1 h-4 bg-gray-300 rounded"></div>
                <div className="col-span-1 h-4 bg-gray-300 rounded"></div>
                <div className="col-span-2 h-4 bg-gray-300 rounded"></div>
                <div className="col-span-2 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>

          {/* Totales skeleton */}
          <div className="border-t-2 border-gray-300 pt-4">
            <div className="max-w-md ml-auto space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                <div className="h-6 w-20 bg-gray-300 rounded"></div>
                <div className="h-6 w-28 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si hay error (aunque no se usa aquí, pero lo dejamos por si acaso)
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const generarPDF = async () => {
    setGenerandoPDF(true);
    setError(null);

    try {
      const elemento = document.getElementById('factura-contenido');
      if (!elemento) throw new Error('No se encontró el elemento');

      if (isMobile) {
        try {
          const html2pdf = (await import('html2pdf.js')).default;
          
          const opciones = {
            margin: 10,
            filename: `Factura_${pedido.numeroFactura || 'pedido'}.pdf`,
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
      } else {
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

        pdf.save(`Factura_${pedido.numeroFactura || 'pedido'}.pdf`);
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

  // Extraer datos del pedido
  const {
    direccion_entrega,
    telefono_contacto,
    fecha,
    hora,
    usuario,
    items,
    numeroFactura,
    conFactura = false,
    datos_fiscales
  } = pedido;

  // Calcular valores según tipo
  let subtotalSinIva = 0;
  let iva = 0;
  let subtotalConIva = 0;

  const itemsProcesados = items.map(item => {
    const precioConIva = Number(item.precio);
    const precioSinIva = conFactura ? precioConIva / 1.16 : precioConIva;
    const cantidad = item.cantidad;
    const importeConIva = precioConIva * cantidad;
    const importeSinIva = precioSinIva * cantidad;

    if (conFactura) {
      subtotalSinIva += importeSinIva;
      subtotalConIva += importeConIva;
    } else {
      subtotalConIva += importeConIva;
    }

    return {
      ...item,
      precioConIva,
      precioSinIva,
      importeConIva,
      importeSinIva
    };
  });

  if (conFactura) {
    iva = subtotalSinIva * 0.16;
  }
  const gastoManiobra = subtotalConIva * 0.04;
  const total = subtotalConIva + gastoManiobra;

  return (
    <>
      {/* Barra de botones centrada con fondo blanco */}
      <div className="no-print sticky top-0 z-50 bg-white shadow-md py-2 px-4 mb-4">
        <div className="flex justify-center gap-2 md:gap-4">
          <button
            onClick={() => router.push('/tracking-pedido')}
            className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg hover:opacity-90 flex items-center gap-1"
            style={{ backgroundColor: '#00162f', color: 'white' }}
          >
            <Package size={16} className="md:w-[18px] md:h-[18px]" />
            Tracking
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg hover:opacity-90 flex items-center gap-1"
            style={{ backgroundColor: '#00162f', color: 'white' }}
          >
            <ShoppingCart size={16} className="md:w-4 md:h-4" />
            Inicio
          </button>
          <button
            onClick={imprimirFactura}
            className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg bg-gray-600 text-white flex items-center gap-1.5 md:gap-2"
          >
            <FileDown size={16} className="md:w-[18px] md:h-[18px]" />
            Imprimir
          </button>
          <button
            onClick={generarPDF}
            disabled={generandoPDF}
            className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg hover:opacity-90 flex items-center gap-1.5 md:gap-2 disabled:opacity-50"
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
      </div>

      {/* Aviso para móviles */}
      {isMobile && (
        <div className="no-print bg-blue-50 border-l-4 border-blue-400 p-3 mx-3 mb-3 rounded">
          <div className="flex items-start gap-2">
            <Smartphone size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-800 mb-1">Modo Móvil Detectado</p>
              <p className="text-xs text-blue-700">
                Si el PDF no se descarga automáticamente, usa Imprimir y selecciona Guardar como PDF
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Documento (factura o nota) */}
      <div className="min-h-screen bg-gray-50 p-3 md:p-6 lg:p-8">
        <div 
          id="factura-contenido" 
          ref={facturaRef}
          className="max-w-4xl mx-auto bg-white shadow-xl border-2 border-gray-300"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {/* HEADER - Emisor y título */}
          <div className="border-b-4 border-blue-900 p-2">
            <div className="flex justify-center items-center gap-1">
              {/* logo */}
              <div className="w-[30%]">
                <img 
                  src="/bodega-img.jpg" 
                  alt="Logo" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              {/* orden de compra */}
              <div className="text-center">
                <div className="bg-blue-900 text-white px-4 py-2 mb-2">
                  <h1 className="text-lg md:text-xl font-black">
                    ORDEN DE COMPRA
                  </h1>
                </div>
                <div className="bg-blue-900 text-white px-4 py-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="text-left font-bold">Fecha</div>
                  { conFactura && <div className="text-right font-bold">Folio</div>}
                  <div className="text-left">{fecha} {hora}</div>
                  { conFactura && <div className="text-right">{numeroFactura}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* CLIENTE */}
          <div className="border-b-2 border-gray-300 p-4 md:p-6">
            <div className="w-full bg-blue-900 text-white px-3 py-1 text-center">
              <h3 className="text-xs md:text-sm font-black">CLIENTE</h3>
            </div>
            <p className="font-black text-sm md:text-base text-gray-800 mb-2">
              {usuario?.nombre || 'Cliente'}
            </p>
            {conFactura && datos_fiscales ? (
              <>
                <span className="text-xs text-gray-600 bg-amber-300">Con Factura.</span>
                <p className="text-xs text-gray-600">Razón social: {datos_fiscales.razon_social}</p>
                <p className="text-xs text-gray-600">{datos_fiscales.domicilio_fiscal}</p>
                <p className="text-xs text-gray-600">
                  {datos_fiscales.ciudad}, {datos_fiscales.estado || ''} CP: {datos_fiscales.codigo_postal}
                </p>
                <p className="text-xs text-gray-600 font-bold">RFC: {datos_fiscales.rfc}</p>
                <p className="text-xs text-gray-600">
                  <span className="font-bold">Régimen fiscal:</span> {datos_fiscales.regimen_fiscal}
                </p>
              </>
            ) : (
              <>
                <span className="text-xs text-gray-600 bg-amber-300">Sin factura</span>
                <p className="text-xs text-gray-600">Email: {usuario?.email || 'No especificado'}</p>
              </>
            )}

            {/* Datos de entrega */}
            {(telefono_contacto || direccion_entrega) && (
              <div className="border-t border-gray-200 pt-2 text-xs sm:text-sm">
                <h4 className="font-bold text-xs sm:text-sm mb-2" style={{ color: '#00162f' }}>Datos de entrega</h4>
                {telefono_contacto && (
                  <p className="flex items-center gap-1 text-gray-600 text-xs">
                    <Phone size={14} className="shrink-0" /> {telefono_contacto}
                  </p>
                )}
                {direccion_entrega && (
                  <p className="flex items-start gap-1 text-gray-600 text-xs">
                    <MapPin size={14} className="shrink-0 mt-0.5" /> {direccion_entrega}
                  </p>
                )}
              </div>
            )}
            {/* Leyenda de entrega */}
            {fecha && (
              <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500 italic border-t border-gray-200 pt-2">
                <p>📦 Tu pedido fue realizado el {fecha}. La entrega se efectuará en un plazo de 3 a 5 días hábiles.</p>
              </div>
            )}
          </div>

          {/* TABLA DE PRODUCTOS */}
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-12 gap-2 bg-blue-900 text-white p-2 text-xs font-bold mb-2">
              <div className="col-span-2">Artículo</div>
              <div className="col-span-4">Nombre</div>
              <div className="col-span-1 text-center">U.med.</div>
              <div className="col-span-1 text-right">Unidades</div>
              <div className="col-span-2 text-right">Precio</div>
              <div className="col-span-2 text-right">Importe</div>
            </div>

            {itemsProcesados.map((item, index) => (
              <div key={index} className="border-b border-gray-200 py-2">
                <div className="grid grid-cols-12 gap-2 text-xs items-start">
                  <div className="col-span-2 font-bold text-gray-800">
                    SKU{String(index + 1).padStart(4, '0')}
                  </div>
                  <div className="col-span-4">
                    <p className="font-bold text-gray-800">{item.nombre}</p>
                  </div>
                  <div className="col-span-1 text-center text-gray-600">PIEZA</div>
                  <div className="col-span-1 text-right font-bold text-gray-800">
                    {item.cantidad}
                  </div>
                  <div className="col-span-2 text-right text-gray-800">
                    ${conFactura ? item.precioSinIva.toFixed(2) : item.precioConIva.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-right font-bold text-gray-800">
                    ${conFactura ? item.importeSinIva.toFixed(2) : item.importeConIva.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TOTALES */}
          <div className="border-t-2 border-gray-300 p-4 md:p-6">
            <div className="max-w-md ml-auto space-y-2">
              {conFactura ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">Subtotal (sin IVA)</span>
                    <span className="font-bold text-gray-800">${subtotalSinIva.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">IVA 16%</span>
                    <span className="font-bold text-gray-800">${iva.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">Subtotal (IVA incluido)</span>
                  <span className="font-bold text-gray-800">${subtotalConIva.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Gastos de Maniobra 4%</span>
                <span className="font-bold text-gray-800">${gastoManiobra.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                <span className="text-base md:text-lg font-black text-gray-800">Total (MXN)</span>
                <span className="text-lg md:text-xl font-black text-gray-800">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* MEMBRETE INFERIOR (solo si conFactura) */}
          {conFactura && (
            <>
              <div className="bg-gray-50 p-1 md:p-6 border-t-2 border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                  <p><span className="font-bold">Método de pago:</span> PUE/Pago en una sola exhibición</p>
                  <p><span className="font-bold">Forma de pago:</span> 03/Transferencia electrónica</p>
                </div>
                <p className='mt-2 color-black bg-amber-300'> La factura se enviará por correo electrónico e impresa fiscal al entregar la mercancía.</p>
              </div>
            </>
          )}

          {/* FOOTER común */}
          <div className="p-4 text-center border-t-2 border-gray-300" style={{ backgroundColor: '#00162f' }}>
            <p className="text-xs text-white font-medium mb-1">
              ¡Gracias por tu compra!
            </p>
            <p className="text-[10px] text-yellow-400">
              www.bodegadeazulejos.com | contacto@bodegadeazulejos.com | Tel: (55) 1234-5678
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