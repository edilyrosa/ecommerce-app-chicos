// app/api/carrito/ajustar/route
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const result = verificarToken(token);

    if (!result.valid) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { carritoId, delta } = await request.json();

    if (!carritoId || typeof delta !== 'number') {
      return NextResponse.json({ error: 'carritoId y delta son requeridos' }, { status: 400 });
    }

    //* Obtener carrito y producto
    const { data: item, error: itemError } = await supabase
      .from('carritos')
      .select(`
        id,
        cantidad,
        producto_id,
        products ( id, nombre, stock )
      `)
      .eq('id', carritoId)
      .eq('usuario_id', result.data.id)
      .single();

    if (itemError || !item) {
      return NextResponse.json({ error: 'Item no encontrado o no autorizado' }, { status: 404 });
    }

    const producto = item.products;
    const nuevaCantidad = Number(item.cantidad) + Number(delta);

    if (delta > 0) {
      if (producto.stock < nuevaCantidad) {
        return NextResponse.json({ error: 'Stock insuficiente', details: { producto_id: producto.id, nombre: producto.nombre, stock: producto.stock, solicitado: nuevaCantidad } }, { status: 400 });
      }
    }

    if (nuevaCantidad <= 0) {
      // Eliminar item del carrito
      const { error: deleteError } = await supabase
        .from('carritos')
        .delete()
        .eq('id', carritoId)
        .eq('usuario_id', result.data.id);

      if (deleteError) {
        console.error('Error al eliminar item del carrito:', deleteError);
        return NextResponse.json({ error: 'Error al eliminar item' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Item eliminado' });
    }

    // Actualizar cantidad
    const { data: updated, error: updateError } = await supabase
      .from('carritos')
      .update({ cantidad: nuevaCantidad })
      .eq('id', carritoId)
      .select()
      .single();

    if (updateError) {
      console.error('Error al actualizar cantidad:', updateError);
      return NextResponse.json({ error: 'Error al actualizar cantidad' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Cantidad actualizada', item: updated });
  } catch (error) {
    console.error('Error en ajustar carrito:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
