
// import { supabase } from '@/lib/supabase';
// import { NextResponse } from 'next/server';
// import { verificarToken } from '@/lib/auth';

// export async function GET(request) {
//   try {
//     const token = request.headers.get('authorization')?.split(' ')[1];
//     if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

//     const verificado = verificarToken(token);
//     if (!verificado.valid) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

//     const payload = verificado.data;

//     const { data: pedidos, error } = await supabase
//       .from('pedidos_pendientes')
//       .select('*')
//       .eq('usuario_id', payload.id)
//       .order('fecha', { ascending: false });

//     if (error) {
//       console.error('Error al obtener pedidos:', error);
//       return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
//     }

//     return NextResponse.json({ pedidos });
//   } catch {
//     return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     const token = request.headers.get('authorization')?.split(' ')[1];
//     if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

//     const verificado = verificarToken(token);
//     if (!verificado.valid) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

//     const payload = verificado.data;
    
//     // Leer todos los campos del body
//     const body = await request.json();
//     const { 
//       items, 
//       subtotal, 
//       gastoManiobra, 
//       total, 
//       conFactura, 
//       telefono_contacto,
//       direccion_entrega,
//       direccion_google,
//       rfc,
//       domicilio_fiscal,
//       ciudad,
//       estado,
//       codigo_postal,
//       regimen_fiscal,
//       numeroFactura 
//     } = body;

//     // Log para depuración (verás en la terminal de Next.js)
//     console.log('📦 Body recibido en POST /api/pedidos:', body);

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return NextResponse.json({ error: 'El pedido debe tener al menos un item' }, { status: 400 });
//     }

//     // Insertar con todas las columnas
//     const { data, error } = await supabase
//       .from('pedidos_pendientes')
//       .insert([{
//         usuario_id: payload.id,
//         items,
//         subtotal,
//         gasto_maniobra: gastoManiobra,
//         total,
//         con_factura: conFactura,
//         telefono_contacto,
//         direccion_entrega,
//         direccion_google: direccion_google || null,
//         rfc: conFactura ? rfc : null,
//         domicilio_fiscal: conFactura ? domicilio_fiscal : null,
//         ciudad: conFactura ? ciudad : null,
//         estado: conFactura ? estado : null,
//         codigo_postal: conFactura ? codigo_postal : null,
//         regimen_fiscal: conFactura ? regimen_fiscal : null,
//         numero_factura: conFactura ? numeroFactura : null,
//         estado: 'despachando'
//       }])
//       .select()
//       .single();

//     if (error) {
//       console.error('❌ Error al guardar pedido:', error);
//       return NextResponse.json({ error: 'Error al guardar el pedido' }, { status: 500 });
//     }

//     console.log('✅ Pedido guardado:', data.id);
//     return NextResponse.json({ pedido: data });
//   } catch (error) {
//     console.error('❌ Error en endpoint pedidos:', error);
//     return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
//   }
// }




import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { verificarToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const verificado = verificarToken(token);
    if (!verificado.valid) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const payload = verificado.data;

    const { data: pedidos, error } = await supabase
      .from('pedidos_pendientes')
      .select('*')
      .eq('usuario_id', payload.id)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error al obtener pedidos:', error);
      return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
    }

    return NextResponse.json({ pedidos });
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const verificado = verificarToken(token);
    if (!verificado.valid) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const payload = verificado.data;
    const { 
      items, 
      subtotal, 
      gastoManiobra, 
      total, 
      conFactura, 
      telefono_contacto,
      direccion_entrega,
      direccion_google,
      rfc,
      domicilio_fiscal,
      ciudad,
      estado,              // ← estado de la república (Colima/Jalisco) – se guarda en columna "estado"
      codigo_postal,
      regimen_fiscal,
      numeroFactura 
    } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'El pedido debe tener al menos un item' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pedidos_pendientes')
      .insert([{
        usuario_id: payload.id,
        items,
        subtotal,
        gasto_maniobra: gastoManiobra,
        total,
        con_factura: conFactura,
        telefono_contacto,
        direccion_entrega,
        direccion_google: direccion_google || null,
        rfc: conFactura ? rfc : null,
        domicilio_fiscal: conFactura ? domicilio_fiscal : null,
        ciudad: conFactura ? ciudad : null,
        estado: conFactura ? estado : null,                // ← columna "estado" (fiscal)
        codigo_postal: conFactura ? codigo_postal : null,
        regimen_fiscal: conFactura ? regimen_fiscal : null,
        numero_factura: conFactura ? numeroFactura : null,
        estatus_pedido: 'Procesando pedido'                // ← nuevo campo
      }])
      .select()
      .single();

    if (error) {
      console.error('Error al guardar pedido:', error);
      return NextResponse.json({ error: 'Error al guardar el pedido' }, { status: 500 });
    }

    return NextResponse.json({ pedido: data });
  } catch (error) {
    console.error('Error en endpoint pedidos:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}