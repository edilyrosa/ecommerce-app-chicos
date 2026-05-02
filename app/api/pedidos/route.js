// //app/api/pedidos/route.js

// import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';
// import { verificarToken } from '@/lib/auth';

// export async function GET(request) {
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

//     const { data: pedidos, error } = await supabase
//       .from('pedidos_pendientes')
//       .select('*')
//       .eq('usuario_id', result.data.id)
//       .order('fecha', { ascending: false });

//     if (error) {
//       console.error('Error al obtener pedidos:', error);
//       return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
//     }

//     return NextResponse.json({ pedidos });
//   } catch (error) {
//     console.error('Error en GET /api/pedidos:', error);
//     return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
//   }
// }

// export async function POST(request) {
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

//     const payload = result.data;
//     const { 
//       items, 
//       subtotal, 
//       gastoManiobra, 
//       total, 
//       conFactura, 
//       codigo_postal_entrega,
//       telefono_contacto,
//       direccion_entrega,
//       direccion_google,
//       rfc,
//       domicilio_fiscal,
//       razon_social,
//       ciudad,
//       estado,
//       codigo_postal,
//       regimen_fiscal,
//       numeroFactura 
//     } = await request.json();

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return NextResponse.json({ error: 'El pedido debe tener al menos un item' }, { status: 400 });
//     }

//     const { data, error } = await supabase
//       .from('pedidos_pendientes')
//       .insert([{
//         usuario_id: payload.id,
//         items,
//         subtotal,
//         gasto_maniobra: gastoManiobra,
//         total,
//         con_factura: conFactura,
//         codigo_postal_entrega,
//         telefono_contacto,
//         direccion_entrega,
//         direccion_google: direccion_google || null,
//         rfc: conFactura ? rfc : null,
//         domicilio_fiscal: conFactura ? domicilio_fiscal : null,
//         razon_social: conFactura ? razon_social : null,
//         ciudad: conFactura ? ciudad : null,
//         estado: conFactura ? estado : null,
//         codigo_postal: conFactura ? codigo_postal : null,
//         regimen_fiscal: conFactura ? regimen_fiscal : null,
//         numero_factura: conFactura ? numeroFactura : null,
//         estatus_pedido: 'Procesando pedido'
//       }])
//       .select()
//       .single();

//     if (error) {
//       console.error('Error al guardar pedido:', error);
//       return NextResponse.json({ error: 'Error al guardar el pedido' }, { status: 500 });
//     }

//     return NextResponse.json({ pedido: data });
//   } catch (error) {
//     console.error('Error en endpoint pedidos POST:', error);
//     return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
//   }
// }



// app/api/pedidos/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarToken } from '@/lib/auth';

export async function GET(request) {
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

    const { data: pedidos, error } = await supabase
      .from('pedidos_pendientes')
      .select('*')
      .eq('usuario_id', result.data.id)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error al obtener pedidos:', error);
      return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
    }

    return NextResponse.json({ pedidos });
  } catch (error) {
    console.error('Error en GET /api/pedidos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request) {
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

    const payload = result.data;
    const body = await request.json();

    // Extraer todos los campos enviados por el frontend
    const {
      items,
      subtotal,
      gastoManiobra,
      total,
      conFactura,
      codigo_postal_entrega,
      telefono_contacto,
      direccion_entrega,
      direccion_google,
      costo_envio,           // <-- importante: costo de envío
      rfc,
      domicilio_fiscal,
      razon_social,
      ciudad,
      estado,
      codigo_postal,
      regimen_fiscal,
      numeroFactura
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'El pedido debe tener al menos un item' }, { status: 400 });
    }

    // Preparar el objeto a insertar (nombres de columnas en la tabla)
    const pedidoInsert = {
      usuario_id: payload.id,
      items,
      subtotal,
      gasto_maniobra: gastoManiobra,      // columna: gasto_maniobra
      costo_envio,                        // columna: costo_envio
      total,
      con_factura: conFactura,
      codigo_postal_entrega,
      telefono_contacto,
      direccion_entrega,
      direccion_google: direccion_google || null,
      rfc: conFactura ? rfc : null,
      domicilio_fiscal: conFactura ? domicilio_fiscal : null,
      razon_social: conFactura ? razon_social : null,
      ciudad: conFactura ? ciudad : null,
      estado: conFactura ? estado : null,
      codigo_postal: conFactura ? codigo_postal : null,
      regimen_fiscal: conFactura ? regimen_fiscal : null,
      numero_factura: conFactura ? numeroFactura : null,
      estatus_pedido: 'Procesando pedido'
    };

    // Insertar en Supabase
    const { data, error } = await supabase
      .from('pedidos_pendientes')
      .insert([pedidoInsert])
      .select()
      .single();

    if (error) {
      console.error('Error al guardar pedido:', error);
      // Si el error es de columna faltante, dar un mensaje claro
      if (error.message.includes('column "costo_envio" does not exist')) {
        return NextResponse.json(
          { error: 'La tabla pedidos_pendientes no tiene la columna costo_envio. Agrega la columna o ejecuta la migración.' },
          { status: 500 }
        );
      }
      return NextResponse.json({ error: 'Error al guardar el pedido: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ pedido: data });
  } catch (error) {
    console.error('Error en endpoint pedidos POST:', error);
    return NextResponse.json({ error: 'Error del servidor: ' + error.message }, { status: 500 });
  }
}