import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function must(idx, label) {
  if (idx < 0) throw new Error('Marcador não encontrado: ' + label);
  return idx;
}

const pageOpen = must(html.indexOf('<div class="page">'), 'page');
const regionStart = must(html.indexOf('<div id="panel-'), 'primeiro painel');
const footStart = must(html.indexOf('<div class="foot">'), 'rodapé');
const footEnd = must(html.indexOf('</div>', footStart), 'fim do rodapé') + '</div>'.length;
const scriptOpen = must(html.lastIndexOf('<script>'), 'script final');
const scriptClose = must(html.indexOf('</script>', scriptOpen), 'fim do script');
const bodyScript = html.slice(scriptOpen + '<script>'.length, scriptClose);

const shell = html.slice(pageOpen + '<div class="page">'.length, regionStart);
const region = html.slice(regionStart, footStart);
const foot = html.slice(footStart, footEnd);

const parts = [];
let rest = region;
while (rest.length) {
  const rel = rest.slice(1).search(/<div id="panel-/);
  if (rel === -1) {
    parts.push(rest);
    break;
  }
  const cut = rel + 1;
  parts.push(rest.slice(0, cut));
  rest = rest.slice(cut);
}
if (parts.map((p) => p).join('') !== region) {
  throw new Error('A soma dos painéis não reconstrói o HTML original.');
}

const order = parts.map((part) => {
  const m = part.match(/^<div id="panel-([^"]+)"/);
  if (!m) throw new Error('Painel sem id: ' + part.slice(0, 80));
  return m[1];
});

