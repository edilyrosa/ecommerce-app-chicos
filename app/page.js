// import Image from "next/image";
"use client"
import { useState, useEffect } from "react";
import Header from "@/components/Header"
// import ProductCard from '../components/ProductCard' //TODO
import toast from "react-hot-toast";
import ProductCard from "@/components/ProductCard";


export default function Home() {
  const [productos, setProductos] = useState([]) //Esto es un estado
  const [filteredProductos, setFilteredProductos] = useState([]) 
  const [loading, setLoading] = useState(true) 
  const [searchTerm, setSearchTerm] = useState('') 

  const fetchProductos = async () => {
    try {
      const res = await fetch("api/productos")
      if(res.ok){
        const data = await res.json()
        setProductos(data)
        setFilteredProductos(data)
        console.log("la data de productos", data)
      } else toast.error('Error al cargar los productos')
      
    } catch (error) {
      toast.error('Error de conexion')
    } finally{
      setLoading(false)
    }
  }

  //de carga de productos.
  useEffect(()=>{
    fetchProductos()
  }, []) //Se ejecuta: solo cuando se monta el componente.


  useEffect(()=>{
    //* filtarme el array que trae todos los productos de la bbdd
    const filtered = productos.filter( p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) )
    setFilteredProductos(filtered)
  }
  ,[searchTerm, productos])


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      />

      <main>
        <h1 className="text-3xl font-bold mb-8 text-gray-700">Nuestros Productos</h1>

        {
          loading 
          
          ? 
          (
            <div className="text-center py-12">
              <p>Cargando productos...</p>
            </div>

          )
          
          : filteredProductos.length === 0
          ? (
            <div className="text-center py-12">
              <p>No productos que mostrar...</p>
            </div>
          )

          :
          (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {

              filteredProductos.map( producto => 
              // <p key={producto.id}>{producto.nombre}</p>)
              <ProductCard 
                key={producto.id} 
                producto={producto} 
              />)
              
              }

            </div>
          )
        }

      </main>

    </div>
    );
}
