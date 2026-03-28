import { NextResponse } from 'next/server';
import { verificarAdmin } from '@/lib/adminAuth';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) return adminCheck.response;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const categoria = searchParams.get('categoria');
    const linea = searchParams.get('linea');

    // Obtener categorías únicas
    if (type === 'categorias') {
      const { data, error } = await supabase
        .from('products')
        .select('categoria')
        .not('categoria', 'is', null)
        .neq('categoria', '')
        .order('categoria');
      if (error) throw error;
      const categorias = [...new Set(data.map(item => item.categoria))];
      return NextResponse.json(categorias);
    }

    // Obtener líneas (con filtro opcional por categoría)
    if (type === 'lineas') {
      let query = supabase
        .from('products')
        .select('linea')
        .not('linea', 'is', null)
        .neq('linea', '');
      if (categoria) query = query.eq('categoria', categoria);
      const { data, error } = await query.order('linea');
      if (error) throw error;
      const lineas = [...new Set(data.map(item => item.linea))];
      return NextResponse.json(lineas);
    }

    // Obtener productos de una línea específica (para pegamentos y junteadores)
    if (type === 'productos_por_linea') {
      if (!linea) {
        return NextResponse.json({ error: 'Se requiere línea' }, { status: 400 });
      }
      const { data, error } = await supabase
        .from('products')
        .select('id, nombre, codigo')
        .eq('linea', linea)
        .order('nombre');
      if (error) throw error;
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
  } catch (error) {
    console.error('Error obteniendo opciones:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}