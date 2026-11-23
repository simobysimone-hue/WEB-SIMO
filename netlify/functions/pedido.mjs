import { json, stripePost } from './_shared.mjs';
import { getStore } from '@netlify/blobs';
import { precioBolso, ENVIOS, zonaEnvio } from '../../precios.mjs';

/* Carrito de bolsos → pago en Stripe Checkout.
   El precio de cada bolso y el envío se calculan AQUÍ con la tarifa (precios.mjs), nunca con lo que mande el navegador.
   Entrada: { envio: {nombre,email,telefono,pais,direccion,cp,ciudad,provincia,acepto}, bolsos: [{ d, cantidad, notas, detalles }] } */
const corto = (v, n) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n);

export default async (req) => {
  try {
    if (req.method !== 'POST') return json({ error: 'METODO_NO_PERMITIDO' }, 405);
    if (!process.env.STRIPE_SECRET_KEY) return json({ error: 'STRIPE_NO_CONFIGURADO' }, 503);
    const body = await req.json().catch(() => ({}));
    const e = body.envio || {}, bolsos = Array.isArray(body.bolsos) ? body.bolsos : [];
    if (!bolsos.length || bolsos.length > 20) return json({ error: 'CARRITO_VACIO' }, 400);
    for (const k of ['nombre', 'email', 'telefono', 'pais', 'direccion', 'cp', 'ciudad']) if (!corto(e[k], 200)) return json({ error: 'FALTAN_DATOS_ENVIO' }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)) return json({ error: 'EMAIL_INVALIDO' }, 400);
    if (!e.acepto) return json({ error: 'FALTA_ACEPTAR' }, 400);

    const zona = zonaEnvio(e.pais, e.cp), envio = ENVIOS[zona];
    if (envio.precio == null) return json({ error: 'ENVIO_NO_CONFIGURADO' }, 400);

    // De qué anuncio viene el pedido (etiquetas utm_* del enlace): se guarda en Stripe, igual que en los talleres.
    const limpio = v => String(v || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 60);
    const ORIGEN = {};
    for (const k of ['origen', 'campana', 'anuncio']) if (limpio(body[k])) ORIGEN[k] = limpio(body[k]);

    const line_items = [], metadata = { tipo: 'bolsos', zona, bolsos: String(bolsos.length), ...ORIGEN };
    bolsos.forEach((b, i) => {
      const precio = precioBolso(b.d || {});               // lanza DISENO_INVALIDO si algo no existe
      const cantidad = Math.max(1, Math.min(10, parseInt(b.cantidad, 10) || 1));
      const d = b.d, medidas = d.tamano === 'ordenador' ? ` ${corto(d.medW, 5)}×${corto(d.medH, 5)} cm` : '';
      line_items.push({
        quantity: cantidad,
        price_data: { currency: 'eur', unit_amount: Math.round(precio * 100),
          product_data: { name: `Bolso SIMO · ${d.tamano === 'ordenador' ? 'Funda ordenador/iPad' + medidas : d.tamano.replace('x', ' × ') + ' cm'}` } }
      });
      // Diseño para Simone (Stripe admite 500 caracteres por dato)
      metadata[`b${i + 1}`] = corto([`${cantidad}×`, d.tamano + medidas, `tela:${d.tela}`, d.telaBase && d.telaBase !== 'igual' ? `base:${d.telaBase}` : '',
        d.cinta !== 'ninguna' ? `cinta:${d.cinta}(${d.cintaPos})` : '', d.flecos !== 'ninguno' ? `flecos:${d.flecos}(${d.flecosForma})` : '',
        (d.tachas || []).length ? `tachuelas:${d.tachas.length}` : '', d.enganches ? 'enganches' : '', d.cremallera ? 'cremallera' : '', `${precio}€`].filter(Boolean).join(' · '), 500);
      const det = (b.detalles || []).map(x => Array.isArray(x) ? `${x[0]}: ${x[1]}` : '').filter(Boolean).join(' | ');
      if (det) metadata[`b${i + 1}_detalle`] = corto(det, 500);
      if (b.notas) metadata[`b${i + 1}_nota`] = corto(b.notas, 300);
    });
    line_items.push({ quantity: 1, price_data: { currency: 'eur', unit_amount: Math.round(envio.precio * 100), product_data: { name: `Envío · ${envio.nombre}` } } });

    const origin = new URL(req.url).origin;
    const session = await stripePost('checkout/sessions', {
      mode: 'payment',
      success_url: `${origin}/pedido-ok.html?sesion={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/carrito.html`,
      customer_email: corto(e.email, 200),
      line_items,
      metadata,
      payment_intent_data: {
        metadata: { tipo: 'bolsos', zona, nombre: corto(e.nombre, 100), telefono: corto(e.telefono, 40), ...ORIGEN },
        shipping: { name: corto(e.nombre, 100), phone: corto(e.telefono, 40),
          address: { line1: corto(e.direccion, 200), postal_code: corto(e.cp, 20), city: corto(e.ciudad, 100), state: corto(e.provincia, 100), country: corto(e.pais, 2).toUpperCase() } }
      }
    });
    // Fotos de los diseños (para el correo de SIMO): se guardan en Netlify Blobs con el id del pago.
    const fotos = bolsos.map(b => typeof b.foto === 'string' && b.foto.startsWith('data:image/jpeg;base64,') && /^[A-Za-z0-9+/=]+$/.test(b.foto.slice(23)) && b.foto.length < 900000 ? b.foto : null);
    if (fotos.some(Boolean)) {
      try { await getStore('pedidos').setJSON(session.id, { fotos, creado: new Date().toISOString() }); }
      catch (e) { console.error('No se pudieron guardar las fotos del pedido:', e.message); }
    }
    return json({ url: session.url });
  } catch (err) {
    if (String(err.message).startsWith('DISENO_INVALIDO')) return json({ error: 'DISENO_INVALIDO' }, 400);
    console.error('pedido:', err.message);
    return json({ error: 'ERROR_INTERNO' }, 500);
  }
};
export const config = { path: '/api/pedido' };
