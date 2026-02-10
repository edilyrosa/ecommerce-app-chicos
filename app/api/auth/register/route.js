import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { crearToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { nombre, email, password } = await request.json();

    console.log('📝 Registro iniciado:', { nombre, email }); // Debug

    //* ✅ Validaciones
    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    //*📋 Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('correo  ya existe')
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    //* ✅✅ Si paso todos los controles anteriores, se crea el usuario, pero antes:
    //?Encriptar contraseña: NO guarda la contraseña cruda, por si se hackea la BBDD. 
    const hashedPassword = await bcrypt.hash(password, 10);

    //* 👤Crear usuario
    const { data: newUser, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, password: hashedPassword}])
      .select()
      .single();

    if (error) {
      console.error('❌ Error al crear usuario:', error);
      return NextResponse.json(
        { error: 'Error al crear usuario: ' + error.message },
        { status: 500 }
      );
    }

    console.log('✅ Usuario creado:', newUser);
    // El servidor NO le pide que inicie sesión, sino:
    //? Genera un Token JWT usando crearToken() con los datos del usuario creado

    //* Crear token JWT
    const token = crearToken({
      id: newUser.id,
      email: newUser.email,
      nombre: newUser.nombre
    });

    //?💡El servidor responde enviando ese token al navegador, para no le pide que inicie sesión otra vez. 
    return NextResponse.json({ 
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        nombre: newUser.nombre
      }
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    return NextResponse.json(
      { error: 'Error en el servidor: ' + error.message },
      { status: 500 }
    );
  }
}
