// // app/crud-productos/page.jsx
// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../../context/authContext';
// import Header from '../../components/Header';
// import { 
//   Plus, Edit2, Trash2, Save, X, Loader2, 
//   AlertCircle, Package 
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import Cookies from 'js-cookie';

// export default function CrudProductos() {
//   const router = useRouter();
//   const { user } = useAuth();
  
//   const [productos, setProductos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modoEdicion, setModoEdicion] = useState(false);
//   const [productoEditando, setProductoEditando] = useState(null);
//   const [guardando, setGuardando] = useState(false);
//   const [eliminando, setEliminando] = useState(null);

//   const [formData, setFormData] = useState({
//     codigo: '',
//     nombre: '',
//     descripcion: '',
//     precio: '',
//     precio_anterior: '',
//     stock: '',
//     imagen_url: '',
//     linea: '',
//     categoria: '',
//     coleccion: '',
//     formato: '',
//     acabado: '',
//     pei: '',
//     cuerpo: '',
//     m2_por_caja: '',
//     nombre_comercial: ''
//   });

//   const getCamposObligatorios = () => {
//     const basicos = ['nombre', 'descripcion', 'precio', 'precio_anterior', 'stock', 'imagen_url', 'linea', 'categoria'];
//     if (!formData.linea) return basicos;

//     const linea = formData.linea;
//     if (linea === 'Junteador' || linea === 'Pisos') {
//       return ['codigo', ...basicos, 'coleccion', 'formato', 'acabado', 'pei', 'cuerpo', 'm2_por_caja', 'nombre_comercial'];
//     }
//     if (linea === 'Decorados') {
//       return ['codigo', ...basicos, 'coleccion', 'formato', 'acabado'];
//     }
//     // Para otras líneas (Pegamentos, Azulejos) solo básicos + código
//     return ['codigo', ...basicos];
//   };

//   const camposObligatorios = getCamposObligatorios();
//   const esObligatorio = (campo) => camposObligatorios.includes(campo);

//   useEffect(() => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }
    
//     if (user && !user.is_admin) {
//       toast.error('No tienes permisos de administrador');
//       router.push('/');
//       return;
//     }

//     fetchProductos();
//   }, [user, router]);

//   const fetchProductos = async () => {
//     try {
//       setLoading(true);
//       const token = Cookies.get('token');
//       const res = await fetch('/api/admin/productos', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (!res.ok) throw new Error('Error al cargar productos');

//       const data = await res.json();
//       setProductos(data);
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error al cargar productos');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const limpiarFormulario = () => {
//     setFormData({
//       codigo: '',
//       nombre: '',
//       descripcion: '',
//       precio: '',
//       precio_anterior: '',
//       stock: '',
//       imagen_url: '',
//       linea: '',
//       categoria: '',
//       coleccion: '',
//       formato: '',
//       acabado: '',
//       pei: '',
//       cuerpo: '',
//       m2_por_caja: '',
//       nombre_comercial: ''
//     });
//     setModoEdicion(false);
//     setProductoEditando(null);
//   };

//   const handleEditar = (producto) => {
//     setFormData({
//       codigo: producto.codigo || '',
//       nombre: producto.nombre || '',
//       descripcion: producto.descripcion || '',
//       precio: producto.precio || '',
//       precio_anterior: producto.precio_anterior || '',
//       stock: producto.stock || '',
//       imagen_url: producto.imagen_url || '',
//       linea: producto.linea || '',
//       categoria: producto.categoria || '',
//       coleccion: producto.coleccion || '',
//       formato: producto.formato || '',
//       acabado: producto.acabado || '',
//       pei: producto.pei || '',
//       cuerpo: producto.cuerpo || '',
//       m2_por_caja: producto.m2_por_caja || '',
//       nombre_comercial: producto.nombre_comercial || ''
//     });
//     setModoEdicion(true);
//     setProductoEditando(producto);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const validarFormulario = () => {
//     const faltantes = camposObligatorios.filter(campo => {
//       const valor = formData[campo];
//       return valor === undefined || valor === null || valor === '';
//     });
//     if (faltantes.length > 0) {
//       toast.error(`Campos obligatorios: ${faltantes.join(', ')}`);
//       return false;
//     }
//     return true;
//   };

