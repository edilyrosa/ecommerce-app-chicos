import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { codigo } = await params   // ← AWAIT aquí
    if (!codigo) {
      return NextResponse.json({ error: 'Código no proporcionado' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('codigo', codigo)
      .single()

    if (error || !data) {
      console.error('Error al buscar producto por código:', error)
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Error interno:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}