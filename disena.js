'use strict';
/* ====== Opciones y precios (de la tarifa de SIMO) ====== */
const TAMANOS = [
  { id: '30x20', nombre: '30 × 20 cm', precio: 45, w: 30, h: 20, nota: 'El clásico' },
  { id: '35x17', nombre: '35 × 17 cm', precio: 45, w: 35, h: 17, nota: 'Alargado' },
  { id: '35x45', nombre: '35 × 45 cm', precio: 55, w: 35, h: 45, nota: 'Grande · incluye cremallera interna' },
  { id: 'ordenador', nombre: 'Ordenador o iPad', precio: 57.5, w: 34, h: 25, nota: 'Precio medio (50 a 65 €): te pediremos tus medidas' }
];
const TELAS = [
  { grupo: 'Algodón', extra: 0, items: [
    { id: 'algodon-blanca', nombre: 'Blanca', color: '#F1EEE7', tejido: true },
    { id: 'algodon-gris', nombre: 'Gris', color: '#7E8184', tejido: true },
    { id: 'algodon-negra', nombre: 'Negra', color: '#1E1E20', tejido: true } ] },
  { grupo: 'Polipiel · efecto cuero', extra: 5, items: [
    { id: 'negra', nombre: 'Negra', img: 'img/telas/negra.jpg', color: '#1B1B1D' },
    { id: 'roja', nombre: 'Roja', img: 'img/tela-roja.webp', color: '#C7253C' },
    { id: 'turquesa', nombre: 'Turquesa', img: 'img/telas/turquesa.jpg', color: '#2FB7AE' },
    { id: 'marron', nombre: 'Marrón', img: 'img/telas/marron.jpg', color: '#7A4024' },
    { id: 'polipiel-blanca', nombre: 'Blanca', color: '#EDEAE5', grano: true },
    { id: 'roja-oscura', nombre: 'Roja oscura', img: 'img/telas/roja-oscura.jpg', color: '#A3243A' },
    { id: 'beige', nombre: 'Beige', img: 'img/telas/beige.jpg', color: '#CFC6AE' },
    { id: 'plateada', nombre: 'Plateada', img: 'img/telas/plateada.jpg', color: '#B9BBBE' } ] },
  { grupo: 'Estampadas', items: [
    { id: 'serpiente-dorada', nombre: 'Serpiente dorada', img: 'img/telas/serpiente-dorada.jpg', color: '#9C8350', extra: 5 },
    { id: 'serpiente', nombre: 'Serpiente', img: 'img/telas/serpiente.jpg', color: '#6E6A62', extra: 5 },
    { id: 'vaca', nombre: 'Vaca', img: 'img/telas/vaca.jpg', color: '#EEE', extra: 0 } ] }
];
const CINTAS = [
  { grupo: 'Lentejuelas', extra: 3, items: [
    { id: 'lent-negra-dorada', nombre: 'Negra y dorada', tipo: 'lentejuelas', c: ['#1C1C1C', '#D4AF37'] },
    { id: 'lent-plateada', nombre: 'Plateada', tipo: 'lentejuelas', c: ['#DCDDE0'] },
    { id: 'lent-dorada', nombre: 'Dorada', tipo: 'lentejuelas', c: ['#D9B44A'] },
    { id: 'lent-plateada-oscuro', nombre: 'Plateada oscuro', tipo: 'lentejuelas', c: ['#7A7C80'] },
    { id: 'lent-bronce', nombre: 'Bronce', tipo: 'lentejuelas', c: ['#8C5A2B'] } ] },
  { grupo: 'Plata', extra: 4, items: [
    { id: 'plata-flores', nombre: 'Flores', tipo: 'flores', c: ['#CFD3DA'] },
    { id: 'plata-malla', nombre: 'Malla plata', tipo: 'malla', c: ['#C9CBCF'] },
    { id: 'plata-malla-tachuelas', nombre: 'Malla tachuelas', tipo: 'mallatach', c: ['#B8BABE'] } ] },
  { grupo: 'Cadena', extra: 5, items: [
    { id: 'cadena-dorada', nombre: 'Dorada', tipo: 'cadena', c: ['#D6B04C'] },
    { id: 'cadena-plateada', nombre: 'Plateada', tipo: 'cadena', c: ['#C8CACD'] } ] },
  { grupo: 'Limitadas', items: [
    { id: 'lim-verde-dorada', nombre: 'Verde y dorada', tipo: 'lentejuelas', c: ['#2E7D4F', '#D4AF37'], extra: 3 },
    { id: 'lim-fucsia', nombre: 'Fucsia', tipo: 'lentejuelas', c: ['#D81B78'], extra: 5 },
    { id: 'lim-negra', nombre: 'Negra', tipo: 'lentejuelas', c: ['#151515'], extra: 3 },
    { id: 'lim-dorada', nombre: 'Dorada', tipo: 'lentejuelas', c: ['#C99A2E'], extra: 4 },
    { id: 'lim-turquesa', nombre: 'Turquesa', tipo: 'lentejuelas', c: ['#28B5B0'], extra: 5 },
    { id: 'lim-rosa', nombre: 'Rosa', tipo: 'lentejuelas', c: ['#F29BB8'], extra: 3 },
    { id: 'lim-verde-rosa', nombre: 'Verde y rosa', tipo: 'lentejuelas', c: ['#2E7D4F', '#F29BB8'], extra: 4 },
    { id: 'lim-rosa-verde-dorada', nombre: 'Rosa, verde y dorada', tipo: 'lentejuelas', c: ['#F29BB8', '#2E7D4F', '#D4AF37'], extra: 5 } ] }
];
const POS_CINTA = [
  { id: 'arriba', nombre: 'Arriba' }, { id: 'medio', nombre: 'En medio' }, { id: 'abajo', nombre: 'Abajo' },
  { id: 'dos', nombre: 'Dos cintas (precio × 2)' }, { id: 'vertical', nombre: 'Vertical' }
];
const FLECOS = [
  { grupo: 'Flecos', extra: 5, items: [
    { id: 'turquesas', nombre: 'Turquesas', c: ['#2BB5AD'] }, { id: 'blancos', nombre: 'Blancos', c: ['#F3F1EC'] },
    { id: 'marrones', nombre: 'Marrones', c: ['#5A3220'] }, { id: 'negros', nombre: 'Negros', c: ['#141414'] },
    { id: 'rojos', nombre: 'Rojos', c: ['#9E1B32'] }, { id: 'grises', nombre: 'Grises', c: ['#9A9DA1'] } ] },
  { grupo: 'Con brillo', extra: 8, items: [
    { id: 'negro-plata', nombre: 'Negro y plata', c: ['#161616', '#C9CCD1'] },
    { id: 'beige-dorado', nombre: 'Beige y dorado', c: ['#CDBB94', '#E2C26B'] } ] }
];
const FORMA_FLECOS = [
  { id: 'lados', nombre: 'Finos, a los lados' }, { id: 'anudados', nombre: 'Anudados, a los lados' }, { id: 'abajo', nombre: 'Finos, por abajo' }
];
const TACHUELAS = [
  { id: 'redonda-plata', nombre: 'Redondas plateadas', forma: 'redonda', metal: 'plata' },
  { id: 'redonda-oro', nombre: 'Redondas doradas', forma: 'redonda', metal: 'oro' },
  { id: 'redonda-bronce', nombre: 'Redondas bronce', forma: 'redonda', metal: 'bronce' },
  { id: 'estrella-plata', nombre: 'Estrellas plateadas', forma: 'estrella', metal: 'plata' },
  { id: 'disco-plata', nombre: 'Discos plateados', forma: 'disco', metal: 'plata' }
];
const PRECIO_TACHUELAS = 7.5;
const POS_TACH = [{ id: 'arriba', nombre: 'Arriba (en la tapa)' }, { id: 'abajo', nombre: 'Abajo (en la base)' }, { id: 'ambas', nombre: 'Arriba y abajo' }];
const EXTRAS = [
  { id: 'enganches', nombre: 'Enganches', nota: 'Para colgar una correa o una cadena', precio: 5 },
  { id: 'cremallera', nombre: 'Cremallera interna', nota: 'Por dentro del bolso', precio: 10 }
];

