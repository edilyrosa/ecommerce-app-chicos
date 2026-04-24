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
import { formatPrice } from '@/lib/formatPrice';

// ========== MAPA DE ZONAS DE ENVÍO ==========
const shippingData = new Map();

// Armería (peso)
[28300, 28304, 28305, 28306, 28307, 28310, 28313, 28315, 28317, 28320, 28330, 28340, 28350].forEach(cp => {
  shippingData.set(cp.toString(), { municipio: 'Armería', estado: 'Colima', tipoCobro: 'weight', tarifaLeve: 1000, tarifaPesado: 2000 });
});
// Comala (peso)
[28450, 28452, 28454, 28459, 28460, 28461, 28462, 28463, 28464, 28465, 28466, 28469].forEach(cp => {
  shippingData.set(cp.toString(), { municipio: 'Comala', estado: 'Colima', tipoCobro: 'weight', tarifaLeve: 250, tarifaPesado: 500 });
});
// Coquimatlán (peso)
[28400, 28402, 28403, 28405, 28410].forEach(cp => {
  shippingData.set(cp.toString(), { municipio: 'Coquimatlán', estado: 'Colima', tipoCobro: 'weight', tarifaLeve: 250, tarifaPesado: 500 });
});
// Cuauhtémoc (peso)
[28500, 28504, 28506, 28507, 28510, 28513, 28514, 28515, 28516, 28517, 28520, 28521, 28522, 28523, 28530, 28531, 28550, 28553, 28554, 28555, 28557, 28590, 28597, 28599].forEach(cp => {
  shippingData.set(cp.toString(), { municipio: 'Cuauhtémoc', estado: 'Colima', tipoCobro: 'weight', tarifaLeve: 300, tarifaPesado: 600 });
});
// Ixtlahuacán (peso)
[28700, 28703, 28704, 28705, 28720, 28724, 28730, 28733, 28734, 28735, 28736].forEach(cp => {
  shippingData.set(cp.toString(), { municipio: 'Ixtlahuacán', estado: 'Colima', tipoCobro: 'weight', tarifaLeve: 800, tarifaPesado: 1600 });
});
// Manzanillo (peso)
[28200, 28209, 28218, 28219, 28230, 28236, 28237, 28238, 28239, 28240, 28250, 28259, 28260, 28269, 28270, 28278, 28279, 28800, 28807, 28808, 28809, 28810, 28812, 28813, 28814, 28815, 28817, 28820, 28825, 28826, 28830, 28833, 28834, 28836, 28838, 28840, 28850, 28855, 28860, 28863, 28864, 28865, 28867, 28868, 28869, 28870, 28872, 28876, 28880, 28885, 28886].forEach(cp => {
  shippingData.set(cp.toString(), { municipio: 'Manzanillo', estado: 'Colima', tipoCobro: 'weight', tarifaLeve: 1800, tarifaPesado: 3600 });
});
// Minatitlán (peso)
[28750, 28760, 28765, 28766, 28767, 28770, 28772, 28773, 28774, 28780, 28784].forEach(cp => {
  shippingData.set(cp.toString(), { municipio: 'Minatitlán', estado: 'Colima', tipoCobro: 'weight', tarifaLeve: 1500, tarifaPesado: 3000 });
});
// Tecomán (peso)
[28100, 28110, 28113, 28114, 28120, 28123, 28130, 28133, 28134, 28140, 28143, 28150, 28159, 28160, 28170, 28180, 28184, 28189, 28190, 28900, 28910, 28915, 28920, 28929, 28930, 28934, 28935, 28936, 28937, 28938, 28940, 28944, 28945, 28947].forEach(cp => {
  shippingData.set(cp.toString(), { municipio: 'Tecomán', estado: 'Colima', tipoCobro: 'weight', tarifaLeve: 900, tarifaPesado: 1800 });
});
// Colima (subtotal)
[28000, 28010, 28014, 28016, 28017, 28018, 28019, 28020, 28023, 28025, 28030, 28035, 28037, 28040, 28043, 28044, 28045, 28046, 28047, 28048, 28050, 28060, 28063, 28067, 28070, 28075, 28077, 28078, 28079, 28080, 28085, 28089, 28090, 28600, 28610, 28613, 28620, 28626, 28627, 28628, 28629, 28630, 28633, 28634, 28635, 28638, 28640, 28645, 28646, 28647, 28650, 28655, 28656].forEach(cp => {
  shippingData.set(cp.toString(), { municipio: 'Colima', estado: 'Colima', tipoCobro: 'subtotal', tarifaLeve: 200, tarifaPesado: 0 });
});
// Villa de Álvarez (subtotal)
[28950, 28952, 28955, 28958, 28959, 28960, 28963, 28965, 28968, 28970, 28973, 28974, 28975, 28976, 28977, 28978, 28979, 28980, 28982, 28983, 28984, 28985, 28986, 28987, 28988, 28989].forEach(cp => {
  shippingData.set(cp.toString(), { municipio: 'Villa de Álvarez', estado: 'Colima', tipoCobro: 'subtotal', tarifaLeve: 200, tarifaPesado: 0 });
});

