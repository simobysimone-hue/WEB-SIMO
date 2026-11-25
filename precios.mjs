/* SIMO · Tarifa de los bolsos por encargo.
   La usan a la vez el diseñador (navegador) y el servidor de pago (Netlify), para que el precio
   que se cobra lo calcule siempre el servidor con estas mismas reglas.
   Si cambia un precio, se cambia SOLO aquí. */

export const TAMANOS = { '30x20': 45, '35x17': 45, '30x40': 55, 'ordenador': 57 };
export const TELA_EXTRA = {
  'algodon-blanca': 0, 'algodon-gris': 0, 'algodon-negra': 0,
  'negra': 5, 'roja': 5, 'turquesa': 5, 'marron': 5, 'polipiel-blanca': 5, 'roja-oscura': 5, 'beige': 5, 'plateada': 5,
  'serpiente-dorada': 5, 'serpiente': 5, 'vaca': 0
};
export const CINTA_EXTRA = {
  'lent-negra-dorada': 3, 'lent-plateada': 3, 'lent-dorada': 3, 'lent-plateada-oscuro': 3,
  'plata-flores': 4, 'plata-malla': 4, 'plata-malla-tachuelas': 4,
  'cadena-dorada': 5, 'cadena-plateada': 5
};
export const CINTA_TELA = 3;            // cinta hecha con cualquiera de las telas (menos vaca)
export const FLECO_EXTRA = { turquesas: 5, blancos: 5, marrones: 5, negros: 5, rojos: 5, grises: 5, 'negro-plata': 8, 'beige-dorado': 8 };
export const TACHUELAS = ['plata-3', 'plata-5', 'plata-8', 'plata-estrella', 'plata-lentejuela', 'oro-3', 'oro-5', 'oro-8', 'oro-estrella', 'cobre-3', 'cobre-5', 'cobremet-3', 'cobremet-5'];
export const TACH_INCLUIDAS = 15, TACH_BASE = 5, TACH_EXTRA = .15;
export const DOS_TELAS = 2, ENGANCHES = 5, CREMALLERA = 10;
export const MED_MIN = 15, MED_MAX = 60;

/* ====== Envíos ======
   España: precio fijo por pedido, IVA incluido. Basado en SendSeiPro · Correos Express Paq 24
   (paquete < 1 kg) + 21 % IVA + combustible + recogida, con un pequeño margen.
   Fuera de España: tarifa MRW eCommerce (oferta del 29/10/2026, válida hasta el 31/12/2026), nivel START UP,
   precios SIN IVA por tramo de peso. Lo que paga la clienta = precio MRW + 21 % IVA + 5 % de combustible,
   redondeado al euro de arriba. Si MRW cambia un precio, se cambia SOLO en MRW_TARIFA.
   Tramos de peso:          2 kg   5 kg   10 kg   15 kg   20 kg   25 kg */
export const MRW_TARIFA = {
  nacional: [6.90, 9.23, 11.62, 14.01, 16.41, 18.79],      // Portugal peninsular, Andorra y Gibraltar (tarifa nacional, entrega en domicilio)
  zona1: [30.06, 50.54, 58.73, 68.31, 77.87, 86.06],
  zona2: [42.35, 80.59, 88.80, 98.37, 107.92, 116.11],
  zona3: [54.65, 86.06, 112.02, 125.67, 136.60, 147.54],
  zona4: [73.77, 102.46, 142.06, 166.67, 188.52, 204.91]
};
export const MRW_IVA = 0.21, MRW_COMBUSTIBLE = 0.05;
/* Unos 500 g por bolso empaquetado: 1-3 bolsos → tramo de 2 kg, 4-9 → 5 kg, 10-19 → 10 kg… (más de 49: hay que escribir). */
export const tramoPeso = unidades => [3, 9, 19, 29, 39, 49].findIndex(max => unidades <= max);

