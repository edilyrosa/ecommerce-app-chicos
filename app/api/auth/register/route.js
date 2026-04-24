// app/api/auth/register/route.js

import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { crearToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { nombre, email, password } = await request.json();

    // Validaciones obligatorias
    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario (solo campos básicos)
    const { data: newUser, error } = await supabase
      .from('usuarios')
      .insert([{
        nombre,
        email,
        password: hashedPassword,
        is_admin: false  // Aseguramos que el nuevo usuario no sea admin
      }])
      .select()
      .single();

    if (error) {
      console.error('Error al crear usuario:', error);
      return NextResponse.json(
        { error: 'Error al crear usuario' },
        { status: 500 }
      );
    }

    // Crear token JWT
    const token = crearToken({
      id: newUser.id,
      email: newUser.email,
      nombre: newUser.nombre
    });

    // Devolver solo datos básicos del usuario
    return NextResponse.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        nombre: newUser.nombre,
        is_admin: false  // Aseguramos que el nuevo usuario no sea admin
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}