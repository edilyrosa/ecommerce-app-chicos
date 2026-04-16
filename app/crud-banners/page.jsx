// app/crud-banners/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { X, Upload, ChevronDown, ChevronRight, Package } from 'lucide-react';

export default function CrudBanners() {
  const router = useRouter();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [categoriasOptions, setCategoriasOptions] = useState([]);
  const [form, setForm] = useState({
    tipo: 'categorias',
    titulo: '',
    descripcion: '',
    categoria: '',
    imagenes: [],
  });
  const [uploading, setUploading] = useState(false);
  const [storageUsage, setStorageUsage] = useState(null);

  // Estados para acordeones
  const [openSection, setOpenSection] = useState(null);
  const [openCategoriaSub, setOpenCategoriaSub] = useState(null);

  useEffect(() => {
    fetchBanners();
    fetchCategoriasOptions();
    fetchStorageUsage();
  }, []);

  const fetchBanners = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('No autorizado');
        router.push('/login');
        return;
      }
      const res = await fetch('/api/banners', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      } else {
        toast.error('Error al cargar banners');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriasOptions = async () => {
    try {
      const res = await fetch('/api/admin/options?type=categorias');
      if (res.ok) {
        const data = await res.json();
        setCategoriasOptions(data);
      }
    } catch (error) {
      console.error('Error cargando categorías', error);
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Subir imágenes
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (form.imagenes.length + files.length > 3) {
      toast.error('Máximo 3 imágenes por banner');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      const token = Cookies.get('token');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const newUrls = data.urls || (data.url ? [data.url] : []);
        setForm(prev => ({
          ...prev,
          imagenes: [...prev.imagenes, ...newUrls]
        }));
        toast.success('Imágenes subidas');
        // Actualizar uso de almacenamiento después de subir
        fetchStorageUsage();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al subir imágenes');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setUploading(false);
    }
  };

  // Eliminar imagen
  const handleRemoveImage = async (index) => {
    const urlToRemove = form.imagenes[index];
    if (!urlToRemove) return;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const bucket = 'img_productos';
    const publicUrlPrefix = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;
    let path = null;
    if (urlToRemove.startsWith(publicUrlPrefix)) {
      path = urlToRemove.replace(publicUrlPrefix, '');
    } else {
      setForm(prev => ({
        ...prev,
        imagenes: prev.imagenes.filter((_, i) => i !== index)
      }));
      toast.success('Imagen eliminada del formulario');
      return;
    }
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
        setForm(prev => ({
          ...prev,
          imagenes: prev.imagenes.filter((_, i) => i !== index)
        }));
        toast.success('Imagen eliminada');
        // Actualizar uso de almacenamiento después de eliminar
        fetchStorageUsage();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al eliminar imagen');
      }
    } catch {
      toast.error('Error de conexión');
    }
  };

  const handleAddUrl = (url) => {
    if (!url.trim()) return;
    if (form.imagenes.length >= 3) {
      toast.error('Máximo 3 imágenes por banner');
      return;
    }
    setForm(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, url.trim()]
    }));
  };

  // Validar códigos para promocion/productos nuevos (exactamente 3)
  const validarCodigos = (codigosStr) => {
    const codes = codigosStr.split(',').map(c => c.trim()).filter(Boolean);
    return codes.length === 3;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo) {
      toast.error('El título es obligatorio');
      return;
    }
    if (form.tipo === 'categorias') {
      if (form.imagenes.length !== 3) {
        toast.error('Debes cargar exactamente 3 imágenes');
        return;
      }
    } else {
      // promocion o productos nuevos
      const codigosStr = typeof form.imagenes === 'string' ? form.imagenes : '';
      if (!validarCodigos(codigosStr)) {
        toast.error('Debes ingresar exactamente 3 códigos de producto (separados por comas)');
        return;
      }
    }

    let payload = {
      tipo: form.tipo,
      titulo: form.titulo,
      descripcion: form.descripcion,
      categoria: form.tipo === 'categorias' ? form.categoria : null,
      imagenes: form.tipo === 'categorias' ? form.imagenes : form.imagenes.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('No autorizado');
        return;
      }
      const res = await fetch(`/api/banners?id=${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success('Banner actualizado');
        resetForm();
        fetchBanners();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al actualizar');
      }
    } catch {
      toast.error('Error de conexión');
    }
  };

  const handleEdit = (banner) => {
    setEditingId(banner.id);
    if (banner.tipo === 'categorias') {
      setForm({
        tipo: banner.tipo,
        titulo: banner.titulo || '',
        descripcion: banner.descripcion || '',
        categoria: banner.categoria || '',
        imagenes: banner.imagenes || [],
      });
    } else {
      setForm({
        tipo: banner.tipo,
        titulo: banner.titulo || '',
        descripcion: banner.descripcion || '',
        categoria: '',
        imagenes: banner.imagenes ? banner.imagenes.join(', ') : '',
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      tipo: 'categorias',
      titulo: '',
      descripcion: '',
      categoria: '',
      imagenes: [],
    });
    setOpenCategoriaSub(null);
  };

  // Agrupar banners
  const bannersPorTipo = {
    categorias: banners.filter(b => b.tipo === 'categorias'),
    promocion: banners.filter(b => b.tipo === 'promocion'),
    'productos nuevos': banners.filter(b => b.tipo === 'productos nuevos'),
  };

  const bannersPorCategoria = {};
  bannersPorTipo.categorias.forEach(b => {
    const cat = b.categoria || 'sin categoría';
    if (!bannersPorCategoria[cat]) bannersPorCategoria[cat] = [];
    bannersPorCategoria[cat].push(b);
  });

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
    setOpenCategoriaSub(null);
  };

  const toggleCategoriaSub = (cat) => {
    setOpenCategoriaSub(openCategoriaSub === cat ? null : cat);
  };

  // Skeleton de carga
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-gradient-to-br from-blue-100 to-yellow-50 h-12 w-48 rounded-lg animate-pulse mb-8 mx-auto" />
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 animate-pulse">
            <div className="h-8 bg-gradient-to-r from-blue-100 to-yellow-100 rounded w-1/3 mb-6" />
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="flex gap-3">
                <div className="h-10 w-24 bg-gradient-to-r from-blue-100 to-yellow-100 rounded" />
                <div className="h-10 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
            <div className="h-8 bg-gradient-to-r from-blue-100 to-yellow-100 rounded w-1/3 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-black mb-8 text-center" style={{ color: '#00162f' }}>
          Administrar Banners
        </h1>

        {/* Overlay de carga (subiendo imágenes) */}
        {uploading && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 shadow-2xl flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent" />
              <p className="text-gray-700 font-bold">Subiendo imágenes...</p>
            </div>
          </div>
        )}

        {/* Formulario de edición */}
        {editingId && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#00162f' }}>
              Editando Banner
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipo deshabilitado */}
              <div>
                <label className="block text-sm font-bold mb-1">Tipo</label>
                <input
                  type="text"
                  value={form.tipo === 'categorias' ? 'Categorías' : (form.tipo === 'promocion' ? 'Promoción' : 'Productos Nuevos')}
                  className="w-full p-2 border rounded-lg bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Título *</label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {form.tipo === 'categorias' ? (
                <>
                  <div>
                    <label className="block text-sm font-bold mb-1">Categoría</label>
                    <input
                      type="text"
                      value={form.categoria}
                      className="w-full p-2 border rounded-lg bg-gray-100"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Imágenes (exactamente 3)
                    </label>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {form.imagenes.map((img, idx) => (
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
                      {form.imagenes.length < 3 && (
                        <label className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                          <Upload size={24} className="text-gray-400" />
                          <span className="text-xs text-gray-500">Subir</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={uploading}
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Puedes subir imágenes desde tu computadora o agregar URLs manualmente.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        id="manualUrl"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="flex-1 p-2 border rounded-lg text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('manualUrl');
                          const url = input.value;
                          if (url) handleAddUrl(url);
                          input.value = '';
                        }}
                        className={`px-3 rounded-lg text-sm transition ${
                          form.imagenes.length < 3
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={form.imagenes.length >= 3}
                      >
                        Agregar URL
                      </button>
                    </div>
                    {form.imagenes.length !== 3 && (
                      <p className="text-xs text-red-500 mt-1">
                        ⚠️ Debes cargar exactamente 3 imágenes para poder guardar.
                      </p>
                    )}
                    
                    {/* 👇 Aquí agregas la recomendación */}
  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
    <p className="text-xs font-bold text-blue-800 mb-1">📐 Recomendación de dimensiones</p>
    <ul className="text-[11px] text-blue-700 space-y-1 list-disc list-inside">
      <li>Imagen izquierda: <strong>1200 × 700 px</strong> (relación ~1.71:1)</li>
      <li>Imágenes derechas: <strong>800 × 350 px</strong> (relación ~2.28:1)</li>
      <li>Usa imágenes de al menos <strong>1200 px de ancho</strong> para evitar pixelación.</li>
      <li>Formatos recomendados: <strong>JPEG</strong> (para fotos) o <strong>WebP</strong> (mejor compresión).</li>
    </ul>
  </div>





                    {/* Barra de almacenamiento (solo para categorías) */}
                    {storageUsage && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-[10px] md:text-xs text-gray-500 mb-1">
                          <span>Almacenamiento en img_productos</span>
                          <span className="font-bold">{storageUsage.usedMB} / 1024 MB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${storageUsage.usedPercent}%`, backgroundColor: storageUsage.usedPercent > 80 ? '#ef4444' : '#fbbf24' }}
                          />
                        </div>
                        <p className="text-[10px] md:text-xs text-gray-400 mt-1">{storageUsage.remainingMB} MB disponibles</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Códigos de producto (separados por comas) – exactamente 3 *
                  </label>
                  <textarea
                    name="imagenes"
                    value={typeof form.imagenes === 'string' ? form.imagenes : ''}
                    onChange={(e) => setForm(prev => ({ ...prev, imagenes: e.target.value }))}
                    rows="2"
                    placeholder="COD001, COD002, COD003"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ingrese tres códigos de producto que existan en la tabla products.
                  </p>
                  {typeof form.imagenes === 'string' && form.imagenes.trim() !== '' && !validarCodigos(form.imagenes) && (
                    <p className="text-xs text-red-500 mt-1">
                      ⚠️ Debes ingresar exactamente 3 códigos (separados por comas).
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={
                    uploading ||
                    (form.tipo === 'categorias' && form.imagenes.length !== 3) ||
                    (form.tipo !== 'categorias' && typeof form.imagenes === 'string' && !validarCodigos(form.imagenes))
                  }
                  className={`bg-yellow-400 text-[#00162f] font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50`}
                >
                  Actualizar Banner
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de banners agrupada */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#00162f' }}>
            Banners Existentes
          </h2>

          {/* Sección Categorías */}
          <div className="mb-4 border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('categorias')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition font-bold text-left"
            >
              <span>Categorías</span>
              {openSection === 'categorias' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {openSection === 'categorias' && (
              <div className="p-4 space-y-2">
                {Object.keys(bannersPorCategoria).length === 0 ? (
                  <p className="text-gray-500 italic">No hay banners de categorías.</p>
                ) : (
                  Object.keys(bannersPorCategoria).map((cat) => (
                    <div key={cat} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCategoriaSub(cat)}
                        className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition"
                      >
                        <span className="font-medium">{cat}</span>
                        {openCategoriaSub === cat ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      {openCategoriaSub === cat && (
                        <div className="p-3 space-y-2 bg-gray-50">
                          {bannersPorCategoria[cat].map((banner) => (
                            <div key={banner.id} className="border rounded-lg p-3 flex justify-between items-center bg-white">
                              <div>
                                <p className="font-bold">{banner.titulo || 'Sin título'}</p>
                                <p className="text-xs text-gray-400 truncate max-w-md">
                                  {banner.imagenes?.length || 0} imágenes
                                </p>
                              </div>
                              <button
                                onClick={() => handleEdit(banner)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                              >
                                Editar
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sección Promociones */}
          <div className="mb-4 border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('promocion')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition font-bold text-left"
            >
              <span>Promociones</span>
              {openSection === 'promocion' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {openSection === 'promocion' && (
              <div className="p-4 space-y-2">
                {bannersPorTipo.promocion.length === 0 ? (
                  <p className="text-gray-500 italic">No hay banners de promociones.</p>
                ) : (
                  bannersPorTipo.promocion.map((banner) => (
                    <div key={banner.id} className="border rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{banner.titulo || 'Sin título'}</p>
                        <p className="text-xs text-gray-400 truncate max-w-md">
                          {banner.imagenes?.join(', ') || 'Sin códigos'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleEdit(banner)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Editar
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sección Productos Nuevos */}
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('productos nuevos')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition font-bold text-left"
            >
              <span>Productos Nuevos</span>
              {openSection === 'productos nuevos' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {openSection === 'productos nuevos' && (
              <div className="p-4 space-y-2">
                {bannersPorTipo['productos nuevos'].length === 0 ? (
                  <p className="text-gray-500 italic">No hay banners de productos nuevos.</p>
                ) : (
                  bannersPorTipo['productos nuevos'].map((banner) => (
                    <div key={banner.id} className="border rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{banner.titulo || 'Sin título'}</p>
                        <p className="text-xs text-gray-400 truncate max-w-md">
                          {banner.imagenes?.join(', ') || 'Sin códigos'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleEdit(banner)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Editar
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}