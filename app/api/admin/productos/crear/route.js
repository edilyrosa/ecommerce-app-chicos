// // // // // // app/api/admin/productos/crear/route.js
// // // // // import { NextResponse } from 'next/server';
// // // // // import { verificarAdmin } from '@/lib/adminAuth';
// // // // // import { supabase } from '@/lib/supabase';

// // // // // export async function POST(request) {
// // // // //   const adminCheck = await verificarAdmin(request);
// // // // //   if (!adminCheck.authorized) {
// // // // //     return adminCheck.response;
// // // // //   }

// // // // //   try {
// // // // //     const body = await request.json();

// // // // //     // Validaciones básicas
// // // // //     if (!body.nombre || !body.precio || !body.stock) {
// // // // //       return NextResponse.json(
// // // // //         { error: 'Nombre, precio y stock son requeridos' },
// // // // //         { status: 400 }
// // // // //       );
// // // // //     }

// // // // //     const { data: producto, error } = await supabase
// // // // //       .from('products')
// // // // //       .insert([body])
// // // // //       .select()
// // // // //       .single();

// // // // //     if (error) throw error;

// // // // //     return NextResponse.json({ 
// // // // //       success: true, 
// // // // //       producto 
// // // // //     }, { status: 201 });

// // // // //   } catch (error) {
// // // // //     console.error('Error al crear producto:', error);
// // // // //     return NextResponse.json(
// // // // //       { error: 'Error al crear producto' },
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

// // // // export async function POST(request) {
// // // //   const adminCheck = await verificarAdmin(request);
// // // //   if (!adminCheck.authorized) {
// // // //     return adminCheck.response;
// // // //   }

// // // //   try {
// // // //     const body = await request.json();

// // // //     // Filtrar solo los campos permitidos
// // // //     const datosLimpios = Object.keys(body)
// // // //       .filter(key => CAMPOS_PERMITIDOS.includes(key))
// // // //       .reduce((obj, key) => {
// // // //         obj[key] = body[key];
// // // //         return obj;
// // // //       }, {});

// // // //     // Validar campos obligatorios
// // // //     if (!datosLimpios.nombre || !datosLimpios.precio || !datosLimpios.stock) {
// // // //       return NextResponse.json(
// // // //         { error: 'Nombre, precio y stock son obligatorios' },
// // // //         { status: 400 }
// // // //       );
// // // //     }

// // // //     const { data: producto, error } = await supabase
// // // //       .from('products')
// // // //       .insert([datosLimpios])
// // // //       .select()
// // // //       .single();

// // // //     if (error) throw error;

// // // //     return NextResponse.json({ 
// // // //       success: true, 
// // // //       producto 
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('Error al crear producto:', error);
// // // //     return NextResponse.json(
// // // //       { error: 'Error al crear producto' },
// // // //       { status: 500 }
// // // //     );
// // // //   }
// // // // }


// // // import { NextResponse } from 'next/server';
// // // import { verificarAdmin } from '@/lib/adminAuth';
// // // import { supabase } from '@/lib/supabase';

// // // // Todos los campos existentes en la tabla
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

// // // // Validación según la línea seleccionada
// // // function validarCamposPorLinea(data) {
// // //   const errores = [];

// // //   // Campos siempre obligatorios (según lo indicado)
// // //   const camposSiempreObligatorios = [
// // //     'nombre', 'descripcion', 'precio', 'precio_anterior',
// // //     'stock', 'imagen_url', 'linea', 'categoria'
// // //   ];

// // //   for (const campo of camposSiempreObligatorios) {
// // //     if (!data[campo] && data[campo] !== 0) {
// // //       errores.push(campo);
// // //     }
// // //   }

// // //   const linea = data.linea;

// // //   // Si la línea es Junteador o Pisos → todos los campos son obligatorios
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

// // //   // Si la línea es Decorados → coleccion, formato, acabado son obligatorios
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

// // // export async function POST(request) {
// // //   const adminCheck = await verificarAdmin(request);
// // //   if (!adminCheck.authorized) {
// // //     return adminCheck.response;
// // //   }

// // //   try {
// // //     const body = await request.json();

// // //     // Filtrar solo campos permitidos
// // //     const datosLimpios = Object.keys(body)
// // //       .filter(key => CAMPOS_PERMITIDOS.includes(key))
// // //       .reduce((obj, key) => {
// // //         obj[key] = body[key];
// // //         return obj;
// // //       }, {});

// // //     // Validar según la línea
// // //     const validacion = validarCamposPorLinea(datosLimpios);
// // //     if (!validacion.valido) {
// // //       return NextResponse.json(
// // //         { error: 'Campos obligatorios faltantes', campos: validacion.campos },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     const { data: producto, error } = await supabase
// // //       .from('products')
// // //       .insert([datosLimpios])
// // //       .select()
// // //       .single();