//   const handleGuardar = async (e) => {
//     e.preventDefault();

//     if (!validarFormulario()) return;

//     // Preparar datos: convertir numéricos vacíos a null
//     const datosAEnviar = { ...formData };
//     const camposNumericos = ['precio', 'precio_anterior', 'stock', 'm2_por_caja'];
//     camposNumericos.forEach(campo => {
//       if (datosAEnviar[campo] === '') {
//         datosAEnviar[campo] = null;
//       }
//     });

//     setGuardando(true);

//     try {
//       const token = Cookies.get('token');

//       if (productoEditando) {
//         // EDITAR: enviamos el id numérico y todos los datos
//         const res = await fetch('/api/admin/productos/editar', {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             id: productoEditando.id,
//             ...datosAEnviar
//           })
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || 'Error al editar');
//         toast.success('Producto actualizado');
//       } else {
//         // CREAR: enviamos todos los datos (el id numérico se genera automáticamente)
//         const res = await fetch('/api/admin/productos/crear', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify(datosAEnviar)
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || 'Error al crear');
//         toast.success('Producto creado');
//       }

//       await fetchProductos();
//       limpiarFormulario();
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error(error.message);
//     } finally {
//       setGuardando(false);
//     }
//   };

//   const handleEliminar = async (id) => {
//     if (!confirm('¿Estás seguro de eliminar este producto?')) return;

//     setEliminando(id);

//     try {
//       const token = Cookies.get('token');
//       const res = await fetch(`/api/admin/productos/eliminar?id=${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (!res.ok) throw new Error('Error al eliminar');

//       toast.success('Producto eliminado');
//       await fetchProductos();
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error al eliminar producto');
//     } finally {
//       setEliminando(null);
//     }
//   };

//   const getPrimeraImagen = (imagen_url) => {
//     if (!imagen_url) return '/bodega-img.jpg';
//     const imagenes = imagen_url.split(',').map(img => img.trim()).filter(Boolean);
//     return imagenes[0] || '/bodega-img.jpg';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#fbbf24' }} />
//           <p className="text-gray-600 font-semibold">Cargando productos...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-8">
//       <Header />

//       <main className="container mx-auto px-3 md:px-6 py-6 max-w-7xl">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-black mb-1" style={{ color: '#00162f' }}>
//               Gestión de Productos
//             </h1>
//             <p className="text-sm text-gray-600">
//               {productos.length} producto{productos.length !== 1 ? 's' : ''} en total
//             </p>
//           </div>
          
//           {!modoEdicion && (
//             <button
//               onClick={() => {
//                 limpiarFormulario();
//                 setModoEdicion(true);
//               }}
//               className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all"
//               style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
//             >
//               <Plus size={20} />
//               Nuevo Producto
//             </button>
//           )}
//         </div>

//         {modoEdicion && (
//           <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2" style={{ borderColor: '#fbbf24' }}>
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-black" style={{ color: '#00162f' }}>
//                 {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
//               </h2>
//               <button
//                 onClick={limpiarFormulario}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition"
//               >
//                 <X size={24} style={{ color: '#00162f' }} />
//               </button>
//             </div>

