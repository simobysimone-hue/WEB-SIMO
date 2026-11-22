'use strict';
import { precioBolso } from './precios.mjs';
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
    { id: 'serpiente', nombre: 'Serpiente', img: 'img/tela-serpiente.webp', color: '#6E6A62', extra: 5 },
    { id: 'vaca', nombre: 'Vaca', img: 'img/tela-vaca.webp', color: '#EEE', extra: 0 } ] }
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
  // c: tonos de los hilos (de oscuro a claro), sacados de las fotos de los flecos. brillo: hilo metálico mezclado.
  { grupo: 'Flecos', extra: 5, items: [
    { id: 'turquesas', nombre: 'Turquesas', c: ['#16706d', '#22918c', '#33a8a2', '#5cc4bd'] },
    { id: 'blancos', nombre: 'Blancos', c: ['#9a9b99', '#bfc0be', '#d9dad8', '#f1f1ef'] },
    { id: 'marrones', nombre: 'Marrones', c: ['#3e201e', '#5a3532', '#704844', '#8e6460'] },
    { id: 'negros', nombre: 'Negros', c: ['#141418', '#1f1f25', '#2c2c33', '#45454d'] },
    { id: 'rojos', nombre: 'Rojos', c: ['#5e0c14', '#7c1824', '#962430', '#b23c48'] },
    { id: 'grises', nombre: 'Grises', c: ['#2f2f33', '#55565a', '#7a7b7f', '#a9aaae'] } ] },
  { grupo: 'Con brillo', extra: 8, items: [
    { id: 'negro-plata', nombre: 'Negro y plata', c: ['#121212', '#1e1e1e', '#2b2b2b', '#3a3a3a'], brillo: ['#d8dadd', '#ffffff'] },
    { id: 'beige-dorado', nombre: 'Beige y dorado', c: ['#8b7c66', '#a99a82', '#c4b597', '#d9cbac'], brillo: ['#e6c66a', '#fff1b8'] } ] }
];
const FORMA_FLECOS = [
  { id: 'lados', nombre: 'En los laterales' }, { id: 'tapa', nombre: 'Delante, en la tapa' }
];
/* Tachuelas: se arrastran al bolso una a una. mm = tamaño real; img = foto recortada sin fondo.
   ocupa = parte del ancho de la imagen que ocupa la pieza (las fotos llevan un pequeño margen). */
const TACH_GRUPOS = [
  { grupo: 'Plateadas', items: [
    { id: 'plata-3', nombre: 'Redonda 3 mm', mm: 3, img: 'img/tachuela-plateada.webp', ocupa: .9 },
    { id: 'plata-5', nombre: 'Redonda 5 mm', mm: 5, img: 'img/tachuela-plateada.webp', ocupa: .9 },
    { id: 'plata-8', nombre: 'Redonda 8 mm', mm: 8, img: 'img/tachuela-plateada.webp', ocupa: .9 },
    { id: 'plata-estrella', nombre: 'Estrella 6 mm', mm: 6, img: 'img/estrella-plateada.webp', ocupa: .82 },
    { id: 'plata-lentejuela', nombre: 'Lentejuela 16 mm', mm: 16, img: 'img/lentejuela-plateada.webp', ocupa: .9 } ] },
  { grupo: 'Doradas', items: [
    { id: 'oro-3', nombre: 'Redonda 3 mm', mm: 3, img: 'img/tachuela-dorada.webp', ocupa: .9 },
    { id: 'oro-5', nombre: 'Redonda 5 mm', mm: 5, img: 'img/tachuela-dorada.webp', ocupa: .9 },
    { id: 'oro-8', nombre: 'Redonda 8 mm', mm: 8, img: 'img/tachuela-dorada.webp', ocupa: .9 },
    { id: 'oro-estrella', nombre: 'Estrella 6 mm', mm: 6, img: 'img/estrella-dorada.webp', ocupa: .82 } ] },
  { grupo: 'Cobre', items: [
    { id: 'cobre-3', nombre: 'Redonda 3 mm', mm: 3, img: 'img/tachuela-cobre.webp', ocupa: .9 },
    { id: 'cobre-5', nombre: 'Redonda 5 mm', mm: 5, img: 'img/tachuela-cobre.webp', ocupa: .9 } ] },
  { grupo: 'Cobre metalizado', items: [
    { id: 'cobremet-3', nombre: 'Redonda 3 mm', mm: 3, img: 'img/tachuela-cobre-metal.webp', ocupa: .9 },
    { id: 'cobremet-5', nombre: 'Redonda 5 mm', mm: 5, img: 'img/tachuela-cobre-metal.webp', ocupa: .9 } ] }
];
const TACH = Object.fromEntries(TACH_GRUPOS.flatMap(g => g.items.map(t => [t.id, { ...t, grupo: g.grupo }])));
const TACH_INCLUIDAS = 15, TACH_PRECIO_BASE = 5, TACH_PRECIO_EXTRA = .15; // hasta 15 por 5 €, luego 0,15 € cada una
const precioTachas = n => n ? TACH_PRECIO_BASE + Math.max(0, n - TACH_INCLUIDAS) * TACH_PRECIO_EXTRA : 0;
const EXTRAS = [
  { id: 'enganches', nombre: 'Enganches', nota: 'Para colgar una correa o una cadena', precio: 5 },
  { id: 'cremallera', nombre: 'Cremallera interna', nota: 'Por dentro del bolso', precio: 10 }
];

