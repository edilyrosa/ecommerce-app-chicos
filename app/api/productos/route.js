// import { NextResponse } from "next/server";
// import {supabase} from "@/lib/supabase";


// export async function GET() { //Responder a los fetch('api/productos')
//     try{
//         console.log('📦 obteniendo productos...')// esto se imprime en la consola.
//         //*consulta a la BBDD
//         const {data:productos, error} =  await supabase
//             .from('products')
//             .select('*')
//             .gt('stock',0)
//             .order('created_at', {ascending: false})
        
//         if(error){
//             console.log('Error al GET de los productos en la BBDD')
//             return NextResponse.json(
//             {error: 'Error al obtener productos'},//Cuerpo de la respuesta
//             {status:500} //Estado http
//             )
//         }
//         //* Log exitoso.
//         console.log('✅ productos obtenidos', productos.length)
//         return NextResponse.json(
//         productos || [], //Cuerpo de la respuesta
//         {status:200} //Estado http
//         )

//     }catch(error){
//         console.log('❌ error al obtener productos', error) 
//         return NextResponse.json( //espera 2 parametros.
//             {error: 'Error en el servidor'},//Cuerpo de la respuesta
//             {status:500} //Estado http
//         )
//     }
// }



import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) { // Ahora recibe request para acceder a los query params
  try {
    console.log('📦 obteniendo productos...');

    // Obtener el parámetro 'linea' de la URL (ej. /api/productos?linea=Junteador)
    const { searchParams } = new URL(request.url);
    const linea = searchParams.get('linea');

    // Construir la consulta base
    let query = supabase
      .from('products')
      .select('*')
      .gt('stock', 0)
      .order('created_at', { ascending: false });

    // Si se proporciona el parámetro linea, filtrar por él
    if (linea) {
      query = query.eq('linea', linea);
    }

    const { data: productos, error } = await query;

    if (error) {
      console.log('Error al GET de los productos en la BBDD', error);
      return NextResponse.json(
        { error: 'Error al obtener productos' },
        { status: 500 }
      );
    }

    console.log('✅ productos obtenidos', productos.length);
    return NextResponse.json(
      productos || [],
      { status: 200 }
    );

  } catch (error) {
    console.log('❌ error al obtener productos', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}