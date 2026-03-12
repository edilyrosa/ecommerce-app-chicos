// import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';
// import { verificarToken } from '@/lib/auth';

// export async function POST(request) {
//   try {
//     // 1. Validar Autenticación
//     const authHeader = request.headers.get('authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const result = verificarToken(token);
//     if (!result.valid) {
//       return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
//     }

//     // 2. Extraer datos del cuerpo
//     const body = await request.json();
//     const { productoId, pisoId, cantidad = 1 } = body;

//     // 3. Determinar qué estamos agregando
//     const itemId = productoId || pisoId;
//     const itemType = productoId ? 'product' : 'piso';
//     const tableName = productoId ? 'products' : 'pisos';
//     const idColumn = productoId ? 'producto_id' : 'piso_id';

//     if (!itemId) {
//       return NextResponse.json({ error: 'ID de producto o piso requerido' }, { status: 400 });
//     }

//     // 4. Verificar Stock en la tabla correspondiente
//     const { data: item, error: itemError } = await supabase
//       .from(tableName)
//       .select('stock')
//       .eq('id', itemId)
//       .single();

//     if (itemError || !item) {
//       return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
//     }

//     if (item.stock < cantidad) {
//       return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 });
//     }

//     // 5. Verificar si ya existe en el carrito del usuario
//     const { data: existing } = await supabase
//       .from('carritos')
//       .select('*')
//       .eq('usuario_id', result.data.id)
//       .eq(idColumn, itemId)
//       .single();

//     if (existing) {
//       const nuevaCantidad = existing.cantidad + cantidad;
//       if (nuevaCantidad > item.stock) {
//         return NextResponse.json({ error: 'Excede el stock disponible' }, { status: 400 });
//       }

//       const { error: upError } = await supabase
//         .from('carritos')
//         .update({ cantidad: nuevaCantidad })
//         .eq('id', existing.id);

//       if (upError) throw upError;
//       return NextResponse.json({ message: 'Cantidad actualizada' });
//     } else {
//       // 6. Insertar nuevo registro
//       const { error: insError } = await supabase
//         .from('carritos')
//         .insert([{
//           usuario_id: result.data.id,
//           [idColumn]: itemId, // Inserta en piso_id o producto_id dinámicamente
//           cantidad,
//           item_type: itemType
//         }]);

//       if (insError) throw insError;
//       return NextResponse.json({ message: 'Agregado al carrito' });
//     }
//   } catch (error) {
//     console.error('Error en API agregar:', error);
//     return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
//   }
// }





// app/api/carrito/agregar/route.js

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarToken } from '@/lib/auth';

export async function POST(request) {
  try {
    // 1. Validar autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const result = verificarToken(token);
    if (!result.valid) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // 2. Obtener datos del cuerpo
    const body = await request.json();
    const { productoId, pisoId, cantidad = 1 } = body;

    // 3. Unificar ID (aceptamos ambos nombres para compatibilidad)
    const itemId = productoId || pisoId;
    if (!itemId) {
      return NextResponse.json({ error: 'ID de producto requerido' }, { status: 400 });
    }

    // 4. Verificar stock en la tabla unificada 'products'
    const { data: item, error: itemError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', itemId)
      .single();

    if (itemError || !item) {
      console.error('Producto no encontrado:', itemId);
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    if (item.stock < cantidad) {
      return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 });
    }

    // 5. Verificar si ya existe en el carrito del usuario
    const { data: existing, error: existingError } = await supabase
      .from('carritos')
      .select('*')
      .eq('usuario_id', result.data.id)
      .eq('producto_id', itemId)
      .maybeSingle(); // no lanza error si no existe

    if (existing) {
      // Actualizar cantidad
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
      // Insertar nuevo registro (siempre como 'product')
      const { error: insError } = await supabase
        .from('carritos')
        .insert([{
          usuario_id: result.data.id,
          producto_id: itemId,
          cantidad,
          item_type: 'product'
          // piso_id queda null
        }]);

      if (insError) throw insError;
      return NextResponse.json({ message: 'Agregado al carrito' });
    }
  } catch (error) {
    console.error('Error en API agregar:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}