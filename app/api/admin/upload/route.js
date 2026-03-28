// // // app/api/admin/upload/route.js
// // import { NextResponse } from 'next/server';
// // import { supabase } from '@/lib/supabase'; // Cliente con service_role (secret key)
// // import { verificarAdmin } from '@/lib/adminAuth';

// // export const config = {
// //   api: {
// //     bodyParser: false, // Necesario para manejar FormData manualmente
// //   },
// // };

// // export async function POST(request) {
// //   // 1. Verificar que el usuario es administrador
// //   const adminCheck = await verificarAdmin(request);
// //   if (!adminCheck.authorized) {
// //     return adminCheck.response;
// //   }

// //   try {
// //     // 2. Obtener el FormData con la imagen
// //     const formData = await request.formData();
// //     const file = formData.get('file');
    
// //     if (!file) {
// //       return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
// //     }

// //     // 3. Generar nombre único para evitar conflictos
// //     const timestamp = Date.now();
// //     const extension = file.name.split('.').pop();
// //     const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

// //     // 4. Subir archivo a Supabase Storage (bucket 'img_productos')
// //     const { data, error } = await supabase.storage
// //       .from('img_productos')
// //       .upload(fileName, file, {
// //         cacheControl: '3600',
// //         upsert: false,
// //         contentType: file.type,
// //       });

// //     if (error) {
// //       console.error('Error al subir a Supabase:', error);
// //       return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
// //     }

// //     // 5. Obtener la URL pública de la imagen
// //     const { data: { publicUrl } } = supabase.storage
// //       .from('img_productos')
// //       .getPublicUrl(fileName);

// //     // 6. Retornar la URL
// //     return NextResponse.json({ url: publicUrl });
// //   } catch (error) {
// //     console.error('Error en upload endpoint:', error);
// //     return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
// //   }
// // }



// import { NextResponse } from 'next/server';
// import { verificarAdmin } from '@/lib/adminAuth';
// import { supabase } from '@/lib/supabase';

// export async function POST(request) {
//   const adminCheck = await verificarAdmin(request);
//   if (!adminCheck.authorized) return adminCheck.response;

//   try {
//     const formData = await request.formData();
//     const files = formData.getAll('images'); // array de archivos

//     if (!files || files.length === 0) {
//       return NextResponse.json({ error: 'No se enviaron imágenes' }, { status: 400 });
//     }

//     const uploadedUrls = [];

//     for (const file of files) {
//       // Generar nombre único
//       const ext = file.name.split('.').pop();
//       const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
//       const buffer = Buffer.from(await file.arrayBuffer());

//       const { data, error } = await supabase.storage
//         .from('img_products')
//         .upload(fileName, buffer, {
//           contentType: file.type,
//           cacheControl: '3600',
//         });

//       if (error) throw error;

//       const { publicUrl } = supabase.storage
//         .from('img_products')
//         .getPublicUrl(fileName).data;

//       uploadedUrls.push(publicUrl);
//     }

//     return NextResponse.json({ urls: uploadedUrls });
//   } catch (error) {
//     console.error('Error subiendo imágenes:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



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