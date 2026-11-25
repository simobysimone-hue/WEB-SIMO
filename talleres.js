'use strict';
/* Reserva de talleres SIMO by YOU.
   Calendario, personas y total en el navegador; las plazas libres y el pago los da el servidor:
   - GET  /api/disponibilidad  -> plazas ya reservadas por fecha y taller (Stripe)
   - POST /api/checkout        -> crea el pago en Stripe y devuelve la URL de pago
   Las fechas y precios deben coincidir con netlify/functions/_shared.mjs. */

const MIN_DATE = '2026-10-23';
const MAX_DATE = '2026-12-31';
const CAMBIO = '2026-11-20';
const SIN_TALLER = ['2026-12-25'];
const CERRADAS = ['2026-10-31', '2026-11-13', '2026-11-14', '2026-11-20', '2026-11-21']; // cerradas a mano: salen como completas
const MODALIDADES = {
  crea: { nombre: 'Crea tu SIMO', leyenda: 'Crea tu SIMO: sábados de 16:00 a 20:00 · grupos de 8' },
  customiza: { nombre: 'Customiza tu SIMO', leyenda: 'Customiza tu SIMO: viernes de 17:00 a 19:30 y sábados de 11:30 a 14:00 · grupos de 20' }
};
const PRECIO_BASE = { crea: 7499, customiza: 5499 };

/* Black Friday: 20 % en las reservas pagadas del 26 al 29 de noviembre (hora de Madrid).
   Debe coincidir con OFERTA y OFERTA_TALLERES de precios.mjs. El precio de verdad lo calcula el servidor.
   Fuera de la web real se puede ver antes de tiempo con ?probar-oferta (solo con Stripe de prueba). */
const BF = { desde: '2026-11-26', hasta: '2026-11-29', descuento: 0.20 };
const BF_PRUEBA = (() => {
  try {
    if (location.hostname === 'simoby.netlify.app') return false;
    if (new URLSearchParams(location.search).has('probar-oferta')) sessionStorage.setItem('simo-probar-oferta', '1');
    return sessionStorage.getItem('simo-probar-oferta') === '1';
  } catch (e) { return false; }
})();
const BF_ON = (() => {
  const hoy = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  return (hoy >= BF.desde && hoy <= BF.hasta) || BF_PRUEBA;
})();
const precioFinal = centimos => BF_ON ? Math.round(centimos * (1 - BF.descuento)) : centimos;
const CAPACIDAD_BASE = { crea: 8, customiza: 20 };

function sesionesDe(fecha) {
  if (fecha < MIN_DATE || fecha > MAX_DATE || SIN_TALLER.includes(fecha)) return [];
  const dow = new Date(fecha + 'T12:00:00').getDay();
  if (fecha < CAMBIO) {
    if (dow !== 5 && dow !== 6) return [];
    return [{ modalidad: 'crea', hora: '17:00', horario: '17:00–20:00', precio: 5499, capacidad: 8 }];
  }
  const out = [];
  // Viernes: Customiza 17:00–19:30. Sábados: Customiza 11:30–14:00 y Crea 16:00–20:00.
  if (dow === 5) out.push({ modalidad: 'customiza', hora: '17:00', horario: '17:00–19:30', precio: 5499, capacidad: 20 });
  if (dow === 6) {
    out.push({ modalidad: 'customiza', hora: '11:30', horario: '11:30–14:00', precio: 5499, capacidad: 20 });
    out.push({ modalidad: 'crea', hora: '16:00', horario: '16:00–20:00', precio: 7499, capacidad: 8 });
  }
  return out;
}
const sesion = (fecha, mod) => sesionesDe(fecha).find(x => x.modalidad === mod) || null;
const entradaDe = fecha => new Date(fecha + 'T12:00:00').getDay() === 6 ? 'C/ San Martín 5' : 'C/ Hileras 18';

const money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const fmtLong = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
const monthNames = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const $ = id => document.getElementById(id);

const today = new Date(); today.setHours(0, 0, 0, 0);
const nowY = today.getFullYear(), nowM = today.getMonth();
let monthOffset = 0;
let selectedDate = null;
let modalidad = 'crea';
let availability = {}; // 'YYYY-MM-DD|modalidad' -> plazas ya reservadas

