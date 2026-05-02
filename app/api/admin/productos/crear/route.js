// app/api/admin/productos/crear/route.js
import { NextResponse } from 'next/server';
import { verificarAdmin } from '@/lib/adminAuth';
import { supabase } from '@/lib/supabase';

const CAMPOS_PERMITIDOS = [
  'codigo', 'nombre', 'descripcion', 'precio', 'precio_anterior',
  'stock', 'imagen_url', 'categoria', 'linea', 'coleccion', 'formato', 'acabado',
  'pei', 'cuerpo', 'm2_por_caja', 'pegamento_sugerido', 'junteador_sugerido',
  'peso_kg'
];

const CAMPOS_NUMERICOS = ['precio', 'precio_anterior', 'stock', 'm2_por_caja', 'peso_kg'];

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
    if (!data.pegamento_sugerido) errores.push('pegamento_sugerido');
    if (!data.junteador_sugerido) errores.push('junteador_sugerido');
  }

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

    // Filtrar solo los campos permitidos y limpiar numéricos
    const datosLimpios = Object.keys(body)
      .filter(key => CAMPOS_PERMITIDOS.includes(key))
      .reduce((obj, key) => {
        let valor = body[key];
        if (CAMPOS_NUMERICOS.includes(key) && valor === '') valor = null;
        obj[key] = valor;
        return obj;
      }, {});

    // 🔥 Asegurar que NO se envíe el campo id (autoincremental)
    delete datosLimpios.id;

    // Verificar que el código no exista ya
    if (datosLimpios.codigo) {
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('codigo', datosLimpios.codigo)
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