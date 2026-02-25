// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
// };

// export default nextConfig;


// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Turbopack
  turbopack: {
    resolveAlias: {
      // Ignorar módulos que causan problemas
      tailwindcss: false,
      canvas: false,
      fs: false,
      path: false,
      jsdom: false,
    },
  },
  // Si necesitas mantener webpack para algunas funcionalidades
  webpack: (config, { isServer }) => {
    // Solo configuraciones específicas que no se pueden migrar a Turbopack
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      canvas: false,
      jsdom: false,
    };
    return config;
  },
  // Optimizaciones para html2pdf
  transpilePackages: ['html2pdf.js'],
};

export default nextConfig;