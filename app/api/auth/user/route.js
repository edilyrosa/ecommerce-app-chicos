import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { verificarToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const verificado = verificarToken(token);
    if (!verificado.valid) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const payload = verificado.data;

    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rfc, domicilio_fiscal, codigo_postal, ciudad, estado, regimen_fiscal, telefono')
      .eq('id', payload.id)
      .single();

    if (error || !user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const verificado = verificarToken(token);
    if (!verificado.valid) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const payload = verificado.data;

    const updates = await request.json();
    const camposPermitidos = [
      'nombre', 'rfc', 'telefono', 'domicilio_fiscal',
      'ciudad', 'estado', 'codigo_postal', 'regimen_fiscal'
    ];

    const datosActualizar = {};
    camposPermitidos.forEach(campo => {
      if (updates[campo] !== undefined) datosActualizar[campo] = updates[campo];
    });

    if (Object.keys(datosActualizar).length === 0) {
      return NextResponse.json({ error: 'No hay datos para actualizar' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update(datosActualizar)
      .eq('id', payload.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });

    return NextResponse.json({ user: data });
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}