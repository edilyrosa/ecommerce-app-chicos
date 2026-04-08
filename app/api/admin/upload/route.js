import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarAdmin } from '@/lib/adminAuth';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) return adminCheck.response;

  try {
    const formData = await request.formData();
    // Puede recibir 'file' (single) o 'images' (múltiple)
    let files = formData.getAll('images');
    if (files.length === 0) {
      const singleFile = formData.get('file');
      if (singleFile) files = [singleFile];
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No se enviaron imágenes' }, { status: 400 });
    }

    const uploadedUrls = [];

    for (const file of files) {
      const timestamp = Date.now();
      const ext = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;

      const { data, error } = await supabase.storage
        .from('img_productos') // ← bucket correcto
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: file.type,
        });

      if (error) {
        console.error('Error subiendo archivo:', error);
        throw new Error(`Error subiendo ${file.name}: ${error.message}`);
      }

      const { publicUrl } = supabase.storage
        .from('img_productos')
        .getPublicUrl(fileName).data;

      uploadedUrls.push(publicUrl);
    }

    // Si solo subió un archivo, devuelve { url } para compatibilidad con el código antiguo
    if (files.length === 1) {
      return NextResponse.json({ url: uploadedUrls[0] });
    }
    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error('Error en upload:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}