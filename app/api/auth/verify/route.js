import { NextResponse } from 'next/server';
import { verificarToken } from '@/lib/auth';

export async function GET(request) { //*El que apunte a este endpoint enviara cabeceras con token, para verificar
  try {
    const authHeader = request.headers.get('authorization'); //?Cabeceras de autenticacion.

    //*Verificacion 
    // El Estándar HTTP "Bearer", Cuando un cliente envía un token de acceso, 
    // normalmente lo hace en la cabecera Authorization. 
    // El estándar dicta que el valor no sea solo el token, sino que lleve un prefijo del esquema usado.
    // El formato esperado es: Authorization: Bearer <tu_token_aquí>
    if (!authHeader || !authHeader.startsWith('Bearer ')) { //!Si la cabecera NO empieza con 'Bearer ' da error".
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      );
    }

    //* Rescatamos SOLO el token y lo guadamos para validarlo. 
    const token = authHeader.split(' ')[1]; //? Bearer eyJhbGciOiJIUzI1..., esto es split de "Bearer"
    const result = verificarToken(token); //*verificamos el token, alla se decodifica y verifica, devuelve la resp

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

      //*💡El servidor responde enviando AL USUARIO VERIFICADO (no el token) al navegador. 
    return NextResponse.json({
      user: {
        id: result.data.id,
        email: result.data.email,
        nombre: result.data.nombre
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