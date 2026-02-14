'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; //*para guardar el token
import { useRouter } from 'next/navigation';

const AuthContext = createContext(); //para: return <AuthContext.Provider y useContext(AuthContext)

export function AuthProvider({ children }) { //  <AuthProvider> tag en el layout
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //? Quien sesiona (usuario) tiene cookie de token valida? para capturar la info y settear VE User
  const checkAuth = async () => {
    const token = Cookies.get('token'); //*para guardar el token
    if (token) {
      try {
        const res = await fetch(
          '/api/auth/verify',  //todo: Crearemos back que responda a este get-endpoint → devuelve al usuario guardado en el token.
          { headers: { 'Authorization': `Bearer ${token}`}} //& Este get requiere de autorizacion (cabeceras). 
        );
        if (res.ok) {
          const data = await res.json(); //la respuesta es el usuario, guardado en el obj "user"
          setUser(data.user);   //? Aca seteamos al usuario guradado en cookie
        } else {
          Cookies.remove('token');
        }
      } catch (error) {
        console.error('Error verificando auth:', error);
        Cookies.remove('token');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, []);//al cargase mira si el usuario tiene cookie de token y si es valida


  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {  //*No tengo que hacer vificaciones
        method: 'POST',                             //*tengo que postear y obtener TOKEN.
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        const data = await res.json();
        Cookies.set('token', data.token, { expires: 7 }); //*para guardar el token
        setUser(data.user);
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, error: error.error || 'Error al iniciar sesión' };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const register = async (nombre, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
        
      });
      
      if (res.ok) {
        const data = await res.json();
        Cookies.set('token', data.token, { expires: 7 }); //*para guardar el token
        setUser(data.user);
        console.log(data.user);
        
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, error: error.error || 'Error al registrarse' };
      }
    } catch (error) {
      console.log('ERRORRRRRR', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};