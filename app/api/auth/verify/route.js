// // import { NextResponse } from 'next/server';
// // import { verificarToken } from '@/lib/auth';

// // export async function GET(request) { //*El que apunte a este endpoint enviara cabeceras con token, para verificar
// //   try {
// //     const authHeader = request.headers.get('authorization'); //?Cabeceras de autenticacion.

// //     //*Verificacion 
// //     // El Estándar HTTP "Bearer", Cuando un cliente envía un token de acceso, 
// //     // normalmente lo hace en la cabecera Authorization. 
// //     // El estándar dicta que el valor no sea solo el token, sino que lleve un prefijo del esquema usado.
// //     // El formato esperado es: Authorization: Bearer <tu_token_aquí>
// //     if (!authHeader || !authHeader.startsWith('Bearer ')) { //!Si la cabecera NO empieza con 'Bearer ' da error".
// //       return NextResponse.json(
// //         { error: 'Token no proporcionado' },
// //         { status: 401 }
// //       );
// //     }

// //     //* Rescatamos SOLO el token y lo guadamos para validarlo. 
// //     const token = authHeader.split(' ')[1]; //? Bearer eyJhbGciOiJIUzI1..., esto es split de "Bearer"
// //     const result = verificarToken(token); //*verificamos el token, alla se decodifica y verifica, devuelve la resp

// //     if (!result.valid) {
// //       return NextResponse.json(
// //         { error: 'Token inválido o expirado' },
// //         { status: 401 }
// //       );
// //     }

// //       //*💡El servidor responde enviando AL USUARIO VERIFICADO (no el token) al navegador. 
// //     return NextResponse.json({
// //       user: {
// //         id: result.data.id,
// //         email: result.data.email,
// //         nombre: result.data.nombre
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Error verificando token:', error);
// //     return NextResponse.json(
// //       { error: 'Error en el servidor' },
// //       { status: 500 }
// //     );
// //   }
// // }


// // app/api/auth/verify/route.js
// import { NextResponse } from 'next/server';
// import { verificarToken } from '@/lib/auth';
// import { createClient } from '@supabase/supabase-js';

// // Crear cliente de Supabase usando TUS variables
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SECRET_KEY  // ← TU variable se llama SUPABASE_SECRET_KEY
// );

// export async function GET(request) {
//   try {
//     const authHeader = request.headers.get('authorization');

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json(
//         { error: 'Token no proporcionado' },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.split(' ')[1];
//     const result = verificarToken(token);

//     if (!result.valid) {
//       return NextResponse.json(
//         { error: 'Token inválido o expirado' },
//         { status: 401 }
//       );
//     }

//     // ✅ OBTENER TODOS LOS DATOS DEL USUARIO CON SUPABASE
//     const { data: userData, error } = await supabase
//       .from('usuarios')
//       .select(`
//         id,
//         email,
//         nombre,
//         rfc,
//         domicilio_fiscal,
//         codigo_postal,
//         ciudad,
//         estado,
//         regimen_fiscal,
//         telefono,
//         created_at
//       `)
//       .eq('id', result.data.id)
//       .single();

//     if (error || !userData) {
//       console.error('Error al obtener usuario:', error);
//       return NextResponse.json(
//         { error: 'Usuario no encontrado' },
//         { status: 404 }
//       );
//     }

//     // 💡 Devolver TODOS los datos del usuario
//     return NextResponse.json({
//       user: {
//         id: userData.id,
//         email: userData.email,
//         nombre: userData.nombre,
//         rfc: userData.rfc,
//         domicilio_fiscal: userData.domicilio_fiscal,
//         codigo_postal: userData.codigo_postal,
//         ciudad: userData.ciudad,
//         estado: userData.estado,
//         regimen_fiscal: userData.regimen_fiscal,
//         telefono: userData.telefono,
//         created_at: userData.created_at
//       }
//     });

//   } catch (error) {
//     console.error('Error verificando token:', error);
//     return NextResponse.json(
//       { error: 'Error en el servidor' },
//       { status: 500 }
//     );
//   }
// }





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
      .select('id, email, nombre, created_at')
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
        created_at: userData.created_at
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