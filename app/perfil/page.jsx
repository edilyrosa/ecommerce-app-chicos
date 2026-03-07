'use client';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/authContext';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import BottomNav from '../../components/BottomNav';


// Funciones de validación (copiadas del registro)
const validarNombre = (nombre) => {
  return nombre.trim().length >= 3;
};

const validarRFC = (rfc) => {
  if (!rfc) return true; // opcional
  const re = /^[A-Z&Ñ]{4}[0-9]{6}[A-Z0-9]{3}$/;
  return re.test(rfc.toUpperCase());
};

const validarTelefono = (tel) => {
  if (!tel) return true;
  const re = /^\d{10}$|^\d{3}-\d{3}-\d{4}$/;
  return re.test(tel);
};

const validarCodigoPostal = (cp) => {
  if (!cp) return true;
  return /^\d{5}$/.test(cp);
};

export default function Perfil() {
  const { user: authUser, updateUser } = useAuth();
  const router = useRouter();
    const [category, setCategory] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    rfc: '',
    telefono: '',
    domicilio_fiscal: '',
    ciudad: '',
    estado: '',
    codigo_postal: '',
    regimen_fiscal: '616',
  });
  const [originalData, setOriginalData] = useState(null);

  // Validaciones en tiempo real
  const nombreValido = validarNombre(formData.nombre);
  const rfcValido = validarRFC(formData.rfc);
  const telefonoValido = validarTelefono(formData.telefono);
  const cpValido = validarCodigoPostal(formData.codigo_postal);

  // El formulario es válido si el nombre es válido y los demás campos (si tienen contenido) también lo son
  const formularioValido = nombreValido && rfcValido && telefonoValido && cpValido;

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const loadedData = {
            nombre: data.user.nombre || '',
            rfc: data.user.rfc || '',
            telefono: data.user.telefono || '',
            domicilio_fiscal: data.user.domicilio_fiscal || '',
            ciudad: data.user.ciudad || '',
            estado: data.user.estado || '',
            codigo_postal: data.user.codigo_postal || '',
            regimen_fiscal: data.user.regimen_fiscal || '616',
          };
          setFormData(loadedData);
          setOriginalData(loadedData);
        } else {
          toast.error('No se pudo cargar la información');
          router.push('/');
        }
      } catch {
        toast.error('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Determinar si hay cambios comparando con los datos originales
  const hasChanges = useMemo(() => {
    if (!originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges || !formularioValido) return;
    setSaving(true);

    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/auth/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        toast.success('Datos actualizados');
        setOriginalData(formData); // Actualizar referencia original
        if (updateUser) updateUser(data.user);
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al actualizar');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </main>
        <BottomNav setCategory={setCategory} currentCategory={category} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border" style={{ borderColor: '#00162f20' }}>
          <h1 className="text-3xl font-black mb-8 text-center" style={{ color: '#00162f' }}>
            Mi Perfil
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
                Nombre Completo *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
                  formData.nombre && !nombreValido ? 'border-red-400' : nombreValido ? 'border-green-400' : 'border-gray-200'
                }`}
                style={{ '--tw-ring-color': '#fbbf24' }}
                required
              />
              {formData.nombre && !nombreValido && (
                <span className="text-xs text-red-500 mt-1 block">
                  Mínimo 3 caracteres
                </span>
              )}
            </div>

            <div className="border-t-2 my-4 pt-4" style={{ borderColor: '#00162f20' }}>
              <p className="text-sm text-gray-500 mb-4">Datos fiscales</p>
            </div>

            {/* RFC y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
                  RFC
                </label>
                <input
                  type="text"
                  name="rfc"
                  value={formData.rfc}
                  onChange={(e) => setFormData({...formData, rfc: e.target.value.toUpperCase()})}
                  maxLength={13}
                  placeholder="XAXX010101000"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
                    formData.rfc && !rfcValido ? 'border-red-400' : rfcValido ? 'border-green-400' : 'border-gray-200'
                  }`}
                  style={{ '--tw-ring-color': '#fbbf24' }}
                />
                {formData.rfc && !rfcValido && (
                  <span className="text-xs text-red-500 mt-1 block">
                    Formato: 4 letras + 6 números + 3 dígitos/letras
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="3121234567 o 312-123-4567"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
                    formData.telefono && !telefonoValido ? 'border-red-400' : telefonoValido ? 'border-green-400' : 'border-gray-200'
                  }`}
                  style={{ '--tw-ring-color': '#fbbf24' }}
                />
                {formData.telefono && !telefonoValido && (
                  <span className="text-xs text-red-500 mt-1 block">
                    10 dígitos, opcional guiones
                  </span>
                )}
              </div>
            </div>

            {/* Domicilio Fiscal */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
                Domicilio Fiscal
              </label>
              <input
                type="text"
                name="domicilio_fiscal"
                value={formData.domicilio_fiscal}
                onChange={handleChange}
                placeholder="Calle, número, colonia"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#fbbf24' }}
              />
            </div>

            {/* Ciudad, Estado, Código Postal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
                  Ciudad
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  placeholder="Colima"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#fbbf24' }}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#fbbf24' }}
                >
                  <option value="">Selecciona...</option>
                  <option value="Colima">Colima</option>
                  <option value="Jalisco">Jalisco</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
                  Código Postal
                </label>
                <input
                  type="text"
                  name="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={handleChange}
                  maxLength={5}
                  placeholder="28050"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
                    formData.codigo_postal && !cpValido ? 'border-red-400' : cpValido ? 'border-green-400' : 'border-gray-200'
                  }`}
                  style={{ '--tw-ring-color': '#fbbf24' }}
                />
                {formData.codigo_postal && !cpValido && (
                  <span className="text-xs text-red-500 mt-1 block">
                    5 dígitos numéricos
                  </span>
                )}
              </div>
            </div>

            {/* Régimen Fiscal */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
                Régimen Fiscal
              </label>
              <select
                name="regimen_fiscal"
                value={formData.regimen_fiscal}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#fbbf24' }}
              >
                <option value="616">616 - Sin obligaciones fiscales</option>
                <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                <option value="605">605 - Sueldos y Salarios</option>
                <option value="606">606 - Arrendamiento</option>
              </select>
            </div>

            {/* Botón Guardar */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saving || !hasChanges || !formularioValido}
                className="w-full py-3 md:py-4 rounded-xl font-black text-lg transition-all shadow-xl disabled:opacity-50"
                style={{ 
                  backgroundColor: (hasChanges && formularioValido && !saving) ? '#fbbf24' : '#e5e7eb',
                  color: (hasChanges && formularioValido && !saving) ? '#00162f' : '#9ca3af'
                }}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </main>
        <BottomNav setCategory={setCategory} currentCategory={category} />
    </div>
  );
}