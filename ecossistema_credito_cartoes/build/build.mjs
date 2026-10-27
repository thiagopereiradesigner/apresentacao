import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import zlib from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { figuraFormula } from './formulas.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function get(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = new URL(res.headers.location, url).href;
        res.resume();
        get(next, headers).then(resolve, reject);
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
  });
}

async function robotoCss() {
  const cache = path.join(root, 'src/styles/fonts/roboto.css');
  if (fs.existsSync(cache)) return fs.readFileSync(cache, 'utf8');
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
  const cssUrl = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
  const cssRes = await get(cssUrl, { 'User-Agent': ua });
  if (cssRes.status !== 200) throw new Error('Roboto CSS HTTP ' + cssRes.status);
  let css = cssRes.body.toString('utf8');
  const urls = [...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]);
  const dir = path.join(root, 'src/styles/fonts');
  fs.mkdirSync(dir, { recursive: true });
  for (const fontUrl of urls) {
    const font = await get(fontUrl, { 'User-Agent': ua });
    if (font.status !== 200) throw new Error('Fonte HTTP ' + font.status + ' ' + fontUrl);
    const b64 = font.body.toString('base64');
    css = css.replace(fontUrl, 'data:font/woff2;base64,' + b64);
  }
  if (css.includes('https://')) throw new Error('Ainda há URL remota no CSS da Roboto.');
  fs.writeFileSync(cache, css);
  return css;
}

function compileTailwind() {
  const bin = path.join(root, 'node_modules', 'tailwindcss', 'lib', 'cli.js');
  if (!fs.existsSync(bin)) {
    throw new Error('Tailwind não instalado. Rode npm install na raiz do projeto.');
  }
  const result = spawnSync(process.execPath, [
    bin,
    '-c', 'tailwind.config.cjs',
    '-i', 'src/styles/tailwind-input.css',
    '-o', 'src/styles/tailwind.generated.css',
    '--minify',
  ], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error('Tailwind falhou.\n' + (result.stdout || '') + (result.stderr || ''));
  }
  return fs.readFileSync(path.join(root, 'src/styles/tailwind.generated.css'), 'utf8');
}

