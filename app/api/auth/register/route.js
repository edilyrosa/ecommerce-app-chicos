// import { supabase } from '@/lib/supabase';
// import bcrypt from 'bcryptjs';
// import { NextResponse } from 'next/server';
// import { crearToken } from '@/lib/auth';

// export async function POST(request) {
//   try {
//     const { nombre, email, password } = await request.json();

//     console.log('📝 Registro iniciado:', { nombre, email }); // Debug

//     //* ✅ Validaciones
//     if (!nombre || !email || !password) {
//       return NextResponse.json(
//         { error: 'Todos los campos son requeridos' },
//         { status: 400 }
//       );
//     }

//     if (password.length < 6) {
//       return NextResponse.json(
//         { error: 'La contraseña debe tener al menos 6 caracteres' },
//         { status: 400 }
//       );
//     }

//     //*📋 Verificar si el usuario ya existe
//     const { data: existingUser } = await supabase
//       .from('usuarios')
//       .select('email')
//       .eq('email', email)
//       .single();

//     if (existingUser) {
//       console.log('correo  ya existe')
//       return NextResponse.json(
//         { error: 'El email ya está registrado' },
//         { status: 400 }
//       );
//     }

//     //* ✅✅ Si paso todos los controles anteriores, se crea el usuario, pero antes:
//     //?Encriptar contraseña: NO guarda la contraseña cruda, por si se hackea la BBDD. 
//     const hashedPassword = await bcrypt.hash(password, 10);

//     //* 👤Crear usuario
//     const { data: newUser, error } = await supabase
//       .from('usuarios')
//       .insert([{ nombre, email, password: hashedPassword}])
//       .select()
//       .single();

//     if (error) {
//       console.error('❌ Error al crear usuario:', error);
//       return NextResponse.json(
//         { error: 'Error al crear usuario: ' + error.message },
//         { status: 500 }
//       );
//     }

//     console.log('✅ Usuario creado:', newUser);
//     // El servidor NO le pide que inicie sesión, sino:
//     //? Genera un Token JWT usando crearToken() con los datos del usuario creado

//     //* Crear token JWT
//     const token = crearToken({
//       id: newUser.id,
//       email: newUser.email,
//       nombre: newUser.nombre
//     });

//     //?💡El servidor responde enviando ese token al navegador, para no le pide que inicie sesión otra vez. 
//     return NextResponse.json({ 
//       token,
//       user: {
//         id: newUser.id,
//         email: newUser.email,
//         nombre: newUser.nombre
//       }
//     });
//   } catch (error) {
//     console.error('❌ Error en registro:', error);
//     return NextResponse.json(
//       { error: 'Error en el servidor: ' + error.message },
//       { status: 500 }
//     );
//   }
// }



// // app/api/auth/register/route.js
// import { supabase } from '@/lib/supabase';
// import bcrypt from 'bcryptjs';
// import { NextResponse } from 'next/server';
// import { crearToken } from '@/lib/auth';

// export async function POST(request) {
//   try {
//     const { 
//       nombre, 
//       email, 
//       password,
//       // ← NUEVOS CAMPOS FISCALES (opcionales)
//       rfc,
//       domicilio_fiscal,
//       codigo_postal,
//       ciudad,
//       estado,
//       regimen_fiscal,
//       telefono
//     } = await request.json();

//     console.log('📝 Registro iniciado:', { nombre, email });

//     // ✅ Validaciones OBLIGATORIAS
//     if (!nombre || !email || !password) {
//       return NextResponse.json(
//         { error: 'Nombre, email y contraseña son requeridos' },
//         { status: 400 }
//       );
//     }

//     if (password.length < 6) {
//       return NextResponse.json(
//         { error: 'La contraseña debe tener al menos 6 caracteres' },
//         { status: 400 }
//       );
//     }

//     // ? OJITO ACA Validaciones OPCIONALES pero recomendadas
//     // if (rfc && rfc.length !== 13) {
//     //   return NextResponse.json(
//     //     { error: 'El RFC debe tener 13 caracteres' },
//     //     { status: 400 }
//     //   );
//     // }

//     if (codigo_postal && codigo_postal.length !== 5) {
//       return NextResponse.json(
//         { error: 'El código postal debe tener 5 dígitos' },
//         { status: 400 }
//       );
//     }

//     // Verificar si el usuario ya existe
//     const { data: existingUser } = await supabase
//       .from('usuarios')
//       .select('email')
//       .eq('email', email)
//       .single();

//     if (existingUser) {
//       console.log('❌ Correo ya existe');
//       return NextResponse.json(
//         { error: 'El email ya está registrado' },
//         { status: 400 }
//       );
//     }

//     // Encriptar contraseña
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 👤 Crear usuario CON DATOS FISCALES
//     const { data: newUser, error } = await supabase
//       .from('usuarios')
//       .insert([{ 
//         nombre, 
//         email, 
//         password: hashedPassword,
//         // ← NUEVOS CAMPOS (se guardan aunque sean null)
//         rfc: rfc || null,
//         domicilio_fiscal: domicilio_fiscal || null,
//         codigo_postal: codigo_postal || null,
//         ciudad: ciudad || null,
//         estado: estado || null,
//         regimen_fiscal: regimen_fiscal || '616', // Default si no se proporciona
//         telefono: telefono || null
//       }])
//       .select()
//       .single();

//     if (error) {
//       console.error('❌ Error al crear usuario:', error);
//       return NextResponse.json(
//         { error: 'Error al crear usuario: ' + error.message },
//         { status: 500 }
//       );
//     }

//     console.log('✅ Usuario creado:', newUser);

//     // Crear token JWT
//     const token = crearToken({
//       id: newUser.id,
//       email: newUser.email,
//       nombre: newUser.nombre
//     });

//     // 💡 Devolver usuario CON DATOS FISCALES
//     return NextResponse.json({ 
//       token,
//       user: {
//         id: newUser.id,
//         email: newUser.email,
//         nombre: newUser.nombre,
//         rfc: newUser.rfc,
//         domicilio_fiscal: newUser.domicilio_fiscal,
//         codigo_postal: newUser.codigo_postal,
//         ciudad: newUser.ciudad,
//         estado: newUser.estado,
//         regimen_fiscal: newUser.regimen_fiscal,
//         telefono: newUser.telefono
//       }
//     });
//   } catch (error) {
//     console.error('❌ Error en registro:', error);
//     return NextResponse.json(
//       { error: 'Error en el servidor: ' + error.message },
//       { status: 500 }
//     );
//   }
// }





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
        password: hashedPassword
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
        nombre: newUser.nombre
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