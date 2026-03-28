// // app/api/pisos/route.js
// import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase'; // Asegúrate de tener este archivo con la Secret Key

// export async function GET() {
//   try {
//     const { data, error } = await supabase
//       .from('pisos')
//       .select('*')
//       .order('nombre', { ascending: true });

//     if (error) throw error;

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error en API Pisos:', error);
//     return NextResponse.json({ error: 'Error al obtener pisos' }, { status: 500 });
//   }
// }




// app/api/pisos/route.js

// app/api/pisos/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Solo productos de la línea 'Pisos'
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('linea', 'Pisos')
      .order('nombre', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en API Pisos:', error);
    return NextResponse.json({ error: 'Error al obtener pisos' }, { status: 500 });
  }
}