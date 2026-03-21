// // app/api/admin/productos/editar/route.js

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
//   'nombre_comercial'
// ];

// const CAMPOS_NUMERICOS = ['precio', 'precio_anterior', 'stock', 'm2_por_caja'];

// function validarCamposPorLinea(data) {
//   const errores = [];

//   // En edición, si se envía código debe tener valor
//   if (data.hasOwnProperty('codigo') && !data.codigo) {
//     errores.push('codigo');
//   }

//   const basicos = ['nombre', 'descripcion', 'precio', 'precio_anterior', 'stock', 'imagen_url', 'linea', 'categoria'];
//   for (const campo of basicos) {
//     if (data[campo] === undefined || data[campo] === null || data[campo] === '') {
//       errores.push(campo);
//     }
//   }

//   const linea = data.linea;

//   if (linea === 'Junteador' || linea === 'Pisos') {
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

//   return errores;
// }

// export async function PUT(request) {
//   const adminCheck = await verificarAdmin(request);
//   if (!adminCheck.authorized) return adminCheck.response;

//   try {
//     const body = await request.json();
//     const { id, ...updateData } = body;

//     if (!id) {
//       return NextResponse.json(
//         { error: 'ID del producto es requerido' },
//         { status: 400 }
//       );
//     }

//     const datosLimpios = Object.keys(updateData)
//       .filter(key => CAMPOS_PERMITIDOS.includes(key))
//       .reduce((obj, key) => {
//         let valor = updateData[key];
//         if (CAMPOS_NUMERICOS.includes(key) && valor === '') {
//           valor = null;
//         }
//         obj[key] = valor;
//         return obj;
//       }, {});

//     // Validar unicidad del código si se está actualizando
//     if (datosLimpios.codigo) {
//       const { data: existing } = await supabase
//         .from('products')
//         .select('id')
//         .eq('codigo', datosLimpios.codigo)
//         .neq('id', id)
//         .maybeSingle();
//       if (existing) {
//         return NextResponse.json(
//           { error: 'El código ya está en uso por otro producto' },
//           { status: 400 }
//         );
//       }
//     }

//     const errores = validarCamposPorLinea(datosLimpios);
//     if (errores.length > 0) {
//       console.log('Campos faltantes en edición:', errores);
//       return NextResponse.json(
//         { error: 'Campos obligatorios faltantes', campos: errores },
//         { status: 400 }
//       );
//     }

//     const { data: producto, error } = await supabase
//       .from('products')
//       .update(datosLimpios)
//       .eq('id', id)
//       .select()
//       .single();

//     if (error) throw error;

//     return NextResponse.json({ success: true, producto });
//   } catch (error) {
//     console.error('Error al editar producto:', error);
//     return NextResponse.json(
//       { error: 'Error al editar producto: ' + error.message },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from 'next/server';
import { verificarAdmin } from '@/lib/adminAuth';
import { supabase } from '@/lib/supabase';

const CAMPOS_PERMITIDOS = [
  'codigo',
  'nombre',
  'descripcion',
  'precio',
  'precio_anterior',
  'stock',
  'imagen_url',
  'linea',
  'categoria',
  'coleccion',
  'formato',
  'acabado',
  'pei',
  'cuerpo',
  'm2_por_caja',
  'nombre_comercial',
  'pegamento_sugerido', // NUEVO CAMPO
  'junteador_sugerido'
];

const CAMPOS_NUMERICOS = ['precio', 'precio_anterior', 'stock', 'm2_por_caja'];

function validarCamposPorLinea(data) {
  const errores = [];

  // En edición, si se envía código debe tener valor
  if (data.hasOwnProperty('codigo') && !data.codigo) {
    errores.push('codigo');
  }

  const basicos = ['nombre', 'descripcion', 'precio', 'precio_anterior', 'stock', 'imagen_url', 'linea', 'categoria'];
  for (const campo of basicos) {
    if (data[campo] === undefined || data[campo] === null || data[campo] === '') {
      errores.push(campo);
    }
  }

  const linea = data.linea;

  // Líneas que requieren campos técnicos completos (Pisos, Azulejos, Junteador)
  if (linea === 'Pisos' || linea === 'Azulejos' || linea === 'Junteador') {
    const tecnicos = ['coleccion', 'formato', 'acabado', 'pei', 'cuerpo', 'm2_por_caja', 'nombre_comercial'];
    for (const campo of tecnicos) {
      if (!data[campo] && data[campo] !== 0) {
        errores.push(campo);
      }
    }
  } else if (linea === 'Decorados') {
    const decorados = ['coleccion', 'formato', 'acabado'];
    for (const campo of decorados) {
      if (!data[campo] && data[campo] !== 0) {
        errores.push(campo);
      }
    }
  }

  // Validación de pegamento_sugerido para líneas específicas
  const lineasConPegamento = ['Pisos', 'Decorados', 'Azulejos'];
  if (lineasConPegamento.includes(linea)) {
    if (!data.pegamento_sugerido || data.pegamento_sugerido.trim() === '') {
      errores.push('pegamento_sugerido');
    }
  }

  return errores;
}

export async function PUT(request) {
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) return adminCheck.response;

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      );
    }

    const datosLimpios = Object.keys(updateData)
      .filter(key => CAMPOS_PERMITIDOS.includes(key))
      .reduce((obj, key) => {
        let valor = updateData[key];
        if (CAMPOS_NUMERICOS.includes(key) && valor === '') {
          valor = null;
        }
        obj[key] = valor;
        return obj;
      }, {});

    // Validar unicidad del código si se está actualizando
    if (datosLimpios.codigo) {
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('codigo', datosLimpios.codigo)
        .neq('id', id)
        .maybeSingle();
      if (existing) {
        return NextResponse.json(
          { error: 'El código ya está en uso por otro producto' },
          { status: 400 }
        );
      }
    }

    const errores = validarCamposPorLinea(datosLimpios);
    if (errores.length > 0) {
      console.log('Campos faltantes en edición:', errores);
      return NextResponse.json(
        { error: 'Campos obligatorios faltantes', campos: errores },
        { status: 400 }
      );
    }

    const { data: producto, error } = await supabase
      .from('products')
      .update(datosLimpios)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, producto });
  } catch (error) {
    console.error('Error al editar producto:', error);
    return NextResponse.json(
      { error: 'Error al editar producto: ' + error.message },
      { status: 500 }
    );
  }
}