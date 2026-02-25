import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request, { params }) {
    try {
        // 1. Descomprimir params (Obligatorio en Next.js 15+)
        const { nombre } = await params;

        // 2. Formatear el nombre (de "alabama-gris" a "alabama gris")
        const nombreDecodificado = decodeURIComponent(nombre).replace(/-/g, ' ');

        console.log(`🔎 Buscando piso: ${nombreDecodificado}`);

        // 3. Consulta a la base de datos usando tu cliente importado
        const { data: piso, error } = await supabase
            .from('pisos')
            .select('*')
            .ilike('nombre', nombreDecodificado) // ilike no distingue mayúsculas de minúsculas
            .single();

        if (error) {
            console.error('❌ Error de Supabase:', error.message);
            return NextResponse.json({ error: 'Hola Piso no encontrado 2' }, { status: 404 });
        }

        // 4. Responder con los datos del piso
        return NextResponse.json(piso);

    } catch (error) {
        console.error('💥 Error en el servidor:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' }, 
            { status: 500 }
        );
    }
}