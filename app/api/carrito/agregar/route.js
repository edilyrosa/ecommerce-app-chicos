// // // /api/carrito/agregar/route.js
// // import { NextResponse } from 'next/server';
// // import { supabase } from '@/lib/supabase';
// // import { verificarToken } from '@/lib/auth';

// // export async function POST(request) {
// //   try {
// //     const authHeader = request.headers.get('authorization');
    
// //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //       return NextResponse.json(
// //         { error: 'No autorizado' },
// //         { status: 401 }
// //       );
// //     }

// //     const token = authHeader.split(' ')[1];
// //     const result = verificarToken(token);

// //     if (!result.valid) {
// //       return NextResponse.json(
// //         { error: 'Token inválido' },
// //         { status: 401 }
// //       );
// //     }

// //     const { productoId, cantidad = 1 } = await request.json();

// //     if (!productoId) {
// //       return NextResponse.json(
// //         { error: 'ID de producto requerido' },
// //         { status: 400 }
// //       );
// //     }

// //     //* Verificar stock
// //     const { data: producto } = await supabase
// //       .from('products')
// //       .select('stock')
// //       .eq('id', productoId)
// //       .single();

// //     if (!producto || producto.stock < cantidad) {
// //       return NextResponse.json(
// //         { error: 'Producto sin stock suficiente' },
// //         { status: 400 }
// //       );
// //     }

// //     //* Verificar si ya existe en el carrito
// //     const { data: existing } = await supabase
// //       .from('carritos')
// //       .select('*')
// //       .eq('usuario_id', result.data.id)
// //       .eq('producto_id', productoId)
// //       .single();

// //     if (existing) {
// //       //* Actualizar cantidad
// //       const nuevaCantidad = existing.cantidad + cantidad;
      
// //       if (nuevaCantidad > producto.stock) {
// //         return NextResponse.json(
// //           { error: 'Cantidad excede el stock disponible' },
// //           { status: 400 }
// //         );
// //       }

// //       const { data, error } = await supabase
// //         .from('carritos')
// //         .update({ cantidad: nuevaCantidad })
// //         .eq('id', existing.id)
// //         .select();

// //       if (error) {
// //         console.error('Error al actualizar carrito:', error);
// //         return NextResponse.json(
// //           { error: 'Error al actualizar carrito' },
// //           { status: 500 }
// //         );
// //       }

// //       return NextResponse.json({ message: 'Cantidad actualizada', data });
// //     } else {
// //       // Insertar nuevo item
// //       const { data, error } = await supabase
// //         .from('carritos')
// //         .insert([
// //           {
// //             usuario_id: result.data.id,
// //             producto_id: productoId,
// //             cantidad
// //           }
// //         ])
// //         .select();

// //       if (error) {
// //         console.error('Error al agregar al carrito:', error);
// //         return NextResponse.json(
// //           { error: 'Error al agregar al carrito' },
// //           { status: 500 }
// //         );
// //       }

// //       return NextResponse.json({ message: 'Producto agregado', data });
// //     }
// //   } catch (error) {
// //     console.error('Error en agregar carrito:', error);
// //     return NextResponse.json(
// //       { error: 'Error en el servidor' },
// //       { status: 500 }
// //     );
// //   }
// // }




// //!version con la tabla 'pisos'
// // app/api/carrito/agregar/route.js
// import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';
// import { verificarToken } from '@/lib/auth';

