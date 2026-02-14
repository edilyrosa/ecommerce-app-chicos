
//TODO: 'use client';
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

AuthContext = createContext()
export function AuthProvider ({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter() // //TODO: agrege los () al hook
    
    //*Aca se setea la var de edo el usuario, para por ejemplo:
    //  en Header.jsx → <span>Hola, {user.nombre}</span>
    //  en carrito/page.jsx →  if (!user) router.push('/login') expulsarlo de la vista. 
    const checkAuth = async () =>{
        
        // aca la obtenemos la cookie del navegador (para la verificacion a la carga de la app), pero cuando hagamos login o register la establecemos con Cookies.set()
        const token = Cookies.get('token') 
        if(token){
            try {
                const res = await fetch(
                    'api/auth/verify',  //Le pasamos al back el token por la cabecera, lo verifica y lo retorna al cliente (retorna la info del usuario verificado).
                    {headers:{'Authorization':`Bearer ${token}`}}
                )
                if(res.ok){ //*si tenemos respuesta 200 del back
                    const data = await res.json()
                    setUser(data.user) //seteamos la var de edo con la info del usuario verificado.

                }else { //!si tenemos respuesta =! 200 del back
                    Cookies.remove('token')
                }

            } catch (error) { //!error en el fetch

                console.log('Error vefificando auth', error)
                Cookies.remove('token')
                
            }
        
            setLoading(false)//ya no hay nada asincrono que esperar.
        }

    }

    //*al cargase mira si el usuario tiene cookie de token y si es valida
    useEffect(()=>{
        (
            async () =>{
                checkAuth()
            }
        )
    }, [])

    //*Hace el fetch-POST del usario en la BBDD, la respuesta del insert setea la var de edo el usuario.
    // este es llamado por app/login/page para postear los datos del form
     // Cookies.set() del token
    const register = async (nombre, email, password) => {

        try {
            const res = await fetch('api/auth/register', {
                method:'POST',
                headers: {'Content-Type':'application/json'},
                body:JSON.stringify({nombre, email, password})
            })

            if(res.ok){
                const data = await res.json()
                //*aca creamos la cookie
                Cookies.set('token', data.token, {expires:7}) //*⭐
                setUser(data.user) //Esto es un Obj           //*⭐
                return {success:true} 
            }else{
                const error  = await res.json()
                return {success:false, error:error.error || 'Error al Registrarte'}
            }

        } catch (error) {
            return {success:false, error:error.error || 'Error al conexion'}
        }

    }

    //*Hace el fetch-POST (realmente GET) del usario en la BBDD, la res para setea la var de edo el usuario.
    // este es llamado por app/login/page para postear los datos del form
    // Cookies.set() del token
    const login = async (email, password) => {
        try {
            
            const res = await fetch('api/auth/login', {
                method:'POST',
                headers: {'Content-Type':'application/json'},
                body:JSON.stringify({email, password})
            })

            if(res.ok){
                const data = await res.json()
                //*aca creamos la cookie
                Cookies.set('token', data.token, {expires:7}) //*⭐
                setUser(data.user) //Esto es un Obj           //*⭐
                return {success:true} 
            }else{
                const error  = await res.json()
                return {success:false, error:error.error || 'Error al iniciar sesion'}
            }

        } catch (error) {
            return {success:false, error:error.error || 'Error al conexion'}
        }
    }
    
    //*se ejecutara cuando usuario haga clic en el boton de cerrar sesion en Header.jsx → onClick={logout}
    //Removera la Cookie 'token', entonces luego debera hacer login para crear la Cookie 'token'.
    const logout = () => {
        Cookies.remove('token')
        setUser(null)
        router.push('/')
    }
    


    return (
    <AuthProvider.Provider value={{checkAuth, login, register, logout, user}} >
        {children}
    </AuthProvider.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthProvider)
    if(!context){
        throw new Error('UseAuth debe usarse dentro del AuthProvider')
    }
    return context
}

//? Estariamos exportando:
// 1. una funcion (tag proveedor)
// 2. constante que es el contexto, para ser usado por el componente que lo necesite. 