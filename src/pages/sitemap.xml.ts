import { getCollection } from 'astro:content';

export async function GET() {
  const baseUrl = 'https://bovedadecursos2025.com'; // <-- CAMBIA ESTO POR TU DOMINIO REAL

  // Opcional: si usas Astro Content Collections
  let pages: string[] = [];

  try {
    const posts = await getCollection('blog'); // ejemplo
    pages = posts.map((p : any) => `/blog/${p.slug}`);
  } catch (err) {
    pages = []; // si no usas collections, no falla
  }

  // Obtener rutas de tu proyecto automáticamente
  // (solo archivos en /src/pages)
  const staticRoutes = import.meta.glob('/src/pages/**/*.astro', { eager: true });

  const urls = Object.keys(staticRoutes)
    .map((file) => {
      let path = file
        .replace('/src/pages', '')
        .replace('.astro', '')
        .replace('/index', ''); // /blog/index → /blog

      return path || '/';
    })
    .filter((p) => !p.includes('[...slug]') && !p.includes('[id]')) // evita rutas dinámicas sin parámetros
    .filter((p) => !p.includes('/sitemap.xml')); // evitar que se agregue a sí mismo

  const allUrls = [...new Set([...urls, ...pages])];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allUrls
      .map((url) => {
        return `
        <url>
          <loc>${baseUrl}${url}</loc>
          <changefreq>weekly</changefreq>
          <priority>${url === '/' ? '1.0' : '0.8'}</priority>
        </url>
        `;
      })
      .join('')}
  </urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
