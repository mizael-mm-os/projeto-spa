/* Servidor estático mínimo só para auditar por HTTP. Uso: node servidor.js [porta] */
const http = require('http'), fs = require('fs'), path = require('path');
const raiz = path.resolve(__dirname, '..', process.env.RAIZ || '.');
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png' };
http.createServer((req, res) => {
  const arq = path.join(raiz, decodeURIComponent(req.url.split('?')[0]));
  if (!arq.startsWith(raiz)) { res.writeHead(403); return res.end(); }
  fs.readFile(arq, (e, d) => {
    if (e) { res.writeHead(404); return res.end('nao encontrado'); }
    res.writeHead(200, { 'Content-Type': tipos[path.extname(arq)] || 'application/octet-stream' }); res.end(d);
  });
}).listen(Number(process.argv[2]) || 8123, () => console.log('http://localhost:' + (process.argv[2] || 8123)));
