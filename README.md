# Plataforma para ONGs (SPA)

Interface web de uma plataforma para organizações do terceiro setor. É uma Single Page Application feita só com HTML, CSS e JavaScript puro, sem dependências externas. Mostra os projetos da ONG e tem um formulário para quem quer ser voluntário.

## Funcionalidades

- Navegação entre quatro telas (Início, Projetos, Seja voluntário, Cadastros salvos) sem recarregar a página
- Formulário de cadastro com validação em tempo real (nome, e-mail, CPF com dígitos verificadores, telefone e área de interesse) e máscaras de digitação
- Cadastros guardados no `localStorage` do navegador (o CPF é validado, mas não é gravado)
- Menu com dropdown no desktop e hambúrguer no celular, feito só com CSS
- Componentes de feedback: badges, alertas, toast e modal
- Layout responsivo com CSS Grid de 12 colunas e 5 breakpoints

## Tecnologias

HTML5, CSS3 (variáveis, Grid, Flexbox) e JavaScript (Template Literals, DOM, localStorage). Nenhuma biblioteca externa.

## Estrutura de pastas

```
projeto-spa/
├── html/
│   └── index.html          página única da aplicação
├── css/                    variaveis, layout, componentes, navegacao, estados, feedback e styles
├── imagens/                banner em webp, jpg e png
├── js/
│   ├── main.js             ponto de entrada e eventos
│   └── modules/            dados, storage, validacao, ui, templates e router
└── tests/                  auditoria com Playwright, axe-core e Lighthouse
```

## Como executar

Não precisa instalar nada. Baixe ou clone o repositório e abra o arquivo `html/index.html` no navegador.

```bash
git clone URL-DO-REPOSITORIO
cd projeto-spa
# abra html/index.html no navegador
```

## Como usar

1. Use o menu para navegar entre as telas.
2. Em "Seja voluntário", preencha o formulário. Os erros aparecem ao sair de cada campo.
3. Depois de enviar, o cadastro aparece em "Cadastros salvos" e continua lá depois de fechar o navegador.
4. O botão "Limpar lista" apaga os cadastros guardados.

## Testes e auditoria

A pasta `tests/` tem a auditoria usada nas correções de acessibilidade. Precisa de Node.js.

```bash
cd tests
npm install
npx playwright install chromium
npm run auditoria      # abre html/index.html por file:// e roda os testes e o axe-core
npm run servir         # sobe um servidor local na porta 8123 (outro terminal)
npm run lighthouse     # roda o Lighthouse nas 4 telas, com o servidor no ar
```

A auditoria cobre rotas, formulário, localStorage, menu, reflow de 320 a 1600px, ordem do foco no teclado e axe-core (wcag2a, wcag2aa, wcag21a, wcag21aa). Alguns itens da lista aparecem como FALHA de propósito: são verificações informativas de atributos ARIA que foram avaliadas e não adotadas (veja Acessibilidade).

## Acessibilidade

Na versão 1.1.0, a auditoria automatizada foi de 1 violação crítica por tela no axe-core para 0, e o Lighthouse de acessibilidade foi de 92 a 95 para 100. Isso cobre só o que essas ferramentas detectam. Não houve teste com leitor de tela nem revisão manual completa, então o projeto não afirma conformidade total com a WCAG 2.1 AA.

Decisões que ficaram de fora, com o motivo:

- `aria-expanded` no hambúrguer: não é permitido em checkbox, e o estado já é anunciado pelo próprio checkbox
- `aria-haspopup` no item Participe: o submenu é uma lista de links e não um menu de aplicação, então o atributo seria incorreto
- Região de anúncio para os erros do formulário: ao enviar, o foco vai para o primeiro campo com erro, que lê a mensagem pelo `aria-describedby`, e o toast usa `role="status"`

## Organização do código

Cada arquivo em `js/modules` tem uma responsabilidade:

| Arquivo | Responsabilidade |
|---|---|
| `dados.js` | dados de exemplo |
| `storage.js` | acesso ao localStorage |
| `validacao.js` | regras de validação e máscaras |
| `ui.js` | toast e estados visuais dos campos |
| `templates.js` | HTML de cada tela |
| `router.js` | navegação por hash |

Os módulos são scripts comuns que se registram no objeto global `App` e são carregados em ordem no `index.html`. Isso permite abrir o projeto sem servidor.

## Versionamento

O projeto segue o GitFlow:

- `main`: versões estáveis, marcadas com tags (v1.0.0, v1.1.0)
- `develop`: integração do desenvolvimento
- `feature/*`: cada funcionalidade nova
- `release/*`: preparação de uma versão
- `hotfix/*`: correções urgentes na `main`

Cada problema tem uma issue, uma branch e um pull request com merge commit. As mudanças ficam registradas no [CHANGELOG](CHANGELOG.md).

Os commits seguem o padrão semântico (`feat`, `fix`, `docs`, `test`, `chore`).

## Limitações conhecidas

- O modal usa só CSS e não prende o foco do teclado
- Sem teste com leitor de tela e sem revisão manual completa de acessibilidade
- A validação é só no navegador; uma aplicação real também precisa validar no servidor
- Os projetos da ONG são dados de exemplo (fictícios)

## Autor

Mizael Margueiro de Morais. Trabalho da disciplina Desenvolvimento Front-End para Web, Cruzeiro do Sul Virtual.