// // //     if (error) throw error;

// // //     return NextResponse.json({ success: true, producto });
// // //   } catch (error) {
// // //     console.error('Error al crear producto:', error);
// // //     return NextResponse.json(
// // //       { error: 'Error al crear producto' },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }



// // import { NextResponse } from 'next/server';
// // import { verificarAdmin } from '@/lib/adminAuth';
// // import { supabase } from '@/lib/supabase';

// // const CAMPOS_PERMITIDOS = [
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

// // export async function POST(request) {
// //   const adminCheck = await verificarAdmin(request);
// //   if (!adminCheck.authorized) {
// //     return adminCheck.response;
// //   }

// //   try {
// //     const body = await request.json();

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

// //     const validacion = validarCamposPorLinea(datosLimpios);
// //     if (!validacion.valido) {
// //       return NextResponse.json(
// //         { error: 'Campos obligatorios faltantes', campos: validacion.campos },
// //         { status: 400 }
// //       );
// //     }

// //     const { data: producto, error } = await supabase
// //       .from('products')
// //       .insert([datosLimpios])
// //       .select()
// //       .single();

// //     if (error) {
// //       console.error('Error de Supabase:', error);
// //       throw error;
// //     }

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
//   'id',                // ← AGREGADO: el ID debe ser proporcionado
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

//   // ID siempre obligatorio (porque la columna es NOT NULL)
//   if (!data.id) {
//     errores.push('id');
//   }

//   const camposSiempreObligatorios = [
//     'nombre', 'descripcion', 'precio', 'precio_anterior',
//     'stock', 'imagen_url', 'linea', 'categoria'
//   ];

//   for (const campo of camposSiempreObligatorios) {
//     if (data[campo] === undefined || data[campo] === null || data[campo] === '') {
//       errores.push(campo);
//     }
//   }

//   const linea = data.linea;

//   if (linea === 'Junteador' || linea === 'Pisos') {
//     const camposTecnicos = [
//       'coleccion', 'formato', 'acabado', 'pei',
//       'cuerpo', 'm2_por_caja', 'nombre_comercial'
//     ];
//     for (const campo of camposTecnicos) {
//       if (!data[campo] && data[campo] !== 0) {
//         errores.push(campo);
//       }
//     }
//   }

//   if (linea === 'Decorados') {
//     const obligatoriosDecorados = ['coleccion', 'formato', 'acabado'];
//     for (const campo of obligatoriosDecorados) {
//       if (!data[campo] && data[campo] !== 0) {
//         errores.push(campo);
//       }
//     }
//   }

//   if (errores.length > 0) {
//     return { valido: false, campos: errores };
//   }
//   return { valido: true };
// }

// export async function POST(request) {
//   const adminCheck = await verificarAdmin(request);
//   if (!adminCheck.authorized) {
//     return adminCheck.response;
//   }

//   try {
//     const body = await request.json();

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

//     const validacion = validarCamposPorLinea(datosLimpios);
//     if (!validacion.valido) {
//       return NextResponse.json(
//         { error: 'Campos obligatorios faltantes', campos: validacion.campos },
//         { status: 400 }
//       );
//     }

//     const { data: producto, error } = await supabase
//       .from('products')
//       .insert([datosLimpios])
//       .select()
//       .single();

//     if (error) {
//       console.error('Error de Supabase:', error);
//       throw error;
//     }

//     return NextResponse.json({ success: true, producto });
//   } catch (error) {
//     console.error('Error al crear producto:', error);
//     return NextResponse.json(
//       { error: 'Error al crear producto: ' + error.message },
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

  // 1. Código siempre obligatorio
  if (!data.codigo) errores.push('codigo');

  // 2. Campos básicos siempre obligatorios
  const basicos = ['nombre', 'descripcion', 'precio', 'precio_anterior', 'stock', 'imagen_url', 'linea', 'categoria'];
  for (const campo of basicos) {
    if (data[campo] === undefined || data[campo] === null || data[campo] === '') {
      errores.push(campo);
    }
  }

  // 3. Validación según la línea
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
  // Para otras líneas (Pegamentos, Azulejos, etc.) solo se exigen los básicos + código

  return errores;
}

export async function POST(request) {
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) return adminCheck.response;

  try {
    const body = await request.json();

    // Limpiar datos: solo campos permitidos y convertir vacíos numéricos a null
    const datosLimpios = Object.keys(body)
      .filter(key => CAMPOS_PERMITIDOS.includes(key))
      .reduce((obj, key) => {
        let valor = body[key];
        if (CAMPOS_NUMERICOS.includes(key) && valor === '') {
          valor = null;
        }
        obj[key] = valor;
        return obj;
      }, {});

    // Validar
    const errores = validarCamposPorLinea(datosLimpios);
    if (errores.length > 0) {
      console.log('Campos faltantes en creación:', errores); // Para depuración
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