# Ecossistema de cartões & crédito

## O que abrir

- **Página principal (bíblia de estudo, HTML completo):** [`index.html`](index.html)
- **Atalhos legados:** [`ecossistema-cartoes.html`](ecossistema-cartoes.html) e [`mapa-sistema-financeiro.html`](mapa-sistema-financeiro.html) redirecionam para `index.html`.

## Design System (tokens Ringgo)

- [`assets/ds/ds-demo-base.css`](assets/ds/ds-demo-base.css) — cópia versionada dos tokens (evita `../../../meu-design-system` fora do repo).
- [`assets/ds/ds-ringgo-bridge.css`](assets/ds/ds-ringgo-bridge.css) — ponte das variáveis semânticas do mapa (`--bg`, `--accent`, …) para `--ds-*`.

Se atualizar o DS noutro projeto, substitua `ds-demo-base.css` e confira se os nomes dos tokens batem com o bridge.

## Pasta `fontes/`

HTML usados como **referência** ou arquivo morto após integração em `index.html`. Para estudar, use sempre a raiz.

- `fontes/como-banco-lucra-credito.html`
- `fontes/ecosistema-bancario-narrativo.html`
- `fontes/ecossistema-bancario-br.html`

## Documentação

- [`PRD-ecossistema-cartoes.md`](PRD-ecossistema-cartoes.md) — PRD do projeto, se aplicável.
