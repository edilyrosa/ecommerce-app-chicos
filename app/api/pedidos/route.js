// //app/api/pedidos/route.js
// import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';
// import { verificarToken } from '@/lib/auth';

// export async function GET(request, { params }) {
//   try {
//     // 1. Obtener y verificar el token igual que en carrito
//     const authHeader = request.headers.get('authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       console.log('❌ No hay header Authorization o no empieza con Bearer');
//       return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const result = verificarToken(token);
//     if (!result.valid) {
//       console.log('❌ Token inválido');
//       return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
//     }

//     // 2. Obtener el ID del pedido desde la URL
//     const { id } = await params; // Importante: await params
//     console.log(`🔍 Buscando pedido ID: ${id} para usuario: ${result.data.id}`);

//     // 3. Consultar el pedido asegurando que pertenezca al usuario autenticado
//     const { data: pedido, error: pedidoError } = await supabase
//       .from('pedidos_pendientes')
//       .select('*')
//       .eq('id', id)
//       .eq('usuario_id', result.data.id)
//       .single();

//     if (pedidoError || !pedido) {
//       console.log('❌ Pedido no encontrado o no pertenece al usuario');
//       return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
//     }

//     // 4. Obtener datos del usuario (opcional, si necesitas nombre y email)
//     const { data: usuario, error: usuarioError } = await supabase
//       .from('usuarios')
//       .select('nombre, email')
//       .eq('id', result.data.id)
//       .single();

//     if (usuarioError) {
//       console.log('⚠️ No se pudo obtener datos del usuario:', usuarioError.message);
//     }

//     // 5. Formatear fecha
//     const fechaObj = new Date(pedido.fecha);
//     const fecha = fechaObj.toLocaleDateString('es-MX', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//     const hora = fechaObj.toLocaleTimeString('es-MX', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });

//     // 6. Construir objeto de respuesta en el formato que espera FacturaContent
//     const facturaData = {
//       id: pedido.id,
//       fecha,
//       hora,
//       usuario: {
//         nombre: usuario?.nombre || 'Cliente',
//         email: usuario?.email || ''
//       },
//       items: pedido.items,
//       numeroFactura: pedido.numero_factura,
//       conFactura: pedido.con_factura,
//       direccion_entrega: pedido.direccion_entrega,
//       telefono_contacto: pedido.telefono_contacto,
//       datos_fiscales: pedido.con_factura ? {
//         rfc: pedido.rfc,
//         domicilio_fiscal: pedido.domicilio_fiscal,
//         ciudad: pedido.ciudad,
//         estado: pedido.estado || '',
//         codigo_postal: pedido.codigo_postal,
//         regimen_fiscal: pedido.regimen_fiscal,
//         razon_social: pedido.razon_social || usuario?.nombre
//       } : null
//     };

//     console.log('✅ Pedido encontrado, enviando datos');
//     return NextResponse.json(facturaData, { status: 200 });

//   } catch (error) {
//     console.error('🔥 Error en endpoint pedido por id:', error);
//     return NextResponse.json(
//       { error: 'Error interno del servidor' },
//       { status: 500 }
//     );
//   }
// }





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
      rfc,
      domicilio_fiscal,
      razon_social,
      ciudad,
      estado,
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
      }])
      .select()
      .single();

    if (error) {
      console.error('Error al guardar pedido:', error);
      return NextResponse.json({ error: 'Error al guardar el pedido' }, { status: 500 });
    }

    return NextResponse.json({ pedido: data });
  } catch (error) {
    console.error('Error en endpoint pedidos POST:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}