// ========== NUEVA FUNCIÓN DE CÁLCULO CON MÚLTIPLOS DE 4 TONELADAS ==========
function calcularCostoEnvio(codigoPostal, pesoTotalKg, subtotal) {
  const zona = shippingData.get(codigoPostal);
  if (!zona) return { valido: false, costo: 0, mensaje: 'No realizamos envíos a esta zona' };

  let costo = 0;
  if (zona.tipoCobro === 'weight') {
    const pesoTon = pesoTotalKg / 1000;

    if (pesoTon <= 4) {
      costo = pesoTon <= 1.5 ? zona.tarifaLeve : zona.tarifaPesado;
    } else {
      const fullBlocks = Math.floor(pesoTon / 4);
      const resto = pesoTon - (fullBlocks * 4);
      costo = fullBlocks * zona.tarifaPesado;
      if (resto > 0) {
        costo += resto <= 1.5 ? zona.tarifaLeve : zona.tarifaPesado;
      }
    }
    // Para zonas por peso: mensaje simple
    const mensaje = costo === 0 ? 'Envío gratuito' : `Costo de envío: ${formatPrice(costo)}`;
    return {
      valido: true,
      costo,
      municipio: zona.municipio,
      estado: zona.estado,
      mensaje
    };
  } else {
    // Zonas por subtotal (Colima y Villa de Álvarez)
    costo = subtotal < 3000 ? zona.tarifaLeve : zona.tarifaPesado;
    const leyenda = '(envío gratuito para compras con subtotal superior a 3000 Pesos)';
    // Mostrar siempre el costo numérico (0 o 200) con la leyenda
    const mensaje = `Costo de envío: ${formatPrice(costo)} ${leyenda}`;
    return {
      valido: true,
      costo,
      municipio: zona.municipio,
      estado: zona.estado,
      mensaje
    };
  }
}
export default function Checkout() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('todas');
  const [tipoFactura, setTipoFactura] = useState(null);

  // Campos de entrega
  const [codigoPostalEntrega, setCodigoPostalEntrega] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [direccionGoogle, setDireccionGoogle] = useState('');

  // Campos fiscales
  const [rfc, setRfc] = useState('');
  const [domicilioFiscal, setDomicilioFiscal] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [estado, setEstado] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [regimenFiscal, setRegimenFiscal] = useState('616');

  const { user, updateCartCount } = useAuth();
  const router = useRouter();

  // Estado para información de envío
  const [envioInfo, setEnvioInfo] = useState({ valido: false, costo: 0, municipio: '', estado: '', mensaje: '' });

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
      } else {
        toast.error('Error al cargar el carrito');
        router.push('/carrito');
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

  const eliminarItem = useCallback(async (carritoId) => {
    setItems(prev => prev.filter(i => i.carrito_id !== carritoId));
    try {
      const token = Cookies.get('token');
      await fetch(`/api/carrito/eliminar?id=${carritoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      updateCartCount();
      toast.success('Producto removido');
    } catch {
      fetchCarrito();
    }
  }, [fetchCarrito, updateCartCount]);

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

  // Cálculos financieros y peso
  const subtotal = useMemo(() => 
    items.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0), 
    [items]
  );
  const gastosManiobra = useMemo(() => subtotal * 0.04, [subtotal]);
  const totalConGastos = useMemo(() => subtotal + gastosManiobra, [subtotal, gastosManiobra]);
  const totalWeightKg = useMemo(() => 
    items.reduce((sum, item) => sum + (Number(item.peso_kg || 0) * item.cantidad), 0),
    [items]
  );
  const totalWeightTon = totalWeightKg / 1000;

  const itemsConError = useMemo(() => 
    filteredItems.filter(item => item.cantidad > (item.stock || 0)), 
    [filteredItems]
  );
  const tieneErrores = itemsConError.length > 0;

  // Validaciones de entrega
  const codigoPostalValido = /^\d{5}$/.test(codigoPostalEntrega);
  const zonaPermitida = shippingData.has(codigoPostalEntrega);
  const telefonoValido = /^\d{10}$|^\d{3}-\d{3}-\d{4}$/.test(telefonoContacto);
  const mostrarCamposEntrega = codigoPostalValido && zonaPermitida;
  const datosEntregaValidos = mostrarCamposEntrega && telefonoValido && direccionEntrega.trim() !== '';

  // Calcular envío cuando cambia código, peso o subtotal
  useEffect(() => {
    if (codigoPostalValido && zonaPermitida) {
      const resultado = calcularCostoEnvio(codigoPostalEntrega, totalWeightKg, subtotal);
      setEnvioInfo(resultado);
    } else {
      setEnvioInfo({ valido: false, costo: 0, municipio: '', estado: '', mensaje: 'Código postal no válido o fuera de cobertura' });
    }
  }, [codigoPostalEntrega, totalWeightKg, subtotal]);

  // Validación de datos fiscales
  const rfcValido = /^[A-Z&Ñ]{4}\d{6}[A-Z0-9]{3}$/.test(rfc);
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

  const totalFinal = totalConGastos + envioInfo.costo;

  const confirmarPago = async () => {
    setProcesando(true);
    try {
      const token = Cookies.get('token');
      const numeroFactura = tipoFactura === 'con_factura' ? `FAC-${Date.now().toString().slice(-8)}` : null;

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
        total: totalFinal,
        conFactura: tipoFactura === 'con_factura',
        codigo_postal_entrega: codigoPostalEntrega,
        telefono_contacto: telefonoContacto,
        direccion_entrega: direccionEntrega,
        direccion_google: direccionGoogle || null,
        costo_envio: envioInfo.costo,
        rfc: tipoFactura === 'con_factura' ? rfc : null,
        razon_social: tipoFactura === 'con_factura' ? razonSocial : null,
        domicilio_fiscal: tipoFactura === 'con_factura' ? domicilioFiscal : null,
        ciudad: tipoFactura === 'con_factura' ? ciudad : null,
        estado: tipoFactura === 'con_factura' ? estado : null,
        codigo_postal: tipoFactura === 'con_factura' ? codigoPostal : null,
        regimen_fiscal: tipoFactura === 'con_factura' ? regimenFiscal : null,
        numeroFactura
      };

      const pedidoRes = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(pedidoData)
      });
      const pedidoGuardado = await pedidoRes.json();
      if (!pedidoRes.ok) throw new Error(pedidoGuardado.error || 'Error al registrar el pedido');

      const vaciarRes = await fetch('/api/carrito/vaciar', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const vaciarData = await vaciarRes.json();
      if (!vaciarRes.ok) {
        if (vaciarData.error === 'Stock insuficiente') {
          toast.error(`Stock insuficiente para ${vaciarData.item}. Disponible: ${vaciarData.disponible}, solicitado: ${vaciarData.solicitado}`, { duration: 5000 });
          await fetchCarrito();
          setProcesando(false);
          return;
        } else {
          throw new Error(vaciarData.error || 'Error al procesar el pago');
        }
      }

      toast.success('¡Compra exitosa!', { icon: '🎉', duration: 3000 });
      setItems([]);
      updateCartCount();
      setTimeout(() => router.push(`/factura/${pedidoGuardado.pedido.id}`), 1500);
    } catch (error) {
      console.error(error);
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
        <main className="flex-1 container mx-auto px-2 md:px-4 py-4 md:py-8">
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
      <main className="flex-1 container mx-auto px-2 md:px-4 py-4 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 md:mb-0 text-black">
            Finalizar Compra
          </h1>
          {searchTerm && (
            <p className="text-xs md:text-sm text-gray-700 font-medium">
              {filteredItems.length} de {items.length} producto{items.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {filteredItems.length === 0 && searchTerm ? (
          <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-md border border-blue-50">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
              <span className="text-2xl md:text-3xl">🔍</span>
            </div>
            <p className="text-base md:text-lg text-gray-700 mb-4 font-semibold">
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
                <h2 className="text-lg md:text-xl font-black mb-4 md:mb-6 text-black">
                  {searchTerm ? 'Total Filtrado' : 'Detalles de Pago'}
                </h2>

                {/* CLIENTE */}
                <div className="mb-6 pb-6 border-b border-dashed" style={{ borderColor: '#00162f20' }}>
                  <h3 className="text-sm md:text-base font-bold mb-3 text-black">Cliente</h3>
                  <div className="space-y-1 text-xs md:text-sm">
                    <p className="font-bold text-base md:text-lg text-black">
                      {user?.nombre || 'Nombre no disponible'}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Email:</span> {user?.email || 'Email no disponible'}
                    </p>
                  </div>
                </div>

                {/* DATOS DE ENTREGA */}
                <div className="mb-6 pb-6 border-b border-dashed" style={{ borderColor: '#00162f20' }}>
                  <h3 className="text-sm md:text-base font-bold mb-3 text-black">Datos de entrega</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-800">Código postal *</label>
                    <input
                      type="text"
                      value={codigoPostalEntrega}
                      onChange={(e) => setCodigoPostalEntrega(e.target.value.replace(/\D/g, ''))}
                      maxLength={5}
                      placeholder="28000"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-black placeholder-gray-600 ${
                        codigoPostalEntrega && !codigoPostalValido ? 'border-red-400' : 
                        (codigoPostalValido && !zonaPermitida) ? 'border-red-400' : 'border-gray-200'
                      }`}
                      style={{ '--tw-ring-color': '#fbbf24' }}
                      required
                    />
                    {codigoPostalEntrega && !codigoPostalValido && (
                      <span className="text-xs text-red-600 mt-1 block">Código postal inválido (5 dígitos)</span>
                    )}
                    {codigoPostalValido && !zonaPermitida && (
                      <span className="text-xs text-red-600 mt-1 block">No realizamos envíos a esta zona</span>
                    )}
                    {codigoPostalValido && zonaPermitida && envioInfo.valido && (
                      <div className="mt-2 text-xs text-green-700">
                        <p>Municipio: {envioInfo.municipio}, {envioInfo.estado}</p>
                        <p>{envioInfo.mensaje}</p>
                      </div>
                    )}
                  </div>

                  {mostrarCamposEntrega && (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-800">Teléfono de contacto *</label>
                        <input
                          type="tel"
                          value={telefonoContacto}
                          onChange={(e) => setTelefonoContacto(e.target.value)}
                          placeholder="3121234567 o 312-123-4567"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-black placeholder-gray-600 ${
                            telefonoContacto && !telefonoValido ? 'border-red-400' : 'border-gray-200'
                          }`}
                          style={{ '--tw-ring-color': '#fbbf24' }}
                          required
                        />
                        {telefonoContacto && !telefonoValido && (
                          <span className="text-xs text-red-600 mt-1 block">Teléfono inválido (10 dígitos)</span>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-800">Dirección de entrega *</label>
                        <input
                          type="text"
                          value={direccionEntrega}
                          onChange={(e) => setDireccionEntrega(e.target.value)}
                          placeholder="Calle, número, colonia, ciudad, estado"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-black placeholder-gray-600"
                          style={{ '--tw-ring-color': '#fbbf24' }}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-800">Referencia Google Maps (opcional)</label>
                        <input
                          type="text"
                          value={direccionGoogle}
                          onChange={(e) => setDireccionGoogle(e.target.value)}
                          placeholder="Pega aquí la dirección de Google Maps o coordenadas"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-black placeholder-gray-600"
                          style={{ '--tw-ring-color': '#fbbf24' }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* SUBTOTAL, GASTOS Y PESO */}
                {/* SUBTOTAL, GASTOS Y PESO */}
<div className="space-y-3 md:space-y-4 border-b border-dashed pb-4 md:pb-6 mb-4 md:mb-6" style={{ borderColor: '#00162f20' }}>
  <div className="flex justify-between text-sm md:text-base text-gray-800 font-medium">
    <span>Subtotal:</span>
    <span className="font-bold text-black">{formatPrice(subtotal)}</span>
  </div>
  <div className="flex justify-between text-sm md:text-base text-gray-800 font-medium">
    <span>Gastos de Maniobra (4%):</span>
    <span className="font-bold text-black">{formatPrice(gastosManiobra)}</span>
  </div>
  <div className="flex justify-between text-sm md:text-base text-gray-800 font-medium pt-1">
    <span>Peso total:</span>
    <div className="text-right">
      <span className="font-bold text-black">{totalWeightKg.toFixed(2)} kg</span>
      {totalWeightTon >= 0.01 && <span className="text-xs text-gray-600 ml-1">({totalWeightTon.toFixed(3)} ton)</span>}
    </div>
  </div>
  
  {/* Costo de envío siempre que la zona sea válida */}
  {envioInfo.valido && (
    <>
      <div className="flex justify-between text-sm md:text-base text-gray-800 font-medium">
        <span>Costo de envío:</span>
        <span className="font-bold text-black">
          {envioInfo.costo === 0 ? 'Gratuito' : formatPrice(envioInfo.costo)}
        </span>
      </div>
      {/* Leyenda y municipio (solo si el costo no es cero o si queremos mostrarlo siempre) */}
      {envioInfo.mensaje && (
        <div className="text-xs text-gray-500 mt-1 border-t pt-2 border-dashed" style={{ borderColor: '#00162f20' }}>
          <p className="font-medium text-gray-700">📍 {envioInfo.municipio}, {envioInfo.estado}</p>
          <p className="text-gray-600">{envioInfo.mensaje}</p>
        </div>
      )}
    </>
  )}
</div>

                <div className="flex justify-between text-2xl md:text-3xl font-black mb-6 md:mb-8 text-black">
                  <span>Total:</span>
                  <span style={{ color: '#fbbf24' }}>{formatPrice(totalFinal)}</span>
                </div>

                {/* TIPO DE COMPROBANTE */}
                <div className="mb-6 space-y-3">
                  <h3 className="text-sm md:text-base font-bold text-black">Tipo de comprobante</h3>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm md:text-base cursor-pointer text-gray-800">
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
                    <label className="flex items-center gap-2 text-sm md:text-base cursor-pointer text-gray-800">
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
                    <h3 className="text-sm md:text-base font-bold mb-4 text-black">Datos para factura</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800">RFC *</label>
                        <input
                          type="text"
                          value={rfc}
                          onChange={(e) => setRfc(e.target.value.toUpperCase())}
                          maxLength={13}
                          placeholder="XAXX010101000"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-black placeholder-gray-600 ${
                            rfc && !rfcValido ? 'border-red-400' : 'border-gray-200'
                          }`}
                          style={{ '--tw-ring-color': '#fbbf24' }}
                          required
                        />
                        {rfc && !rfcValido && (
                          <span className="text-xs text-red-600 mt-1 block">
                            Formato: 4 letras + 6 números + 3 dígitos/letras
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800">Razón social o nombre del contribuyente *</label>
                        <input
                          type="text"
                          value={razonSocial}
                          onChange={(e) => setRazonSocial(e.target.value)}
                          placeholder="Razón social"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-black placeholder-gray-600"
                          style={{ '--tw-ring-color': '#fbbf24' }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800">Domicilio Fiscal *</label>
                        <input
                          type="text"
                          value={domicilioFiscal}
                          onChange={(e) => setDomicilioFiscal(e.target.value)}
                          placeholder="Calle, número, colonia"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-black placeholder-gray-600"
                          style={{ '--tw-ring-color': '#fbbf24' }}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-800">Ciudad *</label>
                          <input
                            type="text"
                            value={ciudad}
                            onChange={(e) => setCiudad(e.target.value)}
                            placeholder="Colima"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-black placeholder-gray-600"
                            style={{ '--tw-ring-color': '#fbbf24' }}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-800">Estado *</label>
                          <select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-black"
                            style={{ '--tw-ring-color': '#fbbf24' }}
                            required
                          >
                            <option value="" className="text-gray-700">Selecciona un estado</option>
                            {['Aguascalientes','Baja California','Baja California Sur','Campeche','Chiapas','Chihuahua','Ciudad de México','Coahuila','Colima','Durango','Guanajuato','Guerrero','Hidalgo','Jalisco','México','Michoacán','Morelos','Nayarit','Nuevo León','Oaxaca','Puebla','Querétaro','Quintana Roo','San Luis Potosí','Sinaloa','Sonora','Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatán','Zacatecas'].map(est => (
                              <option key={est} value={est} className="text-black">{est}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-800">Código Postal *</label>
                          <input
                            type="text"
                            value={codigoPostal}
                            onChange={(e) => setCodigoPostal(e.target.value)}
                            maxLength={5}
                            placeholder="28050"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-black placeholder-gray-600"
                            style={{ '--tw-ring-color': '#fbbf24' }}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800">Régimen Fiscal *</label>
                        <select
                          value={regimenFiscal}
                          onChange={(e) => setRegimenFiscal(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-black"
                          style={{ '--tw-ring-color': '#fbbf24' }}
                          required
                        >
                          <option value="616" className="text-black">616 - Sin obligaciones fiscales</option>
                          <option value="612" className="text-black">612 - Personas Físicas con Actividades Empresariales</option>
                          <option value="605" className="text-black">605 - Sueldos y Salarios</option>
                          <option value="606" className="text-black">606 - Arrendamiento</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={confirmarPago}
                  disabled={procesando || !formularioCompleto}
                  className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg transition-all shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2 md:gap-3"
                  style={{
                    backgroundColor: procesando || !formularioCompleto ? '#e5e7eb' : '#fbbf24',
                    color: procesando || !formularioCompleto ? '#6b7280' : '#00162f'
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