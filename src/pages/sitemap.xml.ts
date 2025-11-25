import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const site = "https://bovedadecursos2025.com";

  // Agrega aquí todas tus rutas generadas desde Astro
  // Puedes agregar más si tu sitio crece
  const staticPages = [
    "/",
    "/Cursos",
  ];

  const urls = staticPages.map((p) => `${site}${p}`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (url) => `
      <url>
        <loc>${url}</loc>
        <changefreq>weekly</changefreq>
        <priority>${url === `${site}/` ? "1.0" : "0.8"}</priority>
      </url>`
      )
      .join("")}
  </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
