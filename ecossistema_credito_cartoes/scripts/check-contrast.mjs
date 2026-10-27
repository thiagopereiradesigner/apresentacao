const pares = {
  claro: {
    superficie: '#F3EDF7',
    texto: '#1D1B20',
    muted: '#49454F',
    green: '#146C2E',
    red: '#B3261E',
  },
  escuro: {
    superficie: '#141414',
    texto: '#fafafa',
    muted: '#a1a1aa',
    green: '#4ade80',
    red: '#f87171',
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

let falhou = false;
for (const tema of Object.keys(pares)) {
  const p = pares[tema];
  for (const nome of ['texto', 'muted', 'green', 'red']) {
    const razao = contraste(p[nome], p.superficie);
    const ok = razao >= 4.5;
    console.log(tema + ' ' + nome + ' sobre superfície: ' + razao.toFixed(2) + ':1 ' + (ok ? 'ok' : 'abaixo de 4.5'));
    if (!ok) falhou = true;
  }
}

if (falhou) {
  console.error('Contraste AA falhou. Não mude o token global; o componente precisa usar --text no texto essencial.');
  process.exit(1);
}
