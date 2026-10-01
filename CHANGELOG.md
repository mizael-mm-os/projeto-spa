# Changelog

Todas as mudanças relevantes deste projeto ficam neste arquivo.
O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.2.1] - 2026-09-30

Correção de documentação.

### Corrigido
- Tamanho de CSS e JS antes do build no README e no CHANGELOG: eram 35.064 bytes (35,1 KB) e estava escrito 34,5 KB

## [1.2.0] - 2026-09-30

Versão de build de produção e publicação.

### Adicionado
- Script de build com esbuild: junta e minifica CSS e JS e gera `dist/` (#18, #21)
- Publicação no GitHub Pages por GitHub Actions (#19, #22)
- Favicon, que evita o 404 em `/favicon.ico` (#17, #20)

### Medições
- CSS e JS: de 14 arquivos e 35,1 KB para 2 arquivos e 22,3 KB (12.235 bytes de CSS e 10.070 de JS)
- Lighthouse por HTTP local na `dist/`: acessibilidade 100, desempenho 100 e melhores práticas 100 nas 4 telas (antes do favicon, a tela inicial tinha 96 em melhores práticas)
- Imagens não alteradas: webp 11 KB, jpg 16 KB e png 18 KB

## [1.1.0] - 2026-09-30

Versão de acessibilidade, a partir de uma auditoria com Playwright, axe-core e Lighthouse.

### Adicionado
- Link "Pular para o conteúdo", escondido até receber foco (#1, #2)
- Fechar o menu do celular e o dropdown do desktop com a tecla Esc (#15, #16)
- Pasta `tests/` com auditoria automatizada: Playwright, axe-core e Lighthouse (#3, #4)

### Corrigido
- Rolagem horizontal em todas as larguras de 320 a 1600px: faltava `box-sizing` e o submenu oculto passava da tela (#5, #6)
- Botão do menu hambúrguer sem nome acessível e com `aria-label` em lugar proibido (#7, #8)
- Checkbox do menu focável e invisível no desktop (#9, #10)
- Salto de título de h1 para h3 na tela de projetos (#11, #12)
- Quatro links "Participar" com o mesmo nome acessível (#13, #14)

### Resultado da auditoria
- axe-core (wcag2a, wcag2aa, wcag21a, wcag21aa): de 1 violação crítica por rota para 0 nas 5 rotas
- Lighthouse, acessibilidade: de 92 a 95 para 100 nas 4 telas

## [1.0.0] - 2026-09-30

Primeira versão publicada.

### Adicionado
- SPA com navegação por hash entre quatro telas: início, projetos, cadastro e cadastros salvos
- Formulário com validação em tempo real, CPF com dígitos verificadores e máscaras
- Cadastros no `localStorage`, sem gravar o CPF
- Menu com dropdown e hambúrguer feitos só com CSS
- Design system em variáveis CSS, grid de 12 colunas e 5 breakpoints
- Componentes de feedback: badges, alertas, toast e modal

[1.2.1]: https://github.com/mizael-mm-os/projeto-spa/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/mizael-mm-os/projeto-spa/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/mizael-mm-os/projeto-spa/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/mizael-mm-os/projeto-spa/releases/tag/v1.0.0
