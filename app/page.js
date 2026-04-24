// app/page.jsx
"use client"
import { useState, useEffect } from "react";
import Header from "../components/Header";
import BannerSection from "../components/BannerSection";        // ← importación por defecto
import { BannerSkeleton } from "../components/BannerSection"; // ← importación nombrada
import BottomNav from "../components/BottomNav";
import PromoBanner from "../components/PromoBanner"; 
import SucursalesSection from "../components/SucursalesSection"; 
import toast from "react-hot-toast";

// Hook para detectar móvil (idéntico al de BannerSection)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function HomePage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  const fetchProductos = async () => {
    try {
      const res = await fetch("/api/productos");
      if (res.ok) {
        const data = await res.json();
        setProductos(data);
      } else {
        toast.error('Error al cargar los productos');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 pb-20">
        <Header />
        <main className="flex-1 container mx-auto px-2 md:px-4 py-5">
          <BannerSkeleton isMobile={isMobile} />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20 md:pb-8">
      <Header />
      <main className="container mx-auto px-4 md:px-4 py-4 md:py-6">
        {/* //* Solo banners de categorías */}
        <BannerSection productos={productos} tipo="categorias" />
        {/* //* Solo promociones */}
        <BannerSection productos={productos} tipo="promocion" />
        {/* //* Solo productos nuevos */}
        <BannerSection productos={productos} tipo="productos nuevos" />
        <SucursalesSection />
      </main>
      <BottomNav />
    </div>
  );
}