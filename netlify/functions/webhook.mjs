import crypto from 'node:crypto';
import { json, stripeGet, enviarConfirmacion, enviarPedidoBolsos } from './_shared.mjs';

export default async (req) => {
  try {
    const raw = await req.text();
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
    const sig = req.headers.get('stripe-signature') || '';
    // Sin el secreto no se acepta nada: si no, cualquiera podría hacerse pasar por Stripe y mandar correos desde SIMO.
    if (!secret) {
      console.error('Webhook rechazado: falta STRIPE_WEBHOOK_SECRET en Netlify');
      return json({ error: 'WEBHOOK_NO_CONFIGURADO' }, 503);
    }
    const parts = {};
    for (const p of sig.split(',')) { const i = p.indexOf('='); if (i > 0 && !(p.slice(0, i) in parts)) parts[p.slice(0, i)] = p.slice(i + 1); }
    const expected = crypto.createHmac('sha256', secret).update(`${parts.t}.${raw}`).digest();
    const got = Buffer.from(parts.v1 || '', 'hex');
    if (!parts.t || expected.length !== got.length || !crypto.timingSafeEqual(expected, got)) {
      return json({ error: 'Firma inválida' }, 400);
    }
    // Avisos de más de 5 minutos: se rechazan para que no se puedan reenviar avisos antiguos.
    if (Math.abs(Date.now() / 1000 - Number(parts.t)) > 300) return json({ error: 'Aviso caducado' }, 400);
    let event;
    try { event = JSON.parse(raw); } catch { return json({ error: 'JSON inválido' }, 400); }
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object;
      const piId = typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id;
      if (s.metadata?.tipo === 'bolsos') await enviarPedidoBolsos({ session: s, piId }).catch(e => console.error('Email de pedido falló:', e.message));
      else await enviarConfirmacion({ session: s, piId, origin: new URL(req.url).origin }).catch(e => console.error('Email falló:', e.message));
    }
    return json({ received: true });
  } catch (e) {
    console.error('webhook:', e.message);
    return json({ error: 'ERROR_INTERNO' }, 500);
  }
};
export const config = { path: '/api/webhook' };