const todas = grupos => grupos.flatMap(g => g.items.map(i => ({ ...i, extra: i.extra ?? g.extra ?? 0, grupo: g.grupo })));
const TELA = Object.fromEntries(todas(TELAS).map(t => [t.id, t]));
const CINTA = Object.fromEntries(todas(CINTAS).map(t => [t.id, t]));
const FLECO = Object.fromEntries(todas(FLECOS).map(t => [t.id, t]));
const TACH = Object.fromEntries(TACHUELAS.map(t => [t.id, t]));
const TAM = Object.fromEntries(TAMANOS.map(t => [t.id, t]));

/* ====== Estado ====== */
const S = { tamano: null, tela: null, cinta: 'ninguna', cintaPos: 'medio', flecos: 'ninguno', flecosForma: 'lados',
  tachuelas: [], tachPos: 'arriba', enganches: false, cremallera: false };
let paso = 0, maxPaso = 0;

const eur = n => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: n % 1 ? 2 : 0 }).format(n);
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function lineas() {
  const L = [];
  if (S.tamano) L.push([`Tamaño ${TAM[S.tamano].nombre}`, TAM[S.tamano].precio]);
  if (S.tela) { const t = TELA[S.tela]; L.push([`Tela ${t.nombre.toLowerCase()} (${t.grupo.split(' ')[0].toLowerCase()})`, t.extra]); }
  if (S.cinta !== 'ninguna') { const c = CINTA[S.cinta]; const x = S.cintaPos === 'dos' ? 2 : 1; L.push([`Cinta ${c.nombre.toLowerCase()}${x === 2 ? ' × 2' : ''}`, c.extra * x]); }
  if (S.flecos !== 'ninguno') { const f = FLECO[S.flecos]; L.push([`Flecos ${f.nombre.toLowerCase()}`, f.extra]); }
  if (S.tachuelas.length) L.push([`Tachuelas (${S.tachuelas.length} ${S.tachuelas.length === 1 ? 'tipo' : 'tipos'})`, PRECIO_TACHUELAS]);
  if (S.enganches) L.push(['Enganches', 5]);
  if (S.cremallera || S.tamano === '35x45') L.push(['Cremallera interna', S.tamano === '35x45' ? 0 : 10]);
  return L;
}
function pintarPrecio() {
  const L = lineas();
  $('lineas').innerHTML = L.length ? L.map(([n, p]) => `<li><span>${esc(n)}</span><span>${p ? (L[0][0] === n ? eur(p) : '+' + eur(p)) : 'incluido'}</span></li>`).join('')
    : '<li><span>Empieza eligiendo el tamaño</span><span></span></li>';
  $('total').textContent = eur(L.reduce((s, [, p]) => s + p, 0));
}

