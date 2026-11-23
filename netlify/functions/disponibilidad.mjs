import { json, cobrosValidos, modalidadDePago } from './_shared.mjs';

export default async (req) => {
  try {
    const url = new URL(req.url);
    const desde = url.searchParams.get('desde') || '';
    const hasta = url.searchParams.get('hasta') || '';
    if (!process.env.STRIPE_SECRET_KEY) return json([]);

    // Todos los cobros válidos; los pedidos de bolsos no tienen fecha y se saltan.
    const rows = {};
    for (const { pi } of await cobrosValidos()) {
      const fecha = pi.metadata?.fecha;
      if (!fecha) continue;
      if (desde && fecha < desde) continue;
      if (hasta && fecha > hasta) continue;
      const key = fecha + '|' + modalidadDePago(pi.metadata);
      rows[key] = (rows[key] || 0) + Number(pi.metadata?.personas || 0);
    }
    return json(Object.entries(rows).map(([key, reservadas]) => {
      const [fecha, modalidad] = key.split('|');
      return { fecha, modalidad, reservadas };
    }));
  } catch (e) {
    console.error('disponibilidad:', e.message);
    return json([], 500);
  }
};
export const config = { path: '/api/disponibilidad' };