function libres(fecha, mod = modalidad) {
  const ses = sesion(fecha, mod);
  if (!ses || CERRADAS.includes(fecha)) return 0;
  return Math.max(0, ses.capacidad - (availability[fecha + '|' + mod] || 0));
}

async function fetchAvailability(from, to) {
  try {
    const res = await fetch(`/api/disponibilidad?desde=${from}&hasta=${to}`);
    if (!res.ok) return;
    const rows = await res.json();
    rows.forEach(r => {
      const mod = r.modalidad || (r.fecha < CAMBIO ? 'crea' : 'customiza');
      availability[r.fecha + '|' + mod] = r.reservadas;
    });
    if (selectedDate) selectDate(selectedDate); else renderCalendar();
  } catch { /* sin servidor: el calendario se ve igual, el servidor vuelve a comprobar al pagar */ }
}

function renderCalendar() {
  const base = new Date(nowY, nowM + monthOffset, 1);
  const y = base.getFullYear(), m = base.getMonth();
  $('month-label').textContent = monthNames.format(base);
  const days = $('calendar-days');
  days.replaceChildren();
  const firstDow = (new Date(y, m, 1).getDay() + 6) % 7; // lunes = 0
  for (let i = 0; i < firstDow; i++) days.append(Object.assign(document.createElement('span'), { ariaHidden: 'true' }));
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const key = iso(y, m, d);
    const past = new Date(y, m, d) < today;
    const ses = sesion(key, modalidad);
    const workshop = !!ses && !past;
    const free = libres(key);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = String(d);
    if (workshop && free > 0) {
      btn.className = 'available' + (selectedDate === key ? ' selected' : '');
      btn.setAttribute('aria-label', `${fmtLong.format(new Date(y, m, d))}, ${ses.horario}, ${free} plazas libres`);
      btn.addEventListener('click', () => selectDate(key));
    } else {
      btn.disabled = true;
      btn.className = workshop ? 'full' : '';
      if (workshop) btn.setAttribute('aria-label', `${fmtLong.format(new Date(y, m, d))}, completo`);
    }
    days.append(btn);
  }
  const [maxY, maxM] = MAX_DATE.split('-').map(Number);
  const lastOffset = (maxY - nowY) * 12 + (maxM - 1) - nowM;
  $('prev-month').disabled = monthOffset === 0;
  $('next-month').disabled = monthOffset >= Math.max(0, lastOffset);
}

function selectDate(key) {
  const ses = sesion(key, modalidad);
  if (!ses || libres(key) <= 0) { clearDate(); return; }
  selectedDate = key;
  const free = libres(key);
  $('date-selection').textContent = `${MODALIDADES[modalidad].nombre} · ${fmtLong.format(new Date(key + 'T12:00:00'))} · ${ses.horario} · Casa de las Alajas, entrada por ${entradaDe(key)} · quedan ${free} ${free === 1 ? 'plaza' : 'plazas'}`;
  fillPeople(free);
  $('spots-note').hidden = false;
  $('spots-note').textContent = `Máximo ${free} ${free === 1 ? 'plaza' : 'plazas'} en esta sesión.`;
  updateTotal();
  renderCalendar();
}

function clearDate() {
  selectedDate = null;
  $('date-selection').textContent = 'Elige un día marcado en el calendario.';
  $('spots-note').hidden = true;
  fillPeople(CAPACIDAD_BASE[modalidad]);
  updateTotal();
  renderCalendar();
}

const people = $('people');
function fillPeople(max) {
  const prev = Number(people.value) || 1;
  people.replaceChildren();
  for (let i = 1; i <= Math.max(1, max); i++) {
    people.append(new Option(`${i} ${i === 1 ? 'persona' : 'personas'}`, String(i)));
  }
  people.value = String(Math.min(prev, Math.max(1, max)));
}
function updateTotal() {
  const ses = selectedDate && sesion(selectedDate, modalidad);
  const base = ses ? ses.precio : PRECIO_BASE[modalidad], n = Number(people.value || 1);
  const total = money.format(n * precioFinal(base) / 100);
  $('total').textContent = total;
  $('pay-total').textContent = total;
  const antes = $('total-antes');
  if (antes) { antes.hidden = !BF_ON; antes.textContent = money.format(n * base / 100); }
}

