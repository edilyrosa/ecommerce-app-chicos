

// app/api/banners/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarToken } from '@/lib/auth';

// Helper para verificar si el usuario es administrador
async function verificarAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, error: 'Token no proporcionado', status: 401 };
  }
  const token = authHeader.split(' ')[1];
  const payload = verificarToken(token);
  if (!payload) {
    return { authorized: false, error: 'Token inválido', status: 401 };
  }
  // Aquí puedes verificar si el usuario tiene rol de admin. Si no tienes roles, asume que cualquier usuario autenticado puede editar.
  // Para mayor seguridad, podrías tener un campo `rol` en la tabla usuarios.
  // Por ahora, permitimos cualquier usuario autenticado (ajusta según tu lógica).
  return { authorized: true, user: payload };
}

export async function GET(request) {
  try {
    // Para GET no requerimos autenticación (público)
    const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await verificarAdmin(request);
  if (!admin.authorized) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }
  try {
    const body = await request.json();
    const { tipo, categoria, titulo, descripcion, imagenes } = body;
    if (!tipo || !titulo || !imagenes) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('banners')
      .insert([{ tipo, categoria, titulo, descripcion, imagenes }])
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const admin = await verificarAdmin(request);
  if (!admin.authorized) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    const body = await request.json();
    const { tipo, categoria, titulo, descripcion, imagenes } = body;
    const { data, error } = await supabase
      .from('banners')
      .update({ tipo, categoria, titulo, descripcion, imagenes })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const admin = await verificarAdmin(request);
  if (!admin.authorized) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}