const todas = grupos => grupos.flatMap(g => g.items.map(i => ({ ...i, extra: i.extra ?? g.extra ?? 0, grupo: g.grupo })));
const TELA = Object.fromEntries(todas(TELAS).map(t => [t.id, t]));
const CINTA = Object.fromEntries(todas(CINTAS).map(t => [t.id, t]));
const FLECO = Object.fromEntries(todas(FLECOS).map(t => [t.id, t]));
const TAM = Object.fromEntries(TAMANOS.map(t => [t.id, t]));

/* ====== Estado ====== */
const S = { tamano: null, tela: null, cinta: 'ninguna', cintaPos: 'centrado', flecos: 'ninguno', flecosForma: 'lados',
  tachas: [], enganches: false, cremallera: false, medW: '', medH: '',
  telaBase: 'igual', telaParte: 'tapa' };
const EXTRA_DOS_TELAS = 2; // tapa y base de distinta tela
const dosTelas = () => S.tela && S.telaBase !== 'igual' && S.telaBase !== S.tela;
let paso = 0, maxPaso = 0;
let GEO = null; // posición del bolso en el dibujo (para arrastrar tachuelas)

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
  if (S.tachas.length) L.push([`Tachuelas (${S.tachas.length})`, precioTachas(S.tachas.length)]);
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
  // En el paso de tachuelas el bolso se ve más grande (zoom) para colocarlas bien.
  const zoom = typeof PASOS !== 'undefined' && PASOS[paso] && PASOS[paso].id === 'tachuelas';
  const VW = 440; let VH = 400; const maxW = zoom ? 400 : 260, maxH = zoom ? 330 : 220;
  const k = Math.min(maxW / tam.w, maxH / tam.h);
  const W = Math.round(tam.w * k), H = Math.round(tam.h * k);
  const x = Math.round((VW - W) / 2), y = Math.round((zoom ? 35 : 58) + (maxH - H) / 2);
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
  // Flecos: 15 cm de largo a escala del bolso. Cada fleco es un cordón con sombra, color y brillo,
  // y hay hueco entre ellos para que se distinga uno de otro.
  if (S.flecos !== 'ninguno') {
    const f = FLECO[S.flecos], tonos = f.c, cmU = W / tam.w, LARGO = 15 * cmU;
    const grosor = Math.max(1.1, .16 * cmU);          // ~1,6 mm por cordón
    const paso = grosor * 1.9;                         // separación entre cordones
    const cordon = (x0, y0, x1, y1, curva) => {
      const brillo = f.brillo && R() < .3;
      const col = brillo ? f.brillo[0] : tonos[1 + Math.floor(R() * (tonos.length - 1))];
      const luz = brillo ? f.brillo[1] : tonos[tonos.length - 1];
      const d = `M${x0.toFixed(1)} ${y0.toFixed(1)}C${(x0 + curva * .3).toFixed(1)} ${(y0 + (y1 - y0) * .35).toFixed(1)} ${(x1 - curva * .4).toFixed(1)} ${(y0 + (y1 - y0) * .7).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
      const w = grosor * (.85 + R() * .3);
      return `<path d="${d}" stroke="rgba(0,0,0,.45)" stroke-width="${(w + .9).toFixed(2)}" fill="none" stroke-linecap="round"/>`
        + `<path d="${d}" stroke="${col}" stroke-width="${w.toFixed(2)}" fill="none" stroke-linecap="round"/>`
        + `<path d="${d}" stroke="${luz}" stroke-width="${(w * .28).toFixed(2)}" fill="none" stroke-linecap="round" opacity="${brillo ? .95 : .55}" transform="translate(${(-w * .22).toFixed(2)} 0)"/>`;
    };
    let fondo = '', frente = '', abajo = 0;
    if (S.flecosForma === 'tapa') {
      // Delante: cosidos en la parte baja de la tapa, caen 15 cm.
      const y0 = fb - Math.round(flapH * .2), n = Math.floor((W - 4) / paso);
      for (let i = 0; i <= n; i++) {
        const sx = x + 2 + i * paso + (R() - .5) * paso * .4, len = LARGO * (.94 + R() * .06), sway = (R() - .5) * cmU * 1.2;
        const s = cordon(sx, y0, sx + sway, y0 + len, sway);
        if (R() < .45) fondo += s; else frente += s;
        abajo = Math.max(abajo, y0 + len);
      }
      delante += `<rect x="${x + 1}" y="${y0 - grosor * 1.6}" width="${W - 2}" height="${grosor * 3.2}" rx="1" fill="${tonos[0]}"/>`
        + `<g opacity=".8">${fondo}</g>${frente}`
        + `<rect x="${x + 1}" y="${y0 - grosor * 1.6}" width="${W - 2}" height="${grosor * 1.1}" fill="rgba(255,255,255,.15)"/>`;
    } else {
      // Laterales: cosidos a lo largo de cada lado; cada fleco cae 15 cm y se abren en abanico.
      [-1, 1].forEach(lado => {
        const bx = lado < 0 ? x + 3 : x + W - 3, top = y + 3, alto = H - 6, n = Math.floor(alto / paso);
        for (let i = 0; i <= n; i++) {
          const sy = top + i * paso, len = LARGO * (.92 + R() * .08);
          const fuera = lado * (grosor + R() * cmU * 3.2 + (i / n) * cmU * .8); // repartidos en unos 3-4 cm de ancho
          const s = cordon(bx, sy, bx + fuera, sy + len, fuera * .6);
          if (R() < .5) fondo += s; else frente += s;
          abajo = Math.max(abajo, sy + len);
        }
      });
      atras += `<g opacity=".78">${fondo}</g>${frente}`;
    }
    // El dibujo crece hacia abajo para que quepan los 15 cm (salvo en el paso de tachuelas, que es un zoom).
    if (!zoom) VH = Math.max(VH, Math.ceil(abajo + 14));
  }
  // Enganches y cremallera interna: solo cambian el precio y el resumen, no el dibujo.

  // Cuerpo y tapa
  let cuerpo = `<ellipse cx="${x + W / 2}" cy="${bot + 8}" rx="${W * .56}" ry="10" fill="url(#suelo)"/>`;
  cuerpo += `<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="7" fill="url(#fBase)"/>`;
  if (telaBase.tejido) cuerpo += `<rect x="${x}" y="${y}" width="${W}" height="${H}" fill="#fff" filter="url(#grano)" clip-path="url(#clipBolso)"/>`;
  cuerpo += `<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="7" fill="url(#luz)" stroke="rgba(0,0,0,.28)" stroke-width="1"/>`;
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
  // Tachuelas colocadas a mano: posición guardada en fracciones del bolso (fx, fy) y tamaño real en mm.
  const pxPorCm = W / tam.w;
  GEO = { x, y, W, H, pxPorCm, flapF: flapH / H };
  let tach = '';
  S.tachas.forEach((t, i) => {
    const tp = TACH[t.id]; if (!tp) return;
    const d = tp.mm / 10 * pxPorCm, lado = d / tp.ocupa, cx = x + t.fx * W, cy = y + t.fy * H;
    tach += `<g class="tacha" data-i="${i}"><ellipse cx="${(cx + d * .12).toFixed(1)}" cy="${(cy + d * .18).toFixed(1)}" rx="${(d * .5).toFixed(2)}" ry="${(d * .45).toFixed(2)}" fill="rgba(0,0,0,.3)"/>`
      + `<image href="${tp.img}" x="${(cx - lado / 2).toFixed(2)}" y="${(cy - lado / 2).toFixed(2)}" width="${lado.toFixed(2)}" height="${lado.toFixed(2)}"/>`
      + `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${Math.max(6, d / 2 + 2).toFixed(1)}" fill="transparent"/></g>`; // zona para cogerla con el dedo
  });

  // Medidas
  // Con flecos delante, el ancho se marca encima del bolso; con flecos laterales, el alto se separa más.
  const flecosDelante = S.flecos !== 'ninguno' && S.flecosForma === 'tapa';
  const ly = flecosDelante ? y - 18 : bot + 22, ty = flecosDelante ? y - 24 : bot + 38;
  const mdx = (S.flecos !== 'ninguno' && !flecosDelante) ? 70 : 22;
  const medidas = `<g stroke="#555" stroke-width="1" fill="#555" font-family="Poppins, sans-serif" font-size="12">
    <line x1="${x}" y1="${ly}" x2="${x + W}" y2="${ly}"/><line x1="${x}" y1="${ly - 4}" x2="${x}" y2="${ly + 4}"/><line x1="${x + W}" y1="${ly - 4}" x2="${x + W}" y2="${ly + 4}"/>
    <text x="${x + W / 2}" y="${ty}" text-anchor="middle" stroke="none">${cm(tam.w)} cm</text>
    <line x1="${x + W + mdx}" y1="${y}" x2="${x + W + mdx}" y2="${bot}"/><line x1="${x + W + mdx - 4}" y1="${y}" x2="${x + W + mdx + 4}" y2="${y}"/><line x1="${x + W + mdx - 4}" y1="${bot}" x2="${x + W + mdx + 4}" y2="${bot}"/>
    <text x="${x + W + mdx + 8}" y="${y + H / 2}" stroke="none" transform="rotate(90 ${x + W + mdx + 8} ${y + H / 2})" text-anchor="middle">${tam.plegado ? `${cm(tam.h)} cm (${tam.plegado} abierto)` : `${cm(tam.h)} cm`}</text></g>`;

  const vacio = !S.tamano || !S.tela ? `<text x="${VW / 2}" y="${y + H / 2}" text-anchor="middle" font-family="Poppins, sans-serif" font-size="13" fill="#6b6b6b">${!S.tamano ? 'Elige el tamaño para empezar' : 'Ahora elige la tela'}</text>` : '';
  return `<svg viewBox="0 0 ${VW} ${VH}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${atras}${cuerpo}${tapa}${delante}${tach}${S.tamano && !zoom ? medidas : ''}${vacio}</svg>`;
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
const muestraFleco = f => `background:url(img/fleco-${f.id}.webp) center/cover,${f.c[1]}`;
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
  { id: 'flecos', titulo: 'Añade flecos', ayuda: 'Elige el color y si van en los laterales o delante, en la tapa.', listo: () => true,
    html: () => `<div class="opts">${opcion({ pulsado: S.flecos === 'ninguno', muestra: 'background:#F6F5F3', nombre: 'Sin flecos', dato: 'flecos', valor: 'ninguno' })}</div>`
      + FLECOS.map(g => `<p class="grupo">${g.grupo}<em>${precioTxt(g.extra)}</em></p><div class="opts">${g.items.map(i => opcion({ pulsado: S.flecos === i.id, muestra: muestraFleco(i), nombre: i.nombre, dato: 'flecos', valor: i.id })).join('')}</div>`).join('')
      + (S.flecos !== 'ninguno' ? `<p class="grupo">¿Cómo van?</p>${chips(FORMA_FLECOS, S.flecosForma, 'flecosforma')}` : '') },
  { id: 'tachuelas', titulo: 'Añade tachuelas', ayuda: 'Arrastra cada tachuela hasta el sitio del bolso donde la quieras. Hasta 15 tachuelas, 5 €; a partir de ahí, 0,15 € cada una.', listo: () => true, html: tachasHTML },
  { id: 'extras', titulo: 'Extras', ayuda: 'Detalles que puedes añadir.', listo: () => true,
    html: () => `<div class="opts anchas">${EXTRAS.map(e => {
        const incl = e.id === 'cremallera' && S.tamano === '30x40';
        return opcion({ pulsado: incl || S[e.id], deshab: incl, txt: true, nombre: e.nombre, pr: incl ? 'Incluida en 30 × 40 cm' : '+' + eur(e.precio), nota: e.nota, dato: 'extra', valor: e.id });
      }).join('')}</div>` },
  { id: 'resumen', titulo: 'Tu SIMO', ayuda: 'Revisa tu diseño y añádelo al carrito. Puedes diseñar y añadir varios bolsos antes de pagar.', listo: () => true, html: resumenHTML }
];

