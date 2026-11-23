import { json, stripeGet, enviarConfirmacion, modalidadDePago, sesion, MODALIDADES } from './_shared.mjs';

export default async (req) => {
  try {
    const id = new URL(req.url).searchParams.get('id') || '';
    if (!process.env.STRIPE_SECRET_KEY || !id) return json({ estado: 'desconocido' });
    let s;
    try { s = await stripeGet(`checkout/sessions/${encodeURIComponent(id)}`); }
    catch { return json({ estado: 'desconocido' }); }
    const piId = typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id;
    let telas = false;
    if (s.payment_status === 'paid') {
      await enviarConfirmacion({ session: s, piId, origin: new URL(req.url).origin }).catch(e => console.error('Email falló:', e.message));
      if (piId) {
        try { telas = (await stripeGet(`payment_intents/${piId}`)).metadata?.telas_ok === '1'; } catch {}
      }
    }
    const fecha = s.metadata?.fecha || null;
    const modalidad = modalidadDePago(s.metadata);
    // Solo datos de la reserva (sin email): sirven para pintar las páginas de telas y de confirmación.
    return json({
      estado: s.payment_status,
      fecha,
      personas: Number(s.metadata?.personas || 0),
      modalidad,
      taller: MODALIDADES[modalidad].nombre,
      horario: (fecha && sesion(fecha, modalidad)?.horario) || s.metadata?.hora || '',
      nombre: String(s.metadata?.nombre || '').split(' ')[0],
      importe: s.payment_status === 'paid' ? (s.amount_total || 0) / 100 : 0,
      telas
    });
  } catch (e) {
    console.error('confirmar:', e.message);
    return json({ estado: 'desconocido' });
  }
};
export const config = { path: '/api/confirmar' };
