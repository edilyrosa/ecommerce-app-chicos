'use client';
import { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import toast from 'react-hot-toast';
import PromoBanner from "@/components/PromoBanner"

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); //* Es setteada en el botton toggle registro/login
  const [loading, setLoading] = useState(false);

  //TODO: deberia crear un obj
  const [nombre, setNombre] = useState(''); //*Esta vsita servira tamb para el regustro.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  
  const { login, register } = useAuth(); //*Vamos a usar esta vista para ambas acciones.
  const router = useRouter();

  const handleSubmit = async (e) => { //& <form onSubmit={handleSubmit} className="space-y-4">
    e.preventDefault();
    setLoading(true); //*Haremos una accion asincrona.

    if (isLogin) { //*TRUE: hacemos login
      //TODO: validar que esto venga email, password
      const result = await login(email, password);
      if (result.success) {
        toast.success('¡Bienvenido!');
        router.push('/');
      } else {
        toast.error(result.error);
      }
    } else {//*FALSE: hacemos register
      if (!nombre.trim()) {//*validacion
        toast.error('El nombre es requerido');
        setLoading(false);
        return;
      }
      const result = await register(nombre, email, password);
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
          {/* Banner promocional */}
        <div className="mt-3 md:mt-4 mb-4 md:mb-6">
          <PromoBanner />
        </div>
      
      
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && ( //*Si es FALSE - REGISTER, necesitamos el NOMBRE
              <div>
                <label className="block text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
            </button>
          </form>

          <div className="mt-6 text-center">
          {/*//* Boton que cambia el form para: registramos o logeamos */}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>

        </div>
        
      </main>
    </div>
  );
  
}