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
                    className={` text-gray-900 placeholder-gray-500 w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
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
                className={`text-gray-900 placeholder-gray-500 w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
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
                className={`text-gray-900 placeholder-gray-500 w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
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