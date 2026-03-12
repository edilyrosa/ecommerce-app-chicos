// app/api/pedidos/[id]/route.js
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { verificarToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    // Esperar params (en Next.js App Router, params es una promesa)
    const { id } = await params;

    // Verificar autenticación
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const verificado = verificarToken(token);
    if (!verificado.valid) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const payload = verificado.data; // contiene el id del usuario

    // Consultar el pedido por ID y usuario
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos_pendientes')
      .select('*')
      .eq('id', id)
      .eq('usuario_id', payload.id)
      .single();

    if (pedidoError || !pedido) {
      console.error('Error al obtener pedido:', pedidoError);
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Obtener datos del usuario
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .select('nombre, email')
      .eq('id', payload.id)
      .single();

    if (usuarioError) {
      console.error('Error al obtener usuario:', usuarioError);
      // Continuamos con valores por defecto
    }

    // Formatear fecha
    const fechaObj = new Date(pedido.fecha);
    const fecha = fechaObj.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const hora = fechaObj.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Construir respuesta
    const facturaData = {
      id: pedido.id,
      fecha,
      hora,
      usuario: {
        nombre: usuario?.nombre || 'Cliente',
        email: usuario?.email || ''
      },
      items: pedido.items,
      numeroFactura: pedido.numero_factura,
      conFactura: pedido.con_factura,
      direccion_entrega: pedido.direccion_entrega,
      telefono_contacto: pedido.telefono_contacto,
      datos_fiscales: pedido.con_factura ? {
        rfc: pedido.rfc,
        domicilio_fiscal: pedido.domicilio_fiscal,
        ciudad: pedido.ciudad,
        estado: pedido.estado || '',
        codigo_postal: pedido.codigo_postal,
        regimen_fiscal: pedido.regimen_fiscal,
        razon_social: pedido.razon_social || usuario?.nombre
      } : null
    };

    return NextResponse.json(facturaData, { status: 200 });

  } catch (error) {
    console.error('Error en endpoint pedido por id:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}