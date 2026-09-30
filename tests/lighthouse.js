/* Lighthouse (acessibilidade, desempenho, boas práticas) em cada rota.
   Uso: node lighthouse.js <url-base> [saida.json] */
const { chromium } = require('playwright');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

(async () => {
  const base = process.argv[2];
  const { default: lighthouse } = await import('lighthouse');
  const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox'] });
  const res = {};
  for (const rota of ['#/inicio', '#/projetos', '#/cadastro', '#/voluntarios']) {
    const r = await lighthouse(base + rota, { port: chrome.port, onlyCategories: ['accessibility', 'performance', 'best-practices'], output: 'json', logLevel: 'error' });
    const c = r.lhr.categories;
    res[rota] = {
      acessibilidade: Math.round(c.accessibility.score * 100),
      desempenho: Math.round(c.performance.score * 100),
      boasPraticas: Math.round(c['best-practices'].score * 100),
      reprovadas: Object.values(r.lhr.audits).filter((a) => a.score === 0 && a.scoreDisplayMode === 'binary').map((a) => a.id)
    };
    console.log(rota, JSON.stringify(res[rota]));
  }
  if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(res, null, 2));
  await chrome.kill();
})().catch((e) => { console.error(e); process.exit(1); });
