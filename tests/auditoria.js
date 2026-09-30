/* Auditoria funcional e de acessibilidade. Uso: node auditoria.js [url-base]
   Sem argumento, abre html/index.html por file://. */
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const path = require('path');
const { pathToFileURL } = require('url');

const base = process.argv[2] || pathToFileURL(path.resolve(__dirname, '..', 'html', 'index.html')).href;
const rotas = ['#/inicio', '#/projetos', '#/cadastro', '#/voluntarios', '#/inexistente'];
const out = { funcional: [], axe: {}, console: [], rede: [], reflow: {} };
const ok = (nome, passou, detalhe) => {
  out.funcional.push({ nome, passou, detalhe });
  console.log((passou ? 'OK   ' : 'FALHA') + ' ' + nome + (detalhe ? ' | ' + detalhe : ''));
};

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) out.console.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => out.console.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => out.rede.push(r.url() + ' ' + (r.failure() || {}).errorText));
  page.on('response', (r) => { if (r.status() >= 400) out.rede.push(r.url() + ' ' + r.status()); });

  await page.goto(base + '#/inicio');
  await page.evaluate(() => localStorage.clear());

  /* Rotas: troca sem recarregar, título e foco */
  await page.evaluate(() => { window.__marca = 1; });
  for (const r of rotas) {
    await page.evaluate((h) => { location.hash = h; }, r);
    await page.waitForTimeout(100);
    const s = await page.evaluate(() => ({
      marca: window.__marca, titulo: document.title,
      foco: document.activeElement && document.activeElement.id,
      h1: (document.querySelector('#app h1') || {}).textContent
    }));
    ok('rota ' + r, s.marca === 1 && s.foco === 'app' && !!s.h1, JSON.stringify(s));
  }

  /* Formulário */
  await page.goto(base + '#/cadastro');
  await page.click('button[type=submit]');
  let s = await page.evaluate(() => ({
    foco: document.activeElement.id,
    erros: [...document.querySelectorAll('.campo--erro')].map((c) => c.querySelector('[name]').name),
    toast: (document.querySelector('.toast') || {}).textContent
  }));
  ok('envio vazio mostra erros e foca o primeiro', s.foco === 'nome' && s.erros.length >= 4, JSON.stringify(s));
  const val = async (id, v) => {
    await page.fill('#' + id, '');
    await page.type('#' + id, v);
    await page.locator('#' + id).blur();
    return page.evaluate((i) => ({
      erro: document.getElementById(i).closest('.campo').classList.contains('campo--erro'),
      valor: document.getElementById(i).value,
      msg: document.getElementById(i + '-erro').textContent,
      invalid: document.getElementById(i).getAttribute('aria-invalid')
    }), id);
  };
  let r = await val('cpf', '11111111111');
  ok('CPF 111.111.111-11 invalido + máscara', r.erro && r.valor === '111.111.111-11', JSON.stringify(r));
  r = await val('cpf', '52998224725');
  ok('CPF 529.982.247-25 valido', !r.erro && r.valor === '529.982.247-25', JSON.stringify(r));
  r = await val('email', 'abc@');
  ok('e-mail ruim invalido', r.erro, JSON.stringify(r));
  r = await val('telefone', '1234');
  ok('telefone curto invalido', r.erro, JSON.stringify(r));
  r = await val('telefone', '11912345678');
  ok('telefone com máscara', !r.erro && r.valor === '(11) 91234-5678', JSON.stringify(r));
  ok('mensagem de erro com role/aria-live (anúncio)', await page.evaluate(() => !!document.querySelector('.campo__erro[role],.campo__erro[aria-live]')));

  /* Envio válido */
  await page.fill('#nome', 'Maria da Silva');
  await page.fill('#email', 'maria@exemplo.org');
  await page.fill('#cpf', '');
  await page.type('#cpf', '52998224725');
  await page.selectOption('#interesse', 'Educação');
  await page.click('button[type=submit]');
  await page.waitForTimeout(200);
  s = await page.evaluate(() => ({
    hash: location.hash, raw: localStorage.getItem('ong:cadastros'),
    toast: (document.querySelector('.toast') || {}).textContent
  }));
  ok('envio valido grava sem CPF e vai para lista', s.hash === '#/voluntarios' && s.raw && !/cpf|529|982/i.test(s.raw), JSON.stringify(s));
  await page.reload();
  await page.waitForTimeout(150);
  ok('lista persiste após recarregar', (await page.textContent('#app')).includes('Maria da Silva'));
  await page.click('[data-acao=limpar]');
  await page.waitForTimeout(150);
  ok('botão Limpar lista', (await page.textContent('#app')).includes('Ainda não há'),
    await page.evaluate(() => 'foco em ' + (document.activeElement && document.activeElement.tagName)));

  /* Menu desktop */
  await page.goto(base + '#/inicio');
  await page.hover('.menu__item--sub');
  await page.waitForTimeout(400);
  ok('dropdown abre com hover', await page.isVisible('.submenu a'));
  await page.mouse.move(0, 0);
  await page.waitForTimeout(400);
  ok('dropdown fecha sem hover', !(await page.isVisible('.submenu a')));
  await page.focus('.menu__item--sub > a');
  await page.waitForTimeout(400);
  ok('dropdown abre com foco (focus-within)', await page.isVisible('.submenu a'));
  const sub = await page.evaluate(() => {
    const a = document.querySelector('.menu__item--sub > a');
    return { haspopup: a.getAttribute('aria-haspopup'), expanded: a.getAttribute('aria-expanded') };
  });
  ok('submenu declara aria-haspopup', !!sub.haspopup, JSON.stringify(sub));

  /* Menu móvel */
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto(base + '#/inicio');
  await page.reload();
  await page.waitForTimeout(400);
  const visMenu = () => page.isVisible('.menu a');
  ok('menu móvel começa fechado', !(await visMenu()));
  await page.click('.menu-hamburguer');
  await page.waitForTimeout(400);
  ok('hambúrguer abre', await visMenu());
  const exp = await page.evaluate(() => ({
    labelExpanded: document.querySelector('.menu-hamburguer').getAttribute('aria-expanded'),
    toggleExpanded: document.getElementById('menu-toggle').getAttribute('aria-expanded')
  }));
  ok('hambúrguer expõe aria-expanded', exp.labelExpanded !== null || exp.toggleExpanded !== null, JSON.stringify(exp));
  await page.click('.menu-hamburguer');
  await page.waitForTimeout(400);
  ok('hambúrguer fecha', !(await visMenu()));
  await page.click('.menu-hamburguer');
  await page.click('.menu a[href="#/projetos"]');
  await page.waitForTimeout(450);
  ok('fecha ao navegar', !(await visMenu()));
  await page.click('.menu-hamburguer');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  ok('Esc fecha o menu', !(await visMenu()));
  const box = await page.locator('.menu-hamburguer').boundingBox();
  ok('alvo do hambúrguer >= 44px', box.width >= 44 && box.height >= 44, Math.round(box.width) + 'x' + Math.round(box.height));

  /* Reflow */
  for (const w of [320, 480, 768, 1024, 1280, 1600]) {
    await page.setViewportSize({ width: w, height: 800 });
    const res = [];
    for (const rt of rotas.slice(0, 4)) {
      await page.goto(base + rt);
      await page.reload();
      await page.waitForTimeout(120);
      res.push(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
    }
    out.reflow[w] = res;
    ok('sem rolagem horizontal em ' + w + 'px', res.every((x) => x <= 0), JSON.stringify(res));
  }

  /* Teclado: ordem de foco e foco visível */
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const rt of rotas.slice(0, 4)) {
    await page.goto(base + rt);
    await page.evaluate(() => { document.activeElement.blur(); document.getSelection().setPosition(document.body, 0); });
    const ordem = [];
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab');
      ordem.push(await page.evaluate(() => {
        const e = document.activeElement;
        const cs = getComputedStyle(e);
        const tem = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
        return e.tagName + (e.id ? '#' + e.id : '') + ':' + (e.textContent || '').trim().slice(0, 18) + (tem ? ' [contorno]' : ' [SEM contorno]');
      }));
    }
    console.log('TAB ' + rt + '\n  ' + ordem.join('\n  '));
    out.funcional.push({ nome: 'tab ' + rt, passou: true, detalhe: ordem.join(' > ') });
  }

  /* axe */
  for (const rt of rotas) {
    await page.goto(base + rt);
    await page.waitForTimeout(150);
    const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    out.axe[rt] = res.violations.map((v) => ({ id: v.id, impacto: v.impact, nos: v.nodes.length, alvo: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) }));
    out.axe[rt + ' incompletas'] = res.incomplete.map((v) => v.id);
    console.log('AXE ' + rt + ': ' + res.violations.length + ' violações, ' + res.passes.length + ' regras ok, incompletas=' + JSON.stringify(res.incomplete.map((v) => v.id)) + ' ' + JSON.stringify(out.axe[rt]));
  }

  /* boas práticas do axe (inclui ordem de títulos), fora das tags WCAG */
  for (const rt of rotas.slice(0, 4)) {
    await page.goto(base + rt);
    await page.waitForTimeout(150);
    const res = await new AxeBuilder({ page }).withTags(['best-practice']).analyze();
    out.axe[rt + ' best-practice'] = res.violations.map((v) => ({ id: v.id, impacto: v.impact, nos: v.nodes.length }));
    console.log('AXE-BP ' + rt + ': ' + JSON.stringify(out.axe[rt + ' best-practice']));
  }

  /* offline: nada depende de rede, então deve funcionar */
  await ctx.setOffline(true);
  await page.goto(base + '#/projetos');
  await page.waitForTimeout(150);
  ok('funciona offline', (await page.textContent('#app h1')) === 'Projetos');

  console.log('CONSOLE:', JSON.stringify(out.console));
  console.log('REDE:', JSON.stringify(out.rede));
  require('fs').writeFileSync(process.env.SAIDA || path.join(__dirname, 'resultado-auditoria.json'), JSON.stringify(out, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
