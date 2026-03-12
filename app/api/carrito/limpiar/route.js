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

    const { error } = await supabase
      .from('carritos')
      .delete()
      .eq('usuario_id', userId);

    if (error) {
      console.error('Error al limpiar carrito:', error);
      return NextResponse.json({ error: 'Error al limpiar carrito' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Carrito vaciado' });
  } catch (error) {
    console.error('Error en limpiar carrito:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}