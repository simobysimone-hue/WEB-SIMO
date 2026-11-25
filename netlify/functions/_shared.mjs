// Lógica compartida de las funciones SIMO para Netlify (sin estado local:
// Stripe es la fuente de verdad de reservas, plazas e idempotencia de correo).
import nodemailer from 'nodemailer';

export const MIN_DATE = '2026-10-23';
export const MAX_DATE = '2026-12-31';

/* ---- Modalidades y calendario ----
   Desde el 20/11/2026 hay dos modalidades:
   - Crea tu SIMO: sábados 16:00–20:00, 4 h, 74,99 €, 8 plazas.
   - Customiza tu SIMO: viernes 17:00–19:30 y sábados 11:30–14:00, 2 h 30 min, 54,99 €, 20 plazas.
   Antes del 20/11 se mantiene el formato antiguo (Crea tu SIMO, 17:00–20:00, 54,99 €). */
export const CAMBIO = '2026-11-20';
export const SIN_TALLER = ['2026-12-25'];
/* Sesiones cerradas a mano para nuevas reservas (salen como completas). */
export const CERRADAS = ['2026-10-31', '2026-11-13', '2026-11-14', '2026-11-20', '2026-11-21'];
export const MODALIDADES = {
  crea: { nombre: 'Crea tu SIMO' },
  customiza: { nombre: 'Customiza tu SIMO' }
};

/* Telas que se pueden elegir para la tapa y la base (mismas que en telas.html). */
export const TELAS = {
  'negra': 'Negra', 'turquesa': 'Turquesa', 'marron': 'Marrón', 'beige': 'Beige',
  'roja-oscura': 'Roja oscura', 'plateada': 'Plateada',
  'serpiente-dorada': 'Serpiente dorada', 'serpiente': 'Serpiente', 'vaca': 'Vaca'
};

export function lugarDe(fecha) {
  const dow = new Date(fecha + 'T12:00:00').getDay();
  return dow === 6
    ? 'Casa de las Alajas · entrada por C/ San Martín 5, Madrid'
    : 'Casa de las Alajas · entrada por C/ Hileras 18, Madrid';
}

/* Sesiones de un día (sin comprobar si es pasado). */
export function sesionesDe(fecha) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return [];
  if (fecha < MIN_DATE || fecha > MAX_DATE || SIN_TALLER.includes(fecha)) return [];
  const dow = new Date(fecha + 'T12:00:00').getDay();
  if (fecha < CAMBIO) {
    if (dow !== 5 && dow !== 6) return [];
    return [{ modalidad: 'crea', hora: '17:00', horario: '17:00–20:00', duracion: '3 h', precio: 5499, capacidad: 8 }];
  }
  const out = [];
  // Viernes: Customiza 17:00–19:30. Sábados: Customiza 11:30–14:00 y Crea 16:00–20:00.
  if (dow === 5) out.push({ modalidad: 'customiza', hora: '17:00', horario: '17:00–19:30', duracion: '2 h 30 min', precio: 5499, capacidad: 20 });
  if (dow === 6) {
    out.push({ modalidad: 'customiza', hora: '11:30', horario: '11:30–14:00', duracion: '2 h 30 min', precio: 5499, capacidad: 20 });
    out.push({ modalidad: 'crea', hora: '16:00', horario: '16:00–20:00', duracion: '4 h', precio: 7499, capacidad: 8 });
  }
  return out;
}

export function sesion(fecha, modalidad) {
  return sesionesDe(fecha).find(s => s.modalidad === modalidad) || null;
}

/* Modalidad de un pago. Los pagos antiguos no la guardan: hasta el 19/11 eran Crea tu SIMO;
   las reservas antiguas de diciembre se cuentan en la sesión de tarde (Customiza) de ese día. */
export function modalidadDePago(meta) {
  if (meta?.modalidad === 'crea' || meta?.modalidad === 'customiza') return meta.modalidad;
  return (meta?.fecha || '') < CAMBIO ? 'crea' : 'customiza';
}

const KEY = () => process.env.STRIPE_SECRET_KEY || '';

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export function isValidWorkshopDate(s, modalidad) {
  const ses = sesion(String(s || ''), modalidad);
  if (!ses || CERRADAS.includes(s)) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(s + 'T12:00:00') >= today;
}

