// components/FacturaContent.jsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Download, FileDown, AlertCircle, Smartphone, Package, MapPin, Phone, User } from 'lucide-react';

const formatMoney = (value) => {
  if (value === undefined || value === null) return '$0.00';
  const num = Number(value);
  if (isNaN(num)) return '$0.00';
  return num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ------------------------------------------------------------------
// *1. Patrón de reemplazo de funciones CSS modernas no soportadas
// ------------------------------------------------------------------
const patchCss = (css) => {
  if (!css) return '';
  return css
    .replace(/oklab\([^)]+\)/g, 'transparent')
    .replace(/oklch\([^)]+\)/g, 'transparent')
    .replace(/color-mix\([^)]+\)/g, 'transparent')   // ← añadido
    .replace(/color\([^)]+\)/g, 'transparent')       // ← añadido
    .replace(/rgba?\([^)]+\)/g, (m) => m)            // dejar rgb/rgba
    .replace(/hsl\([^)]+\)/g, 'transparent');
};

// ------------------------------------------------------------------
// 2. Estilos de override (reemplazar variables problemáticas)
// ------------------------------------------------------------------
const getOverrideStyles = () => `
  * {
    --tw-ring-color: rgba(59, 130, 246, 0.5) !important;
    --tw-ring-offset-color: #fff !important;
    --tw-gradient-from: #f9fafb !important;
    --tw-gradient-to: #e5e7eb !important;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
    color-scheme: light !important;
  }
  /* Clases concretas que sabemos que se usan en la factura */
  .bg-yellow-400, .bg-yellow-500, .bg-yellow-600 { background-color: #fbbf24 !important; }
  .bg-blue-900 { background-color: #1e3a8a !important; }
  .bg-blue-500 { background-color: #3b82f6 !important; }
  .bg-gray-50 { background-color: #f9fafb !important; }
  .bg-white { background-color: #ffffff !important; }
  .text-white { color: #ffffff !important; }
  .text-black { color: #000000 !important; }
  .text-gray-600 { color: #4b5563 !important; }
  .text-gray-700 { color: #374151 !important; }
  .text-gray-800 { color: #1f2937 !important; }
  .border-yellow-300 { border-color: #fcd34d !important; }
  .border-gray-200 { border-color: #e5e7eb !important; }
  button, a, [style*="background"] { background-origin: border-box !important; }
`;

let styleElement = null;
const injectOverrideStyles = () => {
  if (styleElement) return;
  styleElement = document.createElement('style');
  styleElement.id = 'pdf-override-styles';
  styleElement.textContent = getOverrideStyles();
  document.head.appendChild(styleElement);
};

const removeOverrideStyles = () => {
  if (styleElement) {
    styleElement.remove();
    styleElement = null;
  }
};

// ------------------------------------------------------------------
// 3. Limpieza profunda en el documento clonado (onclone)
// ------------------------------------------------------------------
const limpiarOklabEnClon = async (clonedDoc) => {
  // a) Estilos inline
  clonedDoc.querySelectorAll('[style]').forEach((el) => {
    const s = el.getAttribute('style') || '';
    if (s.includes('oklab') || s.includes('oklch') || s.includes('color-mix') || s.includes('color(')) {
      el.setAttribute('style', patchCss(s));
    }
  });
  // b) Etiquetas <style>
  clonedDoc.querySelectorAll('style').forEach((styleEl) => {
    if (styleEl.textContent && (styleEl.textContent.includes('oklab') || styleEl.textContent.includes('oklch') || styleEl.textContent.includes('color-mix'))) {
      styleEl.textContent = patchCss(styleEl.textContent);
    }
  });
  // c) Hojas externas (fetch y reemplazo)
  const links = Array.from(clonedDoc.querySelectorAll('link[rel="stylesheet"]'));
  await Promise.all(
    links.map(async (linkEl) => {
      try {
        const href = linkEl.href;
        if (!href) return;
        const res = await fetch(href);
        if (!res.ok) return;
        let css = await res.text();
        if (css.includes('oklab') || css.includes('oklch') || css.includes('color-mix')) {
          css = patchCss(css);
        }
        const styleEl = clonedDoc.createElement('style');
        styleEl.textContent = css;
        linkEl.parentNode.replaceChild(styleEl, linkEl);
      } catch {
        // ignorar errores CORS/de red
      }
    })
  );
};

