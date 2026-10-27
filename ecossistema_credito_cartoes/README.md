# Ecossistema de cartões & crédito

**Versão:** v9.0.0  
**Fio narrativo:** IP fictícia **Ringgo** (folha, benefícios, cartão e crédito via parceiros). Não usar Onnibank.

## O que abrir

- O endereço público abre o [`index.html`](index.html) desta pasta. O build grava nele a mesma página de [`dist/index.html`](dist/index.html).
- As duas abrem offline, por duplo clique.
- [`ecossistema-cartoes.html`](ecossistema-cartoes.html) e [`mapa-sistema-financeiro.html`](mapa-sistema-financeiro.html) redirecionam para o `index.html` da raiz.

## Como rodar o build

Na raiz do projeto:

```bash
npm install
npm run build
```

O comando gera `dist/index.html` e copia a mesma página para `index.html`. Não edite esses arquivos à mão. A fonte fica em `src/`, `data/` e `build/`.

## Como adicionar uma aula

1. Crie o arquivo em `src/aulas/mMM/aulaNN.html` se a aula precisar de um trecho próprio.
2. Registre a aula em `data/curriculo.json`: número, título, módulo, status (`dada` ou `a seguir`) e `abas_relacionadas`.
3. Se a aula tiver fórmula, preencha `formula.tex`, `formula.linear` e `formula.leitura`. Sem `linear` ou `leitura`, o build para.
4. Rode `npm run build`.

O nome na tela é Ringgo. Número que não estiver no material fica `[a validar]`. Afirmação regulatória leva "Validar com o jurídico".

## Estrutura

- `src/shell.html` — cabeçalho, chips, abas e busca
- `src/abas/` — os 24 painéis
- `src/scripts/` — navegação, busca, tema, trilha e componentes
- `src/styles/` — CSS da página, tema claro e componentes
- `data/curriculo.json` — módulos e aulas
- `data/glossario.json` — 135 fichas
- `data/ancoras.json` — ids de seção
- `build/build.mjs` — gera o `dist`
- `assets/ds/` — tokens do design system
- `baseline/` e `_archive/` — cópia da v8.7, sem edição
- `tests/formulas-aula08.html` — F1, F2 e F3 da Aula 08
- `fontes/` — referência histórica, não é a fonte da verdade

## Stack

- HTML único gerado, sem CDN.
- Tailwind CSS 3.4.17 compilado, com preflight desligado.
- Roboto embutida.
- Tema escuro: tokens Ringgo. Tema claro: Material 3 por cima do design system.
- Fórmula em MathML gerado no build com Temml 0.14.0. O Temml não vai para a página.

O piloto da Aula 08 no Safari/iOS ainda não foi feito. Enquanto isso, o renderizador continua o Temml. O registro está em `docs/piloto-aula08.md`.

## Documentação

- [`PRD-ecossistema-cartoes.md`](PRD-ecossistema-cartoes.md)
- [`docs/tailwind-versao.md`](docs/tailwind-versao.md)
- [`docs/build-report.md`](docs/build-report.md)