/* ====== Resumen y carrito ====== */
const CARRITO = 'simo-carrito';
const leerCarrito = () => { try { return JSON.parse(localStorage.getItem(CARRITO)) || []; } catch { return []; } };
const guardarCarrito = c => { try { localStorage.setItem(CARRITO, JSON.stringify(c)); return true; } catch { return false; } };
function detalles() {
  const extra = [];
  if (S.cinta !== 'ninguna') extra.push(['Dónde va la cinta', POS_CINTA.find(p => p.id === S.cintaPos).nombre]);
  if (S.flecos !== 'ninguno') extra.push(['Cómo van los flecos', FORMA_FLECOS.find(p => p.id === S.flecosForma).nombre]);
  if (S.tachas.length) extra.push(['Tachuelas', resumenTachas()]);
  return extra;
}
function resumenHTML() {
  const L = lineas(), total = L.reduce((s, [, p]) => s + p, 0);
  return `<ul class="res">${L.map(([n, p], i) => `<li><span>${esc(n)}</span><span>${p ? (i ? '+' : '') + eur(p) : 'incluido'}</span></li>`).join('')}
    ${detalles().map(([n, v]) => `<li><span>${esc(n)}</span><span>${esc(v)}</span></li>`).join('')}
    <li><span><b>Total del bolso</b></span><span><b>${eur(total)}</b> + envío</span></li></ul>
  <label class="nota-bolso">Comentarios sobre tu bolso (opcional)<textarea id="nota-bolso" rows="2" maxlength="300"></textarea></label>
  <button type="button" class="flecha full anadir" id="anadir">Añadir al carrito</button>
  <p class="nota">Cada bolso se hace a mano y solo por encargo. El envío se calcula en el carrito según el destino.</p>
  <p class="toast" id="aviso" hidden></p>`;
}
function anadirAlCarrito() {
  const L = lineas(), totalVista = L.reduce((s, [, p]) => s + p, 0);
  const d = { tamano: S.tamano, tela: S.tela, telaBase: S.telaBase, cinta: S.cinta, cintaPos: S.cintaPos, flecos: S.flecos, flecosForma: S.flecosForma,
    tachas: S.tachas.map(t => ({ id: t.id, fx: +t.fx.toFixed(3), fy: +t.fy.toFixed(3) })), enganches: S.enganches, cremallera: S.cremallera, medW: S.medW, medH: S.medH };
  let precio;
  try { precio = precioBolso(d); } catch (e) { $('aviso').textContent = 'Revisa el diseño: falta algo por elegir.'; $('aviso').hidden = false; return; }
  if (Math.abs(precio - totalVista) > .001) console.warn('Precio distinto entre el diseñador y la tarifa', precio, totalVista);
  const svg = $('lienzo').innerHTML.replace(/<text[^>]*>[^<]*<\/text>/g, ''); // sin las medidas
  const item = { id: Date.now().toString(36), d, precio, cantidad: 1, titulo: `Bolso SIMO · ${tamActual().nombre}`,
    lineas: L.map(([n]) => n), detalles: detalles(), notas: ($('nota-bolso').value || '').trim(), svg };
  const c = leerCarrito(); c.push(item);
  if (!guardarCarrito(c)) { $('aviso').textContent = 'No se ha podido guardar el carrito en este navegador.'; $('aviso').hidden = false; return; }
  pintarCarritoCuenta();
  $('paso').innerHTML = `<p class="num">Añadido</p><h2>¡Tu SIMO está en el carrito!</h2>
    <p class="ayuda">${esc(item.titulo)} · ${eur(precio)}. Puedes diseñar otro o terminar el pedido.</p>
    <div class="tras-anadir"><a class="flecha" href="carrito.html">Ver el carrito (${c.reduce((s, i) => s + i.cantidad, 0)}) <span>›</span></a>
    <button type="button" class="flecha atras" id="otro">Diseñar otro bolso</button></div>`;
  $('siguiente').hidden = true; $('atras').hidden = true; $('falta').hidden = true;
  $('otro').addEventListener('click', () => {
    Object.assign(S, { tamano: null, tela: null, cinta: 'ninguna', cintaPos: 'centrado', flecos: 'ninguno', flecosForma: 'lados', tachas: [], enganches: false, cremallera: false, medW: '', medH: '', telaBase: 'igual', telaParte: 'tapa' });
    paso = 0; maxPaso = 0; $('atras').hidden = false; pintarBolso(); pintarPrecio(); pintarPaso(); subir();
  });
}
function pintarCarritoCuenta() {
  const n = leerCarrito().reduce((s, i) => s + (i.cantidad || 1), 0);
  document.querySelectorAll('.carrito-n').forEach(el => { el.textContent = n; el.hidden = !n; });
}