function slugify(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function plain(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function corte(s, max) {
  const texto = String(s || '').replace(/\s+/g, ' ').trim();
  if (texto.length <= max) return texto;
  const fatia = texto.slice(0, max - 1);
  const espaco = fatia.lastIndexOf(' ');
  const base = (espaco > 24 ? fatia.slice(0, espaco) : fatia).trim();
  const saida = base + '…';
  return saida.length <= max ? saida : saida.slice(0, max);
}

function primeiraFrase(texto) {
  const m = texto.match(/^(.{1,220}?[.!?])(?:\s|$)/);
  return (m ? m[1] : texto).trim();
}

function renderGlossario(data) {
  const usados = new Set();
  return data.fichas
    .map((c) => {
      let id = slugify(plain(c.termo)) || 'termo';
      let n = 2;
      while (usados.has(id)) {
        id = slugify(plain(c.termo)) + '-' + n;
        n += 1;
      }
      usados.add(id);
      c._id = id;
      return `<div class="tc" id="${id}"><div class="tag ${c.tagClass}">${c.tag}</div><div class="tn">${c.termo}</div><div class="td">${c.definicao}</div><div class="tv">${c.rodape}</div></div>`;
    })
    .join('\n    ');
}

function stripRemoteImports(css) {
  return css.replace(/@import url\('https:\/\/fonts\.googleapis\.com[^']*'\);\r?\n/g, '');
}

const fonts = await robotoCss();
const tailwind = compileTailwind();
const base = read('src/styles/base.css');
const m3 = read('src/styles/theme-m3.css');
const dsBase = stripRemoteImports(read('assets/ds/ds-demo-base.css'));
const dsBridge = read('assets/ds/ds-ringgo-bridge.css');
const shell = read('src/shell.html');
const footer = read('src/footer.html');
const order = JSON.parse(read('src/abas/order.json'));
const glossario = JSON.parse(read('data/glossario.json'));
const curriculo = read('data/curriculo.json').trim();
const glossarioJson = JSON.stringify({ total: glossario.total, fichas: glossario.fichas });

function escaparScript(json) {
  return String(json).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

const curriculoObj = JSON.parse(curriculo);
for (const aula of curriculoObj.aulas) {
  if (aula.papel) throw new Error('Aula ' + aula.n + ': papel não pode ser preenchido pelo build.');
  if (aula.status === 'a seguir' && (aula.cenario || (aula.erros && aula.erros.length))) {
    throw new Error('Aula ' + aula.n + ' é a seguir e não leva cenário nem erros comuns.');
  }
  if (aula.status === 'dada' && aula.no_trabalho) {
    throw new Error('Aula ' + aula.n + ' é dada e não usa o bloco no-trabalho.');
  }
  if (aula.erros && aula.erros.length > 3) throw new Error('Aula ' + aula.n + ' tem mais de 3 erros comuns.');
}
const pacote = JSON.parse(read('package.json'));
const versaoTemml = pacote.devDependencies && pacote.devDependencies.temml;
if (!versaoTemml || /[\^~]/.test(versaoTemml)) throw new Error('Temml precisa de versão exata no package.json.');
const formulaCfg = JSON.parse(read('build.config.json'));
if (formulaCfg.formulaRenderer !== 'temml') {
  throw new Error('formulaRenderer está em ' + formulaCfg.formulaRenderer + '. O plano B só entra se o Safari/iOS falhar no piloto.');
}
const publicado = JSON.parse(JSON.stringify(curriculoObj));
for (const aula of publicado.aulas) {
  if (!aula.formula) continue;
  aula.formula.html = figuraFormula(aula.formula, 'f' + String(aula.n).padStart(2, '0') + '-t');
  delete aula.formula.tex;
}
const curriculoPublicado = JSON.stringify(publicado);

function montarSelect(html) {
  const grupos = { fund: 'Fundamentos', cred: 'Crédito', pay: 'Pagamentos', risk: 'Risco', mkt: 'Mercado' };
  const ordem = [];
  const por = {};
  for (const m of html.matchAll(/data-cat="([^"]+)"[^>]*data-panel="([^"]+)"[\s\S]*?<\/button>/g)) {
    const cat = m[1];
    const id = m[2];
    const nome = m[0].replace(/^[\s\S]*?>/, '').replace(/<span class="tab-badge">[\s\S]*?<\/span>/, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!por[cat]) {
      por[cat] = [];
      ordem.push(cat);
    }
    por[cat].push({ id, nome });
  }
  const total = ordem.reduce((n, cat) => n + por[cat].length, 0);
  if (total !== 24) throw new Error('O select precisa das 24 abas. Veio ' + total + '.');
  const miolo = ordem.map((cat) => {
    const opts = por[cat].map((o) => '<option value="' + o.id + '">' + o.nome + '</option>').join('\n');
    return '<optgroup label="' + (grupos[cat] || cat) + '">\n' + opts + '\n</optgroup>';
  }).join('\n');
  const select = '<label for="nav-select" class="visually-hidden">Ir para a aba</label>\n<select id="nav-select" class="nav-select">\n' + miolo + '\n</select>\n';
  return html.replace('<div class="tabs ', select + '<div class="tabs ');
}
const shellNav = montarSelect(shell);
const nomes = {};
for (const m of shell.matchAll(/data-panel="([^"]+)"[\s\S]*?<\/button>/g)) {
  const inner = m[0].replace(/^[\s\S]*?>/, '').replace(/<span class="tab-badge">[\s\S]*?<\/span>/, '');
  nomes[m[1]] = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

const porAba = {};
for (const aula of curriculoObj.aulas) {
  for (const rel of aula.abas_relacionadas || []) {
    if (!porAba[rel.slug]) porAba[rel.slug] = [];
    porAba[rel.slug].push(aula);
  }
}

function itemVisto(aula) {
  const status = aula.status === 'a seguir' ? 'a seguir' : 'dada';
  const label = status === 'dada' ? 'Dada' : 'A seguir';
  const num = String(aula.n).padStart(2, '0');
  return `<li><a href="#aula-${num}" class="va-link"><span class="va-n">Aula ${num}</span><span class="va-t">${plain(aula.titulo)}</span></a><span class="badge-status" data-status="${status}">${label}<span class="visually-hidden">Status: ${label}</span></span></li>`;
}

function htmlVisto(id, aulas) {
  if (!aulas.length || id === 'trilha-guiada') return '';
  const ordem = aulas.slice().sort((a, b) => a.n - b.n);
  const n = ordem.length;
  const intro = n === 1 ? 'Esta aba aparece em 1 aula da trilha.' : `Esta aba aparece em ${n} aulas da trilha.`;
  const primeiros = ordem.slice(0, 5).map(itemVisto).join('');
  const resto = ordem.slice(5);
  const mais = resto.length
    ? `<details><summary class="pt-summary">Ver todas as ${n} aulas</summary><ul class="va-list">${resto.map(itemVisto).join('')}</ul></details>`
    : '';
  return `<aside class="card-bento visto-aulas" aria-labelledby="va-${id}"><h3 id="va-${id}" class="st">Visto nas aulas</h3><p class="va-intro">${intro}</p><ul class="va-list">${primeiros}</ul>${mais}</aside>`;
}

const ancorasPath = path.join(root, 'data/ancoras.json');
const ancoras = fs.existsSync(ancorasPath)
  ? JSON.parse(fs.readFileSync(ancorasPath, 'utf8'))
  : { v: 1, secoes: [] };
if (!Array.isArray(ancoras.secoes)) ancoras.secoes = [];
const porTitulo = new Map(ancoras.secoes.map((s) => [s.painel + '|' + s.titulo, s.id]));
const idsUsados = new Set(ancoras.secoes.map((s) => s.id));

function carimbarSecoes(id, html) {
  return html.replace(/<div class="st"([^>]*)>([\s\S]*?)<\/div>/g, (full, attrs, inner) => {
    const titulo = plain(inner);
    const chave = id + '|' + titulo;
    const existente = (attrs.match(/\sid="([^"]+)"/) || [])[1];
    if (existente) {
      if (!porTitulo.has(chave)) {
        ancoras.secoes.push({ painel: id, titulo, id: existente });
        porTitulo.set(chave, existente);
        idsUsados.add(existente);
      }
      return full;
    }
    let sid = porTitulo.get(chave);
    if (!sid) {
      const base = slugify(titulo) || 'secao';
      sid = base;
      let n = 2;
      while (idsUsados.has(sid) || html.includes('id="' + sid + '"')) {
        sid = base + '-' + n;
        n += 1;
      }
      ancoras.secoes.push({ painel: id, titulo, id: sid });
      porTitulo.set(chave, sid);
      idsUsados.add(sid);
    }
    return `<div class="st" id="${sid}"${attrs}>${inner}</div>`;
  });
}

const paineis = {};
for (const id of order) {
  let html = carimbarSecoes(id, read('src/abas/' + id + '.html').trim());
  const aside = htmlVisto(id, porAba[id] || []);
  if (aside) {
    const fim = html.lastIndexOf('</div>');
    html = html.slice(0, fim) + '\n' + aside + '\n' + html.slice(fim);
  }
  paineis[id] = html;
}
let panels = order.map((id) => paineis[id]).join('\n\n');
const grid = renderGlossario(glossario);
if (!panels.includes('<!--GLOSSARIO-->')) throw new Error('Marcador do glossário sumiu.');
panels = panels.replace('<!--GLOSSARIO-->', grid);
fs.mkdirSync(path.dirname(ancorasPath), { recursive: true });
fs.writeFileSync(ancorasPath, JSON.stringify(ancoras, null, 2) + '\n');

const indice = [];
const idsIndice = new Set();
function publicar(item) {
  for (const [campo, limite] of [['ti', 80], ['tx', 160]]) {
    if ((item[campo] || '').length > limite) {
      throw new Error('Índice: ' + campo + ' passa de ' + limite + ' em ' + item.id + ' (' + (item[campo] || '').length + ')');
    }
  }
  if (item.k) {
    if (item.k.length > 8) throw new Error('Índice: k passa de 8 em ' + item.id);
    for (const palavra of item.k) {
      if (palavra.length > 24) throw new Error('Índice: palavra longa em ' + item.id);
    }
  }
  if (idsIndice.has(item.id)) throw new Error('Índice duplicado: ' + item.id);
  idsIndice.add(item.id);
  indice.push(item);
}

for (const id of order) {
  const html = paineis[id].includes('<!--GLOSSARIO-->') ? paineis[id].replace('<!--GLOSSARIO-->', grid) : paineis[id];
  const trecho = plain((html.match(/<p[^>]*>([\s\S]*?)<\/p>/) || [])[1] || html);
  const vistas = (porAba[id] || []).map((a) => a.n);
  publicar({
    id: 'aba-' + id,
    t: 'aba',
    ti: corte(nomes[id] || id, 80),
    tx: corte(primeiraFrase(trecho), 160),
    a: '#aba-' + id,
    ab: id,
    v: vistas,
  });
  const fonte = html;
  for (const secao of fonte.matchAll(/<div class="st"([^>]*)>([\s\S]*?)<\/div>/g)) {
    const sid = (secao[1].match(/\sid="([^"]+)"/) || [])[1];
    if (!sid) continue;
    publicar({
      id: 'aba-' + id + '/' + sid,
      t: 'secao',
      ti: corte(plain(secao[2]), 80),
      tx: corte(plain(secao[2]), 160),
      a: '#aba-' + id + '/' + sid,
      ab: id,
      v: vistas,
    });
  }
}
for (const ficha of glossario.fichas) {
  publicar({
    id: 'aba-glossario/' + ficha._id,
    t: 'termo',
    ti: corte(plain(ficha.termo), 80),
    tx: corte(primeiraFrase(plain(ficha.definicao)), 160),
    a: '#aba-glossario/' + ficha._id,
    ab: 'glossario',
    v: [],
    k: [corte(slugify(plain(ficha.termo)), 24)].filter(Boolean),
  });
}
for (const aula of curriculoObj.aulas) {
  const num = String(aula.n).padStart(2, '0');
  const titulo = 'Aula ' + num + ' · ' + aula.titulo;
  publicar({
    id: 'aula-' + num,
    t: 'aula',
    ti: corte(titulo, 80),
    tx: corte(aula.resumo || aula.titulo, 160),
    a: '#aula-' + num,
    n: aula.n,
    st: aula.status,
    k: aula.titulo.split(/\s+/).map((w) => plain(w).toLowerCase()).filter((w) => w.length >= 4 && w.length <= 24).slice(0, 8),
  });
}

const indiceJson = escaparScript(JSON.stringify(indice));
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
fs.writeFileSync(path.join(root, 'build/search-index.json'), JSON.stringify(indice, null, 2) + '\n');
const trilhaCss = read('src/styles/trilha.css');

const headParts = read('src/scripts/theme-head.js').trim().split(/\r?\n/);
if (headParts.length !== 2) throw new Error('theme-head.js deveria ter 2 scripts, veio ' + headParts.length);

const dist = `<!-- GERADO PELO BUILD. NÃO EDITE. Fonte: src/ -->
<!DOCTYPE html>
<html lang="pt-BR" data-theme="dark" data-ds-theme="ringgo-dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>
${headParts[0]}
</script>
<meta id="meta-color-scheme" name="color-scheme" content="dark">
<meta id="meta-theme-color" name="theme-color" content="#0B0F14">
<script>
${headParts[1]}
</script>
<title>Bíblia de estudo — Ecossistema de cartões &amp; crédito</title>
<style id="font-roboto">
${fonts.trim()}
</style>
<style id="tailwind-utilities">
${tailwind.trim()}
</style>
<style>
${base.trim()}
</style>
<style id="ds-demo-base">
${dsBase.trim()}
</style>
<style id="ds-ringgo-bridge">
${dsBridge.trim()}
</style>
<style id="theme-m3-light-roboto">
${m3.trim()}
</style>
<style id="trilha">
${trilhaCss.trim()}
</style>
<style id="componentes">
${read('src/styles/componentes.css').trim()}
</style>
</head>
<body>
<div class="page">
${shellNav.trim()}
${panels}
${footer.trim()}
</div>
<script>
${read('src/scripts/nav.js').trim()}
</script>
<script>
${read('src/scripts/search.js').trim()}
</script>
<script>
${read('src/scripts/theme.js').trim()}
</script>
<script type="application/json" id="data-glossario">${escaparScript(glossarioJson)}</script>
<script type="application/json" id="data-curriculo">${escaparScript(curriculoPublicado)}</script>
<script type="application/json" id="search-index">${indiceJson}</script>
<script>
${read('src/scripts/componentes.js').trim()}
</script>
<script>
${read('src/scripts/trilha.js').trim()}
</script>
</body>
</html>
`;

if (/cdn\.tailwindcss\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(dist)) {
  throw new Error('O dist ainda aponta para CDN.');
}
for (const id of order) {
  if (!dist.includes('id="panel-' + id + '"')) throw new Error('Painel ausente: ' + id);
}
if (!dist.includes('function showPanel(id,el,section,fromHash)')) {
  throw new Error('Hash não entrou no showPanel.');
}

const contraste = spawnSync(process.execPath, ['scripts/check-contrast.mjs'], { cwd: root, encoding: 'utf8' });
if (contraste.status !== 0) {
  throw new Error((contraste.stdout || '') + (contraste.stderr || ''));
}
console.log(contraste.stdout.trim());

const aula8 = curriculoObj.aulas.find((aula) => aula.n === 8);
const casosFormula = [
  {
    id: 'f1-t',
    titulo: 'Como a taxa do mês vira taxa do ano?',
    tex: 'i_{\\text{ano}} = (1 + i_{\\text{mês}})^{12} - 1',
    linear: 'i_ano = (1 + i_mês)^12 − 1',
    leitura: 'Eleve o fator mensal a 12 e tire 1.',
  },
  Object.assign({ id: 'f2-t' }, aula8.formula),
  {
    id: 'f3-t',
    titulo: 'Como trazer um valor futuro para hoje?',
    tex: 'VP = VF \\div (1 + i)^{n}',
    linear: 'VP = VF ÷ (1 + i)^n',
    leitura: 'Divida o valor futuro pelo fator de juros.',
  },
];
const paginaFormulas = `<!DOCTYPE html>
<html lang="pt-BR" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fórmulas da Aula 08</title>
<style>
:root{--surface:#141414;--surface2:#1c1c1c;--border:rgba(255,255,255,.14);--text:#fafafa;--muted:#a1a1aa;--accent:#f97316;--radius:8px;--radius-sm:6px;--shadow-card:none}
html[data-theme="light"]{--surface:#F3EDF7;--surface2:#ECE6F0;--border:#CAC4D0;--text:#1D1B20;--muted:#49454F;--accent:#6750A4}
body{margin:0;padding:24px;background:var(--surface);color:var(--text);font-family:Roboto,system-ui,sans-serif}
button{min-height:44px;font:inherit}
${read('src/styles/componentes.css')}
</style>
</head>
<body>
<p>Casos F1, F2 e F3 da Aula 08. A fórmula não usa script.</p>
<p><button type="button" id="tema">Alternar tema</button></p>
${casosFormula.map((caso) => figuraFormula(caso, caso.id)).join('\n')}
<script>
document.getElementById('tema').addEventListener('click',function(){
  var html=document.documentElement;
  html.setAttribute('data-theme', html.getAttribute('data-theme')==='dark'?'light':'dark');
});
</script>
</body>
</html>
`;
fs.mkdirSync(path.join(root, 'tests'), { recursive: true });
fs.writeFileSync(path.join(root, 'tests/formulas-aula08.html'), paginaFormulas);

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/index.html'), dist);
const distBytes = Buffer.byteLength(dist);
const indiceBytes = Buffer.byteLength(indiceJson);
const indiceGzip = zlib.gzipSync(indiceJson).length;
const semAula = order.filter((id) => id !== 'trilha-guiada' && !(porAba[id] || []).length);
const alerta = distBytes > 1500000
  ? [
      '[alerta] dist/index.html passa de 1,5 MB (1.500.000 bytes)',
      'Maiores trechos:',
      ...[
        ['fontes', Buffer.byteLength(fonts)],
        ['css compilado', Buffer.byteLength(tailwind)],
        ['css da página', Buffer.byteLength(base) + Buffer.byteLength(m3) + Buffer.byteLength(trilhaCss)],
        ['design system', Buffer.byteLength(dsBase) + Buffer.byteLength(dsBridge)],
        ['painéis', Buffer.byteLength(panels)],
        ['índice', indiceBytes],
        ['currículo', Buffer.byteLength(curriculo)],
      ].sort((a, b) => b[1] - a[1]).map((p) => '- ' + p[0] + ': ' + p[1] + ' bytes'),
    ].join('\n')
  : '';
const relatorio = [
  '# Relatório do build',
  '',
  '[índice] ' + indice.length + ' itens · ' + indiceBytes + ' bytes (' + indiceGzip + ' bytes gzip)',
  '[dist]   dist/index.html: ' + distBytes + ' bytes   (v8.7: 325.225 bytes)',
  '[dist]   índice = ' + (distBytes ? ((100 * indiceBytes) / distBytes).toFixed(1) : '0') + '% do dist',
  alerta,
  '',
  'Abas sem aula ligada: ' + (semAula.join(', ') || 'nenhuma'),
  '',
].filter((linha) => linha !== '').join('\n') + '\n';
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/build-report.md'), relatorio);
console.log('[índice] ' + indice.length + ' itens · ' + indiceBytes + ' bytes (' + indiceGzip + ' bytes gzip)');
console.log('[dist]   dist/index.html: ' + distBytes + ' bytes   (v8.7: 325.225 bytes)');
console.log('[dist]   índice = ' + (distBytes ? ((100 * indiceBytes) / distBytes).toFixed(1) : '0') + '% do dist');
if (alerta) console.log(alerta);
console.log('paineis=' + order.length);
console.log('fichas=' + glossario.total);
console.log('tailwind_bytes=' + Buffer.byteLength(tailwind));
