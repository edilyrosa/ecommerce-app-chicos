// import { NextResponse } from 'next/server';
// import { Resend } from 'resend';

// // Inicializar Resend con tu API key
// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request) {
//   try {
//     const { pedido, usuario } = await request.json();

//     // Validar datos mínimos
//     if (!pedido || !usuario) {
//       return NextResponse.json(
//         { error: 'Faltan datos del pedido' },
//         { status: 400 }
//       );
//     }

//     // Formatear los items para el email
//     const itemsHTML = pedido.items.map(item => `
//       <tr>
//         <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.id || 'N/A'}</td>
//         <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.nombre}</td>
//         <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.cantidad}</td>
//         <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${Number(item.precio).toFixed(2)}</td>
//         <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.cantidad * item.precio).toFixed(2)}</td>
//       </tr>
//     `).join('');

//     // Determinar si tiene factura
//     const tipoComprobante = pedido.conFactura ? 'CON FACTURA' : 'SIN FACTURA';

//     // Construir HTML del email
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <div style="background-color: #00162f; color: white; padding: 20px; text-align: center;">
//           <h1 style="margin: 0;">Nuevo Pedido #${pedido.id}</h1>
//         </div>
        
//         <div style="padding: 20px;">
//           <h2 style="color: #00162f;">Detalles del Cliente</h2>
//           <p><strong>Nombre:</strong> ${usuario.nombre}</p>
//           <p><strong>Email:</strong> ${usuario.email}</p>
//           <p><strong>Teléfono de contacto:</strong> ${pedido.telefono_contacto || 'No proporcionado'}</p>
//           <p><strong>Dirección de entrega:</strong> ${pedido.direccion_entrega || 'No proporcionada'}</p>
//           <p><strong>Tipo:</strong> ${tipoComprobante}</p>
          
//           ${pedido.conFactura ? `
//             <h3 style="color: #00162f; margin-top: 20px;">Datos Fiscales</h3>
//             <p><strong>RFC:</strong> ${pedido.rfc}</p>
//             <p><strong>Domicilio Fiscal:</strong> ${pedido.domicilio_fiscal}</p>
//             <p><strong>Ciudad/Estado:</strong> ${pedido.ciudad}, ${pedido.estado} CP: ${pedido.codigo_postal}</p>
//             <p><strong>Régimen Fiscal:</strong> ${pedido.regimen_fiscal}</p>
//           ` : ''}
          
//           <h2 style="color: #00162f; margin-top: 20px;">Productos</h2>
//           <table style="width: 100%; border-collapse: collapse;">
//             <thead>
//               <tr style="background-color: #f3f4f6;">
//                 <th style="padding: 8px; text-align: left;">Artículo</th>
//                 <th style="padding: 8px; text-align: left;">Nombre</th>
//                 <th style="padding: 8px; text-align: center;">Cant.</th>
//                 <th style="padding: 8px; text-align: right;">Precio</th>
//                 <th style="padding: 8px; text-align: right;">Importe</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${itemsHTML}
//             </tbody>
//           </table>
          
//           <div style="margin-top: 20px; border-top: 2px solid #00162f; padding-top: 15px;">
//             <div style="display: flex; justify-content: space-between; font-size: 16px;">
//               <span><strong>Subtotal:</strong></span>
//               <span>$${Number(pedido.subtotal).toFixed(2)}</span>
//             </div>
//             <div style="display: flex; justify-content: space-between; font-size: 16px; margin-top: 5px;">
//               <span><strong>Gastos de Maniobra (4%):</strong></span>
//               <span>$${Number(pedido.gasto_maniobra).toFixed(2)}</span>
//             </div>
//             <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; margin-top: 10px; color: #00162f;">
//               <span>TOTAL:</span>
//               <span>$${Number(pedido.total).toFixed(2)}</span>
//             </div>
//           </div>
          
//           ${pedido.numero_factura ? `
//             <p style="margin-top: 20px; color: #666; font-size: 14px;">
//               Número de factura: ${pedido.numero_factura}
//             </p>
//           ` : ''}
//         </div>
        
