import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { crearToken } from '@/lib/auth';

export async function POST(request) { //Realmente es un GET, pero usamos POST por seguridad.
  try {
    const { email, password } = await request.json();

    //* Validaciones que los datos vengan del front
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    //* Buscar usuario sesionante en la BBDD por su email.
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    //* Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    //* ⭐⭐⭐⭐Crear token JWT
    const token = crearToken({
      id: user.id,
      email: user.email,
      nombre: user.nombre
    });

  //?💡El servidor responde enviando ese token al navegador, para no le pide que inicie sesión otra vez. 
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}