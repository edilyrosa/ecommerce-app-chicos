import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";

function Pisos() {
   return ( 
               <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
                 {/* Header con props de búsqueda y categoría */}
               <Header/>
               
                 {/* Banner promocional */}
               <div className="container mx-auto px-3 md:px-6">
                   <div className="mt-3 md:mt-4 mb-4 md:mb-6">
                   <PromoBanner />
                   </div>
               </div>
           
               <main className="container mx-auto px-3 md:px-6">
                   <h2>PISOS</h2>
               </main>
           </div>
       
               
   
       );
}

export default Pisos;