import { NextResponse } from 'next/server';
import { verificarToken } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const result = verificarToken(token);

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    // Obtener solo los campos básicos del usuario
    const { data: userData, error } = await supabase
      .from('usuarios')
      .select('id, email, nombre, is_admin, created_at')
      .eq('id', result.data.id)
      .single();

    if (error || !userData) {
      console.error('Error al obtener usuario:', error);
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Devolver solo datos básicos
    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        nombre: userData.nombre,
        created_at: userData.created_at,
        is_admin: userData.is_admin || false  // ✅ NUEVO
      }
    });

  } catch (error) {
    console.error('Error verificando token:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}