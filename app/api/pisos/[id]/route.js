// // // // app/api/pisos/[id]/route.js

// // // import { NextResponse } from "next/server";
// // // import { supabase } from "@/lib/supabase";

// // // export async function GET(request, { params }) {
// // //     try {
// // //         // Extraer el ID del producto desde los parámetros de la ruta
// // //         const { id } = await params;

// // //         console.log(`🔎 Buscando producto con ID: ${id}`);

// // //         // Consulta a la base de datos en la tabla 'products'
// // //         const { data: producto, error } = await supabase
// // //             .from('products')
// // //             .select('*')
// // //             .eq('id', id) // buscar por ID exacto
// // //             .single();

// // //         if (error || !producto) {
// // //             console.error('❌ Error de Supabase:', error?.message || 'Producto no encontrado');
// // //             return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
// // //         }

// // //         // Responder con los datos del producto
// // //         return NextResponse.json(producto);

// // //     } catch (error) {
// // //         console.error('💥 Error en el servidor:', error);
// // //         return NextResponse.json(
// // //             { error: 'Error interno del servidor' }, 
// // //             { status: 500 }
// // //         );
// // //     }
// // // }



// // import { NextResponse } from "next/server";
// // import { supabase } from "@/lib/supabase";

// // export async function GET(request, { params }) {
// //     try {
// //         // Extraer el ID numérico de los parámetros
// //         const { id } = await params;

// //         // Verificar que sea un número válido
// //         if (isNaN(parseInt(id))) {
// //             return NextResponse.json(
// //                 { error: "ID inválido" },
// //                 { status: 400 }
// //             );
// //         }

// //         console.log(`🔎 Buscando producto con ID numérico: ${id}`);

// //         const { data: producto, error } = await supabase
// //             .from('products')
// //             .select('*')
// //             .eq('id', parseInt(id))  // buscar por la columna 'id' numérica
// //             .single();

// //         if (error || !producto) {
// //             console.error('❌ Error:', error?.message || 'Producto no encontrado');
// //             return NextResponse.json(
// //                 { error: 'Producto no encontrado' },
// //                 { status: 404 }
// //             );
// //         }

// //         return NextResponse.json(producto);
// //     } catch (error) {
// //         console.error('💥 Error en el servidor:', error);
// //         return NextResponse.json(
// //             { error: 'Error interno del servidor' },
// //             { status: 500 }
// //         );
// //     }
// // }


// // app/api/pisos/[id]/route.js
// import { NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase";

// export async function GET(request, { params }) {
//     try {
//         const { id } = await params; // id numérico

//         const { data: producto, error } = await supabase
//             .from('products')
//             .select('*')
//             .eq('id', id) // buscar por la columna 'id' numérica
//             .single();

//         if (error || !producto) {
//             return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
//         }

//         return NextResponse.json(producto);
//     } catch (error) {
//         console.error('Error en API pisos/[id]:', error);
//         return NextResponse.json(
//             { error: 'Error interno del servidor' },
//             { status: 500 }
//         );
//     }
// }





// app/api/pisos/[id]/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { data: producto, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !producto) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(producto);
  } catch (error) {
    console.error('Error en API pisos/[id]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}