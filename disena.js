'use strict';
/* ====== Opciones y precios (de la tarifa de SIMO) ====== */
const TAMANOS = [
  { id: '30x20', nombre: '30 × 20 cm', precio: 45, w: 30, h: 20, nota: 'El clásico' },
  { id: '35x17', nombre: '35 × 17 cm', precio: 45, w: 35, h: 17, tapa: .8, nota: 'Alargado' },
  // 30 × 40 cm abierto: se dobla por la mitad, así que se dibuja como 30 × 20 cm.
  { id: '30x40', nombre: '30 × 40 cm', precio: 55, w: 30, h: 20, plegado: 40, tapa: .9, sinCremalleraVista: true, nota: 'Grande · incluye cremallera interna · se dobla por la mitad' },
  { id: 'ordenador', nombre: 'Ordenador o iPad', precio: 57, w: 34, h: 25, nota: 'Funda a medida: escribe las medidas de tu ordenador o iPad', medidas: true }
];
const TELAS = [
  { grupo: 'Algodón', extra: 0, items: [
    { id: 'algodon-blanca', nombre: 'Blanca', color: '#F1EEE7', tejido: true },
    { id: 'algodon-gris', nombre: 'Gris', color: '#7E8184', tejido: true },
    { id: 'algodon-negra', nombre: 'Negra', color: '#1E1E20', tejido: true } ] },
  { grupo: 'Polipiel · efecto cuero', extra: 5, items: [
    // Negra: foto real de la polipiel. Resto: su color con el mismo grano de cuero (img/grano-cuero.webp).
    { id: 'negra', nombre: 'Negra', img: 'img/tela-polipiel-negra.webp', color: '#1B1B1D' },
    { id: 'roja', nombre: 'Roja', color: '#B81D35', cuero: true },
    { id: 'turquesa', nombre: 'Turquesa', color: '#1FA8A1', cuero: true },
    { id: 'marron', nombre: 'Marrón', color: '#6A3820', cuero: true },
    { id: 'polipiel-blanca', nombre: 'Blanca', color: '#EAE7E2', cuero: true },
    { id: 'roja-oscura', nombre: 'Roja oscura', color: '#8C1D32', cuero: true },
    { id: 'beige', nombre: 'Beige', color: '#C9BC9C', cuero: true },
    { id: 'plateada', nombre: 'Plateada', color: '#B4B6BA', cuero: true, brillo: true } ] },
  { grupo: 'Estampadas', items: [
    { id: 'serpiente-dorada', nombre: 'Serpiente dorada', img: 'img/tela-serpiente-dorada.webp', color: '#8E7650', extra: 5 },
    { id: 'serpiente', nombre: 'Serpiente', img: 'img/telas/serpiente.jpg', color: '#6E6A62', extra: 5 },
    { id: 'vaca', nombre: 'Vaca', img: 'img/telas/vaca.jpg', color: '#EEE', extra: 0 } ] }
];
const CINTAS = [
  // Lentejuelas y plata: fotos reales de las cintas (img/cinta-*.webp, en horizontal).
  { grupo: 'Lentejuelas', extra: 3, items: [
    { id: 'lent-negra-dorada', nombre: 'Negra y dorada', img: 'img/cinta-lent-negra-dorada.webp', c: ['#1C1C1C', '#C9A55B'] },
    { id: 'lent-plateada', nombre: 'Plateada', img: 'img/cinta-lent-plateada.webp', c: ['#C9C8C4'] },
    { id: 'lent-dorada', nombre: 'Dorada', img: 'img/cinta-lent-dorada.webp', c: ['#C9AC4F'] },
    { id: 'lent-plateada-oscuro', nombre: 'Plateada oscuro', img: 'img/cinta-lent-plateada-oscuro.webp', c: ['#5B5651'] } ] },
  { grupo: 'Plata', extra: 4, items: [
    { id: 'plata-flores', nombre: 'Flores', img: 'img/cinta-plata-flores.webp', c: ['#E6E7EA'] },
    { id: 'plata-malla', nombre: 'Malla plata', img: 'img/cinta-plata-malla.webp', c: ['#9A9B9E'] },
    { id: 'plata-malla-tachuelas', nombre: 'Malla tachuelas', img: 'img/cinta-plata-malla-tachuelas.webp', c: ['#B7B5B0'] } ] },
  // Cadenas: dos hileras finas, dibujadas con eslabones metálicos.
  { grupo: 'Cadena', extra: 5, items: [
    { id: 'cadena-dorada', nombre: 'Dorada', tipo: 'cadena', metal: 'oro', c: ['#C79B4E'] },
    { id: 'cadena-plateada', nombre: 'Plateada', tipo: 'cadena', metal: 'plata', c: ['#A9ABAE'] } ] },
  // Cinta de tela: cualquiera de las telas del bolso.
  { grupo: 'Cinta de tela', extra: 3, items: TELAS.flatMap(g => g.items.filter(t => t.id !== 'vaca').map(t => ({
    id: 'tela-' + t.id, nombre: `${t.nombre} (${g.grupo.split(' ')[0].toLowerCase()})`, tipo: 'tela', tela: t.id, c: [t.color] }))) }
];
const POS_CINTA = [
  { id: 'centrado', nombre: 'Centrada' }, { id: 'doble', nombre: 'Doble (precio × 2)' }
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
const S = { tamano: null, tela: null, cinta: 'ninguna', cintaPos: 'centrado', flecos: 'ninguno', flecosForma: 'lados',
  tachuelas: [], tachPos: 'arriba', enganches: false, cremallera: false, medW: '', medH: '',
  telaBase: 'igual', telaParte: 'tapa' };
const EXTRA_DOS_TELAS = 2; // tapa y base de distinta tela
const dosTelas = () => S.tela && S.telaBase !== 'igual' && S.telaBase !== S.tela;
let paso = 0, maxPaso = 0;

/* Medidas escritas (funda de ordenador o iPad): de 15 a 60 cm. */
const MED_MIN = 15, MED_MAX = 60;
const num = v => parseFloat(String(v).replace(',', '.'));
const medOk = v => num(v) >= MED_MIN && num(v) <= MED_MAX;
const medidasOk = () => medOk(S.medW) && medOk(S.medH);
const cm = v => String(Math.round(num(v) * 10) / 10).replace('.', ',');
/* Tamaño que se dibuja y se cobra: el elegido, o el de ordenador con las medidas escritas. */
function tamActual() {
  const t = TAM[S.tamano];
  if (!t || !t.medidas) return t;
  return medidasOk() ? { ...t, w: num(S.medW), h: num(S.medH), nombre: `Funda ${cm(S.medW)} × ${cm(S.medH)} cm` } : { ...t, nombre: 'Funda de ordenador o iPad' };
}

const eur = n => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: n % 1 ? 2 : 0 }).format(n);
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function lineas() {
  const L = [];
  if (S.tamano) { const t = tamActual(); L.push([t.medidas ? t.nombre : `Tamaño ${t.nombre}`, t.precio]); }
  if (S.tela) {
    const t = TELA[S.tela], tipo = x => x.grupo.split(' ')[0].toLowerCase();
    if (!dosTelas()) L.push([`Tela ${t.nombre.toLowerCase()} (${tipo(t)})`, t.extra]);
    else {
      // Distinta tela en tapa y base: se cobra la tela más cara una vez + 2 €.
      const b = TELA[S.telaBase];
      L.push([`Tapa ${t.nombre.toLowerCase()} (${tipo(t)}) · base ${b.nombre.toLowerCase()} (${tipo(b)})`, Math.max(t.extra, b.extra)]);
      L.push(['Tapa y base de distinta tela', EXTRA_DOS_TELAS]);
    }
  }
  if (S.cinta !== 'ninguna') { const c = CINTA[S.cinta]; const x = S.cintaPos === 'doble' ? 2 : 1; L.push([`Cinta ${c.nombre.toLowerCase()}${x === 2 ? ' × 2' : ''}`, c.extra * x]); }
  if (S.flecos !== 'ninguno') { const f = FLECO[S.flecos]; L.push([`Flecos ${f.nombre.toLowerCase()}`, f.extra]); }
  if (S.tachuelas.length) L.push([`Tachuelas (${S.tachuelas.length} ${S.tachuelas.length === 1 ? 'tipo' : 'tipos'})`, PRECIO_TACHUELAS]);
  if (S.enganches) L.push(['Enganches', 5]);
  if (S.cremallera || S.tamano === '30x40') L.push(['Cremallera interna', S.tamano === '30x40' ? 0 : 10]);
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


function rellenoTela(t, id, x, y, w, h) {
  if (t.img) return `<pattern id="${id}" patternUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${t.color}"/><image href="${t.img}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></pattern>`;
  // Polipiel de color: color liso + grano de cuero real fundido encima (overlay) y, si es plateada, un brillo.
  if (t.cuero) return `<pattern id="${id}" patternUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${t.color}"/><image href="img/grano-cuero.webp" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" style="mix-blend-mode:overlay" opacity="${t.color > '#C' ? .7 : 1}"/>${t.brillo ? `<rect width="${w}" height="${h}" fill="url(#brilloMetal)"/>` : ''}</pattern>`;
  if (t.tejido) return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="4" height="4"><rect width="4" height="4" fill="${t.color}"/><path d="M0 1h4M0 3h4" stroke="rgba(0,0,0,.07)" stroke-width=".8"/><path d="M1 0v4M3 0v4" stroke="rgba(255,255,255,.06)" stroke-width=".8"/></pattern>`;
  return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="10" height="10"><rect width="10" height="10" fill="${t.color}"/></pattern>`;
}

function estrella(cx, cy, r) {
  let p = '';
  for (let i = 0; i < 10; i++) { const a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * .45 : r; p += `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)} `; }
  return p;
}

function bolsoSVG() {
  const tam = tamActual() || TAM['30x20'];
  const tela = TELA[S.tela] || { color: '#D8D3CB', vacia: true };
  const telaBase = (S.telaBase !== 'igual' && TELA[S.telaBase]) || tela;
  const VW = 440, VH = 400, maxW = 260, maxH = 220;
  const k = Math.min(maxW / tam.w, maxH / tam.h);
  const W = Math.round(tam.w * k), H = Math.round(tam.h * k);
  const x = Math.round((VW - W) / 2), y = Math.round(58 + (maxH - H) / 2);
  const flapH = Math.round(H * (tam.tapa || .62));
  const fb = y + flapH, bot = y + H;
  const R = rnd(7);
  let defs = `<linearGradient id="luz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
    <linearGradient id="sombraTapa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <radialGradient id="suelo"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <filter id="grano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .16"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in"/></filter>
    <linearGradient id="brilloMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".35" stop-color="#fff" stop-opacity=".05"/><stop offset=".6" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
    <clipPath id="clipBolso"><rect x="${x}" y="${y}" width="${W}" height="${H}" rx="7"/></clipPath>
    <clipPath id="clipTapa"><path d="M${x} ${y + 7}q0-7 7-7h${W - 14}q7 0 7 7v${flapH - 9}q0 2-2 2h-${W - 4}q-2 0-2-2z"/></clipPath>`;
  Object.entries(METAL).forEach(([n, [a, b, c]]) => { defs += `<radialGradient id="g-${n}" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="${a}"/><stop offset=".45" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`; });
  defs += rellenoTela(telaBase, 'fBase', x, y, W, H) + rellenoTela(tela, 'fTapa', x - 9, y - 6, W + 18, H + 12);

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
  if (telaBase.tejido) cuerpo += `<rect x="${x}" y="${y}" width="${W}" height="${H}" fill="#fff" filter="url(#grano)" clip-path="url(#clipBolso)"/>`;
  cuerpo += `<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="7" fill="url(#luz)" stroke="rgba(0,0,0,.28)" stroke-width="1"/>`;
  // Cremallera (bajo la tapa)
  if ((S.cremallera || S.tamano === '30x40') && !tam.sinCremalleraVista) {
    cuerpo += `<line x1="${x + 10}" y1="${fb + 7}" x2="${x + W - 10}" y2="${fb + 7}" stroke="#1d1d1d" stroke-width="3.2"/><line x1="${x + 10}" y1="${fb + 7}" x2="${x + W - 10}" y2="${fb + 7}" stroke="#8b8b8b" stroke-width="1.2" stroke-dasharray="1.6 1.6"/>`
      + `<rect x="${x + 14}" y="${fb + 4}" width="6" height="6" rx="1" fill="url(#g-plata)"/><rect x="${x + 15.5}" y="${fb + 9}" width="3" height="10" rx="1.5" fill="url(#g-plata)"/>`;
  }
  // sombra de la tapa sobre la base
  cuerpo += `<rect x="${x}" y="${fb}" width="${W}" height="16" fill="url(#sombraTapa)" clip-path="url(#clipBolso)"/>`;
  let tapa = `<g clip-path="url(#clipTapa)"><rect x="${x - 2}" y="${y - 2}" width="${W + 4}" height="${flapH + 4}" fill="url(#fTapa)"/>`;
  if (tela.tejido) tapa += `<rect x="${x}" y="${y}" width="${W}" height="${flapH}" fill="#fff" filter="url(#grano)"/>`;
  tapa += `<rect x="${x}" y="${y}" width="${W}" height="${flapH}" fill="url(#luz)"/>`;
  // Cinta
  if (S.cinta !== 'ninguna') {
    const c = CINTA[S.cinta];
    const cadena = c.tipo === 'cadena';
    // Alto de la cinta: unos 4 cm sobre el ancho del bolso (las cadenas, más finas).
    const bh = cadena ? Math.max(10, Math.round(W * .05)) : Math.max(16, Math.min(36, Math.round(W * .12), Math.round(flapH * .42)));
    // Doble: dos cintas pegadas, la de abajo monta un poco sobre la de arriba (solape del 12 %).
    const solape = Math.round(bh * .12), mitad = (2 * bh - solape) / 2;
    const tops = S.cintaPos === 'doble' ? [y + flapH * .5 - mitad, y + flapH * .5 - mitad + bh - solape] : [y + flapH * .5 - bh / 2];
    tops.forEach((top, n) => {
      const by = Math.round(top), id = 'pCinta' + n;
      if (cadena) {
        // dos hileras de eslabones con brillo metálico
        [by + bh * .3, by + bh * .72].forEach((ly, h) => {
          tapa += `<line x1="${x}" y1="${ly + 1}" x2="${x + W}" y2="${ly + 1}" stroke="rgba(0,0,0,.35)" stroke-width="2.2"/>`;
          for (let lx = x + (h ? 1.8 : 0); lx < x + W; lx += 3.6) {
            const g = Math.round(lx / 3.6) % 2 ? 28 : -28;
            tapa += `<ellipse cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" rx="2.3" ry="1.3" transform="rotate(${g} ${lx.toFixed(1)} ${ly.toFixed(1)})" fill="none" stroke="url(#g-${c.metal})" stroke-width="1.1"/>`;
          }
        });
        return;
      }
      if (!c.img) defs += rellenoTela(TELA[c.tela], id, x, by, W, bh);
      tapa += `<rect x="${x}" y="${by + 2}" width="${W}" height="${bh}" fill="rgba(0,0,0,.28)"/>` // sombra bajo la cinta
        // foto de la cinta: una sola pieza que cubre todo el ancho (sin repetir); lo que sobra a la derecha se recorta
        + (c.img ? `<rect x="${x}" y="${by}" width="${W}" height="${bh}" fill="${c.c[0]}"/><image href="${c.img}" x="${x}" y="${by}" width="${W}" height="${bh}" preserveAspectRatio="xMinYMid slice"/>`
          : `<rect x="${x}" y="${by}" width="${W}" height="${bh}" fill="url(#${id})"/>`)
        + `<rect x="${x}" y="${by}" width="${W}" height="${bh}" fill="url(#luz)" opacity=".5"/>`
        + `<line x1="${x}" y1="${by + .5}" x2="${x + W}" y2="${by + .5}" stroke="rgba(0,0,0,.35)"/><line x1="${x}" y1="${by + bh - .5}" x2="${x + W}" y2="${by + bh - .5}" stroke="rgba(0,0,0,.35)"/>`;
      if (c.tipo === 'tela') // pespunte de la cinta de tela
        tapa += `<line x1="${x}" y1="${by + 3}" x2="${x + W}" y2="${by + 3}" stroke="rgba(255,255,255,.35)" stroke-dasharray="3 2" stroke-width=".7"/><line x1="${x}" y1="${by + bh - 3}" x2="${x + W}" y2="${by + bh - 3}" stroke="rgba(255,255,255,.35)" stroke-dasharray="3 2" stroke-width=".7"/>`;
    });
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
    // k: si la base es baja (p. ej. 35 × 17, tapa de 4/5), el grupo de abajo se aplasta para que quepa.
    const esquina = (by, k = 1) => {
      let s = '';
      grupo.forEach(([dx, dy], j) => { s += pinta(x + 14 + dx, by + dy * k, j); s += pinta(x + W - 14 - dx, by + dy * k, j); });
      return s;
    };
    if (S.tachPos !== 'abajo') tach += esquina(fb - 36);
    if (S.tachPos !== 'arriba') {
      const libre = bot - fb - 16;
      tach += libre >= 26 ? esquina(Math.min(bot - 34, fb + 16)) : esquina(fb + 10, Math.max(0, (bot - fb - 16) / 26));
    }
  }

  // Medidas
  const md = (S.flecos !== 'ninguno' && S.flecosForma === 'abajo') ? 62 : 22;
  const mdx = (S.flecos !== 'ninguno' && S.flecosForma !== 'abajo') ? 62 : 22;
  const medidas = `<g stroke="#555" stroke-width="1" fill="#555" font-family="Poppins, sans-serif" font-size="12">
    <line x1="${x}" y1="${bot + md}" x2="${x + W}" y2="${bot + md}"/><line x1="${x}" y1="${bot + md - 4}" x2="${x}" y2="${bot + md + 4}"/><line x1="${x + W}" y1="${bot + md - 4}" x2="${x + W}" y2="${bot + md + 4}"/>
    <text x="${x + W / 2}" y="${bot + md + 16}" text-anchor="middle" stroke="none">${cm(tam.w)} cm</text>
    <line x1="${x + W + mdx}" y1="${y}" x2="${x + W + mdx}" y2="${bot}"/><line x1="${x + W + mdx - 4}" y1="${y}" x2="${x + W + mdx + 4}" y2="${y}"/><line x1="${x + W + mdx - 4}" y1="${bot}" x2="${x + W + mdx + 4}" y2="${bot}"/>
    <text x="${x + W + mdx + 8}" y="${y + H / 2}" stroke="none" transform="rotate(90 ${x + W + mdx + 8} ${y + H / 2})" text-anchor="middle">${tam.plegado ? `${cm(tam.h)} cm (${tam.plegado} abierto)` : `${cm(tam.h)} cm`}</text></g>`;

  const vacio = !S.tamano || !S.tela ? `<text x="${VW / 2}" y="${y + H / 2}" text-anchor="middle" font-family="Poppins, sans-serif" font-size="13" fill="#6b6b6b">${!S.tamano ? 'Elige el tamaño para empezar' : 'Ahora elige la tela'}</text>` : '';
  return `<svg viewBox="0 0 ${VW} ${VH}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${atras}${cuerpo}${tapa}${tach}${delante}${S.tamano ? medidas : ''}${vacio}</svg>`;
}

function pintarBolso() {
  $('lienzo').innerHTML = bolsoSVG();
  const t = tamActual(), tela = TELA[S.tela];
  $('lienzo').setAttribute('aria-label', 'Vista de tu bolso: ' + [t && t.nombre, tela && 'tela ' + tela.nombre.toLowerCase()].filter(Boolean).join(', '));
}

/* ====== Pasos ====== */
const muestraTela = t => t.img ? `background-image:url(${t.img})`
  : t.cuero ? `background:${t.brillo ? 'linear-gradient(135deg,rgba(255,255,255,.35),rgba(255,255,255,0) 40%,rgba(255,255,255,.25) 65%,rgba(0,0,0,.1)),' : ''}url(img/grano-cuero.webp) center/300px,${t.color};background-blend-mode:${t.brillo ? 'normal,' : ''}overlay`
  : `background:${t.color}`;
const muestraCinta = c => {
  if (c.img) return `background:url(${c.img}) left center/cover no-repeat,${c.c[0]}`;
  if (c.tipo === 'tela') return muestraTela(TELA[c.tela]);
  // cadena: dos hileras de eslabones (pequeño SVG) sobre fondo claro
  const m = METAL[c.metal];
  let s = '';
  [22, 42].forEach((cy, h) => { for (let lx = h * 3; lx < 128; lx += 6) s += `<ellipse cx='${lx}' cy='${cy}' rx='3.8' ry='2.2' transform='rotate(${(lx / 6) % 2 ? 28 : -28} ${lx} ${cy})' fill='none' stroke='${m[2]}' stroke-width='1.8'/>`; });
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='64'>${s}</svg>`;
  const uri = encodeURIComponent(svg).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
  return `background:url(data:image/svg+xml,${uri}) center/cover,#E9E6E1`;
};
const muestraFleco = f => `background:repeating-linear-gradient(90deg,${f.c[0]} 0 1.5px,transparent 1.5px 3px${f.c[1] ? `,${f.c[1]} 3px 4.5px,transparent 4.5px 6px` : ''}),#F6F5F3`;
const precioTxt = (n, mas = true) => n ? (mas ? '+' : '') + eur(n) : 'Sin coste extra';

function opcion({ pulsado, deshab, muestra, nombre, pr, nota, txt, dato, valor }) {
  return `<button type="button" class="opt${txt ? ' txt' : ''}" aria-pressed="${pulsado}" ${deshab ? 'disabled' : ''} data-${dato}="${esc(valor)}">
    ${muestra !== undefined ? `<span class="mues" style="${muestra}" aria-hidden="true"></span>` : ''}<b>${esc(nombre)}</b>${pr ? `<span class="pr">${pr}</span>` : ''}${nota ? `<span class="nt">${esc(nota)}</span>` : ''}</button>`;
}
const chips = (lista, actual, dato) => `<div class="chips">${lista.map(o => `<button type="button" class="chip" aria-pressed="${o.id === actual}" data-${dato}="${o.id}">${esc(o.nombre)}</button>`).join('')}</div>`;
function miniTam(t) {
  const k = Math.min(54 / t.w, 54 / t.h), w = t.w * k, h = t.h * k, tapa = t.tapa || .6;
  return `<svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true"><rect x="${(60 - w) / 2}" y="${(60 - h) / 2}" width="${w}" height="${h}" rx="3" fill="#E2DED6" stroke="#111"/><line x1="${(60 - w) / 2}" y1="${(60 - h) / 2 + h * tapa}" x2="${(60 + w) / 2}" y2="${(60 - h) / 2 + h * tapa}" stroke="#111"/></svg>`;
}
const medidasHTML = () => `<div class="medidas">
  <p class="grupo">Medidas de tu ordenador o iPad</p>
  <div class="med-campos">
    <label>Ancho (cm)<input id="med-w" type="text" inputmode="decimal" placeholder="Ej.: 33" value="${esc(S.medW)}" aria-describedby="med-ayuda"></label>
    <span aria-hidden="true">×</span>
    <label>Alto (cm)<input id="med-h" type="text" inputmode="decimal" placeholder="Ej.: 23" value="${esc(S.medH)}" aria-describedby="med-ayuda"></label>
  </div>
  <p class="nt" id="med-ayuda">Mide tu ordenador o iPad y escribe el ancho y el alto en centímetros (de ${MED_MIN} a ${MED_MAX}). El dibujo del bolso tomará estas medidas.</p>
</div>`;
const PASOS = [
  { id: 'tamano', titulo: 'Elige el tamaño', ayuda: 'El tamaño marca el precio de partida.',
    listo: () => !!S.tamano && (!TAM[S.tamano].medidas || medidasOk()),
    get falta() { return S.tamano && TAM[S.tamano].medidas ? `Escribe el ancho y el alto (de ${MED_MIN} a ${MED_MAX} cm) para seguir.` : 'Elige un tamaño para seguir.'; },
    html: () => `<div class="opts anchas">${TAMANOS.map(t => `<button type="button" class="opt txt" aria-pressed="${S.tamano === t.id}" data-tamano="${t.id}"><span class="tam">${miniTam(t)}<span><b>${t.nombre}</b><br><span class="pr">${eur(t.precio)}</span><br><span class="nt">${t.nota}</span></span></span></button>`).join('')}</div>`
      + (S.tamano && TAM[S.tamano].medidas ? medidasHTML() : '') },
  { id: 'tela', titulo: 'Elige la tela', ayuda: `Elige la tela de la tapa y la de la base. Si las dos son iguales, el precio no cambia; si son distintas, +${eur(EXTRA_DOS_TELAS)}.`,
    listo: () => !!S.tela, falta: 'Elige la tela de la tapa para seguir.',
    html: () => {
      const parte = S.telaParte, actual = parte === 'tapa' ? S.tela : S.telaBase;
      const nom = id => TELA[id] ? TELA[id].nombre : '';
      const tabs = `<div class="partes" role="tablist">
        <button type="button" role="tab" class="parte" aria-selected="${parte === 'tapa'}" data-parte="tapa"><b>Tapa</b><span>${S.tela ? esc(nom(S.tela)) : 'Sin elegir'}</span></button>
        <button type="button" role="tab" class="parte" aria-selected="${parte === 'base'}" data-parte="base"><b>Base</b><span>${S.telaBase === 'igual' ? 'Igual que la tapa' : esc(nom(S.telaBase))}</span></button></div>`;
      const igual = parte === 'base' ? `<div class="opts">${opcion({ pulsado: S.telaBase === 'igual', muestra: S.tela ? muestraTela(TELA[S.tela]) : 'background:#F6F5F3', nombre: 'Igual que la tapa', pr: 'Mismo precio', dato: 'tela', valor: 'igual' })}</div>` : '';
      const pista = parte === 'tapa' && S.tela ? `<p class="nt" style="margin:10px 0 0">¿Quieres otra tela para la base? Pulsa <b>Base</b>.</p>` : '';
      return tabs + pista + igual + TELAS.map(g => `<p class="grupo">${g.grupo}<em>${g.extra === undefined ? '' : precioTxt(g.extra)}</em></p><div class="opts">${g.items.map(i => { const t = TELA[i.id]; return opcion({ pulsado: actual === t.id, muestra: muestraTela(t), nombre: t.nombre, pr: g.extra === undefined ? precioTxt(t.extra) : '', dato: 'tela', valor: t.id }); }).join('')}</div>`).join('');
    } },
  { id: 'cinta', titulo: 'Añade una cinta', ayuda: 'La cinta va sobre la tapa. Elige el tipo y si la quieres centrada o doble.', listo: () => true,
    html: () => `<p class="grupo">¿Centrada o doble?</p>${chips(POS_CINTA, S.cintaPos, 'cintapos')}`
      + `<div class="opts" style="margin-top:14px">${opcion({ pulsado: S.cinta === 'ninguna', muestra: 'background:#F6F5F3', nombre: 'Sin cinta', dato: 'cinta', valor: 'ninguna' })}</div>`
      + CINTAS.map(g => `<p class="grupo">${g.grupo}<em>${precioTxt(g.extra)}</em></p><div class="opts">${g.items.map(i => { const c = CINTA[i.id]; return opcion({ pulsado: S.cinta === c.id, muestra: muestraCinta(c), nombre: c.nombre, dato: 'cinta', valor: c.id }); }).join('')}</div>`).join('') },
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
        const incl = e.id === 'cremallera' && S.tamano === '30x40';
        return opcion({ pulsado: incl || S[e.id], deshab: incl, txt: true, nombre: e.nombre, pr: incl ? 'Incluida en 30 × 40 cm' : '+' + eur(e.precio), nota: e.nota, dato: 'extra', valor: e.id });
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
  if (d.tamano) { cambiar(() => { S.tamano = d.tamano; }); if (TAM[d.tamano].medidas && !medidasOk()) $('med-w')?.focus(); }
  else if (d.parte) cambiar(() => { S.telaParte = d.parte; });
  else if (d.tela) cambiar(() => {
    if (S.telaParte === 'tapa') S.tela = d.tela;
    else if (!S.tela && d.tela !== 'igual') { S.tela = d.tela; } // sin tapa aún: la primera elección vale para las dos
    else S.telaBase = d.tela === S.tela ? 'igual' : d.tela;
  });
  else if (d.cinta) cambiar(() => { S.cinta = d.cinta; });
  else if (d.cintapos) cambiar(() => { S.cintaPos = d.cintapos; });
  else if (d.flecos) cambiar(() => { S.flecos = d.flecos; });
  else if (d.flecosforma) cambiar(() => { S.flecosForma = d.flecosforma; });
  else if (d.tach) cambiar(() => { const i = S.tachuelas.indexOf(d.tach); if (i >= 0) S.tachuelas.splice(i, 1); else if (S.tachuelas.length < 3) S.tachuelas.push(d.tach); });
  else if (d.tachpos) cambiar(() => { S.tachPos = d.tachpos; });
  else if (d.extra) cambiar(() => { S[d.extra] = !S[d.extra]; });
});
// Medidas de la funda: se actualizan el dibujo, el precio y la flecha sin volver a pintar el paso (no se pierde el cursor).
$('paso').addEventListener('input', e => {
  if (e.target.id !== 'med-w' && e.target.id !== 'med-h') return;
  if (e.target.id === 'med-w') S.medW = e.target.value.trim(); else S.medH = e.target.value.trim();
  e.target.setAttribute('aria-invalid', e.target.value.trim() && !medOk(e.target.value) ? 'true' : 'false');
  pintarBolso(); pintarPrecio();
  const P = PASOS[paso];
  $('siguiente').disabled = !P.listo();
  $('falta').hidden = P.listo();
  $('falta').textContent = P.falta;
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
