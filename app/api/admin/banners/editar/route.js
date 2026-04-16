// app/api/admin/banners/editar/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarAdmin } from '@/lib/adminAuth';

export async function PUT(request) {
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) return adminCheck.response;

  try {
    const body = await request.json();
    const { id, tipo, categoria, descripcion, imagenes, activo, orden } = body;

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const { data, error } = await supabase
      .from('banners')
      .update({ tipo, categoria, descripcion, imagenes, activo, orden })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error editando banner:', error);
    return NextResponse.json({ error: 'Error al editar banner' }, { status: 500 });
  }
}