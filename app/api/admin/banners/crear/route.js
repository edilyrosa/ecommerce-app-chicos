// app/api/admin/banners/crear/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarAdmin } from '@/lib/adminAuth';

export async function POST(request) {
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) return adminCheck.response;

  try {
    const body = await request.json();
    const { tipo, categoria, descripcion, imagenes, activo, orden } = body;

    if (!tipo || !categoria) {
      return NextResponse.json({ error: 'tipo y categoria son obligatorios' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('banners')
      .insert([{ tipo, categoria, descripcion: descripcion || '', imagenes: imagenes || [], activo: activo ?? true, orden: orden ?? 0 }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creando banner:', error);
    return NextResponse.json({ error: 'Error al crear banner' }, { status: 500 });
  }
}