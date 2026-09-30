/* Roteador: troca o conteúdo da página conforme o endereço (#/rota), sem recarregar */
(function (App) {
  'use strict';

  const rotas = {
    '/inicio':      { titulo: 'Início',           html: function () { return App.templates.inicio(); } },
    '/projetos':    { titulo: 'Projetos',         html: function () { return App.templates.projetos(); } },
    '/cadastro':    { titulo: 'Seja voluntário',  html: function () { return App.templates.cadastro(); } },
    '/voluntarios': { titulo: 'Cadastros salvos', html: function () { return App.templates.voluntarios(App.storage.listar()); } }
  };

  function render() {
    const caminho = location.hash.replace('#', '') || '/inicio';
    const rota = rotas[caminho];
    const app = document.getElementById('app');

    app.innerHTML = rota ? rota.html() : App.templates.naoEncontrada();
    document.title = (rota ? rota.titulo : 'Página não encontrada') + ' | Nome da ONG';

    /* Marca o link da página atual */
    document.querySelectorAll('[data-rota]').forEach(function (a) {
      if (a.dataset.rota === caminho) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    /* Fecha o menu do celular e leva o foco para o conteúdo (ajuda leitor de tela) */
    document.getElementById('menu-toggle').checked = false;
    window.scrollTo(0, 0);
    app.focus();
  }

  App.router = {
    render: render,
    iniciar: function () {
      window.addEventListener('hashchange', render);
      render();
    }
  };
})(window.App = window.App || {});