/* ====== Bolso en SVG ====== */
function rnd(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const METAL = { plata: ['#FFFFFF', '#C9CCD1', '#7D8187'], oro: ['#FFF3B0', '#D9B24A', '#8A6416'], bronce: ['#F1CC92', '#B07B3C', '#5E3A14'] };

function patronCinta(c, id) {
  const [a, b = a, d = b] = c.c;
  if (c.tipo === 'lentejuelas') {
    const col = [a, b, d];
    let s = `<pattern id="${id}" width="10" height="9" patternUnits="userSpaceOnUse"><rect width="10" height="9" fill="${a}"/>`;
    [[0, 0], [10, 0], [5, 4.5], [0, 9], [10, 9]].forEach(([x, y], i) => {
      const f = col[(i + (y ? 1 : 0)) % col.length];
      s += `<circle cx="${x}" cy="${y}" r="4.3" fill="${f}" stroke="rgba(0,0,0,.35)" stroke-width=".6"/><circle cx="${x - 1.2}" cy="${y - 1.4}" r="1.3" fill="rgba(255,255,255,.55)"/>`;
    });
    return s + '</pattern>';
  }
  if (c.tipo === 'malla' || c.tipo === 'mallatach') {
    const r = c.tipo === 'malla' ? 2.6 : 3.3, t = c.tipo === 'malla' ? 7 : 9;
    return `<pattern id="${id}" width="${t}" height="${t}" patternUnits="userSpaceOnUse"><rect width="${t}" height="${t}" fill="#3A3B3E"/><circle cx="${t / 2}" cy="${t / 2}" r="${r}" fill="url(#g-plata)"/></pattern>`;
  }
  if (c.tipo === 'flores') {
    return `<pattern id="${id}" width="34" height="26" patternUnits="userSpaceOnUse"><rect width="34" height="26" fill="#D9DCE2"/>
      <path d="M2 20 Q10 8 18 14 T32 8" fill="none" stroke="#6F737A" stroke-width=".8"/>
      ${[[9, 11], [25, 12]].map(([x, y]) => [0, 72, 144, 216, 288].map(g => `<circle cx="${x + 3 * Math.cos(g * Math.PI / 180)}" cy="${y + 3 * Math.sin(g * Math.PI / 180)}" r="2" fill="#F4F5F7" stroke="#8A8E95" stroke-width=".4"/>`).join('') + `<circle cx="${x}" cy="${y}" r="1.5" fill="#B9BCC2"/>`).join('')}
    </pattern>`;
  }
  // cadena
  return `<pattern id="${id}" width="12" height="7" patternUnits="userSpaceOnUse"><ellipse cx="6" cy="3.5" rx="5" ry="2.6" fill="none" stroke="${a}" stroke-width="1.6"/><ellipse cx="0" cy="3.5" rx="2" ry="1.2" fill="none" stroke="${a}" stroke-width="1.4"/><ellipse cx="12" cy="3.5" rx="2" ry="1.2" fill="none" stroke="${a}" stroke-width="1.4"/></pattern>`;
}

function rellenoTela(t, id, x, y, w, h) {
  if (t.img) return `<pattern id="${id}" patternUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${t.color}"/><image href="${t.img}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></pattern>`;
  if (t.tejido) return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="4" height="4"><rect width="4" height="4" fill="${t.color}"/><path d="M0 1h4M0 3h4" stroke="rgba(0,0,0,.07)" stroke-width=".8"/><path d="M1 0v4M3 0v4" stroke="rgba(255,255,255,.06)" stroke-width=".8"/></pattern>`;
  return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="10" height="10"><rect width="10" height="10" fill="${t.color}"/></pattern>`;
}

function estrella(cx, cy, r) {
  let p = '';
  for (let i = 0; i < 10; i++) { const a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * .45 : r; p += `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)} `; }
  return p;
}

function bolsoSVG() {
  const tam = TAM[S.tamano] || TAM['30x20'];
  const tela = TELA[S.tela] || { color: '#D8D3CB', vacia: true };
  const VW = 440, VH = 400, maxW = 260, maxH = 220;
  const k = Math.min(maxW / tam.w, maxH / tam.h);
  const W = Math.round(tam.w * k), H = Math.round(tam.h * k);
  const x = Math.round((VW - W) / 2), y = Math.round(58 + (maxH - H) / 2);
  const flapH = Math.round(H * (tam.h > tam.w ? .46 : .62));
  const fb = y + flapH, bot = y + H;
  const R = rnd(7);
  let defs = `<linearGradient id="luz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
    <linearGradient id="sombraTapa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <radialGradient id="suelo"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <filter id="grano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .16"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in"/></filter>
    <clipPath id="clipBolso"><rect x="${x}" y="${y}" width="${W}" height="${H}" rx="7"/></clipPath>
    <clipPath id="clipTapa"><path d="M${x} ${y + 7}q0-7 7-7h${W - 14}q7 0 7 7v${flapH - 9}q0 2-2 2h-${W - 4}q-2 0-2-2z"/></clipPath>`;
  Object.entries(METAL).forEach(([n, [a, b, c]]) => { defs += `<radialGradient id="g-${n}" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="${a}"/><stop offset=".45" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`; });
  defs += rellenoTela(tela, 'fBase', x, y, W, H) + rellenoTela(tela, 'fTapa', x - 9, y - 6, W + 18, H + 12);

  let atras = '', delante = '';
  // Flecos
  if (S.flecos !== 'ninguno') {
    const f = FLECO[S.flecos], cols = f.c;
    const linea = (x1, y1, x2, y2, cx, i, w = 1.1) => `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}Q${cx.toFixed(1)} ${((y1 + y2) / 2).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${cols[i % cols.length]}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity=".95"/>`;
    if (S.flecosForma === 'abajo') {
      const n = Math.round(W / 3.2);
      for (let i = 0; i < n; i++) {
        const sx = x + 6 + (W - 12) * i / (n - 1), len = H - flapH + 34 + R() * 26, dx = (R() - .5) * 14;
        delante += linea(sx, fb - 2, sx + dx, fb + len, sx + dx * .3, i, 1.2);
      }
      delante += `<rect x="${x + 4}" y="${fb - 5}" width="${W - 8}" height="6" rx="1.5" fill="${cols[0]}" opacity=".9"/>`;
    } else {
      const top = y + 10, alto = H - 18;
      [-1, 1].forEach(lado => {
        const bx = lado < 0 ? x + 3 : x + W - 3;
        if (S.flecosForma === 'anudados') {
          const nb = Math.max(4, Math.round(alto / 22));
          for (let b = 0; b < nb; b++) {
            const ky = top + alto * (b + .5) / nb, kx = bx + lado * 10;
            for (let i = 0; i < 9; i++) atras += linea(kx, ky, kx + lado * (6 + R() * 18), ky + 70 + R() * 40, kx + lado * 4, i + b, 1.1);
            atras += `<path d="M${bx} ${ky - 4}L${kx} ${ky}L${bx} ${ky + 4}" stroke="${cols[0]}" stroke-width="2.4" fill="none"/><circle cx="${kx}" cy="${ky}" r="3.2" fill="${cols[0]}"/>`;
          }
        } else {
          const n = Math.round(alto / 2.3);
          for (let i = 0; i < n; i++) {
            const sy = top + alto * i / (n - 1), len = 60 + R() * 55 + (sy - top) * .25;
            atras += linea(bx, sy, bx + lado * (8 + R() * 26), sy + len, bx + lado * 3, i, 1);
          }
        }
      });
    }
  }
  // Enganches
  if (S.enganches) {
    [x - 2, x + W + 2].forEach(cx => {
      atras += `<path d="M${cx} ${y + 6}v14" stroke="#3a3a3a" stroke-width="5" stroke-linecap="round"/>`;
      delante += `<circle cx="${cx}" cy="${y + 4}" r="7.5" fill="none" stroke="url(#g-plata)" stroke-width="3"/>`;
    });
    delante += `<path d="M${x - 2} ${y - 3}C${x + W * .2} ${y - 70} ${x + W * .8} ${y - 70} ${x + W + 2} ${y - 3}" fill="none" stroke="#9EA2A8" stroke-width="2.4" stroke-dasharray="5 2.5" opacity=".55"/>`;
  }

  // Cuerpo y tapa
  let cuerpo = `<ellipse cx="${x + W / 2}" cy="${bot + 8}" rx="${W * .56}" ry="10" fill="url(#suelo)"/>`;
  cuerpo += `<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="7" fill="url(#fBase)"/>`;
  if (tela.grano || tela.img) cuerpo += `<rect x="${x}" y="${y}" width="${W}" height="${H}" fill="#fff" filter="url(#grano)" clip-path="url(#clipBolso)"/>`;
  cuerpo += `<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="7" fill="url(#luz)" stroke="rgba(0,0,0,.28)" stroke-width="1"/>`;
  // Cremallera (bajo la tapa)
  if (S.cremallera || S.tamano === '35x45') {
    cuerpo += `<line x1="${x + 10}" y1="${fb + 7}" x2="${x + W - 10}" y2="${fb + 7}" stroke="#1d1d1d" stroke-width="3.2"/><line x1="${x + 10}" y1="${fb + 7}" x2="${x + W - 10}" y2="${fb + 7}" stroke="#8b8b8b" stroke-width="1.2" stroke-dasharray="1.6 1.6"/>`
      + `<rect x="${x + 14}" y="${fb + 4}" width="6" height="6" rx="1" fill="url(#g-plata)"/><rect x="${x + 15.5}" y="${fb + 9}" width="3" height="10" rx="1.5" fill="url(#g-plata)"/>`;
  }
  // sombra de la tapa sobre la base
  cuerpo += `<rect x="${x}" y="${fb}" width="${W}" height="16" fill="url(#sombraTapa)" clip-path="url(#clipBolso)"/>`;
  let tapa = `<g clip-path="url(#clipTapa)"><rect x="${x - 2}" y="${y - 2}" width="${W + 4}" height="${flapH + 4}" fill="url(#fTapa)"/>`;
  if (tela.grano || tela.img) tapa += `<rect x="${x}" y="${y}" width="${W}" height="${flapH}" fill="#fff" filter="url(#grano)"/>`;
  tapa += `<rect x="${x}" y="${y}" width="${W}" height="${flapH}" fill="url(#luz)"/>`;
  // Cinta
  if (S.cinta !== 'ninguna') {
    const c = CINTA[S.cinta];
    defs += patronCinta(c, 'pCinta');
    const bh = Math.max(16, Math.min(34, Math.round(flapH * .26)));
    const banda = (by) => `<rect x="${x}" y="${by}" width="${W}" height="${bh}" fill="url(#pCinta)"/><rect x="${x}" y="${by}" width="${W}" height="${bh}" fill="url(#luz)" opacity=".6"/><line x1="${x}" y1="${by}" x2="${x + W}" y2="${by}" stroke="rgba(0,0,0,.35)"/><line x1="${x}" y1="${by + bh}" x2="${x + W}" y2="${by + bh}" stroke="rgba(0,0,0,.35)"/>`;
    if (S.cintaPos === 'vertical') {
      const bw = Math.round(bh * 1.6), bx = x + (W - bw) / 2;
      tapa += `<rect x="${bx}" y="${y}" width="${bw}" height="${flapH}" fill="url(#pCinta)"/><rect x="${bx}" y="${y}" width="${bw}" height="${flapH}" fill="url(#luz)" opacity=".6"/><line x1="${bx}" y1="${y}" x2="${bx}" y2="${fb}" stroke="rgba(0,0,0,.35)"/><line x1="${bx + bw}" y1="${y}" x2="${bx + bw}" y2="${fb}" stroke="rgba(0,0,0,.35)"/>`;
    } else {
      const pos = { arriba: [.16], medio: [.5 - bh / flapH / 2], abajo: [.84 - bh / flapH], dos: [.22, .62 - bh / flapH] }[S.cintaPos];
      pos.forEach(p => { tapa += banda(Math.round(y + flapH * p)); });
    }
  }
  // borde inferior de la tapa
  tapa += `</g><path d="M${x + 1} ${fb - 1}h${W - 2}" stroke="rgba(0,0,0,.45)" stroke-width="1.4"/><path d="M${x + 1} ${fb - 3}h${W - 2}" stroke="rgba(255,255,255,.18)"/>`;

  // Tachuelas
  let tach = '';
  if (S.tachuelas.length) {
    const tipos = S.tachuelas.map(id => TACH[id]);
    const grupo = [[0, 0], [15, 5], [6, 15], [24, 13], [33, 2], [14, 26], [29, 25]];
    const pinta = (px, py, i) => {
      const t = tipos[i % tipos.length], g = `url(#g-${t.metal})`;
      if (t.forma === 'estrella') return `<polygon points="${estrella(px, py, 6)}" fill="${g}" stroke="rgba(0,0,0,.35)" stroke-width=".5"/>`;
      if (t.forma === 'disco') return `<circle cx="${px}" cy="${py}" r="7.5" fill="${g}" stroke="rgba(0,0,0,.3)" stroke-width=".6"/><circle cx="${px - 3}" cy="${py - 3.5}" r=".9" fill="#555"/><circle cx="${px + 3}" cy="${py - 3.5}" r=".9" fill="#555"/>`;
      return `<circle cx="${px}" cy="${py + 1}" r="4.6" fill="rgba(0,0,0,.25)"/><circle cx="${px}" cy="${py}" r="4.4" fill="${g}"/>`;
    };
    const esquina = (by) => {
      let s = '';
      grupo.forEach(([dx, dy], j) => { s += pinta(x + 14 + dx, by + dy, j); s += pinta(x + W - 14 - dx, by + dy, j); });
      return s;
    };
    if (S.tachPos !== 'abajo') tach += esquina(fb - 36);
    if (S.tachPos !== 'arriba') tach += esquina(Math.min(bot - 34, fb + 16));
  }

  // Medidas
  const md = (S.flecos !== 'ninguno' && S.flecosForma === 'abajo') ? 62 : 22;
  const mdx = (S.flecos !== 'ninguno' && S.flecosForma !== 'abajo') ? 62 : 22;
  const medidas = `<g stroke="#555" stroke-width="1" fill="#555" font-family="Poppins, sans-serif" font-size="12">
    <line x1="${x}" y1="${bot + md}" x2="${x + W}" y2="${bot + md}"/><line x1="${x}" y1="${bot + md - 4}" x2="${x}" y2="${bot + md + 4}"/><line x1="${x + W}" y1="${bot + md - 4}" x2="${x + W}" y2="${bot + md + 4}"/>
    <text x="${x + W / 2}" y="${bot + md + 16}" text-anchor="middle" stroke="none">${tam.w} cm</text>
    <line x1="${x + W + mdx}" y1="${y}" x2="${x + W + mdx}" y2="${bot}"/><line x1="${x + W + mdx - 4}" y1="${y}" x2="${x + W + mdx + 4}" y2="${y}"/><line x1="${x + W + mdx - 4}" y1="${bot}" x2="${x + W + mdx + 4}" y2="${bot}"/>
    <text x="${x + W + mdx + 8}" y="${y + H / 2}" stroke="none" transform="rotate(90 ${x + W + mdx + 8} ${y + H / 2})" text-anchor="middle">${tam.h} cm</text></g>`;

  const vacio = !S.tamano || !S.tela ? `<text x="${VW / 2}" y="${y + H / 2}" text-anchor="middle" font-family="Poppins, sans-serif" font-size="13" fill="#6b6b6b">${!S.tamano ? 'Elige el tamaño para empezar' : 'Ahora elige la tela'}</text>` : '';
  return `<svg viewBox="0 0 ${VW} ${VH}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${atras}${cuerpo}${tapa}${tach}${delante}${S.tamano ? medidas : ''}${vacio}</svg>`;
}

function pintarBolso() {
  $('lienzo').innerHTML = bolsoSVG();
  const t = TAM[S.tamano], tela = TELA[S.tela];
  $('lienzo').setAttribute('aria-label', 'Vista de tu bolso: ' + [t && t.nombre, tela && 'tela ' + tela.nombre.toLowerCase()].filter(Boolean).join(', '));
}

/* ====== Pasos ====== */
const muestraTela = t => t.img ? `background-image:url(${t.img})` : `background:${t.color}`;
const muestraCinta = c => {
  const [a, b = a] = c.c;
  if (c.tipo === 'cadena') return `background:repeating-radial-gradient(circle at 50% 50%,transparent 0 3px,${a} 3px 5px,transparent 5px 7px) 0 0/12px 12px,#2a2a2a`;
  if (c.tipo === 'malla' || c.tipo === 'mallatach') return 'background:radial-gradient(circle,#f3f3f3 0 1.5px,#a7a9ad 2.6px,transparent 3.2px) 0 0/8px 8px,#3A3B3E';
  if (c.tipo === 'flores') return 'background:radial-gradient(circle,#fff 0 2px,#9aa0a8 2.5px,transparent 3.5px) 0 0/14px 12px,#D9DCE2';
  return `background:radial-gradient(circle at 40% 40%,rgba(255,255,255,.7) 0 1px,transparent 1.5px) 0 0/9px 9px,radial-gradient(circle,${a} 0 3.6px,rgba(0,0,0,.35) 4.2px,transparent 4.6px) 0 0/9px 9px,radial-gradient(circle,${b} 0 3.6px,rgba(0,0,0,.35) 4.2px,transparent 4.6px) 4.5px 4.5px/9px 9px,${a}`;
};
const muestraFleco = f => `background:repeating-linear-gradient(90deg,${f.c[0]} 0 1.5px,transparent 1.5px 3px${f.c[1] ? `,${f.c[1]} 3px 4.5px,transparent 4.5px 6px` : ''}),#F6F5F3`;
const precioTxt = (n, mas = true) => n ? (mas ? '+' : '') + eur(n) : 'Sin coste extra';

function opcion({ pulsado, deshab, muestra, nombre, pr, nota, txt, dato, valor }) {
  return `<button type="button" class="opt${txt ? ' txt' : ''}" aria-pressed="${pulsado}" ${deshab ? 'disabled' : ''} data-${dato}="${esc(valor)}">
    ${muestra !== undefined ? `<span class="mues" style="${muestra}" aria-hidden="true"></span>` : ''}<b>${esc(nombre)}</b>${pr ? `<span class="pr">${pr}</span>` : ''}${nota ? `<span class="nt">${esc(nota)}</span>` : ''}</button>`;
}
const chips = (lista, actual, dato) => `<div class="chips">${lista.map(o => `<button type="button" class="chip" aria-pressed="${o.id === actual}" data-${dato}="${o.id}">${esc(o.nombre)}</button>`).join('')}</div>`;
function miniTam(t) {
  const k = Math.min(54 / t.w, 54 / t.h), w = t.w * k, h = t.h * k;
  return `<svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true"><rect x="${(60 - w) / 2}" y="${(60 - h) / 2}" width="${w}" height="${h}" rx="3" fill="#E2DED6" stroke="#111"/><line x1="${(60 - w) / 2}" y1="${(60 - h) / 2 + h * .6}" x2="${(60 + w) / 2}" y2="${(60 - h) / 2 + h * .6}" stroke="#111"/></svg>`;
}

const PASOS = [
  { id: 'tamano', titulo: 'Elige el tamaño', ayuda: 'El tamaño marca el precio de partida.', listo: () => !!S.tamano, falta: 'Elige un tamaño para seguir.',
    html: () => `<div class="opts anchas">${TAMANOS.map(t => `<button type="button" class="opt txt" aria-pressed="${S.tamano === t.id}" data-tamano="${t.id}"><span class="tam">${miniTam(t)}<span><b>${t.nombre}</b><br><span class="pr">${eur(t.precio)}</span><br><span class="nt">${t.nota}</span></span></span></button>`).join('')}</div>` },
  { id: 'tela', titulo: 'Elige la tela', ayuda: 'La tela es la de todo el bolso: tapa y base.', listo: () => !!S.tela, falta: 'Elige una tela para seguir.',
    html: () => TELAS.map(g => `<p class="grupo">${g.grupo}<em>${g.extra === undefined ? '' : precioTxt(g.extra)}</em></p><div class="opts">${g.items.map(i => { const t = TELA[i.id]; return opcion({ pulsado: S.tela === t.id, muestra: muestraTela(t), nombre: t.nombre, pr: g.extra === undefined ? precioTxt(t.extra) : '', dato: 'tela', valor: t.id }); }).join('')}</div>`).join('') },
  { id: 'cinta', titulo: 'Añade una cinta', ayuda: 'La cinta va sobre la tapa. Elige el tipo y después dónde va.', listo: () => true,
    html: () => `<div class="opts">${opcion({ pulsado: S.cinta === 'ninguna', muestra: 'background:#F6F5F3', nombre: 'Sin cinta', dato: 'cinta', valor: 'ninguna' })}</div>`
      + CINTAS.map(g => `<p class="grupo">${g.grupo}<em>${g.extra === undefined ? 'de +3 a +5 €' : precioTxt(g.extra)}</em></p><div class="opts">${g.items.map(i => { const c = CINTA[i.id]; return opcion({ pulsado: S.cinta === c.id, muestra: muestraCinta(c), nombre: c.nombre, pr: g.extra === undefined ? precioTxt(c.extra) : '', dato: 'cinta', valor: c.id }); }).join('')}</div>`).join('')
      + (S.cinta !== 'ninguna' ? `<p class="grupo">¿Dónde va la cinta?</p>${chips(POS_CINTA, S.cintaPos, 'cintapos')}` : '') },
  { id: 'flecos', titulo: 'Añade flecos', ayuda: 'Elige el color y cómo van colocados.', listo: () => true,
    html: () => `<div class="opts">${opcion({ pulsado: S.flecos === 'ninguno', muestra: 'background:#F6F5F3', nombre: 'Sin flecos', dato: 'flecos', valor: 'ninguno' })}</div>`
      + FLECOS.map(g => `<p class="grupo">${g.grupo}<em>${precioTxt(g.extra)}</em></p><div class="opts">${g.items.map(i => opcion({ pulsado: S.flecos === i.id, muestra: muestraFleco(i), nombre: i.nombre, dato: 'flecos', valor: i.id })).join('')}</div>`).join('')
      + (S.flecos !== 'ninguno' ? `<p class="grupo">¿Cómo van?</p>${chips(FORMA_FLECOS, S.flecosForma, 'flecosforma')}` : '') },
  { id: 'tachuelas', titulo: 'Añade tachuelas', ayuda: `Mezcla hasta 3 tipos. Todo el conjunto cuesta lo mismo, lleves uno o tres: ${eur(PRECIO_TACHUELAS)}.`, listo: () => true,
    html: () => `<p class="grupo">Tipos<em>${S.tachuelas.length}/3 elegidos</em></p><div class="opts">${TACHUELAS.map(t => {
        const on = S.tachuelas.includes(t.id), m = METAL[t.metal];
        const mu = t.forma === 'estrella' ? `background:${m[1]};clip-path:polygon(50% 8%,61% 38%,93% 38%,67% 57%,77% 88%,50% 70%,23% 88%,33% 57%,7% 38%,39% 38%)`
          : `background:radial-gradient(circle at 35% 30%,${m[0]},${m[1]} 45%,${m[2]} 75%,transparent 76%) center/${t.forma === 'disco' ? '46px 46px' : '30px 30px'} no-repeat,#F6F5F3`;
        return opcion({ pulsado: on, deshab: !on && S.tachuelas.length >= 3, muestra: mu, nombre: t.nombre, dato: 'tach', valor: t.id });
      }).join('')}</div>${S.tachuelas.length ? `<p class="grupo">¿Dónde van?</p>${chips(POS_TACH, S.tachPos, 'tachpos')}` : '<p class="ayuda" style="margin-top:12px">Si no quieres tachuelas, pasa al siguiente paso.</p>'}` },
  { id: 'extras', titulo: 'Extras', ayuda: 'Detalles que puedes añadir.', listo: () => true,
    html: () => `<div class="opts anchas">${EXTRAS.map(e => {
        const incl = e.id === 'cremallera' && S.tamano === '35x45';
        return opcion({ pulsado: incl || S[e.id], deshab: incl, txt: true, nombre: e.nombre, pr: incl ? 'Incluida en 35 × 45 cm' : '+' + eur(e.precio), nota: e.nota, dato: 'extra', valor: e.id });
      }).join('')}</div>` },
  { id: 'resumen', titulo: 'Tu SIMO', ayuda: 'Revisa tu diseño y déjanos tus datos para hacerlo.', listo: () => true, html: resumenHTML }
];

function resumenHTML() {
  const L = lineas(), total = L.reduce((s, [, p]) => s + p, 0);
  const extra = [];
  if (S.cinta !== 'ninguna') extra.push(['Dónde va la cinta', POS_CINTA.find(p => p.id === S.cintaPos).nombre]);
  if (S.flecos !== 'ninguno') extra.push(['Cómo van los flecos', FORMA_FLECOS.find(p => p.id === S.flecosForma).nombre]);
  if (S.tachuelas.length) extra.push(['Tachuelas', S.tachuelas.map(id => TACH[id].nombre).join(', ') + ' · ' + POS_TACH.find(p => p.id === S.tachPos).nombre.toLowerCase()]);
  return `<ul class="res">${L.map(([n, p], i) => `<li><span>${esc(n)}</span><span>${p ? (i ? '+' : '') + eur(p) : 'incluido'}</span></li>`).join('')}
    ${extra.map(([n, v]) => `<li><span>${esc(n)}</span><span>${esc(v)}</span></li>`).join('')}
    <li><span><b>Total del bolso</b></span><span><b>${eur(total)}</b> + envío</span></li></ul>
  <form class="form" id="pedido" novalidate>
    <label>Nombre<input name="nombre" autocomplete="name" required></label>
    <label>Email<input name="email" type="email" autocomplete="email" required></label>
    <label class="full">Dirección (calle, número, piso)<input name="direccion" autocomplete="street-address" required></label>
    <label>Código postal<input name="cp" autocomplete="postal-code" inputmode="numeric" required></label>
    <label>Ciudad<input name="ciudad" autocomplete="address-level2" required></label>
    <label class="full">Teléfono (opcional, para el mensajero)<input name="telefono" type="tel" autocomplete="tel"></label>
    <label class="full">Algo más para Simone (opcional)<textarea name="notas" rows="2"></textarea></label>
    <label class="full check"><input type="checkbox" name="acepto" required> Entiendo que es un bolso a medida: tarda de 2 a 3 semanas y, por estar hecho a medida, no se puede devolver por desistimiento.</label>
    <button type="submit" class="flecha full" style="justify-content:center">Enviar mi encargo</button>
  </form>
  <p class="nota">Envío de 5 a 15 € según destino (solo Península). De momento el encargo se envía por email: Simone te escribe para confirmar el precio final, el envío y el pago.</p>
  <p class="toast" id="aviso" hidden></p>`;
}

function pintarPaso() {
  const P = PASOS[paso];
  $('progreso').innerHTML = PASOS.map((p, i) => `<li><button type="button" class="${i < paso ? 'hecho' : i === paso ? 'ahora' : ''}" ${i > maxPaso ? 'disabled' : ''} data-ir="${i}" aria-label="Paso ${i + 1}: ${p.titulo}"${i === paso ? ' aria-current="step"' : ''}></button></li>`).join('');
  $('paso').innerHTML = `<p class="num">Paso ${paso + 1} de ${PASOS.length}</p><h2>${P.titulo}</h2><p class="ayuda">${P.ayuda}</p>${P.html()}`;
  $('atras').disabled = paso === 0;
  $('siguiente').hidden = paso === PASOS.length - 1;
  $('siguiente').disabled = !P.listo();
  $('falta').hidden = P.listo() || !P.falta;
  $('falta').textContent = P.falta || '';
  if (P.id === 'resumen') $('pedido').addEventListener('submit', enviar);
}

function cambiar(fn) { fn(); pintarBolso(); pintarPrecio(); const y = window.scrollY; pintarPaso(); window.scrollTo(0, y); }

$('paso').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || b.disabled) return;
  const d = b.dataset;
  if (d.tamano) cambiar(() => { S.tamano = d.tamano; });
  else if (d.tela) cambiar(() => { S.tela = d.tela; });
  else if (d.cinta) cambiar(() => { S.cinta = d.cinta; });
  else if (d.cintapos) cambiar(() => { S.cintaPos = d.cintapos; });
  else if (d.flecos) cambiar(() => { S.flecos = d.flecos; });
  else if (d.flecosforma) cambiar(() => { S.flecosForma = d.flecosforma; });
  else if (d.tach) cambiar(() => { const i = S.tachuelas.indexOf(d.tach); if (i >= 0) S.tachuelas.splice(i, 1); else if (S.tachuelas.length < 3) S.tachuelas.push(d.tach); });
  else if (d.tachpos) cambiar(() => { S.tachPos = d.tachpos; });
  else if (d.extra) cambiar(() => { S[d.extra] = !S[d.extra]; });
});
$('progreso').addEventListener('click', e => { const b = e.target.closest('[data-ir]'); if (b && !b.disabled) { paso = +b.dataset.ir; pintarPaso(); subir(); } });
$('siguiente').addEventListener('click', () => { if (!PASOS[paso].listo()) return; paso++; maxPaso = Math.max(maxPaso, paso); pintarPaso(); subir(); });
$('atras').addEventListener('click', () => { if (paso > 0) { paso--; pintarPaso(); subir(); } });
function subir() { const p = document.querySelector('.pasos'); if (p.getBoundingClientRect().top < 60) p.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

function enviar(e) {
  e.preventDefault();
  const f = e.target, d = Object.fromEntries(new FormData(f));
  const aviso = $('aviso');
  const faltan = ['nombre', 'email', 'direccion', 'cp', 'ciudad'].filter(k => !String(d[k] || '').trim());
  if (faltan.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || '') || !d.acepto) {
    aviso.textContent = !d.acepto && !faltan.length ? 'Marca la casilla para confirmar que entiendes las condiciones del encargo.' : 'Revisa los datos: faltan campos o el email no es válido.';
    aviso.hidden = false; return;
  }
  const L = lineas(), total = L.reduce((s, [, p]) => s + p, 0);
  const txt = ['Hola Simone, quiero encargar este SIMO:', '',
    ...L.map(([n, p]) => `· ${n}: ${p ? eur(p) : 'incluido'}`),
    S.cinta !== 'ninguna' ? `· Cinta: ${POS_CINTA.find(p => p.id === S.cintaPos).nombre}` : '',
    S.flecos !== 'ninguno' ? `· Flecos: ${FORMA_FLECOS.find(p => p.id === S.flecosForma).nombre}` : '',
    S.tachuelas.length ? `· Tachuelas: ${S.tachuelas.map(id => TACH[id].nombre).join(', ')} (${POS_TACH.find(p => p.id === S.tachPos).nombre})` : '',
    `Total del bolso: ${eur(total)} + envío`, '',
    `Nombre: ${d.nombre}`, `Email: ${d.email}`, `Dirección: ${d.direccion}, ${d.cp} ${d.ciudad}`, d.telefono ? `Teléfono: ${d.telefono}` : '', d.notas ? `Notas: ${d.notas}` : ''
  ].filter(Boolean).join('\n');
  location.href = `mailto:simobysimone@gmail.com?subject=${encodeURIComponent('Encargo SIMO · ' + d.nombre)}&body=${encodeURIComponent(txt)}`;
  aviso.textContent = 'Se ha abierto tu correo con el encargo listo: solo tienes que enviarlo. Si no se abre, escríbenos a simobysimone@gmail.com.';
  aviso.hidden = false;
}

pintarBolso(); pintarPrecio(); pintarPaso();