function setModalidad(mod) {
  modalidad = mod === 'customiza' ? 'customiza' : 'crea';
  document.querySelectorAll('input[name="modalidad"]').forEach(r => { r.checked = r.value === modalidad; });
  $('legend-text').textContent = MODALIDADES[modalidad].leyenda;
  if (selectedDate && libres(selectedDate) > 0) selectDate(selectedDate); else clearDate();
}

let toastTimer = null;
function showToast(msg, ms = 7000) {
  const t = $('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, ms);
}

const ERRORES = {
  STRIPE_NO_CONFIGURADO: 'El pago todavía no está activado: falta configurar la cuenta de Stripe.',
  SIN_PLAZAS: 'Esa sesión ya no tiene plazas suficientes. Elige otra.',
  FECHA_INVALIDA: 'Esa fecha ya no está disponible. Elige otra.',
  PERSONAS_INVALIDAS: 'Revisa el número de personas.',
  NOMBRE_INVALIDO: 'Escribe tu nombre.',
  EMAIL_INVALIDO: 'Revisa el email.',
  LOCAL: 'Estás en la copia local (localhost): aquí no se puede pagar. En la web publicada este botón lleva al pago con Stripe.'
};

$('prev-month').addEventListener('click', () => { if (monthOffset > 0) { monthOffset--; renderCalendar(); } });
$('next-month').addEventListener('click', () => { monthOffset++; renderCalendar(); });
$('people-minus').addEventListener('click', () => { people.value = String(Math.max(1, Number(people.value) - 1)); updateTotal(); });
$('people-plus').addEventListener('click', () => { people.value = String(Math.min(people.options.length, Number(people.value) + 1)); updateTotal(); });
people.addEventListener('change', updateTotal);
document.querySelectorAll('input[name="modalidad"]').forEach(r => r.addEventListener('change', () => setModalidad(r.value)));
document.querySelectorAll('[data-reservar]').forEach(a => a.addEventListener('click', () => setModalidad(a.dataset.reservar)));

$('booking-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!selectedDate) { showToast('Elige un día en el calendario primero.'); return; }
  const nombre = $('name').value.trim();
  const email = $('email').value.trim();
  if (nombre.length < 2) { showToast(ERRORES.NOMBRE_INVALIDO); $('name').focus(); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast(ERRORES.EMAIL_INVALIDO); $('email').focus(); return; }
  const btn = $('pay-button');
  btn.disabled = true;
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fecha: selectedDate, modalidad, personas: Number(people.value), nombre, email, probarOferta: BF_PRUEBA, ...(window.simoOrigen ? window.simoOrigen() : {}) })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) throw new Error(data.error || 'No se ha podido iniciar el pago.');
    // Estadísticas: inicio del pago (Umami sin cookies; Meta solo si se aceptaron las cookies)
    const ses = sesion(selectedDate, modalidad);
    const importe = Number(people.value) * precioFinal(ses ? ses.precio : PRECIO_BASE[modalidad]) / 100;
    if (window.simoUmami) window.simoUmami('Reservar y pagar', { modalidad, personas: Number(people.value), importe });
    if (window.simoTrack) window.simoTrack('InitiateCheckout', { value: importe, currency: 'EUR', num_items: Number(people.value), content_ids: [modalidad], content_type: 'product' });
    setTimeout(() => { window.location.href = data.url; }, 300);
  } catch (err) {
    if (err.message === 'LOCAL') {
      // Copia local: no hay Stripe. Se simula el pago y se pasa a elegir telas, para ver el recorrido.
      const ses = sesion(selectedDate, modalidad);
      const q = new URLSearchParams({ demo: '1', personas: people.value, fecha: selectedDate, modalidad, horario: ses ? ses.horario : '' });
      showToast('Pago simulado (localhost): no se cobra nada. Pasando a elegir telas…', 2500);
      setTimeout(() => { location.href = 'telas.html?' + q; }, 1500);
      return;
    }
    showToast(ERRORES[err.message] ||'No se ha podido iniciar el pago. Inténtalo de nuevo o escríbenos.');
    if (err.message === 'SIN_PLAZAS') fetchAvailability(iso(nowY, nowM, 1), MAX_DATE);
    btn.disabled = false;
  }
});

if (BF_ON) { const banda = $('oferta-banda'); if (banda) banda.hidden = false; }
setModalidad(new URLSearchParams(location.search).get('taller') === 'customiza' ? 'customiza' : 'crea');
fetchAvailability(iso(nowY, nowM, 1), MAX_DATE);
