import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const result = verificarToken(token);

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Obtener carrito con información de productos
    const { data: carrito, error } = await supabase
      .from('carritos')
      .select(`
        id,
        cantidad,
        producto_id,
        products (
          id,
          nombre,
          descripcion,
          precio,
          imagen_url,
          stock
        )
      `)
      .eq('usuario_id', result.data.id);

    if (error) {
      console.error('Error al obtener carrito:', error);
      return NextResponse.json(
        { error: 'Error al obtener carrito' },
        { status: 500 }
      );
    }

    // Formatear la respuesta
    const carritoFormateado = carrito.map(item => ({
      carrito_id: item.id,
      cantidad: item.cantidad,
      producto_id: item.products?.id ?? item.producto_id,
      nombre: item.products?.nombre ?? null,
      descripcion: item.products?.descripcion ?? null,
      precio: item.products?.precio ?? null,
      imagen_url: item.products?.imagen_url ?? null,
      stock: item.products?.stock ?? null
    }));

    return NextResponse.json(carritoFormateado);
  } catch (error) {
    console.error('Error en carrito:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
