import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarToken } from '@/lib/auth';

export async function DELETE(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const result = verificarToken(token);
    if (!result.valid) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const userId = result.data.id;

    // Llamar a la función RPC atómica
    const { data, error } = await supabase.rpc('checkout_carrito', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error en checkout_carrito RPC:', error);
      return NextResponse.json(
        { error: 'Error en el servidor durante checkout' },
        { status: 500 }
      );
    }

    // Verificar respuesta de la función
    if (!data.success) {
      return NextResponse.json(
        {
          error: data.error,
          item: data.item,
          disponible: data.disponible,
          solicitado: data.solicitado,
          producto_id: data.producto_id
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || 'Checkout completado exitosamente'
    });

  } catch (error) {
    console.error('Error en vaciar carrito:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}