//             <form onSubmit={handleGuardar} className="space-y-6">
//               {/* DATOS BÁSICOS */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4" style={{ color: '#00162f' }}>
//                   Información Básica
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Código */}
//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       Código <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="codigo"
//                       value={formData.codigo}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       Nombre {esObligatorio('nombre') && <span className="text-red-500">*</span>}
//                     </label>
//                     <input
//                       type="text"
//                       name="nombre"
//                       value={formData.nombre}
//                       onChange={handleChange}
//                       required={esObligatorio('nombre')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       Línea {esObligatorio('linea') && <span className="text-red-500">*</span>}
//                     </label>
//                     <select
//                       name="linea"
//                       value={formData.linea}
//                       onChange={handleChange}
//                       required={esObligatorio('linea')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     >
//                       <option value="">Seleccionar...</option>
//                       <option value="Pisos">Pisos</option>
//                       <option value="Azulejos">Azulejos</option>
//                       <option value="Decorados">Decorados</option>
//                       <option value="Pegamentos">Pegamentos</option>
//                       <option value="Junteador">Junteador</option>
//                     </select>
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-bold mb-2">
//                       Descripción {esObligatorio('descripcion') && <span className="text-red-500">*</span>}
//                     </label>
//                     <textarea
//                       name="descripcion"
//                       value={formData.descripcion}
//                       onChange={handleChange}
//                       rows={3}
//                       required={esObligatorio('descripcion')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       Precio {esObligatorio('precio') && <span className="text-red-500">*</span>}
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       name="precio"
//                       value={formData.precio}
//                       onChange={handleChange}
//                       required={esObligatorio('precio')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       Precio Anterior {esObligatorio('precio_anterior') && <span className="text-red-500">*</span>}
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       name="precio_anterior"
//                       value={formData.precio_anterior}
//                       onChange={handleChange}
//                       required={esObligatorio('precio_anterior')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       Stock {esObligatorio('stock') && <span className="text-red-500">*</span>}
//                     </label>
//                     <input
//                       type="number"
//                       name="stock"
//                       value={formData.stock}
//                       onChange={handleChange}
//                       required={esObligatorio('stock')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       Categoría {esObligatorio('categoria') && <span className="text-red-500">*</span>}
//                     </label>
//                     <input
//                       type="text"
//                       name="categoria"
//                       value={formData.categoria}
//                       onChange={handleChange}
//                       required={esObligatorio('categoria')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-bold mb-2">
//                       URLs de Imágenes (separadas por comas) {esObligatorio('imagen_url') && <span className="text-red-500">*</span>}
//                     </label>
//                     <textarea
//                       name="imagen_url"
//                       value={formData.imagen_url}
//                       onChange={handleChange}
//                       rows={2}
//                       placeholder="https://imagen1.jpg, https://imagen2.jpg"
//                       required={esObligatorio('imagen_url')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* ESPECIFICACIONES TÉCNICAS */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4" style={{ color: '#00162f' }}>
//                   Especificaciones Técnicas
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       Colección {esObligatorio('coleccion') && <span className="text-red-500">*</span>}
//                     </label>
//                     <input
//                       type="text"
//                       name="coleccion"
//                       value={formData.coleccion}
//                       onChange={handleChange}
//                       required={esObligatorio('coleccion')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       Formato {esObligatorio('formato') && <span className="text-red-500">*</span>}
//                     </label>
//                     <input
//                       type="text"
//                       name="formato"
//                       value={formData.formato}
//                       onChange={handleChange}
//                       placeholder="60 x 60 cm"
//                       required={esObligatorio('formato')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       Acabado {esObligatorio('acabado') && <span className="text-red-500">*</span>}
//                     </label>
//                     <input
//                       type="text"
//                       name="acabado"
//                       value={formData.acabado}
//                       onChange={handleChange}
//                       required={esObligatorio('acabado')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       PEI {esObligatorio('pei') && <span className="text-red-500">*</span>}
//                     </label>
//                     <input
//                       type="text"
//                       name="pei"
//                       value={formData.pei}
//                       onChange={handleChange}
//                       required={esObligatorio('pei')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       Cuerpo {esObligatorio('cuerpo') && <span className="text-red-500">*</span>}
//                     </label>
//                     <input
//                       type="text"
//                       name="cuerpo"
//                       value={formData.cuerpo}
//                       onChange={handleChange}
//                       required={esObligatorio('cuerpo')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       m² por Caja {esObligatorio('m2_por_caja') && <span className="text-red-500">*</span>}
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       name="m2_por_caja"
//                       value={formData.m2_por_caja}
//                       onChange={handleChange}
//                       required={esObligatorio('m2_por_caja')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold mb-2">
//                       Nombre Comercial {esObligatorio('nombre_comercial') && <span className="text-red-500">*</span>}
//                     </label>
//                     <input
//                       type="text"
//                       name="nombre_comercial"
//                       value={formData.nombre_comercial}
//                       onChange={handleChange}
//                       required={esObligatorio('nombre_comercial')}
//                       className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
//                       style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-3 justify-end pt-4 border-t">
//                 <button
//                   type="button"
//                   onClick={limpiarFormulario}
//                   className="px-6 py-3 rounded-xl font-bold border-2 hover:bg-gray-50 transition"
//                   style={{ borderColor: '#00162f', color: '#00162f' }}
//                 >
//                   Cancelar
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={guardando}
//                   className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition disabled:opacity-50"
//                   style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
//                 >
//                   {guardando ? (
//                     <>
//                       <Loader2 size={20} className="animate-spin" />
//                       Guardando...
//                     </>
//                   ) : (
//                     <>
//                       <Save size={20} />
//                       {productoEditando ? 'Actualizar' : 'Crear Producto'}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr style={{ backgroundColor: '#00162f' }}>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Imagen</th>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Código</th>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Nombre</th>
//                   <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase">Stock</th>
//                   <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase">Precio</th>
//                   <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase">Precio Ant.</th>
//                   <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase">Acciones</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {productos.map((producto, index) => (
//                   <tr 
//                     key={producto.id}
//                     className={`border-b hover:bg-gray-50 transition ${
//                       index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                     }`}
//                   >
//                     <td className="px-4 py-3">
//                       <img
//                         src={getPrimeraImagen(producto.imagen_url)}
//                         alt={producto.nombre}
//                         className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
//                         onError={(e) => {
//                           e.target.src = '/bodega-img.jpg';
//                         }}
//                       />
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="text-xs font-mono text-gray-600">
//                         {producto.codigo}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="max-w-xs">
//                         <p className="font-bold text-sm line-clamp-2" style={{ color: '#00162f' }}>
//                           {producto.nombre}
//                         </p>
//                         {producto.linea && (
//                           <span className="text-xs text-gray-500">
//                             {producto.linea}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
//                         producto.stock === 0 ? 'bg-red-100 text-red-700' :
//                         producto.stock <= 10 ? 'bg-yellow-100 text-yellow-700' :
//                         'bg-green-100 text-green-700'
//                       }`}>
//                         <Package size={14} />
//                         {producto.stock}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <span className="font-bold" style={{ color: '#00162f' }}>
//                         ${Number(producto.precio).toFixed(2)}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       {producto.precio_anterior ? (
//                         <span className="text-sm text-gray-400 line-through">
//                           ${Number(producto.precio_anterior).toFixed(2)}
//                         </span>
//                       ) : (
//                         <span className="text-xs text-gray-400">-</span>
//                       )}
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center justify-center gap-2">
//                         <button
//                           onClick={() => handleEditar(producto)}
//                           className="p-2 hover:bg-blue-100 rounded-lg transition group"
//                           title="Editar"
//                         >
//                           <Edit2 size={18} className="text-blue-600 group-hover:scale-110 transition" />
//                         </button>
//                         <button
//                           onClick={() => handleEliminar(producto.id)}
//                           disabled={eliminando === producto.id}
//                           className="p-2 hover:bg-red-100 rounded-lg transition group disabled:opacity-50"
//                           title="Eliminar"
//                         >
//                           {eliminando === producto.id ? (
//                             <Loader2 size={18} className="text-red-600 animate-spin" />
//                           ) : (
//                             <Trash2 size={18} className="text-red-600 group-hover:scale-110 transition" />
//                           )}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {productos.length === 0 && (
//             <div className="text-center py-12">
//               <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
//               <p className="text-gray-600 font-semibold">No hay productos aún</p>
//               <button
//                 onClick={() => {
//                   limpiarFormulario();
//                   setModoEdicion(true);
//                 }}
//                 className="mt-4 px-6 py-2 rounded-xl font-bold"
//                 style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
//               >
//                 Crear Primer Producto
//               </button>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }



