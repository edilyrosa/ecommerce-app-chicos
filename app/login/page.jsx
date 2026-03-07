// 'use client';
// import { useState } from 'react';
// import { useAuth } from '../../context/authContext';
// import { useRouter } from 'next/navigation';
// import Header from '../../components/Header';
// import toast from 'react-hot-toast';
// import PromoBanner from "@/components/PromoBanner"

// export default function Login() {
//   const [isLogin, setIsLogin] = useState(true); //* Es setteada en el botton toggle registro/login
//   const [loading, setLoading] = useState(false);

//   //TODO: deberia crear un obj
//   const [nombre, setNombre] = useState(''); //*Esta vsita servira tamb para el regustro.
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
  
  
//   const { login, register } = useAuth(); //*Vamos a usar esta vista para ambas acciones.
//   const router = useRouter();

//   const handleSubmit = async (e) => { //& <form onSubmit={handleSubmit} className="space-y-4">
//     e.preventDefault();
//     setLoading(true); //*Haremos una accion asincrona.

//     if (isLogin) { //*TRUE: hacemos login
//       //TODO: validar que esto venga email, password
//       const result = await login(email, password);
//       if (result.success) {
//         toast.success('¡Bienvenido!');
//         router.push('/');
//       } else {
//         toast.error(result.error);
//       }
//     } else {//*FALSE: hacemos register
//       if (!nombre.trim()) {//*validacion
//         toast.error('El nombre es requerido');
//         setLoading(false);
//         return;
//       }
//       const result = await register(nombre, email, password);
//       if (result.success) {
//         toast.success('¡Registro exitoso!');
//         router.push('/');
//       } else {
//         toast.error(result.error);
//       }
//     }
//     setLoading(false);
//   };
  
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Header />
//           {/* Banner promocional */}
//         <div className="mt-3 md:mt-4 mb-4 md:mb-6">
//           <PromoBanner />
//         </div>
      
      
//       <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
//         <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          
//           <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
//             {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
//           </h2>
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {!isLogin && ( //*Si es FALSE - REGISTER, necesitamos el NOMBRE
//               <div>
//                 <label className="block text-gray-700 mb-2">Nombre</label>
//                 <input
//                   type="text"
//                   value={nombre}
//                   onChange={(e) => setNombre(e.target.value)}
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
//                   required={!isLogin}
//                 />
//               </div>
//             )}
            
//             <div>
//               <label className="block text-gray-700 mb-2">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
//                 required
//               />
//             </div>
            
//             <div>
//               <label className="block text-gray-700 mb-2">Contraseña</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
//                 required
//                 minLength={6}
//               />
//             </div>
            
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
//             >
//               {loading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//           {/*//* Boton que cambia el form para: registramos o logeamos */}
//             <button
//               onClick={() => setIsLogin(!isLogin)}
//               className="text-blue-600 hover:underline"
//             >
//               {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
//             </button>
//           </div>

//         </div>
        
//       </main>
//     </div>
//   );
  
// }

// 'use client';
// import { useState } from 'react';
// import { useAuth } from '../../context/authContext';
// import { useRouter } from 'next/navigation';
// import Header from '../../components/Header';
// import toast from 'react-hot-toast';
// import PromoBanner from "@/components/PromoBanner";

// export default function Login() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);

//   // Estados para login
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   // Estados para registro
//   const [nombre, setNombre] = useState('');
//   const [rfc, setRfc] = useState('');
//   const [telefono, setTelefono] = useState('');
//   const [domicilio_fiscal, setDomicilioFiscal] = useState('');
//   const [ciudad, setCiudad] = useState('');
//   const [estado, setEstado] = useState('');
//   const [codigo_postal, setCodigoPostal] = useState('');
//   const [regimen_fiscal, setRegimenFiscal] = useState('616');

//   const { login, register } = useAuth();
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (isLogin) {
//       const result = await login(email, password);
//       if (result.success) {
//         toast.success('¡Bienvenido!');
//         router.push('/');
//       } else {
//         toast.error(result.error);
//       }
//     } else {
//       if (!nombre.trim()) {
//         toast.error('El nombre es requerido');
//         setLoading(false);
//         return;
//       }
//       const userData = {
//         nombre,
//         email,
//         password,
//         rfc: rfc || null,
//         telefono: telefono || null,
//         domicilio_fiscal: domicilio_fiscal || null,
//         ciudad: ciudad || null,
//         estado: estado || null,
//         codigo_postal: codigo_postal || null,
//         regimen_fiscal: regimen_fiscal || '616',
//       };
//       const result = await register(userData); // Asegúrate de que register acepte un objeto
//       if (result.success) {
//         toast.success('¡Registro exitoso!');
//         router.push('/');
//       } else {
//         toast.error(result.error);
//       }
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Header />
//       <div className="mt-3 md:mt-4 mb-4 md:mb-6">
//         <PromoBanner />
//       </div>

//       <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
//         <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
//           <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
//             {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {!isLogin && (
//               <>
//                 <div>
//                   <label className="block text-gray-700 mb-2">Nombre Completo *</label>
//                   <input
//                     type="text"
//                     value={nombre}
//                     onChange={(e) => setNombre(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
//                     required
//                   />
//                 </div>

//                 <div className="border-t-2 border-gray-200 my-4 pt-4">
//                   <p className="text-sm text-gray-500 mb-4">Datos fiscales (opcional)</p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 mb-2">RFC</label>
//                     <input
//                       type="text"
//                       value={rfc}
//                       onChange={(e) => setRfc(e.target.value)}
//                       maxLength={13}
//                       placeholder="XAXX010101000"
//                       className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-700 mb-2">Teléfono</label>
//                     <input
//                       type="tel"
//                       value={telefono}
//                       onChange={(e) => setTelefono(e.target.value)}
//                       placeholder="312-123-4567"
//                       className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 mb-2">Domicilio Fiscal</label>
//                   <input
//                     type="text"
//                     value={domicilio_fiscal}
//                     onChange={(e) => setDomicilioFiscal(e.target.value)}
//                     placeholder="Calle, número, colonia"
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-gray-700 mb-2">Ciudad</label>
//                     <input
//                       type="text"
//                       value={ciudad}
//                       onChange={(e) => setCiudad(e.target.value)}
//                       placeholder="Colima"
//                       className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-700 mb-2">Estado</label>
//                     <select
//                       value={estado}
//                       onChange={(e) => setEstado(e.target.value)}
//                       className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">Selecciona...</option>
//                       <option value="Colima">Colima</option>
//                       <option value="Jalisco">Jalisco</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-gray-700 mb-2">Código Postal</label>
//                     <input
//                       type="text"
//                       value={codigo_postal}
//                       onChange={(e) => setCodigoPostal(e.target.value)}
//                       maxLength={5}
//                       placeholder="28050"
//                       className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 mb-2">Régimen Fiscal</label>
//                   <select
//                     value={regimen_fiscal}
//                     onChange={(e) => setRegimenFiscal(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="616">616 - Sin obligaciones fiscales</option>
//                     <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
//                     <option value="605">605 - Sueldos y Salarios</option>
//                     <option value="606">606 - Arrendamiento</option>
//                   </select>
//                 </div>
//               </>
//             )}

//             <div>
//               <label className="block text-gray-700 mb-2">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 mb-2">Contraseña</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
//                 required
//                 minLength={6}
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
//             >
//               {loading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <button
//               onClick={() => {
//                 setIsLogin(!isLogin);
//                 // Opcional: limpiar campos al cambiar modo
//               }}
//               className="text-blue-600 hover:underline"
//             >
//               {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }






// 'use client';
// import { useState, useEffect } from 'react';
// import { useAuth } from '../../context/authContext';
// import { useRouter } from 'next/navigation';
// import Header from '../../components/Header';
// import toast from 'react-hot-toast';
// import PromoBanner from "@/components/PromoBanner";

// // Funciones de validación (definidas antes del componente)
// const validarEmail = (email) => {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return re.test(email);
// };

// const validarPassword = (password) => {
//   return password.length >= 6;
// };

// const validarNombre = (nombre) => {
//   return nombre.trim().length >= 3;
// };

// const validarCodigoPostal = (cp) => {
//   if (!cp) return true;
//   return /^\d{5}$/.test(cp);
// };

// const validarTelefono = (tel) => {
//   if (!tel) return true;
//   // Teléfono mexicano 10 dígitos, opcionalmente con guiones
//   const re = /^\d{10}$|^\d{3}-\d{3}-\d{4}$/;
//   return re.test(tel);
// };

// export default function Login() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);

//   // Estados para login
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   // Estados para registro
//   const [nombre, setNombre] = useState('');
//   const [rfc, setRfc] = useState('');
//   const [telefono, setTelefono] = useState('');
//   const [domicilio_fiscal, setDomicilioFiscal] = useState('');
//   const [ciudad, setCiudad] = useState('');
//   const [estado, setEstado] = useState('');
//   const [codigo_postal, setCodigoPostal] = useState('');
//   const [regimen_fiscal, setRegimenFiscal] = useState('616');

//   const { login, register } = useAuth();
//   const router = useRouter();

//   // Eliminar el efecto que limpia campos para evitar cascada de renders
//   // Limpiar campos al cambiar entre login y registro se hace en el handler del botón

//   // Validaciones en tiempo real
//   const emailValido = validarEmail(email);
//   const passwordValido = validarPassword(password);
//   const nombreValido = validarNombre(nombre);
//   const cpValido = validarCodigoPostal(codigo_postal);
//   const telefonoValido = validarTelefono(telefono);

//   // Determinar si el formulario puede enviarse (RFC ya no se valida)
//   const formularioValido = isLogin
//     ? emailValido && passwordValido
//     : nombreValido && emailValido && passwordValido && cpValido && telefonoValido;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formularioValido) {
//       toast.error('Corrige los errores antes de continuar');
//       return;
//     }
//     setLoading(true);

//     if (isLogin) {
//       const result = await login(email, password);
//       if (result.success) {
//         toast.success('¡Bienvenido!');
//         router.push('/');
//       } else {
//         toast.error(result.error);
//       }
//     } else {
//       const userData = {
//         nombre,
//         email,
//         password,
//         rfc: rfc || null,
//         telefono: telefono || null,
//         domicilio_fiscal: domicilio_fiscal || null,
//         ciudad: ciudad || null,
//         estado: estado || null,
//         codigo_postal: codigo_postal || null,
//         regimen_fiscal: regimen_fiscal || '616',
//       };
//       const result = await register(userData);
//       if (result.success) {
//         toast.success('¡Registro exitoso!');
//         router.push('/');
//       } else {
//         toast.error(result.error);
//       }
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Header />
//       <div className="mt-3 md:mt-4 mb-4 md:mb-6">
//         <PromoBanner />
//       </div>

//       <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
//         <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border" style={{ borderColor: '#00162f20' }}>
//           <h2 className="text-3xl font-black mb-6 text-center" style={{ color: '#00162f' }}>
//             {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {!isLogin && (
//               <>
//                 {/* Nombre Completo */}
//                 <div>
//                   <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
//                     Nombre Completo *
//                   </label>
//                   <input
//                     type="text"
//                     value={nombre}
//                     onChange={(e) => setNombre(e.target.value)}
//                     className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
//                       nombre && !nombreValido ? 'border-red-400' : nombreValido ? 'border-green-400' : 'border-gray-200'
//                     }`}
//                     style={{ '--tw-ring-color': '#fbbf24' }}
//                     required
//                     autoComplete="off"
//                   />
//                   {nombre && !nombreValido && (
//                     <span className="text-xs text-red-500 mt-1 block">
//                       Mínimo 3 caracteres
//                     </span>
//                   )}
//                 </div>

//                 <div className="border-t-2 my-4 pt-4" style={{ borderColor: '#00162f20' }}>
//                   <p className="text-sm text-gray-500 mb-4">Datos fiscales (opcional)</p>
//                 </div>

//                 {/* RFC y Teléfono */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
//                       RFC
//                     </label>
//                     <input
//                       type="text"
//                       value={rfc}
//                       onChange={(e) => setRfc(e.target.value.toUpperCase())}
//                       maxLength={13}
//                       placeholder="XAXX010101000"
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2"
//                       style={{ '--tw-ring-color': '#fbbf24' }}
//                       autoComplete="off"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
//                       Teléfono
//                     </label>
//                     <input
//                       type="tel"
//                       value={telefono}
//                       onChange={(e) => setTelefono(e.target.value)}
//                       placeholder="3121234567 o 312-123-4567"
//                       className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
//                         telefono && !telefonoValido ? 'border-red-400' : telefonoValido ? 'border-green-400' : 'border-gray-200'
//                       }`}
//                       style={{ '--tw-ring-color': '#fbbf24' }}
//                       autoComplete="off"
//                     />
//                     {telefono && !telefonoValido && (
//                       <span className="text-xs text-red-500 mt-1 block">
//                         10 dígitos, opcional guiones
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Domicilio Fiscal */}
//                 <div>
//                   <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
//                     Domicilio Fiscal
//                   </label>
//                   <input
//                     type="text"
//                     value={domicilio_fiscal}
//                     onChange={(e) => setDomicilioFiscal(e.target.value)}
//                     placeholder="Calle, número, colonia"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2"
//                     style={{ '--tw-ring-color': '#fbbf24' }}
//                     autoComplete="off"
//                   />
//                 </div>

//                 {/* Ciudad, Estado, Código Postal */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
//                       Ciudad
//                     </label>
//                     <input
//                       type="text"
//                       value={ciudad}
//                       onChange={(e) => setCiudad(e.target.value)}
//                       placeholder="Colima"
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2"
//                       style={{ '--tw-ring-color': '#fbbf24' }}
//                       autoComplete="off"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
//                       Estado
//                     </label>
//                     <select
//                       value={estado}
//                       onChange={(e) => setEstado(e.target.value)}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2"
//                       style={{ '--tw-ring-color': '#fbbf24' }}
//                       autoComplete="off"
//                     >
//                       <option value="">Selecciona...</option>
//                       <option value="Colima">Colima</option>
//                       <option value="Jalisco">Jalisco</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
//                       Código Postal
//                     </label>
//                     <input
//                       type="text"
//                       value={codigo_postal}
//                       onChange={(e) => setCodigoPostal(e.target.value)}
//                       maxLength={5}
//                       placeholder="28050"
//                       className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
//                         codigo_postal && !cpValido ? 'border-red-400' : cpValido ? 'border-green-400' : 'border-gray-200'
//                       }`}
//                       style={{ '--tw-ring-color': '#fbbf24' }}
//                       autoComplete="off"
//                     />
//                     {codigo_postal && !cpValido && (
//                       <span className="text-xs text-red-500 mt-1 block">
//                         5 dígitos numéricos
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Régimen Fiscal */}
//                 <div>
//                   <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
//                     Régimen Fiscal
//                   </label>
//                   <select
//                     value={regimen_fiscal}
//                     onChange={(e) => setRegimenFiscal(e.target.value)}
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2"
//                     style={{ '--tw-ring-color': '#fbbf24' }}
//                     autoComplete="off"
//                   >
//                     <option value="616">616 - Sin obligaciones fiscales</option>
//                     <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
//                     <option value="605">605 - Sueldos y Salarios</option>
//                     <option value="606">606 - Arrendamiento</option>
//                   </select>
//                 </div>
//               </>
//             )}

//             {/* Email (común) */}
//             <div>
//               <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
//                 Email *
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="ejemplo@gmail.com"
//                 className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
//                   email && !emailValido ? 'border-red-400' : emailValido ? 'border-green-400' : 'border-gray-200'
//                 }`}
//                 style={{ '--tw-ring-color': '#fbbf24' }}
//                 required
//                 autoComplete="off"
//               />
//               {email && !emailValido && (
//                 <span className="text-xs text-red-500 mt-1 block">
//                   Correo electrónico inválido
//                 </span>
//               )}
//             </div>

//             {/* Contraseña */}
//             <div>
//               <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
//                 Contraseña *
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
//                   password && !passwordValido ? 'border-red-400' : passwordValido ? 'border-green-400' : 'border-gray-200'
//                 }`}
//                 style={{ '--tw-ring-color': '#fbbf24' }}
//                 required
//                 minLength={6}
//                 autoComplete={isLogin ? "current-password" : "new-password"}
//               />
//               {password && !passwordValido && (
//                 <span className="text-xs text-red-500 mt-1 block">
//                   Mínimo 6 caracteres
//                 </span>
//               )}
//             </div>

//             {/* Botón de envío */}
//             <button
//               type="submit"
//               disabled={loading || !formularioValido}
//               className="w-full py-3 md:py-4 rounded-xl font-black text-lg transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{
//                 backgroundColor: formularioValido ? '#fbbf24' : '#e5e7eb',
//                 color: formularioValido ? '#00162f' : '#9ca3af',
//               }}
//             >
//               {loading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
//             </button>
//           </form>

//           {/* Toggle entre login y registro */}
//           <div className="mt-6 text-center">
//             <button
//               onClick={() => {
//                 setIsLogin((prev) => {
//                   const next = !prev;
//                   // Limpiar campos al cambiar entre login y registro
//                   setEmail('');
//                   setPassword('');
//                   setNombre('');
//                   setRfc('');
//                   setTelefono('');
//                   setDomicilioFiscal('');
//                   setCiudad('');
//                   setEstado('');
//                   setCodigoPostal('');
//                   setRegimenFiscal('616');
//                   return next;
//                 });
//               }}
//               className="font-bold hover:underline"
//               style={{ color: '#00162f' }}
//             >
//               {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }




'use client';
import { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import toast from 'react-hot-toast';
import PromoBanner from "@/components/PromoBanner";

// Funciones de validación
const validarEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validarPassword = (password) => {
  // Mínimo 8 caracteres, al menos una letra, un número y un carácter especial
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return re.test(password);
};

const validarNombre = (nombre) => {
  return nombre.trim().length >= 3;
};

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Estados para login y registro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');

  const { login, register } = useAuth();
  const router = useRouter();

  // Validaciones en tiempo real
  const emailValido = validarEmail(email);
  const passwordValido = validarPassword(password);
  const nombreValido = validarNombre(nombre);

  const formularioValido = isLogin
    ? emailValido && passwordValido
    : nombreValido && emailValido && passwordValido;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formularioValido) {
      toast.error('Corrige los errores antes de continuar');
      return;
    }
    setLoading(true);

    if (isLogin) {
      const result = await login(email, password);
      if (result.success) {
        toast.success('¡Bienvenido!');
        router.push('/');
      } else {
        toast.error(result.error);
      }
    } else {
      const userData = { nombre, email, password };
      const result = await register(userData);
      if (result.success) {
        toast.success('¡Registro exitoso!');
        router.push('/');
      } else {
        toast.error(result.error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="mt-3 md:mt-4 mb-4 md:mb-6">
        <PromoBanner />
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border" style={{ borderColor: '#00162f20' }}>
          <h2 className="text-3xl font-black mb-6 text-center" style={{ color: '#00162f' }}>
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                {/* Nombre Completo */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
                      nombre && !nombreValido ? 'border-red-400' : nombreValido ? 'border-green-400' : 'border-gray-200'
                    }`}
                    style={{ '--tw-ring-color': '#fbbf24' }}
                    required
                    autoComplete="off"
                  />
                  {nombre && !nombreValido && (
                    <span className="text-xs text-red-500 mt-1 block">
                      Mínimo 3 caracteres
                    </span>
                  )}
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@gmail.com"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
                  email && !emailValido ? 'border-red-400' : emailValido ? 'border-green-400' : 'border-gray-200'
                }`}
                style={{ '--tw-ring-color': '#fbbf24' }}
                required
                autoComplete="off"
              />
              {email && !emailValido && (
                <span className="text-xs text-red-500 mt-1 block">
                  Correo electrónico inválido
                </span>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#00162f' }}>
                Contraseña *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
                  password && !passwordValido ? 'border-red-400' : passwordValido ? 'border-green-400' : 'border-gray-200'
                }`}
                style={{ '--tw-ring-color': '#fbbf24' }}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              {password && !passwordValido && (
                <span className="text-xs text-red-500 mt-1 block">
                  La contraseña debe tener al menos 8 caracteres, incluir una letra, un número y un carácter especial (@$!%*#?&)
                </span>
              )}
              {!password && (
                <span className="text-xs text-gray-500 mt-1 block">
                  Mínimo 8 caracteres, con al menos una letra, un número y un carácter especial
                </span>
              )}
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading || !formularioValido}
              className="w-full py-3 md:py-4 rounded-xl font-black text-lg transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: formularioValido ? '#fbbf24' : '#e5e7eb',
                color: formularioValido ? '#00162f' : '#9ca3af',
              }}
            >
              {loading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
            </button>
          </form>

          {/* Toggle entre login y registro */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin((prev) => {
                  const next = !prev;
                  // Limpiar campos al cambiar entre login y registro
                  setEmail('');
                  setPassword('');
                  setNombre('');
                  return next;
                });
              }}
              className="font-bold hover:underline"
              style={{ color: '#00162f' }}
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}