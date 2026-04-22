# PRD — Mapa do Sistema Financeiro, Pagamentos e Crédito

**Artefato principal:** `index.html` (mapa + glossário + trilha guiada Onnibank)  
**Atalhos legados:** `mapa-sistema-financeiro.html`, `ecossistema-cartoes.html` → redirecionam para `index.html`  
**Design System (versionado):** `assets/ds/ds-demo-base.css`, `assets/ds/ds-ringgo-bridge.css`  
**Versão da página:** v8.2 — bíblia integrada (UI Material 3 no claro + Ringgo no escuro)

---

## 1. Visão e propósito

**Produto:** página web estática (HTML/CSS/JS) que funciona como **mapa de referência didático integrado** sobre sistema financeiro brasileiro, pagamentos, crédito, risco e mercado.

**Problema que resolve:** centralizar em um único lugar a jornada de entendimento que normalmente fica fragmentada entre conteúdo de cartões, macroeconomia, licenças regulatórias, infraestrutura bancária e mercado de capitais.

**Público implícito:** profissionais de produto, operações, risco, vendas consultivas e liderança que precisam navegar do nível macro (SFN, Selic, câmbio) ao nível operacional (MDR, chargeback, CCD, BIN sponsor).

---

## 2. Objetivos

1. Explicar o **modelo de pagamentos e cartões** (4 partes) e a decomposição econômica das transações.
2. Conectar decisões de produto e crédito ao contexto **macroeconômico** (inflação, juros, liquidez, câmbio).
3. Tornar explícito o que é **licença regulatória** versus o que é **infraestrutura operacional**.
4. Mostrar a escada linear de licenças (`IP -> SCD/SEP -> Banco S1/S2`) e posicionar `ESD` como **trilha estratégica não linear**.
5. Consolidar segurança e risco operacional (PCI-DSS, tokenização, 3DS, chargeback).
6. Cobrir funding e mercado de capitais (CDB, FIDC, WACC/EVA, VC, RJ).
7. Disponibilizar glossário ampliado com terminologia consistente.
8. Incluir referências cruzadas entre seções para facilitar aprofundamento guiado.

**Não objetivo:** substituir normativos oficiais do BACEN, regras de bandeiras ou aconselhamento jurídico/regulatório.

---

## 3. Escopo funcional por seção

### 3.1 Fundamentos

- `Sistema Monetário`: reserva fracionária, M0/M2, compulsório, bank run, multiplicador.
- `Inflação & Juros`: mecanismo oferta/demanda, Selic, open market, COPOM, metas de inflação.
- `Sistema Global`: reservas, câmbio, padrão dólar, Fed e cadeia de confiança internacional.
- `SFN & Licenças`: CMN/BCB, escada de licenças, papel de Basileia III e distinção entre evolução linear e trilha estratégica (ESD).

### 3.2 Pagamentos

- `Ecossistema`: modelo de 4 partes, fluxos de autorização e liquidação, vouchers.
- `Infra Bancária`: BaaS vs TaaS, CIP/SPB/SPI/STR, CCD, banco liquidante, BIN/BIN sponsor/program manager, boleto registrado.
- `Taxas & MDR`, `Tiers`, `Split & Crébito`: estrutura de preço, lógica por modalidade e cenários de divisão.

### 3.3 Crédito e mercado

- `CDI & CDB`, `Títulos & Crédito`: funding, spreads, instrumentos e risco de balanço.
- `WACC & EVA`, `FIDC & Ações`: retorno econômico e securitização.
- `VC & Rodadas`, `Rec. Judicial`: ciclos de capital e sobrevivência operacional.

### 3.4 Risco e segurança

- `PCI-DSS` e `Chargeback`: governança de dado sensível, autenticação, responsabilidade e thresholds.

### 3.5 Trilha guiada e conteúdo transversal

- Aba **Trilha guiada**: narrativa em passos (Estado → IP → parceiros → cartão → infra), com atalhos para as abas técnicas.
- Blocos de **consórcio** (produto e administradora) integrados ao glossário e à narrativa onde aplicável.

### 3.6 Glossário

- **101 fichas** na grade do painel `Glossário` (cada `<div class="tc">` = um termo com tag, definição e linha de rodapé).
- Cobertura ampliada: instituições e licenças (`SFN`, `CMN`, `BCB`, `S1/S2`, `IP`, `SCD/SEP`, `ESD`), infraestrutura (`BaaS`, `TaaS`, `CIP`, `SPB`, `SPI`, `STR`, `DICT`), operação bancária (`CCD`, boleto, correspondente, BIN, BIN sponsor, program manager, ITP, banco liquidante), além de macro, VC, risco e produtos de cartão.
- Cada aba técnica mantém bloco colapsável **Termos nesta seção** + atalho para o glossário completo.

