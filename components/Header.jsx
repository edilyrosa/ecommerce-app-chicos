
'use client'
import React, { useState } from 'react'
import {ShoppingCart, User, LogOut, Search} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'; //TODO

export default function Header({searchTerm, setSearchTerm}) {
   const [user, setUser] = useState('Raul') //TODO; const {user, logout} = UseAuth()
//    const {user, logout} = UseAuth()
    const router = useRouter(); //TODO
    return (
    <header className='bg-blue-600 text-white shadow-lg'>
        <div className='container mx-auto px-4 py-4'>
            <div className='flex items-center justify-between mb-4'>
            <Link href={'/'}>
            <h1 className='text-2xl font-bold cursor-pointer hover:text-blue-200'>Mi E-Commerce</h1>
            </Link>

            <div className='flex items-center gap-4'>
                {
                    user
                    ?
                        (<>
                            <span>Hola, {user}</span>
                            <button
                            onClick={() => router.push('/carrito')} //TODO
                            className='flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded transition'
                            >
                                <ShoppingCart size={20}/>
                                <span>Carrito</span>
                            </button>

                            <button
                            onClick={() => router.push('/login')}
                            className='flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded transition'
                            >
                                <LogOut size={20}/>
                                <span>Salir</span>
                            </button>
                        </>)
                    :
                        (
                            <div className='flex gap-2'>
                                <Link href={'/'}>
                                    <button
                                    className='flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded transition'
                                    >
                                        <User size={20}/>
                                        <span>Ingresar</span>
                                    </button>
                                </Link>

                             
                            </div>
                        )
                }
            </div>
            </div>
        
        {setSearchTerm && 
                ( 
                    <div className=' flex gap-2'>
                        <Link href={'/'}>
                            <button
                            className='flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded transition'
                            >
                                    
                                <span>Inicio</span>
                            </button>
                        </Link>
                        <div className='flex-1 flex items-center bg-white rounded overflow-hidden'>
                            <Search className='ml-3 text-gray-300' size={20}/>
                            <input
                                type='text'
                                placeholder='Buscar productos...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='flex-1 px-3 py-2 text-gray-800 outline-none'
                            />
                                </div>
                            </div>
                )
            }
        </div>
    </header>
    )
}

