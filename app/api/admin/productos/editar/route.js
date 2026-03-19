// // // // // // // app/api/admin/productos/editar/route.js
// // // // // // import { NextResponse } from 'next/server';
// // // // // // import { verificarAdmin } from '@/lib/adminAuth';
// // // // // // import { supabase } from '@/lib/supabase';

// // // // // // export async function PUT(request) {
// // // // // //   const adminCheck = await verificarAdmin(request);
// // // // // //   if (!adminCheck.authorized) {
// // // // // //     return adminCheck.response;
// // // // // //   }

// // // // // //   try {
// // // // // //     const body = await request.json();
// // // // // //     const { id, ...updateData } = body;

// // // // // //     if (!id) {
// // // // // //       return NextResponse.json(
// // // // // //         { error: 'ID del producto es requerido' },
// // // // // //         { status: 400 }
// // // // // //       );
// // // // // //     }

// // // // // //     const { data: producto, error } = await supabase
// // // // // //       .from('products')
// // // // // //       .update(updateData)
// // // // // //       .eq('id', id)
// // // // // //       .select()
// // // // // //       .single();

// // // // // //     if (error) throw error;

// // // // // //     return NextResponse.json({ 
// // // // // //       success: true, 
// // // // // //       producto 
// // // // // //     });

// // // // // //   } catch (error) {
// // // // // //     console.error('Error al editar producto:', error);
// // // // // //     return NextResponse.json(
// // // // // //       { error: 'Error al editar producto' },
// // // // // //       { status: 500 }
// // // // // //     );
// // // // // //   }
// // // // // // }


// // // // // import { NextResponse } from 'next/server';
// // // // // import { verificarAdmin } from '@/lib/adminAuth';
// // // // // import { supabase } from '@/lib/supabase';

// // // // // // Lista de campos que existen en la tabla 'products'
// // // // // const CAMPOS_PERMITIDOS = [
// // // // //   'nombre',
// // // // //   'descripcion',
// // // // //   'precio',
// // // // //   'precio_anterior',
// // // // //   'stock',
// // // // //   'imagen_url',
// // // // //   'linea',
// // // // //   'categoria',
// // // // //   'coleccion',
// // // // //   'formato',
// // // // //   'acabado',
// // // // //   'pei',
// // // // //   'cuerpo',
// // // // //   'm2_por_caja',
// // // // //   'nombre_comercial'
// // // // // ];

// // // // // export async function PUT(request) {
// // // // //   const adminCheck = await verificarAdmin(request);
// // // // //   if (!adminCheck.authorized) {
// // // // //     return adminCheck.response;
// // // // //   }

// // // // //   try {
// // // // //     const body = await request.json();
// // // // //     const { id, ...updateData } = body;

// // // // //     if (!id) {
// // // // //       return NextResponse.json(
// // // // //         { error: 'ID del producto es requerido' },
// // // // //         { status: 400 }
// // // // //       );
// // // // //     }

// // // // //     // Filtrar solo los campos permitidos
// // // // //     const datosLimpios = Object.keys(updateData)
// // // // //       .filter(key => CAMPOS_PERMITIDOS.includes(key))
// // // // //       .reduce((obj, key) => {
// // // // //         obj[key] = updateData[key];
// // // // //         return obj;
// // // // //       }, {});

// // // // //     if (Object.keys(datosLimpios).length === 0) {
// // // // //       return NextResponse.json(
// // // // //         { error: 'No hay campos válidos para actualizar' },
// // // // //         { status: 400 }
// // // // //       );
// // // // //     }

// // // // //     const { data: producto, error } = await supabase
// // // // //       .from('products')
// // // // //       .update(datosLimpios)
// // // // //       .eq('id', id)
// // // // //       .select()
// // // // //       .single();

// // // // //     if (error) throw error;

// // // // //     return NextResponse.json({ 
// // // // //       success: true, 
// // // // //       producto 
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.error('Error al editar producto:', error);
// // // // //     return NextResponse.json(
// // // // //       { error: 'Error al editar producto' },
// // // // //       { status: 500 }
// // // // //     );
// // // // //   }
// // // // // }


