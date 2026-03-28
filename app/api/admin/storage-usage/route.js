

// app/api/admin/storage-usage/route.js
import { NextResponse } from 'next/server';
import { verificarAdmin } from '@/lib/adminAuth';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const adminCheck = await verificarAdmin(request);
  if (!adminCheck.authorized) return adminCheck.response;

  try {
    // Función recursiva para listar todos los objetos con paginación
    const listAll = async (bucket, limit = 100, offset = 0, accumulated = []) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list('', {
          limit,
          offset,
          sortBy: { column: 'created_at', order: 'asc' }
        });
      if (error) throw error;
      accumulated.push(...data);
      // Si recibimos exactamente el límite, puede haber más objetos
      if (data.length === limit) {
        return await listAll(bucket, limit, offset + limit, accumulated);
      }
      return accumulated;
    };

    // Obtener todos los objetos del bucket 'img_productos'
    const objects = await listAll('img_productos');

    let totalBytes = 0;
    objects.forEach(obj => {
      if (obj.metadata && obj.metadata.size) {
        totalBytes += obj.metadata.size;
      }
    });

    const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
    const remainingMB = (1024 - totalMB).toFixed(2);
    const usedPercent = ((totalMB / 1024) * 100).toFixed(2);

    return NextResponse.json({
      usedMB: totalMB,
      remainingMB: remainingMB,
      usedPercent: usedPercent,
      limitMB: 1024
    });
  } catch (error) {
    console.error('Error al obtener uso de almacenamiento:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas de almacenamiento' },
      { status: 500 }
    );
  }
}