const style1Open = must(html.indexOf('<style>'), 'style 1');
const style1Close = must(html.indexOf('</style>', style1Open), 'fim style 1');
let baseCss = html.slice(style1Open + '<style>'.length, style1Close);
baseCss = baseCss.replace(/\s*@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Roboto:wght@400;500;700&display=swap'\);\r?\n/, '\n');

const style2Open = must(html.indexOf('<style id="theme-m3-light-roboto">'), 'style m3');
const style2Close = must(html.indexOf('</style>', style2Open), 'fim style m3');
const m3Css = html.slice(style2Open + '<style id="theme-m3-light-roboto">'.length, style2Close);

const head1 = html.match(/<script>\s*(\(function\(\)\{try\{var k='mapa-sistema-financeiro-theme'[\s\S]*?\}\)\(\);\s*)<\/script>/);
const head2 = html.match(/<script>\s*(\(function\(\)\{try\{var h=document\.documentElement,th=h\.getAttribute\('data-theme'\)[\s\S]*?\}\)\(\);\s*)<\/script>/);
if (!head1 || !head2) throw new Error('Scripts de tema do head não encontrados.');

const normAt = bodyScript.indexOf('function norm(s)');
if (normAt < 0) throw new Error('Busca não encontrada.');
const searchFn = bodyScript.lastIndexOf('(function()', normAt);
const themeKey = bodyScript.indexOf("var KEY='mapa-sistema-financeiro-theme'");
if (themeKey < 0) throw new Error('Tema não encontrado.');
const themeFn = bodyScript.lastIndexOf('(function()', themeKey);

let nav = bodyScript.slice(0, searchFn).replace(/\s+$/, '\n');
let search = bodyScript.slice(searchFn, themeFn).replace(/\s+$/, '\n');
const theme = bodyScript.slice(themeFn).replace(/^\s+/, '').replace(/\s+$/, '\n');

const showPanelNext = `  function parseStudyHash(){
    var raw='';
    try{ raw=decodeURIComponent((location.hash||'').replace(/^#/,'')); }
    catch(e){ raw=(location.hash||'').replace(/^#/,''); }
    if(!raw) return {id:'',section:''};
    var slash=raw.indexOf('/');
    if(slash<0) return {id:raw,section:''};
    return {id:raw.slice(0,slash),section:raw.slice(slash+1)};
  }
  function scrollToStudySection(section){
    if(!section) return;
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var el=document.getElementById(section);
        if(!el) return;
        el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
      });
    });
  }
  function showPanel(id,el,section,fromHash){
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    const p=document.getElementById('panel-'+id);
    if(!p)return;
    p.classList.add('active');
    void p.offsetWidth;
    if(el) el.classList.add('active');
    else{
      var t=document.querySelector('.tab[data-panel="'+id+'"]');
      if(t) t.classList.add('active');
    }
    var sec=typeof section==='string'?section:'';
    if(!fromHash){
      var next='#'+id+(sec?'/'+sec:'');
      if(location.hash!==next) location.hash=next;
    }
    if(sec) scrollToStudySection(sec);
  }
  function applyStudyHash(){
    var h=parseStudyHash();
    if(!h.id){
      var cur=document.querySelector('.panel.active');
      if(!cur||cur.id!=='panel-trilha-guiada'){
        var home=document.querySelector('.tab[data-panel="trilha-guiada"]');
        showPanel('trilha-guiada',home,'',true);
      }
      return;
    }
    var panel=document.getElementById('panel-'+h.id);
    if(!panel) return;
    var tab=document.querySelector('.tab[data-panel="'+h.id+'"]');
    var active=document.querySelector('.panel.active');
    if(!active||active.id!=='panel-'+h.id){
      showPanel(h.id,tab,h.section,true);
    } else if(h.section){
      scrollToStudySection(h.section);
    }
  }`;

const replaced = nav.replace(/function showPanel\(id,el\)\{[\s\S]*?\n  \}/, showPanelNext.trim());
if (replaced === nav) throw new Error('Não consegui substituir showPanel.');
nav = replaced + `
  window.addEventListener('hashchange', applyStudyHash);
  if(location.hash) applyStudyHash();
`;

const searchNeedle = 'showPanel(e.panel,tab||null);';
if (!search.includes(searchNeedle)) throw new Error('Chamada da busca não encontrada.');
search = search.replace(searchNeedle, "showPanel(e.panel,tab||null,e.anchor||'');");

const glossPart = parts.find((p) => p.startsWith('<div id="panel-glossario"'));
const gridOpen = glossPart.indexOf('<div class="glossario-grid">');
const gridInnerStart = gridOpen + '<div class="glossario-grid">'.length;
const gridClose = glossPart.lastIndexOf('</div>');
const gridInner = glossPart.slice(gridInnerStart, glossPart.lastIndexOf('</div>', gridClose - 1));
const cardRe = /<div class="tc"><div class="tag ([^"]+)">([\s\S]*?)<\/div><div class="tn">([\s\S]*?)<\/div><div class="td">([\s\S]*?)<\/div><div class="tv">([\s\S]*?)<\/div><\/div>/g;
const fichas = [];
let card;
while ((card = cardRe.exec(gridInner))) {
  fichas.push({
    tagClass: card[1],
    tag: card[2],
    termo: card[3],
    definicao: card[4],
    rodape: card[5],
  });
}
const rendered = fichas.map((c) => `<div class="tc"><div class="tag ${c.tagClass}">${c.tag}</div><div class="tn">${c.termo}</div><div class="td">${c.definicao}</div><div class="tv">${c.rodape}</div></div>`).join('');
const compactOriginal = gridInner.replace(/\s+/g, '');
const compactRendered = rendered.replace(/\s+/g, '');
if (compactOriginal !== compactRendered) {
  throw new Error('O glossário gerado não bate com o HTML. fichas=' + fichas.length);
}
if (fichas.length !== 135) {
  throw new Error('Esperava 135 fichas e li ' + fichas.length);
}

const glossario = {
  nota: 'Fonte única das fichas. tag, termo, definicao e rodape guardam o HTML interno original.',
  total: fichas.length,
  fichas,
};

function aula(id, titulo, modulo, dia, categoria, abas, fonte) {
  return {
    id: String(id).padStart(2, '0'),
    titulo,
    modulo,
    dia,
    categoria,
    abas_relacionadas: abas,
    status: 'a seguir',
    fonte_titulo: fonte,
  };
}

const curriculo = {
  versao_pagina: '8.7',
  notas: [
    'Nenhuma aula tem conteúdo ainda. status "a seguir" até o material ser colado.',
    'Títulos 01–14 vêm do anexo UX de prompts_cursor.md.',
    'Títulos 15–22 vêm do mapa do Prompt 2: 4.966, vintage/roll rate, funding, Basileia, SPB/Pix, cartões, registradoras, rotativo.',
    'Módulos 7–16 estão reservados, sem aula e sem título de conteúdo inventado.',
  ],
  modulos: [
    {
      id: 'm01',
      titulo: 'SFN, instituições e mercados',
      aulas: [
        aula(1, 'SFN em três camadas: CMN, supervisores, operadores', 'm01', 1, 'Fundamentos', ['sfn-brasil', 'sfn-licencas'], 'anexo-ux'),
        aula(2, 'Tipos de instituição, modalidades de IP, PSTI, SCD/FIDC', 'm01', 2, 'Fundamentos', ['sfn-licencas', 'mercado'], 'anexo-ux'),
        aula(3, 'Mercados financeiros e infraestrutura (primário x secundário, bolsa x balcão)', 'm01', 3, 'Fundamentos', ['sfn-brasil', 'infra-bancaria', 'mercado'], 'anexo-ux'),
      ],
    },
    {
      id: 'm02',
      titulo: 'Inflação, juros, curva e câmbio',
      aulas: [
        aula(4, 'Inflação: IPCA, IGP-M, metas, expectativas', 'm02', 4, 'Fundamentos', ['inflacao-juros'], 'anexo-ux'),
        aula(5, 'Selic, Copom, transmissão, pré x pós, CDI + spread', 'm02', 5, 'Fundamentos', ['inflacao-juros', 'sistema-monetario', 'cdi'], 'anexo-ux'),
        aula(6, 'Selic Over, Taxa DI, curva de juros, Focus x ANBIMA', 'm02', 6, 'Fundamentos', ['cdi', 'inflacao-juros'], 'anexo-ux'),
        aula(7, 'Política fiscal, dívida, câmbio', 'm02', 7, 'Fundamentos', ['sistema-global', 'sistema-monetario'], 'anexo-ux'),
      ],
    },
    {
      id: 'm03',
      titulo: 'Matemática do crédito',
      aulas: [
        aula(8, 'Juros simples x compostos, nominal x efetiva, base 252', 'm03', 8, 'Crédito', ['inflacao-juros', 'encargos'], 'anexo-ux'),
        aula(9, 'Price, SAC e Bullet', 'm03', 9, 'Crédito', ['encargos', 'consignado'], 'anexo-ux'),
        aula(10, 'CET (Custo Efetivo Total)', 'm03', 10, 'Crédito', ['encargos', 'consignado'], 'anexo-ux'),
        aula(11, 'VPL, TIR e custo de capital', 'm03', 11, 'Mercado', ['eva', 'economia-credito'], 'anexo-ux'),
      ],
    },
    {
      id: 'm04',
      titulo: 'Crédito e risco',
      aulas: [
        aula(12, 'Tipos de risco e estrutura de gerenciamento (Res. 4.557)', 'm04', 12, 'Risco', ['economia-credito', 'chargeback', 'rj'], 'anexo-ux'),
        aula(13, 'Análise de crédito PF e PJ: 5 Cs, garantias, SCR, Open Finance', 'm04', 13, 'Risco', ['consignado', 'folha', 'economia-credito'], 'anexo-ux'),
        aula(14, 'PD, LGD, EAD, perda esperada e scoring', 'm04', 14, 'Risco', ['economia-credito'], 'anexo-ux'),
        aula(15, 'Resolução 4.966 e PDD', 'm04', 15, 'Risco', ['economia-credito', 'eva'], 'mapa-prompt-2'),
        aula(16, 'Vintage e roll rate', 'm04', 16, 'Risco', ['economia-credito'], 'mapa-prompt-2'),
      ],
    },
    {
      id: 'm05',
      titulo: 'Funding',
      aulas: [
        aula(17, 'Funding', 'm05', 17, 'Mercado', ['mercado', 'cdi'], 'mapa-prompt-2'),
        aula(18, 'Basileia, ALM e liquidez', 'm05', 18, 'Risco', ['sfn-licencas'], 'mapa-prompt-2'),
      ],
    },
    {
      id: 'm06',
      titulo: 'Pagamentos',
      aulas: [
        aula(19, 'SPB, Lei 12.865 e Pix', 'm06', 19, 'Pagamentos', ['infra-bancaria'], 'mapa-prompt-2'),
        aula(20, 'Cartões e MDR', 'm06', 20, 'Pagamentos', ['eco', 'taxas', 'tiers', 'split'], 'mapa-prompt-2'),
        aula(21, 'Recebíveis e registradoras', 'm06', 21, 'Pagamentos', ['economia-credito'], 'mapa-prompt-2'),
        aula(22, 'Rotativo', 'm06', 22, 'Crédito', ['encargos', 'economia-credito'], 'mapa-prompt-2'),
      ],
    },
    ...Array.from({ length: 10 }, (_, i) => ({
      id: 'm' + String(i + 7).padStart(2, '0'),
      titulo: '',
      reservado: true,
      aulas: [],
    })),
  ],
};

const glossarioPanel = glossPart.slice(0, gridInnerStart) + '\n<!--GLOSSARIO-->\n  ' + glossPart.slice(glossPart.lastIndexOf('</div>', gridClose - 1));

function write(rel, content) {
  const dest = path.join(root, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
}

write('src/shell.html', shell.replace(/^\r?\n/, '\n'));
write('src/footer.html', foot);
write('src/styles/base.css', baseCss.replace(/^\r?\n/, '\n'));
write('src/styles/theme-m3.css', m3Css.replace(/^\r?\n/, '\n'));
write('src/scripts/theme-head.js', head1[1].trim() + '\n' + head2[1].trim() + '\n');
write('src/scripts/nav.js', nav.trim() + '\n');
write('src/scripts/search.js', search.trim() + '\n');
write('src/scripts/theme.js', theme.trim() + '\n');
write('src/abas/order.json', JSON.stringify(order, null, 2) + '\n');
write('data/glossario.json', JSON.stringify(glossario, null, 2) + '\n');
write('data/curriculo.json', JSON.stringify(curriculo, null, 2) + '\n');

for (const part of parts) {
  const id = part.match(/^<div id="panel-([^"]+)"/)[1];
  const body = id === 'glossario' ? glossarioPanel : part;
  write('src/abas/' + id + '.html', body.trim() + '\n');
}

for (const modulo of curriculo.modulos) {
  for (const item of modulo.aulas) {
    write(
      'src/aulas/' + modulo.id + '/aula' + item.id + '.html',
      '<!-- Aula ' + item.id + '. Vazia de propósito: o conteúdo entra quando o material da aula for anexado. -->\n',
    );
  }
}

console.log('paineis=' + order.length);
console.log('fichas=' + fichas.length);
console.log('aulas=' + curriculo.modulos.reduce((n, m) => n + m.aulas.length, 0));
console.log(order.join(','));