// // // // import { NextResponse } from 'next/server';
// // // // import { verificarAdmin } from '@/lib/adminAuth';
// // // // import { supabase } from '@/lib/supabase';

// // // // const CAMPOS_PERMITIDOS = [
// // // //   'nombre',
// // // //   'descripcion',
// // // //   'precio',
// // // //   'precio_anterior',
// // // //   'stock',
// // // //   'imagen_url',
// // // //   'linea',
// // // //   'categoria',
// // // //   'coleccion',
// // // //   'formato',
// // // //   'acabado',
// // // //   'pei',
// // // //   'cuerpo',
// // // //   'm2_por_caja',
// // // //   'nombre_comercial'
// // // // ];

// // // // function validarCamposPorLinea(data) {
// // // //   const errores = [];

// // // //   const camposSiempreObligatorios = [
// // // //     'nombre', 'descripcion', 'precio', 'precio_anterior',
// // // //     'stock', 'imagen_url', 'linea', 'categoria'
// // // //   ];

// // // //   for (const campo of camposSiempreObligatorios) {
// // // //     if (!data[campo] && data[campo] !== 0) {
// // // //       errores.push(campo);
// // // //     }
// // // //   }

// // // //   const linea = data.linea;

// // // //   if (linea === 'Junteador' || linea === 'Pisos') {
// // // //     const camposTecnicos = [
// // // //       'coleccion', 'formato', 'acabado', 'pei',
// // // //       'cuerpo', 'm2_por_caja', 'nombre_comercial'
// // // //     ];
// // // //     for (const campo of camposTecnicos) {
// // // //       if (!data[campo] && data[campo] !== 0) {
// // // //         errores.push(campo);
// // // //       }
// // // //     }
// // // //   }

// // // //   if (linea === 'Decorados') {
// // // //     const obligatoriosDecorados = ['coleccion', 'formato', 'acabado'];
// // // //     for (const campo of obligatoriosDecorados) {
// // // //       if (!data[campo] && data[campo] !== 0) {
// // // //         errores.push(campo);
// // // //       }
// // // //     }
// // // //   }

// // // //   if (errores.length > 0) {
// // // //     return { valido: false, campos: errores };
// // // //   }
// // // //   return { valido: true };
// // // // }

// // // // export async function PUT(request) {
// // // //   const adminCheck = await verificarAdmin(request);
// // // //   if (!adminCheck.authorized) {
// // // //     return adminCheck.response;
// // // //   }

// // // //   try {
// // // //     const body = await request.json();
// // // //     const { id, ...updateData } = body;

// // // //     if (!id) {
// // // //       return NextResponse.json(
// // // //         { error: 'ID del producto es requerido' },
// // // //         { status: 400 }
// // // //       );
// // // //     }

// // // //     const datosLimpios = Object.keys(updateData)
// // // //       .filter(key => CAMPOS_PERMITIDOS.includes(key))
// // // //       .reduce((obj, key) => {
// // // //         obj[key] = updateData[key];
// // // //         return obj;
// // // //       }, {});

// // // //     const validacion = validarCamposPorLinea(datosLimpios);
// // // //     if (!validacion.valido) {
// // // //       return NextResponse.json(
// // // //         { error: 'Campos obligatorios faltantes', campos: validacion.campos },
// // // //         { status: 400 }
// // // //       );
// // // //     }

// // // //     const { data: producto, error } = await supabase
// // // //       .from('products')
// // // //       .update(datosLimpios)
// // // //       .eq('id', id)
// // // //       .select()
// // // //       .single();

// // // //     if (error) throw error;

// // // //     return NextResponse.json({ success: true, producto });
// // // //   } catch (error) {
// // // //     console.error('Error al editar producto:', error);
// // // //     return NextResponse.json(
// // // //       { error: 'Error al editar producto' },
// // // //       { status: 500 }
// // // //     );
// // // //   }
// // // // }


// // // import { NextResponse } from 'next/server';
// // // import { verificarAdmin } from '@/lib/adminAuth';
// // // import { supabase } from '@/lib/supabase';

