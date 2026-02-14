import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/authContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-commerce App 🛒 CESAR",
  description: "A simple e-commerce application built with Next.js",
  
  //TODO:EXTRAS PARA SEO Y REDES SOCIALES👇
  keywords: "comprar, productos, carrito, nextjs, ecommerce, venezuela",
  // 🌐 OPEN GRAPH (Facebook, WhatsApp)
  openGraph: {
    title: "E-commerce App 🛒",
    description: "La mejor tienda online con Next.js y Supabase",
    url: "https://tu-dominio.com",
    siteName: "E-commerce App",
    images: [
      {
        url: "/og-image.jpg",  // 1200x630px
        width: 1200,
        height: 630,
        alt: "E-commerce App"
      }
    ],
    locale: "es_VE",
    type: "website"
  },
  
  // 🐦 X/TWITTER (Twitter Cards)
  twitter: {
    card: "summary_large_image",
    title: "E-commerce App 🛒",
    description: "Compra online fácil y rápido",
    images: ["/twitter-image.jpg"],  // 1200x675px
    creator: "@tuusuario"
  },
  
  // 🔗 ROBOTS (SEO)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  
  // 🔗 ICONOS (Favicon)
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon-16x16.png",
  //   apple: "/apple-touch-icon.png"
  // },
  
  // 📧 EMAIL (Outlook, Apple Mail)
  verification: {
    google: "tu-google-verification-code",
    yandex: "tu-yandex-code"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning
      >

        <AuthProvider>
      
            {children}
        
        </AuthProvider>


        <Footer/>
      </body>
    </html>
  );
}


