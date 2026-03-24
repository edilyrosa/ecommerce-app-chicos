// app/crud-productos/page.jsx
'use client';
import BottomNav from "../../components/BottomNav"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import Header from '../../components/Header';
import { 
  Plus, Edit2, Trash2, Save, X, Loader2, 
  AlertCircle, Package, Search
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [storageUsage, setStorageUsage] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    precio_anterior: '',
    stock: '',
    imagen_url: '',
    linea: '',
    categoria: '',
    coleccion: '',
    formato: '',
    acabado: '',
    pei: '',
    cuerpo: '',
    m2_por_caja: '',
    nombre_comercial: '',
    pegamento_sugerido: '',
    junteador_sugerido: ''
  });

  // Filtrado por búsqueda
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

  // Determinar campos obligatorios según línea
  const getCamposObligatorios = () => {
    const basicos = ['nombre', 'descripcion', 'precio', 'precio_anterior', 'stock', 'imagen_url', 'linea', 'categoria'];
    if (!formData.linea) return ['codigo', ...basicos];

    const linea = formData.linea;
    if (linea === 'Junteador' || linea === 'Pisos' || linea === 'Azulejos') {
      return ['codigo', ...basicos, 'coleccion', 'formato', 'acabado', 'pei', 'cuerpo', 'm2_por_caja', 'nombre_comercial'];
    }
    if (linea === 'Decorados') {
      return ['codigo', ...basicos, 'coleccion', 'formato', 'acabado'];
    }
    return ['codigo', ...basicos];
  };

  const esPegamentoObligatorio = () => {
    const lineasConPegamento = ['Pisos', 'Decorados', 'Azulejos'];
    return lineasConPegamento.includes(formData.linea);
  };

  const esJunteadorObligatorio = () => {
    const lineasConJunteador = ['Pisos', 'Decorados', 'Azulejos', 'Piedras'];
    return lineasConJunteador.includes(formData.linea);
  };

  const camposObligatorios = getCamposObligatorios();
  const esObligatorio = (campo) => {
    if (campo === 'pegamento_sugerido') return esPegamentoObligatorio();
    if (campo === 'junteador_sugerido') return esJunteadorObligatorio();
    return camposObligatorios.includes(campo);
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user && !user.is_admin) {
      toast.error('No tienes permisos de administrador');
      router.push('/');
      return;
    }

    fetchProductos();
    fetchStorageUsage();
  }, [user, router]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const uploadFiles = async (files) => {
    const urls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      const token = Cookies.get('token');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al subir archivo');
      }

      const data = await res.json();
      urls.push(data.url);
    }
    return urls;
  };

  const deleteImageFromBucket = async (path) => {
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/admin/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ path })
      });
      if (!res.ok) {
        const error = await res.json();
        console.error('Error al eliminar imagen:', error);
      }
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
    }
  };

  useEffect(() => {
    if (formData.linea) {
      if (['Pisos', 'Azulejos', 'Decorados', 'Pegamentos', 'Junteador'].includes(formData.linea)) {
        setFormData(prev => ({ ...prev, categoria: 'pisos' }));
      }
    }
  }, [formData.linea]);

  const limpiarFormulario = () => {
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: '',
      precio_anterior: '',
      stock: '',
      imagen_url: '',
      linea: '',
      categoria: '',
      coleccion: '',
      formato: '',
      acabado: '',
      pei: '',
      cuerpo: '',
      m2_por_caja: '',
      nombre_comercial: '',
      pegamento_sugerido: '',
      junteador_sugerido: ''
    });
    setSelectedFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setModoEdicion(false);
    setProductoEditando(null);
  };

  const handleEditar = (producto) => {
    setFormData({
      codigo: producto.codigo || '',
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio || '',
      precio_anterior: producto.precio_anterior || '',
      stock: producto.stock || '',
      imagen_url: producto.imagen_url || '',
      linea: producto.linea || '',
      categoria: producto.categoria || '',
      coleccion: producto.coleccion || '',
      formato: producto.formato || '',
      acabado: producto.acabado || '',
      pei: producto.pei || '',
      cuerpo: producto.cuerpo || '',
      m2_por_caja: producto.m2_por_caja || '',
      nombre_comercial: producto.nombre_comercial || '',
      pegamento_sugerido: producto.pegamento_sugerido || '',
      junteador_sugerido: producto.junteador_sugerido || ''
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setModoEdicion(true);
    setProductoEditando(producto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validarFormulario = () => {
    const faltantes = camposObligatorios.filter(campo => {
      if (campo === 'imagen_url') {
        if (selectedFiles.length > 0) return false;
      }
      const valor = formData[campo];
      return valor === undefined || valor === null || valor === '';
    });

    if (esPegamentoObligatorio() && !formData.pegamento_sugerido?.trim()) {
      faltantes.push('pegamento_sugerido');
    }
    if (esJunteadorObligatorio() && !formData.junteador_sugerido?.trim()) {
      faltantes.push('junteador_sugerido');
    }

    if (faltantes.length > 0) {
      toast.error(`Campos obligatorios: ${faltantes.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    let uploadedUrls = [];
    if (selectedFiles.length > 0) {
      setUploadingImages(true);
      try {
        uploadedUrls = await uploadFiles(selectedFiles);
      } catch (error) {
        toast.error(error.message);
        setUploadingImages(false);
        return;
      } finally {
        setUploadingImages(false);
      }
    }

    const existingUrls = formData.imagen_url
      ? formData.imagen_url.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const newUrls = [...existingUrls, ...uploadedUrls];
    const finalImagenUrl = newUrls.join(', ');

    // Si es edición, eliminar imágenes que ya no están en la nueva lista
    if (productoEditando) {
      const oldUrls = productoEditando.imagen_url?.split(',').map(s => s.trim()).filter(Boolean) || [];
      const urlsToRemove = oldUrls.filter(oldUrl => !newUrls.includes(oldUrl));

      for (const url of urlsToRemove) {
        const path = url.split('/public/img_productos/')[1];
        if (path) {
          await deleteImageFromBucket(path);
        }
      }
    }

    const datosAEnviar = { ...formData, imagen_url: finalImagenUrl };
    const camposNumericos = ['precio', 'precio_anterior', 'stock', 'm2_por_caja'];
    camposNumericos.forEach(campo => {
      if (datosAEnviar[campo] === '') {
        datosAEnviar[campo] = null;
      }
    });

    setGuardando(true);

    try {
      const token = Cookies.get('token');

      if (productoEditando) {
        const res = await fetch('/api/admin/productos/editar', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            id: productoEditando.id,
            ...datosAEnviar
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al editar');
        toast.success('Producto actualizado');
      } else {
        const res = await fetch('/api/admin/productos/crear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(datosAEnviar)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al crear');
        toast.success('Producto creado');
      }

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
      // Obtener el producto antes de eliminarlo para conocer sus imágenes
      const token = Cookies.get('token');
      const producto = productos.find(p => p.id === id);
      if (producto && producto.imagen_url) {
        const urls = producto.imagen_url.split(',').map(s => s.trim()).filter(Boolean);
        for (const url of urls) {
          const path = url.split('/public/img_productos/')[1];
          if (path) {
            await deleteImageFromBucket(path);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 m-auto text-center mb-8">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 tracking-tight">
              GESTIÓN DE PRODUCTOS
            </h1>
            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 animate-bounce-short">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
              <div className="w-full h-10 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Skeleton sin scroll horizontal */}
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
                <div className={`h-${colIdx === 0 ? '16 w-16' : '4 w-20'} bg-gradient-to-r from-blue-100 to-yellow-100 rounded animate-pulse`} />
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
    <div className="min-h-screen bg-gray-50 pb-8">
      <Header />

      <main className="container mx-auto px-3 md:px-6 py-6 max-w-7xl">
          
          <div>
            <h1 className="text-2xl md:text-3xl font-black mb-1" style={{ color: '#00162f' }}>
              Gestión de Productos
            </h1>
            <p className="text-sm text-gray-600">
              {filteredProductos.length} producto{filteredProductos.length !== 1 ? 's' : ''} en total
              {searchTerm && ` (filtrados de ${productos.length})`}
            </p>
          </div>

        <div className="flex items-center justify-end gap-4 mb-6">
          
          {!modoEdicion && (
            <button
              onClick={() => {
                limpiarFormulario();
                setModoEdicion(true);
              }}
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
            >
              <Plus size={20} />
              Nuevo Producto
            </button>
          )}

          {/* //* Formulario de creación/edición */}
          {modoEdicion && (
            <div className="w-full rounded-2xl shadow-xl my-4 p-6 border-2" style={{ borderColor: '#fbbf24' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black" style={{ color: '#00162f' }}>
                  {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button onClick={limpiarFormulario} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X size={24} style={{ color: '#00162f' }} />
                </button>
              </div>

              <form onSubmit={handleGuardar} className="space-y-6">
                {/* DATOS BÁSICOS */}
                <div>
                  <h3 className="text-lg font-bold mb-4" style={{ color: '#00162f' }}>Información Básica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Código */}
                    <div>
                      <label className="block text-sm font-bold mb-2">Código <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Nombre {esObligatorio('nombre') && <span className="text-red-500">*</span>}</label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required={esObligatorio('nombre')}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Línea {esObligatorio('linea') && <span className="text-red-500">*</span>}</label>
                      <select
                        name="linea"
                        value={formData.linea}
                        onChange={handleChange}
                        required={esObligatorio('linea')}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Pisos">Pisos</option>
                        <option value="Azulejos">Azulejos</option>
                        <option value="Decorados">Decorados</option>
                        <option value="Pegamentos">Pegamentos</option>
                        <option value="Junteador">Junteador</option>
                      </select>
                    </div>

                    {/* Pegamento Sugerido */}
                    <div>
                      <label className="block text-sm font-bold mb-2">Pegamento Sugerido {esObligatorio('pegamento_sugerido') && <span className="text-red-500">*</span>}</label>
                      <input
                        type="text"
                        name="pegamento_sugerido"
                        value={formData.pegamento_sugerido}
                        onChange={handleChange}
                        placeholder="Códigos separados por comas"
                        required={esObligatorio('pegamento_sugerido')}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      />
                    </div>

                    {/* Junteador Sugerido */}
                    <div>
                      <label className="block text-sm font-bold mb-2">Junteador Sugerido {esObligatorio('junteador_sugerido') && <span className="text-red-500">*</span>}</label>
                      <input
                        type="text"
                        name="junteador_sugerido"
                        value={formData.junteador_sugerido}
                        onChange={handleChange}
                        placeholder="Códigos separados por comas"
                        required={esObligatorio('junteador_sugerido')}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-2">Descripción {esObligatorio('descripcion') && <span className="text-red-500">*</span>}</label>
                      <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows={3}
                        required={esObligatorio('descripcion')}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Precio {esObligatorio('precio') && <span className="text-red-500">*</span>}</label>
                      <input
                        type="number"
                        step="0.01"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        required={esObligatorio('precio')}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Precio Anterior {esObligatorio('precio_anterior') && <span className="text-red-500">*</span>}</label>
                      <input
                        type="number"
                        step="0.01"
                        name="precio_anterior"
                        value={formData.precio_anterior}
                        onChange={handleChange}
                        required={esObligatorio('precio_anterior')}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Stock {esObligatorio('stock') && <span className="text-red-500">*</span>}</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required={esObligatorio('stock')}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Categoría {esObligatorio('categoria') && <span className="text-red-500">*</span>}</label>
                      {['Pisos', 'Azulejos', 'Decorados', 'Pegamentos', 'Junteador'].includes(formData.linea) ? (
                        <input
                          type="text"
                          name="categoria"
                          value={formData.categoria || 'pisos'}
                          readOnly
                          className="w-full px-4 py-3 border-2 rounded-lg bg-gray-100 cursor-not-allowed"
                          style={{ borderColor: '#00162f20' }}
                        />
                      ) : (
                        <input
                          type="text"
                          name="categoria"
                          value={formData.categoria}
                          onChange={handleChange}
                          required={esObligatorio('categoria')}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                          style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                        />
                      )}
                    </div>

                    {/* URLs de Imágenes (texto) */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-2">URLs de Imágenes (separadas por comas) {esObligatorio('imagen_url') && <span className="text-red-500">*</span>}</label>
                      <textarea
                        name="imagen_url"
                        value={formData.imagen_url}
                        onChange={handleChange}
                        rows={2}
                        placeholder="https://imagen1.jpg, https://imagen2.jpg"
                        required={esObligatorio('imagen_url') && selectedFiles.length === 0}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      />
                    </div>

                    {/* Subida de archivos + previsualización centrada */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-2">Subir imágenes (múltiples, opcional)</label>
                      <label className="block text-xs text-gray-500 mb-2">
                        ➕ Si deseas subir +1 imagen, después de crear este producto modifícalo agregándole más imágenes.
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      />

                      {/* Previsualización centrada */}
                      {previewUrls.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {previewUrls.map((url, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex justify-center items-center">
                              <img src={url} alt={`Vista previa ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedFiles.length > 0 && !previewUrls.length && (
                        <div className="mt-2">
                          <p className="text-xs font-bold mb-1">Archivos seleccionados:</p>
                          <ul className="text-xs text-gray-600">
                            {selectedFiles.map((file, i) => <li key={i}>{file.name}</li>)}
                          </ul>
                        </div>
                      )}

                      {uploadingImages && (
                        <div className="mt-2 flex items-center gap-2 text-yellow-600">
                          <Loader2 size={16} className="animate-spin" />
                          <span className="text-xs">Subiendo imágenes...</span>
                        </div>
                      )}

                      {storageUsage && (
                        <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Almacenamiento usado</span>
                            <span>{storageUsage.usedMB} MB / 1024 MB</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full transition-all duration-300" style={{ width: `${storageUsage.usedPercent}%` }} />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Restante: {storageUsage.remainingMB} MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ESPECIFICACIONES TÉCNICAS - Dinámicas según línea */}
                <div>
                  <h3 className="text-lg font-bold mb-4" style={{ color: '#00162f' }}>Especificaciones Técnicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Colección */}
                    <div>
                      <label className="block text-sm font-bold mb-2">Colección {esObligatorio('coleccion') && <span className="text-red-500">*</span>}</label>
                      {formData.linea === 'Decorados' ? (
                        <select
                          name="coleccion"
                          value={formData.coleccion}
                          onChange={handleChange}
                          required={esObligatorio('coleccion')}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                          style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Cocina">Cocina</option>
                          <option value="Generico">Genérico</option>
                          <option value="Baños">Baños</option>
                          <option value="Mosaico">Mosaico</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="coleccion"
                          value={formData.coleccion}
                          onChange={handleChange}
                          required={esObligatorio('coleccion')}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                          style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                        />
                      )}
                    </div>

                    {/* Formato */}
                    <div>
                      <label className="block text-sm font-bold mb-2">Formato {esObligatorio('formato') && <span className="text-red-500">*</span>}</label>
                      <input
                        type="text"
                        name="formato"
                        value={formData.formato}
                        onChange={handleChange}
                        placeholder={
                          formData.linea === 'Junteador'
                            ? 'Ingresa el color (ej: rojo, verde, blanco...)'
                            : formData.linea === 'Pisos' || formData.linea === 'Decorados'
                            ? 'Ej: 20 x 25 cm'
                            : 'Especificaciones del formato'
                        }
                        required={esObligatorio('formato')}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      />
                    </div>

                    {/* Acabado */}
                    <div>
                      <label className="block text-sm font-bold mb-2">Acabado {esObligatorio('acabado') && <span className="text-red-500">*</span>}</label>
                      {formData.linea === 'Pisos' || formData.linea === 'Azulejos' ? (
                        <select
                          name="acabado"
                          value={formData.acabado}
                          onChange={handleChange}
                          required={esObligatorio('acabado')}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                          style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Mate">Mate</option>
                          <option value="Brillante">Brillante</option>
                        </select>
                      ) : formData.linea === 'Decorados' ? (
                        <select
                          name="acabado"
                          value={formData.acabado}
                          onChange={handleChange}
                          required={esObligatorio('acabado')}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                          style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Flecha">Flecha</option>
                          <option value="Malla">Malla</option>
                          <option value="Cerámico">Cerámico</option>
                        </select>
                      ) : formData.linea === 'Pegamentos' ? (
                        <select
                          name="acabado"
                          value={formData.acabado}
                          onChange={handleChange}
                          required={esObligatorio('acabado')}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                          style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Adecon">Adecon</option>
                          <option value="Pegapiso">Pegapiso</option>
                        </select>
                      ) : formData.linea === 'Junteador' ? (
                        <select
                          name="acabado"
                          value={formData.acabado}
                          onChange={handleChange}
                          required={esObligatorio('acabado')}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                          style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Sin arena">Sin arena</option>
                          <option value="Con arena">Con arena</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="acabado"
                          value={formData.acabado}
                          onChange={handleChange}
                          required={esObligatorio('acabado')}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                          style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                        />
                      )}
                    </div>

                    {/* PEI */}
                    <div>
                      <label className="block text-sm font-bold mb-2">PEI {esObligatorio('pei') && <span className="text-red-500">*</span>}</label>
                      {formData.linea === 'Pisos' || formData.linea === 'Azulejos' ? (
                        <select
                          name="pei"
                          value={formData.pei}
                          onChange={handleChange}
                          required={esObligatorio('pei')}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                          style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="I">I</option>
                          <option value="II">II</option>
                          <option value="III">III</option>
                          <option value="IV">IV</option>
                          <option value="V">V</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="pei"
                          value={formData.pei}
                          onChange={handleChange}
                          required={esObligatorio('pei')}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                          style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                        />
                      )}
                    </div>

                    {/* Cuerpo */}
                    <div>
                      <label className="block text-sm font-bold mb-2">Cuerpo {esObligatorio('cuerpo') && <span className="text-red-500">*</span>}</label>
                      {formData.linea === 'Pisos' || formData.linea === 'Azulejos' ? (
                        <select
                          name="cuerpo"
                          value={formData.cuerpo}
                          onChange={handleChange}
                          required={esObligatorio('cuerpo')}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                          style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Cerámico">Cerámico</option>
                          <option value="Porcelánico">Porcelánico</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="cuerpo"
                          value={formData.cuerpo}
                          onChange={handleChange}
                          required={esObligatorio('cuerpo')}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                          style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                        />
                      )}
                    </div>

                    {/* m² por Caja */}
                    <div>
                      <label className="block text-sm font-bold mb-2">m² por Caja {esObligatorio('m2_por_caja') && <span className="text-red-500">*</span>}</label>
                      <input
                        type="number"
                        step="0.01"
                        name="m2_por_caja"
                        value={formData.m2_por_caja}
                        onChange={handleChange}
                        required={esObligatorio('m2_por_caja')}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      />
                    </div>

                    {/* Nombre Comercial */}
                    <div>
                      <label className="block text-sm font-bold mb-2">Nombre Comercial {esObligatorio('nombre_comercial') && <span className="text-red-500">*</span>}</label>
                      <input
                        type="text"
                        name="nombre_comercial"
                        value={formData.nombre_comercial}
                        onChange={handleChange}
                        required={esObligatorio('nombre_comercial')}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <button type="button" onClick={limpiarFormulario} className="px-6 py-3 rounded-xl font-bold border-2 hover:bg-gray-50 transition" style={{ borderColor: '#00162f', color: '#00162f' }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={guardando || uploadingImages} className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition disabled:opacity-50" style={{ backgroundColor: '#fbbf24', color: '#00162f' }}>
                    {guardando || uploadingImages ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        {uploadingImages ? 'Subiendo imágenes...' : 'Guardando...'}
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        {productoEditando ? 'Actualizar' : 'Crear Producto'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Input de búsqueda siempre visible (encima de la tabla) */}
        <div className="mb-6">
          <div className="relative flex-1 group max-w-md">
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm text-white bg-[#00162f] border border-blue-700 rounded-lg outline-none transition-all placeholder:text-blue-100 focus:bg-blue-900 focus:border-yellow-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-100 group-focus-within:text-yellow-400 transition-colors" />
          </div>
        </div>

        {/* //* Tabla de productos (siempre visible) */}
        <div className="bg-white w-full rounded-2xl shadow-xl overflow-x-auto my-4">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr style={{ backgroundColor: '#00162f' }}>
                  <th className="px-2 py-2 md:px-3 md:py-3 text-left text-[11px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Imagen</th>
                  <th className="px-2 py-2 md:px-3 md:py-3 text-left text-[11px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Código</th>
                  <th className="px-2 py-2 md:px-3 md:py-3 text-left text-[11px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Nombre</th>
                  <th className="px-2 py-2 md:px-3 md:py-3 text-center text-[11px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Stock</th>
                  <th className="hidden md:table-cell px-2 py-2 md:px-3 md:py-3 text-right text-[11px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Precio</th>                 
                  <th className="hidden md:table-cell px-2 py-2 md:px-3 md:py-3 text-right text-[11px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Precio Ant.</th>
                  <th className="px-2 py-2 md:px-3 md:py-3 text-center text-[11px] md:text-xs font-bold text-white uppercase whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProductos.map((producto, index) => (
                  <tr key={producto.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 py-2 md:px-3 md:py-3 whitespace-nowrap">
                      <img
                        src={getPrimeraImagen(producto.imagen_url)}
                        alt={producto.nombre}
                        className="w-8 h-8 md:w-12 md:h-12 object-cover rounded-lg border border-gray-200"
                        onError={(e) => { e.target.src = '/bodega-img.jpg'; }}
                      />
                    </td>
                    <td className="px-2 py-2 md:px-3 md:py-3 whitespace-nowrap">
                      <span className="text-[10px] md:text-xs font-mono text-gray-600">
                        {producto.codigo}
                      </span>
                    </td>
                    <td className="px-2 py-2 md:px-3 md:py-3">
                      <div className="max-w-[140px] md:max-w-xs">
                        <p className="font-bold text-[11px] md:text-sm line-clamp-2" style={{ color: '#00162f' }}>
                          {producto.nombre}
                        </p>
                        {producto.linea && (
                          <span className="text-[9px] md:text-xs text-gray-500">
                            {producto.linea}
                          </span>
                        )}
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
                      <span className="font-bold text-[11px] md:text-sm" style={{ color: '#00162f' }}>
                        ${Number(producto.precio).toFixed(2)}
                      </span>
                
                </td>

                 <td className="hidden md:table-cell px-2 py-2 md:px-3 md:py-3 text-right whitespace-nowrap">
                    {producto.precio_anterior ? (
                        <span className="text-[9px] md:text-xs text-gray-400 line-through">
                        ${Number(producto.precio_anterior).toFixed(2)}
                        </span>
                    ) : (
                        <span className="text-[9px] md:text-xs text-gray-400">-</span>
                    )}
                </td>


                    <td className="px-2 py-2 md:px-3 md:py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-6">
                        <button
                          onClick={() => handleEditar(producto)}
                          className="p-1 md:p-1.5 hover:bg-blue-100 rounded-lg transition group"
                          title="Editar"
                        >
<Edit2 size={22} className="text-blue-600 group-hover:scale-110 transition" />                        </button>
                        <button
                          onClick={() => handleEliminar(producto.id)}
                          disabled={eliminando === producto.id}
                          className="p-1 md:p-1.5 hover:bg-red-100 rounded-lg transition group disabled:opacity-50"
                          title="Eliminar"
                        >
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
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 font-semibold">
                {searchTerm ? 'No hay productos que coincidan con la búsqueda' : 'No hay productos aún'}
              </p>
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="mt-4 px-6 py-2 rounded-xl font-bold" style={{ backgroundColor: '#00162f', color: 'white' }}>
                  Limpiar búsqueda
                </button>
              )}
              {!searchTerm && (
                <button
                  onClick={() => {
                    limpiarFormulario();
                    setModoEdicion(true);
                  }}
                  className="mt-4 px-6 py-2 rounded-xl font-bold"
                  style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
                >
                  Crear Primer Producto
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <BottomNav setCategory={setCategory} currentCategory={category} />
    </div>
  );
}