export const ENVIOS = {
  peninsula: { nombre: 'España peninsular', precio: 5 },
  baleares: { nombre: 'Islas Baleares', precio: 8 },
  canarias: { nombre: 'Canarias', precio: 10 },
  ceutamelilla: { nombre: 'Ceuta y Melilla', precio: 22 },
  portugal: { nombre: 'Portugal peninsular', mrw: 'nacional' },
  andorra: { nombre: 'Andorra y Gibraltar', mrw: 'nacional' },
  zona1: { nombre: 'Europa (zona 1)', mrw: 'zona1' },
  zona2: { nombre: 'Europa (zona 2)', mrw: 'zona2' },
  zona3: { nombre: 'Estados Unidos y Canadá', mrw: 'zona3' },
  zona4: { nombre: 'Latinoamérica', mrw: 'zona4' },
  mundo: { nombre: 'Esta dirección', precio: null }
};
export const PAISES_UE = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'FI', 'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'];
export const ZONAS_MRW = {
  zona1: ['DE', 'AT', 'BE', 'DK', 'FR', 'NL', 'IT', 'LU', 'PL', 'GB', 'CZ', 'CH'],
  zona2: ['BG', 'SI', 'EE', 'FI', 'GR', 'HU', 'IE', 'LV', 'LT', 'NO', 'SK', 'RO', 'SE'],
  zona3: ['US', 'CA'],
  zona4: ['AR', 'BO', 'BR', 'CL', 'CO', 'CR', 'EC', 'SV', 'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'DO', 'UY', 'VE']
};
/* Países a los que se puede enviar (para el desplegable del carrito). */
export const PAISES_ENVIO = ['ES', 'PT', 'AD', 'GI', ...Object.values(ZONAS_MRW).flat()];

/* Zona de envío según país (código ISO) y código postal. */
export function zonaEnvio(pais, cp) {
  pais = String(pais || '').toUpperCase(); const c = String(cp || '').trim();
  if (pais === 'ES') {
    if (/^07/.test(c)) return 'baleares';
    if (/^(35|38)/.test(c)) return 'canarias';
    if (/^(51|52)/.test(c)) return 'ceutamelilla';
    return 'peninsula';
  }
  if (pais === 'PT') return /^9/.test(c) ? 'mundo' : 'portugal';   // Madeira y Azores (CP 9xxx) no entran en la tarifa
  if (pais === 'AD' || pais === 'GI') return 'andorra';
  for (const [zona, paises] of Object.entries(ZONAS_MRW)) if (paises.includes(pais)) return zona;
  return 'mundo';
}
/* Aduanas: Canarias, Ceuta, Melilla y todo lo que está fuera de la UE. */
export const conAduana = (pais, zona) => ['canarias', 'ceutamelilla'].includes(zona) || (String(pais).toUpperCase() !== 'ES' && !PAISES_UE.includes(String(pais).toUpperCase()));

/* Envío de un pedido: { zona, nombre, precio (euros, null = no se envía), aduana }. */
export function envioPedido(pais, cp, unidades) {
  const zona = zonaEnvio(pais, cp), z = ENVIOS[zona];
  let precio = z.precio ?? null;
  if (z.mrw) {
    const t = tramoPeso(Math.max(1, unidades || 1));
    precio = t < 0 ? null : Math.ceil(Math.round(MRW_TARIFA[z.mrw][t] * (1 + MRW_IVA) * (1 + MRW_COMBUSTIBLE) * 100) / 100);
  }
  return { zona, nombre: z.nombre, precio, aduana: conAduana(pais, zona) };
}

/* Black Friday: del 26 al 29 de noviembre de 2026 (hora de Madrid, días incluidos). Solo bolsos, el envío no.
   Por parejas: se ordenan todas las unidades del carrito de más cara a más barata y la segunda de cada pareja va al 50 %. */
export const OFERTA = { nombre: 'Black Friday', desde: '2026-11-26', hasta: '2026-11-29', texto: '2ª unidad al 50 %' };
export const diaMadrid = (f = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(f);
export const ofertaActiva = (f = new Date()) => { const d = diaMadrid(f); return d >= OFERTA.desde && d <= OFERTA.hasta; };
/* Recibe el precio (€) de cada unidad y devuelve el descuento (€) de cada una, en el mismo orden. */
export function descuentosOferta(precios) {
  const desc = precios.map(() => 0);
  precios.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p || a.i - b.i)
    .forEach((u, n) => { if (n % 2 === 1) desc[u.i] = Math.round(u.p * 50) / 100; });
  return desc;
}

export const precioTachas =n =>n ? TACH_BASE + Math.max(0, n - TACH_INCLUIDAS) * TACH_EXTRA : 0;
const cintaExtra = id => id === 'ninguna' ? 0 : id.startsWith('tela-') ? (id !== 'tela-vaca' && id.slice(5) in TELA_EXTRA ? CINTA_TELA : null) : (CINTA_EXTRA[id] ?? null);

/* Comprueba un diseño y devuelve su precio en euros (o lanza un error si algo no existe). */
export function precioBolso(d) {
  const err = m => { throw new Error('DISENO_INVALIDO: ' + m); };
  if (!(d.tamano in TAMANOS)) err('tamaño');
  if (d.tamano === 'ordenador') {
    const w = parseFloat(String(d.medW).replace(',', '.')), h = parseFloat(String(d.medH).replace(',', '.'));
    if (!(w >= MED_MIN && w <= MED_MAX && h >= MED_MIN && h <= MED_MAX)) err('medidas');
  }
  if (!(d.tela in TELA_EXTRA)) err('tela');
  const base = d.telaBase && d.telaBase !== 'igual' && d.telaBase !== d.tela ? d.telaBase : null;
  if (base && !(base in TELA_EXTRA)) err('tela de la base');
  const cinta = cintaExtra(d.cinta || 'ninguna'); if (cinta === null) err('cinta');
  if (d.flecos && d.flecos !== 'ninguno' && !(d.flecos in FLECO_EXTRA)) err('flecos');
  const tachas = Array.isArray(d.tachas) ? d.tachas : [];
  if (tachas.some(t => !TACHUELAS.includes(t.id))) err('tachuelas');
  let p = TAMANOS[d.tamano];
  p += base ? Math.max(TELA_EXTRA[d.tela], TELA_EXTRA[base]) + DOS_TELAS : TELA_EXTRA[d.tela];
  p += cinta * (d.cintaPos === 'doble' ? 2 : 1);
  p += d.flecos && d.flecos !== 'ninguno' ? FLECO_EXTRA[d.flecos] : 0;
  p += precioTachas(tachas.length);
  p += d.enganches ? ENGANCHES : 0;
  p += d.cremallera && d.tamano !== '30x40' ? CREMALLERA : 0;
  return Math.round(p * 100) / 100;
}
