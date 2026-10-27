const pares = {
  claro: {
    superficie: '#F3EDF7',
    texto: '#1D1B20',
    muted: '#49454F',
    green: '#146C2E',
    red: '#B3261E',
    accent: '#6750A4',
    accentRgb: [103, 80, 164],
    alpha: 0.12,
  },
  escuro: {
    superficie: '#141414',
    texto: '#fafafa',
    muted: '#a1a1aa',
    green: '#4ade80',
    red: '#f87171',
    accent: '#f97316',
    accentRgb: [249, 115, 22],
    alpha: 0.12,
  },
};

function canal(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function luminancia(hex) {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function contraste(a, b) {
  const A = luminancia(a);
  const B = luminancia(b);
  const alto = Math.max(A, B);
  const baixo = Math.min(A, B);
  return (alto + 0.05) / (baixo + 0.05);
}

function rgb(hex) {
  const n = hex.replace('#', '');
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}

function compor(fg, bgHex, alpha) {
  const bg = rgb(bgHex);
  const n = fg.map((canalFg, i) => Math.round(canalFg * alpha + bg[i] * (1 - alpha)));
  return '#' + n.map((v) => v.toString(16).padStart(2, '0')).join('');
}

let falhou = false;
for (const tema of Object.keys(pares)) {
  const p = pares[tema];
  for (const nome of ['texto', 'muted', 'green', 'red']) {
    const razao = contraste(p[nome], p.superficie);
    const ok = razao >= 4.5;
    console.log(tema + ' ' + nome + ' sobre superfície: ' + razao.toFixed(2) + ':1 ' + (ok ? 'ok' : 'abaixo de 4.5'));
    if (!ok) falhou = true;
  }
  const fundoBadge = compor(p.accentRgb, p.superficie, p.alpha);
  const textoBadge = contraste(p.texto, fundoBadge);
  const okBadge = textoBadge >= 4.5;
  console.log(tema + ' texto sobre accent-soft: ' + textoBadge.toFixed(2) + ':1 ' + (okBadge ? 'ok' : 'abaixo de 4.5'));
  if (!okBadge) falhou = true;
  for (const nome of ['accent', 'muted']) {
    const razao = contraste(p[nome], p.superficie);
    const ok = razao >= 3;
    console.log(tema + ' ' + nome + ' como ícone ou borda: ' + razao.toFixed(2) + ':1 ' + (ok ? 'ok' : 'abaixo de 3'));
    if (!ok) falhou = true;
  }
}

if (falhou) {
  console.error('Contraste AA falhou. Não mude o token global; o componente precisa usar --text no texto essencial.');
  process.exit(1);
}
