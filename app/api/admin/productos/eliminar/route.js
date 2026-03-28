 // app/api/admin/productos/eliminar/route.js
import { NextResponse } from 'next/server';
import { verificarAdmin } from '@/lib/adminAuth';
import { supabase } from '@/lib/supabase';

export async function DELETE(request) {
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) return adminCheck.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}