/* Interface: avisos (toast) e estados visuais dos campos. Só mexe no DOM, não tem regra de negócio. */
(function (App) {
  'use strict';

  function mostrarToast(mensagem, tipo) {
    const el = document.createElement('div');
    el.className = 'toast toast--auto' + (tipo === 'erro' ? ' toast--erro' : '');
    el.setAttribute('role', 'status');
    el.textContent = mensagem; /* textContent: texto simples, sem risco de XSS */
    document.getElementById('toast-area').appendChild(el);
    setTimeout(function () { el.remove(); }, 4500);
  }

  /* Liga ou desliga o estado de erro/sucesso de UM campo (classes + aria + mensagem) */
  function marcarCampo(campo, erro) {
    const entrada = campo.querySelector('[name]');
    const msg = campo.querySelector('.campo__erro');
    msg.dataset.padrao = msg.dataset.padrao || msg.textContent;
    campo.classList.toggle('campo--erro', Boolean(erro));
    campo.classList.toggle('campo--ok', !erro && entrada.value.trim() !== '');
    entrada.setAttribute('aria-invalid', erro ? 'true' : 'false');
    msg.textContent = erro || msg.dataset.padrao;
  }

  function mostrarErros(form, erros) {
    form.querySelectorAll('.campo').forEach(function (campo) {
      marcarCampo(campo, erros[campo.querySelector('[name]').name]);
    });
  }

  App.ui = {
    toast: mostrarToast,
    marcarCampo: marcarCampo,
    mostrarErros: mostrarErros
  };
})(window.App = window.App || {});
