// app/api/admin/upload-banner/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarAdmin } from '@/lib/adminAuth';

export async function POST(request) {
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) return adminCheck.response;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop().toLowerCase();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('img_banners')
      .upload(filename, buffer, { contentType: file.type, upsert: false });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('img_banners')
      .getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Error subiendo imagen de banner:', error);
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 });
  }
}