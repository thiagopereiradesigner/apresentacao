# Piloto da Aula 08

O piloto **não está aceito**. Falta Safari/iOS (iPhone real ou Simulador) e Firefox. O renderizador continua o Temml 0.14.0. O plano B (KaTeX) não foi ligado.

Conferência feita neste ambiente: navegador Chromium do Cursor, em 27/10/2026. Larguras 360, 768 e cerca de 927. Temas claro e escuro. Sem captura arquivada.

| Critério | Chromium | Firefox | Safari/iOS |
|---|---|---|---|
| 1. MathML desenhado e fallback oculto | ✔ `display: block math`; fallback `none` | não executado | não executado |
| 2. F1, F2 e F3 sem corte | F2 vista na aula. F1 e F3 estão em `tests/formulas-aula08.html`. Corte fino não medido pixel a pixel | não executado | não executado |
| 3. "Em palavras:" visível | ✔ | não executado | não executado |
| 4. Cor de `--text` e contraste ≥ 4.5 | ✔ claro `rgb(29, 27, 32)`; escuro texto claro. `scripts/check-contrast.mjs` passou nos dois temas | não executado | não executado |
| 5. 360px sem rolagem da página; região da fórmula focável | ✔ a página não rolou na horizontal. A região tem `tabindex="0"` | não executado | não executado |
| 6. Leitor de tela | não executado | não executado | não executado |
| 7. Fallback com `@supports` invertido | não executado | não executado | não executado |
| 8. Sem script dentro da fórmula | ✔ | não executado | não executado |
