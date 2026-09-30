/* Templates: funções que recebem dados e devolvem o HTML de cada tela.
   Usam Template Literals (crases) com ${ } para preencher os dados. */
(function (App) {
  'use strict';

  /* Escapa texto para não deixar entrar HTML ou script vindo do usuário (XSS) */
  function esc(texto) {
    const mapa = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(texto).replace(/[&<>"']/g, (c) => mapa[c]);
  }

  /* Template reutilizável: um card de projeto */
  function cardProjeto(projeto) {
    const s = App.dados.status[projeto.status];
    return `
      <article class="card col-sm-6 col-lg-4">
        <div class="card__corpo">
          <h2>${esc(projeto.titulo)}</h2>
          <p>${esc(projeto.descricao)}</p>
        </div>
        <div class="card__rodape">
          <span class="badge ${s.classe}">${esc(s.texto)}</span>
          <a class="btn" href="#/cadastro">Participar</a>
        </div>
      </article>`;
  }

  /* Template reutilizável: um campo de formulário (rótulo + entrada + mensagem de erro) */
  function campo(id, rotulo, entrada, erro) {
    return `
      <div class="campo">
        <label for="${id}">${rotulo}</label>
        ${entrada}
        <span class="campo__erro" id="${id}-erro">${erro}</span>
      </div>`;
  }

  /* Template reutilizável: um item da lista de cadastros salvos */
  function itemCadastro(c) {
    return `<li><strong>${esc(c.nome)}</strong><br>${esc(c.email)} · ${esc(c.interesse)}</li>`;
  }

  const templates = {
    inicio() {
      return `
        <section class="hero">
          <picture>
            <source srcset="../imagens/banner.webp" type="image/webp">
            <source srcset="../imagens/banner.jpg" type="image/jpeg">
            <img src="../imagens/banner.png" alt="Banner azul com o texto Cadastro" width="600" height="200">
          </picture>
          <h1>Juntos fazemos a diferença</h1>
          <p>Conheça os projetos da ONG e participe como voluntário.</p>
          <p><a class="btn btn--doar" href="#/cadastro">Quero ser voluntário</a></p>
        </section>`;
    },

    projetos() {
      return `
        <h1>Projetos</h1>
        <div class="grid">${App.dados.projetos.map(cardProjeto).join('')}</div>`;
    },

    cadastro() {
      const opcoes = `<option value="">Selecione</option>` +
        App.dados.interesses.map((i) => `<option value="${esc(i)}">${esc(i)}</option>`).join('');

      return `
        <h1>Seja voluntário</h1>
        <form data-form="cadastro" novalidate style="max-width: 480px;">
          ${campo('nome', 'Nome completo',
            '<input type="text" id="nome" name="nome" autocomplete="name" required aria-describedby="nome-erro">',
            'Informe nome e sobrenome.')}
          ${campo('email', 'E-mail',
            '<input type="email" id="email" name="email" autocomplete="email" required aria-describedby="email-erro">',
            'Digite um e-mail válido.')}
          ${campo('cpf', 'CPF',
            '<input type="text" id="cpf" name="cpf" inputmode="numeric" placeholder="000.000.000-00" data-mascara="cpf" required aria-describedby="cpf-erro">',
            'CPF inválido.')}
          ${campo('telefone', 'Telefone (opcional)',
            '<input type="tel" id="telefone" name="telefone" autocomplete="tel" placeholder="(11) 91234-5678" data-mascara="telefone" aria-describedby="telefone-erro">',
            'Telefone inválido.')}
          ${campo('interesse', 'Área de interesse',
            `<select id="interesse" name="interesse" required aria-describedby="interesse-erro">${opcoes}</select>`,
            'Escolha uma área.')}
          <button type="submit" class="btn">Enviar cadastro</button>
        </form>`;
    },

    voluntarios(lista) {
      if (!lista.length) {
        return `<h1>Cadastros salvos</h1><p>Ainda não há cadastros neste navegador.</p>`;
      }
      return `
        <h1>Cadastros salvos</h1>
        <p>${lista.length} cadastro(s) guardado(s) neste navegador.</p>
        <ul class="lista-cadastros">${lista.map(itemCadastro).join('')}</ul>
        <p><button type="button" class="btn" data-acao="limpar">Limpar lista</button></p>`;
    },

    naoEncontrada() {
      return `<h1>Página não encontrada</h1><p><a href="#/inicio">Voltar ao início</a></p>`;
    }
  };

  App.templates = templates;
  App.esc = esc;
})(window.App = window.App || {});
