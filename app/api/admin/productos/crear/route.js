// // // app/api/admin/productos/crear/route.js

// // import { NextResponse } from 'next/server';
// // import { verificarAdmin } from '@/lib/adminAuth';
// // import { supabase } from '@/lib/supabase';

// // const CAMPOS_PERMITIDOS = [
// //   'codigo',
// //   'nombre',
// //   'descripcion',
// //   'precio',
// //   'precio_anterior',
// //   'stock',
// //   'imagen_url',
// //   'linea',
// //   'categoria',
// //   'coleccion',
// //   'formato',
// //   'acabado',
// //   'pei',
// //   'cuerpo',
// //   'm2_por_caja',
// //   'nombre_comercial'
// // ];

// // const CAMPOS_NUMERICOS = ['precio', 'precio_anterior', 'stock', 'm2_por_caja'];

// // function validarCamposPorLinea(data) {
// //   const errores = [];

// //   // 1. Código siempre obligatorio
// //   if (!data.codigo) errores.push('codigo');

// //   // 2. Campos básicos siempre obligatorios
// //   const basicos = ['nombre', 'descripcion', 'precio', 'precio_anterior', 'stock', 'imagen_url', 'linea', 'categoria'];
// //   for (const campo of basicos) {
// //     if (data[campo] === undefined || data[campo] === null || data[campo] === '') {
// //       errores.push(campo);
// //     }
// //   }

// //   // 3. Validación según la línea
// //   const linea = data.linea;

// //   if (linea === 'Junteador' || linea === 'Pisos') {
// //     const tecnicos = ['coleccion', 'formato', 'acabado', 'pei', 'cuerpo', 'm2_por_caja', 'nombre_comercial'];
// //     for (const campo of tecnicos) {
// //       if (!data[campo] && data[campo] !== 0) {
// //         errores.push(campo);
// //       }
// //     }
// //   } else if (linea === 'Decorados') {
// //     const decorados = ['coleccion', 'formato', 'acabado'];
// //     for (const campo of decorados) {
// //       if (!data[campo] && data[campo] !== 0) {
// //         errores.push(campo);
// //       }
// //     }
// //   }
// //   // Para otras líneas (Pegamentos, Azulejos, etc.) solo se exigen los básicos + código

// //   return errores;
// // }

// // export async function POST(request) {
// //   const adminCheck = await verificarAdmin(request);
// //   if (!adminCheck.authorized) return adminCheck.response;

// //   try {
// //     const body = await request.json();

// //     // Limpiar datos: solo campos permitidos y convertir vacíos numéricos a null
// //     const datosLimpios = Object.keys(body)
// //       .filter(key => CAMPOS_PERMITIDOS.includes(key))
// //       .reduce((obj, key) => {
// //         let valor = body[key];
// //         if (CAMPOS_NUMERICOS.includes(key) && valor === '') {
// //           valor = null;
// //         }
// //         obj[key] = valor;
// //         return obj;
// //       }, {});

// //     // Validar
// //     const errores = validarCamposPorLinea(datosLimpios);
// //     if (errores.length > 0) {
// //       console.log('Campos faltantes en creación:', errores); // Para depuración
// //       return NextResponse.json(
// //         { error: 'Campos obligatorios faltantes', campos: errores },
// //         { status: 400 }
// //       );
// //     }

// //     const { data: producto, error } = await supabase
// //       .from('products')
// //       .insert([datosLimpios])
// //       .select()
// //       .single();

// //     if (error) throw error;

// //     return NextResponse.json({ success: true, producto });
// //   } catch (error) {
// //     console.error('Error al crear producto:', error);
// //     return NextResponse.json(
// //       { error: 'Error al crear producto: ' + error.message },
// //       { status: 500 }
// //     );
// //   }
// // }


// import { NextResponse } from 'next/server';
// import { verificarAdmin } from '@/lib/adminAuth';
// import { supabase } from '@/lib/supabase';

// const CAMPOS_PERMITIDOS = [
//   'codigo',
//   'nombre',
//   'descripcion',
//   'precio',
//   'precio_anterior',
//   'stock',
//   'imagen_url',
//   'linea',
//   'categoria',
//   'coleccion',
//   'formato',
//   'acabado',
//   'pei',
//   'cuerpo',
//   'm2_por_caja',
//   'nombre_comercial',
//   'pegamento_sugerido', // NUEVO CAMPO
//   'junteador_sugerido'
// ];

// const CAMPOS_NUMERICOS = ['precio', 'precio_anterior', 'stock', 'm2_por_caja'];

// function validarCamposPorLinea(data) {
//   const errores = [];

//   // 1. Código siempre obligatorio
//   if (!data.codigo) errores.push('codigo');

//   // 2. Campos básicos siempre obligatorios
//   const basicos = ['nombre', 'descripcion', 'precio', 'precio_anterior', 'stock', 'imagen_url', 'linea', 'categoria'];
//   for (const campo of basicos) {
//     if (data[campo] === undefined || data[campo] === null || data[campo] === '') {
//       errores.push(campo);
//     }
//   }

//   // 3. Validación según la línea
//   const linea = data.linea;

