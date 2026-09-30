/* Dados de exemplo (fictícios) usados pelos templates */
(function (App) {
  'use strict';

  App.dados = {
    projetos: [
      { id: 1, titulo: 'Horta comunitária', status: 'ativo',
        descricao: 'Cultivo coletivo de alimentos com as famílias do bairro.' },
      { id: 2, titulo: 'Reforço escolar', status: 'voluntarios',
        descricao: 'Aulas de apoio para crianças do ensino fundamental.' },
      { id: 3, titulo: 'Campanha do agasalho', status: 'urgente',
        descricao: 'Arrecadação de cobertores e roupas de inverno.' },
      { id: 4, titulo: 'Oficina de informática', status: 'ativo',
        descricao: 'Curso básico de computador para adultos e idosos.' }
    ],
    status: {
      ativo: { texto: 'Projeto ativo', classe: 'badge--sucesso' },
      voluntarios: { texto: 'Precisa de voluntários', classe: 'badge--aviso' },
      urgente: { texto: 'Urgente', classe: 'badge--erro' }
    },
    interesses: ['Educação', 'Alimentação', 'Arrecadação', 'Tecnologia']
  };
})(window.App = window.App || {});
