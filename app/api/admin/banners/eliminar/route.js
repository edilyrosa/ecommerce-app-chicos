// app/api/admin/banners/eliminar/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verificarAdmin } from '@/lib/adminAuth';

export async function DELETE(request) {
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) return adminCheck.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    // Obtener las imágenes del banner antes de eliminarlo para borrarlas del bucket
    const { data: banner } = await supabase
      .from('banners')
      .select('imagenes')
      .eq('id', id)
      .single();

    // Eliminar imágenes del bucket img_banners
    if (banner?.imagenes?.length) {
      const paths = banner.imagenes
        .map(url => {
          const match = url.match(/img_banners\/(.+)$/);
          return match ? match[1] : null;
        })
        .filter(Boolean);

      if (paths.length) {
        await supabase.storage.from('img_banners').remove(paths);
      }
    }

    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando banner:', error);
    return NextResponse.json({ error: 'Error al eliminar banner' }, { status: 500 });
  }
}