//   // Líneas que requieren campos técnicos completos (Pisos, Azulejos, Junteador)
//   if (linea === 'Pisos' || linea === 'Azulejos' || linea === 'Junteador') {
//     const tecnicos = ['coleccion', 'formato', 'acabado', 'pei', 'cuerpo', 'm2_por_caja', 'nombre_comercial'];
//     for (const campo of tecnicos) {
//       if (!data[campo] && data[campo] !== 0) {
//         errores.push(campo);
//       }
//     }
//   } else if (linea === 'Decorados') {
//     const decorados = ['coleccion', 'formato', 'acabado'];
//     for (const campo of decorados) {
//       if (!data[campo] && data[campo] !== 0) {
//         errores.push(campo);
//       }
//     }
//   }
//   // Para otras líneas (Pegamentos, etc.) solo se exigen los básicos + código

//   // 4. Validación de pegamento_sugerido para líneas específicas
//   const lineasConPegamento = ['Pisos', 'Decorados', 'Azulejos']; // Añadir 'Piedras' si es necesario
//   if (lineasConPegamento.includes(linea)) {
//     if (!data.pegamento_sugerido || data.pegamento_sugerido.trim() === '') {
//       errores.push('pegamento_sugerido');
//     }
//   }

//   return errores;
// }

// export async function POST(request) {
//   const adminCheck = await verificarAdmin(request);
//   if (!adminCheck.authorized) return adminCheck.response;

//   try {
//     const body = await request.json();

//     // Limpiar datos: solo campos permitidos y convertir vacíos numéricos a null
//     const datosLimpios = Object.keys(body)
//       .filter(key => CAMPOS_PERMITIDOS.includes(key))
//       .reduce((obj, key) => {
//         let valor = body[key];
//         if (CAMPOS_NUMERICOS.includes(key) && valor === '') {
//           valor = null;
//         }
//         obj[key] = valor;
//         return obj;
//       }, {});

//     // Validar
//     const errores = validarCamposPorLinea(datosLimpios);
//     if (errores.length > 0) {
//       console.log('Campos faltantes en creación:', errores); // Para depuración
//       return NextResponse.json(
//         { error: 'Campos obligatorios faltantes', campos: errores },
//         { status: 400 }
//       );
//     }

//     const { data: producto, error } = await supabase
//       .from('products')
//       .insert([datosLimpios])
//       .select()
//       .single();

//     if (error) throw error;

//     return NextResponse.json({ success: true, producto });
//   } catch (error) {
//     console.error('Error al crear producto:', error);
//     return NextResponse.json(
//       { error: 'Error al crear producto: ' + error.message },
//       { status: 500 }
//     );
//   }
// }



// app/api/admin/productos/crear/route.js

import { NextResponse } from 'next/server';
import { verificarAdmin } from '@/lib/adminAuth';
import { supabase } from '@/lib/supabase';

const CAMPOS_PERMITIDOS = [
  'codigo', 'nombre', 'nombre_comercial', 'descripcion', 'precio', 'precio_anterior',
  'stock', 'imagen_url', 'categoria', 'linea', 'coleccion', 'formato', 'acabado',
  'pei', 'cuerpo', 'm2_por_caja', 'pegamento_sugerido', 'junteador_sugerido'
];
const CAMPOS_NUMERICOS = ['precio', 'precio_anterior', 'stock', 'm2_por_caja'];

function validarCamposPorLinea(data) {
  const errores = [];
  const basicos = ['codigo', 'nombre', 'descripcion', 'precio', 'precio_anterior', 'stock', 'categoria', 'linea'];
  for (const campo of basicos) {
    if (!data[campo] && data[campo] !== 0) errores.push(campo);
  }

  const linea = data.linea;
  if (linea === 'Pisos' || linea === 'Azulejos') {
    const tecnicos = ['coleccion', 'formato', 'acabado', 'pei', 'cuerpo', 'm2_por_caja'];
    for (const campo of tecnicos) {
      if (!data[campo] && data[campo] !== 0) errores.push(campo);
    }
  } else if (linea === 'Decorados') {
    const tecnicos = ['coleccion', 'formato', 'm2_por_caja'];
    for (const campo of tecnicos) {
      if (!data[campo] && data[campo] !== 0) errores.push(campo);
    }
  } else if (linea === 'Junteadores' || linea === 'Pegamentos') {
    if (!data.acabado) errores.push('acabado');
    if (!data.formato) errores.push('formato');
  } else if (linea === 'Fachaletas') {
    // Solo pegamento y junteador sugeridos, m2_por_caja opcional
    if (!data.pegamento_sugerido) errores.push('pegamento_sugerido');
    if (!data.junteador_sugerido) errores.push('junteador_sugerido');
  }

  // Para líneas de Pisos, Azulejos, Decorados y Fachaletas se requieren los sugeridos
  if (linea === 'Pisos' || linea === 'Azulejos' || linea === 'Decorados' || linea === 'Fachaletas') {
    if (!data.pegamento_sugerido) errores.push('pegamento_sugerido');
    if (!data.junteador_sugerido) errores.push('junteador_sugerido');
  }

  return errores;
}

export async function POST(request) {
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) return adminCheck.response;

  try {
    const body = await request.json();

    const datosLimpios = Object.keys(body)
      .filter(key => CAMPOS_PERMITIDOS.includes(key))
      .reduce((obj, key) => {
        let valor = body[key];
        if (CAMPOS_NUMERICOS.includes(key) && valor === '') valor = null;
        obj[key] = valor;
        return obj;
      }, {});

    const errores = validarCamposPorLinea(datosLimpios);
    if (errores.length > 0) {
      return NextResponse.json(
        { error: 'Campos obligatorios faltantes', campos: errores },
        { status: 400 }
      );
    }

    const { data: producto, error } = await supabase
      .from('products')
      .insert([datosLimpios])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, producto });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { error: 'Error al crear producto: ' + error.message },
      { status: 500 }
    );
  }
}