// export async function POST(request) {
//   try {
//     const authHeader = request.headers.get('authorization');
    
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json(
//         { error: 'No autorizado' },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.split(' ')[1];
//     const result = verificarToken(token);

//     if (!result.valid) {
//       return NextResponse.json(
//         { error: 'Token inválido' },
//         { status: 401 }
//       );
//     }

//     const { productoId, pisoId, cantidad = 1 } = await request.json();

//     // Validar que venga uno y solo uno
//     if ((productoId && pisoId) || (!productoId && !pisoId)) {
//       return NextResponse.json(
//         { error: 'Debe especificar productoId O pisoId (solo uno)' },
//         { status: 400 }
//       );
//     }

//     // Determinar tipo de item y configuración
//     const itemType = productoId ? 'product' : 'piso';
//     const itemId = productoId || pisoId;
//     const tableName = itemType === 'product' ? 'products' : 'pisos';
//     const idColumn = itemType === 'product' ? 'producto_id' : 'piso_id';

//     //* Verificar stock
//     const { data: item, error: itemError } = await supabase
//       .from(tableName)
//       .select('stock')
//       .eq('id', itemId)
//       .single();

//     if (itemError || !item) {
//       return NextResponse.json(
//         { error: `${itemType === 'product' ? 'Producto' : 'Piso'} no encontrado` },
//         { status: 404 }
//       );
//     }

//     if (!item || item.stock < cantidad) {
//       return NextResponse.json(
//         { error: `${itemType === 'product' ? 'Producto' : 'Piso'} sin stock suficiente` },
//         { status: 400 }
//       );
//     }

//     //* Verificar si ya existe en el carrito
//     const { data: existing } = await supabase
//       .from('carritos')
//       .select('*')
//       .eq('usuario_id', result.data.id)
//       .eq(idColumn, itemId)
//       .single();

//     if (existing) {
//       //* Actualizar cantidad
//       const nuevaCantidad = existing.cantidad + cantidad;
      
//       // Validación importante: nueva cantidad no debe exceder stock
//       if (nuevaCantidad > item.stock) {
//         return NextResponse.json(
//           { error: 'Cantidad excede el stock disponible' },
//           { status: 400 }
//         );
//       }

//       const { data, error } = await supabase
//         .from('carritos')
//         .update({ cantidad: nuevaCantidad })
//         .eq('id', existing.id)
//         .select();

//       if (error) {
//         console.error('Error al actualizar carrito:', error);
//         return NextResponse.json(
//           { error: 'Error al actualizar carrito' },
//           { status: 500 }
//         );
//       }

//       return NextResponse.json({ message: 'Cantidad actualizada', data });
//     } else {
//       // Insertar nuevo item
//       const insertData = {
//         usuario_id: result.data.id,
//         cantidad,
//         item_type: itemType,
//         [idColumn]: itemId
//       };

//       const { data, error } = await supabase
//         .from('carritos')
//         .insert([insertData])
//         .select();

//       if (error) {
//         console.error('Error al agregar al carrito:', error);
//         return NextResponse.json(
//           { error: 'Error al agregar al carrito' },
//           { status: 500 }
//         );
//       }

//       return NextResponse.json({ 
//         message: `${itemType === 'product' ? 'Producto' : 'Piso'} agregado`, 
//         data 
//       });
//     }
//   } catch (error) {
//     console.error('Error en agregar carrito:', error);
//     return NextResponse.json(
//       { error: 'Error en el servidor' },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarToken } from '@/lib/auth';

export async function POST(request) {
  try {
    // 1. Validar Autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const result = verificarToken(token);
    if (!result.valid) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // 2. Extraer datos del cuerpo
    const body = await request.json();
    const { productoId, pisoId, cantidad = 1 } = body;

    // 3. Determinar qué estamos agregando
    const itemId = productoId || pisoId;
    const itemType = productoId ? 'product' : 'piso';
    const tableName = productoId ? 'products' : 'pisos';
    const idColumn = productoId ? 'producto_id' : 'piso_id';

    if (!itemId) {
      return NextResponse.json({ error: 'ID de producto o piso requerido' }, { status: 400 });
    }

    // 4. Verificar Stock en la tabla correspondiente
    const { data: item, error: itemError } = await supabase
      .from(tableName)
      .select('stock')
      .eq('id', itemId)
      .single();

    if (itemError || !item) {
      return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
    }

    if (item.stock < cantidad) {
      return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 });
    }

    // 5. Verificar si ya existe en el carrito del usuario
    const { data: existing } = await supabase
      .from('carritos')
      .select('*')
      .eq('usuario_id', result.data.id)
      .eq(idColumn, itemId)
      .single();

    if (existing) {
      const nuevaCantidad = existing.cantidad + cantidad;
      if (nuevaCantidad > item.stock) {
        return NextResponse.json({ error: 'Excede el stock disponible' }, { status: 400 });
      }

      const { error: upError } = await supabase
        .from('carritos')
        .update({ cantidad: nuevaCantidad })
        .eq('id', existing.id);

      if (upError) throw upError;
      return NextResponse.json({ message: 'Cantidad actualizada' });
    } else {
      // 6. Insertar nuevo registro
      const { error: insError } = await supabase
        .from('carritos')
        .insert([{
          usuario_id: result.data.id,
          [idColumn]: itemId, // Inserta en piso_id o producto_id dinámicamente
          cantidad,
          item_type: itemType
        }]);

      if (insError) throw insError;
      return NextResponse.json({ message: 'Agregado al carrito' });
    }
  } catch (error) {
    console.error('Error en API agregar:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}