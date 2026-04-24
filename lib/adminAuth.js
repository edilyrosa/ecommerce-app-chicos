// lib/adminAuth.js
import { verificarToken } from './auth';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export async function verificarAdmin(request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Token no proporcionado' },
          { status: 401 }
        )
      };
    }

    const token = authHeader.split(' ')[1];
    const result = verificarToken(token);

    if (!result.valid) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Token inválido' },
          { status: 401 }
        )
      };
    }

    // Verificar si es admin
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('is_admin')
      .eq('id', result.data.id)
      .single();

    if (error || !usuario || !usuario.is_admin) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: '1 No tienes permisos de administrador' },
          { status: 403 }
        )
      };
    }

    return {
      authorized: true,
      userId: result.data.id
    };

  } catch (error) {
    console.error('Error verificando admin:', error);
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Error en el servidor' },
        { status: 500 }
      )
    };
  }
}