---

## 4. Coerência conceitual (v8.2)

- A escada de licenças deixa de misturar poder regulatório com trilha de produto:
  - **linear:** `IP -> SCD/SEP -> Banco S1/S2`;
  - **estratégica não linear:** `ESD`.
- Terminologia alinhada ao regulatório (`SCD/SEP` no lugar de misturar com `SFD` onde não couber).
- Referências cruzadas entre seções correlatas (`Ecossistema`, `SFN & Licenças`, `Infra Bancária`, etc.).
- **UI:** hierarquia clara entre **título de seção** (`.st`) e **rótulo de card** (`.sl` / trilha em cards estilo “bento”); modo claro inspirado em [Material Design 3](https://m3.material.io/) (superfícies tonais, pouca sombra); modo escuro mantém tokens **Ringgo** via ponte `data-ds-theme`.

---

## 5. Implementação técnica (stack)

- **Um único `index.html`:** CSS principal em `<style>`, JavaScript inline (troca de tema, painéis, busca, mapa SFN, índice).
- **Tailwind CSS** via CDN, com `preflight: false` (não quebra o CSS legado) e `darkMode` por seletor `[data-theme="dark"]`.
- **Não há** aplicação React nem pacote **shadcn/ui** instalado; o vocabulário visual (botões outline, cards, raios) é reproduzido em CSS + utilitários onde útil.
- **Tipografia:** [Roboto](https://fonts.google.com/specimen/Roboto) (400/500/700); carregamento via Google Fonts no próprio HTML.
- **Temas:**
  - **Claro:** tokens **M3-inspired** (ex.: canvas `#FEF7FF`, superfícies `#F3EDF7` / `#ECE6F0`, primário `#6750A4`) definidos no bloco `#theme-m3-light-roboto`, carregado **depois** de `ds-ringgo-bridge.css`, para sobrescrever o verde Ringgo só no claro.
  - **Escuro:** variáveis semânticas mapeadas para o DS Ringgo (`data-ds-theme="ringgo-dark"`).
- **Persistência:** preferência claro/escuro em `localStorage` (chave alinhada ao script no HTML).

---

## 6. Requisitos de interface e UX

- Navegação por **chips** de categoria (`Fundamentos`, `Crédito`, `Pagamentos`, `Risco`, `Mercado`) + **abas** horizontais (scroll em telas pequenas).
- **Busca global:** campo no topo com resultados em lista; atalho de teclado **`/`** foca a busca; índice `SEARCH_INDEX` no script para painel/âncora/termo.
- **Mobile first:** padding da área `.page` menor no viewport estreito e maior a partir de ~640px e ~1024px; abas e controles críticos com área de toque adequada onde aplicável (ex.: ~44px em tabs no claro).
- **Trilha guiada:** cards com raio grande no claro, botões de ação em estilo **outline** (borda primária, fundo transparente).
- Cada painel com **Termos nesta seção** (details/summary) e link para o glossário.

---

## 7. Acessibilidade (alvo)

- Estados de **foco visível** (`:focus-visible`) em botões, abas, busca e controles de tema.
- Uso de **`aria-*`** em abas, busca (combobox/listbox) e grupos de tema onde implementado.
- Contraste no **modo claro M3:** texto principal e variantes escolhidos para leitura sobre superfícies tonais (referência on-surface / on-surface-variant do M3).

---

## 8. Pasta `fontes/` (legado)

- HTML mantidos como **referência** após integração no `index.html`; não são o artefato principal de estudo.

---

## 9. Premissas, limitações e fontes

- Valores de taxa são didáticos e podem variar por porte, negociação e contexto de risco.
- Fontes citadas no rodapé: BACEN, Visa/Mastercard interchange, ABECS, Código Civil, B3, CVM, PCI SSC, Lei 11.101/2005.
- Conteúdo regulatório é explicativo (não substitui parecer jurídico ou consulta normativa oficial).

---

## 10. Critérios de sucesso

- Leitor entende com clareza:
  1. quem pode fazer o quê (licença);
  2. quem executa o quê (infra/trilho);
  3. onde está o risco econômico/operacional.
- Redução de ambiguidade entre termos próximos (ex.: BaaS vs TaaS; escada regulatória vs trilha ESD).
- Acesso rápido a aprofundamento por meio de referências cruzadas, busca e glossário único.

---

*Documento alinhado ao artefato único `index.html` (v8.2); atalhos legados redirecionam para o mesmo arquivo.*
