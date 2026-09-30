/* Ponto de entrada: liga os eventos e inicia o roteador.
   A regra de cada tarefa está nos módulos (validacao, storage, ui, router). */
(function (App) {
  'use strict';

  /* Validação em tempo real: ao sair do campo, e enquanto digita se ele já estava com erro */
  function validarUm(evento) {
    const entrada = evento.target;
    if (!entrada.closest || !entrada.name) return;
    const campo = entrada.closest('.campo');
    if (!campo || !entrada.closest('form[data-form="cadastro"]')) return;
    App.ui.marcarCampo(campo, App.validacao.validarCampo(entrada.name, entrada.value));
  }

  function aoEnviar(evento) {
    const form = evento.target.closest('form[data-form="cadastro"]');
    if (!form) return;
    evento.preventDefault();

    const dados = Object.fromEntries(new FormData(form).entries());
    const erros = App.validacao.validarCadastro(dados);
    App.ui.mostrarErros(form, erros);

    const campos = Object.keys(erros);
    if (campos.length) {
      form.elements[campos[0]].focus();
      App.ui.toast('Confira os campos destacados.', 'erro');
      return;
    }

    /* O CPF foi validado, mas não é guardado: menos dado pessoal no navegador */
    const salvou = App.storage.salvar({
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      interesse: dados.interesse
    });
    if (!salvou) {
      App.ui.toast('Não foi possível salvar neste navegador.', 'erro');
      return;
    }
    App.ui.toast('Cadastro salvo. Obrigado, ' + dados.nome.trim().split(/\s+/)[0] + '!');
    location.hash = '#/voluntarios';
  }

  function aoDigitar(evento) {
    const campo = evento.target;
    if (campo.dataset && campo.dataset.mascara) {
      campo.value = App.validacao.mascara(campo.dataset.mascara, campo.value);
    }
    const bloco = campo.closest && campo.closest('.campo');
    if (bloco && bloco.classList.contains('campo--erro')) validarUm(evento);
  }

  /* Move o foco para o conteúdo sem mexer no hash, que é usado pelas rotas */
  function pularParaConteudo(evento) {
    evento.preventDefault();
    const app = document.getElementById('app');
    app.focus();
    app.scrollIntoView();
  }

  function aoClicar(evento) {
    const botao = evento.target.closest('[data-acao="limpar"]');
    if (!botao) return;
    App.storage.limpar();
    App.router.render();
    App.ui.toast('Lista limpa.');
  }

  document.addEventListener('DOMContentLoaded', function () {
    const app = document.getElementById('app');
    /* Delegação de eventos: um ouvinte no #app vale para as telas que o JS redesenha */
    app.addEventListener('submit', aoEnviar);
    app.addEventListener('input', aoDigitar);
    app.addEventListener('focusout', validarUm);
    app.addEventListener('click', aoClicar);
    document.querySelector('.pular-conteudo').addEventListener('click', pularParaConteudo);
    App.router.iniciar();
  });
})(window.App = window.App || {});