/* ====== Tachuelas: catálogo, resumen y arrastre ====== */

function tachasHTML() {
  const n = S.tachas.length, extra = Math.max(0, n - TACH_INCLUIDAS);
  const cuenta = n ? `<b>${n}</b> ${n === 1 ? 'tachuela' : 'tachuelas'} · ${eur(precioTachas(n))}${extra ? ` (5 € + ${extra} × 0,15 €)` : n < TACH_INCLUIDAS ? ` · te quedan ${TACH_INCLUIDAS - n} incluidas` : ''}` : 'Aún no has puesto ninguna';
  return `<div class="tach-cuenta"><span>${cuenta}</span><span class="tach-acc">
      <button type="button" class="chip" data-tachborrar="ultima" ${n ? '' : 'disabled'}>Quitar la última</button>
      <button type="button" class="chip" data-tachborrar="todas" ${n ? '' : 'disabled'}>Quitar todas</button></span></div>
    <p class="nt tach-ayuda">Con ratón: arrastra la tachuela al bolso. En el móvil: tócala para añadirla y luego muévela con el dedo sobre el bolso. Para quitar una, sácala del bolso o tócala dos veces.</p>`
    + TACH_GRUPOS.map(g => `<p class="grupo">${g.grupo}</p><div class="opts tachas">${g.items.map(t =>
      `<button type="button" class="opt tacha-opt" data-tachadd="${t.id}" aria-label="Añadir ${esc(t.nombre)} ${esc(g.grupo.toLowerCase())}">
        <span class="tacha-foto"><img src="${t.img}" alt="" draggable="false" style="width:${Math.round(14 + t.mm * 4.2 / t.ocupa * .9)}px"></span><b>${esc(t.nombre)}</b></button>`).join('')}</div>`).join('');
}
function zonaTacha(t) {
  const fl = GEO ? GEO.flapF : .6;
  return `${t.fy < fl ? 'tapa' : 'base'} ${t.fx < .34 ? 'izquierda' : t.fx > .66 ? 'derecha' : 'centro'}`;
}
function resumenTachas() {
  const cuenta = {};
  S.tachas.forEach(t => { const tp = TACH[t.id]; const k = `${tp.nombre.toLowerCase()} ${tp.grupo.toLowerCase().replace(/as$/, 'a')} (${zonaTacha(t)})`; cuenta[k] = (cuenta[k] || 0) + 1; });
  return Object.entries(cuenta).map(([k, v]) => `${v} × ${k}`).join(', ');
}
function aSvg(cx, cy) {
  const svg = $('lienzo').querySelector('svg'); if (!svg) return null;
  return new DOMPoint(cx, cy).matrixTransform(svg.getScreenCTM().inverse());
}
const dentro = p => GEO && p && p.x >= GEO.x - 4 && p.x <= GEO.x + GEO.W + 4 && p.y >= GEO.y - 4 && p.y <= GEO.y + GEO.H + 4;
const fraccion = p => ({ fx: Math.min(.98, Math.max(.02, (p.x - GEO.x) / GEO.W)), fy: Math.min(.98, Math.max(.02, (p.y - GEO.y) / GEO.H)) });
function anadirEnCentro(id) {
  const fl = GEO ? GEO.flapF : .6, k = S.tachas.length;
  cambiar(() => { S.tachas.push({ id, fx: .5 + ((k * 37) % 9 - 4) * .04, fy: fl * .5 + ((k * 23) % 5 - 2) * .05 }); });
}
let arrastre = null, suprimirClick = false;
document.addEventListener('pointerdown', e => {
  const nueva = e.target.closest('[data-tachadd]'), puesta = e.target.closest('#lienzo .tacha');
  if (!nueva && !puesta) return;
  if (nueva && e.pointerType === 'touch') return; // en el móvil se añade con un toque (click)
  e.preventDefault();
  arrastre = { id: nueva && nueva.dataset.tachadd, i: puesta ? +puesta.dataset.i : null, x0: e.clientX, y0: e.clientY, movido: false, fantasma: null };
});
document.addEventListener('pointermove', e => {
  if (!arrastre) return;
  if (!arrastre.movido && Math.hypot(e.clientX - arrastre.x0, e.clientY - arrastre.y0) < 4) return;
  arrastre.movido = true;
  if (arrastre.i !== null) { // mover una tachuela ya puesta
    const p = aSvg(e.clientX, e.clientY); if (!p || !GEO) return;
    Object.assign(S.tachas[arrastre.i], fraccion(p));
    $('lienzo').classList.toggle('fuera', !dentro(p));
    pintarBolso();
    return;
  }
  if (!arrastre.fantasma) { // tachuela nueva: se ve flotando al tamaño que tendrá en el bolso
    const tp = TACH[arrastre.id], svg = $('lienzo').querySelector('svg');
    const escala = svg ? svg.getBoundingClientRect().width / 440 : 1;
    const lado = Math.max(8, tp.mm / 10 * (GEO ? GEO.pxPorCm : 8.7) / tp.ocupa * escala);
    const f = document.createElement('img'); f.src = tp.img; f.className = 'tacha-fantasma'; f.style.width = f.style.height = lado + 'px';
    document.body.append(f); arrastre.fantasma = f;
  }
  arrastre.fantasma.style.left = e.clientX + 'px'; arrastre.fantasma.style.top = e.clientY + 'px';
});
document.addEventListener('pointerup', e => {
  if (!arrastre) return;
  const a = arrastre; arrastre = null;
  $('lienzo').classList.remove('fuera');
  if (a.fantasma) a.fantasma.remove();
  if (!a.movido) return; // un toque: lo gestiona el click
  suprimirClick = true; setTimeout(() => { suprimirClick = false; }, 0);
  const p = aSvg(e.clientX, e.clientY);
  if (a.i !== null) { if (!dentro(p)) S.tachas.splice(a.i, 1); cambiar(() => {}); return; }
  if (dentro(p)) cambiar(() => { S.tachas.push({ id: a.id, ...fraccion(p) }); });
});
document.addEventListener('pointercancel', () => { if (arrastre && arrastre.fantasma) arrastre.fantasma.remove(); arrastre = null; });
$('lienzo').addEventListener('dblclick', e => { const g = e.target.closest('.tacha'); if (g) cambiar(() => { S.tachas.splice(+g.dataset.i, 1); }); });
// doble toque en el móvil
let ultimoToque = { i: -1, t: 0 };
$('lienzo').addEventListener('pointerup', e => {
  if (e.pointerType !== 'touch') return;
  const g = e.target.closest('.tacha'); if (!g) return;
  const i = +g.dataset.i, ahora = Date.now();
  if (ultimoToque.i === i && ahora - ultimoToque.t < 350) { cambiar(() => { S.tachas.splice(i, 1); }); ultimoToque = { i: -1, t: 0 }; }
  else ultimoToque = { i, t: ahora };
});

