'use client'
import { useState } from "react"
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';

export default function Login(){
    const {login, register} = useAuth()
    const router = useRouter();
    
    const [loading, setLoading] = useState(false)
    const [isLogin, setIsLogin] = useState(true)

    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')



    return(
        <div>
            <form>
                <input>nombre</input>
                
                <input>email</input>
                <input>password</input>
            </form>
        </div>
    )
}