import crypto from 'node:crypto';
import { cobrosValidos, json, modalidadDePago, MODALIDADES } from './_shared.mjs';

export default async (req) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) return json({ error: 'Stripe no configurado' }, 503);
    // Validar contraseña en el header 'x-admin-pass'
    const pass = req.headers.get('x-admin-pass') || '';
    // La contraseña solo vive en Netlify (variable ADMIN_PASSWORD), nunca en el código.
    const admin = process.env.ADMIN_PASSWORD || '';
    if (!admin) return json({ error: 'ADMIN_NO_CONFIGURADO' }, 503);
    // Comparación que tarda lo mismo acierte o no, y una pausa al fallar, para frenar a quien pruebe contraseñas.
    const huella = v => crypto.createHash('sha256').update(String(v)).digest();
    if (!crypto.timingSafeEqual(huella(pass), huella(admin))) {
      await new Promise(r => setTimeout(r, 1000));
      return json({ error: 'NO_AUTORIZADO' }, 401);
    }

    const data = [];
    for (const { ch, pi } of await cobrosValidos()) {
      if (!pi.metadata?.fecha) continue;
      const piId = pi.id;
      const created = new Date((pi.created || ch.created) * 1000);
      data.push({
        id: piId,
        fecha: pi.metadata.fecha,
        modalidad: MODALIDADES[modalidadDePago(pi.metadata)].nombre,
        hora: pi.metadata.hora || '',
        personas: Number(pi.metadata.personas || 0),
        nombre: pi.metadata.nombre || '',
        email: pi.customer_email || pi.receipt_email || ch.billing_details?.email || '',
        importe: ch.amount / 100,
        origen: [pi.metadata.origen, pi.metadata.anuncio].filter(Boolean).join(' · '),
        telas: Object.keys(pi.metadata).filter(k => /^telas_\d+$/.test(k)).sort()
          .map(k => { const n = k.split('_')[1]; const notas = pi.metadata['notas_' + n]; return `Bolso ${n}: ${pi.metadata[k]}${notas ? ' (' + notas + ')' : ''}`; })
          .join(' | '),
        creado: created.toISOString(),
        cuando: created.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
      });
    }
    data.sort((a, b) => (a.fecha + a.creado).localeCompare(b.fecha + b.creado));
    return json({
      total: data.length,
      plazas: data.reduce((s, r) => s + r.personas, 0),
      ingresos: data.reduce((s, r) => s + r.importe, 0),
      reservas: data
    });
  } catch (e) {
    console.error('admin:', e.message);
    return json({ error: 'ERROR_INTERNO' }, 500);
  }
};
// Límite por persona (IP): 10 intentos por minuto.
export const config = { path: '/api/admin/reservas', rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
