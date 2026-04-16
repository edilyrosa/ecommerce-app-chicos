// app/api/admin/banners/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarAdmin } from '@/lib/adminAuth';

// GET — todos los banners (admin, incluye inactivos)
export async function GET(request) {
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) return adminCheck.response;

  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('orden', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Error al cargar banners' }, { status: 500 });
  }
}