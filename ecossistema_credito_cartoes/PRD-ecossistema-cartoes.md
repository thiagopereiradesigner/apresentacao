# PRD — Mapa de referência: Ecossistema de Cartões & Crédito

**Artefato relacionado:** `ecossistema-cartoes.html`  
**Versão da página:** v5 — completo

---

## 1. Visão e propósito

**Produto:** página web estática (HTML/CSS/JS) que funciona como **mapa de referência didático** sobre o ecossistema de cartões, crédito, mercado de capitais correlato, venture capital, recuperação judicial, segurança PCI e chargeback.

**Problema que resolve:** centralizar em um único lugar conceitos, faixas de taxa, fluxos operacionais e glossário para estudo rápido ou apresentação.

**Público implícito:** quem precisa entender **participantes, MDR, tiers, encargos, CDI/CDB, split, WACC/EVA, FIDC, VC, RJ, PCI-DSS e chargeback** no contexto brasileiro.

---

## 2. Objetivos

1. Explicar o **modelo de 4 partes** (portador, emissor, bandeira, adquirente) e **quem ganha o quê**.
2. Descrever o **fluxo ponta a ponta** da transação até a liquidação.
3. Dar **ordens de grandeza** de MDR, IC, scheme fee e provisão (com aviso de aproximação).
4. Conectar **CDI/Selic/CDB** ao **spread** do banco e à **taxa livre de risco**.
5. Ilustrar **métricas corporativas** (WACC, EVA) e **estrutura de FIDC**.
6. Cobrir **VC** (power law, rodadas, diluição, vieses) e **RJ** (cenários, ciclo macro 2020–2024, unit economics).
7. Cobrir **PCI-DSS**, **tokenização**, **3DS** e **chargeback** (fluxo e responsabilidades).
8. Oferecer **glossário** com ~35 termos.

**Não objetivo explícito na página:** substituir contratos, tabelas oficiais de interchange ou assessoria; o rodapé reforça que valores são **aproximações didáticas**.

---

## 3. Escopo funcional (informação por aba)

### 3.1 Ecossistema

- **Quatro participantes:** portador (PF/PJ); emissor (ex.: Nubank, Itaú, Onnibank, C6, Inter, XP); bandeira (Visa, Mastercard, Elo, Amex, Hipercard); adquirente (Cielo, Stone, PagSeguro, Rede, Getnet, SumUp).
- **Fontes de receita resumidas:** emissor (IC, rotativo, anuidade, float); bandeira (scheme fee dos dois lados); adquirente (MDR − IC − scheme fee − operacional).
- **Fluxo em 5 etapas:** captura → roteamento → autorização → resposta (~1 s) → liquidação (D+1 débito / D+30 crédito).
- **Vouchers (rede semi-fechada):** alimentação (PAT), refeição (MCC 5812, PAT), combustível (MCC específico, frota), outros (farmácia, cultura, mobilidade).

### 3.2 Taxas & MDR

- **Exemplo Platinum, R$ 100:** MDR total ~2,20%; decomposição ilustrativa: IC ~1,30%, scheme fee ~0,10%, adquirente ~0,70%, provisão ~0,10%.
- **Faixas:** débito ~0,70%–1,20%; crédito à vista ~1,80%–2,50%; parcelado ~2,50%–3,50%+.

### 3.3 Tiers

- **IC aproximado e MDR por tier:** Classic (0,75% / ~1,60%), Gold (1,00% / ~1,90%), Platinum (1,30% / ~2,20%), Black (1,60% / ~2,60%), Titanium (2,00% / ~3,00%+).
- **MCC de exemplo:** 5411 supermercados, 5812 restaurantes, 5541 postos, 7011 hotéis.

### 3.4 Encargos

- **TAC:** cobrada na concessão; exemplo limite R$ 5.000 → TAC R$ 150; menção à limitação BACEN em crédito PF.
- **CET:** TAC + juros + IOF + seguros; exemplo juros 3,5% a.m. → CET 4,8%; Res. BACEN 3.517.
- **Atraso (exemplo fatura R$ 1.000, mínimo R$ 150):** multa 2% (1×), mora 1%/mês, rotativo ~15%/mês (proporção visual ao impacto).
- **Tabela produtos:** rotativo, empréstimo pessoal, consignado, financiamento, cartão — com garantia, faixa de taxa e nível de risco.

### 3.5 CDI & CDB

- **CDI (referência na página — abr/2026):** ~14,65% a.a., ~1,14% a.m., ~0,054% a.d.; Selic ~14,75% a.a.; CDI ~0,10 p.p. abaixo da Selic.
- **CDB:** contrato de empréstimo ao banco; FGC até R$ 250k por CPF por banco; taxa em % do CDI; exemplo spread: captação ~100% CDI vs rotativo ~200% a.a. → spread bruto ~185% a.a. (ilustrativo).
- **Referências de investimento:** poupança ~70% CDI; fundo DI ~95–99%; Tesouro Selic ~100%; CDB grande 90–100%; CDB pequeno 110–130%; LCI/LCA 85–95% (isento IR).

### 3.6 Split & Crébito

- **Split marketplace:** exemplo R$ 300 iFood — 85% restaurante, 10% iFood, 5% outro (visual).
- **Crébito:** saldo à vista (débito) + limite (crédito/fatura); criado pela Elo, Brasil.

### 3.7 WACC & EVA

