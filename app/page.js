// import Image from "next/image";
"use client"
import { useState, useEffect } from "react";
// import Header from '../components/Header' //TODO
// import ProductCard from '../components/ProductCard' //TODO
import toast from "react-hot-toast";

export default function Home() {
 const [productos, setProductos] = useState([]) //Esto es un estado
 const [filteredProductos, setFilteredProductos] = useState([]) 
 const [loading, setLoading] = useState(true) 
 const [searchTerm, setSearchTerm] = useState('') 

 const fetchProductos = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/productos")
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

useEffect(()=>{
  fetchProductos()
}, [])
  
return (
    <h1>home</h1>
  );
}
