// app/factura/FacturaContent.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Download } from 'lucide-react';

export default function FacturaContent() {
  const router = useRouter();
  const [facturaData, setFacturaData] = useState(null);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [html2pdf, setHtml2pdf] = useState(null);

  // Cargar html2pdf.js solo en el cliente
  useEffect(() => {
    // Importar la librería dinámicamente
    import('html2pdf.js').then((module) => {
      setHtml2pdf(() => module.default);
    }).catch(error => {
      console.error('Error al cargar html2pdf.js:', error);
    });

    // Obtener datos de localStorage
    try {
      const data = localStorage.getItem('facturaData');
      if (data) {
        setFacturaData(JSON.parse(data));
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error al leer localStorage:', error);
      router.push('/');
    }
  }, [router]);

  const generarPDF = async () => {
    if (!html2pdf || !facturaData) {
      alert('La librería de PDF aún no está lista. Intenta de nuevo.');
      return;
    }

    setGenerandoPDF(true);
    
    const elemento = document.getElementById('factura-contenido');
    if (!elemento) {
      console.error('No se encontró el elemento de factura');
      setGenerandoPDF(false);
      return;
    }

    const opciones = {
      margin: [10, 10, 10, 10], // [top, right, bottom, left]
      filename: `Factura_${facturaData.numeroFactura}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
        allowTaint: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };

    try {
      await html2pdf().set(opciones).from(elemento).save();
      console.log('PDF generado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setGenerandoPDF(false);
    }
  };

  if (!facturaData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400" />
      </div>
    );
  }

  const { fecha, hora, usuario, items, subtotal, iva, total, numeroFactura } = facturaData;

  return (
    <>
      {/* Botones de acción */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-3">
        <button
          onClick={() => router.push('/tracking')}
          className="px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all hover:opacity-90"
          style={{ backgroundColor: '#00162f', color: 'white' }}
        >
          Tracking del Pedido
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all hover:opacity-90"
          style={{ backgroundColor: '#00162f', color: 'white' }}
        >
          Ir al Inicio
        </button>
        <button
          onClick={generarPDF}
          disabled={generandoPDF}
          className="px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
        >
          {generandoPDF ? (
            <>
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00162f' }} />
              Generando...
            </>
          ) : (
            <>
              <Download size={18} />
              Descargar PDF
            </>
          )}
        </button>
      </div>

      {/* Contenido de la factura */}
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div id="factura-contenido" className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Header con éxito */}
          <div className="no-print relative overflow-hidden" style={{ backgroundColor: '#00162f' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-yellow-400 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-yellow-400 blur-3xl" />
            </div>
            <div className="relative text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
                ¡Compra Exitosa!
              </h1>
              <p className="text-yellow-400 font-medium">
                Tu pedido ha sido procesado correctamente
              </p>
            </div>
          </div>

          {/* Información de la empresa */}
          <div className="border-b-4 p-6 md:p-8" style={{ borderColor: '#fbbf24' }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <img src="/bodega-img.jpg" alt="Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                <div>
                  <h2 className="text-xl md:text-2xl font-black tracking-wider" style={{ color: '#00162f' }}>
                    BODEGA DE AZULEJOS
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">
                    RFC: BDA123456ABC
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    Av. Principal #123, Ciudad
                  </p>
                </div>
              </div>

              <div className="text-left md:text-right">
                <div className="inline-block px-4 py-2 rounded-lg mb-2" style={{ backgroundColor: '#fbbf2420' }}>
                  <p className="text-xs text-gray-600 font-bold uppercase">Factura</p>
                  <p className="text-lg md:text-xl font-black" style={{ color: '#00162f' }}>
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
          <div className="p-6 md:p-8 bg-gray-50">
            <h3 className="text-sm md:text-base font-black uppercase tracking-wider mb-4" style={{ color: '#00162f' }}>
              Datos del Cliente
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1">Nombre</p>
                <p className="text-sm md:text-base font-bold text-gray-800">{usuario.nombre}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1">Correo Electrónico</p>
                <p className="text-sm md:text-base font-bold text-gray-800">{usuario.email}</p>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="p-6 md:p-8">
            <h3 className="text-sm md:text-base font-black uppercase tracking-wider mb-4" style={{ color: '#00162f' }}>
              Detalle de Productos
            </h3>

            <div className="hidden md:grid md:grid-cols-12 gap-4 pb-3 mb-3 border-b-2 text-xs font-black uppercase" style={{ borderColor: '#fbbf24', color: '#00162f' }}>
              <div className="col-span-5">Producto</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-right">Precio Unit.</div>
              <div className="col-span-3 text-right">Subtotal</div>
            </div>

            <div className="space-y-3 md:space-y-2">
              {items.map((item, index) => (
                <div key={index} className="md:grid md:grid-cols-12 md:gap-4 md:items-center py-3 border-b border-gray-200 last:border-0">
                  <div className="md:hidden space-y-2">
                    <p className="font-bold text-sm text-gray-800">{item.nombre}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Cantidad: <span className="font-bold">{item.cantidad}</span></span>
                      <span className="text-gray-600">Precio: <span className="font-bold">${Number(item.precio).toFixed(2)}</span></span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-600 font-bold">Subtotal:</span>
                      <span className="text-base font-black" style={{ color: '#00162f' }}>
                        ${(Number(item.precio) * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:contents">
                    <div className="col-span-5">
                      <p className="font-bold text-sm text-gray-800">{item.nombre}</p>
                      {item.descripcion && (
                        <p className="text-xs text-gray-500 mt-1">{item.descripcion}</p>
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
          </div>

          {/* Totales */}
          <div className="p-6 md:p-8 border-t-2" style={{ borderColor: '#00162f' }}>
            <div className="max-w-md ml-auto space-y-3">
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="font-bold text-gray-600">Subtotal:</span>
                <span className="font-black text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="font-bold text-gray-600">IVA (16%):</span>
                <span className="font-black text-gray-800">${iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2" style={{ borderColor: '#fbbf24' }}>
                <span className="text-lg md:text-xl font-black" style={{ color: '#00162f' }}>
                  TOTAL:
                </span>
                <span className="text-2xl md:text-3xl font-black" style={{ color: '#fbbf24' }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 md:p-8 text-center border-t" style={{ backgroundColor: '#00162f' }}>
            <p className="text-xs md:text-sm text-white font-medium mb-2">
              ¡Gracias por tu compra!
            </p>
            <p className="text-xs text-yellow-400">
              www.bodegadeazulejos.com | contacto@bodegadeazulejos.com | Tel: (55) 1234-5678
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; background: white; }
          .no-print { display: none !important; }
          @page { 
            margin: 1cm;
            size: A4;
          }
          #factura-contenido {
            box-shadow: none;
          }
        }
      `}</style>
    </>
  );
}