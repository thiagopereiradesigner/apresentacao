# Ecossistema de cartões & crédito

**Versão do artefato:** v8.7 (ver badge no `index.html`).  
**Fio narrativo:** IP fictícia **Ringgo** (folha, benefícios, cartão e crédito via parceiros).

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

HTML usados como **referência histórica** após integração em `index.html`. **Não são a fonte da verdade** — para estudar, use sempre a raiz. A nomenclatura canônica (SCD, CCB, Ringgo) está no `index.html`.

- `fontes/como-banco-lucra-credito.html`
- `fontes/ecosistema-bancario-narrativo.html`
- `fontes/ecossistema-bancario-br.html`

## Documentação

- [`PRD-ecossistema-cartoes.md`](PRD-ecossistema-cartoes.md) — visão de produto, escopo por seção, glossário (~135 termos), stack, UX e acessibilidade.

## Destaques de conteúdo (v8.7)

- Vocabulário canônico: **SCD** (alias SFD), **CCB** (alias CCD); fio **Ringgo**.
- Aba **Folha & Pagamento** enriquecida: quem calcula/declara/paga; arquivo vs ERP; FGTS/guias ≠ líquido; sem ERP (contador); Dataprev só no INSS; fiscalização vs certeza em tempo real.
- Aba **Consignado** com três trilhas (privado, público servidor, INSS).
- **Ecossistema:** bandeira × emissor, modalidades e benefícios; **Tiers** MCC × CNAE.
- **Infra:** bolsão, transitória, caução, escrow.
- Glossário ~135 termos.
