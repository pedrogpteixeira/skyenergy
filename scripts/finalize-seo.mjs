/**
 * Finalize the static HTML delivered by Netlify for Sky Energy.
 * A production deploy is crawlable only with a canonical site URL;
 * deploy previews and branch deploys are always blocked from indexing.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const outputDir = resolve(process.env.SEO_OUTPUT_DIR || 'dist/skyenergy-site/browser');
const context = (process.env.CONTEXT || '').trim();
const isPreview = Boolean(context && context !== 'production');
const isProduction = context === 'production';
const requestedUrl = (process.env.PUBLIC_SITE_URL || (isProduction ? process.env.URL : '') || '').trim();

function normalizeOrigin(value) {
  if (!value) return null;
  let parsed;
  try { parsed = new URL(value); }
  catch { throw new Error('PUBLIC_SITE_URL/URL tem de conter um endereço HTTPS válido.'); }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash
    || parsed.pathname !== '/') {
    throw new Error('PUBLIC_SITE_URL/URL deve ser uma origem HTTPS sem caminhos, parâmetros ou fragmentos.');
  }
  if (['localhost','127.0.0.1'].includes(parsed.hostname)) {
    throw new Error('Não é permitido utilizar localhost como domínio público.');
  }
  return parsed.origin;
}

// Validate explicit production configuration rather than silently publishing noindex.
const origin = normalizeOrigin(requestedUrl);
if (isProduction && !origin) {
  throw new Error('Defina PUBLIC_SITE_URL (preferencialmente) ou confirme URL no ambiente Production da Netlify.');
}
const publiclyIndexable = !isPreview;
const htmlPath = resolve(outputDir, 'index.html');
const robotsPath = resolve(outputDir, 'robots.txt');
if (!existsSync(htmlPath) || !existsSync(robotsPath)) {
  throw new Error('Build incompleta: faltam index.html e/ou robots.txt no diretório de publicação.');
}
let html = readFileSync(htmlPath,'utf8');
if (!/<meta\s+name=["']robots["']/i.test(html)) {
  throw new Error('Falta a meta robots no HTML de origem.');
}
html = html.replace(/<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?>/i,
  `<meta name="robots" content="${publiclyIndexable ? 'index,follow' : 'noindex,nofollow'}">`);

// Do not publish an official-domain canonical on branch/deploy previews.
if (publiclyIndexable && origin) {
  const url = `${origin}/`;
  const schema = [
    { '@context':'https://schema.org', '@type':'Organization', name:'Sky Energy', url },
    { '@context':'https://schema.org', '@type':'WebSite', name:'Sky Energy', url, inLanguage:'pt-PT' },
    { '@context':'https://schema.org', '@type':'WebPage', name:'Sky Energy — Análise de Energia para Particulares e Empresas', url,
      inLanguage:'pt-PT', description:'Análise de faturas, consumos e contratos de eletricidade e gás para particulares e empresas.' },
  ];
  const safeJson = JSON.stringify(schema).replace(/</g, '\\u003c');
  const tags = [
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta name="twitter:card" content="summary">`,
    `<script type="application/ld+json">${safeJson}</script>`,
  ].join('\n  ');
  html = html.replace(/<\/head>/i, `  ${tags}\n</head>`);
}
writeFileSync(htmlPath, html);
const robots = (!publiclyIndexable)
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`;
writeFileSync(robotsPath,robots);
const sitemapPath = resolve(outputDir,'sitemap.xml');
if (publiclyIndexable && origin) {
  writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`);
}
console.log(isPreview ? 'Sky Energy: preview sem indexação.'
  : origin ? `Sky Energy: SEO público configurado para ${origin}/.`
  : 'Sky Energy: build local sem domínio canónico (indexação não bloqueada).');
