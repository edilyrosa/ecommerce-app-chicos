// /api/carrito/agregar/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarToken } from '@/lib/auth';

export async function POST(request) {
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

    const { productoId, cantidad = 1 } = await request.json();

    if (!productoId) {
      return NextResponse.json(
        { error: 'ID de producto requerido' },
        { status: 400 }
      );
    }

    //* Verificar stock
    const { data: producto } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productoId)
      .single();

    if (!producto || producto.stock < cantidad) {
      return NextResponse.json(
        { error: 'Producto sin stock suficiente' },
        { status: 400 }
      );
    }

    //* Verificar si ya existe en el carrito
    const { data: existing } = await supabase
      .from('carritos')
      .select('*')
      .eq('usuario_id', result.data.id)
      .eq('producto_id', productoId)
      .single();

    if (existing) {
      //* Actualizar cantidad
      const nuevaCantidad = existing.cantidad + cantidad;
      
      if (nuevaCantidad > producto.stock) {
        return NextResponse.json(
          { error: 'Cantidad excede el stock disponible' },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from('carritos')
        .update({ cantidad: nuevaCantidad })
        .eq('id', existing.id)
        .select();

      if (error) {
        console.error('Error al actualizar carrito:', error);
        return NextResponse.json(
          { error: 'Error al actualizar carrito' },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: 'Cantidad actualizada', data });
    } else {
      // Insertar nuevo item
      const { data, error } = await supabase
        .from('carritos')
        .insert([
          {
            usuario_id: result.data.id,
            producto_id: productoId,
            cantidad
          }
        ])
        .select();

      if (error) {
        console.error('Error al agregar al carrito:', error);
        return NextResponse.json(
          { error: 'Error al agregar al carrito' },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: 'Producto agregado', data });
    }
  } catch (error) {
    console.error('Error en agregar carrito:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
