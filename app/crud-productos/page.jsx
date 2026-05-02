// app/crud-productos/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import Header from '../../components/Header';
import BottomNav from "../../components/BottomNav";
import { 
  Plus, Edit2, Trash2, Save, X, Loader2, 
  AlertCircle, Package, Search, Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function CrudProductos() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [category, setCategory] = useState('todas')

  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [storageUsage, setStorageUsage] = useState(null);
  
  // Opciones dinámicas desde la BD
  const [categoriasOptions, setCategoriasOptions] = useState([]);
  const [lineasOptions, setLineasOptions] = useState([]);
  const [loadingLineas, setLoadingLineas] = useState(false);
  const [opcionesPegamento, setOpcionesPegamento] = useState([]);
  const [opcionesJunteador, setOpcionesJunteador] = useState([]);

  // Opciones fijas
  const opcionesFormato = {
    'Pisos': ['20x20', '20x90', '20x120', '33x33', '36x36', '44x44', '45x90', '55x55', '59.3x119', '60x60', '60x120', '80x160'],
    'Azulejos': ['20x30', '20x50', '25x40', '30x45', '30x60'],
    'Decorados': ['5x20', '6x20', '6x25', '7x20', '8x20', '8x25', '20x30', '25x40', '30x30', '33x46', '33x50', '40x60', '60x120']
  };
  const opcionesAcabado = ['Mate', 'Brillante', 'Semibrillante'];
  const opcionesPei = ['I', 'II', 'III', 'IV', 'V'];
  const opcionesCuerpo = ['Cerámico', 'Porcelánico'];
  const opcionesAcabadoJunteador = ['con arena', 'sin arena'];
  const opcionesColeccionPegamentos = [
    'Blanco Genérico',
    'Pega Piedra Perdura Stone',
    'Pega Pisos y Mármol',
    'Pega Porcelánico',
    'Pega Sobre Piso',
    'Pega Veneciano'
  ];
  const opcionesColeccionDecorados = ['Listeles', 'Imágenes', 'Mallas', 'Cenefas', 'Otros'];

  // Formulario: las imágenes se manejan como array
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    peso_kg: '',
    descripcion: '',
    precio: '',
    precio_anterior: '',
    stock: '',
    categoria: '',
    linea: '',
    coleccion: '',
    formato: '',
    acabado: '',
    pei: '',
    cuerpo: '',
    m2_por_caja: '',
    pegamento_sugerido: [],
    junteador_sugerido: [],
    imagenes: []          // array de URLs
  });

  // ========== FUNCIONES DE OBTENCIÓN DE DATOS ==========
  const fetchCategorias = async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/admin/options?type=categorias', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCategoriasOptions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const fetchLineas = async (categoria) => {
    if (!categoria) {
      setLineasOptions([]);
      return;
    }
    setLoadingLineas(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/options?type=lineas&categoria=${encodeURIComponent(categoria)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLineasOptions(Array.isArray(data) ? data : []);
      } else {
        setLineasOptions([]);
      }
    } catch (error) {
      console.error('Error cargando líneas:', error);
      setLineasOptions([]);
    } finally {
      setLoadingLineas(false);
    }
  };

  const fetchProductosPorLinea = async () => {
    try {
      const token = Cookies.get('token');
      const [pegRes, junRes] = await Promise.all([
        fetch('/api/admin/options?type=productos_por_linea&linea=pegamentos', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/options?type=productos_por_linea&linea=junteadores', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      if (pegRes.ok) {
        const data = await pegRes.json();
        setOpcionesPegamento(Array.isArray(data) ? data : []);
      }
      if (junRes.ok) {
        const data = await junRes.json();
        setOpcionesJunteador(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error cargando productos por línea:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      const res = await fetch('/api/admin/productos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      setProductos(data);
      setFilteredProductos(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const fetchStorageUsage = async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/admin/storage-usage', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStorageUsage(data);
      }
    } catch (error) {
      console.error('Error al obtener uso de almacenamiento:', error);
    }
  };

  // ========== FUNCIÓN PRINCIPAL PARA OBLIGATORIOS ==========
  const getCamposObligatorios = () => {
    const basicos = ['codigo', 'nombre', 'descripcion', 'precio', 'precio_anterior', 'stock', 'categoria', 'linea'];
    if (!formData.linea) return basicos;

    const linea = formData.linea.toLowerCase();
    const categoria = formData.categoria?.toLowerCase();
    
    if (linea === 'pisos' || linea === 'azulejos') {
      return [...basicos, 'formato', 'acabado', 'cuerpo', 'm2_por_caja'];
    }
    if (linea === 'junteadores') {
      return [...basicos, 'acabado'];
    }
    if (linea === 'pegamentos') {
      return [...basicos, 'coleccion'];
    }
    
    let campos = [...basicos];
    
    if (categoria === 'decorados') {
      campos.push('coleccion', 'formato', 'm2_por_caja');
    }
    
    if (categoria === 'pisos' || categoria === 'fachaletas' || categoria === 'decorados') {
      campos.push('pegamento_sugerido', 'junteador_sugerido');
    }
    
    if (linea === 'pisos' || linea === 'azulejos') {
      if (!campos.includes('m2_por_caja')) campos.push('m2_por_caja');
    }
    
    return campos;
  };

  // ========== EFECTOS ==========
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user && !user.is_admin) {
      toast.error('Acceso denegado. Solo administradores.');
      router.push('/');
      return;
    }
    fetchProductos();
    fetchStorageUsage();
    fetchCategorias();
    fetchProductosPorLinea();
  }, [user, router]);

  useEffect(() => {
    if (formData.categoria) {
      fetchLineas(formData.categoria);
    } else {
      setLineasOptions([]);
    }
  }, [formData.categoria]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProductos(productos);
    } else {
      const term = searchTerm.toLowerCase();
      const filtrados = productos.filter(p => 
        p.nombre?.toLowerCase().includes(term) ||
        p.codigo?.toLowerCase().includes(term)
      );
      setFilteredProductos(filtrados);
    }
  }, [searchTerm, productos]);

  // Auto‑formato para junteadores y pegamentos
  useEffect(() => {
    const linea = formData.linea?.toLowerCase();
    if (linea === 'junteadores') {
      const acabado = formData.acabado?.toLowerCase();
      if (acabado === 'con arena') {
        setFormData(prev => ({ ...prev, formato: 'saco de 10kg' }));
      } else if (acabado === 'sin arena') {
        setFormData(prev => ({ ...prev, formato: 'caja 5kg' }));
      }
    } else if (linea === 'pegamentos') {
      setFormData(prev => ({ ...prev, formato: 'saco de 20kg' }));
    }
  }, [formData.linea, formData.acabado]);

  // ========== MANEJADORES DE FORMULARIO ==========
  const handleChange = (e) => {
    const { name, value, type, options } = e.target;
    if (type === 'select-multiple') {
      const selected = Array.from(options)
        .filter(opt => opt.selected)
        .map(opt => opt.value);
      setFormData(prev => ({ ...prev, [name]: selected }));
    } else {
      let newValue = value;
      if (name === 'codigo') newValue = value.toUpperCase();
      if (name === 'categoria' || name === 'linea') newValue = value.toLowerCase();
      setFormData(prev => ({ ...prev, [name]: newValue }));
    }
  };

  // === MANEJO DE IMÁGENES ===
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (formData.imagenes.length + files.length > 10) {
      toast.error('Máximo 10 imágenes por producto');
      return;
    }
    setUploadingImages(true);
    try {
      const formDataObj = new FormData();
      files.forEach(file => formDataObj.append('images', file));
      const token = Cookies.get('token');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataObj,
      });
      if (res.ok) {
        const data = await res.json();
        const newUrls = data.urls || (data.url ? [data.url] : []);
        setFormData(prev => ({
          ...prev,
          imagenes: [...prev.imagenes, ...newUrls]
        }));
        toast.success('Imágenes subidas');
        fetchStorageUsage();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al subir imágenes');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = async (index) => {
    const urlToRemove = formData.imagenes[index];
    if (!urlToRemove) return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const bucket = 'img_productos';
    const publicUrlPrefix = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;
    let path = null;
    if (urlToRemove.startsWith(publicUrlPrefix)) {
      path = urlToRemove.replace(publicUrlPrefix, '');
    }

    if (path) {
      try {
        const token = Cookies.get('token');
        const res = await fetch('/api/admin/delete-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ path }),
        });
        if (res.ok) {
          setFormData(prev => ({
            ...prev,
            imagenes: prev.imagenes.filter((_, i) => i !== index)
          }));
          toast.success('Imagen eliminada');
          fetchStorageUsage();
        } else {
          const error = await res.json();
          toast.error(error.error || 'Error al eliminar imagen');
        }
      } catch {
        toast.error('Error de conexión');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        imagenes: prev.imagenes.filter((_, i) => i !== index)
      }));
      toast.success('Imagen eliminada del formulario');
    }
  };

  const handleAddUrl = (url) => {
    if (!url.trim()) return;
    if (formData.imagenes.length >= 10) {
      toast.error('Máximo 10 imágenes por producto');
      return;
    }
    setFormData(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, url.trim()]
    }));
  };

  const limpiarFormulario = () => {
    setFormData({
      codigo: '',
      nombre: '',
      peso_kg: '',
      descripcion: '',
      precio: '',
      precio_anterior: '',
      stock: '',
      categoria: '',
      linea: '',
      coleccion: '',
      formato: '',
      acabado: '',
      pei: '',
      cuerpo: '',
      m2_por_caja: '',
      pegamento_sugerido: [],
      junteador_sugerido: [],
      imagenes: []
    });
    setModoEdicion(false);
    setProductoEditando(null);
  };

  const handleEditar = (producto) => {
    const imagenesArray = producto.imagen_url
      ? producto.imagen_url.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    setFormData({
      codigo: producto.codigo || '',
      nombre: producto.nombre || '',
      peso_kg: producto.peso_kg || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio || '',
      precio_anterior: producto.precio_anterior || '',
      stock: producto.stock || '',
      categoria: producto.categoria || '',
      linea: producto.linea || '',
      coleccion: producto.coleccion || '',
      formato: producto.formato || '',
      acabado: producto.acabado || '',
      pei: producto.pei || '',
      cuerpo: producto.cuerpo || '',
      m2_por_caja: producto.m2_por_caja || '',
      pegamento_sugerido: producto.pegamento_sugerido ? producto.pegamento_sugerido.split(',').map(s => s.trim()) : [],
      junteador_sugerido: producto.junteador_sugerido ? producto.junteador_sugerido.split(',').map(s => s.trim()) : [],
      imagenes: imagenesArray
    });
    setModoEdicion(true);
    setProductoEditando(producto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validarFormulario = () => {
    const faltantes = getCamposObligatorios().filter(campo => {
      const valor = formData[campo];
      if (campo === 'pegamento_sugerido' || campo === 'junteador_sugerido') {
        return !valor || valor.length === 0;
      }
      return valor === undefined || valor === null || valor === '';
    });

    if (faltantes.length > 0) {
      toast.error(`Campos obligatorios: ${faltantes.join(', ')}`);
      return false;
    }

    const precioNum = parseFloat(formData.precio);
    const precioAntNum = parseFloat(formData.precio_anterior);
    const stockNum = parseInt(formData.stock, 10);
    if (isNaN(precioNum) || precioNum <= 0) {
      toast.error('El precio debe ser un número positivo');
      return false;
    }
    if (isNaN(precioAntNum) || precioAntNum < 0) {
      toast.error('El precio anterior debe ser 0 o un número positivo');
      return false;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      toast.error('El stock debe ser un número entero >= 0');
      return false;
    }

    if (formData.peso_kg !== '' && (isNaN(parseFloat(formData.peso_kg)) || parseFloat(formData.peso_kg) < 0)) {
      toast.error('El peso unitario debe ser un número positivo (kg)');
      return false;
    }

    return true;
  };

  const handleGuardar = async (e) => {
  e.preventDefault();

  if (!validarFormulario()) return;

  // Convertir array de imágenes a string separado por comas
  const finalImagenUrl = formData.imagenes.join(', ');

  // Construir objeto con los datos a enviar
  const datosAEnviar = {
    ...formData,
    imagen_url: finalImagenUrl,
    pegamento_sugerido: formData.pegamento_sugerido.join(', '),
    junteador_sugerido: formData.junteador_sugerido.join(', ')
  };

  // Eliminar propiedades que no son columnas de la tabla
  delete datosAEnviar.imagenes;
  // Si por algún motivo existe un campo 'id', lo eliminamos (evita conflictos en creación)
  delete datosAEnviar.id;

  // Normalizar campos numéricos vacíos a null
  const camposNumericos = ['precio', 'precio_anterior', 'stock', 'm2_por_caja', 'peso_kg'];
  camposNumericos.forEach(campo => {
    if (datosAEnviar[campo] === '') {
      datosAEnviar[campo] = null;
    }
  });

  setGuardando(true);

  try {
    const token = Cookies.get('token');

    if (productoEditando) {
      // --- EDITAR PRODUCTO ---
      // Eliminar imágenes que ya no están en el nuevo array
      const oldUrls = productoEditando.imagen_url?.split(',').map(s => s.trim()).filter(Boolean) || [];
      const urlsToRemove = oldUrls.filter(oldUrl => !formData.imagenes.includes(oldUrl));
      for (const url of urlsToRemove) {
        const path = url.split('/public/img_productos/')[1];
        if (path) {
          await fetch('/api/admin/delete-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ path })
          });
        }
      }

      const res = await fetch('/api/admin/productos/editar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id: productoEditando.id, ...datosAEnviar })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al editar');
      toast.success('Producto actualizado');
    } else {
      // --- CREAR PRODUCTO ---
      // Aseguramos que no se envíe ningún id (por si acaso)
      const datosCreacion = { ...datosAEnviar };
      delete datosCreacion.id;

      const res = await fetch('/api/admin/productos/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(datosCreacion)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear');
      toast.success('Producto creado');
    }

    // Recargar datos y limpiar formulario
    await fetchProductos();
    await fetchStorageUsage();
    limpiarFormulario();
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.message);
  } finally {
    setGuardando(false);
  }
};
  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    setEliminando(id);

    try {
      const token = Cookies.get('token');
      const producto = productos.find(p => p.id === id);
      if (producto && producto.imagen_url) {
        const urls = producto.imagen_url.split(',').map(s => s.trim()).filter(Boolean);
        for (const url of urls) {
          const path = url.split('/public/img_productos/')[1];
          if (path) {
            await fetch('/api/admin/delete-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ path })
            });
          }
        }
      }

      const res = await fetch(`/api/admin/productos/eliminar?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar');

      toast.success('Producto eliminado');
      await fetchProductos();
      await fetchStorageUsage();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar producto');
    } finally {
      setEliminando(null);
    }
  };

  const getPrimeraImagen = (imagen_url) => {
    if (!imagen_url) return '/bodega-img.jpg';
    const imagenes = imagen_url.split(',').map(img => img.trim()).filter(Boolean);
    return imagenes[0] || '/bodega-img.jpg';
  };

  // Funciones para crear nueva categoría/línea
  const handleCreateCategory = () => {
    const newCat = prompt('Ingrese el nombre de la nueva categoría, en minúsculas');
    if (newCat && newCat.trim()) {
      const catName = newCat.trim().toLowerCase();
      if (categoriasOptions.includes(catName)) {
        alert('La categoría ya existe');
        return;
      }
      setCategoriasOptions(prev => [...prev, catName]);
      setFormData(prev => ({ ...prev, categoria: catName }));
    }
  };

  const handleCreateLine = () => {
    if (!formData.categoria) {
      alert('Primero selecciona una categoría');
      return;
    }
    const newLine = prompt('Ingrese el nombre de la nueva línea, en minúsculas y plural');
    if (newLine && newLine.trim()) {
      const lineName = newLine.trim().toLowerCase();
      if (lineasOptions.includes(lineName)) {
        alert('La línea ya existe');
        return;
      }
      setLineasOptions(prev => [...prev, lineName]);
      setFormData(prev => ({ ...prev, linea: lineName }));
    }
  };

  // ========== FUNCIONES AUXILIARES PARA EL RENDER ==========
  const mostrarCampo = (campo) => {
    const linea = formData.linea?.toLowerCase();
    const categoria = formData.categoria?.toLowerCase();

    if (campo === 'coleccion') {
      return linea === 'pisos' || linea === 'azulejos' || linea === 'decorados' || linea === 'pegamentos';
    }
    if (campo === 'formato') {
      return linea === 'pisos' || linea === 'azulejos' || categoria === 'decorados';
    }
    if (campo === 'acabado') {
      return linea === 'pisos' || linea === 'azulejos' || linea === 'junteadores';
    }
    if (campo === 'pei' || campo === 'cuerpo') {
      return linea === 'pisos' || linea === 'azulejos';
    }
    if (campo === 'm2_por_caja') {
      return linea === 'pisos' || linea === 'azulejos' || linea === 'decorados' || categoria === 'fachaletas';
    }
    if (campo === 'pegamento_sugerido' || campo === 'junteador_sugerido') {
      return categoria === 'pisos' || categoria === 'fachaletas' || categoria === 'decorados';
    }
    return false;
  };

  const esObligatorio = (campo) => {
    return getCamposObligatorios().includes(campo);
  };

  /* ─── Estilos compartidos (texto negro) ─── */
  const inputCls = `
    w-full px-3 py-2.5 md:px-4 md:py-3
    text-[13px] md:text-sm text-black placeholder:text-black
    border-2 rounded-xl
    focus:outline-none focus:ring-2 focus:ring-yellow-400
    transition-colors duration-150
    bg-white
  `;
  const inputStyle = { borderColor: '#00162f18' };
  const labelCls = "block text-[11px] md:text-xs font-bold uppercase tracking-wide mb-1.5 text-black";
  const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-base md:text-lg text-black">{icon}</span>
      <h3 className="text-[13px] md:text-base font-black uppercase tracking-wider text-black">{title}</h3>
      <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/60 to-transparent ml-2" />
    </div>
  );

  // ========== RENDER ==========
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 m-auto text-center mb-8">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 tracking-tight">
              GESTIÓN DE PRODUCTOS
            </h1>
            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 animate-bounce-short">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
            </div>
          </div>
          <div className="mb-6">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
              <div className="w-full h-10 bg-linear-to-r from-blue-100 to-yellow-100 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden py-6">
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#00162f' }}>
                    {[...Array(7)].map((_, i) => (
                      <th key={i} className="px-4 py-4">
                        <div className="h-4 w-16 bg-white/20 rounded animate-pulse" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(3)].map((_, rowIdx) => (
                    <tr key={rowIdx} className="border-b">
                      {[...Array(7)].map((_, colIdx) => (
                        <td key={colIdx} className="px-4 py-3">
                          <div className={`h-${colIdx === 0 ? '16 w-16' : '4 w-20'} bg-linear-to-r from-blue-100 to-yellow-100 rounded animate-pulse`} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <BottomNav setCategory={setCategory} currentCategory={category} />
        <style jsx global>{`
          @keyframes bounce-short {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-bounce-short {
            animation: bounce-short 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8 text-black">
      <Header />

      {/* Overlay para eliminar */}
      {eliminando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loader2 className="animate-spin text-white w-12 h-12" />
        </div>
      )}

      <main className="mx-[5%] px-3 md:px-6 py-6">

        <div className="mb-5">
          <h1 className="text-xl md:text-3xl font-black tracking-tight text-black">
            Gestión de Productos
          </h1>
          <p className="text-[11px] md:text-sm text-black mt-0.5">
            {filteredProductos.length} producto{filteredProductos.length !== 1 ? 's' : ''}
            {searchTerm && ` (filtrados de ${productos.length})`}
          </p>
        </div>

        {!modoEdicion && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { 
                limpiarFormulario(); 
                setModoEdicion(true);
                fetchCategorias();
                fetchProductosPorLinea();
              }}
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-[13px] md:text-sm shadow-md hover:shadow-lg active:scale-95 transition-all duration-150"
              style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
            >
              <Plus size={16} />
              Nuevo Producto
            </button>
          </div>
        )}

        {modoEdicion && (
          <>
            {(guardando || uploadingImages) && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Loader2 className="animate-spin text-white w-12 h-12" />
              </div>
            )}

            <div className="w-full rounded-2xl shadow-xl my-4 overflow-hidden border-2" style={{ borderColor: '#fbbf24' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #00162f 0%, #002a5c 100%)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-6 rounded-full bg-yellow-400" />
                  <h2 className="text-sm md:text-lg font-black text-white tracking-wide">
                    {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
                  </h2>
                </div>
                <button onClick={limpiarFormulario} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} className="text-white/80 hover:text-white" />
                </button>
              </div>

              <div className="p-4 md:p-7">
                <form onSubmit={handleGuardar} className="space-y-8">
                  {/* SECCIÓN 1: Identificación */}
                  <div>
                    <SectionHeader icon="🏷️" title="Identificación" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                      <div className="col-span-1">
                        <label className={labelCls}>Código <span className="text-red-500">*</span></label>
                        <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} required className={inputCls} style={inputStyle} />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className={labelCls}>Nombre <span className="text-red-500">*</span></label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className={inputCls} style={inputStyle} />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className={labelCls}>Peso Unitario (kg)</label>
                        <input type="number" step="any" name="peso_kg" value={formData.peso_kg} onChange={handleChange} className={inputCls} style={inputStyle} placeholder="ej. 2.5" />
                      </div>
                    </div>
                  </div>

                  {/* SECCIÓN 2: Clasificación */}
                  <div>
                    <SectionHeader icon="📂" title="Clasificación" />
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className={labelCls}>Categoría <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                          <select name="categoria" value={formData.categoria} onChange={handleChange} required className={inputCls} style={inputStyle}>
                            <option value="">Seleccionar categoría</option>
                            {categoriasOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                          <button type="button" onClick={handleCreateCategory} className="bg-blue-600 text-white px-3 rounded-md hover:bg-blue-700" title="Crear nueva categoría"><Plus size={18} /></button>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Línea <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                          <select
                            name="linea"
                            value={formData.linea}
                            onChange={handleChange}
                            required
                            disabled={!formData.categoria || loadingLineas}
                            className={`${inputCls} ${(!formData.categoria || loadingLineas) ? 'bg-gray-100' : ''}`}
                            style={inputStyle}
                          >
                            <option value="">
                              {!formData.categoria ? 'Elige una categoría antes' : loadingLineas ? 'Cargando líneas...' : 'Seleccionar línea'}
                            </option>
                            {lineasOptions.map(line => <option key={line} value={line}>{line}</option>)}
                          </select>
                          <button type="button" onClick={handleCreateLine} disabled={!formData.categoria} className={`bg-blue-600 text-white px-3 rounded-md hover:bg-blue-700 ${!formData.categoria && 'opacity-50 cursor-not-allowed'}`} title="Crear nueva línea"><Plus size={18} /></button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ESPECIFICACIONES TÉCNICAS */}
                  {(mostrarCampo('coleccion') || mostrarCampo('formato') || mostrarCampo('acabado') ||
                    mostrarCampo('pei') || mostrarCampo('cuerpo') || mostrarCampo('m2_por_caja') ||
                    mostrarCampo('pegamento_sugerido') || mostrarCampo('junteador_sugerido')) && (
                    <div>
                      <SectionHeader icon="⚙️" title="Especificaciones Técnicas" />
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">

                        {/* Colección */}
                        {mostrarCampo('coleccion') && (
                          <div className="col-span-2 md:col-span-1">
                            <label className={labelCls}>
                              Colección {esObligatorio('coleccion') && <span className="text-red-500">*</span>}
                            </label>
                            {formData.linea?.toLowerCase() === 'decorados' ? (
                              <select name="coleccion" value={formData.coleccion} onChange={handleChange}
                                required={esObligatorio('coleccion')} className={inputCls} style={inputStyle}>
                                <option value="">Seleccionar…</option>
                                {opcionesColeccionDecorados.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            ) : formData.linea?.toLowerCase() === 'pegamentos' ? (
                              <>
                                <input
                                  type="text"
                                  name="coleccion"
                                  value={formData.coleccion}
                                  onChange={handleChange}
                                  required={esObligatorio('coleccion')}
                                  className={inputCls}
                                  style={inputStyle}
                                  list="coleccion-pegamentos"
                                  placeholder="Selecciona o escribe una colección"
                                />
                                <datalist id="coleccion-pegamentos">
                                  {opcionesColeccionPegamentos.map(opt => (
                                    <option key={opt} value={opt} />
                                  ))}
                                </datalist>
                              </>
                            ) : (
                              <input type="text" name="coleccion" value={formData.coleccion} onChange={handleChange}
                                required={esObligatorio('coleccion')} className={inputCls} style={inputStyle} />
                            )}
                          </div>
                        )}

                        {/* Formato */}
                        {mostrarCampo('formato') && (
                          <div>
                            <label className={labelCls}>Formato {esObligatorio('formato') && <span className="text-red-500">*</span>}</label>
                            <select name="formato" value={formData.formato} onChange={handleChange}
                              required={esObligatorio('formato')} className={inputCls} style={inputStyle}>
                              <option value="">Seleccionar…</option>
                              {(() => {
                                const lineaKey = formData.linea?.charAt(0).toUpperCase() + formData.linea?.slice(1).toLowerCase();
                                const opciones = formData.categoria?.toLowerCase() === 'decorados'
                                  ? (opcionesFormato['Decorados'] || [])
                                  : (opcionesFormato[lineaKey] || []);
                                return opciones.map(opt => <option key={opt} value={opt}>{opt}</option>);
                              })()}
                            </select>
                          </div>
                        )}

                        {/* Acabado */}
                        {mostrarCampo('acabado') && (
                          <div>
                            <label className={labelCls}>Acabado {esObligatorio('acabado') && <span className="text-red-500">*</span>}</label>
                            {formData.linea?.toLowerCase() === 'pisos' || formData.linea?.toLowerCase() === 'azulejos' ? (
                              <select name="acabado" value={formData.acabado} onChange={handleChange}
                                required={esObligatorio('acabado')} className={inputCls} style={inputStyle}>
                                <option value="">Seleccionar…</option>
                                {opcionesAcabado.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            ) : formData.linea?.toLowerCase() === 'junteadores' ? (
                              <select name="acabado" value={formData.acabado} onChange={handleChange}
                                required={esObligatorio('acabado')} className={inputCls} style={inputStyle}>
                                <option value="">Seleccionar…</option>
                                {opcionesAcabadoJunteador.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            ) : null}
                          </div>
                        )}

                        {/* PEI */}
                        {mostrarCampo('pei') && (
                          <div>
                            <label className={labelCls}>PEI {esObligatorio('pei') && <span className="text-red-500">*</span>}</label>
                            <select name="pei" value={formData.pei} onChange={handleChange}
                              required={esObligatorio('pei')} className={inputCls} style={inputStyle}>
                              <option value="">Seleccionar…</option>
                              {opcionesPei.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        )}

                        {/* Cuerpo */}
                        {mostrarCampo('cuerpo') && (
                          <div>
                            <label className={labelCls}>Cuerpo {esObligatorio('cuerpo') && <span className="text-red-500">*</span>}</label>
                            <select name="cuerpo" value={formData.cuerpo} onChange={handleChange}
                              required={esObligatorio('cuerpo')} className={inputCls} style={inputStyle}>
                              <option value="">Seleccionar…</option>
                              {opcionesCuerpo.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        )}

                        {/* m² por caja */}
                        {mostrarCampo('m2_por_caja') && (
                          <div>
                            <label className={labelCls}>m² por Caja {esObligatorio('m2_por_caja') && <span className="text-red-500">*</span>}</label>
                            <input type="number" step="0.01" name="m2_por_caja" value={formData.m2_por_caja}
                              onChange={handleChange} required={esObligatorio('m2_por_caja')} className={inputCls} style={inputStyle} />
                          </div>
                        )}

                        {/* Pegamento sugerido */}
                        {mostrarCampo('pegamento_sugerido') && (
                          <div className="col-span-2 md:col-span-1">
                            <label className={labelCls}>Pegamento Sugerido {esObligatorio('pegamento_sugerido') && <span className="text-red-500">*</span>}</label>
                            <p className="text-[9px] md:text-[10px] text-black mb-1">Ctrl + clic para múltiples</p>
                            <select name="pegamento_sugerido" multiple value={formData.pegamento_sugerido}
                              onChange={handleChange} required={esObligatorio('pegamento_sugerido')}
                              className={inputCls + " !py-0"} style={inputStyle} size={4}>
                              <option value="">Seleccionar códigos</option>
                              {opcionesPegamento.map(p => <option key={p.codigo} value={p.codigo}>{p.codigo} — {p.nombre}</option>)}
                            </select>
                          </div>
                        )}

                        {/* Junteador sugerido */}
                        {mostrarCampo('junteador_sugerido') && (
                          <div className="col-span-2 md:col-span-1">
                            <label className={labelCls}>Junteador Sugerido {esObligatorio('junteador_sugerido') && <span className="text-red-500">*</span>}</label>
                            <p className="text-[9px] md:text-[10px] text-black mb-1">Ctrl + clic para múltiples</p>
                            <select name="junteador_sugerido" multiple value={formData.junteador_sugerido}
                              onChange={handleChange} required={esObligatorio('junteador_sugerido')}
                              className={inputCls + " !py-0"} style={inputStyle} size={4}>
                              <option value="">Seleccionar códigos</option>
                              {opcionesJunteador.map(j => <option key={j.codigo} value={j.codigo}>{j.codigo} — {j.nombre}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SECCIÓN 3: Descripción */}
                  <div>
                    <SectionHeader icon="📝" title="Descripción" />
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} required
                      placeholder="Describe el producto brevemente…" className={inputCls} style={inputStyle} />
                  </div>

                  {/* SECCIÓN 4: Precios y stock */}
                  <div>
                    <SectionHeader icon="💲" title="Precios y Stock" />
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      <div>
                        <label className={labelCls}>Precio <span className="text-red-500">*</span></label>
                        <input type="number" step="0.01" name="precio" value={formData.precio} onChange={handleChange} required className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <label className={labelCls}>Precio Ant. <span className="text-red-500">*</span></label>
                        <input type="number" step="0.01" name="precio_anterior" value={formData.precio_anterior} onChange={handleChange} required className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <label className={labelCls}>Stock <span className="text-red-500">*</span></label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  {/* SECCIÓN 5: Imágenes (con previsualización y carga múltiple) */}
                  <div>
                    <SectionHeader icon="🖼️" title="Imágenes" />
                    <div>
                      <label className={labelCls}>
                        Imágenes (URLs existentes o nuevas)
                      </label>
                      {/* Previsualización de imágenes */}
                      <div className="flex flex-wrap gap-3 mb-3">
                        {formData.imagenes.map((img, idx) => (
                          <div key={idx} className="relative w-24 h-24 rounded-lg border overflow-hidden group">
                            <img src={img} alt={`img-${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {/* Botón para subir nuevas imágenes */}
                        <label className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                          <Upload size={24} className="text-black" />
                          <span className="text-xs text-black">Subir</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={uploadingImages}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-black mt-1">
                        Puedes subir imágenes desde tu computadora o agregar URLs manualmente.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          id="manualUrl"
                          placeholder="https://ejemplo.com/imagen.jpg"
                          className="flex-1 p-2 border rounded-lg text-sm text-black placeholder:text-black"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('manualUrl');
                            const url = input.value;
                            if (url) handleAddUrl(url);
                            input.value = '';
                          }}
                          className="px-3 rounded-lg text-sm transition bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Agregar URL
                        </button>
                      </div>

                      {/* Recomendación de dimensiones para la primera imagen */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs font-bold text-blue-800 mb-1">📸 Recomendación para la primera imagen</p>
                        <ul className="text-[11px] text-blue-700 space-y-1 list-disc list-inside">
                          <li>La <strong>primera foto</strong> del producto debe ser <strong>rectangular</strong> (16:9 o 7:3) porque podría ser utilizada en los banners de la página de inicio.</li>
                          <li><strong>Dimensiones ideales:</strong> <strong>1920×1080 px</strong> (16:9) o <strong>1400×600 px</strong> (7:3).</li>
                          <li>Esto asegura que se vea nítida y bien proporcionada al mostrarse en secciones destacadas.</li>
                          <li>Formatos recomendados: <strong>JPEG</strong> o <strong>WebP</strong>.</li>
                        </ul>
                      </div>

                      {storageUsage && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="flex justify-between text-[10px] md:text-xs text-black mb-1">
                            <span>Almacenamiento en img_productos</span>
                            <span className="font-bold">{storageUsage.usedMB} / 1024 MB</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${storageUsage.usedPercent}%`, backgroundColor: storageUsage.usedPercent > 80 ? '#ef4444' : '#fbbf24' }}
                            />
                          </div>
                          <p className="text-[10px] md:text-xs text-black mt-1">{storageUsage.remainingMB} MB disponibles</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-5 border-t border-gray-100">
                    <button type="button" onClick={limpiarFormulario}
                      className="px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-[12px] md:text-sm border-2 hover:bg-gray-50 transition-colors text-black"
                      style={{ borderColor: '#00162f' }}>Cancelar</button>
                    <button type="submit" disabled={guardando || uploadingImages}
                      className="px-5 py-2 md:px-7 md:py-2.5 rounded-xl font-bold text-[12px] md:text-sm flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
                      style={{ backgroundColor: '#fbbf24', color: '#00162f' }}>
                      {guardando || uploadingImages ? (
                        <><Loader2 size={16} className="animate-spin" />{uploadingImages ? 'Subiendo…' : 'Guardando…'}</>
                      ) : (
                        <><Save size={16} />{productoEditando ? 'Actualizar' : 'Crear Producto'}</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        <div className="mb-5">
          <div className="relative max-w-md group">
            <input type="text" placeholder="Buscar por nombre o código…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[12px] md:text-sm text-black border border-blue-700 rounded-xl outline-none transition-all placeholder:text-black focus:bg-[#b5c7de] focus:border-yellow-400" />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black group-focus-within:text-yellow-400 transition-colors" />
          </div>
        </div>

        <div className="bg-white w-full rounded-2xl shadow-xl overflow-x-auto my-4">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr style={{ backgroundColor: '#00162f' }}>
                  <th className="px-2 py-2 md:px-3 md:py-3 text-left text-[10px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Imagen</th>
                  <th className="px-2 py-2 md:px-3 md:py-3 text-left text-[10px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Código</th>
                  <th className="px-2 py-2 md:px-3 md:py-3 text-left text-[10px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Nombre</th>
                  <th className="px-2 py-2 md:px-3 md:py-3 text-center text-[10px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Stock</th>
                  <th className="hidden md:table-cell px-2 py-2 md:px-3 md:py-3 text-right text-[10px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Precio</th>
                  <th className="hidden md:table-cell px-2 py-2 md:px-3 md:py-3 text-right text-[10px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Precio Ant.</th>
                  <th className="px-2 py-2 md:px-3 md:py-3 text-center text-[10px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProductos.map((producto, index) => (
                  <tr key={producto.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 py-2 md:px-3 md:py-3 whitespace-nowrap">
                      <img src={getPrimeraImagen(producto.imagen_url)} alt={producto.nombre}
                        className="w-8 h-8 md:w-12 md:h-12 object-cover rounded-lg border border-gray-200"
                        onError={(e) => { e.target.src = '/bodega-img.jpg'; }} />
                    </td>
                    <td className="px-2 py-2 md:px-3 md:py-3 whitespace-nowrap">
                      <span className="text-[10px] md:text-xs font-mono text-black">{producto.codigo}</span>
                    </td>
                    <td className="px-2 py-2 md:px-3 md:py-3">
                      <div className="max-w-35 md:max-w-xs">
                        <p className="font-bold text-[11px] md:text-sm line-clamp-2 text-black">{producto.nombre}</p>
                        {producto.linea && <span className="text-[9px] md:text-xs text-black">{producto.linea}</span>}
                      </div>
                    </td>
                    <td className="px-2 py-2 md:px-3 md:py-3 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[9px] md:text-xs font-bold ${
                        producto.stock === 0 ? 'bg-red-100 text-red-700' :
                        producto.stock <= 10 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        <Package size={10} className="hidden sm:inline" />
                        {producto.stock}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-2 py-2 md:px-3 md:py-3 text-right whitespace-nowrap">
                      <span className="font-bold text-[11px] md:text-sm text-black">${Number(producto.precio).toFixed(2)}</span>
                    </td>
                    <td className="hidden md:table-cell px-2 py-2 md:px-3 md:py-3 text-right whitespace-nowrap">
                      {producto.precio_anterior ? (
                        <span className="text-[9px] md:text-xs text-gray-400 line-through">${Number(producto.precio_anterior).toFixed(2)}</span>
                      ) : (
                        <span className="text-[9px] md:text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-2 py-2 md:px-3 md:py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-6">
                        <button onClick={() => handleEditar(producto)} className="p-1 md:p-1.5 hover:bg-blue-100 rounded-lg transition group" title="Editar">
                          <Edit2 size={22} className="text-blue-600 group-hover:scale-110 transition" />
                        </button>
                        <button onClick={() => handleEliminar(producto.id)} disabled={eliminando === producto.id} className="p-1 md:p-1.5 hover:bg-red-100 rounded-lg transition group disabled:opacity-50" title="Eliminar">
                          {eliminando === producto.id ? (
                            <Loader2 size={16} className="text-red-600 animate-spin" />
                          ) : (
                            <Trash2 size={22} className="text-red-600 group-hover:scale-110 transition" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProductos.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-[13px] md:text-base text-black font-semibold">
                {searchTerm ? 'No hay productos que coincidan' : 'No hay productos aún'}
              </p>
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="mt-4 px-6 py-2 rounded-xl text-[12px] md:text-sm font-bold text-white bg-[#00162f]">
                  Limpiar búsqueda
                </button>
              )}
              {!searchTerm && (
                <button onClick={() => { limpiarFormulario(); setModoEdicion(true); }}
                  className="mt-4 px-6 py-2 rounded-xl text-[12px] md:text-sm font-bold"
                  style={{ backgroundColor: '#fbbf24', color: '#00162f' }}>Crear Primer Producto</button>
              )}
            </div>
          )}
        </div>
      </main>

      <BottomNav setCategory={setCategory} currentCategory={category} />
    </div>
  );
}