// import { supabase } from '@/lib/supabase';
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     const { codes } = await request.json();
//     if (!codes || !Array.isArray(codes) || codes.length === 0) {
//       return NextResponse.json({ error: 'Se requiere un array de códigos de producto' }, { status: 400 });
//     }

//     const { data, error } = await supabase
//       .from('products')
//       .select('id, nombre, imagen_url, precio, stock, codigo')
//       .in('codigo', codes);

//     if (error) throw error;
//     return NextResponse.json({ productos: data });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { codes } = await request.json();
    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return NextResponse.json({ error: 'Se requiere un array de códigos de producto' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .select('id, nombre, imagen_url, precio, stock, codigo, categoria')  // ← agregamos categoria
      .in('codigo', codes);

    if (error) throw error;
    return NextResponse.json({ productos: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}