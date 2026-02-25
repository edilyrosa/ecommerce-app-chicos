// // app/api/carrito/ajustar/route
// import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';
// import { verificarToken } from '@/lib/auth';

// export async function POST(request) {
//   try {
//     const authHeader = request.headers.get('authorization');

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const result = verificarToken(token);

//     if (!result.valid) {
//       return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
//     }

//     const { carritoId, delta } = await request.json();

//     if (!carritoId || typeof delta !== 'number') {
//       return NextResponse.json({ error: 'carritoId y delta son requeridos' }, { status: 400 });
//     }

//     //* Obtener carrito y producto
//     const { data: item, error: itemError } = await supabase
//       .from('carritos')
//       .select(`
//         id,
//         cantidad,
//         producto_id,
//         products ( id, nombre, stock )
//       `)
//       .eq('id', carritoId)
//       .eq('usuario_id', result.data.id)
//       .single();

//     if (itemError || !item) {
//       return NextResponse.json({ error: 'Item no encontrado o no autorizado' }, { status: 404 });
//     }

//     const producto = item.products;
//     const nuevaCantidad = Number(item.cantidad) + Number(delta);

//     if (delta > 0) {
//       if (producto.stock < nuevaCantidad) {
//         return NextResponse.json({ error: 'Stock insuficiente', details: { producto_id: producto.id, nombre: producto.nombre, stock: producto.stock, solicitado: nuevaCantidad } }, { status: 400 });
//       }
//     }

//     if (nuevaCantidad <= 0) {
//       // Eliminar item del carrito
//       const { error: deleteError } = await supabase
//         .from('carritos')
//         .delete()
//         .eq('id', carritoId)
//         .eq('usuario_id', result.data.id);

//       if (deleteError) {
//         console.error('Error al eliminar item del carrito:', deleteError);
//         return NextResponse.json({ error: 'Error al eliminar item' }, { status: 500 });
//       }

//       return NextResponse.json({ message: 'Item eliminado' });
//     }

//     // Actualizar cantidad
//     const { data: updated, error: updateError } = await supabase
//       .from('carritos')
//       .update({ cantidad: nuevaCantidad })
//       .eq('id', carritoId)
//       .select()
//       .single();

//     if (updateError) {
//       console.error('Error al actualizar cantidad:', updateError);
//       return NextResponse.json({ error: 'Error al actualizar cantidad' }, { status: 500 });
//     }

//     return NextResponse.json({ message: 'Cantidad actualizada', item: updated });
//   } catch (error) {
//     console.error('Error en ajustar carrito:', error);
//     return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
//   }
// }


//!version con la tabla 'pisos'

// app/api/carrito/ajustar/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const result = verificarToken(token);

    if (!result.valid) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { carritoId, delta } = await request.json();

    if (!carritoId || typeof delta !== 'number') {
      return NextResponse.json({ error: 'carritoId y delta son requeridos' }, { status: 400 });
    }

    //* Paso 1: Obtener item del carrito para saber el tipo
    const { data: carritoItem, error: carritoError } = await supabase
      .from('carritos')
      .select('id, cantidad, item_type, producto_id, piso_id')
      .eq('id', carritoId)
      .eq('usuario_id', result.data.id)
      .single();

    if (carritoError || !carritoItem) {
      return NextResponse.json({ error: 'Item no encontrado o no autorizado' }, { status: 404 });
    }

    //* Paso 2: Obtener datos del producto o piso según el tipo
    const itemType = carritoItem.item_type;
    const itemId = itemType === 'product' ? carritoItem.producto_id : carritoItem.piso_id;
    const tableName = itemType === 'product' ? 'products' : 'pisos';

    const { data: item, error: itemError } = await supabase
      .from(tableName)
      .select('id, nombre, stock')
      .eq('id', itemId)
      .single();

    if (itemError || !item) {
      return NextResponse.json({ 
        error: `${itemType === 'product' ? 'Producto' : 'Piso'} no encontrado` 
      }, { status: 404 });
    }

    const nuevaCantidad = Number(carritoItem.cantidad) + Number(delta);

    //* Validar stock si se está incrementando
    if (delta > 0) {
      if (item.stock < nuevaCantidad) {
        return NextResponse.json({ 
          error: 'Stock insuficiente', 
          details: { 
            id: item.id, 
            nombre: item.nombre, 
            stock: item.stock, 
            solicitado: nuevaCantidad 
          } 
        }, { status: 400 });
      }
    }

    //* Si la nueva cantidad es 0 o menor, eliminar del carrito
    if (nuevaCantidad <= 0) {
      const { error: deleteError } = await supabase
        .from('carritos')
        .delete()
        .eq('id', carritoId)
        .eq('usuario_id', result.data.id);

      if (deleteError) {
        console.error('Error al eliminar item del carrito:', deleteError);
        return NextResponse.json({ error: 'Error al eliminar item' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Item eliminado' });
    }

    //* Actualizar cantidad
    const { data: updated, error: updateError } = await supabase
      .from('carritos')
      .update({ cantidad: nuevaCantidad })
      .eq('id', carritoId)
      .select()
      .single();

    if (updateError) {
      console.error('Error al actualizar cantidad:', updateError);
      return NextResponse.json({ error: 'Error al actualizar cantidad' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Cantidad actualizada', item: updated });
  } catch (error) {
    console.error('Error en ajustar carrito:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}