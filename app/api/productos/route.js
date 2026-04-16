// app/api/productos/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const linea = searchParams.get('linea');

    let query = supabase
      .from('products')
      .select('*')
      .gt('stock', 0)
      .order('created_at', { ascending: false });

    if (linea) {
      query = query.eq('linea', linea);
    }

    const { data: productos, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
    }

    return NextResponse.json(productos || []);
  } catch (error) {
    console.error('❌ error al obtener productos', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}