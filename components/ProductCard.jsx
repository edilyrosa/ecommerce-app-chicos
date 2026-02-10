
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
export default function ProductCard({producto}) {
    const [user, setUser] = useState() //TODO; const {user, logout} = UseAuth()
    const router = useRouter()
   const handleCompra = () => {
        if  (!user) {
            window.alert(`debes login!`)
            router.push('/login')
        }
        
        window.alert(`Compra realizada con exito!`)

    }
    return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition'>
        
        <img 
        src={producto.imagen_url}
        alt={producto.nombre}
        className='w-full h-48 object-contain bg-gray-100'
        />
        
        <div className='p-4'>
            <h2 className='text-lg font-semibold text-gray-800 mb-2'>{producto.nombre}</h2>
            <p className='text-gray-600 mb-4 text-xs'>{producto.descripcion}</p>
            <div className='flex items-center justify-between'>
                <span className='text-xl font-bold text-blue-600'>${producto.precio.toFixed(2)}</span>
                <button 
                onClick={handleCompra}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'>
                    Comprar
                </button>
            </div>
        </div>
        
    </div>
    )
}
