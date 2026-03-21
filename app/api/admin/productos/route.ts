// // app/api/admin/productos/route.js
// import { NextResponse } from 'next/server';
// import { verificarAdmin } from '@/lib/adminAuth';
// import { supabase } from '@/lib/supabase';

// export async function GET(request) {
//   const adminCheck = await verificarAdmin(request);
//   if (!adminCheck.authorized) {
//     return adminCheck.response;
//   }

//   try {
//     const { data: productos, error } = await supabase
//       .from('products')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (error) throw error;

//     return NextResponse.json(productos);
//   } catch (error) {
//     console.error('Error al obtener productos:', error);
//     return NextResponse.json(
//       { error: 'Error al obtener productos' },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from 'next/server';
import { verificarAdmin } from '@/lib/adminAuth';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) {
    return adminCheck.response;
  }

  try {
    const { data: productos, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}