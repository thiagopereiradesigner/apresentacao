# Ecossistema de cartões & crédito

**Versão do artefato:** v8.2 (ver badge no `index.html`).

## O que abrir

- **Página principal (bíblia de estudo, HTML completo):** [`index.html`](index.html)
- **Atalhos legados:** [`ecossistema-cartoes.html`](ecossistema-cartoes.html) e [`mapa-sistema-financeiro.html`](mapa-sistema-financeiro.html) redirecionam para `index.html`.

## Stack (resumo)

- HTML estático único, CSS inline + **Tailwind CDN** (`preflight` desligado; tema escuro por `data-theme`).
- **Roboto** (Google Fonts). **Modo claro:** paleta e superfícies inspiradas em [Material Design 3](https://m3.material.io/) (bloco `#theme-m3-light-roboto` após o DS). **Modo escuro:** tokens **Ringgo** via ponte abaixo.
- Sem app React; não há shadcn/ui instalado como dependência.

## Design System (tokens Ringgo)

- [`assets/ds/ds-demo-base.css`](assets/ds/ds-demo-base.css) — cópia versionada dos tokens (evita caminhos fora do repo).
- [`assets/ds/ds-ringgo-bridge.css`](assets/ds/ds-ringgo-bridge.css) — ponte das variáveis semânticas do mapa (`--bg`, `--accent`, …) para `--ds-*`.

O **tema claro** aplica cores M3 **por cima** da ponte (último `<style>` no `<head>`), para não depender do verde Ringgo na leitura diurna. O **tema escuro** segue a ponte como antes.

Se atualizar o DS noutro projeto, substitua `ds-demo-base.css` e confira se os nomes dos tokens batem com o bridge; depois revise o bloco M3 claro se algum token compartilhado mudar de significado.

## Pasta `fontes/`

HTML usados como **referência** ou arquivo morto após integração em `index.html`. Para estudar, use sempre a raiz.

- `fontes/como-banco-lucra-credito.html`
- `fontes/ecosistema-bancario-narrativo.html`
- `fontes/ecossistema-bancario-br.html`

## Documentação

- [`PRD-ecossistema-cartoes.md`](PRD-ecossistema-cartoes.md) — visão de produto, escopo por seção, glossário (101 termos), stack, UX e acessibilidade.
