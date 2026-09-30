/* Armazenamento local: guarda os cadastros no localStorage do navegador */
(function (App) {
  'use strict';

  const CHAVE = 'ong:cadastros';

  function listar() {
    try {
      const bruto = localStorage.getItem(CHAVE);
      return bruto ? JSON.parse(bruto) : [];
    } catch (erro) {
      return [];
    }
  }

  function gravar(lista) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(lista));
      return true;
    } catch (erro) {
      return false;
    }
  }

  App.storage = {
    listar: listar,
    salvar: function (cadastro) {
      const lista = listar();
      lista.push(Object.assign({ criadoEm: new Date().toISOString() }, cadastro));
      return gravar(lista);
    },
    limpar: function () {
      try {
        localStorage.removeItem(CHAVE);
        return true;
      } catch (erro) {
        return false;
      }
    }
  };
})(window.App = window.App || {});
