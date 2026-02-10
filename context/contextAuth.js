

import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

AuthContext = createContext()
export default function AuthProvider ({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter
    
    const checkAuth = async () =>{
        
        const token = Cookies.get('token')
        if(token){
            try {
                const res = await fetch(
                    'api/auth/verify',
                    {headers:{'Authorization':`Bearer ${token}`}}
                )
                if(res.ok){
                    const data = await res.json()
                    setUser(data.user)

                }else {
                    Cookies.remove('token')
                }

            } catch (error) {

                console.log('Error vefificando auth', error)
                Cookies.remove('token')
                
            }
        
            setLoading(false)
        }

    }

    useEffect(()=>{
        (
            async () =>{
                checkAuth()
            }
        )
    }, [])

// const { headers } = require("next/headers");
// fetch(URL, 
//     {method:
//     headers:{
//         contenTY:
//         'authorization': "Bearer lijd98yu232jeopjc2ehfv230cv3q4hvc0j".split(' ')
//     }
//     body:{}
//     }
// )



   // return {checkAuth, login, register, logout, user}
}
