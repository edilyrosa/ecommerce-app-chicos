// app/api/admin/productos/editar/route.js
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
  const basicos = ['nombre', 'descripcion', 'precio', 'precio_anterior', 'stock', 'imagen_url', 'categoria', 'linea'];
  for (const campo of basicos) {
    if (data[campo] === undefined || data[campo] === null || data[campo] === '') {
      errores.push(campo);
    }
  }

  const linea = data.linea;
  if (linea === 'Pisos' || linea === 'Azulejos') {
    const tecnicos = ['coleccion', 'formato', 'acabado', 'pei', 'cuerpo', 'm2_por_caja'];
    for (const campo of tecnicos) {
      if (!data[campo] && data[campo] !== 0) errores.push(campo);
    }
  } else if (linea === 'Decorados') {
    const tecnicos = ['coleccion', 'formato', 'acabado'];
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

  const lineasConPegamento = ['Pisos', 'Decorados', 'Azulejos', 'Fachaletas'];
  if (lineasConPegamento.includes(linea)) {
    if (!data.pegamento_sugerido) errores.push('pegamento_sugerido');
    if (!data.junteador_sugerido) errores.push('junteador_sugerido');
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
        if (CAMPOS_NUMERICOS.includes(key) && valor === '') valor = null;
        obj[key] = valor;
        return obj;
      }, {});

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