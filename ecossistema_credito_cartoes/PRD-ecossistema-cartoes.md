# PRD — Mapa do Sistema Financeiro, Pagamentos e Crédito

**Artefato principal:** `mapa-sistema-financeiro.html`  
**Artefato de conteúdo (compatibilidade):** `ecossistema-cartoes.html`  
**Versão da página:** v6 — integrado

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
- `SFN & Licenças` (novo): CMN/BCB, escada de licenças, papel de Basileia III e distinção entre evolução linear e trilha estratégica (ESD).

### 3.2 Pagamentos

- `Ecossistema`: modelo de 4 partes, fluxos de autorização e liquidação, vouchers.
- `Infra Bancária` (novo): BaaS vs TaaS, CIP/SPB/SPI/STR, CCD, banco liquidante, BIN/BIN sponsor/program manager, boleto registrado.
- `Taxas & MDR`, `Tiers`, `Split & Crébito`: estrutura de preço, lógica por modalidade e cenários de divisão.

### 3.3 Crédito e mercado

- `CDI & CDB`, `Títulos & Crédito`: funding, spreads, instrumentos e risco de balanço.
- `WACC & EVA`, `FIDC & Ações`: retorno econômico e securitização.
- `VC & Rodadas`, `Rec. Judicial`: ciclos de capital e sobrevivência operacional.

### 3.4 Risco e segurança

- `PCI-DSS` e `Chargeback`: governança de dado sensível, autenticação, responsabilidade e thresholds.

### 3.5 Glossário

- Glossário ampliado para **86 termos**, incluindo novo bloco de:
  - instituições e licenças (`SFN`, `CMN`, `BCB`, `S1/S2`, `IP`, `SCD/SEP`, `ESD`);
  - infraestrutura (`BaaS`, `TaaS`, `CIP`, `SPB`, `SPI`, `STR`, `DICT`);
  - operação bancária aplicada (`CCD`, `Boleto Registrado`, `Correspondente Bancário`, `BIN`, `BIN Sponsor`, `Program Manager`, `ITP`, `Banco Liquidante`).

---

## 4. Coerência conceitual aplicada na v6

- A escada de licenças deixa de misturar poder regulatório com trilha de produto:
  - **linear:** `IP -> SCD/SEP -> Banco S1/S2`;
  - **estratégica não linear:** `ESD`.
- Terminologia atualizada para manter consistência regulatória (`SCD/SEP` no lugar de `SCD/SFD`).
- Inserção de blocos "Ver também" para conexão entre seções correlatas:
  - `Ecossistema -> SFN & Licenças / Infra Bancária`
  - `Infra Bancária -> Ecossistema / Títulos & Crédito`
  - `SFN & Licenças -> Infra Bancária`

---

## 5. Requisitos de interface

- Navegação por chips de categoria (`Fundamentos`, `Crédito`, `Pagamentos`, `Risco`, `Mercado`) + tabs detalhadas.
- Cada painel com bloco colapsável **Termos nesta seção** e atalho para glossário.
- Tema claro/escuro persistido em `localStorage`.
- Estrutura visual baseada em cards, cadeias de fluxo, comparativos e notas de leitura.

---

## 6. Premissas, limitações e fontes

- Valores de taxa são didáticos e podem variar por porte, negociação e contexto de risco.
- Fontes citadas no rodapé: BACEN, Visa/Mastercard interchange, ABECS, Código Civil, B3, CVM, PCI SSC, Lei 11.101/2005.
- Conteúdo regulatório é explicativo (não substitui parecer jurídico ou consulta normativa oficial).

---

## 7. Critérios de sucesso

- Leitor entende com clareza:
  1. quem pode fazer o quê (licença);
  2. quem executa o quê (infra/trilho);
  3. onde está o risco econômico/operacional.
- Redução de ambiguidade entre termos próximos (ex.: BaaS vs TaaS; escada regulatória vs trilha ESD).
- Acesso rápido a aprofundamento por meio de referências cruzadas e glossário único.

---

*Documento atualizado a partir do conteúdo de `ecossistema-cartoes.html` e ponto de entrada `mapa-sistema-financeiro.html` na versão v6.*
