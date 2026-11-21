// Minimal static server with gzip, for measuring exported sites the way a CDN would serve them.
import { createServer } from 'node:http'; import { readFile, stat } from 'node:fs/promises'; import { join, extname, normalize } from 'node:path'; import { gzipSync } from 'node:zlib';
const [root, port] = [process.argv[2], Number(process.argv[3])];
const T = { '.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.xml':'application/xml','.ico':'image/x-icon','.mp4':'video/mp4','.ogg':'audio/ogg','.webmanifest':'application/manifest+json' };
createServer(async (req, res) => {
  try {
    let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (p.includes('..')) throw 0;
    let f = join(root, p); let s = await stat(f).catch(() => null);
    if (s?.isDirectory()) { f = join(f, 'index.html'); s = await stat(f).catch(() => null); }
    if (!s) { f = join(root, p.replace(/\/$/, '') + '.html'); s = await stat(f).catch(() => null); }
    if (!s) { res.writeHead(404); return res.end('not found'); }
    let body = await readFile(f); const type = T[extname(f)] || 'application/octet-stream'; const h = { 'Content-Type': type, 'Cache-Control': 'public, max-age=3600' };
    if (/text|javascript|json|svg|xml/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '')) { body = gzipSync(body); h['Content-Encoding'] = 'gzip'; }
    res.writeHead(200, h); res.end(body);
  } catch { res.writeHead(500); res.end('err'); }
}).listen(port, '127.0.0.1');
