// app/api/carrito/eliminar/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarToken } from '@/lib/auth';

export async function DELETE(request) { 
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

    const { carritoId } = await request.json();

    if (!carritoId) {
      return NextResponse.json(
        { error: 'ID de carrito requerido' },
        { status: 400 }
      );
    }

    //* Verificar que el item existe y pertenece al usuario
    const { data: item } = await supabase
      .from('carritos')
      .select('*')
      .eq('id', carritoId)
      .eq('usuario_id', result.data.id)  // ← Seguridad
      .single();

    if (!item) {
      return NextResponse.json(
        { error: 'Item no encontrado o no autorizado' },
        { status: 404 }
      );
    }

    //* ELIMINAR (igual estructura que tu POST)
    const { error } = await supabase
      .from('carritos')
      .delete()
      .eq('id', carritoId)
      .eq('usuario_id', result.data.id);

    if (error) {
      console.error('Error al eliminar del carrito:', error);
      return NextResponse.json(
        { error: 'Error al eliminar del carrito' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Producto eliminado del carrito' 
    });

  } catch (error) {
    console.error('Error en eliminar carrito:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
