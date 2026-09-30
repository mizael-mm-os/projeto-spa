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
└── js/
    ├── main.js             ponto de entrada e eventos
    └── modules/            dados, storage, validacao, ui, templates e router
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

- `main`: versões estáveis, marcadas com tags (v1.0.0)
- `develop`: integração do desenvolvimento
- `feature/*`: cada funcionalidade nova
- `release/*`: preparação de uma versão
- `hotfix/*`: correções urgentes na `main`

Os commits seguem o padrão semântico (`feat`, `fix`, `docs`, `chore`).

## Limitações conhecidas

- O modal e o menu hambúrguer usam só CSS, então não prendem o foco do teclado nem atualizam `aria-expanded`
- A validação é só no navegador; uma aplicação real também precisa validar no servidor
- Os projetos da ONG são dados de exemplo (fictícios)

## Autor

Mizael Margueiro de Morais. Trabalho da disciplina Desenvolvimento Front-End para Web, Cruzeiro do Sul Virtual.
