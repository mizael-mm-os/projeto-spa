/* Validação de formulário e máscaras de digitação */
(function (App) {
  'use strict';

  const somenteDigitos = function (valor) { return String(valor).replace(/\D/g, ''); };

  function cpfValido(valor) {
    const c = somenteDigitos(valor);
    if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
    const digito = function (qtd) {
      let soma = 0;
      for (let i = 0; i < qtd; i++) soma += Number(c[i]) * (qtd + 1 - i);
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };
    return digito(9) === Number(c[9]) && digito(10) === Number(c[10]);
  }

  function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor).trim());
  }

  function telefoneValido(valor) {
    const n = somenteDigitos(valor).length;
    return n === 10 || n === 11;
  }

  /* Valida UM campo e devolve a mensagem de erro (ou '' se estiver certo) */
  function validarCampo(nome, valor) {
    const v = String(valor || '');
    switch (nome) {
      case 'nome': {
        const n = v.trim();
        return (n.split(/\s+/).length < 2 || n.length < 5) ? 'Informe nome e sobrenome.' : '';
      }
      case 'email':
        return emailValido(v) ? '' : 'Digite um e-mail válido, como nome@exemplo.org.';
      case 'cpf':
        return cpfValido(v) ? '' : 'CPF inválido. Confira os números.';
      case 'telefone':
        return (!v || telefoneValido(v)) ? '' : 'Telefone deve ter DDD e 8 ou 9 dígitos.';
      case 'interesse':
        return App.dados.interesses.includes(v) ? '' : 'Escolha uma área de interesse.';
      default:
        return '';
    }
  }

  /* Recebe os dados do formulário e devolve { campo: mensagem } só com os erros */
  function validarCadastro(dados) {
    const erros = {};
    ['nome', 'email', 'cpf', 'telefone', 'interesse'].forEach(function (campo) {
      const mensagem = validarCampo(campo, dados[campo]);
      if (mensagem) erros[campo] = mensagem;
    });
    return erros;
  }

  /* Máscara enquanto a pessoa digita: 000.000.000-00 e (11) 91234-5678 */
  function mascara(tipo, valor) {
    const d = somenteDigitos(valor);
    if (tipo === 'cpf') {
      return d.slice(0, 11)
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2');
    }
    if (tipo === 'telefone') {
      return d.slice(0, 11)
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    }
    return valor;
  }

  App.validacao = {
    cpfValido: cpfValido,
    emailValido: emailValido,
    telefoneValido: telefoneValido,
    validarCampo: validarCampo,
    validarCadastro: validarCadastro,
    mascara: mascara
  };
})(window.App = window.App || {});
