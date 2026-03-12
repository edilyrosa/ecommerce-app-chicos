// import { NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase";

// export async function GET(request, { params }) {
//     try {
//         //* 2. Extraer el nombre del piso desde los parámetros de la ruta
//         const { nombre } = await params;

//         // 2. Formatear el nombre (de "alabama-gris" a "alabama gris") //TODO: POR LO IMPLEMENTO, LO LO ESTOY USANDO
//         const nombreDecodificado = decodeURIComponent(nombre).replace(/-/g, ' ');

//         console.log(`🔎 Buscando piso: ${nombreDecodificado}`);

//         //* 3. Consulta a la base de datos si existe un piso con ese nombre
//         const { data: piso, error } = await supabase
//             .from('pisos')
//             .select('*')
//             .ilike('nombre', nombreDecodificado) // ilike no distingue mayúsculas de minúsculas
//             .single();

//         if (error) {
//             console.error('❌ Error de Supabase:', error.message);
//             return NextResponse.json({ error: 'Hola Piso no encontrado 2' }, { status: 404 });
//         }

//         //* 4. Responder con los datos del piso
//         return NextResponse.json(piso); //* y se lo envío al front para que lo muestre en la página dinámica

//     } catch (error) {
//         console.error('💥 Error en el servidor:', error);
//         return NextResponse.json(
//             { error: 'Error interno del servidor' }, 
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request, { params }) {
    try {
        // Extraer el ID del producto desde los parámetros de la ruta
        const { id } = await params;

        console.log(`🔎 Buscando producto con ID: ${id}`);

        // Consulta a la base de datos en la tabla 'products'
        const { data: producto, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id) // buscar por ID exacto
            .single();

        if (error || !producto) {
            console.error('❌ Error de Supabase:', error?.message || 'Producto no encontrado');
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
        }

        // Responder con los datos del producto
        return NextResponse.json(producto);

    } catch (error) {
        console.error('💥 Error en el servidor:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' }, 
            { status: 500 }
        );
    }
}