// ------------------------------------------------------------------
// 4. Componente principal
// ------------------------------------------------------------------
export default function FacturaContent({ pedido }) {
  const router = useRouter();
  const facturaRef = useRef(null);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, []);
 if (!pedido) {
    return (
      <div className="min-h-screen bg-gray-50 mt-6 p-3 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-xl border-2 border-gray-300 p-4 md:p-6 animate-pulse">
          {/* skeleton ... (se mantiene igual por brevedad) */}
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
          <div className="border-b-2 border-gray-300 pb-4 mb-4">
            <div className="h-5 w-16 bg-gray-300 rounded mb-3"></div>
            <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 w-64 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 w-56 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 w-40 bg-gray-300 rounded"></div>
          </div>
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
    injectOverrideStyles();

    try {
      const elemento = document.getElementById('factura-contenido');
      if (!elemento) throw new Error('No se encontró el elemento');

      if (isMobile) {
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
            windowWidth: 800,
            onclone: limpiarOklabEnClon,
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        };
        await html2pdf().set(opciones).from(elemento).save();
      } else {
        const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
          import('jspdf'),
          import('html2canvas'),
        ]);
        const canvas = await html2canvas(elemento, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          allowTaint: true,
          useCORS: true,
          windowWidth: 1200,
          onclone: limpiarOklabEnClon,
        });
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
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
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al generar el PDF. Usa el botón "Imprimir"');
    } finally {
      removeOverrideStyles();
      setGenerandoPDF(false);
    }
  };

  const imprimirFactura = () => window.print();

  const {
    direccion_entrega,
    telefono_contacto,
    fecha,
    hora,
    usuario,
    items,
    numeroFactura,
    conFactura = false,
    datos_fiscales,
    costo_envio = 0,
  } = pedido;

  let subtotalSinIva = 0, iva = 0, subtotalConIva = 0;
  const itemsProcesados = items.map((item) => {
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
    return { ...item, precioConIva, precioSinIva, importeConIva, importeSinIva, cantidad };
  });
  if (conFactura) iva = subtotalSinIva * 0.16;
  const gastoPlataforma = subtotalConIva * 0.04;
  const total = subtotalConIva + gastoPlataforma + costo_envio;

  return (
    <>
      {/* Barra de botones (no se imprime) */}
      <div className="no-print sticky top-0 z-50 bg-white shadow-md py-2 px-4 mb-4 border-b border-yellow-300">
        <div className="flex justify-center gap-2 md:gap-4">
          <button onClick={() => router.push('/tracking-pedido')} className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg hover:opacity-90 flex items-center gap-1" style={{ backgroundColor: '#00162f', color: 'white' }}>
            <Package size={16} /> Tracking
          </button>
          <button onClick={() => router.push('/')} className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg hover:opacity-90 flex items-center gap-1" style={{ backgroundColor: '#00162f', color: 'white' }}>
            <ShoppingCart size={16} /> Inicio
          </button>
          <button onClick={imprimirFactura} className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg bg-gray-600 text-white flex items-center gap-1.5">
            <FileDown size={16} /> Imprimir
          </button>
          <button onClick={generarPDF} disabled={generandoPDF} className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg hover:opacity-90 flex items-center gap-1.5 disabled:opacity-50" style={{ backgroundColor: '#fbbf24', color: '#00162f' }}>
            {generandoPDF
              ? <><div className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00162f' }} /><span>...</span></>
              : <><Download size={16} /> PDF</>}
          </button>
        </div>
      </div>

      {isMobile && (
        <div className="no-print bg-blue-50 border-l-4 border-blue-400 p-3 mx-3 mb-3 rounded">
          <div className="flex items-start gap-2">
            <Smartphone size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-800 mb-1">Modo Móvil Detectado</p>
              <p className="text-xs text-blue-700">Si el PDF no se descarga automáticamente, usa Imprimir y selecciona Guardar como PDF</p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-6 lg:p-8">
        <div
          id="factura-contenido"
          ref={facturaRef}
          className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200"
          style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
        >
          {/* HEADER */}
          <div className="relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
            <div className="p-6 md:p-8 border-b border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
                    <img src="/bodega-img.jpg" alt="Logo" className="w-12 h-12 object-contain" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: '#00162f' }}>ORDEN DE COMPRA</h1>
                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                      <span className="font-mono">Fecha: {fecha} {hora}</span>
                      {conFactura && <span className="font-mono">Folio: {numeroFactura}</span>}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500">Estatus</span>
                  <p className="font-bold text-green-600">Confirmado</p>
                </div>
              </div>
            </div>
          </div>

          {/* DATOS DEL CLIENTE */}
          <div className="p-6 md:p-8 border-b border-gray-200 bg-gray-50/40">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} style={{ color: '#00162f' }} />
              <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: '#00162f' }}>Datos del Cliente</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-400 to-transparent"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-black text-gray-800">{usuario?.nombre || 'Cliente'}</p>
                {conFactura && datos_fiscales ? (
                  <>
                    <div className="mt-2 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-mono">Con Factura</div>
                    <p className="text-xs text-gray-600 mt-2">Razón social: {datos_fiscales.razon_social}</p>
                    <p className="text-xs text-gray-600 font-mono">RFC: {datos_fiscales.rfc}</p>
                    <p className="text-xs text-gray-600">{datos_fiscales.domicilio_fiscal}</p>
                    <p className="text-xs text-gray-600">{datos_fiscales.ciudad}, {datos_fiscales.estado || ''} CP: {datos_fiscales.codigo_postal}</p>
                    <p className="text-xs text-gray-600">Régimen: {datos_fiscales.regimen_fiscal}</p>
                  </>
                ) : (
                  <>
                    <div className="mt-2 inline-block px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">Sin factura</div>
                    <p className="text-xs text-gray-600 mt-2">Email: {usuario?.email || 'No especificado'}</p>
                  </>
                )}
              </div>
              {(telefono_contacto || direccion_entrega) && (
                <div className="border-l border-dashed border-gray-300 pl-4">
                  <h4 className="font-bold text-xs uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-1"><MapPin size={14} /> Entrega</h4>
                  {telefono_contacto && <p className="text-xs text-gray-600 flex items-center gap-1"><Phone size={12} /> {telefono_contacto}</p>}
                  {direccion_entrega && <p className="text-xs text-gray-600 mt-1">{direccion_entrega}</p>}
                </div>
              )}
            </div>
            <div className="mt-3 text-[10px] text-gray-400 italic border-t border-gray-200 pt-2">
              📦 Pedido realizado el {fecha}. La entrega se efectuará en un plazo de 3 a 5 días hábiles.
            </div>
          </div>

          {/* TABLA DE PRODUCTOS */}
          <div className="p-6 md:p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: '#00162f' }}>
                    <th className="text-left py-3 px-2 font-black text-xs uppercase tracking-wider" style={{ color: '#00162f' }}>Artículo</th>
                    <th className="text-left py-3 px-2 font-black text-xs uppercase tracking-wider" style={{ color: '#00162f' }}>Nombre</th>
                    <th className="text-center py-3 px-2 font-black text-xs uppercase tracking-wider" style={{ color: '#00162f' }}>U.med.</th>
                    <th className="text-right py-3 px-2 font-black text-xs uppercase tracking-wider" style={{ color: '#00162f' }}>Unidades</th>
                    <th className="text-right py-3 px-2 font-black text-xs uppercase tracking-wider" style={{ color: '#00162f' }}>Precio</th>
                    <th className="text-right py-3 px-2 font-black text-xs uppercase tracking-wider" style={{ color: '#00162f' }}>Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsProcesados.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-3 px-2 font-mono text-xs text-gray-500">SKU{String(idx + 1).padStart(4, '0')}</td>
                      <td className="py-3 px-2"><span className="font-medium text-gray-800">{item.nombre}</span></td>
                      <td className="py-3 px-2 text-center text-gray-500">PIEZA</td>
                      <td className="py-3 px-2 text-right font-bold text-gray-800">{item.cantidad.toLocaleString('es-MX')}</td>
                      <td className="py-3 px-2 text-right text-gray-700">${formatMoney(conFactura ? item.precioSinIva : item.precioConIva)}</td>
                      <td className="py-3 px-2 text-right font-bold text-gray-900">${formatMoney(conFactura ? item.importeSinIva : item.importeConIva)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOTALES */}
          <div className="border-t-2 border-gray-200 p-6 md:p-8 bg-gray-50/30">
            <div className="max-w-sm ml-auto space-y-2">
              {conFactura ? (
                <>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal (sin IVA)</span><span className="font-bold text-gray-800">${formatMoney(subtotalSinIva)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">IVA 16%</span><span className="font-bold text-gray-800">${formatMoney(iva)}</span></div>
                </>
              ) : (
                <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal (IVA incluido)</span><span className="font-bold text-gray-800">${formatMoney(subtotalConIva)}</span></div>
              )}
              <div className="flex justify-between text-sm"><span className="text-gray-600">Gastos de Plataforma (4%)</span><span className="font-bold text-gray-800">${formatMoney(gastoPlataforma)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Costo de envío con maniobra</span><span className="font-bold text-gray-800">${formatMoney(costo_envio)}</span></div>
              <div className="flex justify-between pt-3 mt-1 border-t-2 border-yellow-300">
                <span className="text-lg font-black" style={{ color: '#00162f' }}>Total (MXN)</span>
                <span className="text-xl font-black" style={{ color: '#fbbf24' }}>${formatMoney(total)}</span>
              </div>
            </div>
          </div>

          {conFactura && (
            <div className="bg-gray-50 p-4 md:p-6 border-t border-gray-200 text-xs text-gray-600">
              <div className="grid md:grid-cols-2 gap-2">
                <p><span className="font-bold">Método de pago:</span> PUE / Pago en una sola exhibición</p>
                <p><span className="font-bold">Forma de pago:</span> 03 - Transferencia electrónica</p>
              </div>
              <p className="mt-2 text-yellow-700 bg-yellow-50 p-2 rounded">📄 La factura se enviará por correo electrónico e impresa fiscal al entregar la mercancía.</p>
            </div>
          )}

          <div className="p-4 text-center" style={{ backgroundColor: '#00162f' }}>
            <p className="text-xs text-white font-medium mb-1">¡Gracias por tu compra!</p>
            <p className="text-[10px] text-yellow-300">www.bodegadeazulejos.com | ventas.azulejos@gmail.com | Tel: (52) 3121907380</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          #factura-contenido { box-shadow: none; border-radius: 0; max-width: 100%; }
          @page { margin: 1cm; size: A4; }
        }
      `}</style>
    </>
  );
}
