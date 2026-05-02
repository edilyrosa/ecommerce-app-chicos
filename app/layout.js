// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Footer from "@/components/Footer";
// import { AuthProvider } from "@/context/authContext";
// import {Toaster} from "react-hot-toast";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Bodega de Azulejos",
//   description: "Tienda online de azulejos y materiales para construcción",
  
//   //TODO:EXTRAS PARA SEO Y REDES SOCIALES👇
//   keywords: "azulejos, materiales de construcción, ecommerce, tienda online, compra fácil",
//   // 🌐 OPEN GRAPH (Facebook, WhatsApp)
//   openGraph: {
//     title: "Bodega de Azulejos",
//     description: "Compra online fácil y rápido",
//     url: "https://tu-dominio.com",
//     siteName: "Tienda online de azulejos y materiales para construcción",
//     images: [
//       {
//         url: "/og-image.jpg",  // 1200x630px
//         width: 1200,
//         height: 630,
//         alt: "Bodega de Azulejos"
//       }
//     ],
//     locale: "es_VE",
//     type: "website"
//   },
  
//   // 🐦 X/TWITTER (Twitter Cards)
//   twitter: {
//     card: "summary_large_image",
//     title: "Bodega de Azulejos",
//     description: "Tienda online de azulejos y materiales para construcción",
//     images: ["/twitter-image.jpg"],  // 1200x675px
//     creator: "@tuusuario"
//   },
  
//   // 🔗 ROBOTS (SEO)
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       'max-video-preview': -1,
//       'max-image-preview': 'large',
//       'max-snippet': -1
//     }
//   },
  
//   // 🔗 ICONOS (Favicon)
//   // icons: {
//   //   icon: "/favicon.ico",
//   //   shortcut: "/favicon-16x16.png",
//   //   apple: "/apple-touch-icon.png"
//   // },
  
//   // 📧 EMAIL (Outlook, Apple Mail)
//   verification: {
//     google: "tu-google-verification-code",
//     yandex: "tu-yandex-code"
//   }
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning
//       >

//         <AuthProvider>
  
//       <Toaster position='top-left' />

//             {children}
        
//         </AuthProvider>


//         <Footer/>
//       </body>
//     </html>
//   );
// }

// app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/authContext";
import { Toaster } from "react-hot-toast";
import { MessageCircle } from "lucide-react"; // ← ícono de WhatsApp

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bodega de Azulejos",
  description: "Tienda online de azulejos y materiales para construcción",
  keywords: "azulejos, materiales de construcción, ecommerce, tienda online, compra fácil",
  openGraph: {
    title: "Bodega de Azulejos",
    description: "Compra online fácil y rápido",
    url: "https://tu-dominio.com",
    siteName: "Tienda online de azulejos y materiales para construcción",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Bodega de Azulejos" }],
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bodega de Azulejos",
    description: "Tienda online de azulejos y materiales para construcción",
    images: ["/twitter-image.jpg"],
    creator: "@tuusuario",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: { google: "tu-google-verification-code", yandex: "tu-yandex-code" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <Toaster position="top-left" />
          {children}
        </AuthProvider>
        <Footer />

        {/* //*BOTÓN FLOTANTE DE WHATSAPP - aparece en todas las páginas */}
       <a
        href="https://wa.me/523121907380?text=Hola%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20c%C3%B3mo%20comprar%20productos%20en%20la%20tienda%20online"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-8 right-4 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none"
        aria-label="Chat por WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
      </body>
    </html>
  );
}
