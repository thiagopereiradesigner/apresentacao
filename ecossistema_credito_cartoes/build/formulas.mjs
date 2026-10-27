import temml from 'temml';

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escAttr(s) {
  return esc(s).replace(/"/g, '&quot;');
}

export function mathml(tex, alt) {
  const bruto = temml.renderToString(tex, { displayMode: true, throwOnError: true });
  const limpo = bruto.replace(/\sclass="[^"]*"/g, '').replace(/\sstyle="[^"]*"/g, '');
  if (!limpo.startsWith('<math')) throw new Error('Temml não devolveu MathML.');
  return limpo.replace('<math ', '<math alttext="' + escAttr(alt) + '" ');
}

export function figuraFormula(f, id) {
  if (!f || !f.tex || !f.linear || !f.leitura) throw new Error('Fórmula sem tex, linear ou leitura: ' + id);
  const math = mathml(f.tex, f.leitura);
  const vars = (f.variaveis || [])
    .map((v) => '<dt>' + esc(v.nome) + '</dt><dd>' + esc(v.desc) + '</dd>')
    .join('');
  const titulo = f.titulo || 'Fórmula';
  const html = `<figure class="cmp cmp-formula" aria-labelledby="${id}">
  <figcaption id="${id}">${esc(titulo)}</figcaption>
  <div class="cmp-scroll" role="region" aria-label="${escAttr(titulo)} (role para os lados)" tabindex="0">
    ${math}
    <span class="cmp-math-fallback">${esc(f.linear)}</span>
  </div>
  <p class="cmp-read"><b>Em palavras:</b> ${esc(f.leitura)}</p>
  ${vars ? '<dl class="cmp-vars">' + vars + '</dl>' : ''}
</figure>`;
  if (!html.includes('class="cmp-read"') || /<script/i.test(html)) {
    throw new Error('A fórmula não pode ir para a página: ' + id);
  }
  return html;
}