//         <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
//           <p style="margin: 0; color: #666; font-size: 12px;">
//             Este es un mensaje automático del sistema de pedidos.<br>
//             Bodega de Azulejos
//           </p>
//         </div>
//       </div>
//     `;

//     //*=============================== Enviar el email
//     const { data, error } = await resend.emails.send({
//         from: 'onboarding@resend.dev',
//         to: ['edilyrosa@gmail.com'], //* Email del administrador
//         subject: `Nuevo Pedido #${pedido.id} - ${usuario.nombre}`,
//         html: html,
//     });

//     if (error) {
//       console.error('Error al enviar email:', error);
//       return NextResponse.json(
//         { error: 'Error al enviar el email' },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     console.error('Error en endpoint:', error);
//     return NextResponse.json(
//       { error: 'Error interno del servidor' },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY); // mejor usar variable de entorno

export async function POST(request) {
  try {
    const { pedido, usuario } = await request.json();

    if (!pedido || !usuario) {
      return NextResponse.json(
        { error: 'Faltan datos del pedido' },
        { status: 400 }
      );
    }

    const itemsHTML = pedido.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.id || 'N/A'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.nombre}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.cantidad}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${Number(item.precio).toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.cantidad * item.precio).toFixed(2)}</td>
      </tr>
    `).join('');

    const tipoComprobante = pedido.conFactura ? 'CON FACTURA' : 'SIN FACTURA';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #00162f; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Nuevo Pedido #${pedido.id}</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #00162f;">Detalles del Cliente</h2>
          <p><strong>Nombre:</strong> ${usuario.nombre}</p>
          <p><strong>Email:</strong> ${usuario.email}</p>
          <p><strong>Teléfono de contacto:</strong> ${pedido.telefono_contacto || 'No proporcionado'}</p>
          <p><strong>Dirección de entrega:</strong> ${pedido.direccion_entrega || 'No proporcionada'}</p>
          <p><strong>Tipo:</strong> ${tipoComprobante}</p>
          
          ${pedido.conFactura ? `
            <h3 style="color: #00162f; margin-top: 20px;">Datos Fiscales</h3>
            <p><strong>RFC:</strong> ${pedido.rfc}</p>
            <p><strong>Domicilio Fiscal:</strong> ${pedido.domicilio_fiscal}</p>
            <p><strong>Ciudad/Estado:</strong> ${pedido.ciudad}, ${pedido.estado} CP: ${pedido.codigo_postal}</p>
            <p><strong>Régimen Fiscal:</strong> ${pedido.regimen_fiscal}</p>
          ` : ''}
          
          <h2 style="color: #00162f; margin-top: 20px;">Productos</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 8px; text-align: left;">Artículo</th>
                <th style="padding: 8px; text-align: left;">Nombre</th>
                <th style="padding: 8px; text-align: center;">Cant.</th>
                <th style="padding: 8px; text-align: right;">Precio</th>
                <th style="padding: 8px; text-align: right;">Importe</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; border-top: 2px solid #00162f; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; font-size: 16px;">
              <span><strong>Subtotal:</strong></span>
              <span>$${Number(pedido.subtotal).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 16px; margin-top: 5px;">
              <span><strong>Gastos de Maniobra (4%):</strong></span>
              <span>$${Number(pedido.gasto_maniobra).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; margin-top: 10px; color: #00162f;">
              <span>TOTAL:</span>
              <span>$${Number(pedido.total).toFixed(2)}</span>
            </div>
          </div>
          
          ${pedido.numero_factura ? `
            <p style="margin-top: 20px; color: #666; font-size: 14px;">
              Número de factura: ${pedido.numero_factura}
            </p>
          ` : ''}
        </div>
        <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            Este es un mensaje automático del sistema de pedidos.<br>
            Bodega de Azulejos
          </p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['edilyrosa@gmail.com'], // aquí el correo del administrador
      subject: `Nuevo Pedido #${pedido.id} - ${usuario.nombre}`,
      html: html,
    });

    if (error) {
      console.error('Error al enviar email:', error);
      return NextResponse.json(
        { error: 'Error al enviar el email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error en endpoint:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}