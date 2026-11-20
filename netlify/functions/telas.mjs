import { json, stripeGet, stripePost, modalidadDePago, sesion, MODALIDADES, TELAS } from './_shared.mjs';

/* Guarda las telas elegidas después de pagar.
   1) Comprueba en Stripe que la sesión está pagada.
   2) Guarda la elección en el pago (metadata del PaymentIntent), para verla en admin.html.
   3) La envía a la hoja de Google (Apps Script) si está configurada la variable TELAS_SHEET_URL.
   Entrada: { sesion, bolsos: [{ tapa, base, notas }] }  (un bolso por plaza pagada) */
export default async (req) => {
  try {
    if (req.method !== 'POST') return json({ error: 'METODO_NO_PERMITIDO' }, 405);
    if (!process.env.STRIPE_SECRET_KEY) return json({ error: 'STRIPE_NO_CONFIGURADO' }, 503);
    const body = await req.json().catch(() => ({}));
    const id = String(body.sesion || '');
    if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return json({ error: 'SESION_INVALIDA' }, 400);

    let s;
    try { s = await stripeGet(`checkout/sessions/${encodeURIComponent(id)}`); }
    catch { return json({ error: 'SESION_INVALIDA' }, 400); }
    if (s.payment_status !== 'paid') return json({ error: 'NO_PAGADO' }, 402);

    const personas = Number(s.metadata?.personas || 0);
    const bolsos = Array.isArray(body.bolsos) ? body.bolsos : [];
    if (!personas || bolsos.length !== personas) return json({ error: 'FALTAN_BOLSOS' }, 400);
    const limpios = [];
    for (const b of bolsos) {
      if (!TELAS[b?.tapa] || !TELAS[b?.base]) return json({ error: 'FALTAN_TELAS' }, 400);
      limpios.push({ tapa: TELAS[b.tapa], base: TELAS[b.base], notas: String(b.notas || '').trim().slice(0, 400) });
    }

    // 2) Guardar en Stripe (máx. 500 caracteres por valor)
    const piId = typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id;
    if (piId) {
      const metadata = { telas_ok: '1' };
      limpios.forEach((b, i) => {
        metadata[`telas_${i + 1}`] = `Tapa: ${b.tapa} · Base: ${b.base}`;
        metadata[`notas_${i + 1}`] = b.notas || '';
      });
      await stripePost(`payment_intents/${piId}`, { metadata });
    }

    // 3) Enviar a la hoja de Google (una fila por bolso)
    const sheetUrl = process.env.TELAS_SHEET_URL || '';
    if (sheetUrl) {
      const fecha = s.metadata?.fecha || '';
      const modalidad = modalidadDePago(s.metadata);
      const payload = {
        secreto: process.env.TELAS_SHEET_SECRET || '',
        origen: 'web',
        taller: fecha,
        modalidad: MODALIDADES[modalidad].nombre,
        horario: (fecha && sesion(fecha, modalidad)?.horario) || s.metadata?.hora || '',
        nombre: s.metadata?.nombre || '',
        email: s.customer_email || s.customer_details?.email || '',
        pago: piId || '',
        bolsos: limpios.map((b, i) => ({ bolso: i + 1, ...b }))
      };
      try {
        const r = await fetch(sheetUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), redirect: 'follow' });
        const res = await r.json().catch(() => null);
        if (!r.ok || !res?.ok) console.error('Hoja de telas no guardó:', r.status, res?.error || 'respuesta no válida');
      } catch (e) { console.error('Hoja de telas falló:', e.message); }
    }

    return json({ ok: true });
  } catch (e) {
    console.error('telas:', e.message);
    return json({ error: 'ERROR_INTERNO' }, 500);
  }
};
export const config = { path: '/api/telas' };