// // // const CAMPOS_PERMITIDOS = [
// // //   'nombre',
// // //   'descripcion',
// // //   'precio',
// // //   'precio_anterior',
// // //   'stock',
// // //   'imagen_url',
// // //   'linea',
// // //   'categoria',
// // //   'coleccion',
// // //   'formato',
// // //   'acabado',
// // //   'pei',
// // //   'cuerpo',
// // //   'm2_por_caja',
// // //   'nombre_comercial'
// // // ];

// // // const CAMPOS_NUMERICOS = ['precio', 'precio_anterior', 'stock', 'm2_por_caja'];

// // // function validarCamposPorLinea(data) {
// // //   const errores = [];

// // //   const camposSiempreObligatorios = [
// // //     'nombre', 'descripcion', 'precio', 'precio_anterior',
// // //     'stock', 'imagen_url', 'linea', 'categoria'
// // //   ];

// // //   for (const campo of camposSiempreObligatorios) {
// // //     if (data[campo] === undefined || data[campo] === null || data[campo] === '') {
// // //       errores.push(campo);
// // //     }
// // //   }

// // //   const linea = data.linea;

// // //   if (linea === 'Junteador' || linea === 'Pisos') {
// // //     const camposTecnicos = [
// // //       'coleccion', 'formato', 'acabado', 'pei',
// // //       'cuerpo', 'm2_por_caja', 'nombre_comercial'
// // //     ];
// // //     for (const campo of camposTecnicos) {
// // //       if (!data[campo] && data[campo] !== 0) {
// // //         errores.push(campo);
// // //       }
// // //     }
// // //   }

// // //   if (linea === 'Decorados') {
// // //     const obligatoriosDecorados = ['coleccion', 'formato', 'acabado'];
// // //     for (const campo of obligatoriosDecorados) {
// // //       if (!data[campo] && data[campo] !== 0) {
// // //         errores.push(campo);
// // //       }
// // //     }
// // //   }

// // //   if (errores.length > 0) {
// // //     return { valido: false, campos: errores };
// // //   }
// // //   return { valido: true };
// // // }

// // // export async function PUT(request) {
// // //   const adminCheck = await verificarAdmin(request);
// // //   if (!adminCheck.authorized) {
// // //     return adminCheck.response;
// // //   }

// // //   try {
// // //     const body = await request.json();
// // //     const { id, ...updateData } = body;

// // //     if (!id) {
// // //       return NextResponse.json(
// // //         { error: 'ID del producto es requerido' },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     const datosLimpios = Object.keys(updateData)
// // //       .filter(key => CAMPOS_PERMITIDOS.includes(key))
// // //       .reduce((obj, key) => {
// // //         let valor = updateData[key];
// // //         if (CAMPOS_NUMERICOS.includes(key) && valor === '') {
// // //           valor = null;
// // //         }
// // //         obj[key] = valor;
// // //         return obj;
// // //       }, {});

// // //     const validacion = validarCamposPorLinea(datosLimpios);
// // //     if (!validacion.valido) {
// // //       return NextResponse.json(
// // //         { error: 'Campos obligatorios faltantes', campos: validacion.campos },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     const { data: producto, error } = await supabase
// // //       .from('products')
// // //       .update(datosLimpios)
// // //       .eq('id', id)
// // //       .select()
// // //       .single();

// // //     if (error) {
// // //       console.error('Error de Supabase:', error);
// // //       throw error;
// // //     }

// // //     return NextResponse.json({ success: true, producto });
// // //   } catch (error) {
// // //     console.error('Error al editar producto:', error);
// // //     return NextResponse.json(
// // //       { error: 'Error al editar producto: ' + error.message },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }


// // import { NextResponse } from 'next/server';
// // import { verificarAdmin } from '@/lib/adminAuth';
// // import { supabase } from '@/lib/supabase';

// // const CAMPOS_PERMITIDOS = [
// //   // 'id' NO se incluye porque no debe actualizarse
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

// //   const camposSiempreObligatorios = [
// //     'nombre', 'descripcion', 'precio', 'precio_anterior',
// //     'stock', 'imagen_url', 'linea', 'categoria'
// //   ];