export async function stripePost(endpoint, params) {
  const body = new URLSearchParams();
  const add = (k, v) => {
    if (v == null) return;
    if (typeof v === 'object') { for (const [k2, v2] of Object.entries(v)) add(`${k}[${k2}]`, v2); return; }
    body.append(k, String(v));
  };
  Object.entries(params).forEach(([k, v]) => add(k, v));
  const res = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY()}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Stripe HTTP ${res.status}`);
  return data;
}

export async function stripeGet(endpoint) {
  const res = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
    headers: { Authorization: `Bearer ${KEY()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Stripe HTTP ${res.status}`);
  return data;
}

/* Todos los cobros válidos de Stripe (pagados y sin devolución), recorriendo todas las páginas.
   Cada elemento trae { ch, pi }: el cobro y su PaymentIntent con la metadata. */
export async function cobrosValidos() {
  const lista = [], vistos = new Set();
  let cursor = '';
  do {
    const r = await stripeGet(`charges?limit=100&expand[]=data.payment_intent${cursor ? `&starting_after=${cursor}` : ''}`);
    const datos = r.data || [];
    for (const ch of datos) {
      if (ch.status !== 'succeeded' || ch.amount_refunded) continue;
      const pi = ch.payment_intent;
      if (!pi?.id || vistos.has(pi.id)) continue;
      vistos.add(pi.id);
      lista.push({ ch, pi });
    }
    cursor = r.has_more && datos.length ? datos[datos.length - 1].id : '';
  } while (cursor);
  return lista;
}

/* Plazas reservadas de una sesión (fecha + modalidad).
   Si Stripe falla, el error sube a propósito: mejor no vender que vender una plaza que no existe. */
export async function plazasReservadas(fecha, modalidad) {
  let total = 0;
  for (const { pi } of await cobrosValidos()) {
    if (pi.metadata?.fecha !== fecha) continue;
    if (modalidadDePago(pi.metadata) !== modalidad) continue;
    total += Number(pi.metadata?.personas || 0);
  }
  return total;
}

/* Correo de confirmación (solo se envía una vez: marca el PI con emailed=1) */
const MAIL_USER = process.env.GMAIL_USER || '';
const MAIL_PASS = process.env.GMAIL_APP_PASSWORD || '';
const mailer = MAIL_USER && MAIL_PASS
  ? nodemailer.createTransport({ service: 'gmail', auth: { user: MAIL_USER, pass: MAIL_PASS } })
  : null;

const escHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Pedido de bolsos pagado: correo a SIMO con los diseños y la dirección, y confirmación a quien compra.
   Se envía una sola vez (marca el pago con emailed=1). */
export async function enviarPedidoBolsos({ session, piId }) {
  if (!mailer) { console.log('Email de pedido omitido: falta GMAIL_APP_PASSWORD'); return false; }
  let pi = {};
  if (piId) { try { pi = await stripeGet(`payment_intents/${piId}`); if (pi.metadata?.emailed === '1') return false; } catch {} }
  const m = session.metadata || {}, n = Number(m.bolsos || 0), sh = pi.shipping || {}, a = sh.address || {};
  const email = session.customer_email || session.customer_details?.email || '';
  const total = ((session.amount_total || 0) / 100).toFixed(2).replace('.', ',');
  const bolsos = [...Array(n).keys()].map(i => [m[`b${i + 1}`], m[`b${i + 1}_detalle`], m[`b${i + 1}_nota`] ? `Nota: ${m[`b${i + 1}_nota`]}` : ''].filter(Boolean).join('\n   '));
  const direccion = [sh.name, a.line1, `${a.postal_code || ''} ${a.city || ''}`.trim(), a.state, a.country, sh.phone ? `Tel. ${sh.phone}` : ''].filter(Boolean).join('\n');
  const texto = `Pedido pagado (${total} EUR) · zona ${m.zona || ''}\n\nBOLSOS\n${bolsos.map((b, i) => `${i + 1}. ${b}`).join('\n')}\n\nENVIAR A\n${direccion}\n\nEmail: ${email}\nPago Stripe: ${piId || session.id}`;
  // Fotos de los diseños guardadas al crear el pago (Netlify Blobs): van dentro del correo y como adjuntos.
  let fotos = [];
  try { const { getStore } = await import('@netlify/blobs'); fotos = ((await getStore('pedidos').get(session.id, { type: 'json' })) || {}).fotos || []; }
  catch (e) { console.error('No se pudieron leer las fotos del pedido:', e.message); }
  const attachments = [];
  fotos.forEach((f, i) => { if (f) attachments.push({ filename: `bolso-${i + 1}.jpg`, content: f.split(',')[1], encoding: 'base64', contentType: 'image/jpeg', cid: `bolso${i + 1}@simo` }); });
  const html = `<div style="font-family:Arial,sans-serif;color:#111;max-width:640px">
    <h2 style="margin:0 0 6px">Nuevo pedido pagado · ${escHtml(total)} €</h2><p style="margin:0 0 16px;color:#555">Zona de envío: ${escHtml(m.zona || '')}</p>
    ${bolsos.map((b, i) => `<div style="border:1px solid #ddd;border-radius:8px;padding:12px;margin:0 0 12px">
      <p style="margin:0 0 8px"><b>Bolso ${i + 1}</b><br>${escHtml(b).replace(/\n\s*/g, '<br>')}</p>
      ${fotos[i] ? `<img src="cid:bolso${i + 1}@simo" alt="Diseño del bolso ${i + 1}" style="width:100%;max-width:600px;border-radius:6px;display:block">` : '<p style="color:#999">(sin foto del diseño)</p>'}</div>`).join('')}
    <h3 style="margin:18px 0 6px">Enviar a</h3><p style="margin:0">${escHtml(direccion).replace(/\n/g, '<br>')}</p>
    <p style="color:#555;margin-top:14px">Email: ${escHtml(email)}<br>Pago Stripe: ${escHtml(piId || session.id)}</p></div>`;
  await mailer.sendMail({ from: `"SIMO web" <${MAIL_USER}>`, to: MAIL_USER, replyTo: email || undefined, subject: `Nuevo pedido de bolsos · ${sh.name || email}`, text: texto, html, attachments });
  if (email) await mailer.sendMail({ from: `"SIMO" <${MAIL_USER}>`, to: email, subject: 'Tu pedido SIMO está confirmado',
    text: `Hola ${sh.name || ''}:\n\nHemos recibido tu pedido y el pago (${total} EUR). Cada bolso se hace a mano: tardaremos de 3 a 7 días y te avisaremos cuando salga.\n\nEnvío a:\n${direccion}\n\nGracias por elegir SIMO.\nSIMO · Madrid` });
  if (piId) { try { await stripePost(`payment_intents/${piId}`, { metadata: { emailed: '1' } }); } catch {} }
  return true;
}

export async function enviarConfirmacion({ session, piId, origin }) {
  if (!mailer) { console.log('Email omitido: falta GMAIL_APP_PASSWORD'); return false; }
  if (piId) {
    try {
      const pi = await stripeGet(`payment_intents/${piId}`);
      if (pi.metadata?.emailed === '1') return false; // ya enviado
    } catch { /* seguimos */ }
  }
  const fecha = session.metadata?.fecha;
  const personas = Number(session.metadata?.personas || 0);
  const nombre = session.metadata?.nombre || '';
  const email = session.customer_email || session.customer_details?.email || '';
  if (!fecha || !email) return false;
  const d = new Date(fecha + 'T12:00:00');
  const fechaLarga = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  const modalidad = modalidadDePago(session.metadata);
  const ses = sesion(fecha, modalidad) || { horario: session.metadata?.hora || '', precio: 0 };
  const taller = MODALIDADES[modalidad].nombre;
  const WORKSHOP_HOURS = ses.horario;
  const LUGAR = lugarDe(fecha);
  const total = ((session.amount_total ?? personas * ses.precio) / 100).toFixed(2).replace('.', ',');
  const incluye = modalidad === 'customiza'
    ? 'Incluye todos los materiales necesarios, además de vino ilimitado y picoteo.'
    : 'Todo incluido: materiales, máquinas, guías, patrones, vino ilimitado y picoteo.';
  // Enlace para elegir (o revisar) las telas, por si se cerró la página después de pagar.
  const base = origin || process.env.PUBLIC_URL || process.env.URL || '';
  const telasUrl = base && session.id ? `${base}/telas.html?sesion=${encodeURIComponent(session.id)}` : '';
  const telasTxt = telasUrl ? `\n\nSi aún no has elegido las telas de tu bolso, hazlo aquí: ${telasUrl}` : '';
  const telasHtml = telasUrl ? `<p style="font-size:14px">Si aún no has elegido las telas de tu bolso, <a href="${escHtml(telasUrl)}" style="color:#5E1727">hazlo aquí</a>.</p>` : '';
  const nombreHtml = escHtml(nombre);
  await mailer.sendMail({
    from: `"SIMO" <${MAIL_USER}>`,
    to: email,
    subject: 'Tu plaza en el taller SIMO está confirmada',
    replyTo: MAIL_USER,
    text: `Hola ${nombre}:\n\nTu plaza está confirmada.\n\nTaller: ${taller}\nFecha: ${fechaLarga}\nHorario: ${WORKSHOP_HOURS}\nLugar: ${LUGAR}\nPlazas: ${personas}\nTotal pagado: ${total} EUR\n\n${incluye}${telasTxt}\n\nNos vemos en el taller.\nSIMO · Madrid`,
    html: `<div style="font-family:Georgia,serif;color:#101012;max-width:520px;margin:auto;padding:32px"><h1 style="font-size:26px;letter-spacing:.04em">SIMO</h1><p>Hola ${nombreHtml}:</p><p><strong>Tu plaza está confirmada.</strong></p><table style="font-size:15px;line-height:1.7"><tr><td>Taller</td><td>&nbsp;&nbsp;<strong>${taller}</strong></td></tr><tr><td>Fecha</td><td>&nbsp;&nbsp;<strong>${fechaLarga}</strong></td></tr><tr><td>Horario</td><td>&nbsp;&nbsp;${WORKSHOP_HOURS}</td></tr><tr><td>Lugar</td><td>&nbsp;&nbsp;${LUGAR}</td></tr><tr><td>Plazas</td><td>&nbsp;&nbsp;${personas}</td></tr><tr><td>Total pagado</td><td>&nbsp;&nbsp;<strong>${total} EUR</strong></td></tr></table><p style="font-size:14px;color:#555">${incluye}</p>${telasHtml}<p style="font-size:14px">Nos vemos en el taller.<br><em>SIMO · Madrid</em></p></div>`
  });
  if (piId) {
    try { await stripePost(`payment_intents/${piId}`, { metadata: { emailed: '1' } }); } catch {}
  }
  console.log(`Email enviado a ${email}`);
  return true;
}
