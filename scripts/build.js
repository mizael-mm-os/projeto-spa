/* Build de produção: junta e minifica o CSS e o JS e gera a pasta dist/.
   O código-fonte continua abrindo direto de html/index.html, sem build.
   Uso: npm run build */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const raiz = path.resolve(__dirname, '..');
const dist = path.join(raiz, 'dist');
const html = fs.readFileSync(path.join(raiz, 'html', 'index.html'), 'utf8');

/* A ordem dos arquivos vem do próprio index.html, que é quem define a ordem de carga */
const listar = (regex) => [...html.matchAll(regex)].map((m) => path.resolve(raiz, 'html', m[1]));
const estilos = listar(/<link rel="stylesheet" href="([^"]+)">/g);
const scripts = listar(/<script src="([^"]+)"><\/script>/g);
const ler = (arquivos) => arquivos.map((a) => fs.readFileSync(a, 'utf8'));

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const css = esbuild.transformSync(ler(estilos).join('\n'), { loader: 'css', minify: true }).code;
/* Na dist o index.html fica na raiz, então ../imagens/ vira imagens/ */
const js = esbuild.transformSync(ler(scripts).join(';\n'), { loader: 'js', minify: true }).code.replaceAll('../imagens/', 'imagens/');
fs.writeFileSync(path.join(dist, 'app.min.css'), css);
fs.writeFileSync(path.join(dist, 'app.min.js'), js);
fs.cpSync(path.join(raiz, 'imagens'), path.join(dist, 'imagens'), { recursive: true });

const saida = html
  .replace(/\s*<link rel="stylesheet" href="[^"]+">/g, '')
  .replace('<link rel="icon" href="../imagens/', '<link rel="icon" href="imagens/')
  .replace('</head>', '  <link rel="stylesheet" href="app.min.css">\n  <script src="app.min.js" defer></script>\n</head>')
  .replace(/\s*<!-- Scripts por área[\s\S]*?(?=<\/body>)/, '\n')
  .replace(/<script src="[^"]+"><\/script>\s*/g, '');
fs.writeFileSync(path.join(dist, 'index.html'), saida);

const tam = (f) => fs.statSync(path.join(dist, f)).size;
console.log('dist/index.html ' + tam('index.html') + ' bytes');
console.log('dist/app.min.css ' + tam('app.min.css') + ' bytes (' + estilos.length + ' arquivos)');
console.log('dist/app.min.js ' + tam('app.min.js') + ' bytes (' + scripts.length + ' arquivos)');
