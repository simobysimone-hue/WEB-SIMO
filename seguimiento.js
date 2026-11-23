'use strict';
/* Seguimiento de SIMO: aviso de cookies + píxel de Meta + origen de cada visita.
   - El píxel de Meta solo se carga si la persona pulsa «Aceptar». Si rechaza o no responde, no se carga.
     La elección se guarda en localStorage (simo-consent = 'si' | 'no') y se cambia desde
     cualquier elemento con data-cookies («Preferencias de cookies» en el pie).
   - Umami (estadísticas sin cookies) se carga aparte, con su etiqueta en el <head> de cada página.
   - Las etiquetas utm_* del enlace del anuncio se guardan en sessionStorage para mandarlas
     a Stripe con la reserva, aunque la persona pase por otras páginas antes de pagar. */
(function () {
  const PIXEL_ID = '1837897990578065'; // Píxel SIMO Talleres (Administrador de eventos de Meta)
  const KEY = 'simo-consent';
  const cola = [];

  const leer = (k, s = localStorage) => { try { return s.getItem(k); } catch { return null; } };
  const guardar = (k, v, s = localStorage) => { try { s.setItem(k, v); } catch { /* modo privado */ } };

  /* ---- Origen (anuncio que trae la visita) ---- */
  const qs = new URLSearchParams(location.search);
  if (qs.get('utm_source')) {
    guardar('simo-origen', JSON.stringify({
      origen: qs.get('utm_source') || '',
      campana: qs.get('utm_campaign') || '',
      anuncio: qs.get('utm_content') || ''
    }), sessionStorage);
  }
  window.simoOrigen = function () {
    try { return JSON.parse(leer('simo-origen', sessionStorage)) || {}; } catch { return {}; }
  };

  /* ---- Umami: eventos propios (no usa cookies) ---- */
  window.simoUmami = function (evento, datos) {
    try { if (window.umami) window.umami.track(evento, datos); } catch { /* sin estadísticas */ }
  };

  /* ---- Píxel de Meta ---- */
  function cargarPixel() {
    if (window.fbq) return;
    /* Código base oficial del píxel de Meta */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
    cola.splice(0).forEach(([evento, datos, opciones]) => window.fbq('track', evento, datos, opciones));
  }

  /* simoTrack('Purchase', {...}): si aún no hay consentimiento, el evento espera en la cola
     y solo se envía si la persona acepta en esta misma página. */
  window.simoTrack = function (evento, datos = {}, opciones = {}) {
    if (window.fbq) window.fbq('track', evento, datos, opciones);
    else cola.push([evento, datos, opciones]);
  };

  /* Compra pagada: se avisa una sola vez por pago (telas.html y exito.html pueden verse varias veces). */
  window.simoCompra = function (id, d) {
    if (!id || !d || d.estado !== 'paid') return;
    const marca = 'simo-compra-' + id;
    if (leer(marca)) return;
    guardar(marca, '1');
    const modalidad = d.modalidad || '';
    const importe = Number(d.importe) || 0;
    window.simoUmami('Compra', { modalidad, personas: d.personas || 0, importe });
    window.simoTrack('Purchase', {
      value: importe, currency: 'EUR', num_items: d.personas || 1,
      content_name: d.taller || modalidad, content_ids: [modalidad], content_type: 'product'
    }, { eventID: id });
  };

  /* ---- Aviso de cookies ---- */
  const BTN = 'flex:1;height:44px;border:2px solid #F6F5F3;font:600 12px Poppins,system-ui,sans-serif;text-transform:uppercase;letter-spacing:1px;border-radius:6px;cursor:pointer';
  function mostrarAviso() {
    if (document.getElementById('cookie-banner')) return;
    const el = document.createElement('aside');
    el.id = 'cookie-banner';
    el.setAttribute('aria-label', 'Cookies');
    el.style.cssText = 'position:fixed;right:16px;bottom:16px;left:auto;width:min(336px,calc(100vw - 32px));box-sizing:border-box;z-index:900;background:#0B0B0C;color:#F6F5F3;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,.3);border-radius:6px;font-family:Poppins,system-ui,sans-serif;font-size:13px;line-height:1.5;text-align:left';
    el.innerHTML = `
      <p style="margin:0">Usamos cookies de Meta (Instagram y Facebook) para saber qué anuncios traen reservas y mostrar los talleres a quien le puedan interesar. Solo se activan si las aceptas. <a href="index.html#cookies" style="text-decoration:underline;color:inherit">Política de cookies</a></p>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button type="button" data-consent="no" style="${BTN};background:transparent;color:#F6F5F3">Rechazar</button>
        <button type="button" data-consent="si" style="${BTN};background:#F6F5F3;color:#0B0B0C">Aceptar</button>
      </div>`;
    el.querySelectorAll('[data-consent]').forEach(b => b.addEventListener('click', () => {
      const v = b.dataset.consent;
      guardar(KEY, v);
      el.remove();
      if (v === 'si') cargarPixel();
      else if (window.fbq) { window.fbq('consent', 'revoke'); location.reload(); }
    }));
    document.body.append(el);
  }

  function init() {
    document.querySelectorAll('[data-cookies]').forEach(a => {
      a.style.cursor = 'pointer';
      a.addEventListener('click', e => { e.preventDefault(); mostrarAviso(); });
    });
    const c = leer(KEY);
    if (c === 'si') cargarPixel();
    else if (c !== 'no') mostrarAviso();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