function pintarPaso() {
  const P = PASOS[paso];
  $('progreso').innerHTML = PASOS.map((p, i) => `<li><button type="button" class="${i < paso ? 'hecho' : i === paso ? 'ahora' : ''}" ${i > maxPaso ? 'disabled' : ''} data-ir="${i}" aria-label="Paso ${i + 1}: ${p.titulo}"${i === paso ? ' aria-current="step"' : ''}></button></li>`).join('');
  $('paso').innerHTML = `<p class="num">Paso ${paso + 1} de ${PASOS.length}</p><h2>${P.titulo}</h2><p class="ayuda">${P.ayuda}</p>${P.html()}`;
  document.body.classList.toggle('paso-tachas', P.id === 'tachuelas');
  pintarBolso(); // el zoom cambia según el paso
  $('atras').disabled = paso === 0;
  $('siguiente').hidden = paso === PASOS.length - 1;
  $('siguiente').disabled = !P.listo();
  $('falta').hidden = P.listo() || !P.falta;
  $('falta').textContent = P.falta || '';
  if (P.id === 'resumen') $('anadir').addEventListener('click', anadirAlCarrito);
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
  else if (d.tachadd) { if (!suprimirClick) anadirEnCentro(d.tachadd); }
  else if (d.tachborrar) cambiar(() => { if (d.tachborrar === 'todas') S.tachas = []; else S.tachas.pop(); });
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


pintarBolso(); pintarPrecio(); pintarPaso(); pintarCarritoCuenta();
