// app/api/admin/pedidos/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarToken } from '@/lib/auth';

async function verificarAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'No autorizado', status: 401 };
  }
  const token = authHeader.split(' ')[1];
  const result = verificarToken(token);
  if (!result.valid) {
    return { error: 'Token inválido', status: 401 };
  }
  // CORRECCIÓN: extraer el payload del objeto result
  const payload = result.data;

  // Consultar el rol de administrador directamente desde la BD
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('is_admin')
    .eq('id', payload.id)
    .single();

  if (error || !user || !user.is_admin) {
    // Log opcional para depuración
    console.error('Error en verificarAdmin:', error, user);
    return { error: 'No tienes permisos de administrador', status: 403 };
  }
  return { usuario: payload };
}

export async function GET(request) {
  try {
    const adminCheck = await verificarAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userError || !usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const { data: pedidos, error: pedidosError } = await supabase
      .from('pedidos_pendientes')
      .select('*')
      .eq('usuario_id', usuario.id)
      .order('fecha', { ascending: false });

    if (pedidosError) {
      console.error('Error al obtener pedidos:', pedidosError);
      return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
    }

    return NextResponse.json({ pedidos });
  } catch (error) {
    console.error('Error en GET admin/pedidos:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const adminCheck = await verificarAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { pedidoId, nuevoEstado } = await request.json();
    if (!pedidoId || !nuevoEstado) {
      return NextResponse.json({ error: 'pedidoId y nuevoEstado requeridos' }, { status: 400 });
    }

    const estadosPermitidos = ['Procesando pedido', 'Pedido Programado', 'Pedido en Reparto', 'Entregado'];
    if (!estadosPermitidos.includes(nuevoEstado)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pedidos_pendientes')
      .update({ estatus_pedido: nuevoEstado })
      .eq('id', pedidoId)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar pedido:', error);
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
    }

    return NextResponse.json({ pedido: data });
  } catch (error) {
    console.error('Error en PATCH admin/pedidos:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}