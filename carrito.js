import { precioBolso, ENVIOS, zonaEnvio } from './precios.mjs';

/* Carrito de bolsos SIMO: se guarda en este navegador (localStorage) hasta que se paga. */
const CARRITO = 'simo-carrito';
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const eur = n => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: n % 1 ? 2 : 0 }).format(n);
const leer = () => { try { return JSON.parse(localStorage.getItem(CARRITO)) || []; } catch { return []; } };
const guardar = c => { try { localStorage.setItem(CARRITO, JSON.stringify(c)); } catch {} };

// Países: España primero, luego la UE y el resto (nombres en español).
const PAISES = ['ES', 'PT', 'FR', 'IT', 'DE', 'BE', 'NL', 'LU', 'IE', 'AT', 'DK', 'SE', 'FI', 'PL', 'CZ', 'SK', 'SI', 'HR', 'HU', 'RO', 'BG', 'GR', 'CY', 'MT', 'EE', 'LV', 'LT',
  'GB', 'CH', 'NO', 'IS', 'AD', 'MC', 'US', 'CA', 'MX', 'AR', 'CL', 'CO', 'PE', 'UY', 'BR', 'AU', 'NZ', 'JP', 'KR', 'SG', 'AE', 'IL', 'MA', 'ZA'];
const nombrePais = new Intl.DisplayNames(['es'], { type: 'region' });
$('pais').innerHTML = PAISES.map(c => `<option value="${c}">${nombrePais.of(c)}</option>`).join('');

function pintar() {
  const c = leer();
  $('vacio').hidden = c.length > 0; $('otro').hidden = !c.length; $('pago').hidden = !c.length;
  $('lista').innerHTML = c.map((it, i) => {
    let precio; try { precio = precioBolso(it.d); } catch { precio = null; }
    return `<article class="item">
      <div class="mini" aria-hidden="true">${it.svg || ''}</div>
      <div><h3>${esc(it.titulo)}</h3>
        <ul>${(it.lineas || []).slice(1).map(l => `<li>${esc(l)}</li>`).join('')}${(it.detalles || []).map(([n, v]) => `<li>${esc(n)}: ${esc(v)}</li>`).join('')}</ul>
        ${it.notas ? `<p class="nota">«${esc(it.notas)}»</p>` : ''}
        <div class="fila"><div class="cant"><button type="button" data-menos="${i}" aria-label="Uno menos">−</button><span>${it.cantidad}</span><button type="button" data-mas="${i}" aria-label="Uno más">+</button></div>
          <span class="precio">${precio === null ? 'Diseño no válido' : eur(precio * it.cantidad)}</span>
          <button type="button" class="quitar" data-quitar="${i}">Quitar</button></div>
      </div></article>`;
  }).join('');
  pintarTotales();
}

function pintarTotales() {
  const c = leer();
  const sub = c.reduce((s, it) => { try { return s + precioBolso(it.d) * it.cantidad; } catch { return s; } }, 0);
  const zona = zonaEnvio($('pais').value, $('cp').value), env = ENVIOS[zona];
  const precioEnvio = env.precio;
  $('totales').innerHTML = `<li><span>Bolsos (${c.reduce((s, i) => s + i.cantidad, 0)})</span><span>${eur(sub)}</span></li>
    <li><span>Envío · ${esc(env.nombre)}</span><span>${precioEnvio === null ? 'pendiente' : eur(precioEnvio)}</span></li>
    ${env.aduana ? '<li><span style="font-size:12px;color:#555">En Canarias, Ceuta, Melilla y fuera de la UE pueden cobrarse aduanas o impuestos al recibirlo.</span><span></span></li>' : ''}
    <li class="total"><span>Total</span><span>${eur(sub + (precioEnvio || 0))}</span></li>`;
  $('pagar').disabled = precioEnvio === null;
  if (precioEnvio === null) { $('aviso').textContent = 'Todavía no se puede pagar a esta zona: falta fijar el precio del envío.'; $('aviso').hidden = false; }
  else $('aviso').hidden = true;
}

document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const c = leer(), d = b.dataset;
  if (d.mas) { c[+d.mas].cantidad = Math.min(10, c[+d.mas].cantidad + 1); }
  else if (d.menos) { c[+d.menos].cantidad = Math.max(1, c[+d.menos].cantidad - 1); }
  else if (d.quitar) { c.splice(+d.quitar, 1); }
  else return;
  guardar(c); pintar();
});
$('pais').addEventListener('change', pintarTotales);
$('cp').addEventListener('input', pintarTotales);

$('pagar').addEventListener('click', async () => {
  const f = $('form'), datos = Object.fromEntries(new FormData(f));
  const faltan = ['nombre', 'email', 'telefono', 'direccion', 'cp', 'ciudad'].filter(k => !String(datos[k] || '').trim());
  const aviso = m => { $('aviso').textContent = m; $('aviso').hidden = false; };
  if (faltan.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email || '')) return aviso('Revisa los datos de envío: faltan campos o el email no es válido.');
  if (!datos.acepto) return aviso('Marca la casilla para confirmar que entiendes las condiciones del encargo.');
  const btn = $('pagar'); btn.disabled = true;
  try {
    const res = await fetch('/api/pedido', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ envio: datos, bolsos: leer().map(it => ({ d: it.d, cantidad: it.cantidad, notas: it.notas || '', detalles: it.detalles || [], foto: it.foto || null })) }) });
    const r = await res.json().catch(() => ({}));
    if (!res.ok || !r.url) throw new Error(r.error || 'ERROR');
    location.href = r.url;
  } catch (err) {
    const m = { LOCAL: 'Estás en la copia local (localhost): aquí no se puede pagar. En la web publicada este botón lleva al pago con Stripe.',
      STRIPE_NO_CONFIGURADO: 'El pago todavía no está activado.', ENVIO_NO_CONFIGURADO: 'Falta fijar el precio del envío a esta zona.',
      DISENO_INVALIDO: 'Algún bolso del carrito no es válido. Quítalo y vuelve a diseñarlo.' }[String(err.message).split(':')[0]];
    aviso(m || 'No se ha podido iniciar el pago. Inténtalo de nuevo o escríbenos a simobysimone@gmail.com.');
    btn.disabled = false;
  }
});

pintar();
