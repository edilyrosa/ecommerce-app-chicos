// app/api/admin/upload/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Cliente con service_role (secret key)
import { verificarAdmin } from '@/lib/adminAuth';

export const config = {
  api: {
    bodyParser: false, // Necesario para manejar FormData manualmente
  },
};

export async function POST(request) {
  // 1. Verificar que el usuario es administrador
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) {
    return adminCheck.response;
  }

  try {
    // 2. Obtener el FormData con la imagen
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    // 3. Generar nombre único para evitar conflictos
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

    // 4. Subir archivo a Supabase Storage (bucket 'img_productos')
    const { data, error } = await supabase.storage
      .from('img_productos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error('Error al subir a Supabase:', error);
      return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
    }

    // 5. Obtener la URL pública de la imagen
    const { data: { publicUrl } } = supabase.storage
      .from('img_productos')
      .getPublicUrl(fileName);

    // 6. Retornar la URL
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Error en upload endpoint:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}