// app/crud-productos/page.jsx
'use client';
import { useState, useEffect, useMemo } from 'react';
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
  
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(null);

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
    nombre_comercial: ''
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
    // Para otras líneas (Pegamentos, Azulejos) solo básicos + código
    return ['codigo', ...basicos];
  };

  const camposObligatorios = getCamposObligatorios();
  const esObligatorio = (campo) => camposObligatorios.includes(campo);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Cuando cambia la línea, preestablecer categoría y ajustar placeholders/opciones
  useEffect(() => {
    if (formData.linea) {
      // Para todas las líneas cerámicas, categoría = "pisos"
      if (['Pisos', 'Azulejos', 'Decorados', 'Pegamentos', 'Junteador'].includes(formData.linea)) {
        setFormData(prev => ({ ...prev, categoria: 'pisos' }));
      }
      // Resetear campos que podrían ser selects para evitar valores previos
      if (formData.linea !== 'Junteador') {
        // Si no es Junteador, el formato vuelve a ser texto normal
        // No reseteamos para no perder datos, pero podríamos hacerlo si se desea
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
      nombre_comercial: ''
    });
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
      nombre_comercial: producto.nombre_comercial || ''
    });
    setModoEdicion(true);
    setProductoEditando(producto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validarFormulario = () => {
    const faltantes = camposObligatorios.filter(campo => {
      const valor = formData[campo];
      return valor === undefined || valor === null || valor === '';
    });
    if (faltantes.length > 0) {
      toast.error(`Campos obligatorios: ${faltantes.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const datosAEnviar = { ...formData };
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
      const res = await fetch(`/api/admin/productos/eliminar?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Error al eliminar');

      toast.success('Producto eliminado');
      await fetchProductos();
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

  // Renderizado del skeleton (reemplaza al loader anterior)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-8">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Título skeleton con estilo corporativo */}
          <div className="flex items-center justify-center gap-3 m-auto text-center mb-8">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 tracking-tight">
              GESTIÓN DE PRODUCTOS
            </h1>
            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 animate-bounce-short">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
            </div>
          </div>

          {/* Input de búsqueda skeleton */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
              <div className="w-full h-10 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Tabla skeleton (3 filas) */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black mb-1" style={{ color: '#00162f' }}>
              Gestión de Productos
            </h1>
            <p className="text-sm text-gray-600">
              {filteredProductos.length} producto{filteredProductos.length !== 1 ? 's' : ''} en total
              {searchTerm && ` (filtrados de ${productos.length})`}
            </p>
          </div>
          
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
        </div>

        {/* Input de búsqueda con estilo corporativo */}
        {!modoEdicion && (
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
        )}

        {modoEdicion && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2" style={{ borderColor: '#fbbf24' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black" style={{ color: '#00162f' }}>
                {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button
                onClick={limpiarFormulario}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} style={{ color: '#00162f' }} />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="space-y-6">
              {/* DATOS BÁSICOS */}
              <div>
                <h3 className="text-lg font-bold mb-4" style={{ color: '#00162f' }}>
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Código */}
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Código <span className="text-red-500">*</span>
                    </label>
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
                    <label className="block text-sm font-bold mb-2">
                      Nombre {esObligatorio('nombre') && <span className="text-red-500">*</span>}
                    </label>
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
                    <label className="block text-sm font-bold mb-2">
                      Línea {esObligatorio('linea') && <span className="text-red-500">*</span>}
                    </label>
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2">
                      Descripción {esObligatorio('descripcion') && <span className="text-red-500">*</span>}
                    </label>
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
                    <label className="block text-sm font-bold mb-2">
                      Precio {esObligatorio('precio') && <span className="text-red-500">*</span>}
                    </label>
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
                    <label className="block text-sm font-bold mb-2">
                      Precio Anterior {esObligatorio('precio_anterior') && <span className="text-red-500">*</span>}
                    </label>
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
                    <label className="block text-sm font-bold mb-2">
                      Stock {esObligatorio('stock') && <span className="text-red-500">*</span>}
                    </label>
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
                    <label className="block text-sm font-bold mb-2">
                      Categoría {esObligatorio('categoria') && <span className="text-red-500">*</span>}
                    </label>
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2">
                      URLs de Imágenes (separadas por comas) {esObligatorio('imagen_url') && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      name="imagen_url"
                      value={formData.imagen_url}
                      onChange={handleChange}
                      rows={2}
                      placeholder="https://imagen1.jpg, https://imagen2.jpg"
                      required={esObligatorio('imagen_url')}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                      style={{ borderColor: '#00162f20', '--tw-ring-color': '#fbbf24' }}
                    />
                  </div>
                </div>
              </div>

              {/* ESPECIFICACIONES TÉCNICAS - Dinámicas según línea */}
              <div>
                <h3 className="text-lg font-bold mb-4" style={{ color: '#00162f' }}>
                  Especificaciones Técnicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Colección */}
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Colección {esObligatorio('coleccion') && <span className="text-red-500">*</span>}
                    </label>
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

                  {/* Formato (con placeholder dinámico) */}
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Formato {esObligatorio('formato') && <span className="text-red-500">*</span>}
                    </label>
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

                  {/* Acabado (select según línea) */}
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Acabado {esObligatorio('acabado') && <span className="text-red-500">*</span>}
                    </label>
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
  <label className="block text-sm font-bold mb-2">
    PEI {esObligatorio('pei') && <span className="text-red-500">*</span>}
  </label>
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

                  {/* Cuerpo (select para Pisos) */}
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Cuerpo {esObligatorio('cuerpo') && <span className="text-red-500">*</span>}
                    </label>
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
                    <label className="block text-sm font-bold mb-2">
                      m² por Caja {esObligatorio('m2_por_caja') && <span className="text-red-500">*</span>}
                    </label>
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
                    <label className="block text-sm font-bold mb-2">
                      Nombre Comercial {esObligatorio('nombre_comercial') && <span className="text-red-500">*</span>}
                    </label>
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
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="px-6 py-3 rounded-xl font-bold border-2 hover:bg-gray-50 transition"
                  style={{ borderColor: '#00162f', color: '#00162f' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition disabled:opacity-50"
                  style={{ backgroundColor: '#fbbf24', color: '#00162f' }}
                >
                  {guardando ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Guardando...
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

        {/* Tabla de productos (ahora usa filteredProductos) */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#00162f' }}>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Imagen</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Código</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Nombre</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase">Stock</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase">Precio</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase">Precio Ant.</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((producto, index) => (
                  <tr 
                    key={producto.id}
                    className={`border-b hover:bg-gray-50 transition ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <img
                        src={getPrimeraImagen(producto.imagen_url)}
                        alt={producto.nombre}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          e.target.src = '/bodega-img.jpg';
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-gray-600">
                        {producto.codigo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs">
                        <p className="font-bold text-sm line-clamp-2" style={{ color: '#00162f' }}>
                          {producto.nombre}
                        </p>
                        {producto.linea && (
                          <span className="text-xs text-gray-500">
                            {producto.linea}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        producto.stock === 0 ? 'bg-red-100 text-red-700' :
                        producto.stock <= 10 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        <Package size={14} />
                        {producto.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold" style={{ color: '#00162f' }}>
                        ${Number(producto.precio).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {producto.precio_anterior ? (
                        <span className="text-sm text-gray-400 line-through">
                          ${Number(producto.precio_anterior).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditar(producto)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition group"
                          title="Editar"
                        >
                          <Edit2 size={18} className="text-blue-600 group-hover:scale-110 transition" />
                        </button>
                        <button
                          onClick={() => handleEliminar(producto.id)}
                          disabled={eliminando === producto.id}
                          className="p-2 hover:bg-red-100 rounded-lg transition group disabled:opacity-50"
                          title="Eliminar"
                        >
                          {eliminando === producto.id ? (
                            <Loader2 size={18} className="text-red-600 animate-spin" />
                          ) : (
                            <Trash2 size={18} className="text-red-600 group-hover:scale-110 transition" />
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
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="mt-4 px-6 py-2 rounded-xl font-bold"
                  style={{ backgroundColor: '#00162f', color: 'white' }}
                >
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
    </div>
  );
}