- **WACC exemplo:** 60% dívida × 12% + 40% equity × 18% → **14,4% a.a.**; relação CDI alto/baixo com WACC.
- **Regra prática:** retorno < WACC destrói valor; > WACC cria valor.
- **EVA exemplo numérico:** receita op. R$ 8M − inadimplência R$ 2M − operacional R$ 1,5M = lucro op. R$ 4,5M − capital × WACC R$ 4,32M → **EVA +R$ 180k**; nota: EVA perto de zero → sensível a inadimplência.

### 3.8 FIDC & ações

- **Cotas:** sênior (CDI + 1–2% a.a.), mezanino (CDI + 3–5% a.a.), júnior (residual, absorção de perdas).
- **Cadeia:** consignado → banco empacota FIDC → fundo de pensão compra cotas → investidor analisa EVA do banco.
- **CDI como custo de oportunidade:** contraste CDI alto vs baixo (~2% em 2021) e efeitos em bolsa, dívida, WACC e EVA.

### 3.9 VC & rodadas

- **Power law:** distribuição de retornos (exemplo 10 startups, uma com retorno muito alto paga o fundo).
- **Rodadas:** Pre-Seed R$ 500k–2M; Seed R$ 2M–10M; Série A R$ 10M–50M; Série B R$ 50M–200M; Série C+/IPO R$ 200M+ — com “quem investe”, “o que olham”, risco e fase (ideia→MVP→tração→escala etc.).
- **Diluição / pro-rata:** 20% após Seed → sem participar ~12% vs com pro-rata ~20% vs “doubled down” ~25%; valuation potencial R$ 1B como âncora mental.
- **Métricas por fase:** Pre-Seed/Seed (churn, NPS, founder); A (PMF, retenção); B (ARR, GMV); C+ (CAC, LTV, payback).
- **Vieses:** sunk cost, FOMO, assimetria de informação, pressão de deploy, write-down avoidance, optimism bias.

### 3.10 Recuperação judicial

- **Dois cenários:** empresa que “vinga” (crescimento, LTV > CAC, rodadas validando, break-even visível, exemplos Nubank, Stone, Totvs) vs caminho para RJ (CAC > LTV, rodadas postergando, dependência de funding).
- **Linha do tempo macro:** 2020–2021 Selic ~2%; 2022 alta Selic 13→13,75%; 2023–2024 secagem de rodadas (exemplos Americanas, 123milhas, Tok&Stok); RJ Lei 11.101/2005, prazo típico ~2 anos para plano.
- **Unit economics de referência:** CAC R$ 200, LTV R$ 800, LTV/CAC 4x, payback 8 meses, churn 3%/mês, break-even mês 18 — com interpretação.
- **Alerta:** CAC > LTV não se resolve com mais rodadas; apenas posterga.
- **Queima de caixa:** quando faz sentido (TAM grande, network effects, winner-takes-all, exemplos BR) vs quando não (nicho, sem efeito de rede, comoditização).

### 3.11 PCI-DSS

- Definição: padrão da indústria, **requisito contratual**, não lei.
- Pilares resumidos: rede segura, proteção de dados (ex.: não armazenar CVV; criptografar PAN), controle de acesso e logs.
- **Jornada do dado** com responsável (adquirente vs lojista) em cada etapa.
- **Tokenização** (PAN → token) e **3DS** (com/sem fraude: quem absorve chargeback).

### 3.12 Chargeback

- **Fluxo:** portador contesta → emissor analisa (até 45 dias) → bandeira notifica → adquirente debita lojista → portador reembolsado.
- **Quem absorve:** matriz emissor vs adquirente/lojista vs friendly fraud (~20–40% no e-commerce).
- **Thresholds:** &lt;1% ok; 1–2% monitorar; &gt;2% risco de descredenciamento.

### 3.13 Glossário

- **35 termos** nas categorias: taxas (MDR, IC, scheme fee, TAC, CET), ciclo (float, CDI), investimento (CDB, WACC, EVA, FIDC, taxa livre de risco), VC (power law, pro-rata, diluição, PMF, CAC, LTV, churn, ARR, break-even, IPO), legal (RJ), viés (sunk cost, FOMO), encargo (rotativo), produto (Crébito), infra (split, MCC), segurança (PCI-DSS, tokenização, 3DS), fraude (chargeback, friendly fraud).

---

## 4. Requisitos de interface (como a página entrega)

- **Navegação por abas:** Ecossistema, Taxas & MDR, Tiers, Encargos, CDI & CDB, Split & Crébito, WACC & EVA, FIDC & Ações, VC & Rodadas, Rec. Judicial, PCI-DSS, Chargeback, Glossário.
- **Visual:** tema escuro, tipografia Syne + IBM Plex Mono, cartões, barras proporcionais, tabelas e notas de rodapé.
- **Comportamento:** `showPanel(id)` alterna painéis e estado ativo das abas.

---

## 5. Premissas, limitações e fontes citadas

- Taxas e valores são **aproximações de mercado para fins didáticos**; variam por emissor, bandeira, volume e negociação.
- **Fontes nomeadas no rodapé da página:** BACEN; interchange Visa/Mastercard; ABECS; Código Civil; B3; CVM; PCI SSC; Lei 11.101/2005.

---

## 6. Critérios de sucesso do artefato (como documento)

- Cobertura dos temas do subtítulo da página: participantes, MDR, tiers, encargos, CDI, CDB, split, Crébito, WACC, EVA, FIDC, PCI-DSS, VC, rodadas, recuperação judicial.
- Um leitor consegue **localizar definição + ordem de grandeza** na aba correspondente ou no glossário.

---

*Documento gerado a partir do conteúdo de `ecossistema-cartoes.html`.*