// //   for (const campo of camposSiempreObligatorios) {
// //     if (data[campo] === undefined || data[campo] === null || data[campo] === '') {
// //       errores.push(campo);
// //     }
// //   }

// //   const linea = data.linea;

// //   if (linea === 'Junteador' || linea === 'Pisos') {
// //     const camposTecnicos = [
// //       'coleccion', 'formato', 'acabado', 'pei',
// //       'cuerpo', 'm2_por_caja', 'nombre_comercial'
// //     ];
// //     for (const campo of camposTecnicos) {
// //       if (!data[campo] && data[campo] !== 0) {
// //         errores.push(campo);
// //       }
// //     }
// //   }

// //   if (linea === 'Decorados') {
// //     const obligatoriosDecorados = ['coleccion', 'formato', 'acabado'];
// //     for (const campo of obligatoriosDecorados) {
// //       if (!data[campo] && data[campo] !== 0) {
// //         errores.push(campo);
// //       }
// //     }
// //   }

// //   if (errores.length > 0) {
// //     return { valido: false, campos: errores };
// //   }
// //   return { valido: true };
// // }

// // export async function PUT(request) {
// //   const adminCheck = await verificarAdmin(request);
// //   if (!adminCheck.authorized) {
// //     return adminCheck.response;
// //   }

// //   try {
// //     const body = await request.json();
// //     const { id, ...updateData } = body;

// //     if (!id) {
// //       return NextResponse.json(
// //         { error: 'ID del producto es requerido' },
// //         { status: 400 }
// //       );
// //     }

// //     const datosLimpios = Object.keys(updateData)
// //       .filter(key => CAMPOS_PERMITIDOS.includes(key))
// //       .reduce((obj, key) => {
// //         let valor = updateData[key];
// //         if (CAMPOS_NUMERICOS.includes(key) && valor === '') {
// //           valor = null;
// //         }
// //         obj[key] = valor;
// //         return obj;
// //       }, {});

// //     const validacion = validarCamposPorLinea(datosLimpios);
// //     if (!validacion.valido) {
// //       return NextResponse.json(
// //         { error: 'Campos obligatorios faltantes', campos: validacion.campos },
// //         { status: 400 }
// //       );
// //     }

// //     const { data: producto, error } = await supabase
// //       .from('products')
// //       .update(datosLimpios)
// //       .eq('id', id)
// //       .select()
// //       .single();

// //     if (error) {
// //       console.error('Error de Supabase:', error);
// //       throw error;
// //     }

// //     return NextResponse.json({ success: true, producto });
// //   } catch (error) {
// //     console.error('Error al editar producto:', error);
// //     return NextResponse.json(
// //       { error: 'Error al editar producto: ' + error.message },
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
//   'nombre_comercial'
// ];

// const CAMPOS_NUMERICOS = ['precio', 'precio_anterior', 'stock', 'm2_por_caja'];

// function validarCamposPorLinea(data) {
//   const errores = [];

//   // En edición, si se envía código debe tener valor
//   if (data.hasOwnProperty('codigo') && !data.codigo) {
//     errores.push('codigo');
//   }

//   const camposBasicos = [
//     'nombre', 'descripcion', 'precio', 'precio_anterior',
//     'stock', 'imagen_url', 'linea', 'categoria'
//   ];
//   for (const campo of camposBasicos) {
//     if (data[campo] === undefined || data[campo] === null || data[campo] === '') {
//       errores.push(campo);
//     }
//   }

//   const linea = data.linea;

//   if (linea === 'Junteador' || linea === 'Pisos') {
//     const tecnicos = [
//       'coleccion', 'formato', 'acabado', 'pei',
//       'cuerpo', 'm2_por_caja', 'nombre_comercial'
//     ];
//     for (const campo of tecnicos) {
//       if (!data[campo] && data[campo] !== 0) {
//         errores.push(campo);
//       }
//     }
//   }

//   if (linea === 'Decorados') {
//     const decoradosReq = ['coleccion', 'formato', 'acabado'];
//     for (const campo of decoradosReq) {
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
  'nombre_comercial'
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

  if (linea === 'Junteador' || linea === 'Pisos') {
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