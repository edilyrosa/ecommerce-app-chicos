'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);  //& Estado para el contador de items del carrito
  const router = useRouter();

  //& Función para actualizar el contador de items del carrito
  const updateCartCount = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token) {
      setCartCount(0); //Sin token, no hay usuario con carrito.
      return;
    }
    try {
      const res = await fetch('/api/carrito', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        //Ternadio: reduce() → Reducir un array a un valor →  Σ(it.cantidad)
                const totalUnits = Array.isArray(data) ? data.reduce((s, it) => s + (it.cantidad || 0), 0) : 0;
        setCartCount(totalUnits);
      }
    } catch (error) {
      console.error('Error al sincronizar cartCount:', error);
    }
  }, []);

  // Verifica si hay una sesión activa al cargar la app
  const checkAuth = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const res = await fetch('/api/auth/verify', { 
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          await updateCartCount(); // Sincroniza carrito al verificar usuario
        } else {
          Cookies.remove('token');
        }
      } catch (error) {
        Cookies.remove('token');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, [updateCartCount]); //& Recarga cada vez que cambia el contador del carrito, para mantenerlo sincronizado


  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        const data = await res.json();
        Cookies.set('token', data.token, { expires: 7 });
        setUser(data.user);
        await updateCartCount(); // Sincroniza carrito justo después de loguear
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
        Cookies.set('token', data.token, { expires: 7 });
        setUser(data.user);
        await updateCartCount();
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, error: error.error || 'Error al registrarse' };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setCartCount(0);
    router.push('/');
  };

 
  return (
    <AuthContext.Provider value={{ 
      user, 
      login,      
      register,   
      logout, 
      loading, 
      cartCount,  //& Header necesita este estado para mostrar el contador de items en el carrito
      setCartCount, 
      updateCartCount  //& ProductCard neceista esta funcion para mantener el contador sincronizado después de acciones que modifiquen el carrito
    }}>
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