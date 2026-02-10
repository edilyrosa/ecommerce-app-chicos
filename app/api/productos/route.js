import { NextResponse } from "next/server";
import {supabase} from "@/lib/supabase";

// app.get('/api/productos', async (req, res, next, error) => {}
// const id =  req.query.id
// )

export async function GET() { //Responder a los fetch('api/productos')
    try{
        console.log('📦 obteniendo productos...')// esto se imprime en la consola.
        //*consulta a la BBDD
        const {data:productos, error} =  await supabase
            .from('products')
            .select('*')
            .gt('stock',0)
            .order('created_at', {ascending: false})
        
        if(error){
            console.log('Error al GET de los productos en la BBDD')
            return NextResponse.json(
            {error: 'Error al obtener productos'},//Cuerpo de la respuesta
            {status:500} //Estado http
            )
        }
        //* Log exitoso.
        console.log('✅ productos obtenidos', productos.length)
        return NextResponse.json(
        productos || [], //Cuerpo de la respuesta
        {status:200} //Estado http
        )

    }catch(error){
        console.log('❌ error al obtener productos', error) 
        return NextResponse.json( //espera 2 parametros.
            {error: 'Error en el servidor'},//Cuerpo de la respuesta
            {status:500} //Estado http
        )
    }
}