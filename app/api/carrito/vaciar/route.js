// // // app/api/carrito/vaciar/route.js
// // import { NextResponse } from 'next/server';
// // import { supabase } from '@/lib/supabase';
// // import { verificarToken } from '@/lib/auth';

// // export async function DELETE(request) {
// //   try {
// //     const authHeader = request.headers.get('authorization');

// //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //       return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
// //     }

// //     const token = authHeader.split(' ')[1];
// //     const result = verificarToken(token);

// //     if (!result.valid) {
// //       return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
// //     }

// //     const userId = result.data.id;

// //     //*💡 🔄 Llamar función RPC atómica (transacción en la BD)
// //     // Esta función valida stock de TODOS los items, actualiza stocks y vacía carrito de forma atómica
// //     // Si algo falla en la BD, TODO se revierte automáticamente (ACID transaction)
// //     const { data, error } = await supabase.rpc('checkout_carrito', {
// //       p_user_id: userId
// //     });

// //     if (error) {
// //       console.error('Error en checkout_carrito RPC:', error);
// //       return NextResponse.json(
// //         { error: 'Error en el servidor durante checkout' },
// //         { status: 500 }
// //       );
// //     }

// //     // Verificar respuesta de la función
// //     if (!data.success) {
// //       // Error devuelto por la función (stock insuficiente, carrito vacío, etc.)
// //       return NextResponse.json(
// //         { 
// //           error: data.error,
// //           producto: data.producto, // si es error de stock
// //           disponible: data.disponible,
// //           solicitado: data.solicitado
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     // ✅ Checkout exitoso - stock actualizado y carrito vaciado atomicamente
// //     return NextResponse.json({
// //       success: true,
// //       message: data.message || 'Checkout completado exitosamente'
// //     });

// //   } catch (error) {
// //     console.error('Error en vaciar carrito:', error);
// //     return NextResponse.json(
// //       { error: 'Error en el servidor' },
// //       { status: 500 }
// //     );
// //   }
// // }


// import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';
// import { verificarToken } from '@/lib/auth';

// export async function DELETE(request) {
//   try {
//     const authHeader = request.headers.get('authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const result = verificarToken(token);
//     if (!result.valid) {
//       return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
//     }

//     const userId = result.data.id;

//     const { error } = await supabase
//       .from('carritos')
//       .delete()
//       .eq('usuario_id', userId);

//     if (error) {
//       console.error('Error al vaciar carrito:', error);
//       return NextResponse.json({ error: 'Error al vaciar carrito' }, { status: 500 });
//     }

//     return NextResponse.json({ success: true, message: 'Carrito vaciado' });
//   } catch (error) {
//     console.error('Error en vaciar carrito:', error);
//     return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
//   }
// }




import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarToken } from '@/lib/auth';

export async function DELETE(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const result = verificarToken(token);
    if (!result.valid) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const userId = result.data.id;

    // Llamar a la función RPC atómica
    const { data, error } = await supabase.rpc('checkout_carrito', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error en checkout_carrito RPC:', error);
      return NextResponse.json(
        { error: 'Error en el servidor durante checkout' },
        { status: 500 }
      );
    }

    // Verificar respuesta de la función
    if (!data.success) {
      return NextResponse.json(
        {
          error: data.error,
          item: data.item,
          disponible: data.disponible,
          solicitado: data.solicitado,
          producto_id: data.producto_id
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || 'Checkout completado exitosamente'
    });

  } catch (error) {
    console.error('Error en vaciar carrito:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}