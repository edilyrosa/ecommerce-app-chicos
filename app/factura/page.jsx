// // app/factura/page.jsx
// 'use client';

// import dynamic from 'next/dynamic';

// // Importar el componente de factura sin SSR (solo cliente)
// const FacturaContent = dynamic(
//   () => import('../components/FacturaContent'),
//   { 
//     ssr: false,
//     loading: () => (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400" />
//       </div>
//     )
//   }
// );

// export default function FacturaPage() {
//   return <FacturaContent />;
// }

// app/factura/page.jsx
'use client';

import FacturaContent from '../../components/FacturaContent';

export default function FacturaPage() {
  return <FacturaContent />;
}